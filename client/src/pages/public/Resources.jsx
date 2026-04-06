import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, Shield, AlertTriangle, BookOpen, 
  Download, Phone, Clock, MapPin, 
  Search, Filter, ChevronRight, Activity, 
  Stethoscope, Thermometer, Droplets, Pill,
  ExternalLink, ShieldCheck, Zap, Layers, 
  Info, ArrowUpRight
} from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { Button, Input } from '../../components/common/Core';

const CATEGORIES = ['All Nodes', 'First Aid', 'Chronic Care', 'Wellness', 'Pandemic Safety', 'District Archive'];

const HEALTH_NODES = [
  { id: 1, category: 'First Aid', title: 'Handling Heatstroke in Karaikal Coastal Enclave', readTime: '5 min', icon: Thermometer, color: 'text-[#028090] bg-[#028090]/10' },
  { id: 2, category: 'Chronic Care', title: 'Managing Diabetes: Local Diet Architecture', readTime: '8 min', icon: Pill, color: 'text-[#02C39A] bg-[#02C39A]/10' },
  { id: 3, category: 'Wellness', title: 'Mental Health in Coastal Regions: Synchronized Guide', readTime: '6 min', icon: Heart, color: 'text-amber-500 bg-amber-50' },
  { id: 4, category: 'Pandemic Safety', title: 'Vaccination Portals Handover 2026', readTime: '4 min', icon: Shield, color: 'text-indigo-500 bg-indigo-50' }
];

const EMERGENCY_SYNC = [
  { label: 'General Hospital (KKL)', phone: '04368-222222', status: '24/7 Enclave' },
  { label: 'Ambulance Protocol', phone: '108', status: 'Priority Stream' },
  { label: 'Fire & Rescue Node', phone: '101', status: 'Emergency Link' },
  { label: 'District Health Hub', phone: '04368-222643', status: 'Inquiry Node' }
];

