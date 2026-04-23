import { motion } from 'framer-motion';
import { MapPin, Store, Truck, Activity, ShieldCheck, Zap, Globe, Navigation } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function DistrictMapArchitecture() {
  const { t } = useLanguage();

  const LOCATIONS = [
    { id: 1, x: '25%', y: '30%', name: 'Nagore Station', type: 'regional', status: 'online' },
    { id: 2, x: '65%', y: '20%', name: 'Karaikal Central', type: 'central', status: 'online' },
    { id: 3, x: '80%', y: '60%', name: 'Poompuhar Hub', type: 'regional', status: 'online' },
    { id: 4, x: '40%', y: '75%', name: 'Tirumalairayanpattinam', type: 'regional', status: 'maintenance' },
    { id: 5, x: '15%', y: '65%', name: 'Keezhavur Center', type: 'regional', status: 'online' }
  ];

  return (
    <section className="py-24 lg:py-40 bg-[#0a1628] relative overflow-hidden">
      {/* Background HUD Graphics */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(2,195,154,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(2,195,154,0.1) 1px, transparent 1px)', backgroundSize: '100px 100px' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[1400px] h-[300px] md:h-[700px] bg-brand-teal/5 rounded-full blur-[150px] md:blur-[300px] opacity-20" />

      <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-32 items-center">
          
          <div className="space-y-16">
            <div className="space-y-6 md:space-y-8 text-center lg:text-left">
              <div className="inline-flex items-center gap-4 px-6 py-2 bg-white/5 border border-white/10 rounded-full text-brand-teal font-syne font-black text-[10px] uppercase tracking-[0.4em] italic shadow-2xl mx-auto lg:mx-0">
                <Globe size={14} className="animate-spin-slow" /> Live Coverage
              </div>
              <h2 className="font-syne font-black text-white text-4xl md:text-6xl lg:text-8xl leading-[0.9] uppercase italic tracking-tighter drop-shadow-4xl">
                Mapping the <br /> <span className="text-brand-teal">Region Pulse.</span>
              </h2>
              <p className="text-white/30 font-dm text-lg md:text-2xl italic font-bold max-w-xl leading-relaxed mx-auto lg:mx-0">Our delivery network synchronizes multiple hubs to ensure sub-30 minute medical delivery across Karaikal.</p>
            </div>

            <div className="grid sm:grid-cols-2 gap-8">
               {[
                 { label: 'Live Tracking', desc: 'Active logistics tracked via GPS.', icon: Truck },
                 { label: 'Verified Pharmacies', icon: Store, desc: 'Licensed pharmacy centers connected to our dashboard.' },
                 { label: 'System Integrity', icon: ShieldCheck, desc: '99.9% uptime across all district regions.' },
                 { label: 'Hub Locations', icon: Navigation, desc: 'Optimized hub placement for fast delivery.' }
               ].map((f, i) => (
                 <motion.div 
                   key={i} 
                   initial={{ opacity: 0, y: 20 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   transition={{ delay: i * 0.1 }}
                   className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] space-y-4 hover:bg-white/10 transition-all group cursor-default"
                 >
                    <div className="h-12 w-12 bg-white/5 rounded-2xl flex items-center justify-center text-brand-teal group-hover:bg-brand-teal group-hover:text-[#0a1628] transition-all duration-500 group-hover:rotate-12 shadow-inner">
                       <f.icon size={24} />
                    </div>
                    <div className="space-y-1">
                       <h4 className="font-syne font-black text-white text-lg uppercase italic tracking-tighter group-hover:text-brand-teal transition-colors">{f.label}</h4>
                       <p className="text-white/20 text-xs font-bold font-dm leading-relaxed uppercase tracking-widest leading-normal">{f.desc}</p>
                    </div>
                 </motion.div>
               ))}
            </div>
          </div>

          <div className="relative w-full overflow-hidden">
             {/* Styled SVG Delivery Map */}
             <div className="relative aspect-square md:aspect-[4/3] bg-white/5 border-4 border-white shadow-4xl rounded-[2.5rem] md:rounded-[5rem] overflow-hidden group">
                <div className="absolute inset-0 bg-[linear-gradient(white/5_1px,transparent_1px),linear-gradient(90deg,white/5_1px,transparent_1px)] bg-[size:50px_50px] opacity-20" />
                
                {/* Simulated District Outlines */}
                <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 400 300">
                   <path d="M50,150 Q100,50 200,80 T350,150 T280,250 T100,280 Z" fill="none" stroke="white" strokeWidth="2" strokeDasharray="8 8" className="animate-dash" />
                </svg>

                {/* Pulse Connections */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100">
                   {LOCATIONS.map((n, i) => i > 0 && (
                     <motion.path
                        key={i}
                        initial={{ pathLength: 0, opacity: 0 }}
                        whileInView={{ pathLength: 1, opacity: 0.2 }}
                        transition={{ duration: 2, delay: i * 0.2 }}
                        d={`M${LOCATIONS[0].x.replace('%','')},${LOCATIONS[0].y.replace('%','')} L${n.x.replace('%','')},${n.y.replace('%','')}`}
                        stroke="#02C39A"
                        strokeWidth="0.5"
                        fill="none"
                     />
                   ))}
                </svg>

                {/* Location Points */}
                {LOCATIONS.map(n => (
                  <motion.div
                    key={n.id}
                    style={{ left: n.x, top: n.y }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group/node"
                  >
                    <div className={`h-6 w-6 rounded-full border-4 border-white shadow-4xl transition-all duration-500 relative flex items-center justify-center ${n.status === 'online' ? 'bg-brand-teal' : 'bg-red-500'} group-hover/node:scale-150`}>
                       <div className="absolute inset-0 bg-inherit rounded-full animate-ping opacity-40" />
                       <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 whitespace-nowrap bg-[#0a1628] text-white text-[9px] font-black px-4 py-2 rounded-xl opacity-0 group-hover/node:opacity-100 transition-opacity uppercase tracking-widest italic border border-white/10 shadow-2xl z-30">
                          {n.name} <span className="text-brand-teal ml-2">✓ Active</span>
                       </div>
                    </div>
                  </motion.div>
                ))}

                {/* Real-time Logistics Stream Simulation */}
                <motion.div
                  animate={{ 
                    x: ['25%', '65%', '80%', '40%', '25%'], 
                    y: ['30%', '20%', '60%', '75%', '30%']
                  }}
                  transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                  className="absolute h-10 w-10 bg-white rounded-2xl flex items-center justify-center text-[#0a1628] shadow-4xl z-40 border-2 border-brand-teal/40"
                >
                   <Truck size={20} className="animate-bounce-slow" />
                </motion.div>

                {/* Map HUD Overlay */}
                 <div className="absolute top-4 right-4 md:top-10 md:right-10 bg-[#0a1628]/80 backdrop-blur-2xl p-4 md:p-6 rounded-[2rem] md:rounded-[2.5rem] border border-white/10 space-y-4 shadow-4xl group-hover:scale-105 transition duration-700 max-w-[180px] md:max-w-none">
                    <div className="flex items-center gap-3 md:gap-4">
                       <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_#10b981]" />
                       <span className="text-[8px] md:text-[10px] font-black text-white/40 uppercase tracking-widest italic leading-none">Live Sync</span>
                    </div>
                    <div className="h-px bg-white/5" />
                    <div className="space-y-2">
                       <div className="flex justify-between gap-6 md:gap-12 items-center">
                          <span className="text-[8px] md:text-[9px] font-black text-white/20 uppercase tracking-widest italic">Hub Activity</span>
                          <span className="text-[10px] md:text-xs font-black text-brand-teal italic">98.4%</span>
                       </div>
                       <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                          <motion.div initial={{ width: 0 }} whileInView={{ width: '98.4%' }} transition={{ duration: 2 }} className="h-full bg-brand-teal" />
                       </div>
                    </div>
                 </div>
             </div>

             {/* Floor Reflection HUD */}
             <div className="mt-12 flex justify-between items-center px-10">
                <div className="flex gap-6">
                   <div className="flex items-center gap-2 text-[10px] font-black text-white/20 uppercase tracking-[0.2em] italic">
                      <div className="h-2 w-2 rounded-full bg-brand-teal" /> Active Hubs
                   </div>
                   <div className="flex items-center gap-2 text-[10px] font-black text-white/20 uppercase tracking-[0.2em] italic">
                      <div className="h-2 w-2 rounded-full bg-red-500" /> Maintenance Sync
                   </div>
                </div>
                <div className="text-[10px] font-black text-white opacity-20 uppercase tracking-[0.4em] italic leading-none">
                   Last Update: 0.04ms
                </div>
             </div>
          </div>

        </div>
      </div>
    </section>
  );
}
