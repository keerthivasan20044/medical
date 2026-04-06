import { Pill, Plus, Search, Filter, Edit, Trash, ChevronRight, Activity, Database, ShieldCheck, Heart } from 'lucide-react';
import PageShell from '../../components/layout/PageShell';

export default function AdminMedicines() {
  return (
    <PageShell 
      title="Global SKU Registry" 
      subtitle="Complete architectural control over medical inventory nodes across the district."
      icon={Pill}
      actions={
        <button className="h-16 px-10 bg-brand-teal text-[#0a1628] font-syne font-black text-xs rounded-2xl flex items-center gap-3 active:scale-95 shadow-4xl italic uppercase tracking-wider group">
          <Plus size={18} className="group-hover:rotate-90 transition-transform" /> Register New SKU
        </button>
      }
    >
      <div className="p-20 space-y-16">
         <div className="flex flex-col md:flex-row gap-8 items-center justify-between border-b border-black/[0.03] pb-12">
            <h3 className="font-syne font-black text-3xl text-[#0a1628] uppercase italic leading-none flex items-center gap-6 shrink-0">
               <div className="h-2 w-16 bg-brand-teal rounded-full" /> District Inventory Nodes
            </h3>
            <div className="flex gap-4 w-full md:w-auto">
               <div className="h-16 flex-1 md:w-96 min-w-[300px] bg-gray-50/50 border border-black/[0.03] rounded-2xl flex items-center px-8 text-[#0a1628] focus-within:border-brand-teal transition-all group">
                  <Search size={22} className="text-gray-300 group-focus-within:text-brand-teal transition-colors" />
                  <input type="text" placeholder="Search global registry..." className="bg-transparent flex-1 px-4 font-dm italic font-bold text-xl outline-none" />
               </div>
               <button className="h-16 w-16 bg-[#0a1628] rounded-2xl flex items-center justify-center text-brand-teal shadow-4xl"><Filter size={24} /></button>
            </div>
         </div>

         <div className="overflow-hidden border border-black/[0.03] rounded-[3rem]">
            <table className="w-full text-left">
               <thead className="bg-[#0a1628] text-white">
                  <tr>
                     {['Medicine SKU', 'Global Stock', 'Price (Base)', 'Verified Nodes', 'Status', 'Audit'].map(h => (
                        <th key={h} className="p-10 text-[10px] text-brand-teal font-black uppercase tracking-widest italic">{h}</th>
                     ))}
                  </tr>
               </thead>
               <tbody className="divide-y divide-black/[0.01]">
                  {[
                     { name: 'Dolo 650mg', stock: '12,400', price: '₹32.00', nodes: 8, status: 'Active' },
                     { name: 'Azithromycin 500mg', stock: '4,500', price: '₹120.00', nodes: 6, status: 'Low Stock' },
                     { name: 'Cetirizine 10mg', stock: '2,800', price: '₹25.00', nodes: 8, status: 'Active' }
                  ].map((item, i) => (
                     <tr key={i} className="group hover:bg-gray-50/50 transition-colors">
                        <td className="p-10">
                           <div className="font-syne font-black text-[#0a1628] text-xl uppercase italic">{item.name}</div>
                           <div className="text-[10px] text-gray-300 font-black uppercase tracking-widest italic leading-none">SKU-KKL-SYNC-{1024+i}</div>
                        </td>
                        <td className="p-10 font-syne font-black text-[#0a1628] text-xl italic">{item.stock}</td>
                        <td className="p-10 font-syne font-black text-[#0a1628] text-xl italic">{item.price}</td>
                        <td className="p-10 font-syne font-black text-brand-teal text-xl italic">{item.nodes} Enclaves</td>
                        <td className="p-10">
                           <div className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest italic flex items-center gap-2 ${item.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
                              <div className={`h-2 w-2 rounded-full ${item.status === 'Active' ? 'bg-emerald-500' : 'bg-red-500'} animate-pulse`} /> {item.status}
                           </div>
                        </td>
                        <td className="p-10 flex gap-4">
                           <button className="h-12 w-12 bg-white border border-gray-100 rounded-xl flex items-center justify-center text-gray-400 hover:text-brand-teal transition shadow-sm"><Edit size={18} /></button>
                           <button className="h-12 w-12 bg-white border border-gray-100 rounded-xl flex items-center justify-center text-gray-400 hover:text-red-500 transition shadow-sm"><Trash size={18} /></button>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
         
         <div className="grid lg:grid-cols-3 gap-12 pt-12">
            {[
               { label: 'Global Inventory Node', val: '5,240 SKUs', icon: Database },
               { label: 'Verified Mfr. Clusters', val: '142 Sources', icon: ShieldCheck },
               { label: 'Enclave Stock Health', val: '98.2% Active', icon: Activity }
            ].map(stat => (
               <div key={stat.label} className="bg-white p-12 rounded-[3.5rem] border border-black/[0.01] shadow-soft hover:shadow-4xl transition-all duration-700 flex items-center gap-10 group overflow-hidden relative">
                  <div className="absolute top-0 right-0 h-40 w-40 bg-brand-teal opacity-0 group-hover:opacity-5 rounded-full blur-[80px] transition-opacity" />
                  <div className="h-20 w-20 bg-[#0a1628] rounded-[1.8rem] flex items-center justify-center text-brand-teal shadow-2xl group-hover:scale-110 transition-transform duration-700">
                     <stat.icon size={32} />
                  </div>
                  <div className="space-y-1 relative z-10">
                     <div className="text-[10px] text-gray-400 font-black uppercase tracking-widest italic">{stat.label}</div>
                     <div className="font-syne font-black text-[#0a1628] text-2xl uppercase italic tracking-tighter">{stat.val}</div>
                  </div>
               </div>
            ))}
         </div>
      </div>
    </PageShell>
  );
}
