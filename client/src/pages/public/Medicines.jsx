import { useState, useMemo, useEffect, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useSelector, useDispatch } from 'react-redux';
import {
  Search, Sliders, LayoutGrid, List, X,
  Pill, Loader2, ChevronDown, CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { medicineService, pharmacyService } from '../../services/apiServices';
import { addToCart } from '../../store/cartSlice.js';
import MedicineCard from '../../components/medicine/MedicineCard';
import Pagination from '../../components/common/Pagination';
import useInfiniteScroll from '../../hooks/useInfiniteScroll';
import { getMedicineImage } from '../../utils/medicineImages';

function uniqueMedicines(items) {
  const ids = new Set();
  return items.filter((item) => {
    const id = item?._id || item?.id;
    if (!id) return true;
    if (ids.has(id)) return false;
    ids.add(id);
    return true;
  });
}

export default function MedicinesListPage() {
  const { t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [pharmacyOptions, setPharmacyOptions] = useState([]);
  const searchParamString = searchParams.toString();
  const latestQueryRef = useRef(searchParamString);
  const appendInFlightRef = useRef(false);
  latestQueryRef.current = searchParamString;

  // Update state with URL params
  const searchQuery = searchParams.get('q') || '';
  const selectedCategories = useMemo(() => searchParams.getAll('category'), [searchParamString]);
  const selectedPharmacies = useMemo(() => searchParams.getAll('pharmacy'), [searchParamString]);
  const priceRange = parseInt(searchParams.get('maxPrice')) || 10000;
  const rxFilter = searchParams.get('rx') || 'Both';
  const availability = searchParams.get('stock') || 'All';
  const sortBy = searchParams.get('sort') || 'newest';

  const updateFilters = (updates) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === undefined || value === '' || (Array.isArray(value) && value.length === 0)) {
        newParams.delete(key);
      } else if (Array.isArray(value)) {
        newParams.delete(key);
        value.forEach(v => newParams.append(key, v));
      } else {
        newParams.set(key, value);
      }
    });
    // Reset to page 1 when filters change
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const setSearchQuery = (val) => updateFilters({ q: val });
  const setPriceRange = (val) => updateFilters({ maxPrice: val });
  const setRxFilter = (val) => updateFilters({ rx: val });
  const setStock = (val) => updateFilters({ stock: val });
  const setSortBy = (val) => updateFilters({ sort: val });

  const toggleCategory = (cat) => {
    const next = selectedCategories.includes(cat) 
      ? selectedCategories.filter(c => c !== cat) 
      : [...selectedCategories, cat];
    updateFilters({ category: next });
  };

  const togglePharmacy = (id) => {
    const next = selectedPharmacies.includes(id) 
      ? selectedPharmacies.filter(p => p !== id) 
      : [...selectedPharmacies, id];
    updateFilters({ pharmacy: next });
  };

  const resetFilters = () => {
    setSearchParams({});
  };

  const { items: cartItems } = useSelector(state => state.cart);
  const dispatch = useDispatch();

  const handleAddToCart = (item) => {
    const pharmacyId = item.pharmacyId?._id || item.pharmacyId || item.pharmacy?._id || item.pharmacy;
    dispatch(addToCart({
      id: item._id || item.id,
      name: item.name,
      price: item.price,
      image: getMedicineImage(item),
      brand: item.brand,
      category: item.category,
      requiresRx: item.requiresPrescription || item.requiresRx,
      pharmacyId,
      quantity: 1
    }));
    toast.success(`${item.name} added to cart`);
  };

  useEffect(() => {
    const currentPage = parseInt(searchParams.get('page')) || 1;
    fetchMedicines(currentPage, false);
  }, [searchParamString]);

  useEffect(() => {
    let active = true;

    const fetchPharmacies = async () => {
      try {
        const data = await pharmacyService.getAll();
        if (active) setPharmacyOptions(data.items || data || []);
      } catch (err) {
        if (active) setPharmacyOptions([]);
      }
    };

    fetchPharmacies();
    return () => {
      active = false;
    };
  }, []);

  const fetchMedicines = async (pageNum, append = false) => {
    const requestQuery = searchParamString;

    if (append && appendInFlightRef.current) return;

    try {
      if (append) {
        appendInFlightRef.current = true;
        setLoadingMore(true);
      }
      else setLoading(true);

      const params = {
        page: pageNum,
        limit: 12,
        q: searchQuery,
        sort: sortBy === `${t('priceLabel')} ↑` ? 'price_asc' : sortBy === `${t('priceLabel')} ↓` ? 'price_desc' : sortBy === t('rating') ? 'rating' : 'newest'
      };
      
      params.sort = sortBy;
      if (selectedCategories.length > 0) params.category = selectedCategories.join(',');
      if (selectedPharmacies.length > 0) params.pharmacyId = selectedPharmacies.join(',');
      if (priceRange < 10000) params.maxPrice = priceRange;
      if (rxFilter !== 'Both') params.requiresPrescription = rxFilter === 'Yes';
      if (availability === 'In Stock') params.stock = availability;
      
      const data = await medicineService.getAll(params);
      if (requestQuery !== latestQueryRef.current) return;
      const nextItems = uniqueMedicines(data.items || []);
      
      if (append) {
        setMedicines(prev => uniqueMedicines([...prev, ...nextItems]));
      } else {
        setMedicines(nextItems);
      }
      
      setPages(data.pages || 1);
      setPage(data.page || 1);
      setTotal(data.total || 0);
    } catch (err) {
      console.error('Failed to load medicines:', err);
      toast.error('Failed to load medicines. Please try again.');
    } finally {
      if (append) appendInFlightRef.current = false;
      if (requestQuery === latestQueryRef.current) {
        setLoading(false);
        setLoadingMore(false);
      }
    }
  };

  const handlePageChange = (pageNum) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', pageNum.toString());
    setSearchParams(newParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoadMore = () => {
    if (page < pages && !loadingMore) {
      fetchMedicines(page + 1, true);
    }
  };

  const observerTarget = useInfiniteScroll(handleLoadMore, page < pages, loading || loadingMore);

  // Mock categories from items for now, ideally backend provides this
  const categories = useMemo(() => {
    const fallbackCats = [
      'Fever & Pain',
      'Antibiotics',
      'Allergy',
      'Digestive Care',
      'Cough & Cold',
      'Heart',
      'Diabetes',
      'Respiratory',
      'Wellness',
      'Nutrition',
      'Skin Care',
      'Eye Care',
      'Ear Care',
      'First Aid',
      'Devices',
      'Baby Care',
      'Women Care',
      'Hygiene',
      'Ayurvedic'
    ];
    const merged = [...new Set([...fallbackCats, ...medicines.map((item) => item.category).filter(Boolean)])];
    return merged.map((cat) => ({
      name: cat
    }));
  }, [medicines]);


  const FilterPanel = ({ isMobile = false }) => {
    return (
      <div className={`space-y-6 ${isMobile ? 'p-6 pb-28' : ''}`}>
         <div className="space-y-2">
            <div className="text-[10px] font-black text-brand-teal uppercase tracking-[0.16em] leading-none">Filters</div>
            <h3 className="font-syne font-black text-xl uppercase tracking-tight text-[#0a1628]">Find Medicines</h3>
         </div>
  
         {/* Categories */}
         <div className="space-y-4 pt-6 border-t border-black/[0.03]">
            <div className="text-[9px] font-black uppercase text-gray-400 tracking-widest">Category</div>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-2 no-scrollbar">
               {categories.map(cat => (
                  <button 
                    key={cat.name} 
                    onClick={() => toggleCategory(cat.name)}
                    className="w-full flex items-center gap-3 group cursor-pointer text-left"
                  >
                     <div className="flex items-center gap-3 min-w-0">
                        <div className={`h-5 w-5 rounded-lg border-2 transition-all flex items-center justify-center ${selectedCategories.includes(cat.name) ? 'bg-brand-teal border-brand-teal text-[#0a1628]' : 'bg-white border-black/[0.1] text-transparent'}`}>
                           <CheckCircle2 size={10}/>
                        </div>
                        <span className={`font-syne font-black text-[11px] uppercase transition-colors leading-snug tracking-normal ${selectedCategories.includes(cat.name) ? 'text-brand-teal' : 'text-gray-500 group-hover:text-[#0a1628]'}`}>{cat.name}</span>
                     </div>
                  </button>
               ))}
            </div>
         </div>
  
         {/* Price Slider */}
         <div className="space-y-4 pt-6 border-t border-black/[0.03]">
            <div className="flex justify-between items-center">
               <span className="text-[9px] font-black uppercase text-gray-400 tracking-widest">{t('priceLabel')}</span>
               <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-gray-400">₹</span>
                  <input 
                    type="number"
                    value={priceRange}
                    onChange={(e) => setPriceRange(Math.min(2500, Math.max(0, parseInt(e.target.value) || 0)))}
                    className="w-16 bg-gray-50 border-none text-brand-teal font-syne font-black text-sm outline-none p-0 focus:ring-0"
                  />
               </div>
            </div>
            <div className="space-y-3">
              <input 
                type="range" min="0" max="2500" step="50" 
                className="w-full h-1 bg-gray-100 rounded-full appearance-none accent-brand-teal cursor-pointer"
                value={priceRange}
                onChange={(e) => setPriceRange(parseInt(e.target.value))}
              />
              <div className="flex justify-between text-[10px] font-black text-gray-400 uppercase">
                 <span>₹0</span>
                 <span>₹2500</span>
              </div>
            </div>
         </div>
  
         {/* Pharmacy Filters */}
         <div className="space-y-4 pt-6 border-t border-black/[0.03]">
            <div className="text-[9px] font-black uppercase text-gray-400 tracking-widest">Pharmacy</div>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-2 no-scrollbar">
               {pharmacyOptions.map(p => (
                  <button 
                    key={p.id || p._id} 
                    onClick={() => togglePharmacy(p.id || p._id)}
                    className="w-full flex items-center gap-3 group cursor-pointer text-left"
                  >
                     <div className="flex items-center gap-3 min-w-0">
                        <div className={`h-5 w-5 rounded-lg border-2 transition-all flex items-center justify-center ${selectedPharmacies.includes(p.id || p._id) ? 'bg-[#0a1628] border-[#0a1628] text-brand-teal' : 'bg-white border-black/[0.1] text-transparent'}`}>
                           <CheckCircle2 size={10}/>
                        </div>
                        <span className={`font-syne font-black text-[11px] uppercase transition-colors leading-snug tracking-normal ${selectedPharmacies.includes(p.id || p._id) ? 'text-[#0a1628]' : 'text-gray-500 group-hover:text-[#0a1628]'}`}>{p.name}</span>
                     </div>
                  </button>
               ))}
            </div>
         </div>

       {/* Stock Status */}
       <div className="space-y-4 pt-6 border-t border-black/[0.03]">
          <div className="text-[9px] font-black uppercase text-gray-400 tracking-widest">{t('statusLabel')}</div>
          <button 
             onClick={() => setStock(availability === 'In Stock' ? 'All' : 'In Stock')}
             className="w-full flex items-center justify-between group"
          >
             <span className="font-syne font-black text-[11px] uppercase tracking-widest text-[#0a1628]">{t('availableNow')}</span>
             <div className={`h-8 w-8 rounded-xl border-2 flex items-center justify-center transition-all ${availability === 'In Stock' ? 'bg-brand-teal border-brand-teal text-[#0a1628]' : 'border-black/[0.05] text-transparent'}`}>
                <CheckCircle2 size={16}/>
             </div>
          </button>
       </div>

       {/* RX Type */}

       <button 
         onClick={resetFilters}
         className="w-full h-12 bg-gray-50 border border-black/[0.04] rounded-xl text-[10px] font-black text-gray-500 uppercase hover:bg-[#0a1628] hover:text-white transition-all shadow-inner"
       >
          {t('resetSearch').toUpperCase()}
       </button>
    </div>
  );
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-24 md:pb-8">
      {/* Search & Categories Bar */}
      <div className="relative z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm px-4 py-3 md:z-20 md:px-6 lg:px-8">
         <div className="max-w-[1440px] mx-auto flex flex-col gap-3">
            <div className="flex items-center gap-2">
               <div className="flex-1 flex items-center bg-slate-100 rounded-2xl px-4 h-12 gap-2 border border-slate-200 min-w-0">
                  <Search size={16} className="text-teal-600" />
                  <input 
                    type="text" 
                    placeholder={t('searchPlaceholder')} 
                    className="bg-transparent border-none outline-none text-sm font-semibold text-slate-900 w-full placeholder:text-slate-400"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
               </div>
               <button 
                 onClick={() => setShowFilters(true)}
                 className="h-12 w-12 bg-slate-900 text-teal-400 rounded-2xl flex items-center justify-center shadow-md active:scale-95 shrink-0"
                 aria-label="Open filters"
               >
                 <Sliders size={18} />
               </button>
            </div>
            
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth pb-1">
               {categories.map(cat => (
                 <button 
                   key={cat.name} 
                   onClick={() => toggleCategory(cat.name)}
                   className={`h-9 px-4 rounded-full font-bold text-[10px] uppercase tracking-[0.08em] transition-all flex items-center gap-2 shrink-0 border ${
                     selectedCategories.includes(cat.name) 
                       ? 'bg-slate-900 text-teal-400 border-slate-900 shadow-sm' 
                       : 'bg-white text-slate-400 border-slate-200'
                   }`}
                 >
                   <span className="whitespace-nowrap">{cat.name}</span>
                 </button>
               ))}
            </div>
         </div>
      </div>

      {/* Medicines List Section */}
      <div className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-8 pt-7 pb-5 md:pt-8 md:pb-7 relative z-20">
         <div className="grid grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)] xl:grid-cols-[280px_minmax(0,1fr)] gap-5 xl:gap-7">
            
            {/* Desktop Sidebar */}
            <aside className="hidden lg:block min-w-0">
               <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto bg-white rounded-2xl p-5 text-[#0a1628] shadow-sm border border-slate-100 no-scrollbar">
                  <FilterPanel />
               </div>
            </aside>
 
            {/* Medicines Grid */}
            <div className="flex-1 min-w-0 space-y-6 md:space-y-8">
               <div className="flex items-center justify-between gap-3 bg-white border border-slate-100 rounded-2xl px-4 py-4 md:px-6 md:py-5 shadow-sm transition-all duration-300">
                  <div className="flex items-center gap-3 md:gap-4 min-w-0">
                     <div className="h-2 w-12 bg-brand-teal rounded-full animate-pulse hidden md:block shrink-0" />
                     <div className="min-w-0">
                        <h2 className="text-sm leading-snug md:text-xl font-black text-slate-900 uppercase">
                           {total} medicines<span className="hidden sm:inline"> available</span>
                        </h2>
                        <p className="mt-0.5 text-[10px] font-bold text-slate-400 uppercase tracking-[0.12em] hidden sm:block">
                           Updated from active pharmacy stock
                        </p>
                     </div>
                  </div>
                  
                  <div className="flex items-center gap-3 shrink-0">
                     <div className="flex bg-slate-50 p-1 rounded-2xl border border-slate-100">
                        {[
                           { id: 'grid', icon: LayoutGrid },
                           { id: 'list', icon: List }
                        ].map(mode => (
                           <button
                             key={mode.id}
                             onClick={() => setViewMode(mode.id)}
                             className={`h-10 w-10 md:h-11 md:w-11 rounded-xl flex items-center justify-center transition-all duration-300 active:scale-95 ${viewMode === mode.id ? 'bg-[#0a1628] text-brand-teal shadow-lg' : 'text-slate-300 hover:text-[#0a1628]'}`}
                             aria-label={`Switch to ${mode.id} view`}
                           >
                              <mode.icon size={19}/>
                           </button>
                        ))}
                     </div>
                     
                     <div className="relative group hidden md:block">
                        <select 
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value)}
                          className="h-12 w-56 pl-4 pr-10 bg-slate-50 border border-slate-100 rounded-2xl font-syne font-black text-[10px] uppercase tracking-[0.12em] outline-none appearance-none cursor-pointer hover:bg-white transition-all shadow-sm"
                        >
                            <option value="newest">{t('popularMeds')}</option>
                            <option value="price_asc">{t('priceLabel')} Low to High</option>
                            <option value="price_desc">{t('priceLabel')} High to Low</option>
                            <option value="rating">{t('rating')}</option>
                         </select>
                        <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-300 group-hover:text-[#0a1628]" />
                     </div>
                  </div>
               </div>

               {loading && page === 1 ? (
                  <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-12">
                     <div className="relative">
                        <motion.div 
                           animate={{ rotate: 360 }}
                           transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                           className="h-40 w-40 border-[12px] border-black/[0.02] border-t-brand-teal rounded-full"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                           <Loader2 size={48} className="animate-spin text-brand-teal opacity-40" />
                        </div>
                     </div>
                     <div className="space-y-3 text-center">
                        <h3 className="font-syne font-black text-3xl text-[#0a1628] uppercase tracking-tighter italic">{t('loadingStatus')}</h3>
                        <p className="text-[10px] text-gray-300 font-bold uppercase tracking-[0.4em] italic leading-none animate-pulse">Connecting...</p>
                     </div>
                  </div>
               ) : (
                  <div className="space-y-8">
                    <motion.div 
                      layout
                      className={`grid gap-4 md:gap-5 ${viewMode === 'grid' ? 'grid-cols-2 sm:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}
                    >
                     <AnimatePresence mode="popLayout">
                       {medicines.map((m, idx) => (
                         <MedicineCard 
                            key={m._id || m.id}
                            item={m} 
                            layout={viewMode} 
                            onAdd={handleAddToCart} 
                            isAdded={cartItems.some(item => item.id === (m._id || m.id))}
                         />
                       ))}
                     </AnimatePresence>

                     {medicines.length === 0 && (
                        <div className="col-span-full py-40 flex flex-col items-center justify-center text-center space-y-8 bg-white rounded-[4rem] border border-black/[0.03] shadow-soft relative overflow-hidden">
                           <div className="absolute top-0 right-0 h-96 w-96 bg-brand-teal opacity-[0.02] rounded-full blur-[100px] pointer-events-none" />
                           <div className="h-28 w-28 bg-gray-50 rounded-[2.5rem] flex items-center justify-center text-gray-200 border-2 border-dashed border-gray-100 italic">
                              <Pill size={56} strokeWidth={1} />
                           </div>
                           <div className="space-y-4 max-w-sm mx-auto">
                              <h3 className="font-syne font-black text-3xl text-[#0a1628] uppercase italic leading-none tracking-tighter">No {t('medicines')} Found</h3>
                              <p className="text-gray-400 font-dm italic font-bold text-lg leading-relaxed">Try adjusting your filters or searching for something else.</p>
                           </div>
                           <button 
                              onClick={resetFilters}
                              className="h-14 px-10 bg-[#0a1628] text-brand-teal font-syne font-black text-[10px] uppercase italic tracking-[0.2em] rounded-2xl hover:bg-brand-teal hover:text-white transition-all duration-700 shadow-2xl active:scale-95"
                           >
                              Reset All Filters
                           </button>
                        </div>
                     )}
                   </motion.div>

                   {/* Pagination for Desktop */}
                   <div className="hidden md:block">
                     <Pagination 
                       page={page} 
                       pages={pages} 
                       onPageChange={handlePageChange} 
                     />
                   </div>

                   {/* Infinite Scroll Target for Mobile */}
                   <div className="md:hidden py-10 flex justify-center">
                      {loadingMore ? (
                         <Loader2 size={24} className="animate-spin text-brand-teal" />
                      ) : (
                         <div ref={observerTarget} className="h-10 w-full" />
                      )}
                   </div>
                 </div>
               )}
            </div>
         </div>
      </div>

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
         {showFilters && (
            <>
               <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowFilters(false)}
                  className="fixed inset-0 bg-[#0a1628]/80 backdrop-blur-sm z-[3000] lg:hidden"
               />
               <motion.div 
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  exit={{ y: '100%' }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  className="fixed inset-x-0 bottom-0 bg-white rounded-t-3xl z-[3001] shadow-2xl lg:hidden max-h-[85vh] overflow-y-auto no-scrollbar"
               >
                   <div className="sticky top-0 bg-white p-6 border-b border-black/[0.03] flex items-center justify-between z-10">
                      <div className="h-1.5 w-16 bg-gray-100 rounded-full mx-auto absolute top-3 left-1/2 -translate-x-1/2" />
                      <div className="font-syne font-black text-xl uppercase italic tracking-tighter text-[#0a1628]">Sort & Filter</div>
                      <button 
                         onClick={() => setShowFilters(false)}
                         className="h-10 w-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 hover:text-red-500"
                      >
                         <X size={20} />
                      </button>
                   </div>
                   <FilterPanel isMobile />
               </motion.div>
            </>
         )}
      </AnimatePresence>
    </div>
  );
}
