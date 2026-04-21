import { motion } from 'framer-motion';
import { 
  Heart, ShieldCheck, Truck, Users, 
  MapPin, Activity, Award, Star, 
  TrendingUp, Globe, Rocket, Landmark, 
  Target, Zap, Coffee, CheckCircle, 
  Linkedin, Twitter, Mail, ArrowRight, Biohazard
} from 'lucide-react';
import { pharmacies } from '../../utils/data';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { Stethoscope, Store } from 'lucide-react';

export default function About() {
   const { t, lang } = useLanguage();
 
   const TEAM = [
     { name: 'Senthil Kumar', role: t('roleCeo'), image: '/assets/team_member_pro.png' },
     { name: 'Meenakshi Raman', role: t('roleOps'), image: '/assets/team_member_pro.png' },
     { name: 'Karthik Raja', role: t('roleTech'), image: '/assets/team_member_pro.png' },
     { name: 'Priya Dharshini', role: t('roleSuccess'), image: '/assets/team_member_pro.png' }
   ];

  const VALUES = [
    { title: t('localFirstTitle'), desc: t('localFirstDesc'), icon: Landmark },
    { title: t('trustedVerificationTitle'), desc: t('trustedVerificationDesc'), icon: ShieldCheck },
    { title: t('zeroLagTitle'), desc: t('zeroLagDesc'), icon: Zap },
    { title: t('universalAccessTitle'), desc: t('universalAccessDesc'), icon: Globe },
    { title: t('absoluteIntegrityTitle'), desc: t('absoluteIntegrityDesc'), icon: Activity },
    { title: t('sustainableEnclaveTitle'), desc: t('sustainableEnclaveDesc'), icon: Heart }
  ];

  const MILESTONES = [
    { year: '2023', event: t('milestone2023') },
    { year: '2024', event: t('milestone2024') },
    { year: '2025', event: t('milestone2025') },
    { year: '2026', event: t('milestone2026') }
  ];

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-48 font-dm">
      {/* Hero Section */}
      <section className="bg-[#0a1628] py-48 md:py-72 pr-4 md:pr-48 relative overflow-hidden flex items-center justify-center text-center">
         <div className="absolute inset-0 bg-[url('/assets/hospital_pro.png')] bg-cover bg-center opacity-10 filter grayscale brightness-125" />
         <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a1628]/80 to-[#0a1628]" />
         <div className="absolute top-0 right-0 h-[800px] w-[800px] bg-brand-teal opacity-5 rounded-full blur-[180px]" />
         
         <div className="max-w-7xl mx-auto px-10 space-y-16 relative z-10">
            <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} className="space-y-10 group">
               <div className="px-8 py-3 bg-brand-teal/10 border border-brand-teal/20 rounded-[2rem] inline-flex items-center gap-4 text-[11px] font-black text-brand-teal uppercase tracking-[0.4em] italic backdrop-blur-3xl group-hover:scale-105 transition-transform duration-700">
                  <Landmark size={18} className="animate-spin-slow" /> {t('bornInKaraikal')}
               </div>
               <h1 className="font-syne font-black text-7xl md:text-[11rem] text-white tracking-[-0.05em] leading-[0.8] uppercase italic">
                  {t('about')} <br /><span className="text-brand-teal drop-shadow-[0_0_80px_rgba(2,195,154,0.3)]">{t('medireach')}</span>
               </h1>
            </motion.div>
         </div>
      </section>

      {/* Clinical Infrastructure Section — NEW ADDITION */}
      <section className="max-w-7xl mx-auto px-10 py-56 space-y-40">
         <div className="grid lg:grid-cols-2 gap-24 items-center">
            <div className="space-y-12">
               <div className="px-6 py-2 bg-brand-teal/5 border border-brand-teal/10 rounded-xl inline-flex items-center gap-3 text-[10px] font-black text-brand-teal uppercase tracking-widest italic">
                  <Stethoscope size={16} /> Our Medical Network
               </div>
               <h2 className="font-syne font-black text-5xl md:text-7xl text-[#0a1628] uppercase italic tracking-tighter leading-tight">
                  World-Class <span className="text-brand-teal">Practitioners</span>, <br />Local Care.
               </h2>
               <p className="text-gray-400 font-dm italic font-bold text-xl leading-relaxed">
                  Our network consists of 50+ verified consultants from top institutions like JIPMER and Govt. General Hospital Karaikal. Each doctor is connected to our platform to provide real-time consultations and digital records.
               </p>
               <div className="grid grid-cols-2 gap-8 pt-6">
                  <div className="space-y-2">
                     <div className="text-brand-teal font-syne font-black text-3xl italic">12+</div>
                     <div className="text-[9px] font-black text-gray-300 uppercase tracking-widest">Specialties Active</div>
                  </div>
                  <div className="space-y-2">
                     <div className="text-brand-teal font-syne font-black text-3xl italic">4.9/5</div>
                     <div className="text-[9px] font-black text-gray-300 uppercase tracking-widest">Clinical Rating</div>
                  </div>
               </div>
            </div>
            <div className="relative group">
               <div className="absolute -inset-6 bg-[#0a1628] rounded-[4rem] rotate-3 group-hover:rotate-0 transition-transform duration-700" />
               <img src="/assets/doctor_pro.png" className="relative h-[600px] w-full object-cover rounded-[3.5rem] border-8 border-white/5 grayscale group-hover:grayscale-0 transition-all duration-1000" alt="Consultants" />
            </div>
         </div>

         <div className="grid lg:grid-cols-2 gap-24 items-center">
            <div className="order-2 lg:order-1 relative group">
               <div className="absolute -inset-6 bg-brand-teal rounded-[4rem] -rotate-3 group-hover:rotate-0 transition-transform duration-700" />
               <img src="/assets/pharmacy_pro.png" className="relative h-[600px] w-full object-cover rounded-[3.5rem] border-8 border-white/5 grayscale group-hover:grayscale-0 transition-all duration-1000" alt="Pharmacies" />
            </div>
            <div className="order-1 lg:order-2 space-y-12">
               <div className="px-6 py-2 bg-[#0a1628] rounded-xl inline-flex items-center gap-3 text-[10px] font-black text-brand-teal uppercase tracking-widest italic shadow-lg">
                  <Store size={16} /> Pharmacy Network
               </div>
               <h2 className="font-syne font-black text-5xl md:text-7xl text-[#0a1628] uppercase italic tracking-tighter leading-tight">
                  Hyper-Local <br /><span className="text-brand-teal">Healthcare Points</span>.
               </h2>
               <p className="text-gray-400 font-dm italic font-bold text-xl leading-relaxed">
                  Our delivery network spans across Karaikal. From Market Road to Nagore, every pharmacy is verified, offering safe transport, real-time inventory updates, and essential services like vaccines and diabetic care.
               </p>
               <div className="space-y-6">
                  <div className="flex items-center gap-6">
                     <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center shadow-soft text-brand-teal"><Truck size={24}/></div>
                     <div className="space-y-1">
                        <div className="text-[10px] font-black text-[#0a1628] uppercase italic tracking-widest">Fast Delivery</div>
                        <p className="text-gray-300 text-sm font-bold italic">Quick delivery from your nearest local pharmacy.</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-6">
                     <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center shadow-soft text-brand-teal"><Biohazard size={24}/></div>
                     <div className="space-y-1">
                        <div className="text-[10px] font-black text-[#0a1628] uppercase italic tracking-widest">Cold Chain Integrity</div>
                        <p className="text-gray-300 text-sm font-bold italic">Temperature-controlled transport for vaccines and insulin.</p>
                     </div>
                  </div>
               </div>
            </div>
         </div>

         {/* Safety & Quality Section */}
         <div className="bg-[#0a1628] rounded-[5rem] p-16 md:p-24 text-white relative overflow-hidden shadow-4xl border-t-[20px] border-brand-teal">
            <div className="absolute bottom-0 right-0 h-[600px] w-[600px] bg-brand-teal opacity-5 rounded-full blur-[150px] translate-x-1/2 translate-y-1/2" />
            <div className="max-w-4xl space-y-12 relative z-10">
               <div className="flex items-center gap-6">
                  <ShieldCheck size={48} className="text-brand-teal animate-pulse" />
                  <h3 className="font-syne font-black text-4xl md:text-6xl uppercase italic tracking-tighter leading-none">Safety & Quality <br /><span className="text-brand-teal">Standards</span></h3>
               </div>
               <p className="text-white/40 font-dm text-2xl italic font-bold leading-relaxed">
                  Every medicine and pharmacy on our platform goes through a strict verification process. We ensure your healthcare experience is safe, professional, and reliable.
               </p>
               <div className="grid md:grid-cols-3 gap-10">
                  <div className="space-y-3">
                     <div className="text-brand-teal font-syne font-black text-2xl italic">100%</div>
                     <div className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">Verified Stock</div>
                  </div>
                  <div className="space-y-3">
                     <div className="text-brand-teal font-syne font-black text-2xl italic">Encrypted</div>
                     <div className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">Medical Logs</div>
                  </div>
                  <div className="space-y-3">
                     <div className="text-brand-teal font-syne font-black text-2xl italic">Immediate</div>
                     <div className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">Real-time Updates</div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Our Story Enclave */}
      <section className="max-w-7xl mx-auto px-10 py-56">
         <div className="grid lg:grid-cols-2 gap-40 items-center">
            <div className="relative group perspective-1000">
               <div className="absolute -inset-10 bg-[#0a1628] rounded-[6rem] -rotate-6 group-hover:rotate-0 transition-all duration-[1.5s] ease-out shadow-4xl" />
               <div className="relative overflow-hidden rounded-[5rem] h-[750px] w-full shadow-4xl border-8 border-white/5">
                  <img src="/assets/hospital_pro.png" alt="Karaikal Story" className="h-full w-full object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:scale-110 transition-all duration-[2s] ease-out" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628] via-transparent to-transparent opacity-60" />
               </div>
               <div className="absolute -bottom-16 -right-16 h-64 w-64 bg-brand-teal rounded-[3rem] p-10 flex flex-col items-center justify-center text-[#0a1628] shadow-4xl group-hover:scale-110 group-hover:-translate-y-4 transition-all duration-1000 rotate-6 group-hover:rotate-12 border-8 border-[#f8fafc]">
                  <span className="font-syne font-black text-7xl italic leading-none">23</span>
                  <span className="font-dm text-[11px] uppercase font-black tracking-widest text-center italic">{t('enclaveFounding')}</span>
               </div>
            </div>

            <div className="space-y-16">
               <div className="space-y-10">
                  <div className="flex items-center gap-6">
                     <div className="h-2 w-20 bg-brand-teal rounded-full" />
                     <span className="text-[11px] font-black text-brand-teal uppercase tracking-[0.4em] italic">{t('theHistory')}</span>
                  </div>
                  <h2 className="font-syne font-black text-6xl lg:text-7xl text-[#0a1628] uppercase italic leading-[0.9] tracking-tighter">
                     {t('theStoryOf')} <br /><span className="text-brand-teal underline decoration-brand-teal decoration-8 underline-offset-12">{t('marketRoad')}</span>
                  </h2>
                  <p className="text-3xl font-dm text-gray-400 font-bold leading-relaxed italic border-l-[12px] border-brand-teal pl-12 py-4">
                     {t('storyQuote')}
                  </p>
               </div>
               <div className="space-y-10 text-gray-300 font-dm leading-loose text-xl italic font-bold">
                  <p>{t('storyParagraph1')}</p>
                  <p>{t('storyParagraph2')}</p>
               </div>
               <div className="grid grid-cols-2 gap-12">
                  <div className="space-y-3 p-12 bg-white border border-gray-100 rounded-[3.5rem] group hover:shadow-4xl transition-all duration-700 hover:-translate-y-4 border-l-[16px] border-l-brand-teal/5 hover:border-l-brand-teal">
                     <div className="font-syne font-black text-6xl text-[#0a1628] group-hover:text-brand-teal transition-all italic leading-none">10K+</div>
                     <div className="text-[11px] text-gray-200 font-black uppercase tracking-[0.3em] italic">{t('globalCustomers')}</div>
                  </div>
                  <div className="space-y-3 p-12 bg-[#0a1628] rounded-[3.5rem] group hover:shadow-4xl transition-all duration-700 hover:-translate-y-4 border-l-[16px] border-l-brand-teal shadow-4xl">
                     <div className="font-syne font-black text-6xl text-brand-teal italic leading-none">50K+</div>
                     <div className="text-[11px] text-white/20 font-black uppercase tracking-[0.3em] italic">{t('enclaveOrders')}</div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-white py-56 relative overflow-hidden">
         <div className="absolute top-0 right-0 h-[1000px] w-[1000px] bg-brand-teal opacity-[0.03] rounded-full blur-[200px]" />
         <div className="max-w-7xl mx-auto px-10 grid lg:grid-cols-2 gap-24 relative z-10">
            <div className="bg-[#0a1628] rounded-[5rem] p-20 text-white space-y-12 relative overflow-hidden group shadow-4xl transition-all duration-1000 hover:scale-[1.02] border-l-[20px] border-brand-teal">
               <div className="absolute top-0 right-0 h-64 w-64 bg-brand-teal opacity-5 rounded-full blur-[100px]" />
               <div className="h-24 w-24 bg-white/5 border border-white/10 rounded-[2rem] flex items-center justify-center text-brand-teal shadow-2xl transition-all duration-700 group-hover:rotate-12 group-hover:bg-white group-hover:text-[#0a1628]"><Target size={48} /></div>
               <div className="space-y-6">
                  <h3 className="font-syne font-black text-5xl uppercase italic tracking-tighter leading-none">{t('ourMission')}</h3>
                  <p className="text-white/40 font-dm text-2xl italic font-bold leading-relaxed">"{t('missionText')}"</p>
               </div>
               <div className="h-1 w-24 bg-brand-teal rounded-full" />
            </div>
            <div className="bg-brand-teal rounded-[5rem] p-20 text-white space-y-12 relative overflow-hidden group shadow-4xl transition-all duration-1000 hover:scale-[1.02] border-l-[20px] border-[#0a1628]">
               <div className="absolute top-0 right-0 h-64 w-64 bg-white/20 rounded-full blur-[100px]" />
               <div className="h-24 w-24 bg-white/10 rounded-[2rem] flex items-center justify-center text-white shadow-2xl transition-all duration-700 group-hover:rotate-12 group-hover:bg-[#0a1628] group-hover:text-brand-teal"><Rocket size={48} /></div>
               <div className="space-y-6">
                  <h3 className="font-syne font-black text-5xl uppercase italic tracking-tighter leading-none">{t('ourVision')}</h3>
                  <p className="text-[#0a1628]/60 font-dm text-2xl italic font-bold leading-relaxed">"{t('visionText')}"</p>
               </div>
               <div className="h-1 w-24 bg-white rounded-full" />
            </div>
         </div>
      </section>

      {/* Team Architecture */}
      <section className="max-w-7xl mx-auto px-10 py-56 space-y-32">
         <div className="text-center space-y-10 group">
            <div className="px-8 py-3 bg-[#0a1628] rounded-[2rem] inline-flex items-center gap-4 text-[11px] font-black text-brand-teal uppercase tracking-[0.4em] italic backdrop-blur-3xl group-hover:scale-105 transition-transform duration-700">
               <Users size={18} /> {t('districtPersonnel')}
            </div>
            <h2 className="font-syne font-black text-7xl lg:text-9xl text-[#0a1628] uppercase italic leading-[0.85] tracking-tighter">
               {t('meetThe')} <br /><span className="text-brand-teal">{t('enclaveArchitects')}</span>
            </h2>
            <p className="text-gray-300 font-dm text-2xl italic font-bold max-w-3xl mx-auto leading-relaxed">{t('teamSubtitle')}</p>
         </div>
         
         <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-16">
            {TEAM.map((member, idx) => (
               <motion.div 
                  key={member.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, duration: 0.8 }}
                  className="space-y-10 group"
               >
                  <div className="relative overflow-hidden rounded-[4rem] h-[550px] shadow-4xl group-hover:shadow-brand-teal/20 transition-all duration-1000 border-4 border-white">
                     <img src={member.image} alt={member.name} className="h-full w-full object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100 group-hover:scale-110 transition-all duration-[1.5s] ease-out" />
                     <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628] via-transparent to-transparent opacity-0 group-hover:opacity-80 transition-all duration-700" />
                     <div className="absolute bottom-10 inset-x-0 flex items-center justify-center gap-6 opacity-0 translate-y-20 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-1000">
                        <button className="h-16 w-16 bg-white rounded-2xl flex items-center justify-center text-[#0a1628] hover:bg-brand-teal hover:text-white transition-all duration-500 shadow-4xl"><Linkedin size={28}/></button>
                        <button className="h-16 w-16 bg-white rounded-2xl flex items-center justify-center text-[#0a1628] hover:bg-[#028090] hover:text-white transition-all duration-500 shadow-4xl"><Mail size={28}/></button>
                     </div>
                  </div>
                  <div className="text-center space-y-3">
                     <h4 className="font-syne font-black text-3xl text-[#0a1628] group-hover:text-brand-teal transition-all uppercase italic tracking-tighter leading-none">{member.name}</h4>
                     <p className="text-[10px] text-gray-200 font-black uppercase tracking-[0.4em] italic">{member.role}</p>
                  </div>
               </motion.div>
            ))}
         </div>
      </section>

      {/* Values Grid */}
      <section className="bg-white py-56 border-y border-gray-100 relative overflow-hidden">
         <div className="absolute top-0 left-0 h-[1000px] w-[1000px] bg-brand-teal opacity-[0.02] rounded-full blur-[200px] -translate-x-1/2" />
         <div className="max-w-7xl mx-auto px-10 space-y-32 relative z-10">
            <div className="flex items-center justify-between">
               <h2 className="font-syne font-black text-6xl text-[#0a1628] uppercase italic tracking-tighter leading-none">{t('whatWeStandFor')}</h2>
               <div className="h-2 w-32 bg-brand-teal rounded-full" />
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-16">
               {VALUES.map((val, idx) => (
                  <motion.div 
                     key={val.title}
                     initial={{ opacity: 0, scale: 0.9 }}
                     whileInView={{ opacity: 1, scale: 1 }}
                     viewport={{ once: true }}
                     transition={{ delay: idx * 0.1, duration: 0.6 }}
                     className="bg-white p-16 rounded-[4.5rem] border border-gray-100 shadow-soft hover:shadow-4xl hover:-translate-y-4 transition-all duration-1000 group relative overflow-hidden"
                  >
                     <div className="absolute top-0 right-0 h-40 w-40 bg-brand-teal opacity-0 group-hover:opacity-5 rounded-full blur-[60px] transition-opacity duration-1000" />
                     <div className="h-20 w-20 bg-gray-50 border border-gray-50 rounded-[1.8rem] flex items-center justify-center text-[#0a1628] mb-12 group-hover:bg-[#0a1628] group-hover:text-brand-teal transition-all duration-700 shadow-inner group-hover:rotate-12">
                        <val.icon size={36} />
                     </div>
                     <div className="space-y-6">
                        <h4 className="font-syne font-black text-2xl text-[#0a1628] uppercase tracking-tighter italic leading-none">{val.title}</h4>
                        <p className="text-gray-300 font-dm italic leading-relaxed text-xl font-bold">{val.desc}</p>
                     </div>
                  </motion.div>
               ))}
            </div>
         </div>
      </section>

      {/* Milestones / Chronos-Sync Timeline */}
      <section className="max-w-7xl mx-auto px-10 py-56 space-y-32">
         <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
            <h2 className="font-syne font-black text-6xl lg:text-7xl text-[#0a1628] uppercase italic leading-[0.9] tracking-tighter">
               {t('theJourney')} <br /><span className="text-brand-teal">{t('enclaveChronoview')}</span>
            </h2>
            <div className="px-8 py-3 bg-[#0a1628] rounded-[1.5rem] inline-flex items-center gap-4 text-[10px] font-black text-brand-teal uppercase tracking-[0.4em] italic shadow-4xl animate-pulse">
               <Activity size={18} /> {t('realtimeHistoricalSync')}
            </div>
         </div>
         
         <div className="grid md:grid-cols-4 gap-16 relative">
            <div className="hidden md:block absolute top-[5.5rem] left-0 right-0 h-1.5 bg-gray-50 z-0" />
            {MILESTONES.map((stone, i) => (
               <div key={stone.year} className="space-y-12 relative z-10 text-center md:text-left group/stone">
                  <div className="h-44 w-44 mx-auto md:mx-0 bg-white border-8 border-[#f8fafc] text-[#0a1628] rounded-[4rem] flex items-center justify-center font-syne font-black text-5xl shadow-4xl group-hover/stone:bg-[#0a1628] group-hover/stone:text-brand-teal transition-all duration-1000 italic group-hover/stone:-translate-y-4">
                     {stone.year.substring(2)}
                  </div>
                  <div className="space-y-4 max-w-xs mx-auto md:mx-0">
                     <div className="h-1.5 w-12 bg-brand-teal rounded-full" />
                     <p className="text-xl font-dm text-gray-300 italic font-bold leading-relaxed">{stone.event}</p>
                  </div>
               </div>
            ))}
         </div>
      </section>

      {/* Partner Network Telemetry */}
      <section className="max-w-7xl mx-auto px-10 py-32 border-t border-gray-100">
         <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-10 items-center opacity-10 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-1000">
            {pharmacies.map(p => (
               <div key={p.id || p._id} className="text-center font-black font-syne text-[10px] uppercase tracking-[0.3em] italic p-6 border-2 border-transparent hover:border-brand-teal/20 rounded-3xl hover:bg-white hover:shadow-4xl transition-all duration-700">{p.name}</div>
            ))}
         </div>
      </section>
    </div>
  );
}

