import { motion, AnimatePresence } from 'framer-motion';
import { useState, useMemo, useEffect } from 'react';
import { 
  ShieldCheck, Truck, Zap, Phone, Package, Search, 
  Store, CreditCard, MapPin, User, ChevronRight, 
  Star, FileText, Headphones, ArrowRight, Play, CheckCircle, 
  X, AlertCircle, Share2, Upload, Activity, Clock, Globe, Heart,
  Database, Terminal, Cpu
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { doctors } from '../../utils/data.js';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { medicineService } from '../../services/apiServices';
import { normalizeUrl } from '../../utils/url';
const vaccineImg = '/assets/vaccine_pro.png';
const prescriptionImg = '/assets/medicine_default.png';
const doctorImg = '/assets/doctor_pro.png';
const patientImg = '/assets/doctor_pro.png';
const familyImg = '/assets/medicine_default.png';

export function VaccineShowcase() {
   const { t } = useLanguage();
   const [vaccines, setVaccines] = useState([]);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
     const controller = new AbortController();

     const fetchVaccines = async () => {
        try {
           const data = await medicineService.getAll({ isVaccine: true, limit: 6 });
           if (!controller.signal.aborted) {
             setVaccines(data.items || []);
           }
        } catch (err) {
           if (err.name === 'AbortError' || err.code === 'ERR_CANCELED') return;
           console.error('Vaccine fetch error:', err);
        } finally {
           if (!controller.signal.aborted) setLoading(false);
        }
     };
     fetchVaccines();
     return () => controller.abort();
   }, []);

   return (
      <section className="py-16 md:py-32 bg-[#028090]/5 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-teal/5 rounded-full blur-[150px]" />
         <div className="max-w-7xl mx-auto px-4 md:px-10 relative z-10">
            <div className="flex items-center justify-between mb-12 md:mb-20 border-l-8 border-brand-teal pl-6 md:pl-10">
               <h2 className="font-syne font-black text-[#0a1628] text-4xl md:text-6xl leading-[0.9] uppercase italic tracking-tighter">
                  {t('vaccinesAvailable')}
               </h2>
               <div className="hidden lg:flex items-center gap-4 bg-white/50 backdrop-blur-xl px-8 py-4 rounded-[2rem] border border-black/[0.03]">
                  <Activity size={24} className="text-brand-teal animate-pulse" />
                  <span className="text-[10px] font-black text-[#0a1628] uppercase tracking-[0.3em] italic">Everything Ready</span>
               </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
               {loading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-96 bg-white/20 animate-pulse rounded-[3.5rem] border-4 border-white" />
                  ))
               ) : vaccines.length > 0 ? (
                 vaccines.map((v, i) => (
                   <motion.div 
                      key={v._id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1, duration: 0.8 }}
                      className={`group bg-white rounded-[3.5rem] border-4 border-white shadow-3xl overflow-hidden flex flex-col h-full transition-all duration-700 hover:shadow-4xl hover:border-brand-teal/20 ${v.stockCount > 0 ? '' : 'opacity-40 grayscale pointer-events-none'}`}
                   >
                      <div className="h-64 overflow-hidden shrink-0 relative shadow-inner">
                         <img src={normalizeUrl(v.images?.[0]?.url || v.images?.[0]) || vaccineImg} alt={v.name} className="h-full w-full object-cover group-hover:scale-125 transition duration-1000" />
                         <div className={`absolute bottom-6 left-6 text-[9px] font-black px-5 py-2.5 rounded-xl shadow-4xl uppercase italic tracking-[0.2em] border ${v.stockCount > 0 ? 'bg-brand-teal text-[#0a1628] border-brand-teal/20' : 'bg-gray-400 text-white border-transparent'}`}>
                            {v.stockCount > 0 ? `✓ ${t('available')}` : `✗ ${t('outOfStock')}`}
                         </div>
                      </div>
                     <div className="p-10 flex-1 flex flex-col justify-between space-y-6 relative">
                         <div className="space-y-3">
                            <h3 className="font-syne font-black text-[#0a1628] text-xl uppercase italic tracking-tighter truncate">{v.name}</h3>
                            <div className="text-[10px] font-black text-brand-teal uppercase tracking-[0.3em] italic">Dose: {v.generic || 'Standard'}</div>
                         </div>
                         <div className="pt-8 border-t-2 border-dashed border-black/[0.05] flex items-center justify-between gap-6">
                            <div className="grow">
                               <div className="text-[9px] text-gray-300 uppercase tracking-widest font-black italic mb-1">{t('storeLocation')}</div>
                               <div className="text-xs font-black text-[#0a1628] uppercase italic truncate tracking-tight">{v.brand || 'Central'}</div>
                            </div>
                            <div className="text-right shrink-0">
                               <div className="text-[9px] text-gray-300 uppercase tracking-widest font-black italic mb-1">{t('priceCard')}</div>
                               <div className="text-xs font-black text-brand-teal leading-none italic">₹{v.price}</div>
                            </div>
                         </div>
                      </div>
                   </motion.div>
                 ))
               ) : (
                 <div className="col-span-full py-20 text-center opacity-30">
                    <Activity size={48} className="mx-auto mb-4" />
                    <div className="font-syne font-black text-xl uppercase italic tracking-widest">No vaccines available.</div>
                 </div>
               )}
            </div>
         </div>
      </section>
   );
}

