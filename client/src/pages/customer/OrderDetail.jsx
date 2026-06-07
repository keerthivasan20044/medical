import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import {
  ChevronLeft, Package, Clock,
  MapPin, Printer, ArrowUpRight,
  CheckCircle, Truck, Zap, Activity, Info
} from 'lucide-react';
import { fetchOrderById } from '../../store/ordersSlice.js';
import { useLanguage } from '../../context/LanguageContext';

export default function OrderDetail() {
  const { t } = useLanguage();
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentItem: order, status, error } = useSelector((s) => s.orders);

  useEffect(() => {
    if (id) dispatch(fetchOrderById(id));
  }, [id, dispatch]);

  const STAGES = [
    { key: 'placed', label: 'Order Placed', icon: Zap },
    { key: 'confirmed', label: 'Confirmed', icon: CheckCircle },
    { key: 'shipped', label: 'In Transit', icon: Truck },
    { key: 'delivered', label: 'Delivered', icon: Package }
  ];

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-6 md:px-6">
         <div className="max-w-6xl mx-auto space-y-5 animate-pulse">
            <div className="h-16 bg-white rounded-2xl" />
            <div className="h-96 bg-white rounded-2xl" />
         </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen pb-24 pt-5 px-4 md:px-6">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between gap-3">
           <Link to="/orders" className="h-11 px-4 bg-white border border-slate-100 rounded-xl flex items-center gap-2 font-syne font-black text-[10px] uppercase tracking-[0.12em] text-gray-500 hover:text-[#0a1628] transition-all shadow-sm group">
              <ChevronLeft size={16} className="group-hover:-translate-x-1 transition" /> My Orders
           </Link>
           <button onClick={() => window.print()} className="h-11 w-11 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-brand-teal hover:bg-[#0a1628] hover:text-white transition-all shadow-sm" aria-label="Print order">
              <Printer size={20} />
           </button>
        </div>

        <div className="bg-[#0a1628] rounded-2xl p-5 md:p-7 text-white shadow-4xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-5">
           <div className="absolute top-0 right-0 h-full w-1/3 bg-brand-teal opacity-5 blur-[120px]" />
           <div className="space-y-3 relative z-10 text-center md:text-left min-w-0">
              <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-full">
                 <div className="h-2 w-2 bg-brand-teal rounded-full animate-ping" />
                 <span className="text-[10px] font-black uppercase tracking-[0.14em] opacity-70">Order Details</span>
              </div>
              <h1 className="font-syne font-black text-3xl md:text-4xl uppercase tracking-tight leading-none truncate">Order <span className="text-brand-teal">#{id.slice(-6)}</span></h1>
           </div>
           
           <div className="bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-xl relative z-10 text-center min-w-[13rem]">
              <div className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] mb-2">Current Status</div>
              <div className="font-syne font-black text-xl text-brand-teal uppercase tracking-tight">{order?.status || 'Synchronizing'}</div>
           </div>
        </div>

        {/* Status Stepper System */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
           {STAGES.map((s, i) => {
             const activeIdx = STAGES.findIndex(stage => stage.key === order?.status);
             const isComplete = i <= activeIdx;
             return (
               <div key={s.key} className={`p-4 rounded-2xl border flex flex-col items-center gap-3 transition-all duration-500 ${isComplete ? 'bg-white border-brand-teal shadow-sm' : 'bg-gray-50 border-black/[0.03] opacity-60'}`}>
                  <div className={`h-11 w-11 rounded-xl flex items-center justify-center ${isComplete ? 'bg-[#0a1628] text-brand-teal shadow-inner' : 'bg-gray-100 text-gray-300'}`}>
                     <s.icon size={20} />
                  </div>
                  <span className={`font-syne font-black text-[9px] uppercase tracking-[0.08em] text-center transition-colors ${isComplete ? 'text-[#0a1628]' : 'text-gray-400'}`}>{s.label}</span>
               </div>
             );
           })}
        </div>

        <div className="grid lg:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.9fr)] gap-5">
           {/* Items Matrix */}
           <div className="bg-white border border-slate-100 rounded-2xl p-5 md:p-6 shadow-sm space-y-5">
              <div className="flex items-center gap-4 pb-5 border-b border-black/[0.03]">
                 <div className="h-2 w-12 bg-brand-teal rounded-full" />
                 <h2 className="font-syne font-black text-xl md:text-2xl text-[#0a1628] uppercase tracking-tight">Ordered Medicines</h2>
              </div>
              <div className="space-y-3">
                 {order?.items.map((item, idx) => (
                   <div key={idx} className="flex items-center justify-between gap-4 p-4 bg-gray-50/70 rounded-2xl border border-transparent hover:border-black/[0.03] transition-all group">
                      <div className="flex items-center gap-4 min-w-0">
                         <div className="h-12 w-12 bg-white rounded-xl flex items-center justify-center font-syne font-black text-lg text-gray-300 border border-black/[0.01] shadow-inner group-hover:bg-[#0a1628] group-hover:text-brand-teal transition-all duration-300 shrink-0">{(item.medicine?.name || item.name)[0]}</div>
                         <div className="space-y-1">
                            <h4 className="font-syne font-black text-[#0a1628] uppercase leading-tight truncate">{item.medicine?.name || item.name}</h4>
                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.12em]">{item.quantity} item{item.quantity === 1 ? '' : 's'}</div>
                         </div>
                      </div>
                      <div className="font-syne font-black text-lg text-[#0a1628] shrink-0">INR {item.price * item.quantity}</div>
                   </div>
                 ))}
                 {!order?.items.length && <div className="text-center py-10 text-gray-400 font-black uppercase tracking-[0.12em] text-[10px]">No items found</div>}
              </div>
           </div>

           {/* Metadata Hub */}
           <div className="space-y-5">
              <div className="bg-[#f4f2ff] rounded-2xl p-5 md:p-6 shadow-sm space-y-6 border border-[#7c3aed]/10">
                 <div className="text-[#7c3aed] flex items-center gap-4">
                    <Activity size={20} />
                    <span className="text-[10px] font-black uppercase tracking-[0.14em] leading-none">Delivery Details</span>
                 </div>
                 
                 <div className="space-y-5">
                    <div className="flex gap-4">
                       <div className="h-12 w-12 bg-white rounded-xl flex items-center justify-center shadow-soft text-[#7c3aed] shrink-0 border border-[#7c3aed]/10"><MapPin size={20}/></div>
                       <div className="space-y-1">
                          <div className="text-[9px] font-black text-gray-400 uppercase tracking-[0.12em]">Delivery Address</div>
                          <p className="font-dm font-bold text-[#0a1628] text-sm">{order?.deliveryAddress || 'Home Address'}</p>
                       </div>
                    </div>
                    <div className="flex gap-4">
                       <div className="h-12 w-12 bg-white rounded-xl flex items-center justify-center shadow-soft text-[#7c3aed] shrink-0 border border-[#7c3aed]/10"><Clock size={20}/></div>
                       <div className="space-y-1">
                          <div className="text-[9px] font-black text-gray-400 uppercase tracking-[0.12em]">Order Placed On</div>
                          <p className="font-dm font-bold text-[#0a1628] text-sm">{new Date(order?.createdAt).toLocaleString()}</p>
                       </div>
                    </div>
                 </div>

                 <div className="pt-5 border-t border-[#7c3aed]/10 space-y-3">
                    <div className="flex justify-between items-center text-gray-500 font-syne font-black text-[10px] uppercase tracking-[0.12em]">
                       <span>Sub-Total</span>
                       <span>INR {order?.totalAmount - 40}</span>
                    </div>
                    <div className="flex justify-between items-center text-gray-500 font-syne font-black text-[10px] uppercase tracking-[0.12em]">
                       <span>Delivery Fee</span>
                       <span>INR 40</span>
                    </div>
                    <div className="flex justify-between items-center text-[#7c3aed] font-syne font-black text-xl uppercase tracking-tight pt-3">
                       <span>TOTAL</span>
                       <span>INR {order?.totalAmount}</span>
                    </div>
                 </div>
              </div>

              <div className="bg-white border border-slate-100 rounded-2xl p-5 flex items-center justify-between group cursor-pointer hover:bg-[#0a1628] transition-all duration-300 shadow-sm">
                 <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-gray-50 rounded-xl flex items-center justify-center text-brand-teal group-hover:bg-white/10 transition-all"><Info size={22}/></div>
                    <div className="space-y-1">
                       <div className="font-syne font-black text-[#0a1628] uppercase group-hover:text-white transition-colors">Need Help?</div>
                       <div className="text-[9px] font-black text-gray-400 uppercase tracking-[0.12em]">Contact Customer Support</div>
                    </div>
                 </div>
                 <ArrowUpRight size={20} className="text-gray-200 group-hover:text-brand-teal transition-all" />
              </div>

              {order?.status !== 'delivered' && (
                <Link to={`/orders/${id}/track`} className="block">
                   <button className="w-full h-14 bg-gradient-to-r from-[#02C39A] to-[#028090] text-white rounded-2xl font-syne font-black text-xs uppercase tracking-[0.14em] shadow-4xl shadow-[#02C39A]/30 hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-3">
                      <Truck size={24} /> Track Order Live
                   </button>
                </Link>
              )}
           </div>
        </div>
      </div>
    </div>
  );
}
