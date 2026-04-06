import { motion } from 'framer-motion';
import { PackageX, ArrowRight, Home, Pill, HelpCircle, WifiOff, Settings, ShieldCheck, Heart, Phone, RefreshCw, Headphones, X, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/common/Core';

/**
 * Node Not Found Architecture.
 */
export function NotFound() {
  return (
    <div className="min-h-screen bg-[#0a1628] flex items-center justify-center p-12 relative overflow-hidden">
       {/* Background "404" Grid */}
       <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <span className="font-syne font-black text-[30rem] text-white/[0.03] tracking-tighter leading-none translate-y-20">404</span>
       </div>
       <div className="absolute inset-0 bg-grid opacity-10" />
       
       <div className="relative z-10 w-full max-w-2xl text-center space-y-16">
          <div className="relative flex justify-center">
             <div className="absolute -inset-12 bg-[#028090] rounded-full blur-[80px] opacity-20 animate-pulse" />
             <div className="h-32 w-32 bg-white/10 backdrop-blur-3xl rounded-[2.5rem] border border-white/5 flex items-center justify-center text-[#02C39A] shadow-4xl group transition-all duration-1000 active:scale-95">
                <PackageX size={80} className="animate-float" />
             </div>
          </div>
          
          <div className="space-y-6">
             <h1 className="font-syne font-black text-6xl text-white tracking-tighter leading-tight drop-shadow-2xl">Oops! Node Not <br /><span className="text-[#02C39A]">Found.</span></h1>
             <p className="text-white/40 font-dm text-2xl italic leading-relaxed max-w-lg mx-auto selection:bg-[#02C39A] selection:text-[#0a1628]">The page you're searching for has gone on a medicine run in Karaikal district enclave. 🚴</p>
          </div>

          <div className="flex flex-col md:flex-row gap-6 justify-center pt-8">
             <Link to="/" className="flex-1">
                <Button className="w-full" icon={<Home size={18} />}>Return to Command Center</Button>
             </Link>
             <Link to="/medicines" className="flex-1">
                <Button variant="outline" className="w-full text-white border-white/20 hover:bg-white/5" icon={<Pill size={18} />}>Browse Enclave Store</Button>
             </Link>
          </div>

          <div className="pt-16 border-t border-white/5 space-y-8">
             <div className="max-w-md mx-auto p-6 bg-white/5 rounded-2xl border border-white/5 italic text-[10px] text-[#02C39A]">
                "Tip: Drinking 8 glasses of Karaikal water daily improves metabolic architecture sync."
             </div>
             <p className="text-[10px] text-white/20 font-black uppercase tracking-[0.4em] italic mb-6">Healing Architecture Protocol Enclave</p>
             <div className="flex items-center justify-center gap-12 text-white/10 uppercase font-black text-[8px] tracking-widest">
                <span className="flex items-center gap-2 hover:text-[#02C39A] transition cursor-help"><HelpCircle size={12}/> Emergency Support Node</span>
                <span className="flex items-center gap-2 hover:text-[#02C39A] transition cursor-help"><ShieldCheck size={12}/> Security Protocol Verified</span>
             </div>
          </div>
       </div>
    </div>
  );
}

/**
 * Connection Sync Error Node.
 */
export function Offline() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 md:p-12 relative overflow-hidden">
       {/* Stylized background */}
       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-red-100/30 rounded-full blur-[180px] opacity-40 animate-pulse-ring" />
       
       <div className="relative z-10 w-full max-w-xl bg-white rounded-[5rem] p-16 md:p-24 shadow-5xl border border-gray-100 text-center space-y-16">
          <div className="relative flex justify-center">
             <div className="h-40 w-40 bg-[#0a1628] rounded-[3.5rem] flex items-center justify-center shadow-4xl group transition-all duration-700">
                <WifiOff size={80} className="text-red-500 group-hover:scale-110 transition duration-500" />
             </div>
             <div className="absolute -top-4 -right-4 h-14 w-14 bg-red-500 rounded-full border-4 border-white animate-bounce shadow-xl flex items-center justify-center text-white"><X size={24} /></div>
          </div>

          <div className="space-y-6">
             <h2 className="font-syne font-black text-5xl text-[#0a1628] tracking-tighter leading-tight">Sync Error: You are <br /><span className="text-red-500">Offline.</span></h2>
             <p className="text-gray-400 font-dm text-lg italic tracking-wide leading-relaxed">Terminal disconnect from the Karaikal district enclave. Re-establish internet protocol to order medicines.</p>
          </div>

          <div className="grid gap-6">
             <Button className="w-full bg-[#0a1628] hover:bg-black transition-all" onClick={() => window.location.reload()}>Retry Connection Sync &rarr;</Button>
             <div className="p-8 bg-gray-50 rounded-3xl space-y-4 border border-gray-100 group hover:border-[#028090] transition duration-500">
                <div className="text-[10px] text-gray-300 font-black uppercase tracking-widest text-center">Emergency Protocol</div>
                <div className="font-syne font-black text-[#0a1628] text-sm uppercase tracking-tighter">Govt General Hospital Karaikal</div>
                <div className="text-xl font-dm italic text-[#028090] flex items-center justify-center gap-4 group-hover:scale-105 transition"><Phone size={20}/> 04368-222288</div>
             </div>
          </div>
       </div>
    </div>
  );
}