export function HowItWorks() {
   const { t } = useLanguage();
   const STEPS = [
      { id: '01', icon: Search, title: t('searchMedicineTitle'), desc: t('searchMedicineDesc') },
      { id: '02', icon: Store, title: t('choosePharmacyTitle'), desc: t('choosePharmacyDesc') },
      { id: '03', icon: CreditCard, title: t('payYourWayTitle'), desc: t('payYourWayDesc') },
      { id: '04', icon: Truck, title: t('liveGpsTitle'), desc: t('liveGpsDesc') }
   ];

   return (
      <section className="py-16 lg:py-40 bg-[#0a1628] relative overflow-hidden">
         {/* Network Overlay */}
         <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(2,195,154,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(2,195,154,0.1) 1px, transparent 1px)', backgroundSize: '80px 80px' }} />
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[600px] bg-brand-teal/5 rounded-full blur-[250px] opacity-20" />
         
         <div className="max-w-7xl mx-auto px-4 md:px-10 relative z-10">
            <div className="text-center space-y-8 mb-16 md:mb-32">
               <div className="inline-flex items-center gap-4 px-6 py-2 bg-white/5 border border-white/10 rounded-full text-brand-teal font-syne font-black text-[10px] uppercase tracking-[0.4em] italic shadow-2xl">
                  <Cpu size={14} className="animate-spin-slow" /> Fast Delivery
               </div>
               <h2 className="font-syne font-black text-white text-4xl md:text-8xl leading-none uppercase italic tracking-tighter drop-shadow-4xl">
                  {t('howItWorks')}
               </h2>
               <p className="text-white/30 font-dm text-lg md:text-2xl italic font-bold max-w-3xl mx-auto">Karaikal Healthcare Network</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 lg:gap-12 relative">
               {/* HUD Connector HUD Path */}
               <div className="hidden lg:block absolute top-[3.5rem] left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-transparent via-brand-teal/20 to-transparent z-0" />
               
               {STEPS.map((s, i) => (
                  <motion.div 
                     key={i}
                     initial={{ opacity: 0, scale: 0.8 }}
                     whileInView={{ opacity: 1, scale: 1 }}
                     transition={{ delay: i * 0.15, duration: 0.8 }}
                     className="text-center space-y-8 group z-10"
                  >
                     <div className="relative mx-auto h-28 w-28 bg-white/5 border-2 border-white/10 rounded-[3rem] flex items-center justify-center text-brand-teal group-hover:bg-brand-teal group-hover:text-[#0a1628] group-hover:rotate-12 group-hover:scale-110 transition-all duration-700 shadow-4xl group-hover:shadow-brand-teal/20 backdrop-blur-3xl">
                        <s.icon size={44} className="transition-transform duration-500 group-hover:rotate-[-12deg]" />
                        <div className="absolute -top-4 -right-4 h-12 w-12 bg-[#0a1628] text-brand-teal text-sm font-syne font-black rounded-2xl flex items-center justify-center border-4 border-white/10 group-hover:bg-brand-teal group-hover:text-[#0a1628] transition-all duration-700 shadow-3xl">
                           {s.id}
                        </div>
                     </div>
                     <div className="space-y-4">
                        <h3 className="font-syne font-black text-white text-2xl uppercase italic tracking-tighter group-hover:text-brand-teal transition-colors">{s.title}</h3>
                        <div className="h-1 w-12 bg-brand-teal/20 rounded-full mx-auto group-hover:w-full transition-all duration-700" />
                        <p className="text-white/20 font-dm text-sm leading-relaxed px-6 italic group-hover:text-white/40 transition-colors uppercase tracking-widest font-black text-[10px]">{s.desc}</p>
                     </div>
                  </motion.div>
               ))}
            </div>
         </div>
      </section>
   );
}

