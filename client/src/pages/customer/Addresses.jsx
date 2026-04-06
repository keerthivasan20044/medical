import { MapPin, Plus, Trash, Edit, CheckCircle, Globe } from 'lucide-react';
import PageShell from '../../components/layout/PageShell';

export default function Addresses() {
  return (
    <PageShell 
      title="Terminal Mapping" 
      subtitle="Edit your district delivery nodes and enclave geo-coordinates."
      icon={MapPin}
      actions={
        <button className="h-16 px-10 bg-brand-teal text-[#0a1628] font-syne font-black text-xs rounded-2xl flex items-center gap-3 active:scale-95 shadow-4xl italic uppercase tracking-wider group">
          <Plus size={18} className="group-hover:rotate-12 transition-transform" /> Add New Node
        </button>
      }
    >
      <div className="p-20 grid lg:grid-cols-2 gap-12">
         {[1, 2].map(i => (
            <div key={i} className="bg-gray-50/50 p-16 rounded-[4.5rem] border border-black/[0.03] shadow-inner space-y-12 group hover:bg-white hover:shadow-4xl transition-all duration-700 relative overflow-hidden">
               <div className="absolute top-0 right-0 h-40 w-40 bg-brand-teal opacity-0 group-hover:opacity-5 rounded-full blur-[80px] transition-opacity" />
               <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-6">
                     <div className="h-16 w-16 bg-[#0a1628] rounded-2xl flex items-center justify-center text-brand-teal shadow-2xl group-hover:scale-110 transition-transform duration-700">
                        <MapPin size={24} />
                     </div>
                     <div className="space-y-1">
                        <div className="text-[10px] text-gray-300 font-black uppercase tracking-widest italic leading-none">Primary Logistics Node</div>
                        <div className="font-syne font-black text-[#0a1628] text-xl uppercase italic tracking-tighter flex items-center gap-3">KKL-MAIN-RES <CheckCircle size={18} className="text-brand-teal"/></div>
                     </div>
                  </div>
               </div>
               
               <div className="space-y-4 font-dm italic font-bold text-gray-400 relative z-10">
                  <p>14, New Colony Road, <span className="text-[#0a1628]">Karaikal District Enclave</span>. [609602]</p>
                  <p className="flex items-center gap-3 text-brand-teal"><Globe size={16}/> GPS Locked: 10.9254° N, 79.8380° E</p>
               </div>

               <div className="flex gap-6 relative z-10 pt-4 border-t border-black/[0.05]">
                  <button className="flex items-center gap-3 text-[10px] text-gray-300 font-black uppercase tracking-widest italic hover:text-brand-teal transition-colors"><Edit size={14}/> Edit Node</button>
                  <button className="flex items-center gap-3 text-[10px] text-gray-300 font-black uppercase tracking-widest italic hover:text-red-500 transition-colors"><Trash size={14}/> Delete Node</button>
               </div>
            </div>
         ))}
      </div>
    </PageShell>
  );
}
