import { useParams, Link } from 'react-router-dom';
import { useState, useMemo, useEffect } from 'react';
import { 
  Star, MapPin, Video, Phone, Calendar, 
  ChevronRight, ArrowRight, Filter, Clock, GraduationCap, 
  Heart, CheckCircle, Verified, ShieldCheck, Play, Award, Globe, 
  Info, AlertCircle, Package, ArrowLeft, X 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { doctors } from '../../utils/data.js';
import { toast } from 'react-hot-toast';
import { useLanguage } from '../../context/LanguageContext.jsx';


export default function DoctorProfile() {
  const { t } = useLanguage();
  const { id } = useParams();

  const [activeTab, setActiveTab] = useState('About');
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(0);
  const [selectedTime, setSelectedTime] = useState(null);

  const doc = useMemo(() => doctors.find(d => d.id === id) || doctors[0], [id]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const DATES = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 7; i++) {
        const d = new Date();
        d.setDate(d.getDate() + i);
        arr.push({ 
           day: d.toLocaleString('en-US', { weekday: 'short' }), 
           date: d.getDate(),
           month: d.toLocaleString('en-US', { month: 'short' })
        });
    }
    return arr;
  }, []);

  const SLOTS = ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM', '06:00 PM', '06:30 PM'];

  const handleBooking = () => {
    if (!selectedTime) {
      toast.error('Please select a time slot');
      return;
    }
    toast.success('Appointment requested significantly! Redirecting to payment...');
    setShowModal(false);
  };

  return (
    <div className="bg-white min-h-screen pt-24 pb-40">
      <div className="max-w-7xl mx-auto px-6">
         {/* Breadcrumb / Back Navigation */}
         <div className="flex items-center gap-4 mb-12">
            <Link to="/doctors" className="h-12 w-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 hover:text-[#028090] transition shadow-sm"><ArrowLeft size={20} /></Link>
            <div className="text-xs font-bold text-gray-300 uppercase tracking-widest flex items-center gap-2">
               <Link to="/" className="hover:text-[#0a1628]">Home</Link> <ChevronRight size={12} />
               <Link to="/doctors" className="hover:text-[#0a1628]">Doctors</Link> <ChevronRight size={12} />
               <span className="text-[#028090]">{doc.name}</span>
            </div>
         </div>

         {/* Profile Header */}
         <div className="grid lg:grid-cols-[1fr_400px] gap-16 items-start">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-12">
               <div className="relative shrink-0">
                  <div className="h-48 w-48 rounded-[4rem] overflow-hidden ring-8 ring-gray-50 shadow-2xl p-2 bg-white">
                     <img src={doc.image} alt={doc.name} className="h-full w-full object-cover rounded-[3.5rem] hover:scale-110 transition duration-700" />
                  </div>
                  <div className={`absolute bottom-4 right-4 h-10 w-10 border-4 border-white rounded-full ${doc.status === 'online' ? 'bg-emerald-500 shadow-xl shadow-emerald-500/30' : 'bg-gray-400'}`} />
               </div>
               
               <div className="space-y-6 text-center md:text-left pt-4">
                  <div className="space-y-2">
                     <h1 className="font-syne font-black text-[#0a1628] text-2xl md:text-4xl lg:text-5xl tracking-tight leading-tight">{doc.name}</h1>
                     <div className="text-[#028090] font-syne font-black uppercase tracking-[0.2em] text-sm md:text-base">{doc.spec} · {doc.qual}</div>
                  </div>

                  <div className="flex flex-wrap justify-center md:justify-start items-center gap-6 divide-x md:divide-gray-100">
                     <div className="flex items-center gap-2 text-amber-500 font-bold">
                        <Star size={20} fill="currentColor" />
                        <span>{doc.rating}</span>
                        <span className="text-gray-300 font-normal">({doc.consultations} consultations)</span>
                     </div>
                     <div className="pl-6 flex items-center gap-2 text-xs font-dm font-bold text-gray-400">
                        <Verified size={18} className="text-[#02C39A]" />
                        {t('verifiedMcReg')}: {doc.regNo || 'TNMC-XXXXX'}
                     </div>
                  </div>

                  <div className="flex flex-wrap justify-center md:justify-start gap-3">
                     {doc.tags?.map(t => (
                        <span key={t} className="px-4 py-1.5 bg-[#028090]/5 text-[#028090] text-[10px] font-bold uppercase tracking-widest rounded-xl border border-[#028090]/10">{t}</span>
                     ))}
                  </div>

                  <div className="flex flex-col md:flex-row gap-6 pt-6">
                     <div className="flex flex-col">
                        <span className="text-[10px] text-gray-300 font-bold uppercase tracking-widest">{t('consultingAt')}</span>
                        <div className="text-sm font-dm font-bold text-[#0a1628] italic">{doc.hospital}</div>
                     </div>
                     <div className="flex flex-col">
                        <span className="text-[10px] text-gray-300 font-bold uppercase tracking-widest">{t('experience')}</span>
                        <div className="text-sm font-dm font-bold text-[#0a1628] uppercase">{doc.experience} {t('yearsOfPractice')}</div>
                     </div>
                  </div>
               </div>
            </div>

            <div className="bg-[#0a1628] rounded-[3rem] p-10 text-white space-y-8 shadow-3xl shadow-[#0a1628]/20 relative overflow-hidden group">
               <div className="absolute top-0 right-0 h-32 w-32 bg-[#02C39A] rounded-full blur-[100px] opacity-10" />
               <div className="relative z-10 flex flex-col items-center gap-6">
                  <div className="flex flex-col items-center">
                     <span className="text-[10px] text-white/30 font-bold uppercase tracking-widest">{t('consultationFee')}</span>
                     <div className="text-5xl font-syne font-black text-[#02C39A] tracking-tighter">₹{doc.fee}</div>
                  </div>
                  <button 
                    onClick={() => setShowModal(true)}
                    className="w-full h-16 bg-white text-[#0a1628] rounded-3xl font-syne font-bold text-lg shadow-xl hover:scale-[1.05] active:scale-95 transition-all text-center flex items-center justify-center gap-3"
                  >
                     {t('bookAppointment')} <ArrowRight size={20} />
                  </button>
                  <p className="text-[10px] text-white/30 font-dm text-center italic">100% Secure Architecture Payment. Instant confirmation in Karaikal district.</p>
               </div>
            </div>
         </div>

         {/* Tabs Section */}
         <div className="mt-24">
            <div className="flex items-center gap-8 border-b border-gray-100 mb-12 overflow-x-auto no-scrollbar">
               {['About', 'Experience', 'Reviews', 'Schedule'].map(tabKey => (
                  <button 
                    key={tabKey}
                    onClick={() => setActiveTab(tabKey)}
                    className={`pb-6 font-syne font-bold text-sm uppercase tracking-widest transition-all whitespace-nowrap border-b-4 ${activeTab === tabKey ? 'border-[#028090] text-[#028090]' : 'border-transparent text-gray-300 hover:text-gray-400'}`}
                  >
                     {t(tabKey.toLowerCase())}
                  </button>
               ))}
            </div>

            <div className="max-w-4xl">
               <AnimatePresence mode="wait">
                  {activeTab === 'About' && (
                     <motion.div 
                        key="about" 
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                        className="space-y-12"
                     >
                        <div className="space-y-6">
                           <h3 className="font-syne font-black text-2xl text-[#0a1628]">{t('professionalBio')}</h3>
                           <p className="text-gray-400 font-dm text-lg leading-relaxed">{doc.bio || `Dr. ${doc.name.split(' ').slice(1).join(' ')} is a highly respected ${doc.spec} serving the Karaikal district. Known for specialized attention to patients and accurate clinical diagnosis.`}</p>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-12">
                           <div className="space-y-6">
                              <h3 className="font-syne font-black text-[#0a1628] flex items-center gap-3 text-lg"><GraduationCap className="text-[#028090]" /> {t('education')}</h3>
                              <div className="space-y-4">
                                 {doc.education?.map((e, i) => (
                                    <div key={i} className="flex gap-4">
                                       <div className="h-10 w-10 bg-gray-50 rounded-xl flex items-center justify-center shrink-0"><CheckCircle size={16} className="text-[#02C39A]" /></div>
                                       <div className="font-dm font-bold text-[#0a1628] pt-2">{e}</div>
                                    </div>
                                 ))}
                              </div>
                           </div>
                           <div className="space-y-6">
                              <h3 className="font-syne font-black text-[#0a1628] flex items-center gap-3 text-lg"><Award className="text-[#028090]" /> {t('expertise')}</h3>
                              <div className="flex flex-wrap gap-2">
                                 {doc.tags?.map(tag => (
                                    <span key={tag} className="px-5 py-2.5 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-dm font-bold text-gray-400 whitespace-nowrap">{tag} Expert</span>
                                 ))}
                              </div>
                           </div>
                        </div>
                     </motion.div>
                  )}

                  {activeTab === 'Schedule' && (
                     <motion.div 
                        key="schedule"
                        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                        className="space-y-12"
                     >
                        <div className="space-y-8">
                           <h3 className="font-syne font-black text-[#0a1628] text-2xl">{t('consultationCalendar')}</h3>
                           <div className="grid grid-cols-7 gap-4">
                              {DATES.map((d, i) => (
                                 <button 
                                    key={i} 
                                    onClick={() => setSelectedDate(i)}
                                    className={`flex flex-col items-center p-6 rounded-[2.5rem] border-2 transition-all ${selectedDate === i ? 'bg-[#0a1628] border-[#0a1628] text-white shadow-xl scale-105' : 'bg-gray-50 border-gray-50 text-gray-400 hover:border-gray-200'}`}
                                 >
                                    <div className="text-[10px] font-bold uppercase tracking-widest">{d.day}</div>
                                    <div className="text-2xl font-black font-syne pt-1">{d.date}</div>
                                    <div className="text-[10px] font-bold uppercase tracking-[0.1em] opacity-50">{d.month}</div>
                                 </button>
                              ))}
                           </div>
                        </div>

                        <div className="space-y-8">
                           <h3 className="font-syne font-black text-[#0a1628] text-2xl">{t('availableShifts')}</h3>
                           <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
                              {SLOTS.map(t => (
                                 <button 
                                   key={t}
                                   onClick={() => setSelectedTime(t)}
                                   className={`py-6 rounded-3xl border-2 transition-all font-syne font-bold text-sm ${selectedTime === t ? 'bg-[#028090] border-[#028090] text-white shadow-lg' : 'bg-white border-gray-100 text-gray-400 hover:border-[#028090]'}`}
                                 >
                                    {t}
                                 </button>
                              ))}
                           </div>
                        </div>
                     </motion.div>
                  )}
               </AnimatePresence>
            </div>
         </div>
      </div>

      {/* Booking Modal */}
      <AnimatePresence>
         {showModal && (
            <div className="fixed inset-0 z-[120] flex items-center justify-center p-6">
               <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  onClick={() => setShowModal(false)}
                  className="absolute inset-0 bg-[#0a1628]/60 backdrop-blur-md" 
               />
               <motion.div 
                  initial={{ opacity: 0, scale: 0.9, y: 40 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 40 }}
                  className="relative z-10 w-full max-w-2xl bg-white rounded-[4rem] shadow-3xl overflow-hidden"
               >
                  <div className="p-12 space-y-10">
                     <div className="flex items-center justify-between">
                        <div className="space-y-1">
                           <h3 className="font-syne font-black text-[#0a1628] text-3xl">{t('architectureConsultation')}</h3>
                           <p className="text-gray-400 font-dm">Consult with {doc.name} from Karaikal.</p>
                        </div>
                        <button onClick={() => setShowModal(false)} className="h-12 w-12 bg-gray-50 hover:bg-white rounded-full flex items-center justify-center text-gray-400 shadow-sm transition"><X size={20} /></button>
                     </div>

                     <div className="grid grid-cols-2 gap-8 py-8 border-y border-gray-100">
                        <div className="space-y-4">
                           <label className="text-[10px] font-black font-syne uppercase tracking-widest text-[#0a1628]">{t('selectCategory')}</label>
                           <div className="grid grid-cols-1 gap-2">
                              {['Video Call', 'Audio Call', 'In-Person'].map(type => (
                                 <button key={type} className="w-full py-4 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-bold font-dm text-[#0a1628] text-left px-5 hover:bg-white hover:border-[#028090] transition flex items-center justify-between">
                                    {type} <ArrowRight size={14} className="opacity-20" />
                                 </button>
                              ))}
                           </div>
                        </div>
                        <div className="space-y-4">
                           <label className="text-[10px] font-black font-syne uppercase tracking-widest text-[#0a1628]">{t('quickSymptoms')}</label>
                           <textarea 
                              placeholder={t('symptomPlaceholder')} 
                              className="w-full h-[180px] p-6 bg-gray-50 border border-gray-100 rounded-[2rem] outline-none font-dm text-sm focus:bg-white focus:border-[#028090] transition resize-none"
                           />
                        </div>
                     </div>

                     <div className="flex items-center justify-between pt-4">
                        <div className="flex flex-col">
                           <span className="text-[10px] text-gray-300 font-bold uppercase tracking-widest">{t('selectedSlot')}</span>
                           <div className="text-lg font-syne font-black text-[#0a1628]">{DATES[selectedDate].date} {DATES[selectedDate].month} · {selectedTime || 'Not Set'}</div>
                        </div>
                        <button 
                           onClick={handleBooking}
                           className="px-12 py-5 bg-[#028090] text-white font-syne font-bold rounded-2xl shadow-xl shadow-[#028090]/20 hover:scale-105 active:scale-95 transition-all text-lg"
                        >
                           {t('confirmAndPay')} ₹{doc.fee}
                        </button>
                     </div>
                  </div>
               </motion.div>
            </div>
         )}
      </AnimatePresence>
    </div>
  );
}