export function DoctorsConsultation() {
   const { t } = useLanguage();
   const DOCS = [
      { name: 'Dr. S. Priya Raman', spec: 'General Physician', rating: 4.8, fee: 200, status: 'Online Now', color: 'bg-emerald-500', img: doctorImg },
      { name: 'Dr. K. Anand Kumar', spec: 'Cardiologist', rating: 4.9, fee: 500, status: 'Online', color: 'bg-brand-teal', img: doctorImg },
      { name: 'Dr. M. Meena Krishnan', spec: 'Pediatrician', rating: 4.7, fee: 300, status: 'Busy', color: 'bg-amber-500', img: doctorImg },
      { name: 'Dr. R. Suresh Prabhu', spec: 'Dermatologist', rating: 4.6, fee: 350, status: 'Offline', color: 'bg-gray-400', img: doctorImg }
   ];

   return (
      <section className="py-16 md:py-32 bg-[#f8fafc] relative overflow-hidden">
         <div className="max-w-7xl mx-auto px-4 md:px-10">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 mb-16 md:mb-24 border-l-8 border-brand-teal pl-6 md:pl-10">
               <div className="space-y-6 text-center lg:text-left grow">
                  <h2 className="font-syne font-black text-[#0a1628] text-4xl md:text-7xl leading-[0.9] uppercase italic tracking-tighter">{t('consultOnline')}</h2>
                  <p className="text-gray-400 font-dm text-lg md:text-2xl max-w-3xl italic font-bold leading-relaxed">{t('speakWithDoctors')}</p>
               </div>
               <Link to="/doctors" className="px-10 py-5 md:px-12 md:py-6 bg-[#0a1628] text-brand-teal font-syne font-black text-lg md:text-xl uppercase italic tracking-widest rounded-[1.5rem] md:rounded-[2rem] shadow-4xl hover:bg-brand-teal hover:text-[#0a1628] transition-all duration-700 flex items-center justify-center gap-4 group mx-auto lg:mx-0">
                  {t('viewAllDoctors')} <ArrowRight size={24} className="group-hover:translate-x-4 transition-transform duration-500" />
               </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
               {DOCS.map((doc, i) => (
                  <motion.div 
                     key={i}
                     initial={{ opacity: 0, scale: 0.9 }}
                     whileInView={{ opacity: 1, scale: 1 }}
                     transition={{ delay: i * 0.1, duration: 0.8 }}
                     className="bg-white rounded-[4rem] p-10 border-2 border-black/[0.03] shadow-3xl hover:shadow-4xl hover:border-brand-teal/20 transition-all duration-700 group relative overflow-hidden"
                  >
                     <div className="absolute top-8 right-8">
                        <div className="h-12 w-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all duration-500 cursor-pointer shadow-inner"><Heart size={20} /></div>
                     </div>
                     <div className="flex flex-col items-center text-center space-y-6 pt-6 relative z-10">
                        <div className="relative">
                           <div className="absolute inset-[-8px] border-2 border-brand-teal/20 rounded-[2.5rem] animate-spin-slow opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                           <img src={doc.img} alt={doc.name} className="h-32 w-32 rounded-[2.5rem] object-cover ring-8 ring-gray-50 p-1 group-hover:scale-110 transition duration-1000 grayscale group-hover:grayscale-0" />
                           <div className={`absolute -bottom-2 -right-2 h-8 w-8 ${doc.color} border-4 border-white rounded-full flex items-center justify-center shadow-lg shadow-black/10`} />
                        </div>
                        <div className="space-y-2">
                           <h3 className="font-syne font-black text-[#0a1628] text-2xl uppercase italic tracking-tighter group-hover:text-brand-teal transition-colors truncate w-full">{doc.name}</h3>
                           <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-teal/10 rounded-xl text-brand-teal font-syne font-black text-[10px] uppercase tracking-[0.2em] italic">{doc.spec}</div>
                                      <div className="flex items-center gap-8 py-6 border-y-2 border-dashed border-black/[0.05] w-full justify-center">
                           <div className="flex flex-col">
                              <span className="text-[10px] text-gray-300 font-black uppercase tracking-widest italic leading-none mb-1">{t('fee')}</span>
                              <span className="text-lg font-syne font-black text-[#0a1628] italic">₹{doc.fee}</span>
                           </div>
                           <div className="flex flex-col">
                              <span className="text-[10px] text-gray-300 font-black uppercase tracking-widest italic leading-none mb-1">{t('rating')}</span>
                              <div className="flex items-center gap-1.5 text-sm font-black text-amber-500 italic">
                                 <Star size={16} fill="currentColor" /> {doc.rating}
                              </div>
                           </div>
                        </div>
             </div>
                        <button className="w-full py-5 bg-gray-50 text-[#0a1628] group-hover:bg-[#0a1628] group-hover:text-brand-teal rounded-[2rem] font-syne font-black text-xs uppercase italic tracking-[0.2em] transition-all duration-700 shadow-inner group-hover:shadow-4xl">Book Now</button>
                     </div>
                  </motion.div>
               ))}
            </div>
         </div>
      </section>
   );
}

