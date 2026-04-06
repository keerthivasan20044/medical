import { Package, Truck, CheckCircle, XCircle, MapPin, User, Phone, Pill, IndianRupee, MessageSquare } from 'lucide-react';
import PageShell from '../../components/layout/PageShell';

export default function OrderManage() {
  return (
    <PageShell 
      title="Terminal Dispatch" 
      subtitle="Full logistical control and verification for order ID: ORD-5542-KKL."
      icon={Package}
      actions={
        <div className="flex gap-4">
          <button className="h-16 px-10 bg-brand-teal text-[#0a1628] font-syne font-black text-xs rounded-2xl flex items-center gap-3 active:scale-95 shadow-4xl italic uppercase tracking-wider group">
            <CheckCircle size={18} className="group-hover:animate-pulse" /> Confirm Package
          </button>
          <button className="h-16 px-10 bg-[#0a1628] text-brand-teal font-syne font-black text-xs rounded-2xl flex items-center gap-3 active:scale-95 shadow-4xl italic uppercase tracking-wider">
            <Truck size={18} /> Deploy Rider Node
          </button>
        </div>
      }
    >
      <div className="p-20 grid lg:grid-cols-[1fr_450px] gap-20">
         <div className="space-y-12">
            <div className="bg-gray-50/50 p-12 rounded-[4rem] border border-black/[0.03] space-y-12">
               <div className="flex items-center justify-between border-b border-black/[0.05] pb-8">
                  <h3 className="font-syne font-black text-3xl text-[#0a1628] uppercase italic leading-none flex items-center gap-4">
                     Payload Inventory
                  </h3>
                  <div className="px-6 py-2 bg-[#0a1628] text-brand-teal rounded-xl text-[10px] font-black uppercase tracking-widest italic">IN_PREPARATION</div>
               </div>
               
               <div className="space-y-6">
                  {[
                     { name: 'Dolo 650mg', qty: 2, batch: 'B2201-KKL', price: 64 },
                     { name: 'Cetirizine 10mg', qty: 1, batch: 'C998-KKL', price: 25 }
                  ].map(item => (
                     <div key={item.name} className="p-8 bg-white rounded-3xl border border-black/[0.01] shadow-soft flex items-center justify-between group hover:shadow-2xl hover:border-brand-teal/20 transition-all duration-700">
                        <div className="flex items-center gap-6">
                           <div className="h-16 w-16 bg-gray-50 rounded-2xl flex items-center justify-center text-brand-teal group-hover:scale-110 transition-transform"><Pill size={24}/></div>
                           <div className="space-y-1">
                              <div className="font-syne font-black text-[#0a1628] text-xl uppercase italic">{item.name}</div>
                              <div className="text-[10px] text-gray-300 font-black uppercase tracking-widest italic">Batch Sync: {item.batch}</div>
                           </div>
                        </div>
                        <div className="text-right space-y-1">
                           <div className="font-syne font-black text-[#0a1628] text-xl italic mr-4">Qty: {item.qty}</div>
                           <div className="font-syne font-black text-brand-teal text-xl italic">₹{item.price}</div>
                        </div>
                     </div>
                  ))}
               </div>
               
               <div className="pt-8 border-t border-black/[0.05] flex justify-between items-center">
                  <span className="text-gray-400 font-dm italic font-bold">Total Procurement Payload:</span>
                  <span className="text-4xl font-syne font-black text-[#0a1628] italic">₹89.00</span>
               </div>
            </div>
         </div>

         <div className="space-y-12">
            <div className="bg-[#0a1628] p-12 rounded-[4rem] text-white space-y-12 relative overflow-hidden group shadow-4xl">
               <div className="absolute top-0 right-0 h-40 w-40 bg-brand-teal opacity-0 group-hover:opacity-10 rounded-full blur-[80px] transition-opacity" />
               <div className="space-y-6 relative z-10">
                  <div className="flex items-center gap-6">
                     <div className="h-20 w-20 bg-white/5 border border-white/10 rounded-[2rem] flex items-center justify-center text-brand-teal shadow-2xl transition group-hover:scale-105"><User size={32}/></div>
                     <div>
                        <h3 className="font-syne font-black text-2xl uppercase italic tracking-tighter text-white">Ramesh Kumar</h3>
                        <p className="text-white/40 font-dm italic font-bold">Terminal Sync ID: CUST-8842</p>
                     </div>
                  </div>
                  
                  <div className="flex flex-col gap-4">
                     <div className="p-8 bg-white/5 border border-white/5 rounded-3xl flex items-center justify-between group hover:bg-white/10 transition cursor-pointer">
                        <div className="flex items-center gap-6">
                           <MapPin className="text-brand-teal" size={24} />
                           <div className="space-y-1">
                              <div className="text-[10px] text-brand-teal font-black uppercase tracking-widest italic leading-none">Delivery Node</div>
                              <div className="font-syne font-black text-white text-lg uppercase italic tracking-tighter">Market Road Terminal</div>
                           </div>
                        </div>
                     </div>
                     <div className="p-8 bg-white/5 border border-white/5 rounded-3xl flex items-center justify-between group hover:bg-white/10 transition cursor-pointer">
                        <div className="flex items-center gap-6">
                           <Phone className="text-brand-teal" size={24} />
                           <div className="space-y-1">
                              <div className="text-[10px] text-brand-teal font-black uppercase tracking-widest italic leading-none">Voice Handshake</div>
                              <div className="font-syne font-black text-white text-lg uppercase italic tracking-tighter">+91 94432 XXXXX</div>
                           </div>
                        </div>
                        <MessageSquare size={18} className="text-white/20 group-hover:text-white transition-opacity" />
                     </div>
                  </div>
               </div>
            </div>
            
            <div className="bg-white p-12 rounded-[4rem] border border-black/[0.03] shadow-inner space-y-6 group">
               <div className="flex items-center gap-4 text-brand-teal font-syne font-black text-sm uppercase italic">
                  <Package size={24} className="group-hover:animate-bounce" /> PACKAGING_PROTOCOL
               </div>
               <p className="text-[#0a1628]/60 font-dm italic font-bold">Verify double-layered sterilization for the district medical enclave before rider assignment.</p>
            </div>
         </div>
      </div>
    </PageShell>
  );
}
