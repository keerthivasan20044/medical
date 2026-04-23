import { motion } from 'framer-motion';
import { Video, Phone, MessageSquare, Clock, ShieldCheck, Star, Calendar, ArrowRight, Activity, Zap } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { Button } from '../../components/common/Core';

const DOCTORS = [
  { id: 1, name: 'Dr. Ramesh Kumar', spec: 'Senior Cardiologist (KKL)', exp: '14+ Yrs', rating: 4.9, fee: 400, online: true, img: '/assets/hospital_pro.png' },
  { id: 2, name: 'Dr. Priya S. Raman', spec: 'Pediatric Specialist', exp: '8+ Yrs', rating: 4.8, fee: 250, online: true, img: '/assets/hospital_pro.png' },
  { id: 3, name: 'Dr. Arjun K. Nair', spec: 'Dermatologist (Nagore)', exp: '11+ Yrs', rating: 4.7, fee: 280, online: false, img: '/assets/hospital_pro.png' }
];

export default function Teleconsult() {
  const { t } = useLanguage();

  return (
    <div className="space-y-10 pb-20">
      {/* Top Protocol Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#0a1628] rounded-[3.5rem] p-10 md:p-16 text-white relative overflow-hidden group shadow-4xl"
      >
        <div className="absolute top-0 right-0 h-96 w-96 bg-[#028090] rounded-full blur-[140px] opacity-10 animate-pulse" />
        <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
             <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-white/5 border border-white/10 rounded-full backdrop-blur-md">
                <div className="h-2 w-2 bg-[#02C39A] rounded-full animate-ping" />
                <span className="text-[10px] font-black uppercase tracking-widest text-white/60 font-syne">Active Health Enclave Synchronized</span>
             </div>
             <h1 className="font-syne font-black text-5xl md:text-7xl leading-[1.1]">
                Instant <br />
                <span className="text-[#02C39A]">Video Consult.</span>
             </h1>
             <p className="text-white/40 font-dm text-lg max-w-md italic">Connect with verified Karaikal doctors in under 2 minutes. Secure, encrypted, and real-time medical architecture.</p>
             <div className="flex flex-wrap gap-4 pt-4">
                <Button className="py-6 px-10 text-lg shadow-2xl shadow-[#02C39A]/20" icon={<Zap size={18}/>}>Initiate Instant Consult</Button>
                <div className="flex items-center gap-6 px-8 py-2 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
                   <div className="text-center">
                      <div className="text-[10px] text-white/30 font-bold uppercase tracking-widest leading-none mb-1">Fee Starts</div>
                      <div className="text-xl font-syne font-black text-white leading-none">₹199</div>
                   </div>
                   <div className="h-8 w-px bg-white/10" />
                   <div className="text-center">
                      <div className="text-[10px] text-white/30 font-bold uppercase tracking-widest leading-none mb-1">Wait Time</div>
                      <div className="text-xl font-syne font-black text-[#02C39A] leading-none">~2m</div>
                   </div>
                </div>
             </div>
          </div>
          <div className="hidden lg:block relative">
             <div className="h-[400px] w-full bg-white/5 border border-white/10 rounded-[3rem] overflow-hidden backdrop-blur-xl group-hover:border-[#02C39A]/30 transition-all duration-700">
                <img src="/assets/crt_scan.png" className="h-full w-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-60 transition duration-700" alt="Consult" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628] to-transparent" />
                <div className="absolute bottom-10 left-10 right-10 flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <div className="h-12 w-12 bg-[#02C39A] rounded-2xl flex items-center justify-center text-[#0a1628] shadow-lg shadow-[#02C39A]/20"><Video size={20}/></div>
                      <div>
                         <div className="text-xs font-dm font-black uppercase text-white tracking-widest leading-none">Incoming Protocol...</div>
                         <div className="text-[10px] text-white/40 font-bold uppercase tracking-tighter mt-1">Satellite Link Synchronized</div>
                      </div>
                   </div>
                   <div className="flex items-center gap-2">
                      <div className="h-3 w-3 bg-[#02C39A] rounded-full animate-pulse" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-[#02C39A]">Encrypted</span>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </motion.div>

      {/* Main Grid Architecture */}
      <div className="grid lg:grid-cols-12 gap-10">
        
        {/* Available Nodes (Doctors) */}
        <div className="lg:col-span-8 space-y-8">
          <div className="flex items-end justify-between px-4">
             <div className="space-y-1">
                <h3 className="font-syne font-black text-[#0a1628] text-2xl">Verified Medical Nodes</h3>
                <p className="text-gray-400 font-dm text-sm italic">Local specialists across the district enclave.</p>
             </div>
             <button className="text-[10px] font-black text-[#028090] uppercase tracking-widest hover:underline underline-offset-4 decoration-2">See Global Directory &rarr;</button>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {DOCTORS.map((d, i) => (
              <motion.div 
                key={d.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white border border-gray-100 rounded-[2.5rem] p-8 hover:shadow-2xl transition-all duration-500 group relative overflow-hidden"
              >
                <div className="relative z-10 flex items-center gap-6">
                   <div className="h-24 w-24 rounded-3xl overflow-hidden border-2 border-transparent group-hover:border-[#02C39A] transition duration-500 shadow-lg">
                      <img src={d.img} className="h-full w-full object-cover grayscale group-hover:grayscale-0 transition duration-500" alt={d.name} />
                   </div>
                   <div className="space-y-1 flex-1">
                      <div className="flex items-center justify-between">
                         <div className="text-[9px] font-black text-[#028090] uppercase tracking-widest">Available Protocols</div>
                         <div className="flex items-center gap-1 text-amber-500 text-[10px] font-bold">
                            <Star size={10} fill="currentColor" /> {d.rating}
                         </div>
                      </div>
                      <h4 className="font-syne font-black text-[#0a1628] text-lg leading-tight group-hover:text-[#028090] transition">{d.name}</h4>
                      <p className="text-xs font-dm text-gray-400 font-bold">{d.spec} · {d.exp}</p>
                   </div>
                </div>
                
                <div className="mt-8 pt-8 border-t border-gray-50 flex items-center justify-between relative z-10">
                   <div>
                      <div className="text-[10px] text-gray-300 font-bold uppercase tracking-widest leading-none mb-1">Consult Fee</div>
                      <div className="text-lg font-syne font-black text-[#0a1628]">₹{d.fee}</div>
                   </div>
                   <button className="h-14 px-8 bg-gray-50 border border-transparent hover:border-[#02C39A]/20 hover:bg-white text-[#0a1628] font-syne font-bold text-xs rounded-2xl transition-all flex items-center gap-3 active:scale-95 group/btn shadow-sm">
                      Select Protocol <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition" />
                   </button>
                </div>
                
                {/* Status Indicator */}
                {d.online && <div className="absolute top-6 right-6 h-3 w-3 bg-[#02C39A] rounded-full border-2 border-white animate-pulse shadow-lg" />}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Secondary Enclave Sidebar */}
        <div className="lg:col-span-4 space-y-10">
          {/* Upcoming Appointment Protocol */}
          <div className="bg-white border border-gray-100 rounded-[3rem] p-10 space-y-8 shadow-sm">
             <div className="flex items-center justify-between">
                <h3 className="font-syne font-black text-[#0a1628] text-xl">Node Queue</h3>
                <Clock className="text-[#028090]" size={18} />
             </div>
             <div className="p-6 bg-gray-50 rounded-[2.5rem] border border-gray-100 relative group hover:bg-white hover:border-[#02C39A]/20 transition-all duration-500 shadow-inner hover:shadow-xl">
                <div className="flex items-center gap-4 mb-6">
                   <div className="h-12 w-12 rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                      <img src="/assets/crt_scan.png" className="h-full w-full object-cover" alt="Dr. Mallika" />
                   </div>
                   <div>
                      <div className="text-sm font-syne font-black text-[#0a1628]">Dr. C. Mallika</div>
                      <div className="text-[10px] text-gray-400 font-dm font-black uppercase tracking-widest">Tomorrow · 10:00 AM</div>
                   </div>
                </div>
                <button className="w-full py-4 bg-[#0a1628] text-[#02C39A] rounded-2xl font-syne font-bold text-xs shadow-xl shadow-[#0a1628]/20 active:scale-95 transition flex items-center justify-center gap-3">
                   <Video size={14} /> Synchronize Node Call
                </button>
             </div>
             
             <div className="pt-6 border-t border-gray-50 space-y-4">
                <h4 className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em]">Protocol Highlights</h4>
                {[
                   { icon: ShieldCheck, label: 'Encrypted Stream' },
                   { icon: FileText, label: 'Instant Rx Node' },
                   { icon: Activity, label: 'Vitals Sync Ready' }
                ].map((h, i) => (
                   <div key={i} className="flex items-center gap-4 text-xs font-dm font-bold text-gray-500">
                      <div className="h-8 w-8 bg-gray-50 rounded-xl flex items-center justify-center text-[#028090] shadow-sm"><h.icon size={14}/></div>
                      {h.label}
                   </div>
                ))}
             </div>
          </div>
          
          {/* Support Node */}
          <div className="bg-[#028090] rounded-[3rem] p-10 text-white space-y-6 relative overflow-hidden group shadow-3xl">
             <div className="absolute top-0 right-0 h-32 w-32 bg-[#02C39A] rounded-full blur-[80px] opacity-20" />
             <div className="h-12 w-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md mb-6"><MessageSquare size={20}/></div>
             <h3 className="font-syne font-black text-2xl leading-tight">Need Medical <br /> Telemetry Guidance?</h3>
             <p className="text-white/40 font-dm text-sm leading-relaxed">Our district support AI is available 24/7 for health enclave navigation.</p>
             <button className="w-full py-5 bg-white text-[#028090] rounded-2xl font-syne font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-black/20">Init Agent Chat</button>
          </div>
        </div>
      </div>
    </div>
  );
}