export function GPSTracking() {
   const { t } = useLanguage();
   return (
      <section className="py-16 md:py-40 bg-white relative overflow-hidden">
         <div className="max-w-7xl mx-auto px-4 md:px-10 grid lg:grid-cols-2 gap-16 lg:gap-32 items-center">
            <div className="space-y-12 text-center lg:text-left">
               <div className="space-y-8">
                  <div className="h-16 w-16 md:h-20 md:w-20 bg-brand-teal/10 rounded-2xl md:rounded-3xl flex items-center justify-center text-brand-teal shadow-inner mx-auto lg:mx-0">
                     <Activity size={32} className="md:w-11 md:h-11 animate-pulse" />
                  </div>
                  <h2 className="font-syne font-black text-[#0a1628] text-4xl md:text-8xl leading-[0.9] uppercase italic tracking-tighter">{t('gpsTrackingTitle')}</h2>
                  <p className="text-gray-400 font-dm text-lg md:text-2xl italic font-bold leading-relaxed">{t('gpsTrackingDesc')}</p>
               </div>
               
               <div className="space-y-8">
                  {[
                     { label: 'Rider Tracking', desc: 'Real-time rider location' },
                     { label: 'Pharmacy Verification', desc: 'Verified partners' },
                     { label: 'Smart Arrival Time', desc: 'Accurate ETA' }
                  ].map((f, i) => (
                     <div key={i} className="flex gap-8 group">
                        <div className="h-10 w-10 border-2 border-brand-teal/20 rounded-2xl flex items-center justify-center text-brand-teal shrink-0 mt-1 duration-700 group-hover:bg-brand-teal group-hover:text-[#0a1628] group-hover:rotate-12 group-hover:scale-110 shadow-inner"><CheckCircle size={20} strokeWidth={3} /></div>
                        <div className="space-y-1">
                           <div className="font-syne font-black text-[#0a1628] uppercase tracking-[0.1em] italic text-lg group-hover:text-brand-teal transition-colors">{f.label}</div>
                           <p className="text-gray-400 font-dm text-sm italic font-bold">{f.desc}</p>
                        </div>
                     </div>
                  ))}
               </div>
            </div>

            <div className="relative w-full">
               <div className="absolute inset-0 bg-[#028090] rounded-full blur-[150px] md:blur-[250px] opacity-10" />
               <div className="relative bg-[#0a1628] border-4 md:border-8 border-white shadow-4xl rounded-[2.5rem] md:rounded-[5rem] p-6 md:p-16 h-[380px] md:h-[700px] overflow-hidden group">
                  {/* HUD Grid Layout */}
                  <div className="absolute inset-0 bg-[linear-gradient(white/5_1px,transparent_1px),linear-gradient(90deg,white/5_1px,transparent_1px)] bg-[size:40px_40px] opacity-20" />
                  
                  {/* District Radar Protocol */}
                  <motion.div 
                     animate={{ scale: [1, 2], opacity: [0.6, 0] }}
                     transition={{ repeat: Infinity, duration: 4 }}
                     className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] bg-brand-teal/5 rounded-full border-2 border-brand-teal/20"
                  />

                  {/* Animated Mission Path */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 400">
                     <path d="M50 350 Q200 300 150 200 T300 50" stroke="#02C39A" strokeWidth="6" strokeDasharray="12 12" fill="none" className="animate-dash" />
                  </svg>

                  {/* Customer Node */}
                  <div className="absolute left-[50px] bottom-[50px] space-y-4 z-20">
                     <div className="bg-[#0a1628] text-white text-[11px] font-black uppercase tracking-[0.3em] px-6 py-3 rounded-2xl shadow-4xl flex items-center gap-4 border-2 border-white/10 italic">
                        <div className="h-2 w-2 bg-red-500 rounded-full animate-ping" /> YOUR HOUSE
                     </div>
                     <div className="h-16 w-16 bg-white rounded-[1.5rem] shadow-4xl flex items-center justify-center text-red-500 border-4 border-red-500/10 scale-110 active:scale-95 transition-transform"><MapPin size={32} fill="currentColor" /></div>
                  </div>

                  {/* Terminal Node */}
                  <div className="absolute right-[80px] top-[60px] space-y-4 z-20">
                     <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 10, ease: "linear" }} className="h-16 w-16 bg-[#0a1628] rounded-[1.5rem] shadow-4xl flex items-center justify-center text-brand-teal border-2 border-brand-teal/40"><Store size={32} /></motion.div>
                     <div className="bg-white/90 backdrop-blur-3xl text-[#0a1628] text-[11px] font-black uppercase tracking-[0.3em] px-6 py-3 rounded-2xl border-2 border-gray-100 shadow-4xl italic">PHARMACY</div>
                  </div>

                  {/* Biker Transmission Animation */}
                  <motion.div 
                     animate={{ x: [0, 180, 120, 280], y: [0, -70, -180, -350] }}
                     transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                     className="absolute left-[70px] bottom-[70px] h-20 w-20 bg-brand-teal rounded-[2rem] shadow-[0_0_40px_rgba(2,195,154,0.4)] flex items-center justify-center text-[#0a1628] border-8 border-white z-20 hover:scale-125 transition-transform"
                  >
                     <Truck size={36} className="group-hover:rotate-12 transition-transform" />
                  </motion.div>

                  {/* Telemetry Status HUD */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#0a1628] p-8 md:p-12 rounded-[3rem] md:rounded-[4rem] border-2 border-white/10 shadow-4xl text-center space-y-4 w-[260px] md:w-80 transform group-hover:scale-110 transition duration-1000 z-30 backdrop-blur-3xl">
                     <div className="text-[8px] md:text-[10px] font-black text-white/40 uppercase tracking-[0.4em] leading-none italic">Delivery Progress</div>
                     <div className="font-syne font-black text-4xl md:text-6xl text-brand-teal tracking-tighter italic">04:12 <span className="text-white/10 text-base md:text-xl font-normal">MIN</span></div>
                     <div className="text-[8px] md:text-[10px] font-black text-emerald-400 uppercase tracking-widest border-2 border-emerald-500/20 rounded-full py-2 px-6 inline-block italic shadow-inner bg-emerald-500/5 animate-pulse">Rider Assigned</div>
                  </div>
               </div>
            </div>
         </div>
      </section>
   );
}

