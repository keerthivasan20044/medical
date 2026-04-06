import { User, Activity, FileText, Calendar, Plus, ChevronRight, ShieldCheck, Heart, Clock, MessageSquare } from 'lucide-react';
import PageShell from '../../components/layout/PageShell';

export default function PatientDetail() {
  return (
    <PageShell 
      title="Clinical Node Audit" 
      subtitle="Comprehensive medical history and clinical metadata for patient node: Ramesh Kumar."
      icon={User}
      actions={
        <div className="flex gap-4">
          <button className="h-16 px-10 bg-brand-teal text-[#0a1628] font-syne font-black text-xs rounded-2xl flex items-center gap-3 active:scale-95 shadow-4xl italic uppercase tracking-wider group">
            <Plus size={18} className="group-hover:animate-pulse" /> Create Rx Node
          </button>
          <button className="h-16 px-10 bg-[#0a1628] text-brand-teal font-syne font-black text-xs rounded-2xl flex items-center gap-3 active:scale-95 shadow-4xl italic uppercase tracking-wider">
            <MessageSquare size={18} /> Direct Tele-Pulse
          </button>
        </div>
      }
    >
      <div className="p-20 grid lg:grid-cols-[1fr_450px] gap-20">
         <div className="space-y-16">
            <div className="bg-gray-50/50 p-12 rounded-[4rem] border border-black/[0.03] space-y-12">
               <h3 className="font-syne font-black text-3xl text-[#0a1628] uppercase italic leading-none flex items-center gap-6">
                  Biological Metadata
               </h3>
               <div className="grid md:grid-cols-4 gap-8">
                  {[
                     { label: 'Clinical Age', val: '42' },
                     { label: 'Blood Group', val: 'O+' },
                     { label: 'Target Weight', val: '72kg' },
                     { label: 'Height Sync', val: '178cm' }
                  ].map(stat => (
                     <div key={stat.label} className="p-8 bg-white rounded-3xl border border-black/[0.01] shadow-soft flex flex-col gap-2 items-center text-center">
                        <div className="text-[8px] text-gray-300 font-black uppercase tracking-[0.4em] italic leading-none">{stat.label}</div>
                        <div className="font-syne font-black text-[#0a1628] text-xl uppercase italic leading-none transition duration-700">{stat.val}</div>
                     </div>
                  ))}
               </div>
            </div>

            <div className="space-y-8">
               <h3 className="font-syne font-black text-3xl text-[#0a1628] uppercase italic leading-none flex items-center gap-6">
                  Sync History Clusters
               </h3>
               <div className="space-y-6">
                  {[
                     { date: '24 Mar 2026', type: 'Clinical Consultation', node: 'KKL-GENERAL-HOST', clinical: 'Viral Fever Cluster' },
                     { date: '12 Feb 2026', type: 'Lab Synchronization', node: 'KKL-DIAGNOSTIC-NODE', clinical: 'Blood Audit Complete' }
                  ].map(log => (
                     <div key={log.date} className="bg-white p-10 rounded-[3.5rem] border border-black/[0.03] shadow-soft hover:shadow-4xl transition-all duration-700 flex items-center justify-between group cursor-pointer">
                        <div className="flex items-center gap-8">
                           <div className="h-16 w-16 bg-gray-50 rounded-2xl flex items-center justify-center text-brand-teal group-hover:scale-110 transition-transform duration-700"><FileText size={24}/></div>
                           <div className="space-y-1">
                              <div className="text-[10px] text-gray-300 font-black uppercase tracking-widest italic">{log.date} — {log.node}</div>
                              <div className="font-syne font-black text-[#0a1628] text-xl uppercase italic tracking-tighter">{log.type}</div>
                              <div className="text-xs font-dm font-bold text-brand-teal">{log.clinical}</div>
                           </div>
                        </div>
                        <ChevronRight className="text-gray-200 group-hover:text-brand-teal transition-colors" size={24} />
                     </div>
                  ))}
               </div>
            </div>
         </div>

         <div className="space-y-12">
            <div className="bg-[#0a1628] p-12 rounded-[4rem] text-white space-y-12 relative overflow-hidden group shadow-4xl">
               <div className="absolute top-0 right-0 h-40 w-40 bg-brand-teal opacity-0 group-hover:opacity-10 rounded-full blur-[80px] transition-opacity" />
               <div className="space-y-8 relative z-10">
                  <div className="flex items-center gap-6">
                     <div className="h-20 w-20 bg-brand-teal rounded-[2rem] flex items-center justify-center text-[#0a1628] shadow-2xl transition group-hover:scale-105"><Activity size={32}/></div>
                     <div>
                        <h3 className="font-syne font-black text-2xl uppercase italic tracking-tighter text-white">Clinical Vitals</h3>
                        <p className="text-white/40 font-dm italic font-bold">Last Sync: Today 10:42 AM</p>
                     </div>
                  </div>
                  
                  <div className="space-y-6">
                     <div className="p-8 bg-white/5 border border-white/5 rounded-3xl flex items-center justify-between group hover:bg-white/10 transition">
                        <div className="space-y-1">
                           <div className="text-[10px] text-brand-teal font-black uppercase tracking-widest italic leading-none">Blood Pressure Sync</div>
                           <div className="font-syne font-black text-white text-3xl uppercase italic tracking-tighter">120/80 <span className="text-[10px] opacity-30">mmHg</span></div>
                        </div>
                     </div>
                     <div className="p-8 bg-white/5 border border-white/5 rounded-3xl flex items-center justify-between group hover:bg-white/10 transition">
                        <div className="space-y-1">
                           <div className="text-[10px] text-brand-teal font-black uppercase tracking-widest italic leading-none">Pulse Rhythm</div>
                           <div className="font-syne font-black text-white text-3xl uppercase italic tracking-tighter">72 <span className="text-[10px] opacity-30">BPM</span></div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
            
            <div className="bg-white p-12 rounded-[4rem] border border-black/[0.03] shadow-inner space-y-6 group">
               <div className="flex items-center gap-4 text-brand-teal font-syne font-black text-sm uppercase italic">
                  <ShieldCheck size={24} className="group-hover:animate-float" /> PRIVACY_LOCK_ACTIVE
               </div>
               <p className="text-[#0a1628]/60 font-dm italic font-bold">This patient node session is encrypted and synchronized under district healthcare privacy protocols.</p>
            </div>
         </div>
      </div>
    </PageShell>
  );
}
