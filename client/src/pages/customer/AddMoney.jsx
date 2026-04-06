import { Wallet, Plus, CreditCard, ShieldCheck } from 'lucide-react';
import PageShell from '../../components/layout/PageShell';

export default function AddMoney() {
  return (
    <PageShell 
      title="Credit Uplink" 
      subtitle="Initialize a financial handshake to replenish your district medical credits."
      icon={Wallet}
    >
      <div className="p-20 grid lg:grid-cols-2 gap-24">
         <div className="space-y-12">
            <div className="bg-[#0a1628] p-16 rounded-[4.5rem] text-white space-y-12 shadow-4xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 h-40 w-40 bg-brand-teal opacity-5 rounded-full blur-[80px]" />
               <div className="space-y-4 relative z-10">
                  <div className="text-[10px] text-brand-teal font-black uppercase tracking-[0.4em] italic">Current Buffer</div>
                  <div className="text-8xl font-syne font-black italic text-white flex items-center gap-6">₹1,240 <span className="text-brand-teal animate-pulse-slow">.</span></div>
               </div>
            </div>

            <div className="space-y-10">
               <label className="text-[10px] font-black text-gray-300 uppercase tracking-widest italic leading-none">Select Uplink Protocol</label>
               <div className="grid grid-cols-3 gap-6">
                  {['₹500', '₹1,000', '₹2,500', '₹5,000', '₹10k', 'Custom'].map(amt => (
                     <button key={amt} className="h-20 bg-gray-50/50 border border-black/[0.03] rounded-3xl font-syne font-black text-xl italic hover:bg-white hover:shadow-4xl transition-all duration-700 active:scale-95 group">
                        <span className="group-hover:text-brand-teal transition-colors">{amt}</span>
                     </button>
                  ))}
               </div>
            </div>
         </div>

         <div className="space-y-12">
            <div className="bg-white p-16 rounded-[4.5rem] border border-black/[0.03] shadow-inner space-y-12 group">
               <div className="flex items-center gap-6">
                  <div className="h-16 w-16 bg-[#0a1628] rounded-2xl flex items-center justify-center text-brand-teal shadow-2xl group-hover:scale-110 transition-transform"><CreditCard size={28}/></div>
                  <div className="space-y-1">
                     <div className="text-[10px] text-gray-300 font-black uppercase tracking-widest italic">Authorization Handshake</div>
                     <div className="font-syne font-black text-[#0a1628] text-xl uppercase italic">Secure Razorpay Sync</div>
                  </div>
               </div>
               
               <div className="space-y-8">
                  <div className="p-8 bg-gray-50 rounded-3xl border border-black/[0.02] flex items-center justify-between group hover:border-brand-teal transition-colors cursor-pointer">
                     <div className="flex items-center gap-6">
                        <input type="radio" name="pay" className="h-6 w-6 text-brand-teal" defaultChecked />
                        <span className="font-dm text-xl italic font-bold text-[#0a1628]">Unified Payments Sync (UPI)</span>
                     </div>
                  </div>
                  <div className="p-8 bg-gray-50 rounded-3xl border border-black/[0.02] flex items-center justify-between group hover:border-brand-teal transition-colors cursor-pointer">
                     <div className="flex items-center gap-6">
                        <input type="radio" name="pay" className="h-6 w-6 text-brand-teal" />
                        <span className="font-dm text-xl italic font-bold text-[#0a1628]">Credit Node Synchronization</span>
                     </div>
                  </div>
               </div>

               <button className="w-full h-24 bg-[#0a1628] text-brand-teal font-syne font-black text-xl italic uppercase tracking-widest rounded-[2rem] shadow-4xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-6">
                  <ShieldCheck size={32} /> Initiate Sync handshale
               </button>
            </div>
         </div>
      </div>
    </PageShell>
  );
}