export function PrescriptionUpload() {
   const { t } = useLanguage();
   return (
      <section className="py-16 md:py-32 bg-gradient-to-br from-[#028090] via-[#02C39A] to-[#01606e] relative overflow-hidden">
         {/* Moving Mesh Background */}
         <div className="absolute top-[-10%] right-[-10%] h-[600px] w-[600px] bg-white rounded-full blur-[180px] opacity-10 animate-pulse" />
         
         <div className="max-w-7xl mx-auto px-4 md:px-10 grid lg:grid-cols-2 gap-16 lg:gap-24 items-center relative z-10">
            <div className="space-y-12 text-white text-center lg:text-left">
               <div className="space-y-6">
                  <div className="inline-flex items-center gap-4 px-6 py-2 bg-white/10 border border-white/20 rounded-full text-white font-syne font-black text-[10px] uppercase tracking-[0.4em] italic backdrop-blur-3xl shadow-2xl mx-auto lg:mx-0">
                     <Heart size={14} className="fill-white animate-pulse" /> Safe & Secure
                  </div>
                  <h2 className="font-syne font-black text-4xl md:text-8xl leading-[0.9] text-white uppercase italic tracking-tighter">
                     {t('prescriptionTitle')}
                  </h2>
               </div>
               
               <div className="grid sm:grid-cols-2 lg:grid-cols-1 gap-8">
                  {[
                     { label: 'Smart Scanning', desc: 'AI-powered prescription reading' },
                     { label: 'Pharmacist Review', desc: 'Manual verification by experts' },
                     { label: 'One-Click Refills', desc: 'Easy repeat orders' }
                  ].map((f, i) => (
                     <div key={i} className="flex gap-6 group bg-white/5 p-6 rounded-[2.5rem] border border-white/10 hover:bg-white/10 transition-all duration-500 backdrop-blur-3xl shadow-inner">
                        <div className="h-10 w-10 bg-white/20 rounded-2xl flex items-center justify-center text-white shrink-0 mt-1 shadow-2xl group-hover:rotate-12 group-hover:scale-110 transition-all duration-500"><CheckCircle size={20} strokeWidth={3} /></div>
                        <div className="space-y-1">
                           <div className="font-syne font-black text-xl uppercase italic tracking-tighter">{f.label}</div>
                           <p className="text-white/60 text-xs font-bold font-dm leading-relaxed uppercase tracking-widest">{f.desc}</p>
                        </div>
                     </div>
                  ))}
               </div>
               <div className="pt-8 flex justify-center lg:justify-start">
                  <Link to="/prescriptions" className="px-10 py-6 md:px-16 md:py-8 bg-[#0a1628] text-brand-teal font-syne font-black text-xl md:text-2xl uppercase italic tracking-widest rounded-[1.5rem] md:rounded-[2.5rem] shadow-4xl shadow-black/40 hover:scale-[1.05] active:scale-95 transition-all duration-700 inline-flex items-center gap-6 group relative overflow-hidden">
                     <div className="absolute inset-0 bg-white/5 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 skew-x-12" />
                     {t('uploadNow')} <ArrowRight size={28} className="group-hover:translate-x-4 transition-transform duration-500" />
                  </Link>
               </div>
            </div>
            
            <motion.div 
               whileHover={{ scale: 1.02, rotateY: 5 }}
               className="bg-white/10 backdrop-blur-3xl border-4 border-dashed border-white/40 rounded-[5rem] p-20 text-center space-y-10 group relative shadow-inner"
            >
               {/* Animated HUD Corners */}
               <div className="absolute top-10 left-10 h-10 w-10 border-t-4 border-l-4 border-white/20 rounded-tl-3xl" />
               <div className="absolute top-10 right-10 h-10 w-10 border-t-4 border-r-4 border-white/20 rounded-tr-3xl" />
               <div className="absolute bottom-10 left-10 h-10 w-10 border-b-4 border-l-4 border-white/20 rounded-bl-3xl" />
               <div className="absolute bottom-10 right-10 h-10 w-10 border-b-4 border-r-4 border-white/20 rounded-br-3xl" />

               <div className="h-24 w-24 md:h-32 md:w-32 bg-white rounded-[3rem] mx-auto flex items-center justify-center text-brand-teal shadow-4xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-700 relative overflow-hidden">
                  <div className="absolute inset-0 bg-brand-teal/5 animate-pulse" />
                  <img src={prescriptionImg} className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-40 transition-opacity" alt="Scan HUD" />
                  <Upload size={40} className="md:w-14 md:h-14 relative z-10 group-hover:translate-y-[-4px] transition-transform duration-500" />
               </div>
               <div className="space-y-6">
                  <h3 className="font-syne font-black text-white text-3xl md:text-4xl uppercase italic tracking-tighter">{t('dropImage')}</h3>
                  <div className="h-1.5 w-24 bg-white/20 rounded-full mx-auto overflow-hidden">
                     <motion.div animate={{ x: ['-100%', '100%'] }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }} className="h-full w-12 bg-white shadow-[0_0_15px_white]" />
                  </div>
                  <p className="text-white/40 font-dm text-[10px] md:text-sm leading-relaxed px-6 md:px-16 italic font-bold uppercase tracking-widest">{t('acceptedFiles')}</p>
               </div>
               
            </motion.div>
         </div>
      </section>
   );
}

