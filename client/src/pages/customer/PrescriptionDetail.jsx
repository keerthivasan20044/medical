import { FileText, Download, Share2, Clock, CheckCircle } from 'lucide-react';
import PageShell from '../../components/layout/PageShell';

export default function PrescriptionDetail() {
  return (
    <PageShell 
      title="Vault Detail" 
      subtitle="Full metadata for encrypted prescription uplink ID: PX-8842-KKL."
      icon={FileText}
      actions={
        <button className="h-16 px-10 bg-[#0a1628] text-brand-teal font-syne font-black text-xs rounded-2xl flex items-center gap-3 active:scale-95 shadow-4xl italic uppercase tracking-wider">
          <Download size={18} /> Download PDF
        </button>
      }
    >
      <div className="grid lg:grid-cols-2 gap-20 p-20">
         <div className="space-y-12">
            <div className="bg-gray-50/50 p-12 rounded-[4rem] border border-black/[0.03] shadow-inner space-y-12">
               <div className="flex items-center gap-6">
                  <div className="h-20 w-20 bg-[#0a1628] rounded-[2rem] flex items-center justify-center text-brand-teal shadow-2xl animate-pulse"><FileText size={32}/></div>
                  <div className="space-y-1">
                     <div className="text-[10px] text-gray-300 font-black uppercase tracking-widest italic">Sync Status</div>
                     <div className="font-syne font-black text-[#0a1628] text-xl uppercase italic flex items-center gap-3">VERIFIED_PROTOCOL <CheckCircle size={18} className="text-brand-teal"/></div>
                  </div>
               </div>
               
               <div className="space-y-8">
                  <div className="flex border-b border-black/[0.03] pb-6 justify-between items-center text-gray-400 font-dm italic font-bold">
                     <span>Clinician Node:</span>
                     <span className="text-[#0a1628]">Dr. S. Priya Raman</span>
                  </div>
                  <div className="flex border-b border-black/[0.03] pb-6 justify-between items-center text-gray-400 font-dm italic font-bold">
                     <span>Uplink Date:</span>
                     <span className="text-[#0a1628]">24 Mar 2026, 14:22</span>
                  </div>
                  <div className="flex border-b border-black/[0.03] pb-6 justify-between items-center text-gray-400 font-dm italic font-bold">
                     <span>Verification Token:</span>
                     <span className="text-[#0a1628]">#KKL-8842-TX-P</span>
                  </div>
               </div>
            </div>
         </div>
         
         <div className="relative group">
            <div className="absolute -inset-4 bg-gray-100 rounded-[5rem] -rotate-3 group-hover:rotate-0 transition-transform duration-1000" />
            <div className="relative h-[600px] w-full bg-white rounded-[4rem] overflow-hidden border-8 border-white shadow-4xl">
               <img src="/assets/crt_product.png" className="h-full w-full object-cover grayscale brightness-90 group-hover:grayscale-0 transition duration-1000" alt="Prescription" />
               <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628] via-transparent to-transparent opacity-60" />
               <div className="absolute bottom-10 left-10 p-8 border-l-8 border-brand-teal backdrop-blur-3xl bg-white/5 rounded-2xl">
                  <div className="text-[10px] text-brand-teal font-black uppercase tracking-widest italic">Encrypted View</div>
                  <div className="font-syne font-black text-white text-2xl uppercase tracking-tighter italic">VAULT_LOCK_ACTIVE</div>
               </div>
            </div>
         </div>
      </div>
    </PageShell>
  );
}
