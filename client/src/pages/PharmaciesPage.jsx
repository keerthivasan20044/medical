import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Map as MapIcon, List, Zap, SlidersHorizontal, Store, AlertCircle, X } from 'lucide-react';
import PharmacyCard from '../components/pharmacy/PharmacyCard';
import PharmacyMap from '../components/pharmacy/PharmacyMap';
import { pharmacyService } from '../services/apiServices'; 
import toast from 'react-hot-toast';
import Pagination from '../components/common/Pagination';
import useInfiniteScroll from '../hooks/useInfiniteScroll';
import { Loader2 } from 'lucide-react';

export default function PharmaciesPage() {
  const [pharmacies, setPharmacies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    rating: 0,
    service: '',
    sort: 'rating'
  });

  const fetchPharmacies = async (pageNum = 1, append = false) => {
    try {
      if (append) setLoadingMore(true);
      else setLoading(true);
      
      const params = { 
        search, 
        page: pageNum,
        limit: 9,
        ...filters 
      };
      const data = await pharmacyService.getAll(params);
      
      if (append) {
        setPharmacies(prev => [...prev, ...(data.items || [])]);
      } else {
        setPharmacies(data.items || []);
      }
      
      setPages(data.pages || 1);
      setPage(data.page || 1);
      setTotal(data.total || 0);
    } catch (err) {
      toast.error('Failed to load nodes');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => fetchPharmacies(1, false), 500);
    return () => clearTimeout(timer);
  }, [search, filters]);

  const handlePageChange = (pageNum) => {
    fetchPharmacies(pageNum, false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoadMore = () => {
    if (page < pages && !loadingMore) {
      fetchPharmacies(page + 1, true);
    }
  };

  const observerTarget = useInfiniteScroll(handleLoadMore, page < pages, loading || loadingMore);

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-24">
      {/* Search & Hero Section */}
      <div className="bg-white border-b border-gray-100 p-8 md:p-12 space-y-10">
        <div className="max-w-7xl mx-auto space-y-8">
           <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-2">
                 <div className="flex items-center gap-2 mb-2">
                    <span className="h-2 w-2 rounded-full bg-brand-teal animate-pulse" />
                    <span className="text-[10px] font-black text-brand-teal uppercase tracking-[0.3em]">Network Active</span>
                 </div>
                 <h1 className="font-syne font-black text-5xl text-navy italic tracking-tighter uppercase leading-none">Pharmacy Nodes</h1>
                 <p className="text-xs font-dm font-bold text-navy/40 uppercase tracking-widest italic">Discover verified medical fulfillment nodes in your sector</p>
              </div>
              
              <div className="flex items-center gap-4">
                 <div className="flex bg-gray-50 p-1.5 rounded-[1.8rem] border border-gray-100 shadow-sm">
                    <button onClick={() => setViewMode('grid')} className={`px-6 py-2.5 rounded-[1.5rem] text-[9px] font-black uppercase tracking-widest transition-all ${viewMode === 'grid' ? 'bg-navy text-white shadow-lg shadow-navy/20' : 'text-navy/40'}`}>Grid</button>
                    <button onClick={() => setViewMode('map')} className={`px-6 py-2.5 rounded-[1.5rem] text-[9px] font-black uppercase tracking-widest transition-all ${viewMode === 'map' ? 'bg-navy text-white shadow-lg shadow-navy/20' : 'text-navy/40'}`}>Map</button>
                 </div>
              </div>
           </div>

           <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1 group">
                 <div className="absolute inset-y-0 left-6 flex items-center text-navy/20 group-focus-within:text-brand-teal transition-colors">
                    <Search size={24} />
                 </div>
                 <input 
                   type="text" 
                   placeholder="Search node name, city, or specialty..." 
                   value={search}
                   onChange={(e) => setSearch(e.target.value)}
                   className="w-full h-16 bg-gray-50 border border-gray-100 rounded-[2rem] pl-16 pr-8 font-dm font-bold text-navy outline-none focus:bg-white focus:border-brand-teal focus:ring-8 focus:ring-brand-teal/5 transition-all shadow-sm"
                 />
              </div>
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className={`h-16 px-8 rounded-[2rem] font-syne font-black text-xs uppercase tracking-widest flex items-center gap-3 transition-all ${
                  showFilters ? 'bg-navy text-brand-teal shadow-xl shadow-navy/20' : 'bg-white border border-gray-100 text-navy/40 hover:border-brand-teal'
                }`}
              >
                 <SlidersHorizontal size={20} /> Filters
              </button>
           </div>

           {/* Expanded Filters */}
           <AnimatePresence>
              {showFilters && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                   <div className="pt-8 grid grid-cols-2 md:grid-cols-4 gap-8">
                      <div className="space-y-3">
                         <label className="text-[10px] font-black text-navy/40 uppercase tracking-widest italic ml-2">Min Rating</label>
                         <div className="flex gap-2">
                            {[4, 4.5].map(r => (
                              <button 
                                key={r}
                                onClick={() => setFilters(f => ({ ...f, rating: r }))}
                                className={`flex-1 py-3 rounded-2xl text-[10px] font-black uppercase transition-all ${
                                  filters.rating === r ? 'bg-navy text-brand-teal shadow-lg' : 'bg-gray-50 text-navy/40 hover:bg-gray-100'
                                }`}
                              >
                                {r}+ Stars
                              </button>
                            ))}
                         </div>
                      </div>
                      <div className="space-y-3">
                         <label className="text-[10px] font-black text-navy/40 uppercase tracking-widest italic ml-2">Service Type</label>
                         <select 
                           value={filters.service}
                           onChange={(e) => setFilters(f => ({ ...f, service: e.target.value }))}
                           className="w-full h-12 bg-gray-50 border border-gray-100 rounded-2xl px-6 text-[10px] font-black uppercase tracking-widest text-navy outline-none appearance-none"
                         >
                            <option value="">All Services</option>
                            <option value="24 Hours">24 Hours</option>
                            <option value="Home Delivery">Delivery</option>
                            <option value="Emergency">Emergency</option>
                         </select>
                      </div>
                      <div className="col-span-2 flex items-end">
                         <button 
                           onClick={() => setFilters({ rating: 0, service: '', sort: 'rating' })}
                           className="text-[10px] font-black text-red-500 uppercase tracking-[0.2em] italic flex items-center gap-2 hover:underline ml-auto"
                         >
                            <X size={14} /> Reset Protocol
                         </button>
                      </div>
                   </div>
                </motion.div>
              )}
           </AnimatePresence>
        </div>
      </div>

      {/* Results Section */}
      <div className="max-w-7xl mx-auto p-8 md:p-12">
         {viewMode === 'grid' ? (
           loading ? (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-white rounded-[3.5rem] h-[400px] animate-pulse border border-gray-50" />
                ))}
             </div>
           ) : pharmacies.length > 0 ? (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                 {pharmacies.map((p, idx) => (
                   <PharmacyCard key={p._id} pharmacy={p} idx={idx} />
                 ))}

                 {/* Pagination for Desktop */}
                 <div className="col-span-full hidden md:block mt-12">
                   <Pagination 
                     page={page} 
                     pages={pages} 
                     onPageChange={handlePageChange} 
                   />
                 </div>

                 {/* Infinite Scroll for Mobile */}
                 <div className="col-span-full md:hidden py-10 flex justify-center">
                    {loadingMore ? (
                       <Loader2 size={24} className="animate-spin text-brand-teal" />
                    ) : (
                       <div ref={observerTarget} className="h-10 w-full" />
                    )}
                 </div>
              </div>
           ) : (
             <div className="h-[400px] flex flex-col items-center justify-center text-center space-y-6">
                <div className="h-24 w-24 bg-navy/5 rounded-[3rem] flex items-center justify-center text-navy/10">
                   <Store size={48} />
                </div>
                <div>
                   <h2 className="font-syne font-black text-3xl text-navy uppercase italic">Zero Intercept</h2>
                   <p className="text-xs font-dm font-bold text-navy/40 uppercase tracking-widest italic mt-2">No nodes found matching your current coordinates and filters.</p>
                </div>
             </div>
           )
         ) : (
           <div className="h-[600px] rounded-[3.5rem] overflow-hidden border border-gray-100 shadow-2xl">
              <PharmacyMap pharmacies={pharmacies} />
           </div>
         )}
      </div>
    </div>
  );
}
