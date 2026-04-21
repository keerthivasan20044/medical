import { useState, useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, MapPin, Heart, ChevronRight, Zap, Activity, Calendar, GraduationCap, X, Clock, Video, ShieldCheck, Briefcase, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { doctors as mockDoctors } from '../../utils/data.js';
import { doctorService } from '../../services/apiServices';
import { normalizeUrl } from '../../utils/url';
import { toast } from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

export default function DoctorProfilePage() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('About');
  const [isFavorite, setIsFavorite] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDoctorNode();
    window.scrollTo(0, 0);
  }, [id]);

  const fetchDoctorNode = async () => {
    try {
      setLoading(true);
      const data = await doctorService.getById(id);
      setDoctor(data);
    } catch (err) {
      console.warn('Clinical node fetch failed, attempting fallback...', err);
      const fallback = mockDoctors.find(dr => dr.id === id || dr._id === id);
      setDoctor(fallback);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8fafc] space-y-6">
      <Loader2 className="animate-spin text-brand-teal" size={48}/>
      <p className="font-syne font-black text-[#0a1628] uppercase italic tracking-widest">Loading Doctor Profile...</p>
    </div>
  );

  if (!doctor) {
    return (
      <div className="min-h-screen bg-[#0a1628] flex items-center justify-center p-6">
         <div className="text-center space-y-6 max-w-xl">
            <div className="h-20 w-20 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mx-auto text-brand-teal animate-pulse"><Briefcase size={40}/></div>
            <h2 className="font-syne font-black text-3xl text-white uppercase italic tracking-tighter">Doctor Not Found</h2>
            <Link to="/doctors">
               <button className="h-16 px-10 bg-brand-teal text-[#0a1628] font-syne font-black text-[10px] uppercase tracking-widest rounded-xl transition-all">Back to Doctors</button>
            </Link>
         </div>
      </div>
    );
  }

  const tabs = ['About', 'Schedule', 'Reviews'];

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-64 font-dm">
      {/* Profile Clinical Header Terminal */}
      <section className="bg-gradient-to-br from-[#0a1628] to-[#1a3a4a] pt-24 pb-32 md:pt-32 md:pb-48 relative overflow-hidden">
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#f8fafc] to-transparent z-0" />
        
        <div className="max-w-7xl mx-auto px-6 md:px-10 relative z-10">
           <div className="flex items-center gap-3 text-[9px] md:text-[10px] font-black text-white/40 uppercase tracking-[0.4em] italic mb-10">
              <Link to="/doctors" className="hover:text-white transition-all">Consultants</Link>
              <ChevronRight size={12} className="opacity-40" /> 
              <span className="text-brand-teal truncate">{doctor.name} profile</span>
           </div>

           <div className="flex flex-col lg:flex-row items-center lg:items-end gap-8 md:gap-16">
              <div className="relative group shrink-0">
                 <div className="h-48 w-48 md:h-64 md:w-64 rounded-full overflow-hidden border-4 md:border-8 border-white/5 shadow-4xl relative z-10">
                    <img src={normalizeUrl(doctor.image)} alt={doctor.name} className="h-full w-full object-cover grayscale-[0.2] transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-110" />
                 </div>
                 <div className={`absolute bottom-2 right-2 md:bottom-4 md:right-4 h-10 w-10 md:h-14 md:w-14 border-4 md:border-[6px] border-[#0a1628] rounded-full flex items-center justify-center shadow-lg z-20 ${doctor.status === 'online' ? 'bg-emerald-500' : 'bg-gray-400'}`}>
                    <Activity size={18} className="text-white animate-pulse" />
                 </div>
              </div>

              <div className="flex-1 space-y-6 md:space-y-8 text-center lg:text-left">
                 <div className="space-y-3 md:space-y-4">
                    <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
                       <span className="text-[9px] md:text-[10px] font-black text-brand-teal bg-brand-teal/5 px-4 md:px-6 py-2 rounded-xl uppercase tracking-widest italic border border-brand-teal/10">{doctor.spec}</span>
                       <span className="text-[9px] md:text-[10px] font-black text-white/40 bg-white/5 px-4 md:px-6 py-2 rounded-xl uppercase tracking-widest italic border border-white/5">{doctor.qual}</span>
                    </div>
                    <h1 className="font-syne font-black text-3xl md:text-6xl lg:text-8xl text-white tracking-tighter uppercase italic leading-[0.85]">{doctor.name}</h1>
                    <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 md:gap-8 pt-2">
                       <div className="flex items-center gap-2 text-amber-500">
                          <Star fill="currentColor" size={16}/>
                          <span className="text-white font-syne font-black text-lg italic">{doctor.rating}</span>
                       </div>
                       <div className="flex items-center gap-2 text-white/40 uppercase font-syne font-black text-[9px] tracking-widest italic">
                          <MapPin size={16} className="text-brand-teal" /> {doctor.hospital}
                       </div>
                    </div>
                 </div>

                 <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 pt-4">
                    <div className="h-16 md:h-20 bg-white/5 backdrop-blur-3xl rounded-2xl md:rounded-[2.2rem] flex items-center px-8 md:px-10 justify-between md:gap-10 border border-white/5">
                       <div className="text-[9px] font-black text-white/20 uppercase tracking-widest italic">Consultation Fee</div>
                       <div className="font-syne font-black text-brand-teal text-xl md:text-3xl italic">₹{doctor.fee}</div>
                    </div>
                    <button 
                      onClick={() => setShowBookingModal(true)}
                      className="h-16 md:h-20 px-8 md:px-12 bg-white text-[#0a1628] font-syne font-black text-[10px] md:text-xs uppercase italic tracking-[0.3em] rounded-2xl md:rounded-[2.2rem] shadow-mint active:scale-95 transition-all flex items-center justify-center gap-4 grow"
                    >
                       BOOK APPOINTMENT <Zap size={18}/>
                    </button>
                    <button onClick={() => setIsFavorite(!isFavorite)} className={`h-16 md:h-20 w-16 md:w-20 rounded-2xl md:rounded-[2.2rem] flex items-center justify-center transition-all duration-500 border shrink-0 ${isFavorite ? 'bg-red-500 border-red-500 text-white' : 'bg-white/5 border-white/10 text-white hover:text-red-500'}`}>
                       <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} className={isFavorite ? 'animate-heartbeat' : ''} />
                    </button>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* Profile Detail Matrix */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 mt-0 md:-mt-20 relative z-20">
         <div className="grid lg:grid-cols-12 gap-10 md:gap-20">
            
            <div className="lg:col-span-8 space-y-10 md:space-y-12">
               {/* Tab Switcher */}
               <div className="bg-white border border-black/[0.03] p-2 md:p-3 rounded-[2rem] md:rounded-[3.5rem] shadow-soft overflow-x-auto no-scrollbar">
                  <div className="flex gap-2">
                     {tabs.map(tab => (
                       <button
                         key={tab}
                         onClick={() => setActiveTab(tab)}
                         className={`flex-1 h-12 md:h-16 rounded-[1.5rem] md:rounded-[2.2rem] font-syne font-black text-[9px] md:text-[10px] uppercase italic tracking-widest transition-all duration-700 relative overflow-hidden group ${activeTab === tab ? 'bg-[#0a1628] text-brand-teal shadow-2xl' : 'bg-gray-50 text-gray-300'}`}
                       >
                          {tab}
                       </button>
                     ))}
                  </div>
               </div>

               <div className="bg-white border border-black/[0.03] rounded-[2.5rem] md:rounded-[4.5rem] p-8 md:p-16 shadow-soft min-h-[400px]">
                  <AnimatePresence mode="wait">
                     {activeTab === 'About' && (
                        <motion.div key="About" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-10">
                           <div className="space-y-6">
                              <h3 className="font-syne font-black text-2xl md:text-3xl text-[#0a1628] uppercase italic leading-none flex items-center gap-4">
                                 <div className="h-1.5 w-12 bg-brand-teal rounded-full" /> About the Doctor
                              </h3>
                              <p className="text-gray-400 font-dm italic font-bold text-lg md:text-xl leading-relaxed">{doctor.bio}</p>
                           </div>
                           
                           <div className="grid md:grid-cols-2 gap-8 md:gap-12">
                              <div className="space-y-6">
                                 <h4 className="font-syne font-black text-base md:text-lg text-[#0a1628] uppercase italic flex items-center gap-3"><GraduationCap className="text-brand-teal" size={20}/> Qualification</h4>
                                 <div className="space-y-4">
                                    {doctor.education?.map((edu, idx) => (
                                       <div key={idx} className="flex gap-4">
                                          <div className="h-2 w-2 rounded-full bg-brand-teal mt-1.5" />
                                          <div className="space-y-1">
                                             <div className="font-syne font-black text-[#0a1628] text-base italic uppercase">{edu.degree}</div>
                                             <div className="text-[9px] font-black text-gray-300 uppercase tracking-widest truncate">{edu.institute}</div>
                                          </div>
                                       </div>
                                    ))}
                                 </div>
                              </div>
                              <div className="space-y-6">
                                 <h4 className="font-syne font-black text-base md:text-lg text-[#0a1628] uppercase italic flex items-center gap-3"><Globe className="text-brand-teal" size={20}/> Languages</h4>
                                 <div className="flex flex-wrap gap-2">
                                    {(doctor.languages || ['Tamil', 'English']).map(lang => (
                                       <span key={lang} className="h-10 px-6 bg-gray-50 border border-black/[0.03] rounded-xl text-[9px] font-black text-gray-400 uppercase italic tracking-widest flex items-center">{lang}</span>
                                    ))}
                                 </div>
                              </div>
                           </div>
                        </motion.div>
                     )}

                     {activeTab === 'Schedule' && (
                        <motion.div key="Schedule" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-10">
                           <h3 className="font-syne font-black text-2xl md:text-3xl text-[#0a1628] uppercase italic leading-none flex items-center gap-4">
                              <div className="h-1.5 w-12 bg-brand-teal rounded-full" /> Available Slots
                           </h3>
                           <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                              {(doctor.schedule?.slots || ['09:00 AM', '11:00 AM', '04:00 PM']).map((slot, idx) => (
                                 <button key={idx} onClick={() => setSelectedSlot(slot)} className={`h-20 rounded-2xl border transition-all duration-700 flex items-center justify-center gap-3 ${selectedSlot === slot ? 'bg-[#0a1628] text-brand-teal border-[#0a1628] shadow-lg' : 'bg-gray-50 border-black/[0.03] text-gray-400'}`}>
                                    <Clock size={16} />
                                    <span className="font-syne font-black text-xs uppercase italic tracking-tighter">{slot}</span>
                                 </button>
                              ))}
                           </div>
                        </motion.div>
                     )}

                     {activeTab === 'Reviews' && (
                        <motion.div key="Reviews" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                           <h3 className="font-syne font-black text-2xl md:text-3xl text-[#0a1628] uppercase italic leading-none flex items-center gap-4">
                              <div className="h-1.5 w-12 bg-brand-teal rounded-full" /> Patient Reviews
                           </h3>
                           {[1,2].map(i => (
                              <div key={i} className="bg-gray-50/50 p-8 rounded-[2rem] space-y-4 border border-black/[0.01]">
                                 <div className="flex justify-between items-center">
                                    <div className="font-syne font-black text-[#0a1628] text-base uppercase italic">K. Selvamani</div>
                                    <div className="flex text-amber-500 gap-0.5"><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /></div>
                                 </div>
                                 <p className="text-gray-400 font-dm italic font-bold text-base leading-relaxed">"The doctor was very professional. The appointment process was very smooth."</p>
                              </div>
                           ))}
                        </motion.div>
                     )}
                  </AnimatePresence>
               </div>
            </div>

            {/* Logical Hub */}
            <div className="lg:col-span-4 lg:block space-y-10">
               <div className="bg-[#0a1628] rounded-[3rem] md:rounded-[4.5rem] p-10 md:p-12 text-white space-y-10 shadow-4xl sticky top-32 border-l-[12px] border-l-brand-teal">
                  <div className="space-y-6">
                     <div className="h-12 w-12 bg-white/5 rounded-xl flex items-center justify-center text-brand-teal"><ShieldCheck size={28}/></div>
                     <h3 className="font-syne font-black text-3xl uppercase italic tracking-tighter">Clinic Info</h3>
                     <div className="space-y-4 pt-6 border-t border-white/5">
                        <div className="flex justify-between items-center">
                           <span className="text-white/40 text-[9px] font-black uppercase tracking-widest">Hospital</span>
                           <span className="text-brand-teal font-syne font-black text-sm italic uppercase">{doctor.hospital?.split(' ')[0]}</span>
                        </div>
                        <div className="flex justify-between items-center">
                           <span className="text-white/40 text-[9px] font-black uppercase tracking-widest">Status</span>
                           <span className="text-emerald-500 font-syne font-black text-sm italic uppercase tracking-widest">{doctor.status?.toUpperCase() || 'ONLINE'}</span>
                        </div>
                     </div>
                  </div>
                  <button onClick={() => setShowBookingModal(true)} className="w-full h-16 md:h-20 bg-brand-teal text-[#0a1628] font-syne font-black text-[11px] uppercase italic tracking-[0.3em] rounded-[1.8rem] md:rounded-[2.5rem] shadow-mint active:scale-95 transition-all">BOOK NOW</button>
               </div>
            </div>
         </div>
      </div>

      {/* Booking Modal Node Terminal */}
      <AnimatePresence>
         {showBookingModal && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[1000] bg-[#0a1628]/95 backdrop-blur-3xl flex items-end md:items-center justify-center md:p-10">
               <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} className="w-full max-w-4xl bg-white rounded-t-[3rem] md:rounded-[4rem] overflow-hidden shadow-4xl flex flex-col md:flex-row relative max-h-[90vh] md:max-h-none">
                  <button onClick={() => setShowBookingModal(false)} className="absolute top-6 right-6 h-12 w-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 z-50"><X size={24}/></button>
                  
                  <div className="md:w-72 lg:w-96 bg-[#0a1628] p-8 md:p-12 text-white space-y-6 md:shrink-0 hidden md:block font-dm">
                     <div className="h-20 w-20 rounded-2xl overflow-hidden border-2 border-white/10 mb-6"><img src={normalizeUrl(doctor.image)} alt="dr" className="h-full w-full object-cover" /></div>
                     <div className="space-y-1">
                        <div className="text-[8px] font-black text-brand-teal uppercase italic tracking-widest">{doctor.spec}</div>
                        <h3 className="font-syne font-black text-2xl uppercase italic tracking-tighter leading-none">{doctor.name}</h3>
                     </div>
                  </div>

                  <div className="flex-1 p-8 md:p-16 space-y-10 overflow-y-auto no-scrollbar font-dm">
                     <div className="space-y-2">
                        <h2 className="font-syne font-black text-3xl md:text-5xl text-[#0a1628] uppercase italic tracking-tighter">Book Appointment</h2>
                        <p className="text-gray-300 font-dm italic font-bold text-base md:text-lg uppercase tracking-widest italic">Provide your consultation details</p>
                     </div>

                     <div className="space-y-8">
                        <div className="space-y-4">
                           <div className="text-[9px] font-black text-gray-300 uppercase italic">Select Date</div>
                           <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                              {[1,2,3,4,5,6,7].map(d => (
                                 <button key={d} onClick={() => setSelectedDate(`2026-03-${d + 24}`)} className={`h-16 w-14 shrink-0 border rounded-2xl flex flex-col items-center justify-center transition-all ${selectedDate.includes(d + 24) ? 'bg-[#0a1628] border-brand-teal text-brand-teal' : 'bg-gray-100 border-black/[0.02] text-gray-400'}`}>
                                    <div className="font-syne font-black text-lg italic">{d + 24}</div>
                                    <div className="text-[7px] font-black uppercase">MAR</div>
                                 </button>
                              ))}
                           </div>
                        </div>

                        <div className="space-y-4">
                           <div className="text-[9px] font-black text-gray-300 uppercase italic">Symptoms / Notes</div>
                           <textarea placeholder="Clinical state details..." className="w-full h-32 bg-gray-50 border border-black/[0.03] rounded-2xl p-6 font-dm italic font-bold text-base outline-none focus:border-brand-teal resize-none"></textarea>
                        </div>

                        <button onClick={() => { toast.success('Appointment Booked'); setShowBookingModal(false); }} className="w-full h-16 md:h-20 bg-[#0a1628] text-brand-teal font-syne font-black text-[10px] md:text-xs uppercase italic tracking-[0.3em] rounded-2xl md:rounded-[3rem] shadow-4xl hover:bg-brand-teal hover:text-white transition-all">CONFIRM APPOINTMENT</button>
                     </div>
                  </div>
               </motion.div>
            </motion.div>
         )}
      </AnimatePresence>
    </div>
  );
}
