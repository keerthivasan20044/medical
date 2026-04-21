import { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Truck, CheckCircle, Clock, MapPin, 
  Phone, Package, ArrowRight,
  TrendingUp, Award, User, RefreshCw, 
  Activity, Star, Navigation, ShieldCheck, X, MessageSquare, ChevronRight, IndianRupee
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { fetchOrders, updateOrderStatus } from '../../store/ordersSlice.js';

export default function DeliveryDashboard() {
  const dispatch = useDispatch();
  const { items: orders } = useSelector(s => s.orders);
  const user = useSelector(s => s.auth.user);
  const [isAvailable, setIsAvailable] = useState(true);
  const [showOtp, setShowOtp] = useState(false);
  const [activeOrderId, setActiveOrderId] = useState(null);
  const [otp, setOtp] = useState(['', '', '', '']);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const activeOrder = useMemo(() => orders.find(o => o.status === 'shipped' || o.status === 'confirmed'), [orders]);

  const stats = useMemo(() => [
    { label: 'Payloads Completed', value: orders.filter(o => o.status === 'delivered').length, icon: CheckCircle, color: 'text-emerald-600 bg-emerald-50' },
    { label: 'Active Manifests', value: orders.filter(o => o.status === 'shipped').length, icon: Clock, color: 'text-orange-600 bg-orange-50' },
    { label: 'Today Revenue', value: '₹640', icon: IndianRupee, color: 'text-brand-teal bg-brand-teal/10' },
    { label: 'Node Rating', value: '4.9', icon: Star, color: 'text-amber-500 bg-amber-50' }
  ], [orders]);

  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value !== '' && index < 3) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleVerify = async () => {
    const code = otp.join('');
    if (code.length === 4) {
       const res = await dispatch(updateOrderStatus({ id: activeOrder._id || activeOrder.id, status: 'delivered', otp: code }));
       if (res.meta.requestStatus === 'fulfilled') {
          toast.success('Protocol finalized: Manifest Delivered');
          setShowOtp(false);
          setOtp(['', '', '', '']);
       } else {
          toast.error('Clinical verification failed: Invalid OTP');
       }
    } else {
       toast.error('Please enter the full 4-digit security code');
    }
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-48 pt-24 px-10">
      <div className="max-w-7xl mx-auto space-y-20">
        
        {/* Logistics Command Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 pb-12 border-b border-black/[0.03]">
           <div className="space-y-6">
              <div className="flex items-center gap-4">
                 <div className="h-4 w-4 bg-brand-teal rounded-full animate-ping" />
                 <span className="text-[10px] font-black text-brand-teal uppercase tracking-[0.5em] italic">Logistics Node Pulsing</span>
              </div>
              <h1 className="font-syne font-black text-6xl lg:text-8xl text-[#0a1628] leading-[0.85] tracking-tighter uppercase italic">
                 Carrier <br/><span className="text-brand-teal">Terminal active</span>
              </h1>
           </div>
           
           <button 
              onClick={() => setIsAvailable(!isAvailable)}
              className={`h-24 px-12 rounded-[3rem] cursor-pointer flex items-center gap-8 transition-all duration-700 shadow-4xl relative overflow-hidden group ${isAvailable ? 'bg-brand-teal text-white' : 'bg-[#0a1628] text-white/40'}`}
           >
              <div className="absolute top-0 right-0 h-40 w-40 bg-white/10 rounded-full blur-[80px]" />
              <div className="space-y-1 relative z-10 text-left">
                 <div className="text-[9px] font-black uppercase tracking-[0.3em] leading-none opacity-50">{isAvailable ? 'Protocol' : 'Inertia'}</div>
                 <div className="text-3xl font-syne font-black uppercase tracking-tighter italic">{isAvailable ? 'SYNCED' : 'OFFLINE'}</div>
              </div>
              <div className="h-14 w-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white shadow-inner relative z-10 transition-transform duration-700 group-hover:rotate-180">
                 <div className={`h-4 w-4 rounded-full ${isAvailable ? 'bg-white animate-pulse' : 'bg-white/20'}`} />
              </div>
           </button>
        </div>

        {/* Mobility Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
           {stats.map((s, i) => (
             <motion.div 
               key={s.label}
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ delay: i * 0.1 }}
               className="bg-white border border-black/[0.03] p-10 rounded-[3.5rem] shadow-soft flex items-center justify-between group hover:shadow-4xl transition-all duration-500"
             >
                <div className="space-y-2">
                   <div className="text-[10px] font-black text-gray-300 uppercase italic tracking-widest leading-none group-hover:text-brand-teal transition-colors">{s.label}</div>
                   <div className="font-syne font-black text-4xl text-[#0a1628] uppercase italic tracking-tighter">{s.value}</div>
                </div>
                <div className={`h-16 w-16 rounded-2xl flex items-center justify-center shadow-inner group-hover:bg-[#0a1628] group-hover:text-white transition-all duration-700 ${s.color}`}>
                   <s.icon size={28} />
                </div>
             </motion.div>
           ))}
        </div>

        {/* active Payload Section */}
        <div className="grid lg:grid-cols-[1fr_500px] gap-20">
            <div className="space-y-12">
               <div className="flex items-center justify-between border-b border-black/[0.03] pb-8">
                  <h2 className="font-syne font-black text-3xl text-[#0a1628] uppercase italic flex items-center gap-6">
                     <div className="h-2 w-16 bg-brand-teal rounded-full" /> Active Manifest
                  </h2>
               </div>

               {activeOrder ? (
                  <div className="bg-white border p-12 rounded-[5rem] space-y-16 relative overflow-hidden shadow-4xl border-l-[24px] border-l-brand-teal group/manifest">
                     <div className="absolute top-0 right-0 h-64 w-64 bg-brand-teal/5 rounded-full blur-[100px]" />
                     
                     <div className="grid md:grid-cols-2 gap-16 relative z-10">
                        <div className="space-y-12">
                           <div className="space-y-6">
                              <div className="text-[10px] font-black text-gray-300 uppercase italic tracking-widest border-b border-black/[0.03] pb-4">Clinical Node Origin</div>
                              <div className="flex items-center gap-8">
                                 <div className="h-24 w-24 bg-gray-50 border border-black/[0.03] rounded-[2.5rem] flex items-center justify-center text-brand-teal shadow-inner font-syne font-black text-3xl">A</div>
                                 <div className="space-y-1">
                                    <h3 className="font-syne font-black text-2xl text-[#0a1628] uppercase italic leading-none tracking-tighter">Apollo Pharmacy</h3>
                                    <p className="text-sm font-dm font-bold text-gray-400 italic">Central Enclave, Karaikal Hub</p>
                                 </div>
                              </div>
                           </div>

                           <div className="space-y-6 pt-12 border-t border-black/[0.03]">
                              <div className="text-[10px] font-black text-gray-300 uppercase italic tracking-widest border-b border-black/[0.03] pb-4">Destination Protocol</div>
                              <div className="flex items-center gap-8">
                                 <div className="h-24 w-24 bg-[#0a1628]/5 border border-black/[0.01] rounded-[2.5rem] flex items-center justify-center text-[#0a1628] shadow-inner font-syne font-black text-3xl">{activeOrder.customerName?.[0] || 'C'}</div>
                                 <div className="space-y-1">
                                    <h3 className="font-syne font-black text-2xl text-[#0a1628] uppercase italic leading-none tracking-tighter">{activeOrder.customerName || 'Resident Node'}</h3>
                                    <p className="text-sm font-dm font-bold text-gray-400 italic">{activeOrder.deliveryAddress || 'Karaikal Sector 4'}</p>
                                 </div>
                              </div>
                           </div>

                           <div className="flex items-center gap-6 pt-12">
                              <button className="h-20 w-20 bg-gray-50 text-[#0a1628] border border-black/[0.03] rounded-[2rem] flex items-center justify-center hover:bg-[#0a1628] hover:text-white transition-all shadow-soft"><Phone size={28} /></button>
                              <button className="flex-1 h-20 bg-[#0a1628] text-brand-teal rounded-[2rem] font-syne font-black text-xs uppercase tracking-[0.4em] flex items-center justify-center gap-4 shadow-4xl hover:scale-105 transition-all italic">
                                 <Navigation size={24} /> Initialize Route
                              </button>
                           </div>
                        </div>

                        <div className="bg-gray-50/50 p-12 rounded-[4rem] border border-black/[0.01] space-y-10 flex flex-col justify-between">
                           <div className="space-y-8">
                              <div className="text-[10px] font-black text-gray-300 uppercase italic tracking-widest border-b border-black/[0.03] pb-4">Payload Architecture</div>
                              <div className="space-y-4">
                                 {activeOrder.items.map((item, idx) => (
                                    <div key={idx} className="flex justify-between text-xs font-dm font-black text-[#0a1628] uppercase italic tracking-widest">
                                       <span className="opacity-50">{item.qty}x Node</span>
                                       <span>{item.name || item.medicineName}</span>
                                    </div>
                                 ))}
                                 <div className="flex justify-between pt-6 border-t border-black/[0.03]">
                                    <span className="text-[10px] font-black text-gray-300 uppercase italic tracking-widest">Total Syne</span>
                                    <span className="font-syne font-black text-3xl text-brand-teal italic">₹{activeOrder.totalAmount}</span>
                                 </div>
                              </div>
                              <div className="px-6 py-2 bg-emerald-50 rounded-xl w-fit flex items-center gap-3 text-[9px] font-black text-emerald-600 uppercase tracking-[0.4em] italic shadow-inner">Payment Verified ✓</div>
                           </div>

                           <div className="space-y-4">
                              <div className="flex items-center justify-between text-[11px] font-black uppercase italic tracking-widest text-gray-300">
                                 <span>Proximity Node</span>
                                 <span className="text-brand-teal opacity-100">1.2km Remaining</span>
                              </div>
                              <button 
                                 onClick={() => setShowOtp(true)}
                                 className="w-full h-24 bg-brand-teal text-white rounded-[2.5rem] font-syne font-black text-2xl uppercase tracking-[0.3em] shadow-4xl hover:bg-[#0a1628] hover:scale-105 active:scale-95 transition-all italic flex items-center justify-center gap-6"
                              >
                                 Finalize <ArrowRight size={32} />
                              </button>
                           </div>
                        </div>
                     </div>
                  </div>
               ) : (
                  <div className="bg-white border border-dashed border-gray-100 rounded-[5rem] p-32 text-center space-y-8 opacity-40">
                     <Truck size={80} className="mx-auto text-gray-200 animate-pulse" />
                     <div className="font-syne font-black text-2xl uppercase italic tracking-widest text-gray-300">Awaiting Logistics Manifest_</div>
                  </div>
               )}
            </div>

            {/* Logistics Security & Performance */}
            <div className="space-y-12">
               <div className="bg-[#0a1628] rounded-[5rem] p-16 text-white text-center space-y-10 relative overflow-hidden border-t-[16px] border-brand-teal shadow-4xl">
                  <div className="absolute top-0 right-0 h-40 w-40 bg-brand-teal opacity-5 rounded-full blur-[80px]" />
                  <div className="h-24 w-24 bg-white/5 border border-white/10 rounded-[2.5rem] flex items-center justify-center mx-auto text-brand-teal shadow-3xl animate-bounce-slow"><Award size={48}/></div>
                  <div className="space-y-4 text-center">
                     <h3 className="font-syne font-black text-3xl uppercase italic leading-none tracking-tight">Node Elite</h3>
                     <p className="text-white/40 font-dm text-lg italic leading-relaxed">Top 1% Carrier Performance in Karaikal district.</p>
                  </div>
               </div>

               <div className="bg-white border border-black/[0.03] rounded-[4rem] p-12 space-y-8 shadow-soft">
                  <h4 className="font-syne font-black text-[#0a1628] uppercase tracking-widest text-[10px] italic border-b border-black/[0.03] pb-6">Real-Time Performance</h4>
                  <div className="space-y-4">
                     {[
                        { label: 'Weekly Revenue', value: '₹3,200', icon: TrendingUp, color: 'emerald' },
                        { label: 'Distance Sync', value: '142km', icon: Navigation, color: 'blue' },
                        { label: 'Carrier Score', value: '98%', icon: Activity, color: 'brand-teal' }
                     ].map(perf => (
                        <div key={perf.label} className="w-full h-20 bg-gray-50/50 rounded-[2.5rem] flex items-center justify-between px-8 transition-all duration-700 border border-transparent">
                           <div className="flex items-center gap-6">
                              <div className="h-12 w-12 bg-white rounded-xl flex items-center justify-center text-[#0a1628] shadow-soft"><perf.icon size={20}/></div>
                              <div className="text-[10px] font-black uppercase italic tracking-widest text-gray-400">{perf.label}</div>
                           </div>
                           <div className="font-syne font-black text-[#0a1628] text-xl italic leading-none">{perf.value}</div>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
        </div>
      </div>

      {/* Security Authorization Protocol (OTP) */}
      <AnimatePresence>
         {showOtp && (
            <div className="fixed inset-0 z-[120] flex items-center justify-center p-6">
               <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  exit={{ opacity: 0 }}
                  onClick={() => setShowOtp(false)}
                  className="absolute inset-0 bg-[#0a1628]/95 backdrop-blur-2xl" 
               />
               <motion.div 
                  initial={{ opacity: 0, scale: 0.9, y: 50 }} 
                  animate={{ opacity: 1, scale: 1, y: 0 }} 
                  exit={{ opacity: 0, scale: 0.9, y: 50 }}
                  className="relative z-10 w-full max-w-xl bg-white rounded-[5rem] shadow-4xl overflow-hidden p-20 text-center border border-white/10"
               >
                  <button onClick={() => setShowOtp(false)} className="absolute top-12 right-12 text-gray-200 hover:text-red-500 transition-all duration-300"><X size={32} /></button>
                  <div className="h-28 w-28 bg-brand-teal/10 text-brand-teal rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 shadow-inner border border-brand-teal/20"><ShieldCheck size={48} /></div>
                  <h3 className="font-syne font-black text-5xl text-[#0a1628] mb-4 uppercase italic leading-none tracking-tighter">Enter Auth Code</h3>
                  <p className="text-gray-400 font-dm text-lg mb-16 italic font-bold">Synchronize clinical handover protocol with customer security manifest.</p>
                  
                  <div className="flex justify-center gap-6 mb-16">
                     {otp.map((digit, i) => (
                        <input 
                           key={i} id={`otp-${i}`}
                           type="text" maxLength="1" 
                           value={digit}
                           onChange={(e) => handleOtpChange(i, e.target.value)}
                           className="h-24 w-20 bg-gray-50 border-4 border-gray-100 rounded-[2rem] text-center font-syne font-black text-4xl text-[#0a1628] focus:border-brand-teal focus:bg-white focus:shadow-4xl outline-none transition-all duration-500 italic" 
                        />
                     ))}
                  </div>

                  <button 
                     onClick={handleVerify}
                     className="w-full h-24 bg-[#0a1628] text-brand-teal rounded-[2.5rem] font-syne font-black text-xl uppercase tracking-[0.4em] shadow-4xl hover:bg-brand-teal hover:text-white transition-all duration-700 italic active:scale-95 flex items-center justify-center gap-6"
                  >
                     Authorize Handover <Zap size={24} />
                  </button>
               </motion.div>
            </div>
         )}
      </AnimatePresence>
    </div>
  );
}
