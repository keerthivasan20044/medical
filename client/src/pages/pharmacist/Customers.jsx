import { User, Phone, MapPin, Search, Filter, Mail, ChevronRight, Activity, TrendingUp, ShieldCheck } from 'lucide-react';
import PageShell from '../../components/layout/PageShell';

export default function Customers() {
  return (
    <PageShell 
      title="District Nodes" 
      subtitle="Full list and health synchronization logs of synchronized customer nodes."
      icon={User}
    >
      <div className="p-20 space-y-16">
         <div className="flex flex-col md:flex-row gap-8 items-center justify-between border-b border-black/[0.03] pb-12">
            <h3 className="font-syne font-black text-3xl text-[#0a1628] uppercase italic leading-none flex items-center gap-6 shrink-0">
               <div className="h-2 w-16 bg-brand-teal rounded-full" /> Synchronized Residents
            </h3>
            <div className="flex gap-4 w-full md:w-auto">
               <div className="h-16 flex-1 md:w-96 min-w-[300px] bg-gray-50/50 border border-black/[0.03] rounded-2xl flex items-center px-8 text-[#0a1628] focus-within:border-brand-teal transition-all group">
                  <Search size={22} className="text-gray-300 group-focus-within:text-brand-teal transition-colors" />
                  <input type="text" placeholder="Search node name..." className="bg-transparent flex-1 px-4 font-dm italic font-bold text-xl outline-none" />
               </div>
               <button className="h-16 w-16 bg-[#0a1628] rounded-2xl flex items-center justify-center text-brand-teal shadow-4xl"><Filter size={24} /></button>
            </div>
         </div>

         <div className="grid lg:grid-cols-2 gap-12">
            {[1, 2, 3, 4, 5, 6].map(i => (
               <div key={i} className="bg-white p-12 rounded-[4rem] border border-black/[0.03] shadow-soft hover:shadow-4xl transition-all duration-700 flex flex-col md:flex-row md:items-center justify-between gap-10 group relative overflow-hidden">
                  <div className="absolute top-0 right-0 h-40 w-40 bg-brand-teal opacity-0 group-hover:opacity-5 rounded-full blur-[80px] transition-opacity" />
                  
                  <div className="flex items-center gap-8 lg:w-1/2 relative z-10">
                     <div className="h-24 w-24 bg-[#0a1628] rounded-[2.5rem] flex items-center justify-center text-brand-teal text-4xl font-syne font-black italic shadow-2xl group-hover:scale-110 transition-transform duration-700">R</div>
                     <div className="space-y-1">
                        <div className="text-[10px] text-gray-300 font-black uppercase tracking-widest italic leading-none">Resident Terminal</div>
                        <h3 className="font-syne font-black text-[#0a1628] text-2xl uppercase italic tracking-tighter">Ramesh Kumar</h3>
                        <div className="text-xs font-dm text-gray-400 flex items-center gap-2"><MapPin size={12}/> Market Road Terminal</div>
                     </div>
                  </div>

                  <div className="flex gap-4 lg:w-1/2 justify-end relative z-10">
                     <div className="p-6 bg-gray-50/50 rounded-3xl border border-black/[0.01] flex flex-col gap-2 items-center text-center">
                        <div className="text-[8px] text-gray-300 font-black uppercase tracking-[0.4em] italic leading-none">Procurement Frequency</div>
                        <div className="font-syne font-black text-[#0a1628] text-xl uppercase italic leading-none flex items-center gap-2">High <TrendingUp size={16} className="text-brand-teal"/></div>
                     </div>
                     <button className="h-20 w-20 bg-[#0a1628] text-brand-teal rounded-[2rem] flex items-center justify-center shadow-4xl hover:scale-110 active:scale-95 transition-all"><ChevronRight size={32}/></button>
                  </div>
               </div>
            ))}
         </div>
      </div>
    </PageShell>
  );
}
