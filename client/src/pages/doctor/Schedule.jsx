import { Calendar, Clock, Edit, Save, Plus, ShieldCheck, Heart, ArrowRight } from 'lucide-react';
import PageShell from '../../components/layout/PageShell';

export default function Schedule() {
  return (
    <PageShell 
      title="Architecture Sync" 
      subtitle="Define your clinical availability and district consultation timeframes."
      icon={Calendar}
      actions={
        <button className="h-16 px-10 bg-brand-teal text-[#0a1628] font-syne font-black text-xs rounded-2xl flex items-center gap-3 active:scale-95 shadow-4xl italic uppercase tracking-wider group">
          <Save size={18} className="group-hover:animate-pulse" /> Finalize Schedule
        </button>
      }
    >
      <div className="p-20 grid lg:grid-cols-[1fr_450px] gap-20">
         <div className="space-y-16">
            <h3 className="font-syne font-black text-3xl text-[#0a1628] uppercase italic leading-none flex items-center gap-6">
               <div className="h-2 w-16 bg-brand-teal rounded-full" /> Weekly Time Handshake
            </h3>
            
            <div className="space-y-4">
               {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                  <div key={day} className="bg-white p-10 rounded-[3.5rem] border border-black/[0.03] shadow-soft hover:shadow-4xl transition-all duration-700 flex flex-col md:flex-row md:items-center justify-between gap-10 group relative overflow-hidden">
                     <div className="absolute top-0 right-0 h-40 w-40 bg-brand-teal opacity-0 group-hover:opacity-5 rounded-full blur-[80px] transition-opacity" />
                     <div className="font-syne font-black text-[#0a1628] text-2xl uppercase italic tracking-tighter w-40 relative z-10">{day}</div>
                     
                     <div className="flex-1 flex gap-6 relative z-10">
                        {['09:00 - 13:00', '16:00 - 20:00'].map(slot => (
                           <div key={slot} className="px-8 py-4 bg-gray-50/50 border border-black/[0.01] rounded-2xl flex items-center justify-between gap-6 group/slot hover:border-brand-teal transition-colors flex-1">
                              <span className="font-dm text-xl italic font-bold text-[#0a1628]">{slot}</span>
                              <Edit size={16} className="text-gray-200 group-hover/slot:text-brand-teal transition-colors cursor-pointer" />
                           </div>
                        ))}
                        <button className="h-14 w-14 bg-brand-teal/10 text-brand-teal rounded-2xl flex items-center justify-center hover:bg-[#0a1628] hover:text-white transition-all"><Plus size={24}/></button>
                     </div>
                  </div>
               ))}
            </div>
         </div>

         <div className="space-y-12">
            <div className="bg-[#0a1628] p-12 rounded-[4.5rem] text-white space-y-12 shadow-4xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 h-40 w-40 bg-brand-teal opacity-0 group-hover:opacity-10 rounded-full blur-[80px] transition-opacity" />
               <h4 className="font-syne font-black text-2xl uppercase italic tracking-tighter text-brand-teal flex items-center gap-4">
                  <Clock size={24}/> Real-time Sync
               </h4>
               <div className="space-y-6 relative z-10">
                  <p className="text-white/40 font-dm italic font-bold">Your schedule is currently synchronized with the public district enclave. Patients can book till 26 April 2026.</p>
                  <div className="p-8 bg-white/5 border border-white/5 rounded-3xl flex items-center justify-between group hover:bg-white/10 transition cursor-pointer">
                     <div className="font-syne font-black text-white text-lg uppercase italic tracking-tighter">Emergency Buffer: ON</div>
                     <div className="h-6 w-12 bg-brand-teal rounded-full flex items-center px-1"><div className="h-4 w-4 bg-[#0a1628] rounded-full ml-auto" /></div>
                  </div>
               </div>
            </div>
            
            <div className="bg-white p-12 rounded-[4rem] border border-black/[0.03] shadow-inner space-y-6 group">
               <div className="flex items-center gap-4 text-brand-teal font-syne font-black text-sm uppercase italic">
                  <ShieldCheck size={24} className="group-hover:animate-shake" /> SYNC_ADHERENCE_PROTO
               </div>
               <p className="text-[#0a1628]/60 font-dm italic font-bold">Modifying availability window requires 12H system stabilization before updating public district nodes.</p>
            </div>
         </div>
      </div>
    </PageShell>
  );
}
