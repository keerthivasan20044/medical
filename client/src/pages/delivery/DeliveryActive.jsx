import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navigation, MapPin, Phone, MessageSquare, CheckCircle2, ChevronRight, ShieldCheck, Zap, Store, Box, AlertTriangle, ShieldAlert } from 'lucide-react';
import { useDelivery } from '../../hooks/useDelivery';
import toast from 'react-hot-toast';

export default function DeliveryActive() {
  const { activeTask, updateStatus, confirmDelivery, loading } = useDelivery();
  const [currentStage, setCurrentStage] = useState(1); // Derived from activeTask.deliveryStatus
  const [itemsChecked, setItemsChecked] = useState({});
  const [otp, setOtp] = useState('');
  const [isLiveTracking, setIsLiveTracking] = useState(true);

  // Real-time location stream during Stage 3 (In Transit)
  useEffect(() => {
    let interval;
    if (currentStage === 3 && activeTask && isLiveTracking) {
      interval = setInterval(() => {
        // Mocking location updates for demo
        const lat = 10.9254 + (Math.random() - 0.5) * 0.001;
        const lng = 79.8383 + (Math.random() - 0.5) * 0.001;
        
        import('../../services/socket').then(({ socketService }) => {
          socketService.emit('location:update', { 
            orderId: activeTask._id, 
            lat, 
            lng 
          });
        });
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [currentStage, activeTask]);

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
           <h2 className="font-syne font-black text-2xl text-navy uppercase italic">No Active Mission</h2>
           <p className="text-xs font-dm font-bold text-navy/40 uppercase tracking-widest italic">Check available tasks to begin operations.</p>
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
        if (otp.length < 4) return toast.error('Enter verification code');
        await confirmDelivery(activeTask._id, otp);
      }
    } catch (err) {
      // Error handled in hook
    }
  };

  const STAGES = [
    { id: 1, label: 'Go to Pickup', icon: Store, description: 'Navigate to node' },
    { id: 2, label: 'At Pickup', icon: Box, description: 'Verify payload' },
    { id: 3, label: 'Regional Transit', icon: Navigation, description: 'Inbound to client' },
    { id: 4, label: 'Client Delivery', icon: CheckCircle2, description: 'Finality verification' },
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
                                <h2 className="font-syne font-black text-3xl text-navy uppercase italic">{activeTask.pharmacyId?.name || 'Pharmacy Node'}</h2>
                                <p className="text-sm font-dm font-bold text-navy/40 italic mt-1 leading-relaxed max-w-md">{activeTask.pharmacyId?.address || 'Karaikal Central'}</p>
                             </div>
                             <div className="flex items-center gap-4 pt-2">
                                <div className="px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-[10px] font-black text-navy/60 uppercase tracking-widest italic">2.4km Away</div>
                                <div className="px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-[10px] font-black text-navy/60 uppercase tracking-widest italic">8 min Est.</div>
                             </div>
                          </div>
                          <div className="flex flex-col gap-3 w-full md:w-auto">
                             <button className="h-14 px-8 bg-navy text-brand-teal rounded-2xl font-syne font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:scale-105 transition-all shadow-xl shadow-navy/20">
                                <Navigation size={20} /> Launch Navigation
                             </button>
                             <button className="h-14 px-8 bg-white border border-navy/10 text-navy rounded-2xl font-syne font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-navy hover:text-white transition-all shadow-sm">
                                <Phone size={20} /> Call Node
                             </button>
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
                             <h2 className="font-syne font-black text-2xl text-navy uppercase italic">Payload Verification</h2>
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
                             Ensure storage integrity. Scheduled medicines must match prescription registry. Report discrepancies immediately.
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
                                <p className="text-sm font-dm font-bold text-white/40 italic mt-1 leading-relaxed max-w-md">{activeTask.deliveryAddress || 'Sector 4, Nagore Road'}</p>
                             </div>
                          </div>
                          <div className="flex flex-col gap-3 w-full md:w-auto">
                             <button className="h-14 px-8 bg-brand-teal text-navy rounded-2xl font-syne font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:scale-105 transition-all shadow-xl shadow-brand-teal/20">
                                <Navigation size={20} /> Navigation
                             </button>
                             <button className="h-14 px-8 bg-white/10 border border-white/10 text-white rounded-2xl font-syne font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-white/20 transition-all">
                                <Phone size={20} /> Call Client
                             </button>
                          </div>
                       </div>
                    </div>

                    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex items-center justify-between">
                       <div className="flex items-center gap-4">
                          <div className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-all ${isLiveTracking ? 'bg-emerald-50 text-emerald-500' : 'bg-gray-50 text-gray-300'}`}>
                             <ShieldCheck size={24} />
                          </div>
                          <div>
                             <div className="text-[10px] font-black text-navy/40 uppercase tracking-widest italic">Live Guard Sync</div>
                             <div className="text-sm font-dm font-bold text-navy italic">{isLiveTracking ? 'Customer is tracking you' : 'Tracking suspended'}</div>
                          </div>
                       </div>
                       <button 
                         onClick={() => setIsLiveTracking(!isLiveTracking)}
                         className={`w-14 h-8 rounded-full transition-all relative ${isLiveTracking ? 'bg-emerald-500' : 'bg-gray-200'}`}
                       >
                          <motion.div 
                            animate={{ x: isLiveTracking ? 24 : 4 }}
                            className="absolute top-1 left-0 h-6 w-6 bg-white rounded-full shadow-sm"
                          />
                       </button>
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
                          <h2 className="font-syne font-black text-3xl text-navy uppercase italic">Final Verification</h2>
                          <p className="text-xs font-dm font-bold text-navy/40 uppercase tracking-widest italic">Enter the unique protocol code from the client's app</p>
                       </div>

                       <div className="flex justify-center">
                          <input 
                            type="text" 
                            maxLength={6} 
                            placeholder="••••••"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className="w-full max-w-[340px] h-24 bg-gray-50 border-2 border-gray-100 rounded-[2.5rem] text-center text-5xl font-syne font-black tracking-[0.5em] text-navy outline-none focus:border-brand-teal focus:ring-8 focus:ring-brand-teal/5 transition-all placeholder:text-navy/5"
                          />
                       </div>

                       <div className="pt-6 flex flex-col md:flex-row items-center gap-4">
                          <button className="w-full h-14 border-2 border-navy/5 text-navy/40 rounded-2xl font-syne font-black text-[10px] uppercase tracking-widest hover:border-red-500 hover:text-red-500 transition-all">
                             Client Unreachable
                          </button>
                          <button className="w-full h-14 border-2 border-navy/5 text-navy/40 rounded-2xl font-syne font-black text-[10px] uppercase tracking-widest hover:bg-gray-50 transition-all">
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
               <button className="w-full md:w-auto h-16 px-10 border-2 border-navy/10 text-navy rounded-2xl font-syne font-black text-xs uppercase tracking-widest hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all">
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
                       {currentStage === 2 && 'Payload Synchronized'}
                       {currentStage === 3 && 'Arrived at Destination'}
                       {currentStage === 4 && 'Confirm Finality Protocol'}
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
