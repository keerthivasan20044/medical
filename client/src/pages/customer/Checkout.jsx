import { useMemo, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, ArrowRight, CreditCard, Smartphone, 
  Truck, CheckCircle, MapPin, Package, Lock, 
  ChevronRight, ArrowLeft, Info, AlertCircle, Activity, Zap, Globe
} from 'lucide-react';
import { createOrder, confirmPayment, createPaymentIntent } from '../../store/paymentsSlice.js';
import { Button, Input } from '../../components/common/Core';
import { useLanguage } from '../../context/LanguageContext.jsx';

function loadRazorpay() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { items, totalAmount, note, prescription } = useSelector((s) => s.cart);
  const { status } = useSelector((s) => s.payments);
  const [step, setStep] = useState(1);
  const [method, setMethod] = useState('upi');
  const [error, setError] = useState('');

  const needsPrescription = useMemo(() => items.some(i => i.requiresRx), [items]);

  useEffect(() => {
    if (needsPrescription && !prescription) {
      navigate('/cart');
    }
    window.scrollTo(0,0);
  }, [needsPrescription, prescription, navigate, step]);

  const payload = useMemo(() => {
    return {
      items: items.map((i) => ({ medicine: i.id || i._id, qty: i.qty, price: i.price })),
      totalAmount,
      deliveryAddress: '42 Gandhi Nagar, Karaikal',
      paymentMethod: method,
      note,
      prescription
    };
  }, [items, totalAmount, method, note, prescription]);

  const handlePay = async () => {
    setError('');
    const orderRes = await dispatch(createOrder(payload));
    if (orderRes.meta.requestStatus !== 'fulfilled') {
      setError(t('enclaveCreationFailed'));
      return;
    }

    const orderId = orderRes.payload._id || orderRes.payload.id;

    if (method === 'cod') {
      const confirm = await dispatch(confirmPayment({ orderId, method }));
      return confirm.meta.requestStatus === 'fulfilled' ? navigate('/checkout/success') : setError(t('protocolConfirmationFailed'));
    }

    const ok = await loadRazorpay();
    if (!ok) return setError(t('satellitePaymentNodeOffline'));

    const intentRes = await dispatch(createPaymentIntent({ orderId, method }));
    if (intentRes.meta.requestStatus !== 'fulfilled') return setError(t('paymentIntentFailed'));

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID || '',
      amount: intentRes.payload.amount,
      currency: intentRes.payload.currency,
      name: 'MediReach Enclave',
      description: t('medicalArchitectureProcurement'),
      order_id: intentRes.payload.id,
      handler: async (response) => {
        const confirm = await dispatch(confirmPayment({
          orderId,
          method,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_signature: response.razorpay_signature
        }));
        return confirm.meta.requestStatus === 'fulfilled' ? navigate('/checkout/success') : setError(t('nodeSyncFailed'));
      },
      prefill: { name: 'User', email: 'user@karaikal.in', contact: '9876543210' },
      theme: { color: '#028090' }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-64 pt-20 md:pt-24">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="grid lg:grid-cols-[1.3fr_1fr] gap-12 md:gap-20 items-start">
          
          {/* Main Flow Section */}
          <div className="space-y-10 md:space-y-16">
             <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 md:gap-10">
                <div className="space-y-4 md:space-y-6">
                   <div className="px-5 py-2 bg-[#0a1628] rounded-xl w-fit flex items-center gap-3 text-[9px] md:text-[10px] font-black text-brand-teal uppercase tracking-[0.4em] italic">
                      <Zap size={14} className="text-amber-500 animate-pulse" /> {t('transactionProtocol')}
                   </div>
                   <h1 className="font-syne font-black text-4xl md:text-7xl lg:text-8xl text-[#0a1628] leading-[0.85] tracking-tighter uppercase italic">
                      {t('order')} <br/><span className="text-brand-teal">{t('synchronization')}</span>
                   </h1>
                </div>
                <div className="flex items-center gap-4 bg-white border border-black/[0.03] p-2 md:p-3 rounded-2xl md:rounded-[2.5rem] shadow-soft">
                   {[1, 2].map(s => (
                      <div key={s} className={`h-12 w-16 md:h-14 md:px-8 rounded-xl md:rounded-2xl font-syne font-black text-xs flex items-center justify-center transition-all duration-700 ${step === s ? 'bg-[#0a1628] text-brand-teal shadow-4xl' : 'text-gray-200'}`}>0{s}</div>
                   ))}
                </div>
             </div>

             <AnimatePresence mode="wait">
                {step === 1 ? (
                  <motion.div 
                    key="step-1"
                    initial={{ opacity: 0, x: -20 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-8 md:space-y-12"
                  >
                     <div className="bg-white border border-black/[0.03] rounded-[2rem] md:rounded-[5rem] p-6 md:p-16 space-y-8 md:space-y-12 shadow-4xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 h-40 md:h-64 w-40 md:w-64 bg-brand-teal opacity-[0.02] rounded-full blur-[100px]" />
                        <div className="flex flex-col md:flex-row md:items-center justify-between relative z-10 border-b border-gray-50 pb-6 md:pb-8 gap-4">
                           <div className="flex items-center gap-4 md:gap-6">
                              <div className="h-1.5 w-10 md:w-12 bg-brand-teal rounded-full" />
                              <h2 className="font-syne font-black text-xl md:text-3xl text-[#0a1628] uppercase italic tracking-tighter">{t('shippingEnclave')}</h2>
                           </div>
                        </div>
                        <div className="p-6 md:p-10 bg-gray-50 rounded-[1.8rem] md:rounded-[3.5rem] border border-black/[0.02] flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8 relative z-10">
                           <div className="h-14 w-14 md:h-20 md:w-20 bg-white border border-gray-50 rounded-xl md:rounded-[2rem] flex items-center justify-center text-brand-teal shadow-inner grow-0 shrink-0"><MapPin size={24}/></div>
                           <div className="space-y-1 md:space-y-3 text-center md:text-left">
                              <div className="text-[8px] md:text-[9px] text-gray-300 font-black uppercase tracking-[0.3em] italic">Destination Node</div>
                              <div className="font-syne font-black text-lg md:text-2xl text-[#0a1628] italic">42 Gandhi Nagar, Karaikal</div>
                              <div className="text-sm md:text-lg font-dm font-bold text-gray-300 italic">Puducherry District, 609602</div>
                           </div>
                        </div>
                     </div>

                     <div className="bg-white border border-black/[0.03] rounded-[2rem] md:rounded-[5rem] p-6 md:p-16 space-y-8 md:space-y-12 shadow-soft">
                        <div className="flex items-center gap-4 md:gap-6">
                           <div className="h-1.5 w-10 md:w-12 bg-brand-teal rounded-full" />
                           <h2 className="font-syne font-black text-xl md:text-3xl text-[#0a1628] uppercase italic tracking-tighter">{t('paymentProtocol')}</h2>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
                           {[
                              { id: 'upi', icon: Smartphone, label: 'UPI SYNC' },
                              { id: 'card', icon: CreditCard, label: 'CARD' },
                              { id: 'cod', icon: Truck, label: 'CASH' }
                           ].map(m => (
                              <button 
                                 key={m.id}
                                 onClick={() => setMethod(m.id)}
                                 className={`p-6 md:p-10 rounded-2xl md:rounded-[3.5rem] border-2 transition-all duration-700 flex flex-row md:flex-col items-center gap-4 md:gap-6 ${method === m.id ? 'bg-[#0a1628] border-brand-teal text-white shadow-4xl' : 'bg-white border-gray-50 text-gray-200'}`}
                              >
                                 <div className={`h-10 w-10 md:h-16 md:w-16 rounded-xl flex items-center justify-center transition-all duration-700 shrink-0 ${method === m.id ? 'bg-brand-teal text-white' : 'bg-gray-50'}`}><m.icon size={20}/></div>
                                 <div className="text-[10px] md:text-[11px] font-black uppercase tracking-widest italic">{m.label}</div>
                              </button>
                           ))}
                        </div>

                        <div className="p-8 md:p-12 bg-gray-50 rounded-[2rem] md:rounded-[4rem] border border-black/[0.02] shadow-inner relative overflow-hidden">
                           <div className="relative z-10">
                              {method === 'upi' && <div className="grid md:grid-cols-2 gap-6 md:gap-10"><Input label="VPA_ID" placeholder="user@okaxis" variant="flat" /><Input label="HOLDER_NODE" placeholder="Ramesh Kumar" variant="flat" /></div>}
                              {method === 'card' && <div className="grid md:grid-cols-2 gap-6 md:gap-10"><Input className="md:col-span-2" label="ENCRYPTED_CARD" placeholder="**** **** **** ****" variant="flat" /><Input label="EXP_P" placeholder="MM / YY" variant="flat" /><Input label="CVC" placeholder="***" variant="flat" /></div>}
                              {method === 'cod' && (
                                 <div className="flex items-center gap-6 text-brand-teal">
                                    <Info size={24}/>
                                    <p className="font-syne font-black text-sm uppercase italic tracking-widest">{t('payUponNodeArrival')}</p>
                                 </div>
                              )}
                           </div>
                        </div>

                        <button 
                          onClick={() => setStep(2)}
                          className="w-full h-16 md:h-24 bg-[#0a1628] text-brand-teal rounded-2xl md:rounded-[3rem] font-syne font-black text-sm md:text-xl uppercase tracking-[0.4em] shadow-4xl flex items-center justify-center gap-4 md:gap-6 active:scale-95 transition-all italic"
                        >
                           VALIDATE PAYLOAD <ArrowRight size={20} />
                        </button>
                     </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="step-2"
                    initial={{ opacity: 0, x: 20 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-10 md:space-y-16"
                  >
                     <div className="bg-brand-teal rounded-[2.5rem] md:rounded-[5rem] p-8 md:p-24 text-white text-center space-y-6 md:space-y-12 relative overflow-hidden shadow-4xl">
                        <div className="absolute top-0 right-0 h-64 md:h-96 w-64 md:w-96 bg-white/10 rounded-full blur-[100px] animate-pulse" />
                        <div className="h-16 w-16 md:h-32 md:w-32 bg-white/10 rounded-2xl md:rounded-[3rem] flex items-center justify-center mx-auto border-2 border-white/20 mb-4 shadow-4xl"><ShieldCheck size={32} md:size={64} className="text-white" /></div>
                        <h2 className="font-syne font-black text-3xl md:text-7xl uppercase italic leading-none">Authorize <br /> Synchronization?</h2>
                        <p className="text-white/60 font-dm text-base md:text-xl italic font-bold max-w-sm md:max-w-lg mx-auto leading-relaxed">{t('authorizeSyncDesc')}</p>
                        
                        <div className="flex flex-col md:flex-row gap-4 md:gap-8 pt-4 md:pt-12">
                           <button onClick={() => setStep(1)} className="flex-1 h-16 md:h-24 bg-white/10 border-2 border-white/20 rounded-2xl md:rounded-[3rem] font-syne font-black text-[10px] md:text-sm uppercase tracking-widest hover:bg-white/20 transition-all italic">MODIFY_MAP</button>
                           <button onClick={handlePay} disabled={status === 'loading'} className="flex-1 h-16 md:h-24 bg-white text-[#0a1628] rounded-2xl md:rounded-[3rem] font-syne font-black text-[10px] md:text-sm uppercase tracking-widest shadow-4xl hover:bg-brand-teal hover:text-white transition-all flex items-center justify-center gap-3 italic">
                              {status === 'loading' ? 'SYNCING...' : 'AUTHORIZE_SYNC'} <ArrowRight size={18} />
                           </button>
                        </div>
                     </div>
                  </motion.div>
                )}
             </AnimatePresence>
          </div>

          {/* Sidebar Summary */}
          <div className="lg:sticky lg:top-32 space-y-10 md:space-y-16 pb-20">
             <div className="bg-white border border-black/[0.03] rounded-[2.5rem] md:rounded-[5rem] p-8 md:p-16 space-y-8 md:space-y-12 shadow-4xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 h-64 w-64 bg-brand-teal opacity-[0.02] rounded-full blur-[100px]" />
                <div className="flex items-center justify-between border-b border-gray-50 pb-8">
                   <div className="flex items-center gap-4 md:gap-6">
                      <div className="h-1.5 w-8 md:w-12 bg-brand-teal rounded-full" />
                      <h3 className="font-syne font-black text-xl md:text-3xl text-[#0a1628] uppercase italic">Summary</h3>
                   </div>
                </div>

                <div className="space-y-6 max-h-[300px] md:max-h-[450px] overflow-y-auto pr-4 no-scrollbar">
                   {items.map((i) => (
                      <div key={i.id || i._id} className="flex items-center gap-6 group/item">
                         <div className="h-14 w-14 md:h-20 md:w-20 bg-white border border-black/[0.02] rounded-xl overflow-hidden shrink-0 shadow-soft">
                            <img src={i.image} className="h-full w-full object-contain p-2 mix-blend-multiply" alt={i.name} />
                         </div>
                         <div className="flex-1 space-y-1">
                            <div className="font-syne font-black text-[#0a1628] text-sm md:text-lg italic uppercase truncate max-w-[150px]">{i.name}</div>
                            <div className="text-[9px] md:text-[11px] font-dm text-gray-300 font-black uppercase tracking-widest flex justify-between">
                               <span>Q:{i.qty}</span>
                               <span className="text-brand-teal">₹{i.price * i.qty}</span>
                            </div>
                         </div>
                      </div>
                   ))}
                </div>

                <div className="pt-8 md:pt-12 border-t border-gray-100 space-y-4 md:space-y-6">
                   <div className="flex items-center justify-between">
                      <div className="font-syne font-black text-xl md:text-3xl text-[#0a1628] uppercase italic">Total</div>
                      <div className="font-syne font-black text-3xl md:text-5xl text-brand-teal italic tracking-tighter">₹{totalAmount}</div>
                   </div>
                </div>

                <div className="p-8 md:p-10 bg-[#0a1628] rounded-[2rem] md:rounded-[4rem] text-white space-y-4 md:space-y-6 text-center border-t-8 border-brand-teal shadow-3xl">
                   <div className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.4em] text-brand-teal italic">Delivery Confidence</div>
                   <div className="flex flex-col items-center justify-center gap-3">
                      <div className="h-2 w-32 md:w-48 bg-white/5 rounded-full overflow-hidden">
                         <div className="h-full bg-brand-teal w-[99%]" />
                      </div>
                      <span className="font-syne font-black text-2xl md:text-3xl text-white italic">99.8%</span>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
