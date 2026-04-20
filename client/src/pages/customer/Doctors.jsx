import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Star, MapPin, Video, Phone, Calendar, 
  ChevronRight, ArrowRight, Filter, Clock, GraduationCap, 
  Heart, CheckCircle, Verified, ShieldCheck, Activity, Globe, Info, Zap, Store
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { doctors as mockDoctors } from '../../utils/data.js';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { doctorService } from '../../services/apiServices';
import { Loader2 } from 'lucide-react';

const SPECIALTIES = [
  'All', 'General Physician', 'Cardiologist', 'Paediatrician', 'Gynaecologist',
  'Orthopaedic', 'Dermatologist', 'ENT', 'Ophthalmologist', 'Diabetologist'
];

export default function Doctors() {
  const { t, language } = useLanguage();
  const [activeSpec, setActiveSpec] = useState('All');
  const [search, setSearch] = useState('');

  const [doctorsList, setDoctorsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const data = await doctorService.getAll();
      setDoctorsList(data.items || data.doctors || data || []);
    } catch (err) {
      console.warn('Doctor sync failed, using mock registry...', err);
      setDoctorsList(mockDoctors);
    } finally {
      setLoading(false);
    }
  };

  const filteredDocs = useMemo(() => {
    return (doctorsList.length > 0 ? doctorsList : mockDoctors).filter(doc => {
      const spec = doc.spec || doc.specialization || 'General Physician';
      const name = doc.name || 'Anonymous Practitioner';
      const matchesSpec = activeSpec === 'All' || spec === activeSpec;
      const matchesSearch = name.toLowerCase().includes(search.toLowerCase()) || 
                           spec.toLowerCase().includes(search.toLowerCase());
      return matchesSpec && matchesSearch;
    });
  }, [activeSpec, search, doctorsList]);

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-40">
      {/* Medical Hub Hero */}
      <section className="bg-[#0a1628] text-white pt-24 pb-48 relative overflow-hidden">
        <div className="absolute top-0 right-0 h-96 w-96 bg-[#028090] opacity-5 rounded-full blur-[120px]" />
        <div className="max-w-7xl mx-auto px-10 relative z-10 text-center">
          <div className="flex flex-col items-center space-y-8">
            <div className="px-5 py-2 bg-brand-teal/10 border border-brand-teal/20 rounded-2xl w-fit flex items-center gap-2 text-[10px] font-black text-brand-teal uppercase tracking-[0.3em] italic">
              <Verified className="animate-pulse" size={14} /> {t('personnelRegistry')} v4.2
            </div>
            <h1 className="font-syne font-black text-4xl sm:text-5xl md:text-7xl lg:text-9xl text-white leading-[0.9] tracking-tighter uppercase italic px-4">
               {t('consultDoctorsTitle')}
            </h1>
            <p className="text-white/40 font-dm text-lg md:text-2xl italic max-w-3xl leading-relaxed px-6">
               {t('consultDoctorsSubtitle')}
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto relative group mt-12 md:mt-16 px-6">
             <div className="absolute left-12 md:left-10 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#028090] transition">
                <Search size={24} className="md:w-8 md:h-8" />
             </div>
             <input 
                type="text" 
                placeholder={t('searchDoctorsPlaceholder')} 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-16 md:h-24 pl-16 md:pl-24 pr-10 md:pr-64 rounded-2xl md:rounded-[3rem] border border-white/10 bg-white/5 backdrop-blur-3xl font-dm text-lg md:text-2xl italic text-white shadow-4xl focus:outline-none focus:ring-4 focus:ring-[#028090]/20 transition-all placeholder:text-[12px] md:placeholder:text-2xl placeholder:italic placeholder-white/20"
             />
             <div className="absolute right-3 top-3 bottom-3 hidden md:flex items-center gap-4 bg-white/5 border border-white/10 px-8 rounded-[2rem] text-white font-syne font-black text-[10px] uppercase tracking-widest italic backdrop-blur-3xl group-focus-within:bg-white group-focus-within:text-[#0a1628] transition-all">
                <MapPin size={18} className="text-[#02C39A]" /> {t('karaikalNode')}
             </div>
          </div>

        </div>
      </section>

      {/* specialty Intelligence chips */}
      <section className="max-w-7xl mx-auto px-10 -mt-24 relative z-20">
         <div className="bg-white border border-gray-100 rounded-[3.5rem] p-10 shadow-4xl flex items-center gap-4 overflow-x-auto no-scrollbar">
            <div className="h-16 w-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 shrink-0 shadow-inner"><Filter size={24} /></div>
            {SPECIALTIES.map(s => (
               <button 
                 key={s} 
                 onClick={() => setActiveSpec(s)}
                 className={`px-10 h-16 rounded-[2rem] font-syne font-black text-[10px] uppercase tracking-widest transition-all duration-500 whitespace-nowrap shadow-soft active:scale-95 ${activeSpec === s ? 'bg-[#0a1628] text-white shadow-4xl scale-110 translate-x-1' : 'bg-gray-50 text-gray-400 hover:bg-white border border-gray-100'}`}
               >
                  {s}
               </button>
            ))}
         </div>
      </section>

      <section className="max-w-7xl mx-auto px-10 py-24">
         <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16 px-4">
            <div className="space-y-2">
               <h2 className="font-syne font-black text-[#0a1628] text-5xl uppercase tracking-tighter italic">{filteredDocs.length} {t('activeSpecialists')}</h2>
               <div className="text-[10px] font-black text-brand-teal uppercase tracking-widest italic leading-none">{t('authorizedCredentials')}</div>
            </div>
            <div className="flex items-center gap-4 text-[10px] font-black text-brand-teal uppercase tracking-widest bg-brand-teal/5 border border-brand-teal/10 px-6 py-3 rounded-2xl italic">
               <ShieldCheck size={18} /> {t('secureProtocolActive')}
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-12">
            <AnimatePresence mode="popLayout">
               {filteredDocs.map((doc, idx) => (
                  <motion.div 
                    layout
                    key={doc.id}
                    initial={{ opacity: 0, scale: 0.9, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 30 }}
                    transition={{ duration: 0.5, delay: idx * 0.05 }}
                    className="group bg-white rounded-[4rem] border border-gray-100 p-12 shadow-soft hover:shadow-4xl hover:border-brand-teal/20 transition-all duration-700 relative flex flex-col h-full overflow-hidden"
                  >
                     <div className="absolute top-0 right-0 h-40 w-40 bg-brand-teal opacity-[0.02] rounded-full blur-[60px]" />
                     <div className="absolute top-8 right-8 flex flex-col gap-3 relative z-10">
                        <div className="h-14 w-14 rounded-2xl border border-gray-100 bg-white/50 backdrop-blur-md flex items-center justify-center text-gray-300 hover:text-red-500 hover:shadow-2xl transition-all duration-500 cursor-pointer shadow-sm active:scale-95"><Heart size={20} /></div>
                     </div>
                     
                     <div className="flex flex-col items-center text-center space-y-8 relative z-10">
                        <div className="relative">
                           <div className="absolute inset-0 bg-brand-teal rounded-[3rem] blur-2xl opacity-10 scale-90 group-hover:scale-110 transition duration-700" />
                           <img src={doc.image} alt={doc.name} className="h-40 w-40 rounded-[3.5rem] object-cover ring-[12px] ring-gray-50 p-2 group-hover:scale-105 transition duration-1000 relative grayscale-[0.2] group-hover:grayscale-0" />
                           <div className={`absolute -bottom-2 -right-2 h-10 w-10 border-8 border-white rounded-full ${doc.status === 'online' ? 'bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.5)] animate-pulse' : doc.status === 'busy' ? 'bg-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.5)]' : 'bg-gray-400'}`} />
                        </div>

                        <div className="space-y-3">
                           <h3 className="font-syne font-black text-[#0a1628] text-3xl group-hover:text-brand-teal transition-all duration-500 leading-none uppercase tracking-tighter italic">{doc.name}</h3>
                           <div className="text-[10px] font-black text-brand-teal uppercase tracking-widest italic border border-brand-teal/10 bg-brand-teal/5 px-4 py-2 rounded-xl inline-block">{doc.spec} · {doc.qual}</div>
                        </div>

                        <div className="flex items-center gap-3 text-[11px] font-black text-amber-500 italic">
                           <Star size={18} fill="currentColor" /> {doc.rating} <span className="text-gray-200 font-black uppercase tracking-widest border-l border-gray-100 pl-3 ml-1">({doc.consultations} Syncs)</span>
                        </div>

                         <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-gray-100 to-transparent" />

                         <div className="w-full space-y-6">
                            <div className="flex items-center justify-between px-2">
                               <div className="flex items-center gap-3">
                                  <div className="h-8 w-8 bg-brand-teal/5 rounded-lg flex items-center justify-center text-brand-teal"><Clock size={16}/></div>
                                  <div className="text-[10px] font-black text-gray-400 uppercase italic">Next Sync Available</div>
                               </div>
                               <div className="text-sm font-syne font-black text-[#0a1628] italic uppercase">Today 4PM</div>
                            </div>
                            <div className="flex items-center justify-between px-2">
                               <div className="flex items-center gap-3">
                                  <div className="h-8 w-8 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-400"><Store size={16}/></div>
                                  <div className="text-[10px] font-black text-gray-400 uppercase italic">Clinical Node</div>
                               </div>
                               <div className="text-[10px] font-black text-[#0a1628] uppercase italic truncate max-w-[120px]">{(doc.hospital || doc.clinic || 'Karaikal Enclave').split(',')[0]}</div>
                            </div>
                         </div>

                         <div className="w-full flex flex-col gap-3 pt-4 mt-auto">
                            <Link to={`/doctors/${doc.id}`} className="w-full h-16 bg-[#0a1628] text-white rounded-[1.5rem] font-syne font-black text-[10px] uppercase tracking-[0.2em] hover:bg-brand-teal shadow-soft hover:shadow-4xl transition-all duration-500 flex items-center justify-center gap-3 group/btn relative overflow-hidden">
                               <div className="absolute inset-0 bg-brand-teal opacity-0 group-hover/btn:opacity-10 transition duration-700" />
                               {t('bookSession')} <ArrowRight size={16} className="group-hover/btn:translate-x-2 transition duration-500" />
                            </Link>
                            <button className="w-full h-14 border-2 border-brand-teal/10 bg-white text-brand-teal rounded-[1.5rem] font-syne font-black text-[10px] uppercase tracking-[0.2em] hover:bg-brand-teal/5 transition-all duration-500 flex items-center justify-center gap-3">
                               <Video size={18} /> {t('videoConsultation')}
                            </button>
                         </div>
                      </div>
                   </motion.div>
                ))}
             </AnimatePresence>
          </div>
         
         {/* Emergency Pulse Hub */}
         <div className="mt-40 p-16 md:p-24 bg-[#0a1628] rounded-[5rem] text-white relative overflow-hidden group border-l-[16px] border-red-500 shadow-4xl">
            <div className="absolute top-0 right-0 h-[600px] w-[600px] bg-brand-teal opacity-[0.03] rounded-full blur-[160px]" />
            <div className="relative z-10 grid lg:grid-cols-[1fr_auto] items-center gap-20">
               <div className="space-y-12 max-w-2xl text-center lg:text-left">
                  <div className="space-y-6">
                     <div className="px-5 py-2 bg-red-500/10 border border-red-500/20 rounded-2xl w-fit flex items-center gap-2 text-[10px] font-black text-red-500 uppercase tracking-[0.3em] mx-auto lg:mx-0">
                        <Activity className="animate-ping" size={14} /> Emergency Synchronization Hub
                     </div>
                     <h2 className="font-syne font-black text-6xl md:text-8xl leading-[0.9] tracking-tighter uppercase italic">{t('emergencyAssistanceTitle')}</h2>
                     <p className="text-white/40 font-dm text-2xl italic leading-relaxed">{t('emergencyAssistanceSub')}</p>
                  </div>
                  <div className="flex flex-wrap justify-center lg:justify-start gap-10">
                     <div className="space-y-2">
                        <div className="text-[10px] font-black uppercase text-white/20 tracking-[0.3em] italic">Ambulance Telemetry</div>
                        <div className="flex items-center gap-4 text-4xl font-syne font-black text-red-500"><Phone size={32} /> 108</div>
                     </div>
                     <div className="h-16 w-px bg-white/10 hidden md:block" />
                     <div className="space-y-2">
                        <div className="text-[10px] font-black uppercase text-white/20 tracking-[0.3em] italic">GGH Karaikal Node</div>
                        <div className="flex items-center gap-4 text-4xl font-syne font-black text-white"><MapPin size={32} /> 04368-222288</div>
                     </div>
                  </div>
               </div>
               <button className="h-32 w-32 md:h-48 md:w-48 bg-red-500 text-white rounded-[3.5rem] shadow-[0_0_80px_rgba(239,68,68,0.4)] hover:bg-white hover:text-red-500 active:scale-95 transition-all duration-700 font-syne font-black text-lg md:text-xl uppercase tracking-tighter italic leading-none rotate-12 hover:rotate-0 flex items-center justify-center p-8 text-center group cursor-pointer lg:mt-0 mt-8 mx-auto lg:mx-0">
                  {t('contactHelplineNow')} &rarr;
               </button>
            </div>
         </div>
      </section>
    </div>
  );
}
