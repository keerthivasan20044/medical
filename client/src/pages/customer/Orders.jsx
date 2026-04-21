import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertCircle, Package, Truck, CheckCircle, Clock, 
  ChevronRight, Download, MapPin, ShoppingBag, Search, 
  Filter, Calendar, Activity, Info
} from 'lucide-react';
import { fetchOrders } from '../../store/ordersSlice.js';
import api from '../../services/api.js';
import { SkeletonBox } from '../../components/common/Skeleton.jsx';

const statusMap = {
  'pending': { label: 'Placed', icon: Package, color: 'text-amber-500 bg-amber-50', step: 0 },
  'confirmed': { label: 'Confirmed', icon: CheckCircle, color: 'text-blue-500 bg-blue-50', step: 1 },
  'processing': { label: 'Packed', icon: ShoppingBag, color: 'text-purple-500 bg-purple-50', step: 2 },
  'shipped': { label: 'Out for Delivery', icon: Truck, color: 'text-brand-teal bg-brand-teal/10', step: 3 },
  'delivered': { label: 'Delivered', icon: Activity, color: 'text-emerald-500 bg-emerald-50', step: 4 },
  'cancelled': { label: 'Cancelled', icon: AlertCircle, color: 'text-red-500 bg-red-50', step: -1 }
};

const TIMELINE_STEPS = ['Placed', 'Confirmed', 'Packed', 'On Way', 'Delivered'];