export function Testimonials() {
   const { t } = useLanguage();
   const REVIEWS = [
      { name: 'Ramesh Kumar', area: 'New Colony, Karaikal', text: 'Got my blood pressure medicines delivered in just 22 minutes! The live tracking on the app is super convenient. No more standing in queues in the Karaikal heat.', img: patientImg },
      { name: 'Lalitha Subramaniam', area: 'Market Road, Karaikal', text: 'As a diabetic patient, I need insulin monthly. MediPharm set up auto-reminders and delivers from Central Pharmacy every month. Such a blessing for patients like me.', img: familyImg },
      { name: 'Priya Krishnan', area: 'Bus Stand Area, Karaikal', text: 'My son had fever at midnight. Apollo Pharmacy was open and MediPharm delivered Dolo 650 in 30 minutes. Amazing service for emergency situations!', img: familyImg },
      { name: 'Murugan Pillai', area: 'Nagore Road, Karaikal', text: 'Finding medicines was always a problem in Nagore. Now Grace Pharmacy delivers to my home via MediReach network. Life changed for our family!', img: patientImg },
      { name: 'Anitha Rajan', area: 'Poompuhar Street', text: 'Uploaded my prescription photo from JIPMER and the pharmacist verified it in 8 minutes. Medicines came in 25 mins. Superb service for Karaikal people!', img: patientImg },
      { name: 'Venkatesan M.', area: 'Keezhavur, Karaikal', text: 'The doctors consultation feature is brilliant. Consulted Dr. Priya Raman online and got prescription in 10 minutes. No need to travel to hospital!', img: patientImg }
   ];

   return (
      <section className="py-16 md:py-32 bg-white relative overflow-hidden">
         <div className="max-w-7xl mx-auto px-4 md:px-10 relative z-10">
            <div className="text-center space-y-8 mb-16 md:mb-24 max-w-4xl mx-auto">
               <div className="inline-flex items-center gap-3 px-6 py-2 bg-[#0a1628] text-brand-teal rounded-full font-syne font-black text-[10px] uppercase tracking-[0.4em] italic shadow-2xl">
                  {t('districtTrusted')}
               </div>
               <h2 className="font-syne font-black text-[#0a1628] text-4xl md:text-8xl leading-none uppercase italic tracking-tighter">
                  {t('voicesOfKaraikal')}
               </h2>
               <p className="text-gray-400 font-dm text-lg md:text-2xl italic font-bold">Satisfied Customers</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
               {REVIEWS.map((r, i) => (
                  <motion.div 
                     key={i}
                     initial={{ opacity: 0, scale: 0.9 }}
                     whileInView={{ opacity: 1, scale: 1 }}
                     transition={{ delay: i * 0.1, duration: 0.8 }}
                     className="bg-white border-2 border-black/[0.03] p-12 rounded-[4rem] shadow-3xl hover:shadow-4xl hover:border-brand-teal/20 transition-all duration-700 relative flex flex-col justify-between group overflow-hidden"
                  >
                     {/* HUD Decorative Corner */}
                     <div className="absolute top-0 right-0 h-24 w-24 bg-brand-teal/5 rounded-bl-[4rem] -translate-y-12 translate-x-12 group-hover:translate-y-0 group-hover:translate-x-0 transition-transform duration-700" />
                     
                     <div className="absolute top-12 right-12 flex gap-1 text-amber-500">
                        {[1,2,3,4,5].map(s => <Star key={s} size={16} fill="currentColor" strokeWidth={0} />)}
                     </div>
                     <p className="text-gray-400 font-dm text-lg leading-relaxed mb-10 italic font-bold">"{r.text}"</p>
                     
                     <div className="flex items-center gap-6 pt-10 border-t-2 border-dashed border-black/[0.05] mt-auto relative z-10">
                        <img src={r.img} alt={r.name} className="h-16 w-16 rounded-[1.5rem] object-cover ring-4 ring-gray-100 p-0.5 group-hover:scale-110 transition duration-700 shadow-xl" />
                        <div>
                           <div className="font-syne font-black text-[#0a1628] text-lg uppercase italic tracking-tighter leading-none mb-1">{r.name}</div>
                           <div className="text-[10px] text-brand-teal font-black uppercase tracking-widest italic">{r.area} | Active ✓</div>
                        </div>
                     </div>
                  </motion.div>
               ))}
            </div>
         </div>
      </section>
   );
}

export function Features() {
  const { t } = useLanguage();
  const LIST = [
    { icon: Truck, title: t('speedDelivery'), desc: t('speedDelivery') },
    { icon: ShieldCheck, title: t('verifiedOnly'), desc: t('verifiedOnly') },
    { icon: MapPin, title: t('liveMap'), desc: t('liveMap') },
    { icon: Clock, title: t('prioritySupport'), desc: t('prioritySupport') },
    { icon: FileText, title: t('refillAlerts'), desc: t('refillAlerts') },
    { icon: Headphones, title: t('liveSupport'), desc: t('liveSupport') }
  ];

  return (
    <section className="py-24 bg-[#0a1628] relative overflow-hidden">
       {/* Feature Marquee HUD */}
       <div className="max-w-7xl mx-auto px-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-12 text-center relative z-10">
          {LIST.map((f, i) => (
            <div key={i} className="space-y-6 group">
               <div className="h-20 w-20 bg-white/5 border border-white/10 rounded-[2rem] mx-auto flex items-center justify-center text-brand-teal shadow-2xl group-hover:bg-brand-teal group-hover:text-[#0a1628] group-hover:rotate-12 group-hover:scale-110 transition-all duration-500 backdrop-blur-3xl shadow-brand-teal/5">
                  <f.icon size={28} />
               </div>
               <div className="space-y-2 px-4 transition-all duration-500 group-hover:translate-y-[-4px]">
                  <h4 className="font-syne font-black text-white text-[10px] uppercase tracking-[0.2em] italic leading-none truncate group-hover:text-brand-teal transition-colors">{f.title}</h4>
                  <p className="text-[9px] text-white/20 font-dm font-bold uppercase tracking-widest leading-tight truncate group-hover:text-white/40">{f.desc}</p>
               </div>
            </div>
          ))}
       </div>
    </section>
  );
}

