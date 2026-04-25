import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertCircle, Package, Truck, CheckCircle, Clock, 
  ChevronRight, Download, MapPin, ShoppingBag, Search, 
  Filter, Calendar, Activity, Info, Loader2
} from 'lucide-react';
import { fetchOrders } from '../../store/ordersSlice.js';
import api from '../../services/api.js';
import { SkeletonBox } from '../../components/common/Skeleton';
import Pagination from '../../components/common/Pagination';
import useInfiniteScroll from '../../hooks/useInfiniteScroll';

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
  const { items, pagination, status, error } = useSelector((s) => s.orders);
  const [activeTab, setActiveTab] = useState('Active'); // Active, Past, Cancelled
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchOrdersAction = (pageNum = 1, append = false) => {
    let orderStatus = '';
    if (activeTab === 'Past') orderStatus = 'delivered';
    if (activeTab === 'Cancelled') orderStatus = 'cancelled';
    
    dispatch(fetchOrders({ 
      page: pageNum, 
      limit: 5, 
      status: orderStatus, 
      search: searchQuery,
      append 
    }));
  };

  useEffect(() => {
    fetchOrdersAction(1, false);
  }, [activeTab, searchQuery]);

  const handlePageChange = (pageNum) => {
    fetchOrdersAction(pageNum, false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoadMore = () => {
    if (pagination.hasNext && status !== 'loading') {
      setLoadingMore(true);
      fetchOrdersAction(pagination.page + 1, true);
    }
  };

  useEffect(() => {
    if (status === 'succeeded') setLoadingMore(false);
  }, [status]);

  const observerTarget = useInfiniteScroll(handleLoadMore, pagination.hasNext, status === 'loading' || loadingMore);

  const filteredItems = useMemo(() => {
     // Local filtering for search if needed, but we already pass it to backend
     return items || [];
  }, [items]);

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
    <div className="max-w-6xl mx-auto space-y-4 pb-24 pt-4 px-3 md:px-6">
      {/* Header & Search */}
      <div className="flex flex-col gap-3">
         <div>
            <h1 className="text-2xl md:text-4xl font-bold text-slate-900">My Orders</h1>
            <p className="text-sm text-slate-400 mt-1">Track and manage your orders</p>
         </div>
         <div className="flex gap-2">
            <div className="flex-1 h-11 bg-white border border-slate-200 rounded-xl flex items-center px-3 gap-2 focus-within:border-teal-500 transition-all">
               <Search size={16} className="text-slate-400 flex-shrink-0" />
               <input 
                  type="text" 
                  placeholder="Search by order ID or pharmacy..." 
                  className="flex-1 bg-transparent text-sm font-medium outline-none text-slate-900 placeholder:text-slate-400 min-w-0"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
               />
            </div>
         </div>
      </div>

      {/* Tabs Layout */}
      <div className="flex bg-slate-100 p-1.5 rounded-2xl shadow-sm overflow-x-auto no-scrollbar whitespace-nowrap">
         {['Active', 'Past', 'Cancelled'].map(tab => (
           <button
             key={tab}
             onClick={() => setActiveTab(tab)}
             className={`h-11 px-6 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all active:scale-95 flex items-center gap-2 ${activeTab === tab ? 'bg-slate-900 text-teal-400 shadow-md' : 'text-slate-400 hover:text-slate-900'}`}
           >
              {tab}
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
                         className="bg-white border border-black/[0.03] rounded-2xl p-4 md:p-8 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border-l-4"
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
                                    <div className="relative h-1 bg-slate-100 rounded-full overflow-hidden">
                                       <motion.div 
                                          initial={{ width: 0 }}
                                          animate={{ width: `${((currentStatus.step + 1) / 5) * 100}%` }}
                                          className={`h-full bg-teal-500 shadow-sm transition-all duration-1000 ${currentStatus.step === 4 ? 'bg-emerald-500' : ''}`}
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
              
              {/* Pagination for Desktop */}
              <div className="hidden md:block">
                 <Pagination 
                   page={pagination.page} 
                   pages={pagination.pages} 
                   onPageChange={handlePageChange} 
                 />
              </div>

              {/* Infinite Scroll for Mobile */}
              <div className="md:hidden py-10 flex justify-center">
                 {loadingMore ? (
                    <Loader2 size={24} className="animate-spin text-brand-teal" />
                 ) : (
                    <div ref={observerTarget} className="h-10 w-full" />
                 )}
              </div>
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