export default function MyOrdersPage() {
  const dispatch = useDispatch();
  const { items, status, error } = useSelector((s) => s.orders);
  const [activeTab, setActiveTab] = useState('Active'); // Active, Past, Cancelled
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (status === 'idle') dispatch(fetchOrders());
  }, [status, dispatch]);

  const filteredItems = useMemo(() => {
    let base = items || [];
    if (searchQuery) {
       base = base.filter(o => 
         (o.orderNumber || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
         (o.pharmacy?.name || '').toLowerCase().includes(searchQuery.toLowerCase())
       );
    }
    
    if (activeTab === 'Active') {
       return base.filter(o => !['delivered', 'cancelled'].includes(o.status?.toLowerCase()));
    } else if (activeTab === 'Past') {
       return base.filter(o => o.status?.toLowerCase() === 'delivered');
    } else {
       return base.filter(o => o.status?.toLowerCase() === 'cancelled');
    }
  }, [items, activeTab, searchQuery]);

  const downloadReceipt = async (id, orderNumber) => {
    try {
      const res = await api.get(`/api/payments/receipt/${id}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(res.data);
      const a = document.createElement('a');
      a.href = url;
      a.download = `receipt-${orderNumber || id}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Receipt sync failed');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-32 pt-8 px-4 md:px-0">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
         <div className="space-y-4">
            <div className="px-5 py-2 bg-[#0a1628] rounded-xl w-fit flex items-center gap-3 text-[10px] font-black text-brand-teal uppercase tracking-[0.4em] italic">
               <Activity size={14} className="animate-pulse" /> Global Logistics Pulse
            </div>
            <h1 className="font-syne font-black text-5xl md:text-7xl text-[#0a1628] uppercase italic leading-none tracking-tighter">
               My <span className="text-brand-teal">Procurements</span>
            </h1>
         </div>
         
         <div className="flex gap-4">
            <div className="h-16 w-full md:w-80 bg-white border border-black/[0.03] rounded-2xl flex items-center px-6 shadow-soft group focus-within:border-brand-teal transition-all">
               <Search size={20} className="text-gray-300 group-focus-within:text-brand-teal transition-colors" />
               <input 
                  type="text" 
                  placeholder="Order ID or Pharmacy..." 
                  className="flex-1 bg-transparent px-4 font-dm italic font-bold text-sm md:text-base outline-none text-[#0a1628] placeholder:text-gray-200"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
               />
            </div>
            <button className="h-16 w-16 bg-[#0a1628] rounded-2xl flex items-center justify-center text-brand-teal shadow-4xl active:scale-95 transition-all"><Filter size={24}/></button>
         </div>
      </div>

      {/* Tabs Layout */}
      <div className="flex bg-white border border-black/[0.03] p-2.5 rounded-[2.5rem] shadow-soft overflow-x-auto no-scrollbar whitespace-nowrap lg:justify-start">
         {['Active', 'Past', 'Cancelled'].map(tab => (
           <button
             key={tab}
             onClick={() => setActiveTab(tab)}
             className={`h-16 px-10 rounded-[1.8rem] font-syne font-black text-xs uppercase italic tracking-widest transition-all duration-700 active:scale-95 flex items-center gap-3 ${activeTab === tab ? 'bg-[#0a1628] text-brand-teal shadow-4xl' : 'text-gray-300 hover:text-[#0a1628]'}`}
           >
              {tab === 'Active' && <Clock size={16}/>}
              {tab === 'Past' && <CheckCircle size={16}/>}
              {tab === 'Cancelled' && <AlertCircle size={16}/>}
              {tab} Protocol
           </button>
         ))}
      </div>

      {/* Grid List */}
      <div className="space-y-8 md:space-y-12 min-h-[40vh]">
         {status === 'loading' ? (
           <div className="space-y-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-64 md:h-80 w-full bg-white rounded-[3rem] border border-black/[0.03] p-10 animate-pulse space-y-10">
                   <div className="h-12 w-1/3 bg-gray-100 rounded-xl" />
                   <div className="h-24 w-full bg-gray-50 rounded-3xl" />
                </div>
              ))}
           </div>
         ) : filteredItems.length > 0 ? (
           <div className="grid gap-8 md:gap-12">
              <AnimatePresence mode="popLayout">
                 {filteredItems.map((o, idx) => {
                    const currentStatus = statusMap[(o.status || 'pending').toLowerCase()] || statusMap.pending;
                    return (
                      <motion.div
                         layout
                         key={o.id || o._id}
                         initial={{ opacity: 0, y: 30 }}
                         animate={{ opacity: 1, y: 0 }}
                         transition={{ delay: idx * 0.05 }}
                         className="bg-white border border-black/[0.03] rounded-[3rem] md:rounded-[4.5rem] p-8 md:p-12 shadow-soft hover:shadow-4xl transition-all duration-700 group overflow-hidden border-l-[16px] md:border-l-[24px]"
                         style={{ borderLeftColor: currentStatus.color.includes('teal') ? '#02C39A' : currentStatus.color.includes('emerald') ? '#10b981' : currentStatus.color.includes('amber') ? '#f59e0b' : '#3b82f6' }}
                      >
                         <div className="flex flex-col md:flex-row md:items-start justify-between gap-10">
                            <div className="space-y-6 md:space-y-8 flex-1">
                               <div className="flex items-center gap-6">
                                  <div className="space-y-1">
                                     <div className="text-[10px] font-black text-gray-300 uppercase tracking-widest italic">Protocol ID</div>
                                     <div className="font-syne font-black text-2xl md:text-3xl text-[#0a1628] italic uppercase leading-none">#{o.orderNumber || (o._id || o.id).slice(-6)}</div>
                                  </div>
                                  <div className="h-10 w-px bg-black/[0.03]" />
                                  <div className="space-y-1">
                                     <div className="text-[10px] font-black text-gray-300 uppercase tracking-widest italic">Sync Date</div>
                                     <div className="font-dm font-black text-[#0a1628] text-sm md:text-lg italic">{new Date(o.createdAt || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                                  </div>
                               </div>

                               <div className="flex flex-col md:flex-row gap-8 md:gap-16">
                                  <div className="flex items-center gap-6">
                                     <div className="h-14 w-14 bg-gray-50 rounded-2xl flex items-center justify-center text-brand-teal shadow-inner"><MapPin size={24}/></div>
                                     <div className="space-y-0.5">
                                        <div className="text-[9px] font-black text-gray-300 uppercase tracking-widest italic">Source Node</div>
                                        <div className="font-syne font-black text-[#0a1628] text-lg uppercase italic">{o.pharmacy?.name || 'Karaikal Enclave'}</div>
                                     </div>
                                  </div>
                                  <div className="flex items-center gap-6">
                                     <div className="h-14 w-14 bg-gray-100 rounded-2xl flex items-center justify-center text-[#0a1628] shadow-inner"><Package size={24}/></div>
                                     <div className="space-y-0.5">
                                        <div className="text-[9px] font-black text-gray-300 uppercase tracking-widest italic">Payload Meta</div>
                                        <div className="font-syne font-black text-[#0a1628] text-lg uppercase italic">{o.items?.length || 1} Categories &bull; ₹{o.totalAmount}</div>
                                     </div>
                                  </div>
                               </div>

                               {/* Progress Timeline */}
                               {currentStatus.step >= 0 && (
                                 <div className="pt-8 space-y-6">
                                    <div className="flex items-center justify-between px-2">
                                       <span className="text-[10px] font-black text-[#0a1628] uppercase italic tracking-[0.2em]">Transmission Timeline</span>
                                       <span className={`px-4 py-1 rounded-lg text-[9px] font-black uppercase italic tracking-widest ${currentStatus.color}`}>{currentStatus.label} Node Active</span>
                                    </div>
                                    <div className="relative h-2 md:h-3 bg-gray-50 rounded-full overflow-hidden border border-black/[0.01]">
                                       <motion.div 
                                          initial={{ width: 0 }}
                                          animate={{ width: `${((currentStatus.step + 1) / 5) * 100}%` }}
                                          className={`h-full bg-brand-teal shadow-mint transition-all duration-1000 ${currentStatus.step === 4 ? 'bg-emerald-500 shadow-emerald-500/40' : ''}`}
                                       />
                                    </div>
                                    <div className="flex justify-between px-1">
                                       {TIMELINE_STEPS.map((s, i) => (
                                          <div key={s} className="flex flex-col items-center gap-2">
                                             <div className={`h-2 w-2 rounded-full ${i <= currentStatus.step ? 'bg-brand-teal' : 'bg-gray-100'}`} />
                                             <span className={`text-[8px] font-black uppercase italic tracking-tight hidden md:block ${i <= currentStatus.step ? 'text-[#0a1628]' : 'text-gray-200'}`}>{s}</span>
                                          </div>
                                       ))}
                                    </div>
                                 </div>
                               )}
                            </div>

                            <div className="flex flex-row md:flex-col gap-4 shrink-0 md:justify-center">
                               {o.status?.toLowerCase() !== 'delivered' && o.status?.toLowerCase() !== 'cancelled' && (
                                 <Link to={`/orders/${o._id || o.id}/track`} className="flex-1">
                                    <button className="w-full h-16 md:h-20 px-8 bg-[#0a1628] text-brand-teal rounded-2xl md:rounded-[2rem] font-syne font-black text-[10px] uppercase italic tracking-widest shadow-4xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3">
                                       <Truck size={18}/> Track Link
                                    </button>
                                 </Link>
                               )}
                               <button 
                                 onClick={() => downloadReceipt(o._id || o.id, o.orderNumber)}
                                 className="flex-1 h-16 md:h-20 px-8 bg-gray-50 border border-black/[0.02] text-[#0a1628] font-syne font-black text-[10px] uppercase italic tracking-widest rounded-2xl md:rounded-[2rem] hover:bg-[#0a1628] hover:text-white transition-all duration-500 flex items-center justify-center gap-3"
                               >
                                  <Download size={18}/> Invert Invoice
                               </button>
                               <Link to={`/orders/${o._id || o.id}`} className="flex-1">
                                  <button className="w-full h-16 md:h-16 md:w-16 bg-[#0a1628] border border-white/5 rounded-2xl flex items-center justify-center text-white hover:bg-brand-teal hover:text-[#0a1628] transition-all shadow-xl">
                                     <ChevronRight size={24}/>
                                  </button>
                               </Link>
                            </div>
                         </div>
                      </motion.div>
                    );
                 })}
              </AnimatePresence>
           </div>
         ) : (
           <div className="flex flex-col items-center justify-center py-32 space-y-12">
              <div className="relative">
                 <div className="h-48 w-48 md:h-64 md:w-64 bg-gray-50 rounded-[4rem] flex items-center justify-center text-gray-200 shadow-inner">
                    {activeTab === 'Cancelled' ? <AlertCircle size={96} /> : <ShoppingBag size={96} />}
                 </div>
                 <div className="absolute -bottom-6 -right-6 h-20 w-20 bg-white shadow-4xl rounded-3xl flex items-center justify-center text-brand-teal border border-black/[0.03] animate-bounce-slow">
                    <Info size={32} />
                 </div>
              </div>
              <div className="text-center space-y-4">
                 <h3 className="font-syne font-black text-3xl text-[#0a1628] uppercase italic tracking-tighter">Null Enclave Detected</h3>
                 <p className="text-gray-400 font-dm italic text-lg font-bold max-w-sm mx-auto">No {activeTab.toLowerCase()} logistics synchronizations found in the clinical registry.</p>
              </div>
              <Link to="/medicines">
                 <button className="h-20 px-12 bg-brand-teal text-[#0a1628] font-syne font-black text-xs uppercase italic tracking-[0.3em] shadow-mint hover:scale-[1.05] active:scale-95 transition-all">
                    Initialize Procurement &rarr;
                 </button>
              </Link>
           </div>
         )}
      </div>
    </div>
  );
}
