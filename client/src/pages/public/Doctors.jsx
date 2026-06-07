import { useState, useMemo, useEffect } from 'react';
import { Search, Filter, Star, Clock, MapPin, CheckCircle2, Video, Phone, ShieldCheck, Activity, ChevronRight, Sliders, LayoutGrid, List as ListIcon, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { doctorService } from '../../services/apiServices';
import { normalizeUrl } from '../../utils/url';
import { useLanguage } from '../../context/LanguageContext';

export default function DoctorsListPage() {
  const { t } = useLanguage();
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
        spec: u.doctorProfile?.specialization || 'General Doctor',
        qual: u.doctorProfile?.qualification || 'MBBS',
        hospital: u.doctorProfile?.hospital || 'Karaikal General Hospital',
        experience: u.doctorProfile?.experience || 5,
        rating: u.doctorProfile?.rating || 4.5,
        fee: u.doctorProfile?.fee || 200,
        status: u.doctorProfile?.status || 'online',
        tags: u.doctorProfile?.tags || ['Consultation']
      }));
      setDoctors(mapped);
    } catch (err) {
      console.error('Failed to load doctors:', err);
    } finally {
      setLoading(false);
    }
  };

  const specialties = [
    'All', 'General', 'Cardiologist', 'Dermatologist', 'Pediatrician', 'Orthopedic', 'ENT', 'Ophthalmologist'
  ];

  const filteredDoctors = doctors;

  return (
    <div className="bg-slate-50 min-h-screen pb-24 overflow-x-hidden">
      {/* Doctor Search Section */}
      <section className="bg-slate-900 px-4 pt-8 pb-8 md:pt-24 md:pb-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-5" />
        <div className="absolute top-0 right-0 h-full w-1/3 bg-brand-teal/10 blur-[120px]" />
        
        <div className="max-w-7xl mx-auto md:px-10 relative z-10 space-y-6 md:space-y-10 text-center lg:text-left min-w-0">
           <div className="hidden md:flex items-center justify-center lg:justify-start gap-4 text-[10px] font-black text-white/60 uppercase mb-6">
              <span>Home</span> <ChevronRight size={14} className="opacity-40" /> <span>Doctor Help</span>
           </div>
           
           <div className="space-y-4 md:space-y-6">
              <h1 className="font-syne font-black text-white text-3xl md:text-6xl leading-tight uppercase break-words">
                 Doctors
              </h1>

              <p className="text-white/70 font-dm text-sm md:text-lg max-w-2xl leading-relaxed mx-auto lg:mx-0 font-medium">
                 Get prescriptions from certified specialist doctors.
              </p>
           </div>

           <div className="flex flex-col lg:flex-row gap-3 md:gap-6 items-stretch">
              <div className="flex-1 h-14 md:h-16 bg-white/5 rounded-2xl flex items-center px-3 md:px-4 border border-white/10 focus-within:border-teal-500 transition-all group overflow-hidden">
                 <div className="h-10 w-10 bg-teal-500 rounded-xl flex items-center justify-center text-slate-900 shrink-0">
                    <Search size={22} className="md:w-7 md:h-7" />
                 </div>
                 <input 
                    type="text" 
                    placeholder="Search doctor name..." 
                    className="flex-1 min-w-0 bg-transparent px-3 font-dm font-medium text-base outline-none text-white placeholder-white/40"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                 />
              </div>
              
              <div className="flex gap-4">
                 <button 
                   onClick={() => setShowFilters(!showFilters)}
                   className={`h-12 md:h-16 px-6 flex-1 lg:flex-none rounded-xl md:rounded-2xl font-bold text-xs uppercase transition-all active:scale-95 border flex items-center justify-center gap-3 ${showFilters ? 'bg-teal-500 text-slate-900 border-teal-500' : 'bg-white/5 text-white border-white/10 hover:bg-white/10'}`}
                 >
                    <Sliders size={18}/> {showFilters ? 'Hide Filters' : 'Filters'}
                 </button>
              </div>
           </div>
        </div>
      </section>

      {/* Doctors Grid Section */}
      <div className="max-w-7xl mx-auto px-4 md:px-10 mt-5 relative z-20 space-y-5 md:space-y-8">
         
         {/* Specialties */}
         <div className="bg-white border border-slate-100 p-2 rounded-2xl shadow-sm overflow-x-auto no-scrollbar whitespace-nowrap">
            <div className="flex gap-2 md:gap-3">
               {specialties.map(spec => (
                 <button
                   key={spec}
                   onClick={() => setSelectedSpecialty(spec)}
                   className={`h-11 px-5 rounded-xl font-bold text-[10px] uppercase transition-all border ${selectedSpecialty === spec ? 'bg-[#0a1628] text-brand-teal border-[#0a1628]' : 'bg-gray-50 text-gray-500 border-slate-100 hover:text-[#0a1628]'}`}
                 >
                    {spec}
                 </button>
               ))}
            </div>
         </div>

         {/* Doctors List */}
         <div className="flex flex-col bg-white rounded-2xl md:rounded-3xl p-4 md:p-8 shadow-sm relative z-10 border border-slate-100">
            
            {/* Results Grid */}
            <div className="flex-1 space-y-5 md:space-y-8">
               <div className="flex justify-between items-center gap-4 border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3 md:gap-6 min-w-0">
                     <div className="hidden sm:block h-1.5 w-12 bg-brand-teal rounded-full" />
                     <h2 className="font-dm whitespace-nowrap text-base md:text-xl font-extrabold text-slate-950 uppercase leading-tight">{doctors.length} Doctors</h2>
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
                      <h3 className="font-syne font-black text-2xl text-[#0a1628] uppercase tracking-tighter italic">Loading Doctors...</h3>
                  </div>
               ) : (
                 <div className={`grid gap-4 md:gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
                  {doctors.map((dr, idx) => (
                      <motion.div 
                        key={dr.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="bg-white rounded-2xl border border-slate-100 p-5 md:p-6 shadow-sm hover:shadow-md transition-all relative group overflow-hidden"
                      >
                       <div className="absolute top-0 right-0 h-40 w-40 bg-brand-teal opacity-[0.02] rounded-full blur-[60px] pointer-events-none" />
                       
                       <div className="flex flex-row gap-4 md:gap-10 items-start relative z-10 min-w-0">
                          <div className="relative shrink-0">
                             <div className="h-20 w-20 md:h-40 md:w-40 rounded-2xl md:rounded-[3.5rem] overflow-hidden border-4 border-gray-50 group-hover:border-brand-teal transition-all duration-1000 shadow-xl shadow-black/5">
                                <img src={dr.image} alt={dr.name} className="h-full w-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110" />
                             </div>
                             <div className={`absolute -bottom-1 -right-1 h-8 w-8 md:h-10 md:w-10 border-4 border-white rounded-full flex items-center justify-center transition-all shadow-lg ${dr.status === 'online' ? 'bg-emerald-500' : dr.status === 'busy' ? 'bg-amber-500' : 'bg-gray-300'}`}>
                                <Activity size={12} className="text-white animate-pulse" />
                             </div>
                          </div>

                          <div className="flex-1 min-w-0 space-y-3 md:space-y-6 text-left">
                             <div className="space-y-1 md:space-y-2">
                                <div className="flex flex-wrap items-center justify-start gap-2">
                                   <span className="text-[8px] md:text-[9px] font-black text-brand-teal bg-brand-teal/5 px-3 py-1 rounded-lg uppercase tracking-widest italic border border-brand-teal/10">{dr.spec}</span>
                                   <span className="text-[8px] md:text-[9px] font-black text-gray-300 bg-gray-50 px-3 py-1 rounded-lg uppercase tracking-widest italic">{dr.experience} Years</span>
                                </div>
                                <h3 className="font-dm text-base md:text-xl font-extrabold text-slate-950 leading-snug uppercase group-hover:text-teal-600 transition-colors break-words">{dr.name}</h3>
                                <div className="text-[10px] md:text-xs text-gray-400 font-dm font-bold flex items-center justify-start gap-2">
                                   <div className={`h-2 w-2 rounded-full ${dr.status === 'online' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                                   {dr.status === 'online' ? 'Available Today' : 'Next Available: Tomorrow'}
                                </div>
                             </div>

                             <div className="flex items-center gap-3 p-3 md:p-4 bg-gray-50/50 rounded-xl md:rounded-2xl border border-black/[0.01]">
                                <MapPin size={14} className="text-brand-teal shrink-0"/>
                                <div className="text-[9px] md:text-[10px] font-black text-[#0a1628] uppercase italic leading-tight truncate">{dr.hospital}</div>
                             </div>
                          </div>
                       </div>

                       <div className="grid grid-cols-2 gap-3 mt-5 pt-5 border-t border-slate-100 relative z-10">
                          <Link to={`/doctors/${dr.id}`} className="block">
                             <button className="w-full h-14 md:h-16 bg-gray-50 border border-black/[0.02] text-[#0a1628] font-syne font-black text-[9px] md:text-[10px] uppercase italic tracking-wider md:tracking-widest rounded-xl md:rounded-2xl hover:bg-[#0a1628] hover:text-white transition-all duration-500">
                                View Profile
                             </button>
                          </Link>
                          <button className="w-full h-14 md:h-16 bg-brand-teal text-[#0a1628] font-syne font-black text-[9px] md:text-[10px] uppercase italic tracking-wider md:tracking-widest rounded-xl md:rounded-2xl shadow-mint hover:scale-[1.05] active:scale-95 transition-all flex items-center justify-center gap-1.5 md:gap-2 overflow-hidden">
                             <Video size={16} /> Book <span className="opacity-40">₹{dr.fee}</span>
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
