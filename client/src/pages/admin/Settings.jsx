import { Settings, ShieldCheck, Heart, Database, RefreshCw, Save, Activity, Globe, MessageSquare } from 'lucide-react';
import PageShell from '../../components/layout/PageShell';

export default function AdminSettings() {
  return (
    <PageShell 
      title="Architecture Matrix" 
      subtitle="Define global district parameters and mission-critical system synchronization layers."
      icon={Settings}
      actions={
        <button className="h-16 px-10 bg-brand-teal text-[#0a1628] font-syne font-black text-xs rounded-2xl flex items-center gap-3 active:scale-95 shadow-4xl italic uppercase tracking-wider group">
          <Save size={18} className="group-hover:animate-pulse" /> Deploy Changes
        </button>
      }
    >
      <div className="p-20 grid lg:grid-cols-2 gap-24">
         <div className="space-y-12">
            <h3 className="font-syne font-black text-4xl text-[#0a1628] uppercase italic tracking-tighter leading-none flex items-center gap-6">
               <div className="h-2 w-16 bg-brand-teal rounded-full" /> System Node Metadata
            </h3>
            
            <div className="space-y-8">
               {[
                  { label: 'Platform Architecture', val: 'MediReach v2.0 (Stable)', icon: Globe },
                  { label: 'Enclave Region', val: 'Karaikal (UTP_PUDUCHERRY)', icon: Database },
                  { label: 'Admin Command ID', val: 'ADM-KKL-SYNC-001', icon: ShieldCheck },
                  { label: 'Maintenance Interval', val: 'Weekly (03:00 - 05:00)', icon: Activity }
               ].map(item => (
                  <div key={item.label} className="bg-gray-50/50 p-12 rounded-[3.5rem] border border-black/[0.03] flex items-center gap-10 group hover:bg-white hover:shadow-4xl transition-all duration-700 cursor-pointer relative overflow-hidden">
                     <div className="absolute top-0 right-0 h-40 w-40 bg-brand-teal opacity-0 group-hover:opacity-5 rounded-full blur-[80px] transition-opacity" />
                     <div className="h-20 w-20 bg-[#0a1628] rounded-[1.8rem] flex items-center justify-center text-brand-teal shadow-2xl group-hover:scale-110 transition-transform duration-700">
                        <item.icon size={32} />
                     </div>
                     <div className="space-y-1 relative z-10 flex-1">
                        <div className="text-[10px] text-gray-400 font-black uppercase tracking-widest italic leading-none">{item.label}</div>
                        <div className="font-syne font-black text-[#0a1628] text-2xl uppercase italic tracking-tighter">{item.val}</div>
                     </div>
                  </div>
               ))}
            </div>
         </div>

         <div className="space-y-12">
            <h3 className="font-syne font-black text-4xl text-[#0a1628] uppercase italic tracking-tighter leading-none flex items-center gap-6">
               <div className="h-2 w-16 bg-brand-teal rounded-full" /> Master Sync Controls
            </h3>
            
            <div className="grid grid-cols-1 gap-8">
               <div className="p-12 bg-[#0a1628] rounded-[4.5rem] text-white shadow-3xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 h-40 w-40 bg-brand-teal opacity-10 rounded-full blur-[80px] group-hover:opacity-20 transition-opacity" />
                  <div className="space-y-8 relative z-10">
                     <div className="flex items-center justify-between">
                        <div className="space-y-1">
                           <div className="text-[10px] text-brand-teal font-black uppercase tracking-[0.4em] italic">Telemetry Hub</div>
                           <h4 className="font-syne font-black text-2xl uppercase italic tracking-tighter">Socket Node Synchronization</h4>
                        </div>
                        <div className="h-10 w-20 bg-brand-teal/10 rounded-full flex items-center px-1 border border-brand-teal/20"><div className="h-8 w-8 bg-brand-teal rounded-full ml-auto shadow-lg" /></div>
                     </div>
                     <div className="flex items-center justify-between">
                        <div className="space-y-1">
                           <div className="text-[10px] text-brand-teal font-black uppercase tracking-[0.4em] italic">Automatic Enclave Maintenance</div>
                           <h4 className="font-syne font-black text-2xl uppercase italic tracking-tighter">GLOBAL_CRON_SYNC</h4>
                        </div>
                        <div className="h-10 w-20 bg-white/5 rounded-full flex items-center px-1 border border-white/10"><div className="h-8 w-8 bg-white/20 rounded-full" /></div>
                     </div>
                     <button className="h-20 w-full bg-brand-teal text-[#0a1628] font-syne font-black text-sm uppercase italic tracking-[0.2em] rounded-2xl shadow-mint hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4 mt-8"><RefreshCw size={24}/> Force Architecture Re-Sync</button>
                  </div>
               </div>

               <div className="bg-white p-12 rounded-[4rem] border border-black/[0.03] shadow-inner space-y-6 group">
                  <div className="flex items-center gap-4 text-brand-teal font-syne font-black text-sm uppercase italic">
                     <MessageSquare size={24} className="group-hover:animate-shake" /> ADMIN_COMMMS_NODE
                  </div>
                  <p className="text-[#0a1628]/60 font-dm italic font-bold">Broadcasting a district-wide notification pulse will synchronize across all active customer and terminal nodes within 5 seconds.</p>
               </div>
            </div>
         </div>
      </div>
    </PageShell>
  );
}