/**
 * Enclave Maintenance Protocol Node.
 */
export function Maintenance() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6 md:p-12 relative overflow-hidden">
       {/* Stylized background lines */}
       <div className="absolute inset-0 bg-grid opacity-5" />
       <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#02C39A] via-[#028090] to-transparent" />
       
       <div className="relative z-10 w-full max-w-2xl text-center space-y-16">
          <div className="relative flex justify-center">
             <div className="absolute -inset-10 bg-[#02C39A] rounded-full blur-[60px] opacity-10 animate-pulse" />
             <div className="h-40 w-40 bg-[#0a1628] rounded-[3rem] flex items-center justify-center text-[#02C39A] shadow-4xl relative z-10 border-4 border-white transition group">
                <Settings size={80} className="animate-rotate-slow group-hover:scale-110 transition duration-[2s]" />
             </div>
          </div>

          <div className="space-y-8">
             <div className="text-[10px] text-[#028090] font-black uppercase tracking-[0.4em] italic leading-none flex items-center justify-center gap-6"><div className="h-0.5 w-12 bg-current" /> Enclave Maintenance Protocol <div className="h-0.5 w-12 bg-current" /></div>
             <h2 className="font-syne font-black text-6xl text-[#0a1628] tracking-tighter leading-tight select-none">Undergoing Architecture <br /><span className="text-[#028090]">Synchronization.</span></h2>
             <p className="text-gray-400 font-dm text-2xl italic leading-relaxed opacity-80 shrink-0">We will be back in 2 hours. Our nodes are currently upgrading for Karaikal district wellness.</p>
          </div>

          <div className="p-12 bg-gray-50 rounded-[3.5rem] border border-gray-100 flex flex-col md:flex-row items-center gap-10 group hover:bg-white transition duration-700 hover:shadow-2xl">
              <div className="h-16 w-16 bg-[#0a1628] text-[#02C39A] rounded-2xl flex items-center justify-center shadow-xl shrink-0"><Phone size={32}/></div>
              <div className="flex-1 space-y-2 text-left">
                 <div className="text-[10px] text-gray-300 font-black uppercase tracking-widest leading-none">Emergency Architecture Access</div>
                 <div className="font-syne font-black text-xl text-[#0a1628]">Apollo Pharmacy Karaikal Protocol</div>
                 <div className="text-2xl font-dm italic text-[#028090] font-bold">+91 94432 11111</div>
              </div>
          </div>

          <div className="flex items-center justify-center gap-12 pt-12">
              <span className="flex items-center gap-3 text-[10px] font-black uppercase text-gray-300 tracking-[0.2em] group cursor-pointer hover:text-[#02C39A] transition duration-500"><Heart size={14} className="group-hover:animate-shake"/> Healthy Community</span>
              <span className="flex items-center gap-3 text-[10px] font-black uppercase text-gray-300 tracking-[0.2em] group cursor-pointer hover:text-[#02C39A] transition duration-500"><ShieldCheck size={14} className="group-hover:animate-float"/> Verified Sync</span>
          </div>
       </div>
    </div>
  );
}

/**
 * District System Error Node (500).
 */
export function ServerError() {
  return (
    <div className="min-h-screen bg-[#0a1628] flex items-center justify-center p-12 relative overflow-hidden">
       <div className="absolute inset-0 bg-grid opacity-10" />
       <div className="absolute inset-0 bg-gradient-to-b from-red-600/10 to-transparent" />
       
       <div className="relative z-10 w-full max-w-2xl text-center space-y-16">
          <div className="relative flex justify-center">
             <div className="absolute -inset-12 bg-red-600 rounded-full blur-[80px] opacity-20 animate-pulse" />
             <div className="h-32 w-32 bg-white/10 backdrop-blur-3xl rounded-[2.5rem] border border-white/5 flex items-center justify-center text-red-500 shadow-4xl group transition-all duration-1000">
                <AlertCircle size={80} className="animate-shake" />
             </div>
          </div>
          
          <div className="space-y-6">
             <h1 className="font-syne font-black text-6xl text-white tracking-tighter leading-tight drop-shadow-2xl">Terminal System <br /><span className="text-red-500">Error.</span></h1>
             <p className="text-white/40 font-dm text-2xl italic leading-relaxed max-w-lg mx-auto">The Karaikal District server has encountered a critical architectural failure. Emergency protocols active.</p>
          </div>

          <div className="flex flex-col md:flex-row gap-6 justify-center pt-8">
             <button onClick={() => window.location.reload()} className="h-20 px-12 bg-red-600 text-white font-syne font-black text-sm rounded-2xl hover:bg-red-700 transition shadow-4xl flex-1 flex items-center justify-center gap-4 uppercase italic tracking-widest active:scale-95">
               <RefreshCw size={24} /> Retry System Sync
             </button>
             <Link to="/contact" className="flex-1">
                <button className="h-20 w-full bg-white/5 border border-white/10 text-white font-syne font-black text-sm rounded-2xl hover:bg-white/10 transition flex items-center justify-center gap-4 uppercase italic tracking-widest active:scale-95 text-center px-12">
                   <Headphones size={24} /> Contact Command
                </button>
             </Link>
          </div>
       </div>
    </div>
  );
}