export default function Resources() {
  const [activeCat, setActiveCat] = useState('All Nodes');
  const { t } = useLanguage();

  return (
    <div className="bg-white min-h-screen pb-40">
      {/* Top Architecture Header */}
      <section className="pt-32 pb-24 border-b border-gray-100 bg-gray-50/50 relative overflow-hidden">
         <div className="absolute top-0 right-0 h-96 w-96 bg-[#028090] rounded-full blur-[140px] opacity-10 animate-pulse" />
         <div className="max-w-7xl mx-auto px-10 relative z-10">
            <div className="grid lg:grid-cols-12 gap-16 items-center">
               <div className="lg:col-span-8 space-y-10">
                  <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-[#0a1628] border border-white/10 rounded-full backdrop-blur-md shadow-2xl">
                     <div className="h-2 w-2 bg-[#02C39A] rounded-full animate-ping" />
                     <span className="text-[10px] font-black uppercase tracking-widest text-white font-syne italic">District Knowledge Enclave v2.4</span>
                  </div>
                  <h1 className="font-syne font-black text-6xl md:text-8xl text-[#0a1628] leading-[1.05] tracking-tighter">
                     Verified <br />
                     <span className="text-[#028090]">Health Intelligence.</span>
                  </h1>
                  <p className="font-dm text-xl text-gray-400 max-w-2xl italic leading-relaxed">Synchronizing district knowledge nodes to empower every household in Karaikal with real-time medical protocol and verified intelligence archives.</p>
                  
                  <div className="flex flex-wrap gap-4 pt-4">
                     {['District Sync', 'Satellite Archives', 'Secure Data'].map(tag => (
                        <div key={tag} className="px-6 py-2 bg-white border border-gray-100 rounded-2xl text-[10px] font-black text-[#0a1628] uppercase tracking-widest shadow-sm flex items-center gap-3">
                           <div className="h-1.5 w-1.5 bg-[#02C39A] rounded-full" /> {tag}
                        </div>
                     ))}
                  </div>
               </div>
               <div className="lg:col-span-4 hidden lg:block">
                  <div className="bg-[#0a1628] rounded-[3.5rem] p-10 space-y-8 shadow-4xl relative overflow-hidden group">
                     <div className="absolute top-0 right-0 h-40 w-40 bg-[#028090] rounded-full blur-[80px] opacity-20" />
                     <div className="h-16 w-16 bg-white/10 rounded-2xl flex items-center justify-center border border-white/5"><Activity size={32} className="text-[#02C39A]"/></div>
                     <h3 className="font-syne font-black text-2xl text-white leading-tight">Need Medical <br /> Telemetry Guidance?</h3>
                     <p className="text-white/40 font-dm text-sm leading-relaxed italic">Our district support AI is available 24/7 for health enclave navigation and emergency sync.</p>
                     <button className="w-full py-5 bg-[#02C39A] text-[#0a1628] rounded-2xl font-syne font-black text-xs uppercase tracking-widest shadow-2xl shadow-black/20 hover:scale-[1.02] active:scale-95 transition-all">Init Agent Chat</button>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Emergency Node Grid */}
      <section className="max-w-7xl mx-auto px-10 -mt-12 relative z-20">
         <div className="grid lg:grid-cols-4 gap-8">
            {EMERGENCY_SYNC.map((node, i) => (
              <motion.div 
                 key={node.label}
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: i * 0.1 }}
                 className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-3xl hover:shadow-[#028090]/10 hover:-translate-y-2 transition-all duration-500 group relative overflow-hidden"
              >
                 <div className="absolute bottom-0 right-0 h-32 w-32 bg-[#02C39A]/10 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition duration-700" />
                 <div className="flex items-center justify-between mb-8">
                    <div className="h-12 w-12 bg-gray-50 rounded-2xl flex items-center justify-center text-[#028090] shadow-inner group-hover:bg-[#0a1628] group-hover:text-white transition-all duration-300"><Phone size={20}/></div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#02C39A] flex items-center gap-2">
                       <div className="h-2 w-2 bg-[#02C39A] rounded-full animate-pulse" /> {node.status}
                    </span>
                 </div>
                 <div className="space-y-1 mb-10 relative z-10">
                    <div className="text-[10px] text-gray-300 font-bold uppercase tracking-widest leading-none">Emergency Sync Node</div>
                    <h3 className="font-syne font-black text-xl text-[#0a1628] leading-tight uppercase tracking-tight group-hover:text-[#028090] transition">{node.label}</h3>
                 </div>
                 <a href={`tel:${node.phone}`} className="flex items-center gap-4 group/link">
                    <span className="font-syne font-black text-2xl text-[#0a1628]">{node.phone}</span>
                    <ArrowUpRight size={18} className="text-[#028090] opacity-0 group-hover/link:opacity-100 transition translate-y-1 group-hover/link:translate-y-0" />
                 </a>
              </motion.div>
            ))}
         </div>
      </section>

      {/* Resource Filtering Node */}
      <section className="max-w-7xl mx-auto px-10 mt-32">
         <div className="flex flex-col md:flex-row md:items-center justify-between gap-12 mb-20 border-b border-gray-50 pb-16">
            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
               {CATEGORIES.map(cat => (
                 <button 
                    key={cat} 
                    onClick={() => setActiveCat(cat)}
                    className={`px-10 py-4 rounded-2xl font-syne font-black text-[10px] uppercase tracking-widest whitespace-nowrap transition-all duration-500 ${activeCat === cat ? 'bg-[#0a1628] text-white shadow-3xl scale-105' : 'bg-white text-gray-300 border border-gray-100 hover:bg-gray-50 hover:text-[#0a1628]'}`}
                 >
                    {cat}
                 </button>
               ))}
            </div>
            <div className="relative group w-full md:w-[450px]">
               <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-hover:text-[#02C39A] transition" size={18} />
               <input 
                  type="text" 
                  placeholder="Query Health Node Architecture..."
                  className="w-full bg-white border border-gray-100 rounded-[2rem] py-5 pl-16 pr-8 outline-none font-dm text-sm tracking-wide shadow-soft focus:shadow-xl focus:border-[#02C39A]/30 transition-all placeholder:text-gray-200"
               />
            </div>
         </div>

         {/* Knowledge Stream Grid */}
         <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
            {HEALTH_NODES.map((node, i) => (
              <motion.div 
                 key={node.id}
                 initial={{ opacity: 0, y: 30 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: i * 0.1 }}
                 className="group bg-white rounded-[4rem] border border-gray-100 p-12 hover:shadow-4xl hover:-translate-y-3 transition-all duration-500 flex flex-col justify-between h-full relative"
              >
                 <div className="space-y-8">
                    <div className={`h-20 w-20 rounded-[2.5rem] flex items-center justify-center ${node.color} shadow-sm group-hover:scale-110 group-hover:rotate-12 transition duration-500`}>
                       <node.icon size={36} />
                    </div>
                    <div className="space-y-3">
                       <div className="inline-flex items-center gap-3">
                          <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest leading-none underline decoration-[#02C39A] underline-offset-4">{node.category}</span>
                       </div>
                       <h3 className="font-syne font-black text-2xl text-[#0a1628] group-hover:text-[#028090] transition leading-tight">{node.title}</h3>
                    </div>
                 </div>
                 
                 <div className="mt-12 pt-8 border-t border-gray-50 flex items-center justify-between text-gray-400">
                    <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest">
                       <div className="h-2 w-2 bg-[#028090] rounded-full" /> {node.readTime}
                    </div>
                    <button className="h-14 w-14 rounded-2xl bg-gray-50 text-[#0a1628] flex items-center justify-center group-hover:bg-[#0a1628] group-hover:text-[#02C39A] shadow-soft transition-all duration-500 hover:rotate-45">
                       <ArrowUpRight size={24} />
                    </button>
                 </div>
              </motion.div>
            ))}
            
            {/* Handover Download Node */}
            <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               whileInView={{ opacity: 1, scale: 1 }}
               className="bg-[#0a1628] p-12 rounded-[4rem] text-white shadow-4xl flex flex-col justify-between relative overflow-hidden group border border-white/5"
            >
               <div className="absolute top-0 right-0 h-48 w-48 bg-[#028090] rounded-full blur-[100px] opacity-20" />
               <div className="space-y-6 relative z-10">
                  <div className="h-16 w-16 rounded-2xl bg-[#02C39A] text-[#0a1628] flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:-rotate-6 transition"><Download size={28}/></div>
                  <div className="space-y-2">
                     <div className="text-[10px] text-[#02C39A] font-black uppercase tracking-widest leading-none underline underline-offset-4 decoration-[#02C39A]/30">Handover Protocol</div>
                     <h3 className="font-syne font-black text-3xl uppercase tracking-tighter leading-none">Medicines <br /> Guide v1.0</h3>
                  </div>
               </div>
               <button className="w-full py-5 bg-white text-[#0a1628] rounded-[1.8rem] font-syne font-black text-xs uppercase tracking-[0.2em] mt-12 group-hover:bg-[#02C39A] transition-all relative z-10 shadow-2xl">
                  Sync Archive Node
               </button>
            </motion.div>
         </div>
      </section>

      {/* District Facility Stream */}
      <section className="max-w-7xl mx-auto px-10 mt-40">
         <div className="bg-[#0a1628] rounded-[5rem] p-16 md:p-32 flex flex-col lg:flex-row items-center justify-between gap-20 relative overflow-hidden group shadow-4xl shadow-[#0a1628]/20">
            <div className="absolute bottom-0 left-0 h-64 w-64 bg-[#028090] rounded-full blur-[120px] opacity-20 group-hover:scale-150 transition duration-1000" />
            <div className="space-y-12 max-w-2xl relative z-10 text-center lg:text-left">
               <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 rounded-full text-[#02C39A] font-black text-[10px] uppercase tracking-widest backdrop-blur-md">
                  <MapPin size={16} /> Karaikal District Health Mesh Synchronized
               </div>
               <h2 className="font-syne font-black text-5xl md:text-7xl text-white leading-[1.05] tracking-tighter">
                  Every District <br />
                  <span className="text-[#02C39A]">Intelligence Node.</span>
               </h2>
               <p className="font-dm text-lg text-white/40 italic leading-relaxed">From Government portals to private clinics, we synchronize every verified healthcare node in Karaikal to ensure you never run out of intelligence in critical moments.</p>
               <div className="flex flex-wrap justify-center lg:justify-start gap-3">
                  {['Pharmacy Network', 'Lab Nodes', 'Blood Bank', 'Medical Support Agent'].map(tag => (
                    <div key={tag} className="px-6 py-2.5 bg-white/5 border border-white/10 rounded-2xl font-syne font-black text-[9px] uppercase tracking-[0.2em] text-white/70 hover:text-[#02C39A] hover:bg-white/10 transition cursor-default">{tag}</div>
                  ))}
               </div>
            </div>
            <div className="relative z-10 flex flex-col items-center shrink-0">
               <div className="h-2 w-64 bg-white/5 rounded-full mb-10 overflow-hidden shadow-inner">
                  <motion.div 
                     initial={{ width: 0 }}
                     whileInView={{ width: '87.4%' }}
                     transition={{ duration: 2, ease: 'easeInOut' }}
                     className="h-full bg-[#02C39A] shadow-[0_0_20px_rgba(2,195,154,0.5)]" 
                  />
               </div>
               <div className="text-[10px] font-black text-[#02C39A] uppercase tracking-[0.5em] mb-16 italic">Architecture Synchronized</div>
               <button className="px-16 py-7 bg-white text-[#0a1628] rounded-[2.5rem] font-syne font-black text-sm uppercase tracking-widest shadow-4xl hover:bg-[#02C39A] hover:rotate-1 active:scale-95 transition-all">Submit Resource Node &rarr;</button>
            </div>
         </div>
      </section>
    </div>
  );
}

