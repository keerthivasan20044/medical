import { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import {
  BadgeCheck, CheckCircle, Home, MessageCircle, Package,
  Phone, Pill, Truck, ArrowLeft, ShieldCheck, Star, Activity, Clock3
} from 'lucide-react';
import { useOrderTracking } from '../../hooks/useOrderTracking.js';
import { cancelOrder } from '../../store/ordersSlice.js';
import { useLanguage } from '../../context/LanguageContext';
import LiveDeliveryMap from '../../components/maps/LiveDeliveryMap.jsx';

const STEPS = [
  { key: 'placed', label: 'Placed', icon: Package },
  { key: 'confirmed', label: 'Confirmed', icon: BadgeCheck },
  { key: 'preparing', label: 'Preparing', icon: Pill },
  { key: 'on way', label: 'On Way', icon: Truck },
  { key: 'delivered', label: 'Delivered', icon: Home }
];

export default function TrackingPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { t } = useLanguage();
  const { location: realLocation, eta, statusText, order } = useOrderTracking(id || '');

  const currentStep = useMemo(() => {
    const normalized = (statusText || '').toLowerCase();
    if (normalized.includes('delivered')) return 4;
    if (normalized.includes('delivery') || normalized.includes('transit') || normalized.includes('arrived') || normalized.includes('dispatch')) return 3;
    if (normalized.includes('prepare')) return 2;
    if (normalized.includes('confirm')) return 1;
    return 0;
  }, [statusText]);

  const canCancel = ['pending', 'confirmed', 'preparing'].includes((order?.status || statusText || '').toLowerCase());
  const partnerName = order?.deliveryPartner?.name || 'Delivery Partner';
  const partnerPhone = order?.deliveryPartner?.phone || '9876543210';
  const otpCode = order?.otp || '------';

  const handleCancel = async () => {
    if (!id || !window.confirm('Cancel this order?')) return;
    const result = await dispatch(cancelOrder(id));
    if (result.meta.requestStatus !== 'fulfilled') {
      window.alert(result.payload || 'Failed to cancel order');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-white overflow-x-hidden flex flex-col">
      
      {/* Full-width Satellite Map Interface */}
      <section className="relative h-[18rem] md:h-[19rem] w-full overflow-hidden shrink-0 bg-[#0a1628]">
        <LiveDeliveryMap
          className="h-full w-full"
          driverLocation={realLocation}
          pharmacyLocation={order?.pharmacy?.location?.coordinates ? {
            lng: order.pharmacy.location.coordinates[0],
            lat: order.pharmacy.location.coordinates[1]
          } : null}
          deliveryLocation={order?.deliveryAddress?.coordinates ? order.deliveryAddress.coordinates : null}
        />

        {/* Floating Controls */}
        <div className="absolute left-4 bottom-4 z-40 md:left-6">
           <Link to="/orders" aria-label="Back to orders" className="h-11 w-11 bg-white/10 border border-white/10 rounded-xl flex items-center justify-center text-white backdrop-blur hover:bg-white hover:text-[#0a1628] transition shadow-2xl">
              <ArrowLeft size={20} />
           </Link>
        </div>
      </section>

      {/* Live Status Card */}
      <motion.section 
        initial={{ y: 100 }} animate={{ y: 0 }}
        className="bg-white text-[#0a1628] rounded-t-[1.75rem] md:rounded-t-[2rem] flex-1 px-4 py-5 md:px-8 md:py-8 relative z-30 shadow-4xl border-t border-gray-100 -mt-5"
      >
         <div className="mx-auto max-w-6xl space-y-7">
            
            {/* Live Driver Header */}
            <div className="flex flex-col xl:flex-row gap-5 xl:items-center justify-between border-b border-gray-100 pb-6">
               <div className="flex items-center gap-4 min-w-0">
                  <div className="relative shrink-0">
                     <div className="h-14 w-14 md:h-16 md:w-16 bg-gray-100 rounded-2xl overflow-hidden border-2 md:border-4 border-white shadow-xl">
                        <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(partnerName)}&background=028090&color=fff`} alt="" className="h-full w-full object-cover" />
                     </div>
                     <div className="absolute -bottom-1 -right-1 h-6 w-6 bg-emerald-500 border-2 border-white rounded-full flex items-center justify-center text-white"><CheckCircle size={12}/></div>
                  </div>
                  <div className="space-y-1 min-w-0">
                     <div className="text-[10px] font-black text-brand-teal uppercase tracking-[0.16em]">Delivery Partner</div>
                     <h2 className="font-syne font-black text-xl md:text-3xl uppercase leading-tight truncate">{partnerName}</h2>
                     <div className="flex items-center gap-2 md:gap-4 min-w-0">
                        <div className="flex text-amber-500 gap-0.5"><Star size={10} fill="currentColor"/><Star size={10} fill="currentColor"/><Star size={10} fill="currentColor"/><Star size={10} fill="currentColor"/><Star size={10} fill="currentColor"/></div>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.14em] truncate">PY-01-AX-4829</span>
                     </div>
                  </div>
               </div>

               <div className="grid grid-cols-[1fr_auto] items-center gap-4 xl:flex xl:justify-end md:gap-5">
                  <div className="rounded-2xl bg-slate-50 border border-slate-100 px-4 py-3 md:text-right">
                     <div className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.18em] mb-1 leading-none">Arrival</div>
                     <div className="font-syne font-black text-3xl md:text-4xl text-brand-teal leading-none">{eta || '8 min'}</div>
                  </div>
                  <div className="flex gap-2">
                     <a href={`tel:${partnerPhone}`} aria-label="Call delivery partner" className="h-12 w-12 bg-[#0a1628] rounded-xl flex items-center justify-center text-brand-teal shadow-4xl hover:bg-brand-teal hover:text-white transition-all">
                        <Phone size={20} />
                     </a>
                     <button aria-label="Message delivery partner" className="h-12 w-12 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center text-[#0a1628] hover:bg-[#0a1628] hover:text-white transition-all">
                        <MessageCircle size={20} />
                     </button>
                  </div>
               </div>
            </div>

            {/* Real-time Status Progress */}
            <div className="space-y-5">
               <div className="flex items-center justify-between gap-4">
                  <h4 className="font-syne font-black text-xl md:text-2xl uppercase">Delivery Status</h4>
                  <div className="flex items-center gap-2 text-[10px] font-black text-emerald-500 uppercase tracking-[0.14em] leading-none whitespace-nowrap">
                     <Activity size={14} className="animate-pulse" /> Live Updates
                  </div>
               </div>

               <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
                  {STEPS.map((s, idx) => {
                     const Icon = s.icon;
                     const isDone = idx < currentStep;
                     const isCurrent = idx === currentStep;
                     return (
                        <div key={s.key} className="space-y-3 min-w-0">
                           <div className={`h-12 md:h-14 rounded-2xl flex items-center justify-center relative transition duration-700 ${
                              isDone ? 'bg-[#02C39A] text-white shadow-xl shadow-[#02C39A]/20' : 
                              isCurrent ? 'bg-[#0a1628] text-brand-teal shadow-4xl' : 
                              'bg-gray-100 text-gray-400'
                           }`}>
                              <Icon size={24} />
                              {idx < STEPS.length - 1 && (
                                 <div className={`hidden lg:block absolute left-full top-1/2 -translate-y-1/2 w-full h-1 z-[-1] ${isDone ? 'bg-[#02C39A]' : 'bg-gray-100'}`} />
                              )}
                           </div>
                           <div className={`text-[10px] font-black uppercase text-center tracking-[0.08em] ${isDone || isCurrent ? 'text-[#0a1628]' : 'text-gray-400'}`}>
                              {s.label}
                           </div>
                        </div>
                     );
                  })}
               </div>
            </div>

            <div className="p-5 md:p-6 bg-gray-50 rounded-2xl border border-black/[0.04] flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-5 group overflow-hidden relative">
               <div className="absolute top-0 right-0 h-40 w-40 bg-brand-teal opacity-0 group-hover:opacity-5 rounded-full blur-[80px] transition-opacity" />
               <div className="flex items-center gap-4 min-w-0">
                  <div className="h-12 w-12 md:h-14 md:w-14 bg-white rounded-xl md:rounded-2xl flex items-center justify-center text-brand-teal shadow-soft shrink-0"><ShieldCheck size={24}/></div>
                  <div className="space-y-1 min-w-0">
                     <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.14em]">Delivery OTP</div>
                     <div className="font-syne font-black text-xl md:text-2xl text-[#0a1628] uppercase leading-tight break-words">Code: {otpCode}</div>
                     <p className="text-[10px] md:text-xs font-dm font-bold text-gray-400 mt-2 max-w-md">
                       Share this code with the delivery partner only after you receive your medicines.
                     </p>
                  </div>
               </div>
               <div className="w-full lg:w-auto flex flex-col sm:flex-row lg:flex-col justify-between items-stretch lg:items-end gap-2">
                  <div className="hidden lg:flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.14em] mb-1"><Clock3 size={14} /> Actions</div>
                  {canCancel && (
                    <button
                      onClick={handleCancel}
                      className="w-full md:w-auto h-12 md:h-14 px-6 md:px-8 bg-[#0a1628] text-brand-teal rounded-xl font-syne font-black text-[10px] uppercase tracking-[0.14em] shadow-4xl hover:bg-red-500 hover:text-white transition-all"
                    >
                      Cancel
                    </button>
                  )}
               </div>
            </div>

         </div>
      </motion.section>
    </div>
  );
}
