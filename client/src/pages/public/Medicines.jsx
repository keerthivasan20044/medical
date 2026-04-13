import { useState, useMemo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Search, Sliders, LayoutGrid, List, ChevronRight, X, 
  Pill, Loader2, ArrowUpDown, ChevronDown, CheckCircle2, 
  Store, ShoppingBag, FileText, AlertCircle, Info, Database
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { pharmacies } from '../../utils/data.js';
import { medicineService } from '../../services/apiServices';
import { addItem } from '../../store/cartSlice.js';
import MedicineCard from '../../components/medicine/MedicineCard.jsx';

export default function MedicinesListPage() {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  // Advanced Filter States
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedPharmacies, setSelectedPharmacies] = useState([]);
  const [priceRange, setPriceRange] = useState(2500);
  const [rxFilter, setRxFilter] = useState('Both'); // Yes, No, Both
  const [availability, setAvailability] = useState('All'); // In Stock, All
  const [sortBy, setSortBy] = useState('Most Popular');
  
  const { items: cartItems } = useSelector(state => state.cart);
  const dispatch = useDispatch();

  const handleAddToCart = (item) => {
    dispatch(addItem({
      id: item._id || item.id,
      name: item.name,
      price: item.price,
      image: item.images?.[0] || '/assets/medicine_default.png',
      brand: item.brand,
      qty: 1
    }));
    toast.success(`${item.name} added to payload`);
  };

  useEffect(() => {
    fetchMedicines();
  }, [searchQuery]);

  const fetchMedicines = async () => {
    try {
      setLoading(true);
      const params = {};
      if (searchQuery) params.q = searchQuery;
      const data = await medicineService.getAll(params);
      setMedicines(data.items || []);
    } catch (err) {
      console.error('Inventory sync failure:', err);
    } finally {
      setLoading(false);
    }
  };

  const categories = useMemo(() => {
    const counts = {};
    medicines.forEach(m => {
      counts[m.category] = (counts[m.category] || 0) + 1;
    });
    return Object.keys(counts).map(cat => ({ name: cat, count: counts[cat] }));
  }, [medicines]);

  const pharmacyOptions = pharmacies.map(p => ({ id: p._id || p.id, name: p.name }));

  const filteredMedicines = useMemo(() => {
    let result = medicines.filter(m => {
      const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           (m.brand && m.brand.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(m.category);
      const matchesPharmacy = selectedPharmacies.length === 0 || selectedPharmacies.includes(m.pharmacy?._id || m.pharmacy);
      const matchesPrice = m.price <= priceRange;
      const matchesRx = rxFilter === 'Both' || (rxFilter === 'Yes' ? m.requiresPrescription : !m.requiresPrescription);
      const matchesStock = availability === 'All' || m.stockCount > 0;
      
      return matchesSearch && matchesCategory && matchesPharmacy && matchesPrice && matchesRx && matchesStock;
    });

    if (sortBy === 'Price ↑') result.sort((a, b) => a.price - b.price);
    if (sortBy === 'Price ↓') result.sort((a, b) => b.price - a.price);
    if (sortBy === 'Rating') result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    if (sortBy === 'Most Popular') result.sort((a, b) => (b.soldCount || 0) - (a.soldCount || 0));
    
    return result;
  }, [medicines, searchQuery, selectedCategories, selectedPharmacies, priceRange, rxFilter, availability, sortBy]);

  const toggleCategory = (cat) => {
    setSelectedCategories(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const togglePharmacy = (id) => {
    setSelectedPharmacies(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const resetFilters = () => {
    setSelectedCategories([]);
    setSelectedPharmacies([]);
    setPriceRange(2500);
    setRxFilter('Both');
    setAvailability('All');
    setSortBy('Most Popular');
  };

  const FilterPanel = ({ isMobile = false }) => (
    <div className={`space-y-10 ${isMobile ? 'p-8 pb-32' : ''}`}>
       <div className="space-y-2">
          <div className="text-[10px] font-black text-brand-teal uppercase tracking-[0.4em] italic leading-none">Matrix Config</div>
          <h3 className="font-syne font-black text-2xl md:text-3xl uppercase italic tracking-tighter text-[#0a1628]">Filter Nodes</h3>
       </div>

       {/* Category Cluster */}
       <div className="space-y-6 pt-8 border-t border-black/[0.03]">
          <div className="text-[9px] font-black uppercase text-gray-300 italic tracking-widest">Therapeutic Category</div>
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
             <span className="text-brand-teal font-syne font-black italic text-sm">₹{priceRange}</span>
          </div>
          <input 
            type="range" min="0" max="2500" step="50" 
            className="w-full h-1 bg-gray-100 rounded-full appearance-none accent-brand-teal cursor-pointer"
            value={priceRange}
            onChange={(e) => setPriceRange(parseInt(e.target.value))}
          />
       </div>

       {/* Pharmacy Nodes */}
       <div className="space-y-6 pt-8 border-t border-black/[0.03]">
          <div className="text-[9px] font-black uppercase text-gray-300 italic tracking-widest">Pharmacy Enclaves</div>
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

       {/* RX Type */}
       <div className="space-y-4 pt-8 border-t border-black/[0.03]">
          <div className="text-[9px] font-black uppercase text-gray-300 italic tracking-widest">Protocol Type (RX)</div>
          <div className="grid grid-cols-3 gap-2">
             {['Yes', 'No', 'Both'].map(opt => (
               <button
                 key={opt}
                 onClick={() => setRxFilter(opt)}
                 className={`h-12 rounded-xl text-[9px] font-black uppercase italic tracking-widest border transition-all ${rxFilter === opt ? 'bg-[#0a1628] text-brand-teal border-[#0a1628] shadow-lg' : 'bg-gray-50 text-gray-300 border-black/[0.03] hover:text-[#0a1628]'}`}
               >
                  {opt}
               </button>
             ))}
          </div>
       </div>

       <button 
         onClick={resetFilters}
         className="w-full h-14 bg-gray-50 border border-black/[0.02] rounded-xl text-[10px] font-black text-gray-400 uppercase italic hover:bg-[#0a1628] hover:text-white transition-all shadow-inner"
       >
          RESET HUB MAPPING
       </button>
    </div>
  );

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-64">
      {/* Hero Section */}
      <section className="bg-[#0a1628] pt-24 pb-40 md:pt-32 md:pb-60 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-5" />
        <div className="absolute top-0 right-0 h-full w-1/3 bg-brand-teal/5 blur-[120px]" />
        
        <div className="max-w-7xl mx-auto px-6 md:px-10 relative z-10 space-y-10">
           <div className="flex items-center gap-4 text-[9px] md:text-[10px] font-black text-white/40 uppercase tracking-[0.4em] italic mb-6">
              <span>Home</span> <ChevronRight size={14} className="opacity-40" /> <span>Medicines</span>
           </div>
           
           <div className="space-y-6 text-center md:text-left">
              <h1 className="font-syne font-black text-5xl md:text-8xl lg:text-9xl text-white leading-[0.85] tracking-tighter uppercase italic shadow-2xl">
                 Clinical <br/><span className="text-brand-teal">Registry Node</span>
              </h1>
              <div className="flex flex-col lg:flex-row gap-8 items-center justify-between pt-10">
                 <p className="text-white/40 font-dm text-lg md:text-2xl italic max-w-xl leading-relaxed font-bold">
                    Accessing 12,500+ SKU nodes within the Karaikal district clinical enclave.
                 </p>
                 <Link to="/medicines/compare">
                    <button className="h-16 md:h-20 px-8 md:px-12 bg-white/5 border border-white/10 text-white font-syne font-black text-[10px] uppercase italic tracking-[0.2em] rounded-2xl hover:bg-brand-teal hover:text-[#0a1628] transition-all duration-700 flex items-center gap-4 active:scale-95 shadow-4xl group">
                       <ArrowUpDown size={20} className="group-hover:rotate-180 transition-transform duration-700"/> Compare Protocols
                    </button>
                 </Link>
              </div>
           </div>

           {/* Functional Bar */}
           <div className="flex flex-col lg:flex-row gap-6 md:gap-8 items-stretch pt-12 md:pt-20">
              <div className="flex-1 h-20 md:h-24 bg-white/5 backdrop-blur-3xl rounded-[2rem] md:rounded-[2.5rem] shadow-4xl flex items-center px-6 md:px-10 border border-white/10 focus-within:border-brand-teal transition-all group overflow-hidden">
                 <div className="h-12 w-12 md:h-16 md:w-16 bg-brand-teal rounded-xl md:rounded-2xl flex items-center justify-center text-[#0a1628] shadow-mint group-focus-within:bg-white transition-all duration-700 shrink-0">
                    <Search size={24} className="md:size-7" />
                 </div>
                 <input 
                    type="text" 
                    placeholder="Search clinical registry..." 
                    className="flex-1 bg-transparent px-4 md:px-8 font-syne font-black text-lg md:text-2xl italic outline-none text-white placeholder-white/20 uppercase tracking-tighter"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                 />
              </div>
              
              <div className="flex gap-4">
                 <button 
                   onClick={() => setShowFilters(true)}
                   className={`h-20 md:h-24 px-8 md:px-10 flex-1 lg:flex-none rounded-[2rem] md:rounded-[2.5rem] font-syne font-black text-[10px] md:text-xs uppercase italic tracking-widest transition-all duration-700 active:scale-95 shadow-4xl border flex items-center justify-center gap-4 md:gap-6 bg-white/5 text-white border-white/10 hover:bg-white/10`}
                 >
                    <Sliders size={20}/> Config Hub
                 </button>
              </div>
           </div>
        </div>
      </section>

      {/* Registry Matrix */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 -mt-20 md:-mt-32 relative z-20">
         <div className="flex flex-col lg:flex-row gap-12 md:gap-16">
            
            {/* Desktop Sidebar */}
            <aside className="hidden lg:block w-96 shrink-0">
               <div className="bg-white rounded-[4rem] p-12 text-[#0a1628] shadow-4xl border border-black/[0.02]">
                  <FilterPanel />
               </div>
            </aside>

            {/* Main Terminal Cluster */}
            <div className="flex-1 space-y-12 md:space-y-16">
               <div className="flex flex-col md:flex-row justify-between items-center gap-6 md:gap-8 bg-white border border-black/[0.03] rounded-[2.5rem] md:rounded-[3rem] p-6 md:p-10 shadow-soft transition-all duration-700">
                  <div className="flex items-center gap-4 md:gap-6">
                     <div className="h-2 w-16 bg-brand-teal rounded-full animate-pulse hidden md:block" />
                     <h2 className="font-syne font-black text-xl md:text-4xl text-[#0a1628] uppercase tracking-tighter italic leading-none">
                        {filteredMedicines.length} Nodes Synchronized
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
                        </select>
                        <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-300 group-hover:text-[#0a1628]" />
                     </div>
                  </div>
               </div>

               {loading ? (
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
                        <h3 className="font-syne font-black text-3xl text-[#0a1628] uppercase tracking-tighter italic">Syncing Enclave...</h3>
                        <p className="text-[10px] text-gray-300 font-bold uppercase tracking-[0.4em] italic leading-none animate-pulse">Establishing Clinical Handshake</p>
                     </div>
                  </div>
               ) : (
                 <motion.div 
                   layout
                   className={`grid gap-6 md:gap-10 ${viewMode === 'grid' ? 'grid-cols-2 lg:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}
                 >
                   <AnimatePresence mode="popLayout">
                     {filteredMedicines.map((m, idx) => (
                       <MedicineCard 
                          key={m._id || m.id}
                          item={m} 
                          layout={viewMode} 
                          onAdd={handleAddToCart} 
                          isAdded={cartItems.some(item => item.id === (m._id || m.id))}
                       />
                     ))}
                   </AnimatePresence>

                   {filteredMedicines.length === 0 && (
                     <div className="col-span-full py-40 flex flex-col items-center justify-center text-center space-y-8 bg-white rounded-[4rem] border border-black/[0.03] shadow-soft relative overflow-hidden">
                        <div className="absolute top-0 right-0 h-96 w-96 bg-brand-teal opacity-[0.02] rounded-full blur-[100px] pointer-events-none" />
                        <div className="h-28 w-28 bg-gray-50 rounded-[2.5rem] flex items-center justify-center text-gray-200 border-2 border-dashed border-gray-100 italic transition-transform duration-1000 group-hover:rotate-12">
                           <Pill size={56} strokeWidth={1} />
                        </div>
                        <div className="space-y-4 max-w-sm mx-auto">
                           <h3 className="font-syne font-black text-3xl text-[#0a1628] uppercase italic leading-none tracking-tighter">Payload Not Found</h3>
                           <p className="text-gray-400 font-dm italic font-bold text-lg leading-relaxed">The clinical registry returned zero clinical nodes for your current mapping configuration.</p>
                        </div>
                        <button 
                           onClick={resetFilters}
                           className="h-14 px-10 bg-[#0a1628] text-brand-teal font-syne font-black text-[10px] uppercase italic tracking-[0.2em] rounded-2xl hover:bg-brand-teal hover:text-white transition-all duration-700 shadow-2xl active:scale-95"
                        >
                           Recalibrate Hub
                        </button>
                     </div>
                   )}
                 </motion.div>
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
                  className="fixed inset-x-0 bottom-0 bg-white rounded-t-[3.5rem] z-[3001] shadow-[0_-20px_80px_rgba(0,0,0,0.4)] lg:hidden max-h-[85vh] overflow-y-auto no-scrollbar"
               >
                  <div className="sticky top-0 bg-white p-6 border-b border-black/[0.03] flex items-center justify-between z-10">
                     <div className="h-1.5 w-16 bg-gray-100 rounded-full mx-auto absolute top-3 left-1/2 -translate-x-1/2" />
                     <div className="font-syne font-black text-xl uppercase italic tracking-tighter text-[#0a1628]">Config Hub</div>
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
