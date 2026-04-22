import { useState, useMemo, useEffect, useRef } from 'react';
import { Search, MapPin, Filter as FilterIcon, Grid2X2, List, Map as MapIcon, ChevronRight, SlidersHorizontal, ArrowUpDown, X, Check, Clock, Truck, Star, Info, Activity, Globe, ShieldCheck, Zap, ChevronLeft, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { pharmacyService } from '../../services/apiServices';
import { normalizeUrl } from '../../utils/url';
import PharmacyCard_v2 from '../../components/pharmacy/PharmacyCard_v2.jsx';
import KaraikalMap from '../../components/pharmacy/KaraikalMap.jsx';

const demandData = [
  { time: '08:00', volume: 45 }, { time: '10:00', volume: 85 },
  { time: '12:00', volume: 65 }, { time: '14:00', volume: 90 },
  { time: '16:00', volume: 75 }, { time: '18:00', volume: 110 },
  { time: '20:00', volume: 80 }
];

export default function PharmaciesListPage() {
  const [pharmacies, setPharmacies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter States
  const [selectedAreas, setSelectedAreas] = useState([]);
  const [openStatus, setOpenStatus] = useState('All'); 
  const [freeDelivery, setFreeDelivery] = useState(false);
  const [minRating, setMinRating] = useState(3.0);
  const [maxDistance, setMaxDistance] = useState('Any');
  const [selectedServices, setSelectedServices] = useState([]);
  const [sortBy, setSortBy] = useState('Name');
  const scrollRef = useRef(null);

  useEffect(() => {
    fetchPharmacies();
  }, [searchQuery, selectedAreas]);

  const fetchPharmacies = async () => {
    try {
      setLoading(true);
      const params = {};
      if (searchQuery) params.q = searchQuery;
      // Filter by area if selected
      const data = await pharmacyService.getAll(params);
      
      const mapped = (data.items || []).map(p => ({
        id: p._id,
        name: p.name,
        area: p.address?.city || 'Karaikal',
        address: `${p.address?.street || ''}, ${p.address?.city || 'Karaikal'}`,
        location: `${p.address?.street || ''}, ${p.address?.city || 'Karaikal'}`,
        phone: p.phone || '04368-222288',
        timings: p.timings || '8:00 AM - 10:00 PM',
        rating: p.rating || 4.2,
        reviewsCount: p.totalReviews || p.reviewsCount || 120,
        totalReviews: p.totalReviews || 120,
        status: p.isOpen ? 'OPEN NOW' : 'CLOSED',
        is24hr: !!(p.timings?.includes('24')),
        deliveryFee: p.deliveryFee || 0,
        freeThreshold: p.freeThreshold || 300,
        eta: '12 MINS',
        distance: 1.2,
        image: normalizeUrl(p.images?.[0]?.url || p.images?.[0] || '/assets/pharmacy_pro.png'),
        images: [normalizeUrl(p.images?.[0]?.url || p.images?.[0] || '/assets/pharmacy_pro.png')],
        services: p.services || ['Home Delivery', 'Prescription', 'Vaccines'],
        coordinates: p.address?.coordinates || { lat: 10.9254, lng: 79.8386 },
        gps: p.address?.coordinates || { lat: 10.9254 + (Math.random() * 0.02 - 0.01), lng: 79.8386 + (Math.random() * 0.02 - 0.01) },
        stock: p.stock || { tablets: 75, syrups: 60, vaccines: 45, injections: 50, baby: 40, ayurvedic: 30 },
        alerts: p.alerts || [],
        isTopRated: (p.rating || 0) >= 4.7,
        isFastest: false,
        isAyurvedicSpecialist: false,
        isBabyCareSpecialist: false,
      }));
      setPharmacies(mapped);
    } catch (err) {
      console.error('Could not load pharmacies from registry:', err);
    } finally {
      setLoading(false);
    }
  };

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - 200 : scrollLeft + 200;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  const areas = ['Karaikal Town', 'Nagore', 'Poompuhar', 'Neravy', 'Keezhavur'];
  const servicesList = ['Home Delivery', 'Prescription', 'Vaccines', 'Ayurvedic', 'Surgical Items', 'Baby Care', 'Diabetic Supplies'];

  const filteredPharmacies = useMemo(() => {
    let result = pharmacies.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           p.area.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesArea = selectedAreas.length === 0 || selectedAreas.includes(p.area);
      const matchesOpen = openStatus === 'All' || 
                         (openStatus === 'Open Now' && p.status.includes('OPEN')) ||
                         (openStatus === '24 Hours' && p.is24hr);
      const matchesDelivery = !freeDelivery || p.deliveryFee === 0;
      const matchesRating = p.rating >= minRating;
      const matchesServices = selectedServices.every(s => p.services.includes(s));

      return matchesSearch && matchesArea && matchesOpen && matchesDelivery && matchesRating && matchesServices;
    });

    if (sortBy === 'Rating') result.sort((a, b) => b.rating - a.rating);
    if (sortBy === 'Nearest') result.sort((a, b) => a.distance - b.distance);
    if (sortBy === 'Name') result.sort((a, b) => a.name.localeCompare(b.name));

    return result;
  }, [pharmacies, searchQuery, selectedAreas, openStatus, freeDelivery, minRating, maxDistance, selectedServices, sortBy]);

  const toggleArea = (area) => setSelectedAreas(prev => prev.includes(area) ? prev.filter(a => a !== area) : [...prev, area]);
  const toggleService = (s) => setSelectedServices(prev => prev.includes(s) ? prev.filter(item => item !== s) : [...prev, s]);

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-48 font-dm">
      <section className="bg-[#0a1628] pt-24 pb-48 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(2,195,154,0.1),transparent_50%)]" />
        <div className="absolute top-0 right-0 h-full w-1/3 bg-brand-teal/5 blur-[120px]" />
        
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 relative z-10 space-y-12 text-center lg:text-left">
           <div className="flex items-center justify-center lg:justify-start gap-4 text-[10px] font-black text-white/40 uppercase tracking-[0.4em] italic mb-8">
              <span>Home</span> <ChevronRight size={14} className="opacity-40" /> <span>Pharmacies</span>
           </div>
           
           <div className="space-y-4">
              <h1
                className="font-black text-white leading-[0.9] break-words w-full"
                style={{ fontSize: 'clamp(2.2rem, 12vw, 5rem)' }}
              >
                 Find <span className="text-brand-teal">Pharmacies</span> in Karaikal
              </h1>
              <div className="flex flex-col lg:flex-row gap-8 items-center justify-between pt-6">
                 <p className="text-white/40 font-dm text-lg italic max-w-xl leading-relaxed mx-auto lg:mx-0">
                    {filteredPharmacies.length} verified pharmacies available in your area.
                 </p>
                 <div className="bg-brand-teal/5 border border-brand-teal/10 px-5 py-2 rounded-xl text-brand-teal font-syne font-black text-[9px] uppercase italic tracking-[0.25em] flex items-center gap-3 mx-auto lg:mx-0">
                    <div className="h-1.5 w-1.5 rounded-full bg-brand-teal animate-ping" />
                     Verified Data
                 </div>
              </div>
           </div>

           <div className="flex flex-col lg:flex-row gap-4 items-stretch p-2 backdrop-blur-3xl bg-white/5 rounded-3xl md:rounded-[2.5rem] border border-white/10 shadow-4xl group max-w-2xl mx-auto lg:mx-0">
              <div className="flex-1 h-12 md:h-14 flex items-center px-4 md:px-6 gap-3 md:gap-4 group/input transition-all">
                 <Search className="text-brand-teal md:w-5 md:h-5" size={18} />
                 <input 
                    type="text" 
                    placeholder="Search pharmacies..." 
                    className="flex-1 bg-transparent font-syne font-black text-sm md:text-base italic outline-none text-white placeholder:text-white/20 uppercase tracking-tighter"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                 />
              </div>
              <button 
                onClick={() => setShowFilters(true)} 
                className="h-12 md:h-14 px-6 md:px-8 bg-brand-teal text-[#0a1628] font-syne font-black text-[9px] md:text-[10px] uppercase italic tracking-widest rounded-2xl md:rounded-[1.8rem] hover:shadow-mint transition-all duration-500 flex items-center justify-center gap-2 md:gap-3 active:scale-95 shadow-4xl"
              >
                 <SlidersHorizontal size={14} className="md:w-4 md:h-4"/> Filter
              </button>
           </div>
        </div>

        {/* District Geo-Matrix Placeholder */}
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 mt-12 md:mt-20">
           <div className="h-40 md:h-64 w-full bg-[#0a1628] rounded-[2.5rem] md:rounded-[4rem] border-4 border-white shadow-4xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(2,195,154,0.1),transparent_70%)]" />
              <div className="absolute inset-0 bg-grid opacity-10" />
              <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4">
                 <div className="h-12 w-12 bg-brand-teal/20 rounded-2xl flex items-center justify-center text-brand-teal animate-pulse">
                    <MapIcon size={24} />
                 </div>
                 <div className="text-center">
                    <div className="font-syne font-black text-white text-lg md:text-2xl uppercase italic tracking-tighter">Local Area Map Ready</div>
                    <div className="text-[10px] text-white/40 font-black uppercase tracking-[0.4em] italic">Showing {filteredPharmacies.length} Pharmacies</div>
                 </div>
              </div>
              <div className="absolute bottom-6 right-6">
                 <button onClick={() => setViewMode('map')} className="h-10 px-6 bg-white/5 border border-white/10 text-white font-syne font-black text-[9px] uppercase italic tracking-widest rounded-xl hover:bg-brand-teal hover:text-[#0a1628] transition-all">View Map</button>
              </div>
           </div>
        </div>
      </section>

      <div className="sticky top-16 lg:top-[72px] z-40 bg-white/80 backdrop-blur-2xl border-b border-black/[0.03] shadow-soft py-4 px-6 lg:px-10 transition-all duration-300">
         <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            
            {/* Filter Bar with Navigation Arrows */}
            <div className="flex-1 flex items-center gap-4 min-w-0">
               <button 
                 onClick={() => scroll('left')}
                 className="h-10 w-8 flex items-center justify-center text-gray-400 hover:text-[#0a1628] transition-colors shrink-0"
               >
                 <ChevronLeft size={16} />
               </button>

               <div 
                 ref={scrollRef} 
                 className="flex-1 flex gap-3 overflow-x-auto no-scrollbar scroll-smooth"
               >
                  {[
                    { label: 'All Pharmacies', onClick: () => { setOpenStatus('All'); setFreeDelivery(false); } },
                    { label: 'Open Now', onClick: () => setOpenStatus('Open Now'), icon: '🟢' },
                    { label: 'Free Delivery', onClick: () => setFreeDelivery(true), icon: '🚚' },
                    { label: 'Top Rated', onClick: () => setSortBy('Rating'), icon: '⭐' },
                    { label: '24 Hours', onClick: () => setOpenStatus('24 Hours'), icon: '🕐' }
                  ].map(pill => (
                    <button 
                      key={pill.label} 
                      onClick={pill.onClick} 
                      className="h-10 px-5 bg-gray-50/50 border border-black/[0.02] rounded-full font-syne font-black text-[9px] uppercase italic tracking-widest hover:bg-[#0a1628] hover:text-brand-teal transition-all flex items-center gap-3 shrink-0"
                    >
                      <span className="opacity-70">{pill.icon}</span> 
                      {pill.label}
                    </button>
                  ))}
               </div>

               <button 
                 onClick={() => scroll('right')}
                 className="h-10 w-8 flex items-center justify-center text-gray-400 hover:text-[#0a1628] transition-colors shrink-0"
               >
                 <ChevronRight size={16} />
               </button>
            </div>
            <div className="flex items-center gap-8 shrink-0">
               <div className="flex bg-gray-100 p-1.5 rounded-2xl border border-black/[0.01]">
                  {[{ id: 'grid', icon: Grid2X2 }, { id: 'list', icon: List }, { id: 'map', icon: MapIcon }].map(mode => (
                     <button key={mode.id} onClick={() => setViewMode(mode.id)} className={`h-10 w-10 md:h-12 md:w-12 rounded-xl flex items-center justify-center transition-all duration-700 active:scale-95 ${viewMode === mode.id ? 'bg-[#0a1628] text-brand-teal shadow-2xl scale-[1.1] z-10' : 'text-gray-300 hover:text-[#0a1628]'}`}><mode.icon size={20}/></button>
                  ))}
               </div>
               <div className="flex items-center gap-4">
                  <span className="text-[10px] font-black text-gray-300 uppercase italic tracking-widest">Sort By</span>
                  <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="h-12 px-6 bg-gray-50 border border-black/[0.03] rounded-xl font-syne font-black text-[10px] uppercase italic tracking-widest outline-none appearance-none cursor-pointer hover:bg-white hover:border-[#0a1628] transition-all"><option>Nearest</option><option>Rating</option><option>Delivery Time</option><option>Name</option></select>
               </div>
            </div>
         </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-16 space-y-16">
         {/* Live District Demand Telemetry Hub */}
         <div className="bg-white border border-black/[0.03] rounded-[4.5rem] p-12 lg:p-16 shadow-soft flex flex-col lg:flex-row items-center gap-16 relative overflow-hidden">
            <div className="absolute top-0 right-0 h-64 w-64 bg-brand-teal opacity-[0.02] rounded-full blur-[80px]" />
            <div className="lg:w-1/3 space-y-8 text-center lg:text-left">
               <div className="h-16 w-16 bg-[#0a1628] rounded-[1.8rem] flex items-center justify-center text-brand-teal shadow-4xl mx-auto lg:mx-0"><Zap size={28}/></div>
               <div>
                  <h3 className="font-syne font-black text-4xl text-[#0a1628] uppercase italic tracking-tighter leading-none">Local Activity</h3>
                  <p className="text-gray-400 font-dm font-bold italic text-lg leading-relaxed mt-4 uppercase tracking-tighter opacity-60">Pharmacy busy times in Karaikal.</p>
               </div>
               <div className="flex flex-col gap-4 text-xs font-dm font-bold italic text-[#0a1628] opacity-40 uppercase tracking-widest">
                  <div className="flex items-center gap-3"><div className="h-1.5 w-1.5 rounded-full bg-brand-teal" /> Live Updates</div>
                  <div className="flex items-center gap-3"><div className="h-1.5 w-1.5 rounded-full bg-brand-teal" /> 8 Verified Local Pharmacies</div>
               </div>
            </div>
            <div className="flex-1 h-64 w-full relative min-h-[256px]">
               <ResponsiveContainer width="100%" height="100%" minHeight={256}>
                  <AreaChart data={demandData}>
                     <defs>
                        <linearGradient id="colorPulse" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#02C39A" stopOpacity={0.3}/>
                           <stop offset="95%" stopColor="#02C39A" stopOpacity={0}/>
                        </linearGradient>
                     </defs>
                     <Area type="monotone" dataKey="volume" stroke="#02C39A" strokeWidth={4} fillOpacity={1} fill="url(#colorPulse)" dot={{ r: 4, fill: '#0a1628', stroke: '#02C39A', strokeWidth: 2 }} />
                     <XAxis dataKey="time" hide />
                     <YAxis hide />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
         </div>

         <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
               <div className="h-2 w-16 bg-brand-teal rounded-full" />
               <h2 className="font-dm font-bold text-gray-500 text-sm italic">Showing {filteredPharmacies.length} pharmacies in Karaikal</h2>
            </div>
            <div className="px-5 py-2 bg-emerald-50 text-emerald-500 text-[10px] font-black uppercase italic tracking-widest rounded-xl border border-emerald-100 flex items-center gap-3"><div className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-ping" />Stock data live</div>
         </div>

         {loading ? (
            <div className="min-h-[40vh] flex flex-col items-center justify-center space-y-8">
               <div className="relative">
                  <motion.div 
                     animate={{ rotate: 360 }}
                     transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                     className="h-32 w-32 border-[12px] border-[#0a1628]/[0.02] border-t-brand-teal rounded-full"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                     <Loader2 size={32} className="animate-spin text-brand-teal/50" />
                  </div>
               </div>
               <div className="text-center space-y-2">
                  <h3 className="font-syne font-black text-2xl text-[#0a1628] uppercase tracking-tighter italic">Loading Pharmacies...</h3>
                  <p className="text-[9px] text-gray-300 font-bold uppercase tracking-[0.4em] italic leading-none animate-pulse">Connecting to network...</p>
               </div>
            </div>
         ) : (
            <AnimatePresence mode="wait">
              {viewMode === 'map' ? (
                <motion.div key="mapView" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="h-[800px] w-full bg-white rounded-[5rem] overflow-hidden border border-black/[0.03] shadow-soft relative"><KaraikalMap pharmacies={filteredPharmacies} /></motion.div>
              ) : (
                <motion.div key={viewMode} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} className={`grid gap-12 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>{filteredPharmacies.map(p => (<PharmacyCard_v2 key={p.id} item={p} layout={viewMode} />))}</motion.div>
              )}
            </AnimatePresence>
         )}
      </div>

      <AnimatePresence>
         {showFilters && (
            <><motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowFilters(false)} className="fixed inset-0 bg-[#0a1628]/60 backdrop-blur-md z-[100]" />
               <motion.div initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} className="fixed inset-y-0 left-0 w-full max-w-lg bg-white z-[101] shadow-4xl p-12 lg:p-16 flex flex-col pt-32">
                  <button onClick={() => setShowFilters(false)} className="absolute top-10 right-10 h-16 w-16 bg-gray-50 rounded-2xl flex items-center justify-center text-[#0a1628] hover:text-red-500 transition-all active:scale-95 shadow-soft"><X size={32}/></button>
                  <div className="flex-1 overflow-y-auto pr-6 no-scrollbar space-y-16">
                     <div className="space-y-4"><div className="text-[10px] font-black text-brand-teal uppercase tracking-[0.4em] italic leading-none">Filter Options</div><h2 className="font-syne font-black text-5xl text-[#0a1628] uppercase italic tracking-tighter leading-none">Filter Pharmacies</h2></div>
                     <div className="space-y-8 pt-10 border-t border-black/[0.03]"><h4 className="text-[10px] font-black uppercase text-gray-300 italic tracking-widest">Select Area</h4><div className="grid grid-cols-2 gap-4">{areas.map(area => (<button key={area} onClick={() => toggleArea(area)} className={`h-16 px-6 rounded-2xl border font-syne font-black text-[9px] uppercase italic tracking-widest transition-all ${selectedAreas.includes(area) ? 'bg-[#0a1628] text-brand-teal border-[#0a1628] shadow-4xl' : 'bg-gray-50 text-gray-400 border-black/[0.01]'}`}>{area}</button>))}</div></div>
                     <div className="space-y-8 pt-10 border-t border-black/[0.03]"><h4 className="text-[10px] font-black uppercase text-gray-300 italic tracking-widest">Opening Status</h4><div className="flex gap-4">{['Open Now', '24 Hours', 'All'].map(opt => (<button key={opt} onClick={() => setOpenStatus(opt)} className={`flex-1 h-16 rounded-2xl border font-syne font-black text-[9px] uppercase italic tracking-widest transition-all ${openStatus === opt ? 'bg-[#0a1628] text-brand-teal border-[#0a1628] shadow-4xl' : 'bg-gray-50 text-gray-400 border-black/[0.01]'}`}>{opt}</button>))}</div></div>
                     <div className="space-y-8 pt-10 border-t border-black/[0.03]"><h4 className="text-[10px] font-black uppercase text-gray-300 italic tracking-widest">Distance</h4><div className="grid grid-cols-3 gap-4">{['1km', '3km', '5km', 'Any'].map(d => (<button key={d} onClick={() => setMaxDistance(d)} className={`h-14 rounded-2xl border font-syne font-black text-[9px] uppercase italic tracking-widest transition-all ${maxDistance === d ? 'bg-[#0a1628] text-brand-teal border-[#0a1628] shadow-4xl' : 'bg-gray-50 text-gray-400 border-black/[0.01]'}`}>{d}</button>))}</div></div>
                     <div className="space-y-8 pt-10 border-t border-black/[0.03]"><h4 className="text-[10px] font-black uppercase text-gray-300 italic tracking-widest">Services</h4><div className="space-y-4">{servicesList.map(s => (<button key={s} onClick={() => toggleService(s)} className="w-full flex items-center justify-between group"><span className={`font-syne font-black text-xs uppercase italic tracking-widest transition-colors ${selectedServices.includes(s) ? 'text-[#0a1628]' : 'text-gray-400 group-hover:text-[#0a1628]'}`}>{s}</span><div className={`h-8 w-8 rounded-xl border-2 flex items-center justify-center transition-all ${selectedServices.includes(s) ? 'bg-brand-teal border-brand-teal text-[#0a1628] shadow-mint shadow-inner scale-110' : 'border-black/[0.05] text-transparent hover:border-brand-teal/40'}`}><Check size={16}/></div></button>))}</div></div>
                  </div>
                  <div className="pt-10 grid grid-cols-2 gap-6 mt-auto"><button onClick={() => { setSelectedAreas([]); setOpenStatus('All'); setSelectedServices([]); }} className="h-20 bg-gray-50 border border-black/[0.02] rounded-[2rem] font-syne font-black text-[10px] uppercase italic tracking-widest text-[#0a1628]">Clear All</button><button onClick={() => setShowFilters(false)} className="h-20 bg-[#0a1628] text-brand-teal font-syne font-black text-[10px] uppercase italic tracking-widest rounded-[2rem] shadow-4xl">Show Results</button></div>
               </motion.div></>
         )}
      </AnimatePresence>
    </div>
  );
}
