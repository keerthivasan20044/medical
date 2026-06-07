import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navigation, MapPin, Phone, CheckCircle2, ChevronRight, ShieldCheck, Zap, Store, Box, AlertTriangle, ShieldAlert, ClipboardCheck, Radio, Wifi, WifiOff, Crosshair, Clock3, Gauge, RefreshCw, ExternalLink } from 'lucide-react';
import { useDelivery } from '../../hooks/useDelivery';
import toast from 'react-hot-toast';
import { useLanguage } from '../../context/LanguageContext';
import { deliveryService } from '../../services/apiServices';

const formatCoordinate = (value) => (
  Number.isFinite(value) ? value.toFixed(5) : '--'
);

const formatSpeed = (speed) => {
  if (!Number.isFinite(speed) || speed < 0) return '--';
  return `${Math.round(speed * 3.6)} km/h`;
};

const getElapsedLabel = (date) => {
  if (!date) return 'Not synced';
  const seconds = Math.max(0, Math.floor((Date.now() - new Date(date).getTime()) / 1000));
  if (seconds < 5) return 'Just now';
  if (seconds < 60) return `${seconds}s ago`;
  return `${Math.floor(seconds / 60)}m ago`;
};

const getPhoneValue = (value) => (
  Array.isArray(value) ? value[0] : value
);

