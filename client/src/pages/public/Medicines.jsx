import { useState, useMemo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Search, Sliders, LayoutGrid, List, ChevronRight, X, 
  Pill, Loader2, ArrowUpDown, ChevronDown, CheckCircle2, 
  Store, ShoppingBag, FileText, AlertCircle, Info, Database
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useSearchParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { pharmacies } from '../../utils/data.js';
import { medicineService } from '../../services/apiServices';
import { addToCart } from '../../store/cartSlice.js';
import MedicineCard from '../../components/medicine/MedicineCard';
import Pagination from '../../components/common/Pagination';
import useInfiniteScroll from '../../hooks/useInfiniteScroll';

export default function MedicinesListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);

  // Sync state with URL params
  const searchQuery = searchParams.get('q') || '';
  const selectedCategories = useMemo(() => searchParams.getAll('category'), [searchParams]);
  const selectedPharmacies = useMemo(() => searchParams.getAll('pharmacy'), [searchParams]);
  const priceRange = parseInt(searchParams.get('maxPrice')) || 10000;
  const rxFilter = searchParams.get('rx') || 'Both';
  const availability = searchParams.get('stock') || 'All';
  const sortBy = searchParams.get('sort') || 'Most Popular';

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
  const setAvailability = (val) => updateFilters({ stock: val });
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
    dispatch(addToCart({
      id: item._id || item.id,
      name: item.name,
      price: item.price,
      image: item.images?.[0]?.url || item.image || '/assets/medicine_default.png',
      brand: item.brand,
      quantity: 1
    }));
    toast.success(`${item.name} added to cart`);
  };

  useEffect(() => {
    const currentPage = parseInt(searchParams.get('page')) || 1;
    fetchMedicines(currentPage, false);
  }, [searchQuery, selectedCategories, selectedPharmacies, priceRange, rxFilter, availability, sortBy, searchParams]);

  const fetchMedicines = async (pageNum, append = false) => {
    try {
      if (append) setLoadingMore(true);
      else setLoading(true);

      const params = {
        page: pageNum,
        limit: 12,
        q: searchQuery,
        sort: sortBy === 'Price ↑' ? 'price_asc' : sortBy === 'Price ↓' ? 'price_desc' : sortBy === 'Rating' ? 'rating' : 'newest'
      };
      
      if (selectedCategories.length > 0) params.category = selectedCategories[0];
      if (selectedPharmacies.length > 0) params.pharmacyId = selectedPharmacies[0];
      if (priceRange < 10000) params.maxPrice = priceRange;
      if (rxFilter !== 'Both') params.requiresPrescription = rxFilter === 'Yes';
      
      const data = await medicineService.getAll(params);
      
      if (append) {
        setMedicines(prev => [...prev, ...(data.items || [])]);
      } else {
        setMedicines(data.items || []);
      }
      
      setPages(data.pages || 1);
      setPage(data.page || 1);
      setTotal(data.total || 0);
    } catch (err) {
      console.error('Failed to load medicines:', err);
      toast.error('Failed to load medicines. Please try again.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
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
    const defaultCats = ['Tablets', 'Capsules', 'Syrups', 'Injections', 'Creams', 'Vitamins'];
    return defaultCats.map(cat => ({ name: cat, count: 'Live' }));
  }, []);


  const FilterPanel = ({ isMobile = false }) => (
    <div className={`space-y-10 ${isMobile ? 'p-8 pb-32' : ''}`}>
       <div className="space-y-2">
          <div className="text-[10px] font-black text-brand-teal uppercase tracking-[0.4em] italic leading-none">Options</div>
          <h3 className="font-syne font-black text-2xl md:text-3xl uppercase italic tracking-tighter text-[#0a1628]">Filters</h3>
       </div>

       {/* Categories */}
       <div className="space-y-6 pt-8 border-t border-black/[0.03]">
          <div className="text-[9px] font-black uppercase text-gray-300 italic tracking-widest">Category</div>
          <div className="space-y-3 max-h-56 overflow-y-auto pr-4 no-scrollbar">
             {categories.map(cat => (
                <button 
                  key={cat.name} 
                  onClick={() => toggleCategory(cat.name)}
                  className="w-full flex items-center justify-between group cursor-pointer"
                >
                   <div className="flex items-center gap-4">
                      <div className={`h-5 w-5 rounded-lg border-2 transition-all flex items-center justify-center ${selectedCategories.includes(cat.name) ? 'bg-brand-teal border-brand-teal text-[#0a1628]' : 'bg-white border-black/[0.1] text-transparent'}`}>
                         <CheckCircle2 size={10}/>
                      </div>
                      <span className={`font-syne font-black text-[11px] uppercase italic tracking-widest transition-colors ${selectedCategories.includes(cat.name) ? 'text-brand-teal' : 'text-gray-400 group-hover:text-[#0a1628]'}`}>{cat.name}</span>
                   </div>
                   <span className="text-[9px] font-black text-gray-200 font-syne">{cat.count}</span>
                </button>
             ))}
          </div>
       </div>

       {/* Price Slider */}
       <div className="space-y-6 pt-8 border-t border-black/[0.03]">
          <div className="flex justify-between items-center">
             <span className="text-[9px] font-black uppercase text-gray-300 italic tracking-widest">Price Limit</span>
             <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-gray-400">₹</span>
                <input 
                  type="number"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Math.min(2500, Math.max(0, parseInt(e.target.value) || 0)))}
                  className="w-16 bg-gray-50 border-none text-brand-teal font-syne font-black italic text-sm outline-none p-0 focus:ring-0"
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
            <div className="flex justify-between text-[10px] font-black text-gray-300 uppercase italic">
               <span>₹0</span>
               <span>₹2500</span>
            </div>
          </div>
       </div>

       {/* Pharmacy Filters */}
       <div className="space-y-6 pt-8 border-t border-black/[0.03]">
          <div className="text-[9px] font-black uppercase text-gray-300 italic tracking-widest">Available at Pharmacies</div>
          <div className="space-y-3 max-h-56 overflow-y-auto pr-4 no-scrollbar">
             {pharmacyOptions.map(p => (
                <button 
                  key={p.id} 
                  onClick={() => togglePharmacy(p.id)}
                  className="w-full flex items-center justify-between group cursor-pointer"
                >
                   <div className="flex items-center gap-4">
                      <div className={`h-5 w-5 rounded-lg border-2 transition-all flex items-center justify-center ${selectedPharmacies.includes(p.id) ? 'bg-[#0a1628] border-[#0a1628] text-brand-teal' : 'bg-white border-black/[0.1] text-transparent'}`}>
                         <CheckCircle2 size={10}/>
                      </div>
                      <span className={`font-syne font-black text-[11px] uppercase italic tracking-widest transition-colors ${selectedPharmacies.includes(p.id) ? 'text-[#0a1628]' : 'text-gray-400 group-hover:text-[#0a1628]'}`}>{p.name}</span>
                   </div>
                </button>
             ))}
          </div>
       </div>

       {/* Stock Status */}
       <div className="space-y-4 pt-8 border-t border-black/[0.03]">
          <div className="text-[9px] font-black uppercase text-gray-300 italic tracking-widest">Availability</div>
          <button 
             onClick={() => setAvailability(availability === 'In Stock' ? 'All' : 'In Stock')}
             className="w-full flex items-center justify-between group"
          >
             <span className="font-syne font-black text-[11px] uppercase italic tracking-widest text-[#0a1628]">In Stock Only</span>
             <div className={`h-8 w-8 rounded-xl border-2 flex items-center justify-center transition-all ${availability === 'In Stock' ? 'bg-brand-teal border-brand-teal text-[#0a1628]' : 'border-black/[0.05] text-transparent'}`}>
                <CheckCircle2 size={16}/>
             </div>
          </button>
       </div>

       {/* RX Type */}

       <button 
         onClick={resetFilters}
         className="w-full h-14 bg-gray-50 border border-black/[0.02] rounded-xl text-[10px] font-black text-gray-400 uppercase italic hover:bg-[#0a1628] hover:text-white transition-all shadow-inner"
       >
          RESET FILTERS
       </button>
    </div>
  );

  return (
    <div className="bg-slate-50 min-h-screen pb-20 md:pb-6">
      {/* Search & Categories Bar */}
      <div className="sticky top-14 md:top-16 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm py-2 px-3 md:px-10">
         <div className="max-w-7xl mx-auto flex flex-col gap-2">
            <div className="flex items-center gap-2">
               <div className="flex-1 flex items-center bg-slate-100 rounded-xl px-3 py-2.5 gap-2 border border-slate-200">
                  <Search size={16} className="text-teal-600" />
                  <input 
                    type="text" 
                    placeholder="Search name or brand..." 
                    className="bg-transparent border-none outline-none text-sm font-semibold text-slate-900 w-full placeholder:text-slate-400"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
               </div>
               <button 
                 onClick={() => setShowFilters(true)}
                 className="h-10 w-10 bg-slate-900 text-teal-400 rounded-xl flex items-center justify-center shadow-md active:scale-95"
               >
                 <Sliders size={18} />
               </button>
            </div>
            
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth pb-1">
               {categories.map(cat => (
                 <button 
                   key={cat.name} 
                   onClick={() => toggleCategory(cat.name)}
                   className={`h-8 px-4 rounded-full font-bold text-[10px] uppercase tracking-widest transition-all flex items-center gap-2 shrink-0 border ${
                     selectedCategories.includes(cat.name) 
                       ? 'bg-slate-900 text-teal-400 border-slate-900 shadow-sm' 
                       : 'bg-white text-slate-400 border-slate-200'
                   }`}
                 >
                   <span className="whitespace-nowrap">{cat.name}</span>
                   <span className="opacity-40 text-[8px]">{cat.count}</span>
                 </button>
               ))}
            </div>
         </div>
      </div>

      {/* Medicines List Section */}
      <div className="max-w-7xl mx-auto px-3 md:px-10 py-6 md:py-12 relative z-20">
         <div className="flex flex-col lg:flex-row gap-12 md:gap-16">
            
            {/* Desktop Sidebar */}
            <aside className="hidden lg:block w-72 shrink-0">
               <div className="sticky top-10 bg-white rounded-[3rem] p-10 text-[#0a1628] shadow-soft border border-black/[0.02]">
                  <FilterPanel />
               </div>
            </aside>
 
            {/* Medicines Grid */}
            <div className="flex-1 space-y-12 md:space-y-16">
               <div className="flex flex-col md:flex-row justify-between items-center gap-6 md:gap-8 bg-white border border-black/[0.03] rounded-[2.5rem] md:rounded-[3rem] p-6 md:p-10 shadow-soft transition-all duration-700">
                  <div className="flex items-center gap-4 md:gap-6">
                     <div className="h-2 w-16 bg-brand-teal rounded-full animate-pulse hidden md:block" />
                      <h2 className="text-base font-bold text-slate-900 uppercase tracking-tight">
                         {total} Medicines Found
                      </h2>
                  </div>
                  
                  <div className="flex items-center gap-6 self-end md:self-auto">
                     <div className="flex bg-gray-50 p-1.5 rounded-2xl border border-black/[0.01]">
                        {[
                           { id: 'grid', icon: LayoutGrid },
                           { id: 'list', icon: List }
                        ].map(mode => (
                           <button
                             key={mode.id}
                             onClick={() => setViewMode(mode.id)}
                             className={`h-11 w-11 rounded-xl flex items-center justify-center transition-all duration-700 active:scale-95 ${viewMode === mode.id ? 'bg-[#0a1628] text-brand-teal shadow-2xl' : 'text-gray-300 hover:text-[#0a1628]'}`}
                           >
                              <mode.icon size={19}/>
                           </button>
                        ))}
                     </div>
                     
                     <div className="relative group hidden md:block">
                        <select 
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value)}
                          className="h-16 pl-8 pr-12 bg-gray-50 border border-black/[0.02] rounded-2xl font-syne font-black text-[10px] uppercase italic tracking-widest outline-none appearance-none cursor-pointer hover:bg-white transition-all shadow-sm"
                        >
                            <option>Most Popular</option>
                            <option>Price ↑</option>
                            <option>Price ↓</option>
                            <option>Rating</option>
                            <option>New arrivals</option>
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
                        <h3 className="font-syne font-black text-3xl text-[#0a1628] uppercase tracking-tighter italic">Loading Medicines...</h3>
                        <p className="text-[10px] text-gray-300 font-bold uppercase tracking-[0.4em] italic leading-none animate-pulse">Connecting...</p>
                     </div>
                  </div>
               ) : (
                  <div className="space-y-8">
                    <motion.div 
                      layout
                      className={`grid gap-3 md:gap-8 px-3 md:px-0 ${viewMode === 'grid' ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5' : 'grid-cols-1'}`}
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
                              <h3 className="font-syne font-black text-3xl text-[#0a1628] uppercase italic leading-none tracking-tighter">No Medicines Found</h3>
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
