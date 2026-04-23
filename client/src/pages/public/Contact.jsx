import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, Phone, MapPin, Send, 
  MessageSquare, Clock, ShieldCheck, 
  ArrowRight, Landmark, MessageCircle, 
  LifeBuoy, CheckCircle, Info, ChevronRight, X, Activity, Zap, Globe
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { Input } from '../../components/common/Core';

export default function Contact() {
  const { t, language } = useLanguage();
  const [formData, setFormData] = useState({ name: '', email: '', message: '', topic: 'General Query' });
  const [isSent, setIsSent] = useState(false);

  const CONTACT_INFO = [
    { icon: Landmark, label: 'Office Address', val: '12, Market Road, Karaikal, Tamil Nadu - 609602', sub: 'Near SBI' },
    { icon: Phone, label: 'Support Hotline', val: '+91 98765 43210', sub: 'Available 24/7' },
    { icon: MessageCircle, label: 'WhatsApp Support', val: '+91 98765 43210', sub: 'Quick text support' },
    { icon: Mail, label: 'Email Address', val: 'support@medipharm.in', sub: '24 hour response time' }
  ];

  const EMERGENCY_CONTACTS = [
    { label: t('ambulanceSupport'), val: '108', color: 'text-red-500' },
    { label: t('govtHospitalKKL'), val: '04368-222288', color: 'text-amber-500' },
    { label: t('fireRescue'), val: '101', color: 'text-brand-teal' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSent(true);
    setTimeout(() => setIsSent(false), 5000);
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-48 pt-24">
      {/* Hero Header */}
      <section className="bg-[#0a1628] py-48 md:py-64 relative overflow-hidden flex items-center justify-center text-center">
         <div className="absolute inset-0 bg-[url('/assets/hospital_pro.png')] bg-cover bg-center opacity-10 filter grayscale brightness-125" />
         <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a1628]/80 to-[#0a1628]" />
         <div className="absolute top-0 left-0 h-[800px] w-[800px] bg-brand-teal opacity-5 rounded-full blur-[180px]" />
         
         <div className="max-w-7xl mx-auto px-10 space-y-12 relative z-10">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }} className="space-y-10 group">
               <div className="px-8 py-3 bg-brand-teal/10 border border-brand-teal/20 rounded-[2rem] inline-flex items-center gap-4 text-[11px] font-black text-brand-teal uppercase tracking-[0.4em] italic backdrop-blur-3xl group-hover:scale-105 transition-transform duration-700">
                  <Activity size={18} className="animate-pulse" /> Talk to Us
               </div>
               <h1 className="font-syne font-black text-7xl md:text-[11rem] text-white tracking-[-0.05em] leading-[0.8] uppercase italic drop-shadow-2xl">
                  {t('contact')} <br /><span className="text-brand-teal drop-shadow-[0_0_80px_rgba(2,195,154,0.3)]">Team</span>
               </h1>
               <p className="text-white/40 font-dm text-2xl max-w-2xl mx-auto italic font-bold leading-relaxed">{t('reachOutDesc')}</p>
            </motion.div>
         </div>
      </section>

      {/* Contact Grid Architecture */}
      <div className="max-w-7xl mx-auto px-10 -mt-40 relative z-20">
         <div className="grid lg:grid-cols-[1.3fr_1fr] gap-20 items-start">
            
            {/* Contact Form Terminal */}
            <div className="bg-white rounded-[5rem] p-16 md:p-32 shadow-4xl border border-gray-100 group transition-all duration-1000 relative overflow-hidden">
               <div className="absolute top-0 right-0 h-64 w-64 bg-brand-teal opacity-[0.02] rounded-full blur-[100px]" />
               <div className="space-y-16 relative z-10">
                  <div className="space-y-8">
                     <div className="flex items-center gap-6">
                        <div className="h-2 w-20 bg-brand-teal rounded-full" />
                        <span className="text-[11px] font-black text-brand-teal uppercase tracking-[0.4em] italic">Secure Message</span>
                     </div>
                     <h2 className="font-syne font-black text-6xl text-[#0a1628] uppercase italic leading-[0.9] tracking-tighter">
                        {t('digital')} <br /><span className="text-brand-teal underline decoration-brand-teal decoration-8 underline-offset-12">{t('consultation')}</span>
                     </h2>
                     <p className="text-gray-300 font-dm text-2xl italic font-bold tracking-wide">Reach out to our support team.</p>
                  </div>
                  
                  <form onSubmit={handleSubmit} className="space-y-12">
                     <div className="grid md:grid-cols-2 gap-12">
                        <Input label={t('yourFullName')} placeholder="e.g. Anand Kumar" variant="flat" required />
                        <Input label="Email" type="email" placeholder="e.g. kark@email.com" variant="flat" required />
                     </div>
                     <div className="space-y-4">
                        <label className="text-[11px] font-black uppercase tracking-[0.4em] text-gray-200 ml-10 italic">Your Message</label>
                        <textarea rows="6" placeholder="How can we help you?" className="w-full bg-gray-50 border-4 border-transparent rounded-[3.5rem] px-12 py-12 outline-none focus:bg-white focus:border-brand-teal/20 transition-all duration-700 shadow-inner font-dm text-xl italic font-bold text-[#0a1628] resize-none" required />
                     </div>
                     
                     <div className="relative group/btn pt-10">
                        <AnimatePresence mode="wait">
                           {isSent ? (
                              <motion.button 
                                 key="sent"
                                 initial={{ opacity: 0, y: 20 }}
                                 animate={{ opacity: 1, y: 0 }}
                                 type="button" 
                                 className="w-full h-28 bg-brand-teal text-[#0a1628] rounded-[3rem] font-syne font-black text-2xl uppercase tracking-[0.3em] flex items-center justify-center gap-6 transition shadow-4xl italic shadow-brand-teal/20"
                              >
                                 <CheckCircle size={32} /> Message Sent &rarr;
                              </motion.button>
                           ) : (
                              <motion.button 
                                 key="idle"
                                 initial={{ opacity: 0, y: 20 }}
                                 animate={{ opacity: 1, y: 0 }}
                                 type="submit" 
                                 className="w-full h-28 bg-[#0a1628] text-white rounded-[3rem] font-syne font-black text-2xl uppercase tracking-[0.3em] hover:bg-brand-teal transition-all shadow-4xl flex items-center justify-center gap-6 hover:scale-[1.02] active:scale-95 duration-700 italic group/tx"
                              >
                                 Send Message <Send size={32} className="group-hover/tx:translate-x-6 group-hover/tx:-translate-y-4 transition-transform duration-700" />
                              </motion.button>
                           )}
                        </AnimatePresence>
                        <div className="flex items-center justify-center gap-4 mt-10">
                           <Activity size={16} className="text-brand-teal animate-pulse" />
                           <p className="text-[10px] text-gray-200 font-black uppercase tracking-[0.3em] text-center italic">Response time: ~2.4 Hours</p>
                        </div>
                     </div>
                  </form>
               </div>
            </div>

            {/* Contact Sidebar */}
            <aside className="space-y-16">
               {/* Emergency Hub */}
               <div className="bg-[#0a1628] rounded-[5rem] p-16 text-white space-y-16 shadow-4xl shadow-[#0a1628]/30 relative overflow-hidden group border-t-8 border-red-500">
                  <div className="absolute top-0 right-0 h-64 w-64 bg-red-500 rounded-full blur-[120px] opacity-10 animate-pulse" />
                  <div className="space-y-6 relative z-10">
                     <div className="flex items-center gap-6">
                        <div className="h-2 w-12 bg-red-500 rounded-full" />
                        <span className="text-[11px] font-black text-red-500 uppercase tracking-[0.4em] italic">{t('priorityNode')}</span>
                     </div>
                     <h3 className="font-syne font-black text-5xl flex items-center gap-8 uppercase italic leading-none tracking-tighter">
                        <LifeBuoy className="text-red-500 animate-spin-slow" size={48} /> Emergency Contacts
                     </h3>
                     <p className="text-white/40 font-dm text-lg italic font-bold leading-relaxed">{t('criticalSupportDesc')}</p>
                  </div>
                  <div className="space-y-8 relative z-10">
                     {EMERGENCY_CONTACTS.map((node, idx) => (
                        <motion.div 
                           key={node.label}
                           initial={{ opacity: 0, x: 20 }}
                           whileInView={{ opacity: 1, x: 0 }}
                           transition={{ delay: idx * 0.1 }}
                           className="p-10 bg-white/5 border border-white/5 rounded-[2.5rem] flex items-center justify-between hover:bg-white/10 transition-all duration-700 group/node shadow-2xl backdrop-blur-3xl"
                        >
                           <div className="space-y-2">
                              <div className="text-[10px] text-white/20 font-black uppercase tracking-[0.3em] italic">{node.label}</div>
                              <div className={`text-3xl font-syne font-black ${node.color} italic`}>{node.val}</div>
                           </div>
                           <button className="h-16 w-16 bg-white/10 rounded-2xl flex items-center justify-center text-white/40 group-hover/node:bg-white group-hover/node:text-[#0a1628] transition-all duration-500 shadow-4xl"><Phone size={24}/></button>
                        </motion.div>
                     ))}
                  </div>
               </div>

               {/* Direct Info Terminals */}
               <div className="grid grid-cols-1 gap-8">
                  {CONTACT_INFO.map((info, idx) => (
                     <motion.div 
                        key={info.label}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="p-12 bg-white border border-gray-100 rounded-[4rem] flex items-start gap-10 shadow-soft hover:shadow-4xl hover:-translate-y-4 transition-all duration-1000 group relative overflow-hidden"
                     >
                        <div className="absolute top-0 right-0 h-40 w-40 bg-brand-teal opacity-0 group-hover:opacity-5 rounded-full blur-[60px] transition-opacity duration-1000" />
                        <div className="h-16 w-16 bg-gray-50 border border-gray-50 rounded-[1.5rem] flex items-center justify-center text-[#0a1628] group-hover:bg-[#0a1628] group-hover:text-brand-teal transition-all duration-700 shadow-inner group-hover:rotate-12 shrink-0"><info.icon size={28}/></div>
                        <div className="space-y-3">
                           <div className="text-[10px] text-gray-200 font-black uppercase tracking-[0.4em] italic leading-none">{info.label}</div>
                           <div className="text-xl font-syne font-black text-[#0a1628] uppercase tracking-tighter italic leading-[1.1]">{info.val}</div>
                           <div className="text-[11px] text-brand-teal font-dm font-black italic uppercase tracking-widest">{info.sub}</div>
                        </div>
                     </motion.div>
                  ))}
               </div>
            </aside>
         </div>
      </div>

      {/* Cartographic Enclave Mapping */}
      <section className="max-w-7xl mx-auto px-10 py-56">
         <div className="space-y-24">
            <div className="text-center space-y-8 group">
               <div className="px-8 py-3 bg-brand-teal/10 border border-brand-teal/20 rounded-[2rem] inline-flex items-center gap-4 text-[11px] font-black text-brand-teal uppercase tracking-[0.4em] italic backdrop-blur-3xl group-hover:scale-105 transition-transform duration-700">
                  <Globe size={18} className="animate-spin-slow" /> Find Us
               </div>
               <h2 className="font-syne font-black text-6xl lg:text-7xl text-[#0a1628] text-center uppercase italic leading-none tracking-tighter">
                  Our <span className="text-brand-teal">Location</span>
               </h2>
            </div>
            
            <div className="h-[750px] w-full bg-white border-8 border-white rounded-[6rem] overflow-hidden shadow-4xl relative group perspective-1000">
               <div className="absolute inset-0 bg-[url('/assets/hospital_pro.png')] bg-cover bg-center grayscale brightness-50 contrast-125 opacity-40 group-hover:grayscale-0 group-hover:brightness-100 group-hover:scale-105 transition-all duration-[8s] ease-out" />
               <div className="absolute inset-0 bg-[#0a1628]/20 group-hover:bg-transparent transition-all duration-1000" />
               
               {/* Animated Status Icons */}
               <div className="absolute top-20 left-20 space-y-4 opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
                  <div className="flex items-center gap-4 bg-[#0a1628] px-8 py-4 rounded-2xl border border-brand-teal/30 shadow-4xl">
                     <div className="h-2 w-2 bg-brand-teal rounded-full animate-ping" />
                     <span className="text-[10px] font-black text-white uppercase tracking-[0.4em] italic">Location Ready</span>
                  </div>
               </div>

               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-10">
                  <div className="relative group-hover:scale-125 transition-transform duration-1000">
                     <div className="absolute -inset-24 bg-brand-teal rounded-full blur-[100px] opacity-20 animate-pulse" />
                     <div className="absolute -inset-8 bg-brand-teal/20 rounded-full animate-ping" />
                     <div className="h-24 w-24 bg-[#0a1628] text-brand-teal rounded-full flex items-center justify-center border-8 border-white shadow-4xl relative z-10"><MapPin size={48} /></div>
                  </div>
                  <div className="bg-white/90 backdrop-blur-3xl px-16 py-10 rounded-[3rem] shadow-4xl border-4 border-white space-y-3 text-center group-hover:scale-110 group-hover:-translate-y-4 transition-all duration-1000">
                     <div className="font-syne font-black text-3xl text-[#0a1628] italic uppercase tracking-tighter">Market Road, Karaikal</div>
                     <div className="text-[11px] text-gray-200 font-black uppercase tracking-[0.4em] italic flex items-center justify-center gap-3">
                        <Activity size={12} className="text-brand-teal" /> 10.9254° N, 79.8380° E
                     </div>
                  </div>
               </div>
               
               <button className="absolute bottom-16 right-16 h-24 px-16 bg-[#0a1628] text-white rounded-[2.5rem] font-syne font-black text-sm uppercase tracking-[0.4em] hover:bg-brand-teal hover:scale-110 transition-all duration-700 shadow-4xl flex items-center gap-6 italic border-4 border-white/5">
                  Open Maps <ArrowRight size={24} />
               </button>
            </div>
         </div>
      </section>

      {/* Support FAQ Protocol */}
      <section className="bg-white py-56 border-y border-gray-100 relative overflow-hidden">
         <div className="absolute top-0 right-0 h-[800px] w-[800px] bg-brand-teal opacity-[0.02] rounded-full blur-[150px] translate-x-1/2 -translate-y-1/2" />
         <div className="max-w-7xl mx-auto px-10 grid lg:grid-cols-[1fr_1.2fr] gap-40 items-center relative z-10">
            <div className="space-y-16">
               <div className="space-y-10">
                  <div className="flex items-center gap-6">
                     <div className="h-2 w-20 bg-brand-teal rounded-full" />
                     <span className="text-[11px] font-black text-brand-teal uppercase tracking-[0.4em] italic">{t('immediateSupport')}</span>
                  </div>
                  <h2 className="font-syne font-black text-6xl lg:text-7xl text-[#0a1628] uppercase italic leading-[0.9] tracking-tighter">
                     Quick <br /><span className="text-brand-teal">Support</span>
                  </h2>
                  <p className="text-2xl font-dm text-gray-300 italic font-bold leading-relaxed border-l-[12px] border-gray-100 pl-12 py-4">{t('accessImmediateInsights')}</p>
               </div>
               <button className="h-24 px-20 bg-[#0a1628] text-white rounded-[3rem] font-syne font-black text-sm uppercase tracking-[0.4em] hover:bg-brand-teal hover:scale-105 transition-all duration-700 shadow-4xl italic group/faq">
                  {t('viewFullFaq')} <ArrowRight size={24} className="inline ml-6 group-hover/faq:translate-x-4 transition-transform" />
               </button>
            </div>
            
            <div className="space-y-10">
               {[
                  { q: t('deliverySpeedQ'), a: t('deliverySpeedA') },
                  { q: t('rxVerificationQ'), a: t('rxVerificationA') },
                  { q: t('paymentMethodsQ'), a: t('paymentMethodsA') }
               ].map((faq, i) => (
                  <motion.div 
                     key={i}
                     initial={{ opacity: 0, x: 30 }}
                     whileInView={{ opacity: 1, x: 0 }}
                     transition={{ delay: i * 0.1 }}
                     className="bg-gray-50 p-12 rounded-[4rem] border border-gray-100 shadow-soft flex items-start gap-12 group hover:bg-white hover:shadow-4xl transition-all duration-1000 hover:-translate-x-4 border-r-[20px] border-transparent hover:border-brand-teal"
                  >
                     <div className="h-16 w-16 bg-white border border-gray-100 rounded-2xl flex items-center justify-center text-brand-teal shrink-0 shadow-inner group-hover:rotate-12 group-hover:bg-[#0a1628] transition-all duration-700"><Info size={28}/></div>
                     <div className="space-y-4">
                        <h4 className="font-syne font-black text-2xl text-[#0a1628] uppercase italic tracking-tighter leading-snug">{faq.q}</h4>
                        <p className="text-gray-400 font-dm italic text-lg font-bold leading-relaxed">{faq.a}</p>
                     </div>
                  </motion.div>
               ))}
            </div>
         </div>
      </section>
    </div>
  );
}
