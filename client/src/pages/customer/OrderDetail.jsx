import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { 
  AlertCircle, ChevronLeft, Package, Clock, 
  MapPin, IndianRupee, Printer, ArrowUpRight, 
  CheckCircle, Truck, Zap, Activity, Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchOrderById } from '../../store/ordersSlice.js';
import { SkeletonBox } from '../../components/common/Skeleton.jsx';

export default function OrderDetail() {
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
      <div className="min-h-screen bg-[#f8fafc] pt-32 px-10">
         <div className="max-w-4xl mx-auto space-y-8 animate-pulse">
            <div className="h-20 bg-gray-100 rounded-[2rem]" />
            <div className="h-[600px] bg-gray-100 rounded-[4rem]" />
         </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-48 pt-32 px-6 md:px-10">
      <div className="max-w-5xl mx-auto space-y-12">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
           <Link to="/orders" className="h-14 px-8 bg-white border border-black/[0.03] rounded-2xl flex items-center gap-4 font-syne font-black text-[10px] uppercase italic tracking-widest text-gray-400 hover:text-[#0a1628] transition-all shadow-soft group">
              <ChevronLeft size={16} className="group-hover:-translate-x-1 transition" /> My Orders
           </Link>
           <button onClick={() => window.print()} className="h-14 w-14 bg-white border border-black/[0.03] rounded-2xl flex items-center justify-center text-brand-teal hover:bg-[#0a1628] hover:text-white transition-all shadow-soft">
              <Printer size={20} />
           </button>
        </div>

        <div className="bg-[#0a1628] rounded-[4rem] p-10 md:p-16 text-white shadow-4xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-12">
           <div className="absolute top-0 right-0 h-full w-1/3 bg-brand-teal opacity-5 blur-[120px]" />
           <div className="space-y-6 relative z-10 text-center md:text-left">
              <div className="inline-flex items-center gap-4 bg-white/5 border border-white/10 px-6 py-2 rounded-full">
                 <div className="h-2 w-2 bg-brand-teal rounded-full animate-ping" />
                 <span className="text-[10px] font-black uppercase tracking-[0.4em] italic opacity-60">Order Details</span>
              </div>
              <h1 className="font-syne font-black text-5xl md:text-7xl uppercase italic tracking-tighter leading-none">Order <span className="text-brand-teal">#{id.slice(-6)}</span></h1>
           </div>
           
           <div className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] backdrop-blur-xl relative z-10 text-center">
              <div className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] mb-2">Current Status</div>
              <div className="font-syne font-black text-2xl text-brand-teal uppercase italic tracking-tighter">{order?.status || 'SYNCHRONIZING'}</div>
           </div>
        </div>

        {/* Status Stepper Architecture */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
           {STAGES.map((s, i) => {
             const activeIdx = STAGES.findIndex(stage => stage.key === order?.status);
             const isComplete = i <= activeIdx;
             return (
               <div key={s.key} className={`p-8 rounded-[2.5rem] border flex flex-col items-center gap-4 transition-all duration-700 ${isComplete ? 'bg-white border-brand-teal shadow-2xl' : 'bg-gray-50 border-black/[0.03] opacity-30'}`}>
                  <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${isComplete ? 'bg-[#0a1628] text-brand-teal shadow-inner' : 'bg-gray-100 text-gray-300'}`}>
                     <s.icon size={20} />
                  </div>
                  <span className={`font-syne font-black text-[9px] uppercase tracking-widest italic transition-colors ${isComplete ? 'text-[#0a1628]' : 'text-gray-300'}`}>{s.label}</span>
               </div>
             );
           })}
        </div>

        <div className="grid lg:grid-cols-[1.5fr_1fr] gap-12">
           {/* Items Matrix */}
           <div className="bg-white border border-black/[0.03] rounded-[4rem] p-10 md:p-16 shadow-soft space-y-12">
              <div className="flex items-center gap-6 pb-8 border-b border-black/[0.03]">
                 <div className="h-2 w-12 bg-brand-teal rounded-full" />
                 <h2 className="font-syne font-black text-3xl text-[#0a1628] uppercase italic tracking-tighter">Ordered Medicines</h2>
              </div>
              <div className="space-y-6">
                 {order?.items.map((item, idx) => (
                   <div key={idx} className="flex items-center justify-between p-8 bg-gray-50/50 rounded-[2.5rem] border border-transparent hover:border-black/[0.03] transition-all group">
                      <div className="flex items-center gap-6">
                         <div className="h-16 w-16 bg-white rounded-2xl flex items-center justify-center font-syne font-black text-xl text-gray-200 border border-black/[0.01] shadow-inner group-hover:bg-[#0a1628] group-hover:text-brand-teal transition-all duration-500">{(item.medicine?.name || item.name)[0]}</div>
                         <div className="space-y-1">
                            <h4 className="font-syne font-black text-[#0a1628] uppercase italic leading-none">{item.medicine?.name || item.name}</h4>
                            <div className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">{item.qty} Items</div>
                         </div>
                      </div>
                      <div className="font-syne font-black text-xl text-[#0a1628]">₹{item.price * item.qty}</div>
                   </div>
                 ))}
                 {!order?.items.length && <div className="text-center py-10 text-gray-300 font-black uppercase tracking-widest text-[10px] italic">No items found</div>}
              </div>
           </div>

           {/* Metadata Hub */}
           <div className="space-y-12">
              <div className="bg-[#f4f2ff] rounded-[4rem] p-12 shadow-soft space-y-10 border border-[#7c3aed]/10">
                 <div className="text-[#7c3aed] flex items-center gap-4">
                    <Activity size={20} />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] italic leading-none">Delivery Details</span>
                 </div>
                 
                 <div className="space-y-8">
                    <div className="flex gap-6">
                       <div className="h-12 w-12 bg-white rounded-xl flex items-center justify-center shadow-soft text-[#7c3aed] shrink-0 border border-[#7c3aed]/10"><MapPin size={20}/></div>
                       <div className="space-y-1">
                          <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest italic">Delivery Address</div>
                          <p className="font-dm font-bold text-[#0a1628] text-sm italic">{order?.deliveryAddress || 'Home Address'}</p>
                       </div>
                    </div>
                    <div className="flex gap-6">
                       <div className="h-12 w-12 bg-white rounded-xl flex items-center justify-center shadow-soft text-[#7c3aed] shrink-0 border border-[#7c3aed]/10"><Clock size={20}/></div>
                       <div className="space-y-1">
                          <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest italic">Order Placed On</div>
                          <p className="font-dm font-bold text-[#0a1628] text-sm italic">{new Date(order?.createdAt).toLocaleString()}</p>
                       </div>
                    </div>
                 </div>

                 <div className="pt-8 border-t border-[#7c3aed]/10 space-y-4">
                    <div className="flex justify-between items-center text-gray-400 font-syne font-black text-[10px] uppercase tracking-widest italic">
                       <span>Sub-Total</span>
                       <span>₹{order?.totalAmount - 40}</span>
                    </div>
                    <div className="flex justify-between items-center text-gray-400 font-syne font-black text-[10px] uppercase tracking-widest italic">
                       <span>Delivery Fee</span>
                       <span>₹40</span>
                    </div>
                    <div className="flex justify-between items-center text-[#7c3aed] font-syne font-black text-2xl uppercase italic tracking-tighter pt-4">
                       <span>TOTAL</span>
                       <span>₹{order?.totalAmount}</span>
                    </div>
                 </div>
              </div>

              <div className="bg-white border border-black/[0.03] rounded-[3rem] p-8 flex items-center justify-between group cursor-pointer hover:bg-[#0a1628] transition-all duration-700 shadow-soft">
                 <div className="flex items-center gap-6">
                    <div className="h-14 w-14 bg-gray-50 rounded-2xl flex items-center justify-center text-brand-teal group-hover:bg-white/10 transition-all"><Info size={24}/></div>
                    <div className="space-y-1">
                       <div className="font-syne font-black text-[#0a1628] uppercase italic group-hover:text-white transition-colors">Need Help?</div>
                       <div className="text-[9px] font-black text-gray-300 uppercase italic tracking-widest">Contact Customer Support</div>
                    </div>
                 </div>
                 <ArrowUpRight size={20} className="text-gray-200 group-hover:text-brand-teal transition-all" />
              </div>

              {order?.status !== 'delivered' && (
                <Link to={`/orders/${id}/track`} className="block">
                   <button className="w-full h-24 bg-gradient-to-r from-[#02C39A] to-[#028090] text-white rounded-[3rem] font-syne font-black text-xs uppercase tracking-[0.4em] italic shadow-4xl shadow-[#02C39A]/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-6">
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
