import { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, CheckCircle, Clock, Truck, 
  AlertCircle, Package, Search, Filter, 
  IndianRupee, Bell, Activity, ArrowRight,
  TrendingUp, RefreshCw, XCircle, User,
  Calendar, CheckSquare, MessageSquare, Phone, FileText, Lock, MapPin, Pill
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { fetchOrders, updateOrderStatus, addOrder } from '../../store/ordersSlice.js';
import PrescriptionModal from '../../components/pharmacist/PrescriptionModal';
import { useLanguage } from '../../context/LanguageContext';

export default function PharmacistDashboard() {
  const { t } = useLanguage();
  const dispatch = useDispatch();
  const { items: orders, status } = useSelector(s => s.orders);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const stats = useMemo(() => [
    { label: "Today's Orders", value: orders.filter(o => new Date(o.createdAt).toDateString() === new Date().toDateString()).length, icon: ShoppingBag, color: 'text-amber-600 bg-amber-50' },
    { label: 'Pending Sync', value: orders.filter(o => o.status === 'placed').length, icon: Clock, color: 'text-blue-600 bg-blue-50' },
    { label: 'Low Stock Alerts', value: 4, icon: AlertCircle, color: 'text-red-600 bg-red-50' },
    { label: 'District Revenue', value: `₹${orders.reduce((acc, curr) => acc + (curr.totalAmount || 0), 0)}`, icon: IndianRupee, color: 'text-brand-teal bg-brand-teal/10' }
  ], [orders, t]);

  const [otpValue, setOtpValue] = useState('');
  const [showOtpSync, setShowOtpSync] = useState(false);

  const confirmDeliveryOtp = () => {
     if(otpValue.length === 4) {
        toast.success("Logistics Handshake Verified");
        setShowOtpSync(false);
        setOtpValue('');
     } else {
        toast.error("Invalid Protocol Key");
     }
  };

  const handleAction = async (id, newStatus) => {
    const res = await dispatch(updateOrderStatus({ id, status: newStatus }));
    if (res.meta.requestStatus === 'fulfilled') {
      toast.success(`${t('nodeSynchronized')}: Order ${t(newStatus)}`);
    } else {
      toast.error(t('protocolSyncFailed'));
    }
  };

  const handleViewPrescription = (order) => {
    setSelectedPrescription(order.prescription);
    setSelectedOrderId(order.id || order._id);
    setIsModalOpen(true);
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-48 pt-24 px-6 md:px-10">
      <div className="max-w-7xl mx-auto space-y-12 md:space-y-20">
        
        {/* District Command Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 pb-12 border-b border-black/[0.03]">
           <div className="space-y-6">
              <div className="flex items-center gap-4">
                 <div className="h-4 w-4 bg-brand-teal rounded-full animate-ping" />
                 <span className="text-[10px] font-black text-brand-teal uppercase tracking-[0.5em] italic">{t('liveClinicalTerminal')}</span>
              </div>
              <h1 className="font-syne font-black text-6xl lg:text-8xl text-[#0a1628] leading-[0.85] tracking-tighter uppercase italic">
                 {t('pharmacy')} <br/><span className="text-brand-teal">{t('enclaveNode')}</span>
              </h1>
           </div>
           
           <div className="flex items-center gap-8 bg-white border border-black/[0.03] p-4 rounded-[3rem] shadow-soft">
              <div className="flex items-center gap-6 px-4 border-r border-black/[0.03]">
                 <div className="h-20 w-20 bg-gray-50 rounded-[2rem] flex items-center justify-center text-brand-teal shadow-inner"><User size={32}/></div>
                 <div className="space-y-1">
                    <div className="font-syne font-black text-2xl text-[#0a1628] uppercase italic leading-none">{t('apolloHub')}</div>
                    <div className="text-[10px] font-black text-gray-300 uppercase italic tracking-widest">{t('administratorNode')}</div>
                 </div>
              </div>
              <button onClick={() => dispatch(fetchOrders())} className="h-16 w-16 bg-[#0a1628] text-brand-teal rounded-2xl flex items-center justify-center shadow-4xl hover:rotate-180 transition-all duration-1000 active:scale-95"><RefreshCw size={24}/></button>
           </div>
        </div>

        {/* Telemetry Stats Grid */}
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

        <div className="grid lg:grid-cols-[1fr_400px] gap-20">
           {/* Payload Registry Section */}
           <div className="space-y-12">
              <div className="flex items-center justify-between border-b border-black/[0.03] pb-8">
                 <h2 className="font-syne font-black text-3xl text-[#0a1628] uppercase italic flex items-center gap-6">
                    <div className="h-2 w-16 bg-brand-teal rounded-full" /> {t('payloadManifest')}
                 </h2>
                 <div className="flex bg-gray-50 border border-black/[0.03] p-2 rounded-2xl gap-2 font-syne font-black text-[9px] uppercase italic tracking-widest">
                    <button className="h-10 px-6 bg-white border border-black/[0.01] rounded-xl shadow-sm text-[#0a1628]">{t('realTime')}</button>
                    <button className="h-10 px-6 text-gray-300 hover:text-[#0a1628]">{t('districtHistory')}</button>
                 </div>
              </div>

              <div className="space-y-8">
                 <AnimatePresence mode="popLayout">
                    {orders.length === 0 ? (
                       <div className="bg-white border border-dashed border-gray-100 rounded-[4rem] p-24 text-center space-y-8 opacity-40">
                          <Activity size={64} className="mx-auto text-gray-300 animate-pulse" />
                          <div className="font-syne font-black text-2xl uppercase italic tracking-widest text-gray-300">{t('terminalIdle')}</div>
                       </div>
                    ) : orders.map((ord, idx) => (
                       <motion.div 
                          key={ord.id || ord._id}
                          layout
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className={`bg-white border p-12 rounded-[4.5rem] flex flex-col lg:flex-row gap-12 items-start lg:items-center justify-between shadow-soft hover:shadow-4xl transition-all duration-1000 relative overflow-hidden group/card ${ord.status === 'placed' ? 'border-brand-teal/20 border-l-[16px] border-l-brand-teal' : 'border-black/[0.03]'}`}
                       >
                          {ord.status === 'placed' && (
                             <div className="absolute top-0 right-0 py-2 px-8 bg-brand-teal text-[#0a1628] font-syne font-black text-[9px] uppercase italic tracking-[0.4em] rounded-bl-[2rem] shadow-mint animate-pulse z-10">{t('uplinked')}</div>
                          )}
                          
                          <div className="flex items-center gap-8 lg:w-1/3">
                             <div className="relative shrink-0">
                                <div className="h-24 w-24 bg-gray-50 border border-black/[0.03] rounded-[2.5rem] flex items-center justify-center font-syne font-black text-3xl text-brand-teal shadow-inner group-hover/card:bg-[#0a1628] transition-all duration-700">{ord.customerName?.[0] || 'C'}</div>
                                <div className="absolute -bottom-2 -right-2 h-10 w-10 bg-white border-2 border-gray-50 rounded-full flex items-center justify-center text-emerald-500 shadow-soft"><CheckCircle size={18} fill="currentColor" fillOpacity={0.1}/></div>
                             </div>
                             <div className="space-y-1">
                                <div className="text-[10px] font-black text-gray-300 uppercase italic tracking-widest">{t('payloadId')} {(ord.id || ord._id).slice(-6)}</div>
                                <h3 className="font-syne font-black text-2xl text-[#0a1628] uppercase italic leading-none tracking-tighter">{ord.customerName || t('anonymousNode')}</h3>
                                <div className="flex items-center gap-3 text-xs font-dm font-bold text-gray-400 italic"><MapPin size={14} className="text-brand-teal" /> {ord.deliveryAddress || t('karaikalEnclave')}</div>
                             </div>
                          </div>

                          <div className="lg:w-1/3 bg-gray-50/50 p-8 rounded-[3.5rem] border border-black/[0.01] space-y-6">
                             <div className="text-[10px] font-black text-gray-300 uppercase tracking-widest italic border-b border-black/[0.03] pb-4">{t('clinicalPayloadComponents')}</div>
                             <div className="space-y-3">
                                {ord.items.map((item, id) => (
                                   <div key={id} className="text-xs font-dm font-black text-[#0a1628] uppercase italic tracking-widest flex items-center gap-4">
                                      <div className="h-1 w-8 bg-brand-teal rounded-full" />
                                      <span className="opacity-50">{item.qty}x</span> {item.name || item.medicineName || t('medicineNode')}
                                   </div>
                                ))}
                             </div>
                             <div className="flex items-center justify-between pt-6 border-t border-black/[0.01]">
                                <div className="text-[10px] font-black text-gray-300 uppercase tracking-widest italic">{ord.paymentMethod} v2</div>
                                <div className="font-syne font-black text-[#0a1628] text-xl italic leading-none">₹{ord.totalAmount}</div>
                             </div>
                          </div>

                          <div className="lg:w-1/4 flex flex-col gap-4 w-full">
                             {ord.status === 'placed' ? (
                                <>
                                   {ord.requiresPrescription && (
                                     <button 
                                       onClick={() => handleViewPrescription(ord)}
                                       className="w-full h-16 bg-white border border-red-500/20 text-red-500 rounded-[2rem] font-syne font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-4 hover:bg-red-500 hover:text-white transition-all shadow-soft italic"
                                     >
                                        <FileText size={18}/> {t('verifyAuthorization')}
                                     </button>
                                   )}
                                   <button 
                                      onClick={() => handleAction(ord._id || ord.id, 'confirmed')}
                                      className="w-full h-20 bg-[#0a1628] text-brand-teal rounded-[2rem] font-syne font-black text-xs uppercase tracking-widest flex items-center justify-center gap-6 hover:bg-brand-teal hover:text-white transition-all shadow-4xl italic group"
                                   >
                                      {t('acceptNode')} <CheckCircle size={20} className="group-hover:rotate-12 transition-transform" />
                                   </button>
                                   <div className="grid grid-cols-2 gap-4">
                                      <button onClick={() => handleAction(ord._id || ord.id, 'cancelled')} className="h-14 bg-gray-50 text-gray-300 rounded-2xl font-syne font-black text-[9px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all shadow-soft italic">{t('rejectSync')}</button>
                                      <button className="h-14 bg-gray-50 text-gray-300 rounded-2xl font-syne font-black text-[9px] uppercase tracking-widest hover:bg-[#0a1628] hover:text-white transition-all shadow-soft italic">{t('logNode')}</button>
                                   </div>
                                </>
                             ) : ord.status === 'confirmed' ? (
                                <>
                                   <div className="bg-blue-50/50 border border-blue-50 p-6 rounded-[2.5rem] text-center space-y-2">
                                      <div className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] italic">{t('preparatoryRedline')}</div>
                                      <div className="font-syne font-black text-[#0a1628] text-lg italic uppercase">{t('assemblingPayload')}</div>
                                   </div>
                                   <button 
                                     onClick={() => handleAction(ord._id || ord.id, 'shipped')}
                                     className="w-full h-20 bg-brand-teal text-white rounded-[2rem] font-syne font-black text-xs uppercase tracking-widest flex items-center justify-center gap-4 hover:bg-[#0a1628] transition-all shadow-4xl italic"
                                   >
                                      {t('dispatchPulse')} <Truck size={20}/>
                                   </button>
                                </>
                             ) : (
                                <div className="flex items-center justify-center gap-6 p-6 bg-gray-50 rounded-[2.5rem] opacity-40">
                                   <div className="text-xl font-syne font-black text-[#0a1628] uppercase italic">{t(ord.status)}</div>
                                   <CheckSquare size={20} className="text-[#0a1628]"/>
                                </div>
                             )}
                          </div>
                       </motion.div>
                    ))}
                 </AnimatePresence>
              </div>
           </div>

           {/* Clinical Security Redline */}
           <div className="space-y-12">
              <div className="bg-[#0a1628] rounded-[5rem] p-16 text-white text-center space-y-10 relative overflow-hidden border-t-[16px] border-brand-teal shadow-4xl">
                 <div className="absolute top-0 right-0 h-40 w-40 bg-brand-teal opacity-5 rounded-full blur-[80px]" />
                 <div className="h-24 w-24 bg-white/5 border border-white/10 rounded-[2.5rem] flex items-center justify-center mx-auto text-brand-teal shadow-3xl animate-bounce-slow"><Lock size={48}/></div>
                 <div className="space-y-4">
                    <h3 className="font-syne font-black text-3xl uppercase italic tracking-tighter leading-none tracking-tight">{t('terminalLock')}</h3>
                    <p className="text-white/40 font-dm text-lg italic leading-relaxed">{t('emergencySecureMode')}</p>
                 </div>
                 <button className="w-full h-20 bg-white/10 border border-white/20 rounded-[2.5rem] font-syne font-black text-xs uppercase tracking-[0.4em] italic hover:bg-white hover:text-[#0a1628] transition-all duration-700">{t('enterEnigma')}</button>
              </div>

              <div className="bg-white border border-black/[0.03] rounded-[4rem] p-12 space-y-8 shadow-soft">
                 <h4 className="font-syne font-black text-[#0a1628] uppercase tracking-widest text-[10px] italic border-b border-black/[0.03] pb-6">Low Stock Alarms</h4>
                 <div className="space-y-6">
                    {[
                       { name: 'Paracetamol 500mg', stock: '8 units' },
                       { name: 'Cetirizine 10mg', stock: '5 units' }
                    ].map(item => (
                       <div key={item.name} className="flex items-center justify-between group">
                          <div className="flex items-center gap-4">
                             <div className="h-12 w-12 bg-red-50 text-red-500 rounded-xl flex items-center justify-center animate-pulse"><Pill size={20}/></div>
                             <div className="space-y-0.5">
                                <div className="font-syne font-black text-sm text-[#0a1628] italic uppercase leading-none">{item.name}</div>
                                <div className="text-[9px] font-black text-red-400 uppercase tracking-widest">{item.stock} Left</div>
                             </div>
                          </div>
                          <button className="h-10 px-4 bg-[#0a1628] text-brand-teal font-syne font-black text-[8px] uppercase italic tracking-widest rounded-xl hover:scale-105 transition-all">Reorder</button>
                       </div>
                    ))}
                 </div>
              </div>

              <div className="bg-white border border-black/[0.03] rounded-[4rem] p-12 space-y-8 shadow-soft">
                 <h4 className="font-syne font-black text-[#0a1628] uppercase tracking-widest text-[10px] italic border-b border-black/[0.03] pb-6">{t('realTimeChannels')}</h4>
                 <div className="space-y-4">
                    {[
                       { label: t('patientHandover'), status: t('pending'), icon: Phone, color: 'blue' },
                       { label: t('districtAdmin'), status: t('verified'), icon: Activity, color: 'brand-teal' }
                    ].map(chan => (
                       <button key={chan.label} className="w-full h-20 bg-gray-50/50 rounded-[2.5rem] flex items-center justify-between px-8 hover:bg-white hover:shadow-4xl transition-all duration-700 group border border-transparent hover:border-black/[0.03]">
                          <div className="flex items-center gap-6">
                             <div className="h-12 w-12 bg-white rounded-xl flex items-center justify-center text-gray-300 group-hover:bg-[#0a1628] group-hover:text-white shadow-soft transition-all duration-700"><chan.icon size={20}/></div>
                             <div className="text-[10px] font-black uppercase italic tracking-widest text-gray-400 group-hover:text-[#0a1628] transition-colors">{chan.label}</div>
                          </div>
                          <div className={`h-2.5 w-2.5 rounded-full ${chan.color === 'emerald' ? 'bg-emerald-500' : chan.color === 'blue' ? 'bg-blue-500' : 'bg-brand-teal'} shadow-lg`} />
                       </button>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      </div>

      <PrescriptionModal 
         isOpen={isModalOpen} 
         onClose={() => setIsModalOpen(false)} 
         prescription={selectedPrescription} 
         orderId={selectedOrderId} 
      />
    </div>
  );
}
