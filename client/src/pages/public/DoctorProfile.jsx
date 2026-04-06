import { useState, useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, MapPin, Phone, Clock, Video, ShieldCheck, Heart, ChevronRight, Share2, Plus, Minus, Info, CheckCircle2, ShoppingBag, Zap, Award, Tag, Activity, Globe, Search, Calendar, Briefcase, GraduationCap, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { doctors } from '../../utils/data.js';
import { toast } from 'react-hot-toast';

export default function DoctorProfilePage() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('About');
  const [isFavorite, setIsFavorite] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const doctor = useMemo(() => doctors.find(dr => dr.id === id), [id]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!doctor) {
    return (
      <div className="min-h-screen bg-[#0a1628] flex items-center justify-center p-10">
         <div className="text-center space-y-8 max-w-xl">
            <div className="h-32 w-32 bg-white/5 border border-white/10 rounded-[3.5rem] flex items-center justify-center mx-auto text-brand-teal shadow-3xl animate-pulse"><Briefcase size={64}/></div>
            <h2 className="font-syne font-black text-5xl text-white uppercase italic tracking-tighter">Practitioner Node Offline</h2>
            <p className="text-white/40 font-dm text-xl italic font-bold leading-relaxed">The requested clinical consultant node "{id}" is not responding to district sync.</p>
            <Link to="/doctors">
               <button className="h-20 px-16 bg-brand-teal text-[#0a1628] font-syne font-black text-xs uppercase tracking-[0.3em] shadow-mint hover:scale-[1.05] active:scale-95 transition-all italic flex items-center gap-4 mx-auto">
                  <ChevronRight size={20} className="rotate-180"/> Return to Enclave
               </button>
            </Link>
         </div>
      </div>
    );
  }

  const tabs = ['About', 'Experience', 'Reviews', 'Schedule'];

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-48">
      {/* Profile Clinical Header Terminal */}
      <section className="bg-gradient-to-br from-[#0a1628] to-[#1a3a4a] pt-32 pb-48 relative overflow-hidden">
        <div className="absolute inset-0 bg-[#0a1628]/20 backdrop-blur-[2px]" />
        <div className="absolute top-0 right-0 h-full w-1/3 bg-brand-teal/5 blur-[120px]" />
        
        <div className="max-w-7xl mx-auto px-10 relative z-10">
           <div className="flex items-center gap-4 text-[10px] font-black text-white/40 uppercase tracking-[0.4em] italic mb-12">
              <Link to="/" className="hover:text-white transition-all">Home</Link> 
              <ChevronRight size={14} className="opacity-40" /> 
              <Link to="/doctors" className="hover:text-white transition-all">Consultants</Link>
              <ChevronRight size={14} className="opacity-40" /> 
              <span className="text-brand-teal">{doctor.name} node</span>
           </div>

           <div className="flex flex-col lg:flex-row items-center lg:items-end gap-16">
              <div className="relative group">
                 <div className="h-64 w-64 rounded-full overflow-hidden border-8 border-white/5 group-hover:border-brand-teal/40 transition-all duration-1000 shadow-4xl relative z-10">
                    <img src={doctor.image} alt={doctor.name} className="h-full w-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110" />
                 </div>
                 <div className={`absolute bottom-4 right-4 h-14 w-14 border-[6px] border-[#0a1628] rounded-full flex items-center justify-center transition-all shadow-lg z-20 ${doctor.status === 'online' ? 'bg-emerald-500' : 'bg-gray-400'}`}>
                    <Activity size={24} className="text-white animate-pulse" />
                 </div>
              </div>

              <div className="flex-1 space-y-8 text-center lg:text-left">
                 <div className="space-y-4">
                    <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                       <span className="text-[10px] font-black text-brand-teal bg-brand-teal/5 px-6 py-2 rounded-xl uppercase tracking-[0.2em] italic border border-brand-teal/10">{doctor.spec}</span>
                       <span className="text-[10px] font-black text-white/40 bg-white/5 px-6 py-2 rounded-xl uppercase tracking-[0.2em] italic border border-white/5">{doctor.qual}</span>
                    </div>
                    <h1 className="font-syne font-black text-6xl lg:text-8xl text-white tracking-tighter uppercase italic leading-[0.85]">{doctor.name}</h1>
                    <div className="flex flex-wrap items-center justify-center lg:justify-start gap-8 pt-4">
                       <div className="flex items-center gap-2 text-amber-500">
                          <Star fill="currentColor" size={20}/>
                          <span className="text-white font-syne font-black text-xl italic">{doctor.rating}</span>
                          <span className="text-white/20 font-dm italic font-bold">({doctor.consultations} AUDITS)</span>
                       </div>
                       <div className="h-6 w-px bg-white/10 hidden lg:block" />
                       <div className="flex items-center gap-3 text-white/40 uppercase font-syne font-black text-[10px] tracking-widest italic">
                          <MapPin size={18} className="text-brand-teal" /> {doctor.hospital}
                       </div>
                    </div>
                 </div>

                 <div className="flex flex-col md:flex-row items-center gap-8 pt-6">
                    <div className="h-20 bg-white/5 backdrop-blur-3xl rounded-[2.2rem] flex items-center px-10 gap-10 border border-white/5 shadow-4xl group">
                       <div className="space-y-0.5">
                          <div className="text-[10px] font-black text-white/20 uppercase tracking-widest italic text-center md:text-left">Consultation Fee</div>
                          <div className="font-syne font-black text-brand-teal text-3xl italic leading-none truncate">\u20B9{doctor.fee}</div>
                       </div>
                    </div>
                    <button 
                      onClick={() => setShowBookingModal(true)}
                      className="h-20 px-12 bg-white text-[#0a1628] font-syne font-black text-xs uppercase italic tracking-[0.3em] rounded-[2.2rem] shadow-mint hover:scale-[1.05] active:scale-95 transition-all flex items-center justify-center gap-4 group"
                    >
                       Initialize Handshake <Zap size={20} className="group-hover:rotate-12 transition-transform" />
                    </button>
                    <button onClick={() => setIsFavorite(!isFavorite)} className={`h-20 w-20 rounded-[2.2rem] flex items-center justify-center transition-all duration-500 shadow-4xl border ${isFavorite ? 'bg-red-500 border-red-500 text-white' : 'bg-white/5 border-white/10 text-white hover:text-red-500'}`}>
                       <Heart size={24} fill={isFavorite ? 'currentColor' : 'none'} className={isFavorite ? 'animate-heartbeat' : ''} />
                    </button>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* Profile Detail Matrix */}
      <div className="max-w-7xl mx-auto px-10 -mt-20 relative z-20">
         <div className="grid lg:grid-cols-12 gap-20">
            
            {/* Left Column: Data Terminal */}
            <div className="lg:col-span-8 space-y-12">
               {/* Tab Switcher Protocol */}
               <div className="bg-white border border-black/[0.03] p-4 rounded-[3.5rem] shadow-soft overflow-x-auto no-scrollbar">
                  <div className="flex gap-4">
                     {tabs.map(tab => (
                       <button
                         key={tab}
                         onClick={() => setActiveTab(tab)}
                         className={`flex-1 h-16 rounded-[2.2rem] font-syne font-black text-[10px] uppercase italic tracking-widest transition-all duration-700 relative overflow-hidden group ${activeTab === tab ? 'bg-[#0a1628] text-brand-teal shadow-2xl' : 'bg-gray-50 text-gray-300 hover:text-[#0a1628]'}`}
                       >
                          {tab}
                          {activeTab === tab && <motion.div layoutId="tabPulse" className="absolute inset-0 bg-brand-teal/5 animate-pulse" />}
                       </button>
                     ))}
                  </div>
               </div>

               {/* Dynamic Content Panel */}
               <div className="bg-white border border-black/[0.03] rounded-[4.5rem] p-12 lg:p-20 shadow-soft min-h-[600px] relative overflow-hidden">
                  <div className="absolute top-0 right-0 h-64 w-64 bg-brand-teal opacity-[0.02] rounded-full blur-[80px]" />
                  
                  <AnimatePresence mode="wait">
                     {activeTab === 'About' && (
                        <motion.div 
                          key="About"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className="space-y-16"
                        >
                           <div className="space-y-8">
                              <h3 className="font-syne font-black text-4xl text-[#0a1628] uppercase italic leading-none flex items-center gap-6">
                                 <div className="h-2 w-16 bg-brand-teal rounded-full" /> Practitioner Bio
                              </h3>
                              <p className="text-gray-400 font-dm italic font-bold text-2xl leading-relaxed max-w-4xl">{doctor.bio}</p>
                           </div>

                           <div className="grid md:grid-cols-2 gap-12">
                              <div className="space-y-10 group">
                                 <h4 className="font-syne font-black text-xl text-[#0a1628] uppercase italic tracking-tight flex items-center gap-4">
                                    <GraduationCap className="text-brand-teal" size={24}/> Educational Trajectory
                                 </h4>
                                 <div className="space-y-6">
                                    {doctor.education.map((edu, idx) => (
                                       <div key={idx} className="flex gap-6 items-start group-hover:translate-x-2 transition-transform duration-500">
                                          <div className="h-3 w-3 rounded-full bg-brand-teal mt-2" />
                                          <div className="space-y-0.5">
                                             <div className="font-syne font-black text-[#0a1628] text-lg uppercase italic">{edu.degree}</div>
                                             <div className="text-[10px] font-black text-gray-300 uppercase italic tracking-widest">{edu.institute}</div>
                                          </div>
                                       </div>
                                    ))}
                                 </div>
                              </div>

                              <div className="space-y-10">
                                 <h4 className="font-syne font-black text-xl text-[#0a1628] uppercase italic tracking-tight flex items-center gap-4">
                                    <Globe className="text-brand-teal" size={24}/> Linguistic Protocols
                                 </h4>
                                 <div className="flex flex-wrap gap-4">
                                    {doctor.languages.map(lang => (
                                       <span key={lang} className="h-12 px-8 bg-gray-50 border border-black/[0.03] rounded-xl text-[10px] font-black text-gray-300 uppercase italic tracking-widest flex items-center justify-center hover:bg-[#0a1628] hover:text-white transition-all duration-500">{lang}</span>
                                    ))}
                                 </div>
                                 <div className="pt-6 border-t border-black/[0.03]">
                                    <div className="text-[10px] font-black text-gray-300 uppercase tracking-widest italic mb-2">Clinical Registration</div>
                                    <div className="font-syne font-black text-[#0a1628] text-xl uppercase italic tracking-tighter">{doctor.registration}</div>
                                 </div>
                              </div>
                           </div>
                        </motion.div>
                     )}

                     {activeTab === 'Schedule' && (
                        <motion.div 
                          key="Schedule"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className="space-y-16"
                        >
                           <div className="space-y-8">
                              <h3 className="font-syne font-black text-4xl text-[#0a1628] uppercase italic leading-none flex items-center gap-6">
                                 <div className="h-2 w-16 bg-brand-teal rounded-full" /> Temporal Slots
                              </h3>
                              <p className="text-gray-400 font-dm italic font-bold text-2xl leading-relaxed max-w-4xl">Initialize clinical synchronization by selecting a preferred temporal node.</p>
                           </div>

                           <div className="space-y-12">
                              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                                 {doctor.schedule.slots.map((slot, idx) => (
                                    <button
                                      key={idx}
                                      onClick={() => setSelectedSlot(slot)}
                                      className={`h-24 rounded-[2rem] border transition-all duration-700 flex flex-col items-center justify-center gap-2 group p-4 border-dashed ${selectedSlot === slot ? 'bg-[#0a1628] border-brand-teal shadow-2xl scale-[1.05]' : 'bg-gray-50 border-black/[0.1] hover:bg-white hover:border-[#0a1628]'}`}
                                    >
                                       <Clock size={16} className={selectedSlot === slot ? 'text-brand-teal' : 'text-gray-300'} />
                                       <span className={`font-syne font-black text-xs uppercase italic tracking-tighter ${selectedSlot === slot ? 'text-white' : 'text-gray-400 group-hover:text-[#0a1628]'}`}>{slot}</span>
                                    </button>
                                 ))}
                              </div>
                              <div className="p-10 bg-gray-50/50 rounded-[3rem] border border-black/[0.02] flex items-center gap-8 group">
                                 <div className="h-16 w-16 bg-white rounded-2xl flex items-center justify-center shadow-soft text-brand-teal group-hover:bg-[#0a1628] transition-all duration-700"><Calendar size={28}/></div>
                                 <div className="space-y-1">
                                    <div className="text-[10px] font-black text-gray-300 uppercase tracking-widest italic">{doctor.schedule.days} Enclave</div>
                                    <div className="font-syne font-black text-[#0a1628] text-2xl uppercase italic tracking-tighter underline decoration-brand-teal decoration-4 underline-offset-8">Weekly Operational Timeline</div>
                                 </div>
                              </div>
                           </div>
                        </motion.div>
                     )}

                     {activeTab === 'Reviews' && (
                        <motion.div 
                          key="Reviews"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className="space-y-16"
                        >
                           <div className="space-y-8">
                              <h3 className="font-syne font-black text-4xl text-[#0a1628] uppercase italic leading-none flex items-center gap-6">
                                 <div className="h-2 w-16 bg-brand-teal rounded-full" /> Verified Audits
                              </h3>
                              <p className="text-gray-400 font-dm italic font-bold text-2xl leading-relaxed max-w-4xl">Resident feedback logs synchronized from Karaikal medical nodes.</p>
                           </div>

                           <div className="space-y-8">
                              {[1,2,3].map(i => (
                                 <div key={i} className="bg-gray-50/50 border border-black/[0.02] p-10 rounded-[3rem] space-y-6 hover:translate-x-2 transition-all duration-700 group">
                                    <div className="flex justify-between items-center">
                                       <div className="flex items-center gap-6">
                                          <div className="h-14 w-14 bg-white rounded-xl flex items-center justify-center text-gray-400 font-black italic shadow-inner">U</div>
                                          <div>
                                             <div className="font-syne font-black text-[#0a1628] text-lg uppercase italic">K. Selvamani</div>
                                             <div className="text-[10px] font-black text-brand-teal uppercase tracking-widest italic">Karaikal Town</div>
                                          </div>
                                       </div>
                                       <div className="flex gap-1 text-amber-500"><Star size={16} fill="currentColor"/><Star size={16} fill="currentColor"/><Star size={16} fill="currentColor"/><Star size={16} fill="currentColor"/><Star size={16} fill="currentColor"/></div>
                                    </div>
                                    <p className="text-gray-400 font-dm font-bold italic text-lg leading-relaxed">"Synchronization was perfect. Doctor Raman's clinical protocol for diabetes management in Karaikal is state-of-the-art."</p>
                                 </div>
                              ))}
                           </div>
                        </motion.div>
                     )}
                  </AnimatePresence>
               </div>
            </div>

            {/* Right Column: Sticky Logistical Hub */}
            <div className="lg:col-span-4 space-y-10">
               <div className="bg-[#0a1628] rounded-[4.5rem] p-12 text-white space-y-12 shadow-4xl sticky top-32 border-l-[16px] border-l-brand-teal overflow-hidden group">
                  <div className="absolute top-0 right-0 h-40 w-40 bg-brand-teal opacity-5 rounded-full blur-[80px]" />
                  
                  <div className="space-y-12 relative z-10">
                     <div className="space-y-6">
                        <div className="h-16 w-16 bg-white/5 rounded-2xl flex items-center justify-center text-brand-teal shadow-3xl group-hover:rotate-12 transition-all duration-700"><Zap size={32}/></div>
                        <h3 className="font-syne font-black text-4xl uppercase italic tracking-tighter leading-none">Uplink Hub</h3>
                        <p className="text-white/40 font-dm font-bold italic text-xl leading-relaxed">District-wide secure handwriting handover and video synchronization.</p>
                     </div>

                     <div className="space-y-8 border-t border-white/5 pt-10">
                        <div className="flex items-center justify-between">
                           <span className="text-white/40 font-syne font-black text-[10px] uppercase tracking-widest italic">Terminal Node</span>
                           <span className="text-brand-teal font-syne font-black text-xl italic uppercase tracking-tighter">{doctor.hospital}</span>
                        </div>
                        <div className="flex items-center justify-between">
                           <span className="text-white/40 font-syne font-black text-[10px] uppercase tracking-widest italic">Clinical Handshake</span>
                           <span className="text-brand-teal font-syne font-black text-xl italic uppercase tracking-tighter">\u20B9{doctor.fee}</span>
                        </div>
                        <div className="flex items-center justify-between border-b border-white/5 pb-10">
                           <span className="text-white/40 font-syne font-black text-[10px] uppercase tracking-widest italic">Status State</span>
                           <div className="flex items-center gap-3">
                              <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
                              <span className="text-emerald-500 font-syne font-black text-lg italic uppercase tracking-tighter">ONLINE</span>
                           </div>
                        </div>
                     </div>

                     <button 
                       onClick={() => setShowBookingModal(true)}
                       className="w-full h-20 bg-brand-teal text-[#0a1628] font-syne font-black text-xs uppercase italic tracking-[0.3em] rounded-[2.5rem] shadow-mint hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-6"
                     >
                        Initialize Payload <Zap size={20}/>
                     </button>
                  </div>
               </div>
            </div>
         </div>
      </div>

      {/* Booking Modal Node Terminal */}
      <AnimatePresence>
         {showBookingModal && (
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="fixed inset-0 z-[1000] bg-[#0a1628]/95 backdrop-blur-3xl flex items-center justify-center p-10"
            >
               <motion.div 
                 initial={{ scale: 0.9, y: 100 }}
                 animate={{ scale: 1, y: 0 }}
                 exit={{ scale: 0.9, y: 100 }}
                 className="w-full max-w-4xl bg-white rounded-[5rem] overflow-hidden shadow-4xl flex flex-col lg:flex-row relative"
               >
                  <button onClick={() => setShowBookingModal(false)} className="absolute top-10 right-10 h-16 w-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 hover:text-red-500 hover:rotate-90 transition-all duration-700 z-50 shadow-soft"><X size={32}/></button>
                  
                  <div className="lg:w-96 bg-[#0a1628] p-16 text-white space-y-12 relative overflow-hidden shrink-0">
                     <div className="absolute top-0 right-0 h-64 w-64 bg-brand-teal opacity-10 rounded-full blur-[80px]" />
                     <div className="space-y-8 relative z-10">
                        <div className="h-24 w-24 rounded-3xl overflow-hidden border-4 border-white/10 shadow-3xl"><img src={doctor.image} alt="dr" className="h-full w-full object-cover" /></div>
                        <div className="space-y-2">
                           <div className="text-[10px] font-black text-brand-teal uppercase tracking-widest italic">{doctor.spec} Node</div>
                           <h3 className="font-syne font-black text-3xl uppercase italic tracking-tighter leading-none">{doctor.name}</h3>
                        </div>
                        <div className="pt-12 border-t border-white/10 space-y-6">
                           <div className="flex items-center gap-6 text-white/40"><Calendar size={28}/> <span className="font-syne font-black text-xl italic uppercase tracking-tighter">{selectedDate}</span></div>
                           <div className="flex items-center gap-6 text-brand-teal"><Clock size={28}/> <span className="font-syne font-black text-xl italic uppercase tracking-tighter">{selectedSlot || 'SELECT SLOT'}</span></div>
                        </div>
                     </div>
                  </div>

                  <div className="flex-1 p-16 lg:p-20 space-y-12 no-scrollbar overflow-y-auto max-h-[90vh]">
                     <div className="space-y-4">
                        <h2 className="font-syne font-black text-5xl text-[#0a1628] uppercase italic tracking-tighter">Handshake Protocol</h2>
                        <p className="text-gray-300 font-dm italic font-bold text-xl uppercase tracking-tighter">Configure clinical parameters for district synchronization.</p>
                     </div>

                     <div className="space-y-12">
                        {/* Consultation Switch Matrix */}
                        <div className="space-y-6">
                           <div className="text-[10px] font-black text-gray-300 uppercase tracking-widest italic">Handshake Protocol Type</div>
                           <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                              {['Video Call', 'Audio Call', 'In-Person'].map(type => (
                                 <button key={type} className="h-20 bg-gray-50 border border-black/[0.03] rounded-2xl font-syne font-black text-[10px] uppercase italic tracking-widest hover:border-brand-teal transition-all flex items-center justify-center px-6 text-center">{type}</button>
                              ))}
                           </div>
                        </div>

                        {/* Date Pulse */}
                        <div className="space-y-6">
                           <div className="text-[10px] font-black text-gray-300 uppercase tracking-widest italic">Target Temporal Node (NEXT 7 DAYS)</div>
                           <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                              {[1,2,3,4,5,6,7].map(day => (
                                 <button 
                                   key={day} 
                                   onClick={() => setSelectedDate(`2026-03-${day + 24}`)}
                                   className={`h-24 w-20 shrink-0 border rounded-3xl flex flex-col items-center justify-center gap-1 transition-all group ${selectedDate.includes(day + 24) ? 'bg-[#0a1628] border-brand-teal text-brand-teal' : 'bg-gray-50 border-black/[0.03] hover:bg-[#0a1628] hover:text-brand-teal'}`}
                                 >
                                    <div className="font-syne font-black text-xl italic leading-none">{day + 24}</div>
                                    <div className="text-[9px] font-black text-gray-300 uppercase group-hover:text-white/40">MAR</div>
                                 </button>
                               ))}
                           </div>
                        </div>

                        {/* Symptoms Input Hub */}
                        <div className="space-y-6">
                           <div className="text-[10px] font-black text-gray-300 uppercase tracking-widest italic">Anomalous Symptoms (Binary Data)</div>
                           <textarea placeholder="Describe current clinical state..." className="w-full h-40 bg-gray-50 border border-black/[0.03] rounded-[2rem] p-8 font-dm italic font-bold text-lg outline-none focus:border-brand-teal transition-all resize-none"></textarea>
                        </div>

                        <button 
                          onClick={async () => {
                             try {
                                // Simulate API Handshake for now as we don't have a full appointment state
                                if (!selectedSlot) return toast.error('Temporal Slot required for synchronization.');
                                toast.promise(
                                   new Promise(resolve => setTimeout(resolve, 2000)),
                                   {
                                      loading: 'Initializing District Sync...',
                                      success: 'Clinical Handshake Confirmed!',
                                      error: 'Protocol Error: Node Unavailable'
                                   }
                                );
                                setTimeout(() => setShowBookingModal(false), 2500);
                             } catch (e) {
                                toast.error('Sync failure: Auth required.');
                             }
                          }}
                          className="w-full h-24 bg-[#0a1628] text-brand-teal font-syne font-black text-xs uppercase italic tracking-[0.4em] rounded-[3rem] shadow-4xl hover:bg-brand-teal hover:text-[#0a1628] transition-all duration-1000 flex items-center justify-center gap-6 group"
                        >
                           CONFIRM SYNCHRONIZATION <ShieldCheck size={28} className="group-hover:scale-125 transition-transform" />
                        </button>
                     </div>
                  </div>
               </motion.div>
            </motion.div>
         )}
      </AnimatePresence>
    </div>
  );
}