const getMapsUrl = (destination) => {
  if (!destination) return null;
  const query = typeof destination === 'string'
    ? destination
    : `${destination.lat},${destination.lng}`;
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}`;
};

export default function DeliveryActive() {
  const { t } = useLanguage();
  const { activeTask, updateStatus, confirmDelivery, resendDeliveryOtp, loading } = useDelivery();
  const [currentStage, setCurrentStage] = useState(1); // Derived from activeTask.deliveryStatus
  const [itemsChecked, setItemsChecked] = useState({});
  const [otp, setOtp] = useState('');
  const [otpAttempts, setOtpAttempts] = useState(0);
  const [isLiveTracking, setIsLiveTracking] = useState(true);
  const [gpsState, setGpsState] = useState({
    status: 'idle',
    coords: null,
    accuracy: null,
    heading: null,
    speed: null,
    lastSyncedAt: null,
    updateCount: 0,
    error: ''
  });

  const publishLocation = async (position) => {
    if (!activeTask?._id) return;

    const payload = {
      orderId: activeTask._id,
      lat: position.coords.latitude,
      lng: position.coords.longitude,
      accuracy: position.coords.accuracy,
      heading: position.coords.heading,
      speed: position.coords.speed,
      eta: 'Live'
    };

    setGpsState((prev) => ({
      ...prev,
      status: 'watching',
      coords: { lat: payload.lat, lng: payload.lng },
      accuracy: payload.accuracy,
      heading: payload.heading,
      speed: payload.speed,
      lastSyncedAt: new Date(),
      updateCount: prev.updateCount + 1,
      error: ''
    }));
    
    try {
      await deliveryService.updateLocation(activeTask._id, payload);
    } catch (err) {
      console.error('GPS update error:', err);
      const errorMsg = err.response?.data?.message || 'GPS update failed';
      setGpsState((prev) => ({ ...prev, error: errorMsg }));
      
      // Retry logic: attempt one retry after 2 seconds
      setTimeout(() => {
        deliveryService.updateLocation(activeTask._id, payload)
          .then(() => {
            setGpsState((prev) => ({ ...prev, error: '' }));
          })
          .catch((retryErr) => {
            console.error('GPS update retry failed:', retryErr);
          });
      }, 2000);
    }
  };

  const requestManualSync = () => {
    if (!navigator.geolocation) {
      setGpsState((prev) => ({ ...prev, status: 'error', error: 'GPS is not available on this device.' }));
      return;
    }

    setGpsState((prev) => ({ ...prev, status: 'syncing', error: '' }));
    navigator.geolocation.getCurrentPosition(
      publishLocation,
      (error) => setGpsState((prev) => ({ ...prev, status: 'error', error: error.message || 'Location permission denied' })),
      { enableHighAccuracy: true, maximumAge: 0, timeout: 12000 }
    );
  };

  useEffect(() => {
    const coordinates = activeTask?.deliveryLocation?.coordinates;
    if (Array.isArray(coordinates) && coordinates.length === 2) {
      setGpsState((prev) => ({
        ...prev,
        coords: { lng: coordinates[0], lat: coordinates[1] },
        lastSyncedAt: activeTask.updatedAt || prev.lastSyncedAt
      }));
    }
  }, [activeTask]);

  // Real-time location stream during Stage 3 (In Transit)
  useEffect(() => {
    if (currentStage !== 3 || !activeTask || !isLiveTracking) return;
    if (!navigator.geolocation) {
      setGpsState({ status: 'error', coords: null, error: 'GPS is not available on this device.' });
      return;
    }

    setGpsState((prev) => ({ ...prev, status: 'watching', error: '' }));
    let lastSentAt = 0;

    const watchId = navigator.geolocation.watchPosition(
      async (position) => {
        const now = Date.now();
        if (now - lastSentAt < 4000) return;
        lastSentAt = now;
        await publishLocation(position);
      },
      (error) => {
        setGpsState((prev) => ({ ...prev, status: 'error', error: error.message || 'Location permission denied' }));
      },
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 12000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [currentStage, activeTask, isLiveTracking]);

  useEffect(() => {
    if (activeTask) {
      const statusMap = {
        'accepted': 1,
        'pickup_started': 1,
        'at_pickup': 2,
        'out_for_delivery': 3,
        'arrived': 4
      };
      setCurrentStage(statusMap[activeTask.deliveryStatus] || 1);
    }
  }, [activeTask]);

  if (!activeTask) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-8">
        <div className="h-24 w-24 bg-navy/5 rounded-[3rem] flex items-center justify-center text-navy/10 animate-pulse">
           <Zap size={48} />
        </div>
        <div className="space-y-2">
           <h2 className="font-syne font-black text-2xl text-navy uppercase italic">No Active Delivery</h2>
           <p className="text-xs font-dm font-bold text-navy/40 uppercase tracking-widest italic">Check available orders to start a delivery.</p>
        </div>
      </div>
    );
  }

  const handleStageTransition = async () => {
    try {
      if (currentStage === 1) await updateStatus(activeTask._id, 'at_pickup');
      if (currentStage === 2) {
        const allChecked = activeTask.items.every((_, i) => itemsChecked[i]);
        if (!allChecked) return toast.error('Please verify all items first');
        await updateStatus(activeTask._id, 'out_for_delivery');
      }
      if (currentStage === 3) await updateStatus(activeTask._id, 'arrived');
      if (currentStage === 4) {
        if (!/^\d{6}$/.test(otp.trim())) return toast.error('Enter the 6 digit verification code');
        setOtpAttempts((value) => value + 1);
        await confirmDelivery(activeTask._id, otp);
      }
    } catch (err) {
      // Error handled in hook
    }
  };

  const handleResendOtp = async () => {
    if (!activeTask?._id) return;
    await resendDeliveryOtp(activeTask._id);
  };

  const handleOtpPaste = (event) => {
    const text = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (text) {
      event.preventDefault();
      setOtp(text);
    }
  };

  const handleClientUnreachable = async () => {
    if (!activeTask?._id) return;
    await updateStatus(activeTask._id, 'arrived', { issue: 'client_unreachable' });
    toast('Marked as waiting at destination. Try calling the customer before retrying OTP.', { icon: '!' });
  };

  const handleReportDisruption = async () => {
    if (!activeTask?._id) return;
    try {
      setOtp('');
      setItemsChecked({});
      await deliveryService.reportDisruption(activeTask._id, {
        stage: currentStage,
        status: activeTask.deliveryStatus
      });
      toast.success('Disruption reported. Please contact support.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to report disruption');
    }
  };

  const pharmacyPhone = getPhoneValue(activeTask.pharmacyId?.phone);
  const customerPhone = activeTask.customerId?.phone;
  const pharmacyMapsUrl = getMapsUrl(activeTask.pharmacyId?.address || activeTask.pharmacyId?.name);
  const customerMapsUrl = getMapsUrl(activeTask.deliveryAddress);
  const trackingIsActive = currentStage === 3 && isLiveTracking;

  const STAGES = [
    { id: 1, label: 'Go to Pickup', icon: Store, description: 'Go to address' },
    { id: 2, label: 'At Pickup', icon: Box, description: 'Verify payload' },
    { id: 3, label: 'On the Way', icon: Navigation, description: 'Heading to customer' },
    { id: 4, label: 'Customer Delivery', icon: CheckCircle2, description: 'OTP confirmation' },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-24">
      {/* Progress Matrix */}
      <div className="bg-white border-b border-gray-100 p-6 md:p-8 sticky top-0 z-40 shadow-sm">
         <div className="max-w-4xl mx-auto flex items-center justify-between">
            {STAGES.map((stage, idx) => (
              <div key={stage.id} className="flex flex-col items-center gap-2 relative z-10 flex-1">
                 <div className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                   currentStage >= stage.id ? 'bg-navy text-brand-teal shadow-xl shadow-navy/20' : 'bg-gray-100 text-navy/20'
                 }`}>
                    <stage.icon size={20} />
                 </div>
                 <div className="hidden md:block text-center">
                    <div className={`text-[9px] font-black uppercase tracking-widest italic leading-none ${
                      currentStage >= stage.id ? 'text-navy' : 'text-navy/20'
                    }`}>{stage.label}</div>
                 </div>
                 {idx < STAGES.length - 1 && (
                    <div className={`absolute left-[50%] top-6 w-full h-0.5 -z-10 ${
                      currentStage > stage.id ? 'bg-brand-teal' : 'bg-gray-100'
                    }`} />
                 )}
              </div>
            ))}
         </div>
      </div>

      <div className="max-w-4xl mx-auto p-6 md:p-10 space-y-10">
         {/* Dynamic Content based on Stage */}
         <AnimatePresence mode="wait">
            <motion.div
              key={currentStage}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
               {/* STAGE 1: NAVIGATION TO NODE */}
               {currentStage === 1 && (
                 <div className="space-y-8">
                    <div className="bg-white p-10 rounded-[3.5rem] border border-gray-100 shadow-sm relative overflow-hidden">
                       <div className="absolute top-0 right-0 h-40 w-40 bg-navy/5 rounded-full blur-[80px]" />
                       <div className="flex flex-col md:flex-row items-start justify-between gap-8 relative z-10">
                          <div className="space-y-4 flex-1">
                             <div className="h-16 w-16 bg-navy text-brand-teal rounded-3xl flex items-center justify-center shadow-2xl border-4 border-white">
                                <Store size={32} />
                             </div>
                             <div>
                                <h2 className="font-syne font-black text-3xl text-navy uppercase italic">{activeTask.pharmacyId?.name || 'Pharmacy'}</h2>
                                <p className="text-sm font-dm font-bold text-navy/40 italic mt-1 leading-relaxed max-w-md">{activeTask.pharmacyId?.address || 'Karaikal Central'}</p>
                             </div>
                             <div className="flex items-center gap-4 pt-2">
                                <div className="px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-[10px] font-black text-navy/60 uppercase tracking-widest italic">2.4km Away</div>
                                <div className="px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-[10px] font-black text-navy/60 uppercase tracking-widest italic">8 min Est.</div>
                             </div>
                          </div>
                          <div className="flex flex-col gap-3 w-full md:w-auto">
                             <a
                               href={pharmacyMapsUrl || '#'}
                               target="_blank"
                               rel="noreferrer"
                               className="h-14 px-8 bg-navy text-brand-teal rounded-2xl font-syne font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:scale-105 transition-all shadow-xl shadow-navy/20"
                             >
                                <Navigation size={20} /> Launch Navigation
                             </a>
                             <a
                               href={pharmacyPhone ? `tel:${pharmacyPhone}` : '#'}
                               className={`h-14 px-8 bg-white border border-navy/10 text-navy rounded-2xl font-syne font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-navy hover:text-white transition-all shadow-sm ${!pharmacyPhone ? 'pointer-events-none opacity-50' : ''}`}
                             >
                                <Phone size={20} /> Call Pharmacy
                             </a>
                          </div>
                       </div>
                    </div>
                 </div>
               )}

               {/* STAGE 2: AT PICKUP / ITEM VERIFICATION */}
               {currentStage === 2 && (
                 <div className="space-y-8">
                    <div className="bg-white p-10 rounded-[3.5rem] border border-gray-100 shadow-sm space-y-10">
                       <div className="flex items-center justify-between pb-8 border-b border-gray-50">
                          <div>
                             <h2 className="font-syne font-black text-2xl text-navy uppercase italic">Check Items</h2>
                             <p className="text-[10px] font-black text-navy/40 uppercase tracking-widest italic mt-1">Confirmed {Object.keys(itemsChecked).length} of {activeTask.items.length} items</p>
                          </div>
                          <Box size={32} className="text-brand-teal animate-bounce-slow" />
                       </div>
                       
                       <div className="space-y-4">
                          {activeTask.items.map((item, idx) => (
                            <div 
                              key={idx} 
                              onClick={() => setItemsChecked(p => ({ ...p, [idx]: !p[idx] }))}
                              className={`p-6 rounded-3xl border transition-all cursor-pointer flex items-center justify-between group ${
                                itemsChecked[idx] ? 'bg-emerald-50 border-emerald-100' : 'bg-gray-50 border-gray-100 hover:border-brand-teal'
                              }`}
                            >
                               <div className="flex items-center gap-4">
                                  <div className={`h-10 w-10 rounded-xl flex items-center justify-center transition-all ${
                                    itemsChecked[idx] ? 'bg-emerald-500 text-white shadow-lg' : 'bg-white text-navy/20'
                                  }`}>
                                     {itemsChecked[idx] ? <CheckCircle2 size={20} /> : <div className="h-2 w-2 rounded-full bg-navy/10" />}
                                  </div>
                                  <div>
                                     <div className={`font-dm font-black text-sm italic transition-all ${itemsChecked[idx] ? 'text-emerald-700' : 'text-navy'}`}>{item.medicine?.name || 'Medicine'}</div>
                                     <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest italic">Quantity: {item.quantity}</div>
                                  </div>
                               </div>
                               <ChevronRight size={18} className={`transition-all ${itemsChecked[idx] ? 'text-emerald-300' : 'text-navy/10'}`} />
                            </div>
                          ))}
                       </div>

                       <div className="p-6 bg-amber-50 border border-amber-100 rounded-3xl flex gap-4">
                          <AlertTriangle size={24} className="text-amber-500 shrink-0" />
                          <p className="text-xs font-dm font-bold text-amber-700/80 leading-relaxed italic">
                             Check every medicine before pickup. Report any missing or wrong item immediately.
                          </p>
                       </div>
                    </div>
                 </div>
               )}

               {/* STAGE 3: IN TRANSIT */}
               {currentStage === 3 && (
                 <div className="space-y-8">
                    <div className="bg-navy p-10 rounded-[3.5rem] border border-white/10 shadow-2xl relative overflow-hidden">
                       <div className="absolute top-0 right-0 h-40 w-40 bg-brand-teal/20 rounded-full blur-[80px]" />
                       <div className="flex flex-col md:flex-row items-start justify-between gap-8 relative z-10 text-white">
                          <div className="space-y-4 flex-1">
                             <div className="h-16 w-16 bg-brand-teal text-navy rounded-3xl flex items-center justify-center shadow-2xl border-4 border-navy">
                                <MapPin size={32} />
                             </div>
                             <div>
                                <h2 className="font-syne font-black text-3xl uppercase italic">Heading to Client</h2>
                                <p className="text-sm font-dm font-bold text-white/40 italic mt-1 leading-relaxed max-w-md">{activeTask.deliveryAddress || 'Customer address'}</p>
                             </div>
                          </div>
                          <div className="flex flex-col gap-3 w-full md:w-auto">
                             <a
                               href={customerMapsUrl || '#'}
                               target="_blank"
                               rel="noreferrer"
                               className="h-14 px-8 bg-brand-teal text-navy rounded-2xl font-syne font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:scale-105 transition-all shadow-xl shadow-brand-teal/20"
                             >
                                <Navigation size={20} /> Navigation
                             </a>
                             <a
                               href={customerPhone ? `tel:${customerPhone}` : '#'}
                               className={`h-14 px-8 bg-white/10 border border-white/10 text-white rounded-2xl font-syne font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-white/20 transition-all ${!customerPhone ? 'pointer-events-none opacity-50' : ''}`}
                             >
                                <Phone size={20} /> Call Client
                             </a>
                          </div>
                       </div>
                    </div>

                    <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                       <div className="p-6 md:p-8 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-5">
                          <div className="flex items-center gap-4 min-w-0">
                             <div className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-all ${trackingIsActive ? 'bg-emerald-50 text-emerald-500' : 'bg-gray-50 text-gray-300'}`}>
                                {trackingIsActive ? <Wifi size={24} /> : <WifiOff size={24} />}
                             </div>
                             <div className="min-w-0">
                                <div className="text-[10px] font-black text-navy/40 uppercase tracking-widest italic">Active GPS Delivery Session</div>
                                <div className="text-sm font-dm font-bold text-navy italic truncate">
                                  {trackingIsActive ? (gpsState.coords ? 'Customer, pharmacy, and admin receive live updates' : 'Waiting for GPS permission') : 'Tracking suspended'}
                                </div>
                                {gpsState.error && (
                                  <div className="text-[10px] font-bold text-red-500 mt-1">{gpsState.error}</div>
                                )}
                             </div>
                          </div>
                          <div className="flex items-center gap-3">
                             <button
                               onClick={requestManualSync}
                               disabled={!isLiveTracking}
                               className="h-10 px-4 rounded-xl border border-navy/10 text-navy font-syne font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-gray-50 disabled:opacity-40 disabled:pointer-events-none"
                             >
                                <RefreshCw size={15} className={gpsState.status === 'syncing' ? 'animate-spin' : ''} /> Sync
                             </button>
                             <button
                               onClick={() => setIsLiveTracking(!isLiveTracking)}
                               className={`w-14 h-8 rounded-full transition-all relative ${isLiveTracking ? 'bg-emerald-500' : 'bg-gray-200'}`}
                               aria-label="Toggle live GPS tracking"
                             >
                                <motion.div
                                  animate={{ x: isLiveTracking ? 24 : 4 }}
                                  className="absolute top-1 left-0 h-6 w-6 bg-white rounded-full shadow-sm"
                                />
                             </button>
                          </div>
                       </div>

                       <div className="p-6 md:p-8 grid md:grid-cols-[1.1fr_0.9fr] gap-6">
                          <div className="relative min-h-[260px] rounded-[2rem] overflow-hidden bg-[#07111f] border border-navy/10">
                             <div className="absolute inset-0 opacity-35 bg-[linear-gradient(90deg,rgba(255,255,255,.12)_1px,transparent_1px),linear-gradient(0deg,rgba(255,255,255,.12)_1px,transparent_1px)] bg-[size:42px_42px]" />
                             <div className="absolute inset-0 bg-[radial-gradient(circle_at_35%_45%,rgba(45,212,191,.24),transparent_28%),radial-gradient(circle_at_70%_20%,rgba(255,255,255,.12),transparent_22%)]" />
                             <div className="absolute left-8 right-8 top-1/2 h-1 bg-brand-teal/70 rounded-full shadow-[0_0_28px_rgba(45,212,191,.6)]" />
                             <div className="absolute left-1/2 top-10 bottom-10 w-1 bg-white/20 rounded-full" />
                             <motion.div
                               animate={{ scale: trackingIsActive ? [1, 1.18, 1] : 1 }}
                               transition={{ duration: 1.8, repeat: trackingIsActive ? Infinity : 0 }}
                               className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-teal/20 flex items-center justify-center"
                             >
                                <div className="h-9 w-9 rounded-full bg-brand-teal text-navy flex items-center justify-center shadow-2xl">
                                   <Radio size={18} />
                                </div>
                             </motion.div>
                             <div className="absolute left-5 top-5 px-4 py-2 rounded-2xl bg-white/10 backdrop-blur text-white">
                                <div className="text-[8px] font-black uppercase tracking-widest text-white/50">Destination</div>
                                <div className="text-xs font-dm font-black truncate max-w-[220px]">{activeTask.deliveryAddress || 'Customer address'}</div>
                             </div>
                             <a
                               href={customerMapsUrl || '#'}
                               target="_blank"
                               rel="noreferrer"
                               className="absolute right-5 bottom-5 h-10 px-4 rounded-xl bg-white text-navy font-syne font-black text-[10px] uppercase tracking-widest flex items-center gap-2"
                             >
                                <ExternalLink size={14} /> Maps
                             </a>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                             <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                                <Crosshair size={18} className="text-brand-teal mb-3" />
                                <div className="text-[8px] font-black text-navy/30 uppercase tracking-widest">Coordinates</div>
                                <div className="text-xs font-dm font-black text-navy mt-1 break-words">
                                  {formatCoordinate(gpsState.coords?.lat)}, {formatCoordinate(gpsState.coords?.lng)}
                                </div>
                             </div>
                             <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                                <ShieldCheck size={18} className="text-brand-teal mb-3" />
                                <div className="text-[8px] font-black text-navy/30 uppercase tracking-widest">Accuracy</div>
                                <div className="text-xs font-dm font-black text-navy mt-1">{Number.isFinite(gpsState.accuracy) ? `${Math.round(gpsState.accuracy)} m` : '--'}</div>
                             </div>
                             <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                                <Gauge size={18} className="text-brand-teal mb-3" />
                                <div className="text-[8px] font-black text-navy/30 uppercase tracking-widest">Speed</div>
                                <div className="text-xs font-dm font-black text-navy mt-1">{formatSpeed(gpsState.speed)}</div>
                             </div>
                             <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                                <Clock3 size={18} className="text-brand-teal mb-3" />
                                <div className="text-[8px] font-black text-navy/30 uppercase tracking-widest">Last Sync</div>
                                <div className="text-xs font-dm font-black text-navy mt-1">{getElapsedLabel(gpsState.lastSyncedAt)}</div>
                             </div>
                             <div className="col-span-2 p-4 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-between">
                                <div>
                                   <div className="text-[8px] font-black text-emerald-700/50 uppercase tracking-widest">Broadcast Count</div>
                                   <div className="text-sm font-dm font-black text-emerald-800">{gpsState.updateCount} location update(s)</div>
                                </div>
                                <div className={`h-3 w-3 rounded-full ${trackingIsActive ? 'bg-emerald-500 animate-pulse' : 'bg-gray-300'}`} />
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>
               )}

               {/* STAGE 4: ARRIVED / OTP VERIFICATION */}
               {currentStage === 4 && (
                 <div className="space-y-8">
                    <div className="bg-white p-10 rounded-[3.5rem] border border-gray-100 shadow-sm space-y-12">
                       <div className="text-center space-y-4">
                          <div className="h-20 w-20 bg-brand-teal/10 text-brand-teal rounded-[2rem] flex items-center justify-center mx-auto shadow-sm">
                             <ShieldAlert size={40} />
                          </div>
                          <h2 className="font-syne font-black text-3xl text-navy uppercase italic">Confirm Delivery</h2>
                          <p className="text-xs font-dm font-bold text-navy/40 uppercase tracking-widest italic">Enter the 6 digit code from the customer's app or SMS</p>
                       </div>

                       <div className="grid md:grid-cols-3 gap-3">
                          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center gap-3">
                             <Phone size={18} className="text-brand-teal shrink-0" />
                             <div className="min-w-0">
                                <div className="text-[8px] font-black text-navy/30 uppercase tracking-widest">Customer</div>
                                <div className="text-xs font-dm font-black text-navy truncate">{activeTask.customerId?.name || 'Customer'}</div>
                             </div>
                          </div>
                          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center gap-3">
                             <ClipboardCheck size={18} className="text-brand-teal shrink-0" />
                             <div>
                                <div className="text-[8px] font-black text-navy/30 uppercase tracking-widest">Attempts</div>
                                <div className="text-xs font-dm font-black text-navy">{(activeTask.deliveryOtpAttempts || 0) + otpAttempts}</div>
                             </div>
                          </div>
                          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 text-[10px] font-dm font-bold text-amber-700 italic">
                             Verify the package is handed over before asking for the OTP.
                          </div>
                       </div>

                       <div className="flex justify-center">
                          <input 
                            type="text" 
                            maxLength={6} 
                            inputMode="numeric"
                            placeholder="000000"
                            value={otp}
                            onPaste={handleOtpPaste}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                            className="w-full max-w-[340px] h-24 bg-gray-50 border-2 border-gray-100 rounded-[2.5rem] text-center text-5xl font-syne font-black tracking-[0.5em] text-navy outline-none focus:border-brand-teal focus:ring-8 focus:ring-brand-teal/5 transition-all placeholder:text-navy/5"
                          />
                       </div>

                       <div className="pt-6 flex flex-col md:flex-row items-center gap-4">
                          <button
                            onClick={handleClientUnreachable}
                            disabled={loading}
                            className="w-full h-14 border-2 border-navy/5 text-navy/40 rounded-2xl font-syne font-black text-[10px] uppercase tracking-widest hover:border-red-500 hover:text-red-500 transition-all disabled:opacity-50"
                          >
                             Client Unreachable
                          </button>
                          <button
                            onClick={handleResendOtp}
                            disabled={loading}
                            className="w-full h-14 border-2 border-navy/5 text-navy/40 rounded-2xl font-syne font-black text-[10px] uppercase tracking-widest hover:bg-gray-50 transition-all disabled:opacity-50"
                          >
                             Resend Code
                          </button>
                       </div>
                    </div>
                 </div>
               )}
            </motion.div>
         </AnimatePresence>

         {/* Persistent Bottom Action */}
         <div className="fixed bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-100 z-50 flex items-center justify-center">
            <div className="max-w-4xl w-full flex flex-col md:flex-row items-center gap-4">
               <button
                 onClick={handleReportDisruption}
                 className="w-full md:w-auto h-16 px-10 border-2 border-navy/10 text-navy rounded-2xl font-syne font-black text-xs uppercase tracking-widest hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all disabled:opacity-50"
                 disabled={loading}
               >
                  Report Disruption
               </button>
               <button 
                 onClick={handleStageTransition}
                 disabled={loading}
                 className="flex-1 h-16 bg-navy text-white rounded-2xl font-syne font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl shadow-navy/20 disabled:opacity-50"
               >
                  {loading ? (
                    <div className="h-5 w-5 border-2 border-brand-teal border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                       {currentStage === 1 && 'Arrived at Pharmacy'}
                       {currentStage === 2 && 'Items Checked'}
                       {currentStage === 3 && 'Arrived at Destination'}
                       {currentStage === 4 && 'Confirm Delivery'}
                       <ChevronRight size={20} className="text-brand-teal" />
                    </>
                  )}
               </button>
            </div>
         </div>
      </div>
    </div>
  );
}
