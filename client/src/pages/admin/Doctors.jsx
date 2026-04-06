import { User, Activity, Plus, Search, Filter, Edit, Trash, Star, Phone, ShieldCheck, Clock } from 'lucide-react';
import PageShell from '../../components/layout/PageShell';

export default function AdminDoctors() {
  return (
    <PageShell 
      title="Clinician Registry" 
      subtitle="Verify and synchronize certified medical personnel nodes across the district enclave."
      icon={Activity}
      actions={
        <button className="h-16 px-10 bg-brand-teal text-[#0a1628] font-syne font-black text-xs rounded-2xl flex items-center gap-3 active:scale-95 shadow-4xl italic uppercase tracking-wider group">
          <Plus size={18} className="group-hover:animate-float" /> Register Clinician
        </button>
      }
    >
      <div className="p-20 space-y-16">
         <div className="flex flex-col md:flex-row gap-8 items-center justify-between border-b border-black/[0.03] pb-12">
            <h3 className="font-syne font-black text-3xl text-[#0a1628] uppercase italic leading-none flex items-center gap-6 shrink-0">
               <div className="h-2 w-16 bg-brand-teal rounded-full" /> Verified Clinician Nodes
            </h3>
            <div className="flex gap-4 w-full md:w-auto">
               <div className="h-16 flex-1 md:w-96 min-w-[300px] bg-gray-50/50 border border-black/[0.03] rounded-2xl flex items-center px-8 text-[#0a1628] focus-within:border-brand-teal transition-all group">
                  <Search size={22} className="text-gray-300 group-focus-within:text-brand-teal transition-colors" />
                  <input type="text" placeholder="Search clinician name..." className="bg-transparent flex-1 px-4 font-dm italic font-bold text-xl outline-none" />
               </div>
               <button className="h-16 w-16 bg-[#0a1628] rounded-2xl flex items-center justify-center text-brand-teal shadow-4xl"><Filter size={24} /></button>
            </div>
         </div>

         <div className="grid lg:grid-cols-2 gap-12">
            {[
               { name: 'Dr. S. Priya Raman', special: 'General Physician', exp: '12 Yrs', rating: 4.8 },
               { name: 'Dr. Ramesh Kumar', special: 'Pediatrics', exp: '15 Yrs', rating: 4.9 },
               { name: 'Dr. Anjali Devi', special: 'Cardiology', exp: '10 Yrs', rating: 4.7 },
               { name: 'Dr. Subramaniam V.', special: 'Orthopedics', exp: '20 Yrs', rating: 4.6 }
            ].map((doc, i) => (
               <div key={i} className="bg-white p-12 rounded-[4rem] border border-black/[0.03] shadow-soft hover:shadow-4xl transition-all duration-700 flex flex-col md:flex-row md:items-center justify-between gap-10 group relative overflow-hidden">
                  <div className="absolute top-0 right-0 h-40 w-40 bg-brand-teal opacity-0 group-hover:opacity-5 rounded-full blur-[80px] transition-opacity" />
                  
                  <div className="flex items-center gap-8 lg:w-3/5 relative z-10">
                     <div className="h-24 w-24 bg-[#0a1628] border-2 border-brand-teal/20 rounded-[2.5rem] flex items-center justify-center text-brand-teal text-4xl font-syne font-black italic shadow-2xl group-hover:scale-110 transition-transform duration-700 overflow-hidden">
                         <img src="/assets/doctor_icon.png" className="h-full w-full object-cover grayscale opacity-30 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000" />
                     </div>
                     <div className="space-y-1">
                        <div className="text-[10px] text-gray-300 font-black uppercase tracking-widest italic leading-none">Sync ID: KKL-DOC-992{i}</div>
                        <h3 className="font-syne font-black text-[#0a1628] text-2xl uppercase italic tracking-tighter">{doc.name}</h3>
                        <div className="text-xs font-dm text-brand-teal flex items-center gap-2 font-bold mb-2">{doc.special}</div>
                        <div className="flex items-center gap-4">
                           <span className="flex items-center gap-2 text-[10px] text-gray-400 font-black uppercase tracking-widest"><Clock size={12}/> {doc.exp}</span>
                           <span className="flex items-center gap-2 text-[10px] text-amber-500 font-black uppercase tracking-widest"><Star size={12} fill="currentColor"/> {doc.rating}</span>
                        </div>
                     </div>
                  </div>

                  <div className="flex gap-4 lg:w-2/5 justify-end relative z-10 pt-8 md:pt-0 border-t md:border-t-0 border-black/[0.05]">
                     <button className="h-16 w-16 bg-gray-50 border border-black/[0.01] text-gray-400 rounded-2xl flex items-center justify-center hover:bg-[#0a1628] hover:text-brand-teal hover:shadow-4xl transition-all"><Edit size={20}/></button>
                     <button className="h-16 w-16 bg-gray-50 border border-black/[0.01] text-gray-400 rounded-2xl flex items-center justify-center hover:bg-red-50 hover:text-red-500 hover:shadow-4xl transition-all"><Trash size={20}/></button>
                  </div>
               </div>
            ))}
         </div>
      </div>
    </PageShell>
  );
}