export function LogoStrip() {
   return (
      <section className="py-12 bg-white border-y border-gray-100 overflow-hidden relative">
         <div className="flex items-center gap-12 animate-marquee whitespace-nowrap">
            {[...Array(2)].map((_, groupIdx) => (
               <div key={groupIdx} className="flex items-center gap-16 min-w-full justify-around shrink-0 px-8">
                  {['Apollo Pharmacy', 'MedPlus', 'Sri Murugan Medical', 'Life Care Medicals', 'Grace Pharmacy', 'Karaikal Central', 'M.K. Medicals', 'Sri Dhanvantri'].map(name => (
                     <div key={name} className="font-syne font-black text-[#0a1628]/10 text-2xl uppercase tracking-[0.2em]">{name}</div>
                  ))}
               </div>
            ))}
         </div>
      </section>
   );
}

export function BlogPreview() {
   const BLOGS = [
      { id: 1, title: 'Managing Diabetes in Karaikal Summer', img: '/assets/hospital_pro.png', author: 'Dr. K. Anand Kumar', tag: 'Health Tips' },
      { id: 2, title: '5 Medicines Every Home Should Have', img: '/assets/medicine_default.png', author: 'Dr. S. Priya Raman', tag: 'Medicine Guide' },
      { id: 3, title: 'Visiting JIPMER vs Online Consult', img: '/assets/hospital_pro.png', author: 'MediPharm Team', tag: 'Healthcare' }
   ];

   return (
      <section className="py-24 bg-gray-50">
         <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16 space-y-4">
               <h2 className="font-syne font-black text-[#0a1628] text-4xl leading-tight">Karaikal Health Hub.</h2>
               <p className="text-gray-400 font-dm text-lg">Helpful health information for the Karaikal community.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
               {BLOGS.map((b, i) => (
                  <Link key={i} to={`/blog/${b.id}`} className="group bg-white rounded-[3rem] border border-gray-100 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500">
                     <div className="h-56 overflow-hidden relative">
                        <img src={b.img} alt={b.title} className="h-full w-full object-cover group-hover:scale-110 transition duration-700" />
                        <div className="absolute bottom-4 left-4 bg-white/20 backdrop-blur-md text-white text-[9px] font-bold px-3 py-1.5 rounded-xl border border-white/20 uppercase tracking-widest">{b.tag}</div>
                     </div>
                     <div className="p-8 space-y-4">
                        <h3 className="font-syne font-bold font-black text-[#0a1628] leading-tight line-clamp-2 group-hover:text-[#028090] transition text-xl">{b.title}</h3>
                        <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                           <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none">By: {b.author}</div>
                           <div className="text-[10px] text-[#028090] font-black underline">Read More</div>
                        </div>
                     </div>
                  </Link>
               ))}
            </div>
         </div>
      </section>
   );
}

