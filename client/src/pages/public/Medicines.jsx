import { useState, useMemo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Search, Filter, Grid, Map, List, ChevronRight, X, Star, Clock, ShoppingBag, Sliders, LayoutGrid, Info, Activity, ShieldCheck, Globe, CheckCircle2, ChevronDown, Store, Pill, FileText, ArrowUpDown, Loader2 } from 'lucide-react';
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
  const [showFilters, setShowFilters] = useState(true);
  
  // Filter States
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedPharmacies, setSelectedPharmacies] = useState([]);
  const [priceRange, setPriceRange] = useState(2000);
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
  }, [searchQuery, selectedCategories]);

  const fetchMedicines = async () => {
    try {
      setLoading(true);
      const params = {};
      if (searchQuery) params.q = searchQuery;
      // We'll handle multiple categories locally for now unless API supports array
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

  const pharmacyOptions = useMemo(() => {
    return pharmacies.map(p => ({ id: p._id || p.id, name: p.name }));
  }, []);

  const filteredMedicines = useMemo(() => {
    let result = medicines.filter(m => {
      const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           (m.brand && m.brand.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(m.category);
      const matchesPharmacy = selectedPharmacies.length === 0 || selectedPharmacies.includes(m.pharmacy?._id || m.pharmacy);
      const matchesPrice = m.price <= priceRange;
      const matchesRx = rxFilter === 'Both' || (rxFilter === 'Yes' ? m.requiresPrescription : !m.requiresPrescription);
      const matchesStock = availability === 'All' || m.qty > 0;
      
      return matchesSearch && matchesCategory && matchesPharmacy && matchesPrice && matchesRx && matchesStock;
    });

    // Sorting
    if (sortBy === 'Price \u2191') result.sort((a, b) => a.price - b.price);
    if (sortBy === 'Price \u2193') result.sort((a, b) => b.price - a.price);
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

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-48">
      {/* Hero Section: Clinical Registry Hub */}
      <section className="bg-[#0a1628] pt-32 pb-60 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(2,195,154,0.1),transparent_50%)]" />
        <div className="absolute top-0 right-0 h-full w-1/3 bg-brand-teal/5 blur-[120px]" />
        
        <div className="max-w-7xl mx-auto px-6 md:px-10 relative z-10 space-y-12">
           <div className="flex items-center gap-4 text-[10px] font-black text-white/40 uppercase tracking-[0.4em] italic mb-8">
              <span>Home</span> <ChevronRight size={14} className="opacity-40" /> <span>Medicines</span>
           </div>
           
           <div className="space-y-6">
              <h1 className="font-syne font-black text-4xl sm:text-6xl lg:text-9xl text-white leading-[0.85] tracking-tighter uppercase italic drop-shadow-2xl">
                 Clinical <br/><span className="text-brand-teal">Registry</span>
              </h1>
              <div className="flex flex-col lg:flex-row gap-12 items-end justify-between pt-10">
                 <p className="text-white/40 font-dm text-2xl italic max-w-xl leading-relaxed">
                    Synchronized access to 12,500+ SKU nodes within the Karaikal district medical enclave.
                 </p>
                 <Link to="/medicines/compare">
                    <button className="h-20 px-12 bg-white/5 border border-white/10 text-white font-syne font-black text-[10px] uppercase italic tracking-[0.3em] rounded-2xl hover:bg-brand-teal hover:text-[#0a1628] transition-all duration-700 flex items-center gap-4 active:scale-95 shadow-4xl group">
                       <ArrowUpDown size={20} className="group-hover:rotate-180 transition-transform duration-700"/> Compare Protocols
                    </button>
                 </Link>
              </div>
           </div>

            {/* Hero Functional Bar */}
            <div className="flex flex-col lg:flex-row gap-6 md:gap-8 items-stretch pt-20">
               <div className="flex-1 h-20 md:h-24 bg-white/5 backdrop-blur-3xl rounded-3xl md:rounded-[2.5rem] shadow-4xl flex items-center px-6 md:px-10 border border-white/10 focus-within:border-brand-teal transition-all group overflow-hidden">
                  <div className="h-10 w-10 md:h-16 md:w-16 bg-brand-teal rounded-xl md:rounded-2xl flex items-center justify-center text-[#0a1628] shadow-mint group-focus-within:bg-white transition-all duration-700 shrink-0">
                     <Search size={20} className="md:w-7 md:h-7" />
                  </div>
                  <input 
                     type="text" 
                     placeholder="Search clinical node..." 
                     className="flex-1 bg-transparent px-4 md:px-8 font-syne font-black text-lg md:text-xl italic outline-none text-white placeholder-white/20 uppercase tracking-tighter"
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                  />
               </div>
               
               <div className="flex gap-4">
                  <button 
                    onClick={() => setShowFilters(!showFilters)}
                    className={`h-20 md:h-24 px-8 md:px-10 rounded-3xl md:rounded-[2.5rem] font-syne font-black text-[10px] md:text-xs uppercase italic tracking-widest transition-all duration-700 active:scale-95 shadow-4xl border flex items-center justify-center gap-4 md:gap-6 ${showFilters ? 'bg-brand-teal text-[#0a1628] border-brand-teal shadow-brand-teal/20' : 'bg-white/5 text-white border-white/10 hover:bg-white/10 hover:border-brand-teal/40'}`}
                  >
                     <Sliders size={20}/> {showFilters ? 'Hide Config' : 'Show Config'}
                  </button>
               </div>
            </div>
        </div>
      </section>

      {/* Registry Matrix */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 -mt-24 md:-mt-32 relative z-20">
         <div className="flex flex-col lg:flex-row gap-10 md:gap-16">
            
            {/* Sidebar Configuration Panel */}
            <AnimatePresence>
              {showFilters && (
                <motion.div 
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="lg:w-96 shrink-0 space-y-12"
                >
                   <div className="bg-white rounded-3xl md:rounded-[4.5rem] p-8 md:p-12 text-[#0a1628] shadow-4xl space-y-10 md:space-y-12 border border-black/[0.03]">
                      <div className="space-y-2">
                         <div className="text-[10px] font-black text-brand-teal uppercase tracking-[0.4em] italic leading-none">Matrix Config</div>
                         <h3 className="font-syne font-black text-2xl md:text-3xl uppercase italic tracking-tighter">Filter Node</h3>
                      </div>
                      
                      {/* Category Cluster */}
                      <div className="space-y-6 pt-10 border-t border-black/[0.03]">
                         <div className="text-[10px] font-black uppercase text-gray-300 italic tracking-widest">Therapeutic Category</div>
                         <div className="space-y-4 max-h-64 overflow-y-auto pr-4 no-scrollbar">
                            {categories.map(cat => (
                               <button 
                                 key={cat.name} 
                                 onClick={() => toggleCategory(cat.name)}
                                 className="w-full flex items-center justify-between group cursor-pointer"
                               >
                                  <div className="flex items-center gap-4">
                                     <div className={`h-6 w-6 rounded-lg border-2 transition-all flex items-center justify-center ${selectedCategories.includes(cat.name) ? 'bg-brand-teal border-brand-teal text-[#0a1628]' : 'bg-white border-black/[0.1] text-transparent'}`}>
                                        <CheckCircle2 size={12}/>
                                     </div>
                                     <span className={`font-syne font-black text-xs uppercase italic tracking-widest transition-colors ${selectedCategories.includes(cat.name) ? 'text-brand-teal' : 'text-gray-400 group-hover:text-[#0a1628]'}`}>{cat.name}</span>
                                  </div>
                                  <span className="text-[10px] font-black text-gray-300 font-syne">{cat.count}</span>
                               </button>
                            ))}
                         </div>
                      </div>

                      {/* Price Range Pulse */}
                      <div className="space-y-6 pt-10 border-t border-black/[0.03]">
                         <div className="flex justify-between items-center">
                            <span className="text-[10px] font-black uppercase text-gray-400 italic tracking-widest">Price Limit</span>
                            <span className="text-brand-teal font-syne font-black italic text-sm">\u20B9{priceRange}</span>
                         </div>
                         <input 
                           type="range" min="0" max="2000" step="10" 
                           className="w-full h-1 bg-gray-100 rounded-full appearance-none accent-brand-teal cursor-pointer"
                           value={priceRange}
                           onChange={(e) => setPriceRange(parseInt(e.target.value))}
                         />
                      </div>

                      {/* Pharmacy Entry Points */}
                      <div className="space-y-6 pt-10 border-t border-black/[0.03]">
                         <div className="text-[10px] font-black uppercase text-gray-400 italic tracking-widest">Target Enclaves</div>
                         <div className="space-y-4 max-h-64 overflow-y-auto pr-4 no-scrollbar">
                            {pharmacyOptions.map(p => (
                               <button 
                                 key={p.id} 
                                 onClick={() => togglePharmacy(p.id)}
                                 className="w-full flex items-center justify-between group cursor-pointer"
                               >
                                  <div className="flex items-center gap-4">
                                     <div className={`h-6 w-6 rounded-lg border-2 transition-all flex items-center justify-center ${selectedPharmacies.includes(p.id) ? 'bg-[#0a1628] border-[#0a1628] text-brand-teal' : 'bg-white border-black/[0.1] text-transparent'}`}>
                                        <CheckCircle2 size={12}/>
                                     </div>
                                     <span className={`font-syne font-black text-xs uppercase italic tracking-widest transition-colors ${selectedPharmacies.includes(p.id) ? 'text-[#0a1628]' : 'text-gray-400 group-hover:text-[#0a1628]'}`}>{p.name}</span>
                                  </div>
                               </button>
                            ))}
                         </div>
                      </div>

                      {/* Prescription Profile */}
                      <div className="space-y-6 pt-10 border-t border-black/[0.03]">
                         <div className="text-[10px] font-black uppercase text-gray-400 italic tracking-widest">Protocol Type (RX)</div>
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
                        onClick={() => { setSelectedCategories([]); setSelectedPharmacies([]); setPriceRange(2000); setRxFilter('Both'); setAvailability('All'); }}
                        className="w-full h-16 bg-gray-50 border border-black/[0.02] rounded-2xl text-[10px] font-black text-gray-400 uppercase italic hover:bg-[#0a1628] hover:text-white transition-all shadow-inner"
                      >
                         RESET ALL HUB PARAMS
                      </button>
                   </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Main Terminal Cluster */}
            <div className="flex-1 space-y-16">
               {loading ? (
                 <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-12">
                    <div className="relative">
                       <motion.div 
                          animate={{ rotate: 360 }}
                          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                          className="h-40 w-40 border-[12px] border-black/[0.03] border-t-brand-teal rounded-full shadow-soft"
                       />
                       <div className="absolute inset-0 flex items-center justify-center text-[#0a1628]">
                          <Loader2 size={48} className="animate-spin text-brand-teal opacity-50" />
                       </div>
                    </div>
                    <div className="space-y-4 text-center">
                       <h3 className="font-syne font-black text-4xl text-[#0a1628] uppercase tracking-tighter italic">Syncing Hub...</h3>
                       <p className="text-[10px] text-gray-300 font-bold uppercase tracking-[0.4em] italic leading-none animate-pulse">Establishing Clinical Enclave Link</p>
                    </div>
                 </div>
               ) : (
                 <>
                   <div className="flex flex-col md:flex-row justify-between items-center gap-6 md:gap-8 bg-white border border-black/[0.03] rounded-3xl md:rounded-[3rem] p-6 md:p-10 shadow-soft transition-all duration-700">
                      <div className="flex items-center gap-4 md:gap-6">
                         <div className="h-1.5 md:h-2 w-12 md:w-16 bg-brand-teal rounded-full animate-pulse" />
                         <h2 className="font-syne font-black text-xl md:text-4xl text-[#0a1628] uppercase tracking-tighter italic leading-none">{filteredMedicines.length} Clinical SKU Nodes Found</h2>
                      </div>
                      
                      <div className="flex items-center gap-6">
                         <div className="flex bg-gray-100 p-2 rounded-2xl border border-black/[0.01]">
                            {[
                               { id: 'grid', icon: LayoutGrid },
                               { id: 'list', icon: List }
                            ].map(mode => (
                               <button
                                 key={mode.id}
                                 onClick={() => setViewMode(mode.id)}
                                 className={`h-12 w-12 rounded-xl flex items-center justify-center transition-all duration-700 active:scale-95 ${viewMode === mode.id ? 'bg-[#0a1628] text-brand-teal shadow-2xl' : 'text-gray-300 hover:text-[#0a1628]'}`}
                               >
                                  <mode.icon size={20}/>
                               </button>
                            ))}
                         </div>
    
                         <div className="relative group">
                            <select 
                               value={sortBy}
                               onChange={(e) => setSortBy(e.target.value)}
                               className="h-16 pl-10 pr-16 bg-gray-50 border border-black/[0.03] rounded-2xl font-syne font-black text-[10px] uppercase italic tracking-[0.2em] outline-none appearance-none cursor-pointer hover:bg-white hover:border-[#0a1628] transition-all"
                            >
                               <option>Most Popular</option>
                               <option>Price \u2191</option>
                               <option>Price \u2193</option>
                               <option>Rating</option>
                               <option>Newest</option>
                            </select>
                            <ChevronDown size={16} className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-hover:text-[#0a1628] transition-colors" />
                         </div>
                      </div>
                   </div>
    
                   {/* Results Terminal Grid */}
                   <motion.div 
                     layout
                     className={`grid gap-4 md:gap-12 ${viewMode === 'grid' ? 'grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4' : 'grid-cols-1'}`}
                   >
                  <AnimatePresence mode="popLayout">
                    {filteredMedicines.map((m, idx) => (
                      <motion.div 
                        key={m._id || m.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                      >
                         <MedicineCard 
                            item={m} 
                            layout={viewMode} 
                            onAdd={handleAddToCart} 
                            isAdded={cartItems.some(item => item.id === (m._id || m.id))}
                         />
                      </motion.div>
                    ))}
                  </AnimatePresence>

                   {filteredMedicines.length === 0 && (
                    <div className="col-span-full bg-[#0a1628] rounded-[5rem] p-32 text-center text-white space-y-10 border-l-[16px] border-brand-teal shadow-4xl relative overflow-hidden">
                       <div className="absolute top-0 right-0 h-96 w-96 bg-brand-teal opacity-5 rounded-full blur-[100px]" />
                       <div className="h-32 w-32 bg-white/5 border border-white/10 rounded-[3.5rem] flex items-center justify-center mx-auto text-brand-teal shadow-3xl"><Pill size={64} className="animate-pulse"/></div>
                       <div className="space-y-4 max-w-xl mx-auto">
                          <h3 className="font-syne font-black text-5xl uppercase tracking-tighter italic leading-none">Payload Not Found</h3>
                          <p className="text-white/40 font-dm text-2xl italic leading-relaxed">The clinical registry returned zero results for your parameter matrix. Recalibrate the filter pulse.</p>
                       </div>
                    </div>
                  )}
               </motion.div>
               </>
               )}
            </div>
         </div>
      </div>
    </div>
  );
}
