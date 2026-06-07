import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertCircle, Package, Truck, CheckCircle,
  ChevronRight, Download, MapPin, ShoppingBag, Search,
  Activity, Info, Loader2
} from 'lucide-react';
import { fetchOrders } from '../../store/ordersSlice.js';
import { cancelOrder } from '../../store/ordersSlice.js';
import api from '../../services/api.js';
import Pagination from '../../components/common/Pagination';
import useInfiniteScroll from '../../hooks/useInfiniteScroll';
import { useLanguage } from '../../context/LanguageContext';

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
  const { t } = useLanguage();
  const dispatch = useDispatch();
  const { items, pagination, status, error } = useSelector((s) => s.orders);
  const [activeTab, setActiveTab] = useState('Active'); // Active, Past, Cancelled
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingMore, setLoadingMore] = useState(false);
  const [cancellingId, setCancellingId] = useState(null);

  const fetchOrdersAction = (pageNum = 1, append = false) => {
    let orderStatus = 'active';
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
      console.error('Receipt update failed');
    }
  };

  const handleCancelOrder = async (id) => {
    if (!id || !window.confirm('Cancel this order?')) return;
    setCancellingId(id);
    const result = await dispatch(cancelOrder(id));
    setCancellingId(null);
    if (result.meta.requestStatus === 'fulfilled') {
      fetchOrdersAction(1, false);
    } else {
      window.alert(result.payload || 'Failed to cancel order');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-5 pb-24 pt-5 px-4 md:px-6">
      {/* Header & Search */}
      <div className="rounded-2xl border border-slate-100 bg-white p-4 md:p-6 shadow-sm">
         <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
         <div className="min-w-0">
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">{t('myOrdersTitle')}</h1>
            <p className="text-sm text-slate-500 mt-1">{t('trackManageOrders')}</p>
         </div>
         <div className="flex gap-2 md:w-80">
            <div className="flex-1 h-11 bg-slate-50 border border-slate-200 rounded-xl flex items-center px-3 gap-2 focus-within:border-teal-500 transition-all">
               <Search size={16} className="text-slate-400 flex-shrink-0" />
               <input 
                  type="text" 
                  placeholder={t('searchOrdersPlaceholder')} 
                  className="flex-1 bg-transparent text-sm font-medium outline-none text-slate-900 placeholder:text-slate-400 min-w-0"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
               />
            </div>
         </div>
         </div>
      </div>

      {/* Tabs Layout */}
      <div className="flex bg-white border border-slate-100 p-1.5 rounded-2xl shadow-sm overflow-x-auto no-scrollbar whitespace-nowrap">
         {['Active', 'Past', 'Cancelled'].map(tab => (
           <button
             key={tab}
             onClick={() => setActiveTab(tab)}
             className={`h-10 px-5 rounded-xl font-bold text-[11px] uppercase tracking-[0.08em] transition-all active:scale-95 flex items-center gap-2 ${activeTab === tab ? 'bg-slate-900 text-teal-400 shadow-md' : 'text-slate-500 hover:text-slate-900'}`}
           >
              {tab}
           </button>
         ))}
      </div>

      {/* Grid List */}
      <div className="space-y-5 min-h-[40vh]">
         {status === 'loading' ? (
           <div className="space-y-5">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-48 w-full bg-white rounded-2xl border border-slate-100 p-6 animate-pulse space-y-6">
                   <div className="h-9 w-1/3 bg-gray-100 rounded-xl" />
                   <div className="h-20 w-full bg-gray-50 rounded-2xl" />
                </div>
              ))}
           </div>
         ) : filteredItems.length > 0 ? (
           <div className="grid gap-5">
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
                         className="bg-white border border-slate-100 rounded-2xl p-4 md:p-6 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border-l-4"
                         style={{ borderLeftColor: currentStatus.color.includes('teal') ? '#02C39A' : currentStatus.color.includes('emerald') ? '#10b981' : currentStatus.color.includes('amber') ? '#f59e0b' : '#3b82f6' }}
                      >
                         <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-6">
                            <div className="space-y-5 flex-1 min-w-0">
                               <div className="flex flex-wrap items-center gap-4 md:gap-6">
                                  <div className="space-y-1">
                                     <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.12em]">{t('stepId')}</div>
                                     <div className="font-syne font-black text-xl md:text-2xl text-[#0a1628] uppercase leading-none">#{o.orderNumber || (o._id || o.id).slice(-6)}</div>
                                  </div>
                                  <div className="h-10 w-px bg-black/[0.03]" />
                                  <div className="space-y-1">
                                     <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.12em]">{t('updateDate')}</div>
                                     <div className="font-dm font-black text-[#0a1628] text-sm md:text-base">{new Date(o.createdAt || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                                  </div>
                               </div>

                               <div className="grid gap-4 md:grid-cols-2">
                                  <div className="flex items-center gap-4 rounded-2xl bg-slate-50 p-4">
                                     <div className="h-11 w-11 bg-white rounded-xl flex items-center justify-center text-brand-teal shadow-inner"><MapPin size={20}/></div>
                                     <div className="space-y-0.5">
                                        <div className="text-[9px] font-black text-gray-400 uppercase tracking-[0.12em]">{t('sourceItem')}</div>
                                        <div className="font-syne font-black text-[#0a1628] text-sm uppercase truncate">{o.pharmacyId?.name || o.pharmacy?.name || 'Pharmacy'}</div>
                                     </div>
                                  </div>
                                  <div className="flex items-center gap-4 rounded-2xl bg-slate-50 p-4">
                                     <div className="h-11 w-11 bg-white rounded-xl flex items-center justify-center text-[#0a1628] shadow-inner"><Package size={20}/></div>
                                     <div className="space-y-0.5">
                                        <div className="text-[9px] font-black text-gray-400 uppercase tracking-[0.12em]">{t('payloadMeta')}</div>
                                        <div className="font-syne font-black text-[#0a1628] text-sm uppercase">{o.items?.length || 1} item{(o.items?.length || 1) === 1 ? '' : 's'} | INR {o.totalAmount}</div>
                                     </div>
                                  </div>
                               </div>

                               {/* Progress Timeline */}
                               {currentStatus.step >= 0 && (
                                 <div className="pt-3 space-y-4">
                                    <div className="flex items-center justify-between px-2">
                                       <span className="text-[10px] font-black text-[#0a1628] uppercase tracking-[0.12em]">{t('transmissionTimeline')}</span>
                                       <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-[0.1em] ${currentStatus.color}`}>{currentStatus.label}</span>
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
                                             <span className={`text-[8px] font-black uppercase tracking-tight hidden md:block ${i <= currentStatus.step ? 'text-[#0a1628]' : 'text-gray-300'}`}>{s}</span>
                                          </div>
                                       ))}
                                    </div>
                                 </div>
                               )}
                            </div>

                            <div className="grid grid-cols-2 sm:flex sm:flex-row xl:flex-col gap-3 shrink-0 xl:w-44">
                               {o.status?.toLowerCase() !== 'delivered' && o.status?.toLowerCase() !== 'cancelled' && (
                                 <Link to={`/orders/${o._id || o.id}/track`} className="flex-1">
                                    <button className="w-full h-12 px-4 bg-[#0a1628] text-brand-teal rounded-xl font-syne font-black text-[10px] uppercase tracking-[0.12em] shadow-4xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2">
                                       <Truck size={18}/> {t('trackLink')}
                                    </button>
                                 </Link>
                               )}
                               {['pending', 'confirmed', 'preparing', 'processing'].includes(o.status?.toLowerCase()) && (
                                 <button
                                   onClick={() => handleCancelOrder(o._id || o.id)}
                                   disabled={cancellingId === (o._id || o.id)}
                                   className="flex-1 h-12 px-4 bg-red-50 border border-red-100 text-red-500 font-syne font-black text-[10px] uppercase tracking-[0.12em] rounded-xl hover:bg-red-500 hover:text-white transition-all duration-300 disabled:opacity-50"
                                 >
                                   {cancellingId === (o._id || o.id) ? 'Cancelling' : 'Cancel'}
                                 </button>
                               )}
                               <button 
                                 onClick={() => downloadReceipt(o._id || o.id, o.orderNumber)}
                                 className="flex-1 h-12 px-4 bg-gray-50 border border-black/[0.04] text-[#0a1628] font-syne font-black text-[10px] uppercase tracking-[0.12em] rounded-xl hover:bg-[#0a1628] hover:text-white transition-all duration-300 flex items-center justify-center gap-2"
                               >
                                  <Download size={18}/> {t('invertInvoice')}
                               </button>
                               <Link to={`/orders/${o._id || o.id}`} className="flex-1">
                                  <button className="w-full h-12 bg-[#0a1628] border border-white/5 rounded-xl flex items-center justify-center text-white hover:bg-brand-teal hover:text-[#0a1628] transition-all shadow-xl">
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
           <div className="flex flex-col items-center justify-center py-16 md:py-24 space-y-8">
              <div className="relative">
                 <div className="h-36 w-36 md:h-44 md:w-44 bg-gray-50 rounded-[3rem] flex items-center justify-center text-gray-200 shadow-inner">
                    {activeTab === 'Cancelled' ? <AlertCircle size={72} /> : <ShoppingBag size={72} />}
                 </div>
                 <div className="absolute -bottom-4 -right-4 h-14 w-14 bg-white shadow-xl rounded-2xl flex items-center justify-center text-brand-teal border border-black/[0.03]">
                    <Info size={24} />
                 </div>
              </div>
              <div className="text-center space-y-3">
                 <h3 className="font-syne font-black text-2xl md:text-3xl text-[#0a1628] uppercase italic tracking-tighter">{t('nullAreaDetected')}</h3>
                 <p className="text-gray-400 font-dm text-base md:text-lg font-bold max-w-sm mx-auto">{t('noLogisticsFound', { status: activeTab.toLowerCase() })}</p>
              </div>
              <Link to="/medicines">
                 <button className="h-14 md:h-16 px-8 md:px-10 bg-brand-teal text-[#0a1628] font-syne font-black text-xs uppercase italic tracking-widest shadow-mint hover:scale-[1.03] active:scale-95 transition-all rounded-2xl">
                    {t('initializeProcurement')} &rarr;
                 </button>
              </Link>
           </div>
         )}
      </div>
    </div>
  );
}
