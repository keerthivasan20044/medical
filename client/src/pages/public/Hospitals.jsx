import { useState, useMemo } from 'react';
import { Search, MapPin, Phone, Clock, Activity, ShieldCheck, ChevronRight, Award, Bed, Building2, Stethoscope, Briefcase, Zap, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { hospitals } from '../../utils/data.js';
import { useLanguage } from '../../context/LanguageContext';

export default function HospitalsPage() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredHospitals = useMemo(() => {
    return hospitals.filter(h => 
      h.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      h.address.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-48">
      {/* Hospital Directory Section */}
      <section className="bg-gradient-to-br from-[#0a1628] to-[#1a3440] pt-32 pb-60 relative overflow-hidden">
        <div className="absolute inset-0 bg-[#0a1628]/20 backdrop-blur-[2px]" />
        <div className="absolute top-0 right-0 h-full w-1/3 bg-brand-teal/5 blur-[120px]" />
        <div className="absolute -bottom-32 -left-32 h-96 w-96 bg-brand-teal opacity-5 rounded-full blur-[100px]" />
        
        <div className="max-w-7xl mx-auto px-10 relative z-10 space-y-12">
           <div className="flex items-center gap-4 text-[10px] font-black text-white/40 uppercase tracking-[0.4em] italic mb-8">
              <span>{t('home')}</span> <ChevronRight size={14} className="opacity-40" /> <span>{t('hospitals')}</span>
           </div>
           
           <div className="space-y-6">
              <h1 className="font-syne font-black text-6xl lg:text-[7rem] text-white leading-[0.85] tracking-tighter uppercase italic drop-shadow-2xl">
                 Medical <br/><span className="text-brand-teal">Centers</span>
              </h1>
              <div className="flex flex-col lg:flex-row gap-12 items-end justify-between pt-10">
                 <p className="text-white/40 font-dm text-2xl italic max-w-xl leading-relaxed">
                    Providing quality healthcare services across the district.
                 </p>
                 <button className="h-20 px-12 bg-white/5 border border-white/10 text-white font-syne font-black text-[10px] uppercase italic tracking-[0.3em] rounded-2xl hover:bg-brand-teal hover:text-[#0a1628] transition-all duration-700 flex items-center gap-4 active:scale-95 shadow-4xl group">
                    <MapPin size={24} className="group-hover:translate-y-[-4px] transition-transform"/> {t('gridMap')}
                 </button>
              </div>
           </div>

           {/* Search Bar */}
           <div className="flex flex-col lg:flex-row gap-8 items-stretch pt-20">
              <div className="flex-1 h-24 bg-white/5 backdrop-blur-3xl rounded-[2.5rem] shadow-4xl flex items-center px-10 border border-white/10 focus-within:border-brand-teal transition-all group overflow-hidden">
                 <div className="h-16 w-16 bg-brand-teal rounded-2xl flex items-center justify-center text-[#0a1628] shadow-mint group-focus-within:bg-white transition-all duration-700">
                    <Search size={28}/>
                 </div>
                 <input 
                    type="text" 
                    placeholder={t('searchHospital')} 
                    className="flex-1 bg-transparent px-8 font-syne font-black text-xl italic outline-none text-white placeholder-white/20"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                 />
              </div>
           </div>
        </div>
      </section>

      {/* Verified Medical Facilities */}
      <div className="max-w-7xl mx-auto px-10 -mt-32 relative z-20 space-y-16">
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
            {filteredHospitals.map((h, idx) => (
               <motion.div 
                 key={h.id}
                 initial={{ opacity: 0, y: 30 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: idx * 0.1 }}
                 className="bg-white rounded-[5rem] overflow-hidden border border-black/[0.03] shadow-soft hover:shadow-4xl transition-all duration-1000 group relative flex flex-col h-full"
               >
                  {/* Top: Hospital Image Section */}
                  <div className="h-72 w-full relative overflow-hidden shrink-0">
                     <img src={h.image} alt={h.name} className="h-full w-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110" />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700" />
                     <div className="absolute top-8 left-8 flex flex-col gap-3">
                        <div className="px-5 py-2 bg-[#0a1628]/80 backdrop-blur-md rounded-xl text-[9px] font-black text-brand-teal uppercase tracking-widest italic border border-brand-teal/20 shadow-4xl">
                           {h.type} Facility
                        </div>
                        <div className="px-5 py-2 bg-red-500 rounded-xl text-[9px] font-black text-white uppercase tracking-widest italic flex items-center gap-2 border border-red-400/30 shadow-4xl animate-pulse">
                           <Activity size={12}/> Emergency Ready
                        </div>
                     </div>
                     <div className="absolute bottom-6 right-8 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-700">
                        <div className="h-16 w-16 bg-white rounded-2xl flex items-center justify-center text-[#0a1628] shadow-mint"><Zap size={24}/></div>
                     </div>
                  </div>

                  {/* Middle: Facility Details */}
                  <div className="p-12 flex-1 flex flex-col space-y-10 justify-between">
                     <div className="space-y-6">
                        <div className="space-y-2">
                           <h3 className="font-syne font-black text-3xl text-[#0a1628] leading-[0.9] tracking-tighter uppercase italic group-hover:text-brand-teal transition-colors truncate">{h.name}</h3>
                           <div className="flex items-center gap-3 text-gray-300 font-dm font-bold italic text-sm">
                              <MapPin size={14} className="text-brand-teal shrink-0" /> {h.address}
                           </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                           <div className="bg-gray-50/80 border border-black/[0.01] rounded-2xl p-6 flex flex-col items-center justify-center text-center group-hover:bg-[#0a1628]/5 transition-all">
                              <Bed size={20} className="text-brand-teal mb-2" />
                              <div className="font-syne font-black text-[#0a1628] text-xl italic">{h.beds}</div>
                              <div className="text-[8px] font-black text-gray-300 uppercase tracking-widest italic">Total Beds</div>
                           </div>
                           <div className="bg-gray-50/80 border border-black/[0.01] rounded-2xl p-6 flex flex-col items-center justify-center text-center group-hover:bg-[#0a1628]/5 transition-all">
                              <Award size={20} className="text-brand-teal mb-2" />
                              <div className="font-syne font-black text-[#0a1628] text-xl italic truncate max-w-full">NABH</div>
                              <div className="text-[8px] font-black text-gray-300 uppercase tracking-widest italic">Accreditation</div>
                           </div>
                        </div>

                        <div className="space-y-4 pt-4">
                           <div className="text-[10px] font-black text-gray-300 uppercase tracking-widest italic flex items-center gap-4">
                              <div className="h-px bg-black/[0.03] flex-1" /> DEPARTMENTS <div className="h-px bg-black/[0.03] flex-1" />
                           </div>
                           <div className="flex flex-wrap gap-2">
                              {h.departments.slice(0, 4).map(dep => (
                                 <span key={dep} className="px-4 py-2 bg-white border border-black/[0.03] rounded-xl text-[8px] font-black text-[#0a1628]/40 uppercase tracking-widest italic group-hover:border-black/5 group-hover:text-[#0a1628] transition-all">{dep}</span>
                              ))}
                              {h.departments.length > 4 && <span className="px-4 py-2 border border-black/[0.03] rounded-xl text-[8px] font-black text-brand-teal uppercase italic tracking-widest">+ {h.departments.length - 4} {t('more')}</span>}
                           </div>
                        </div>
                     </div>

                     <div className="pt-10 border-t border-black/[0.03] flex flex-col gap-4">
                        <div className="flex items-center justify-between text-[#0a1628]">
                           <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest italic">24/7 Helpline</span>
                           <span className="font-syne font-black text-xl italic tracking-tighter flex items-center gap-4 group-hover:text-brand-teal transition-colors">
                              <Phone size={18} fill="currentColor" className="opacity-20 translate-y-1" /> {h.phone}
                           </span>
                        </div>
                        <Link to="/emergency" className="block">
                           <button className="w-full h-16 bg-gray-50 border border-black/[0.02] text-[#0a1628] font-syne font-black text-[10px] uppercase italic tracking-widest rounded-2xl hover:bg-[#0a1628] hover:text-white transition-all duration-700 flex items-center justify-center gap-3 active:scale-95">
                              View Details <ChevronRight size={16}/>
                           </button>
                        </Link>
                     </div>
                  </div>
               </motion.div>
            ))}
         </div>

         {/* Emergency Services Section */}
         <section className="bg-red-500 rounded-[5rem] p-12 lg:p-24 relative overflow-hidden group shadow-4xl border border-red-400/30">
            <div className="absolute top-0 right-0 h-full w-1/2 bg-white/5 skew-x-[-20deg] group-hover:translate-x-full transition-transform duration-1000" />
            <div className="absolute bottom-0 left-0 h-64 w-64 bg-black/10 rounded-full blur-[80px]" />
            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
               <div className="space-y-6 text-center lg:text-left">
                  <div className="h-20 w-20 bg-white rounded-3xl flex items-center justify-center text-red-500 shadow-4xl animate-bounce mx-auto lg:mx-0"><Activity size={48}/></div>
                  <h2 className="font-syne font-black text-5xl lg:text-[5.5rem] text-white tracking-tighter uppercase italic leading-none">Emergency <br/><span className="text-white/40 italic">Services</span></h2>
                  <p className="text-white font-dm italic font-bold text-2xl max-w-xl">{t('districtArchitectureHeader')}</p>
               </div>
               <div className="flex flex-col items-center gap-8">
                  <div className="text-center">
                     <div className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em] italic mb-2 leading-none">DIAL</div>
                     <div className="font-syne font-black text-8xl lg:text-[10rem] text-white leading-none tracking-tighter italic drop-shadow-2xl">108</div>
                  </div>
                  <button className="h-24 px-16 bg-white text-red-500 font-syne font-black text-xs uppercase italic tracking-[0.3em] rounded-[2.5rem] shadow-4xl hover:scale-[1.05] active:scale-95 transition-all flex items-center gap-6 group">
                     Call Now <ChevronRight size={24} className="group-hover:translate-x-2 transition-transform"/>
                  </button>
               </div>
            </div>
         </section>
      </div>
    </div>
  );
}