export function AppDownload() {
   const { t } = useLanguage();
   return (
      <section className="py-40 bg-gradient-to-br from-[#0a1628] via-[#112240] to-[#0a1628] relative overflow-hidden">
         <div className="absolute top-[-10%] left-[-10%] h-[800px] w-[800px] bg-brand-teal/5 rounded-full blur-[250px] opacity-20" />
         
         <div className="max-w-7xl mx-auto px-4 md:px-10 grid lg:grid-cols-2 gap-32 items-center relative z-10">
            <div className="space-y-12 text-white">
               <div className="space-y-8">
                  <div className="inline-flex items-center gap-4 px-6 py-2 bg-brand-teal text-[#0a1628] rounded-xl font-syne font-black text-[10px] uppercase tracking-[0.4em] italic shadow-4xl rotate-3">
                     <Terminal size={14} /> AVAILABLE NOW
                  </div>
                  <h2 className="font-syne font-black text-6xl md:text-8xl leading-none text-white uppercase italic tracking-tighter">
                     Your Health. <br /> Your Pocket.
                  </h2>
                  <p className="text-white/30 font-dm text-2xl italic font-bold leading-relaxed max-w-xl">Download the MediReach app for faster checkout, live order tracking, and emergency health alerts.</p>
               </div>
               
               <div className="flex flex-wrap gap-8">
                  <button className="px-12 py-6 bg-white/[0.03] border-2 border-white/10 text-white rounded-[2rem] shadow-4xl flex items-center gap-5 hover:bg-brand-teal hover:text-[#0a1628] hover:border-brand-teal transition-all duration-700 group active:scale-95 outline-none backdrop-blur-3xl">
                     <div className="h-14 w-14 flex items-center justify-center shrink-0 bg-white/5 rounded-2xl group-hover:bg-[#0a1628]/10 transition-colors"><Globe size={32} /></div>
                     <div className="text-left">
                        <div className="text-[10px] uppercase tracking-[0.3em] font-black italic opacity-40 group-hover:opacity-100 mb-1">Get it on</div>
                        <div className="font-syne font-black text-2xl leading-none uppercase tracking-tighter italic">Play Store</div>
                     </div>
                  </button>
                  <button className="px-12 py-6 bg-white/[0.03] border-2 border-white/10 text-white rounded-[2rem] shadow-4xl flex items-center gap-5 hover:bg-brand-teal hover:text-[#0a1628] hover:border-brand-teal transition-all duration-700 group active:scale-95 outline-none backdrop-blur-3xl">
                     <div className="h-14 w-14 flex items-center justify-center shrink-0 bg-white/5 rounded-2xl group-hover:bg-[#0a1628]/10 transition-colors"><ShieldCheck size={32} /></div>
                     <div className="text-left">
                        <div className="text-[10px] uppercase tracking-[0.3em] font-black italic opacity-40 group-hover:opacity-100 mb-1">Download for</div>
                        <div className="font-syne font-black text-2xl leading-none uppercase tracking-tighter italic">iOS App Store</div>
                     </div>
                  </button>
               </div>
            </div>

            <div className="relative">
               <div className="absolute inset-0 bg-brand-teal rounded-full blur-[300px] opacity-10 animate-pulse" />
               
               {/* Phone Mockup Housing */}
               <div className="relative h-[650px] md:h-[750px] w-full max-w-[360px] mx-auto bg-[#0a1628] rounded-[5rem] border-[10px] md:border-[14px] border-[#0a1628] shadow-[0_60px_120px_rgba(0,0,0,0.8)] overflow-hidden scale-90 md:scale-100 transition-transform duration-1000 group-hover:rotate-[-5deg] group-hover:scale-105">
                  <div className="h-full w-full bg-slate-900/50 backdrop-blur-3xl relative">
                     {/* Dynamic HUD Interface */}
                     <div className="absolute top-0 left-0 right-0 h-14 bg-[#0a1628] flex items-center justify-center z-50">
                        <div className="h-2 w-20 bg-white/10 rounded-full" />
                     </div>
                     
                     <div className="pt-20 px-8 space-y-10">
                        <div className="flex items-center justify-between">
                           <div className="h-12 w-12 bg-white/5 border border-white/10 rounded-2xl" />
                           <div className="h-12 w-32 bg-brand-teal/10 border border-brand-teal/20 rounded-2xl" />
                        </div>
                        
                        <div className="space-y-4">
                           <div className="h-4 w-1/2 bg-white/10 rounded-full" />
                           <div className="h-10 w-full bg-white/5 border border-white/10 rounded-2xl" />
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                           {[1,2,3,4].map(i => (
                              <div key={i} className="h-40 bg-white/5 border border-white/10 rounded-[2rem] p-6 space-y-4">
                                 <div className="h-12 w-12 bg-white/5 rounded-xl" />
                                 <div className="space-y-2">
                                    <div className="h-2 w-full bg-white/10 rounded-full" />
                                    <div className="h-2 w-1/2 bg-white/5 rounded-full" />
                                 </div>
                              </div>
                           ))}
                        </div>

                        <div className="absolute bottom-10 left-8 right-8 h-24 bg-brand-teal rounded-[2rem] shadow-4xl flex items-center justify-center text-[#0a1628]">
                           <div className="font-syne font-black text-xl uppercase italic tracking-widest">START</div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>
   );
}

export function EmergencyBanner() {
   const { t } = useLanguage();
   return (
      <section className="bg-red-600 px-4 py-6 w-full relative z-[100]">
         <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-2 mb-3">
               <AlertCircle className="text-white" size={20} />
               <h3 className="text-white font-black text-lg uppercase tracking-tight">Emergency</h3>
            </div>
            <p className="text-white text-sm mb-1">🚑 Ambulance: <strong>108</strong></p>
            <p className="text-white text-sm mb-4">
               Govt Hospital Karaikal: <strong>04368-222288</strong>
            </p>
            <a href="tel:108" className="block w-full">
               <button className="w-full bg-white text-red-600 font-black py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-transform">
                  <Phone size={18} /> Call 108 Now
               </button>
            </a>
         </div>
      </section>
   );
}

export function DistrictBackdrop() {
   const { t } = useLanguage();
   return (
      <section className="py-24 lg:py-56 relative overflow-hidden bg-[#0a1628]">
         <div className="absolute inset-0 grayscale opacity-20 transition-all duration-1000 hover:grayscale-0 hover:opacity-40">
            <img src="/assets/hospital_pro.png" alt="Karaikal District" className="w-full h-full object-cover scale-110 animate-pulse-slow" />
         </div>
         <div className="max-w-7xl mx-auto px-10 relative z-10 text-center space-y-12">
            <h2 className="font-syne font-black text-white text-3xl md:text-9xl uppercase italic tracking-tighter leading-none">{t('madeForKaraikal').replace('_', ' ')}</h2>
            <div className="flex flex-col md:flex-row items-center justify-center gap-12">
               <div className="h-[400px] w-full md:w-[300px] rounded-[3rem] overflow-hidden border-4 border-white animate-float shadow-4xl"><img src="/assets/hospital_pro.png" className="h-full w-full object-cover" alt="Temple" /></div>
               <div className="h-[400px] w-full md:w-[300px] rounded-[3rem] overflow-hidden border-4 border-white animate-float-delayed shadow-4xl"><img src="/assets/hospital_pro.png" className="h-full w-full object-cover" alt="Beach" /></div>
            </div>
            <p className="text-white/40 font-dm text-2xl italic font-bold max-w-4xl mx-auto uppercase tracking-widest">Karaikal Healthcare Network</p>
         </div>
      </section>
   );
}
