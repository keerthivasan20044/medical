import { MapPin, Plus, Trash, Edit, CheckCircle, Globe } from 'lucide-react';
import PageShell from '../../components/layout/PageShell';

export default function Addresses() {
  return (
    <PageShell 
      title="Saved Nodes" 
      subtitle="Manage your delivery enclaves and geo-coordinates."
      icon={MapPin}
      actions={
        <button className="h-12 md:h-16 px-6 md:px-10 bg-teal-500 text-navy font-syne font-black text-[10px] md:text-xs rounded-xl md:rounded-2xl flex items-center gap-2 md:gap-3 active:scale-95 shadow-xl italic uppercase tracking-wider group">
          <Plus size={16} className="group-hover:rotate-12 transition-transform" /> <span className="hidden sm:inline">Add New Node</span><span className="sm:hidden">Add Node</span>
        </button>
      }
    >
      <div className="p-4 md:p-10 lg:p-20 grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8 lg:gap-12">
         {[1, 2].map(i => (
            <div key={i} className="bg-white p-6 md:p-10 lg:p-16 rounded-2xl md:rounded-[3rem] lg:rounded-[4.5rem] border border-gray-100 shadow-sm space-y-6 md:space-y-10 group hover:shadow-2xl transition-all duration-500 relative overflow-hidden">
               <div className="absolute top-0 right-0 h-32 w-32 bg-teal-500 opacity-0 group-hover:opacity-5 rounded-full blur-[60px] transition-opacity" />
               <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-4 md:gap-6">
                     <div className="h-12 w-12 md:h-16 md:w-16 bg-navy rounded-xl md:rounded-2xl flex items-center justify-center text-teal-400 shadow-xl group-hover:scale-110 transition-transform duration-700">
                        <MapPin size={20} />
                     </div>
                     <div className="space-y-0.5">
                        <div className="text-[9px] md:text-[10px] text-gray-400 font-black uppercase tracking-widest italic leading-none">Logistics Node</div>
                        <div className="font-syne font-black text-navy text-lg md:text-xl uppercase italic tracking-tighter flex items-center gap-2">KKL-MAIN-RES <CheckCircle size={14} className="text-teal-500"/></div>
                     </div>
                  </div>
               </div>
               
               <div className="space-y-2 md:space-y-4 font-dm italic font-bold text-gray-500 relative z-10">
                  <p className="text-sm md:text-base leading-relaxed">14, New Colony Road, <span className="text-navy">Karaikal District Enclave</span>. [609602]</p>
                  <p className="flex items-center gap-2 text-teal-600 text-[10px] md:text-sm"><Globe size={14}/> GPS Locked: 10.9254° N, 79.8380° E</p>
               </div>

               <div className="flex gap-4 md:gap-6 relative z-10 pt-4 md:pt-6 border-t border-gray-50">
                  <button className="flex items-center gap-2 text-[9px] md:text-[10px] text-gray-400 font-black uppercase tracking-widest italic hover:text-teal-600 transition-colors"><Edit size={12}/> Edit Node</button>
                  <button className="flex items-center gap-2 text-[9px] md:text-[10px] text-gray-400 font-black uppercase tracking-widest italic hover:text-red-500 transition-colors"><Trash size={12}/> Delete Node</button>
               </div>
            </div>
         ))}
      </div>
    </PageShell>
  );
}
