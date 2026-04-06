import { Settings, Store, Clock, Phone, Globe, ShieldCheck, Heart, Save, RefreshCw } from 'lucide-react';
import PageShell from '../../components/layout/PageShell';

export default function PharmacySettings() {
  return (
    <PageShell 
      title="Terminal Config" 
      subtitle="Modify active pharmacy node parameters and district synchronization protocols."
      icon={Settings}
      actions={
        <button className="h-16 px-10 bg-brand-teal text-[#0a1628] font-syne font-black text-xs rounded-2xl flex items-center gap-3 active:scale-95 shadow-4xl italic uppercase tracking-wider group">
          <Save size={18} className="group-hover:animate-pulse" /> Update Terminal
        </button>
      }
    >
      <div className="p-20 grid lg:grid-cols-2 gap-24">
         <div className="space-y-12">
            <h3 className="font-syne font-black text-4xl text-[#0a1628] uppercase italic tracking-tighter leading-none flex items-center gap-6">
               <div className="h-2 w-16 bg-brand-teal rounded-full" /> Terminal Node Meta
            </h3>
            
            <div className="space-y-8">
               {[
                  { label: 'Terminal Name', val: 'Apollo Pharmacy', icon: Store },
                  { label: 'Active Enclave', val: 'Karaikal New Colony', icon: Globe },
                  { label: 'Emergency Contact', val: '+91 94432 XXXXX', icon: Phone },
                  { label: 'Operational Sync', val: '08:00 AM - 10:00 PM', icon: Clock }
               ].map(item => (
                  <div key={item.label} className="bg-gray-50/50 p-12 rounded-[3.5rem] border border-black/[0.03] flex items-center gap-10 group hover:bg-white hover:shadow-4xl transition-all duration-700 cursor-pointer relative overflow-hidden">
                     <div className="absolute top-0 right-0 h-40 w-40 bg-brand-teal opacity-0 group-hover:opacity-5 rounded-full blur-[80px] transition-opacity" />
                     <div className="h-20 w-20 bg-[#0a1628] rounded-[1.8rem] flex items-center justify-center text-brand-teal shadow-2xl group-hover:scale-110 transition-transform duration-700">
                        <item.icon size={32} />
                     </div>
                     <div className="space-y-1 relative z-10 flex-1">
                        <div className="text-[10px] text-gray-300 font-black uppercase tracking-widest italic leading-none">{item.label}</div>
                        <input type="text" defaultValue={item.val} className="w-full bg-transparent font-syne font-black text-[#0a1628] text-2xl uppercase italic tracking-tighter outline-none" />
                     </div>
                  </div>
               ))}
            </div>
         </div>

         <div className="space-y-12">
            <h3 className="font-syne font-black text-4xl text-[#0a1628] uppercase italic tracking-tighter leading-none flex items-center gap-6">
               <div className="h-2 w-16 bg-brand-teal rounded-full" /> Protocol Lockdown
            </h3>
            
            <div className="grid grid-cols-1 gap-8">
               <div className="p-12 bg-white/5 border-4 border-dashed border-gray-100 rounded-[4rem] text-center space-y-8 group hover:border-brand-teal transition-all duration-1000">
                  <div className="flex justify-center"><ShieldCheck size={64} className="text-gray-200 group-hover:text-brand-teal group-hover:scale-110 transition duration-700" /></div>
                  <div className="space-y-2">
                     <h4 className="font-syne font-black text-3xl text-[#0a1628] uppercase italic tracking-tighter leading-none">TERMINAL_SECURE_LOCK</h4>
                     <p className="text-gray-400 font-dm italic font-bold">End-to-end encrypted medical synchronization is currently active for this district node.</p>
                  </div>
                  <button className="h-20 w-full bg-[#0a1628] text-brand-teal font-syne font-black text-sm uppercase italic tracking-widest rounded-2xl shadow-4xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4"><RefreshCw size={24}/> Re-Sync Enclave Security</button>
               </div>

               <div className="bg-brand-teal/5 border-2 border-dashed border-brand-teal/20 p-12 rounded-[4rem] space-y-6">
                  <div className="flex items-center gap-4 text-brand-teal font-syne font-black text-sm uppercase italic">
                     <Heart size={24} /> HEALTH_WELLNESS_ADHERENCE
                  </div>
                  <p className="text-[#0a1628]/60 font-dm italic font-bold">Modifying core terminal metadata requires re-verification by district healthcare command within 24 hours.</p>
               </div>
            </div>
         </div>
      </div>
    </PageShell>
  );
}
