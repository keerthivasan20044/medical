import { Plus, Package, Database, Save, ArrowLeft, Pill, ShieldCheck, Activity } from 'lucide-react';
import PageShell from '../../components/layout/PageShell';
import { Link } from 'react-router-dom';

export default function AddMedicine() {
  return (
    <PageShell 
      title="Inventory Uplink" 
      subtitle="Register new medical SKU into the district enclave database."
      icon={Plus}
      actions={
        <button className="h-16 px-10 bg-brand-teal text-[#0a1628] font-syne font-black text-xs rounded-2xl flex items-center gap-3 active:scale-95 shadow-4xl italic uppercase tracking-wider group">
          <Save size={18} className="group-hover:animate-pulse" /> Finalize Payload
        </button>
      }
    >
      <div className="p-20 grid lg:grid-cols-[1fr_400px] gap-20">
         <div className="space-y-12">
            <div className="grid md:grid-cols-2 gap-10">
               {[
                  { label: 'Medicine Name', placeholder: 'e.g. Dolo 650mg' },
                  { label: 'SKU Manufacturer', placeholder: 'e.g. Micro Labs' },
                  { label: 'Category Node', placeholder: 'e.g. Analgesics' },
                  { label: 'Storage Protocol', placeholder: 'e.g. Cool & Dry' }
               ].map(f => (
                  <div key={f.label} className="space-y-3">
                     <label className="text-[10px] font-black text-gray-300 uppercase tracking-widest italic">{f.label}</label>
                     <input type="text" placeholder={f.placeholder} className="w-full h-16 bg-gray-50/50 border border-black/[0.03] rounded-2xl px-8 font-dm italic font-bold text-[#0a1628] focus:border-brand-teal transition-all outline-none" />
                  </div>
               ))}
            </div>
            
            <div className="space-y-3">
               <label className="text-[10px] font-black text-gray-300 uppercase tracking-widest italic">Clinical Description & Usage</label>
               <textarea rows="4" className="w-full bg-gray-50/50 border border-black/[0.03] rounded-[2rem] p-8 font-dm italic font-bold text-[#0a1628] focus:border-brand-teal transition-all outline-none" placeholder="Provide full clinical metadata..." />
            </div>

            <div className="grid md:grid-cols-3 gap-8">
               {['Base Price (₹)', 'Stock Quantity', 'Batch ID'].map(l => (
                  <div key={l} className="space-y-3">
                     <label className="text-[10px] font-black text-gray-300 uppercase tracking-widest italic">{l}</label>
                     <input type="text" className="w-full h-16 bg-gray-50/50 border border-black/[0.03] rounded-2xl px-8 font-dm italic font-bold text-[#0a1628] focus:border-brand-teal transition-all outline-none" />
                  </div>
               ))}
            </div>
         </div>

         <div className="space-y-12">
            <div className="bg-[#0a1628] p-12 rounded-[4rem] text-white space-y-8 relative overflow-hidden group shadow-4xl">
               <div className="absolute top-0 right-0 h-48 w-48 bg-brand-teal opacity-10 rounded-full blur-[100px]" />
               <h4 className="font-syne font-black text-2xl uppercase italic tracking-tighter text-brand-teal flex items-center gap-4">
                  <Database size={24}/> Enclave Metadata
               </h4>
               <div className="space-y-6 relative z-10">
                  <div className="p-8 bg-white/5 border border-white/5 rounded-3xl flex flex-col gap-3">
                     <div className="text-[10px] text-brand-teal font-black uppercase tracking-widest italic leading-none">Status</div>
                     <div className="font-syne font-black text-white text-xl uppercase italic">DRAFT_PENDING</div>
                  </div>
                  <div className="p-8 bg-white/5 border border-white/5 rounded-3xl flex flex-col gap-3">
                     <div className="text-[10px] text-brand-teal font-black uppercase tracking-widest italic leading-none">Security Protocol</div>
                     <div className="font-syne font-black text-white text-xl uppercase italic">ENCRYPTED_ENTRY</div>
                  </div>
               </div>
            </div>
            
            <div className="bg-white p-10 rounded-[3rem] border border-black/[0.03] shadow-inner space-y-6">
               <div className="flex items-center gap-4 text-brand-teal font-syne font-black text-sm uppercase italic">
                  <ShieldCheck size={24} /> Audit Requirement
               </div>
               <p className="text-[#0a1628]/60 font-dm italic font-bold">New SKUs require 24H verification by district clinical authorities before live synchronization.</p>
            </div>
         </div>
      </div>
    </PageShell>
  );
}
