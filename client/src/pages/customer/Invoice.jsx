import { FileText, Download, ShieldCheck } from 'lucide-react';
import PageShell from '../../components/layout/PageShell';

export default function Invoice() {
  return (
    <PageShell
      title="Invoice"
      subtitle="Detailed digital receipt and tax summary for order ID: ORD-5542-KKL."
      icon={FileText}
      actions={
        <button className="h-16 px-10 bg-[#0a1628] text-brand-teal font-syne font-black text-xs rounded-2xl flex items-center gap-3 active:scale-95 shadow-4xl italic uppercase tracking-wider group">
          <Download size={18} className="group-hover:animate-bounce" /> Download PDF
        </button>
      }
    >
      <div className="p-20 space-y-20">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 border-b-8 border-brand-teal pb-16">
          <div className="space-y-6">
            <div className="text-[10px] text-gray-300 font-black uppercase tracking-widest italic">From</div>
            <div className="font-syne font-black text-[#0a1628] text-4xl uppercase italic tracking-tighter">Apollo Pharmacy</div>
            <p className="text-gray-400 font-dm italic font-bold max-w-xs">14, New Colony Road, Karaikal. GSTIN: 33AAAAA0000A1Z5</p>
          </div>
          <div className="text-right space-y-6">
            <div className="text-[10px] text-gray-300 font-black uppercase tracking-widest italic">Invoice ID</div>
            <div className="font-syne font-black text-[#0a1628] text-4xl uppercase italic tracking-tighter">#INV-5542-TX</div>
            <div className="text-gray-400 font-dm italic font-bold">Issued: 26 Mar 2026</div>
          </div>
        </div>

        <div className="overflow-hidden border border-black/[0.03] rounded-[3rem]">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-black/[0.03]">
              <tr>
                {['SKU Description', 'Qty', 'Unit Price', 'Total'].map((h) => (
                  <th key={h} className="p-10 text-[10px] text-gray-300 font-black uppercase tracking-widest italic">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.01]">
              {[1, 2].map((i) => (
                <tr key={i} className="group hover:bg-gray-50/50 transition-colors">
                  <td className="p-10">
                    <div className="font-syne font-black text-[#0a1628] text-xl uppercase italic">Dolo 650mg (Tablet)</div>
                    <div className="text-[10px] text-brand-teal font-black uppercase tracking-widest italic">BATCH: KKL-22X9</div>
                  </td>
                  <td className="p-10 font-syne font-black text-[#0a1628] text-xl italic">2</td>
                  <td className="p-10 font-syne font-black text-[#0a1628] text-xl italic">INR 32.00</td>
                  <td className="p-10 font-syne font-black text-[#0a1628] text-xl italic">INR 64.00</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-end gap-12">
          <div className="bg-brand-teal/5 p-12 rounded-[3rem] border border-brand-teal/10 space-y-4 max-w-sm">
            <div className="flex items-center gap-4 text-brand-teal font-syne font-black text-sm uppercase italic">
              <ShieldCheck size={20} /> Tax Verified
            </div>
            <p className="text-[#0a1628]/60 font-dm italic font-bold">This invoice is saved and verified by MediPharm.</p>
          </div>
          <div className="text-right space-y-6">
            <div className="space-y-2">
              <div className="text-[10px] text-gray-300 font-black uppercase tracking-widest italic leading-none">Net Amount</div>
              <div className="text-8xl font-syne font-black italic text-[#0a1628] flex items-center justify-end gap-4">INR 128 <span className="text-brand-teal animate-pulse-slow">.</span></div>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
