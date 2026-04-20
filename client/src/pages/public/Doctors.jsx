import { useState, useMemo, useEffect } from 'react';
import { Search, Filter, Star, Clock, MapPin, CheckCircle2, Video, Phone, ShieldCheck, Activity, ChevronRight, Sliders, LayoutGrid, List as ListIcon, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { doctorService } from '../../services/apiServices';
import { normalizeUrl } from '../../utils/url';

export default function DoctorsListPage() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // grid, list

  useEffect(() => {
    fetchDoctors();
  }, [searchQuery, selectedSpecialty]);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const params = {};
      if (searchQuery) params.q = searchQuery;
      if (selectedSpecialty !== 'All') params.specialization = selectedSpecialty;
      
      const data = await doctorService.getAll(params);
      const mapped = (data.items || []).map(u => ({
        id: u._id,
        name: u.name,
        image: u.avatar?.url || `https://ui-avatars.com/api/?name=${u.name}&background=028090&color=fff`,
        spec: u.doctorProfile?.specialization || 'General Physician',
        qual: u.doctorProfile?.qualification || 'MBBS',
        hospital: u.doctorProfile?.hospital || 'Clinical Node',
        experience: u.doctorProfile?.experience || 5,
        rating: u.doctorProfile?.rating || 4.5,
        fee: u.doctorProfile?.fee || 200,
        status: u.doctorProfile?.status || 'online',
        tags: u.doctorProfile?.tags || ['Consultation']
      }));
      setDoctors(mapped);
    } catch (err) {
      console.error('Clinical handshake failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const specialties = [
    'All', 'General Physician', 'Cardiologist', 'Paediatrician', 
    'Gynaecologist', 'Orthopaedic', 'Dermatologist', 'ENT', 'Ophthalmologist', 'Diabetologist'
  ];

  const filteredDoctors = doctors;

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-64 overflow-x-hidden">
      {/* Hero Section: Clinical Terminal */}
      <section className="bg-[#0a1628] pt-24 pb-32 md:pt-32 md:pb-60 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-5" />
        <div className="absolute top-0 right-0 h-full w-1/3 bg-brand-teal/10 blur-[120px]" />
        
        <div className="max-w-7xl mx-auto px-6 md:px-10 relative z-10 space-y-10 md:space-y-12 text-center lg:text-left">
           <div className="flex items-center justify-center lg:justify-start gap-4 text-[9px] md:text-[10px] font-black text-white/40 uppercase tracking-[0.4em] italic mb-6">
              <span>Home</span> <ChevronRight size={14} className="opacity-40" /> <span>Consultation</span>
           </div>
           
           <div className="space-y-4 md:space-y-6">
              <h1 className="font-syne font-black text-white text-[clamp(2.5rem,8vw,4rem)] md:text-[clamp(4rem,10vw,9rem)] leading-[0.9] tracking-tighter uppercase italic drop-shadow-2xl">
                 Consult <br/><span className="text-brand-teal">Karaikal Doctors</span>
              </h1>

              <p className="text-white/40 font-dm text-base md:text-2xl italic max-w-2xl leading-relaxed mx-auto lg:mx-0 font-bold px-4 md:px-0">
                 Get encrypted prescriptions from certified clinical nodes.
              </p>
           </div>

           {/* Hero Functional Bar */}
           <div className="flex flex-col lg:flex-row gap-6 md:gap-8 items-stretch pt-8 md:pt-12">
              <div className="flex-1 h-20 md:h-24 bg-white/5 backdrop-blur-3xl rounded-[2rem] md:rounded-[2.5rem] shadow-4xl flex items-center px-6 md:px-10 border border-white/10 focus-within:border-brand-teal transition-all group overflow-hidden">
                 <div className="h-12 w-12 md:h-16 md:w-16 bg-brand-teal rounded-xl md:rounded-2xl flex items-center justify-center text-[#0a1628] shadow-mint group-focus-within:bg-white transition-all duration-700 shrink-0">
                    <Search size={22} className="md:w-7 md:h-7" />
                 </div>
                 <input 
                    type="text" 
                    placeholder="Search doctor name..." 
                    className="flex-1 bg-transparent px-4 md:px-8 font-syne font-black text-lg md:text-xl italic outline-none text-white placeholder-white/20 uppercase tracking-tighter"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                 />
              </div>
              
              <div className="flex gap-4">
                 <button 
                   onClick={() => setShowFilters(!showFilters)}
                   className={`h-20 md:h-24 px-8 md:px-10 flex-1 lg:flex-none rounded-[2rem] md:rounded-[2.5rem] font-syne font-black text-[10px] md:text-xs uppercase italic tracking-widest transition-all duration-700 active:scale-95 shadow-4xl border flex items-center justify-center gap-4 md:gap-6 ${showFilters ? 'bg-brand-teal text-[#0a1628] border-brand-teal' : 'bg-white/5 text-white border-white/10 hover:bg-white/10'}`}
                 >
                    <Sliders size={20}/> {showFilters ? 'Hide Config' : 'Filter Enclaves'}
                 </button>
              </div>
           </div>
        </div>
      </section>

      {/* Registry Matrix */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 mt-0 md:-mt-32 relative z-[100] space-y-10 md:space-y-16">
         
         {/* Specialty Chip Matrix */}
         <div className="bg-white border border-black/[0.03] p-3 md:p-4 rounded-[2.5rem] md:rounded-[3rem] shadow-soft overflow-x-auto no-scrollbar whitespace-nowrap">
            <div className="flex gap-2 md:gap-3">
               {specialties.map(spec => (
                 <button
                   key={spec}
                   onClick={() => setSelectedSpecialty(spec)}
                   className={`h-12 md:h-16 px-6 md:px-10 rounded-2xl md:rounded-[2rem] font-syne font-black text-[9px] md:text-[10px] uppercase italic tracking-widest transition-all duration-500 border ${selectedSpecialty === spec ? 'bg-[#0a1628] text-brand-teal border-[#0a1628] shadow-4xl' : 'bg-gray-50 text-gray-400 border-black/[0.02] hover:text-[#0a1628] hover:border-[#0a1628]'}`}
                 >
                    {spec}
                 </button>
               ))}
            </div>
         </div>

         {/* Content Hub */}
         <div className="flex flex-col lg:flex-row gap-8 md:gap-16 bg-white rounded-[2.5rem] md:rounded-[4rem] p-6 md:p-12 shadow-2xl relative z-10 border border-black/[0.02]">
            
            {/* Results Grid */}
            <div className="flex-1 space-y-10 md:space-y-16">
               <div className="flex flex-col md:flex-row justify-between items-center gap-6 md:gap-8 bg-white border border-black/[0.03] rounded-[2.5rem] md:rounded-[3rem] p-6 md:p-10 shadow-soft">
                  <div className="flex items-center gap-4 md:gap-6">
                     <div className="h-1.5 w-12 bg-brand-teal rounded-full" />
                     <h2 className="font-syne font-black text-xl md:text-4xl text-[#0a1628] uppercase tracking-tighter italic leading-none">{doctors.length} Clinical Practitioners</h2>
                  </div>
                  
                  <div className="flex bg-gray-50/50 p-1.5 md:p-2 rounded-2xl border border-black/[0.01]">
                     {[
                        { id: 'grid', icon: LayoutGrid },
                        { id: 'list', icon: ListIcon }
                     ].map(mode => (
                        <button
                          key={mode.id}
                          onClick={() => setViewMode(mode.id)}
                          className={`h-10 w-10 md:h-12 md:w-12 rounded-xl flex items-center justify-center transition-all duration-700 active:scale-95 ${viewMode === mode.id ? 'bg-[#0a1628] text-brand-teal shadow-2xl' : 'text-gray-300 hover:text-[#0a1628]'}`}
                        >
                           <mode.icon size={mode.id === 'grid' ? 18 : 20}/>
                        </button>
                     ))}
                  </div>
               </div>

               {loading ? (
                  <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-8">
                      <Loader2 size={48} className="animate-spin text-brand-teal" />
                      <h3 className="font-syne font-black text-2xl text-[#0a1628] uppercase tracking-tighter italic">Syncing Enclave...</h3>
                  </div>
               ) : (
                 <div className={`grid gap-6 md:gap-12 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
                  {doctors.map((dr, idx) => (
                      <motion.div 
                        key={dr.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="bg-white rounded-[2.5rem] md:rounded-[4rem] border border-black/[0.03] p-6 md:p-10 shadow-soft hover:shadow-4xl transition-all duration-700 relative group overflow-hidden"
                      >
                       <div className="absolute top-0 right-0 h-40 w-40 bg-brand-teal opacity-[0.02] rounded-full blur-[60px] pointer-events-none" />
                       
                       <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-start relative z-10">
                          <div className="relative shrink-0 mx-auto md:mx-0">
                             <div className="h-28 w-28 md:h-40 md:w-40 rounded-[2rem] md:rounded-[3.5rem] overflow-hidden border-4 border-gray-50 group-hover:border-brand-teal transition-all duration-1000 shadow-xl shadow-black/5">
                                <img src={dr.image} alt={dr.name} className="h-full w-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110" />
                             </div>
                             <div className={`absolute -bottom-1 -right-1 h-8 w-8 md:h-10 md:w-10 border-4 border-white rounded-full flex items-center justify-center transition-all shadow-lg ${dr.status === 'online' ? 'bg-emerald-500' : dr.status === 'busy' ? 'bg-amber-500' : 'bg-gray-300'}`}>
                                <Activity size={12} className="text-white animate-pulse" />
                             </div>
                          </div>

                          <div className="flex-1 space-y-4 md:space-y-6 text-center md:text-left">
                             <div className="space-y-1 md:space-y-2">
                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                                   <span className="text-[8px] md:text-[9px] font-black text-brand-teal bg-brand-teal/5 px-3 py-1 rounded-lg uppercase tracking-widest italic border border-brand-teal/10">{dr.spec}</span>
                                   <span className="text-[8px] md:text-[9px] font-black text-gray-300 bg-gray-50 px-3 py-1 rounded-lg uppercase tracking-widest italic">{dr.experience} Years</span>
                                </div>
                                <h3 className="font-syne font-black text-xl md:text-3xl text-[#0a1628] leading-[0.9] tracking-tighter uppercase italic group-hover:text-brand-teal transition-colors">{dr.name}</h3>
                                <div className="text-[10px] md:text-xs text-gray-400 font-dm font-bold italic flex items-center justify-center md:justify-start gap-2">
                                   <Clock size={12} className="text-brand-teal" /> {dr.qual} &bull; <span className={dr.status === 'online' ? 'text-emerald-500' : 'text-gray-400'}>{dr.status === 'online' ? 'Available' : 'Offline'}</span>
                                </div>
                             </div>

                             <div className="flex items-center gap-4 p-4 bg-gray-50/50 rounded-2xl border border-black/[0.01]">
                                <MapPin size={14} className="text-brand-teal shrink-0"/>
                                <div className="text-[9px] md:text-[10px] font-black text-[#0a1628] uppercase italic leading-tight truncate">{dr.hospital}</div>
                             </div>
                          </div>
                       </div>

                       <div className="grid grid-cols-2 gap-3 mt-8 pt-8 border-t border-black/[0.03] relative z-10">
                          <Link to={`/doctors/${dr.id}`} className="block">
                             <button className="w-full h-14 md:h-16 bg-gray-50 border border-black/[0.02] text-[#0a1628] font-syne font-black text-[9px] md:text-[10px] uppercase italic tracking-widest rounded-xl md:rounded-2xl hover:bg-[#0a1628] hover:text-white transition-all duration-500">
                                Profile
                             </button>
                          </Link>
                          <button className="w-full h-14 md:h-16 bg-brand-teal text-[#0a1628] font-syne font-black text-[9px] md:text-[10px] uppercase italic tracking-widest rounded-xl md:rounded-2xl shadow-mint hover:scale-[1.05] active:scale-95 transition-all flex items-center justify-center gap-2">
                             <Video size={16} /> Book <span className="opacity-40">\u20B9{dr.fee}</span>
                          </button>
                       </div>
                    </motion.div>
                  ))}
               </div>
               )}
            </div>
         </div>
      </div>
    </div>
  );
}
