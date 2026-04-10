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
  }, [needsPrescription, prescription, navigate]);

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
    <div className="bg-[#f8fafc] min-h-screen pb-48 pt-24">
      <div className="max-w-7xl mx-auto px-10">
        <div className="grid lg:grid-cols-[1.3fr_1fr] gap-20 items-start">
          
          {/* Main Flow Section */}
          <div className="space-y-16">
             <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
                <div className="space-y-6">
                   <div className="px-6 py-2.5 bg-[#0a1628] rounded-2xl w-fit flex items-center gap-3 text-[10px] font-black text-brand-teal uppercase tracking-[0.4em] italic">
                      <Zap size={16} className="text-amber-500 animate-pulse" /> {t('transactionProtocol')} v2.4
                   </div>
                   <h1 className="font-syne font-black text-6xl lg:text-8xl text-[#0a1628] leading-[0.85] tracking-tighter uppercase italic">
                      {t('order')} <br/><span className="text-brand-teal">{t('synchronization')}</span>
                   </h1>
                </div>
                <div className="flex items-center gap-6 bg-white border border-gray-100 p-3 rounded-[2.5rem] shadow-soft">
                   {[1, 2].map(s => (
                      <div key={s} className={`h-14 px-8 rounded-2xl font-syne font-black text-xs flex items-center justify-center transition-all duration-700 ${step === s ? 'bg-[#0a1628] text-white shadow-4xl' : 'text-gray-200'}`}>0{s}</div>
                   ))}
                </div>
             </div>

             <AnimatePresence mode="wait">
                {step === 1 ? (
                  <motion.div 
                    key="step-1"
                    initial={{ opacity: 0, x: -30 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    exit={{ opacity: 0, x: 30 }}
                    className="space-y-12"
                  >
                     <div className="bg-white border border-gray-100 rounded-[2.5rem] md:rounded-[5rem] p-8 md:p-16 space-y-12 shadow-4xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 h-40 md:h-64 w-40 md:w-64 bg-brand-teal opacity-[0.02] rounded-full blur-[100px]" />
                        <div className="flex flex-col md:flex-row md:items-center justify-between relative z-10 border-b border-gray-50 pb-8 gap-4">
                           <div className="flex items-center gap-6">
                              <div className="h-1.5 w-12 bg-brand-teal rounded-full" />
                              <h2 className="font-syne font-black text-2xl md:text-3xl text-[#0a1628] uppercase italic tracking-tighter">{t('shippingEnclave')}</h2>
                           </div>
                           <button className="text-[10px] font-black text-brand-teal uppercase tracking-widest border-b border-brand-teal italic hover:scale-110 transition-transform w-fit">{t('editProtocolAddress')}</button>
                        </div>
                        <div className="p-6 md:p-10 bg-gray-50 rounded-[2rem] md:rounded-[3.5rem] border border-gray-100 flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8 relative z-10 group/address hover:bg-white hover:shadow-4xl transition-all duration-1000">
                           <div className="h-16 w-16 md:h-20 md:w-20 bg-white border border-gray-50 rounded-2xl md:rounded-[2rem] flex items-center justify-center text-brand-teal shadow-inner group-hover/address:bg-[#0a1628] group-hover/address:text-white transition-all duration-700 shrink-0"><MapPin size={28}/></div>
                           <div className="space-y-2 md:space-y-3 text-center md:text-left">
                              <div className="text-[9px] text-gray-200 font-black uppercase tracking-[0.3em] italic">{t('primaryNodeDestination')}</div>
                              <div className="font-syne font-black text-xl md:text-2xl text-[#0a1628] italic">42 Gandhi Nagar, Main Market Road</div>
                              <div className="text-base md:text-lg font-dm font-bold text-gray-300 italic">Karaikal District Enclave, 609602</div>
                           </div>
                        </div>
                     </div>

                     <div className="bg-white border border-gray-100 rounded-[5rem] p-16 space-y-12 shadow-soft">
                        <div className="flex items-center gap-6">
                           <div className="h-1.5 w-12 bg-brand-teal rounded-full" />
                           <h2 className="font-syne font-black text-3xl text-[#0a1628] uppercase italic tracking-tighter">{t('paymentProtocol')}</h2>
                        </div>
                        
                        <div className="grid md:grid-cols-3 gap-8">
                           {[
                              { id: 'upi', icon: Smartphone, label: t('upiSync') },
                              { id: 'card', icon: CreditCard, label: t('creditArchitecture') },
                              { id: 'cod', icon: Truck, label: t('cashOnNode') }
                           ].map(m => (
                              <button 
                                 key={m.id}
                                 onClick={() => setMethod(m.id)}
                                 className={`p-10 rounded-[3.5rem] border-4 flex flex-col items-center gap-6 transition-all duration-1000 group ${method === m.id ? 'bg-[#0a1628] border-brand-teal text-white shadow-4xl scale-105' : 'bg-white border-gray-50 text-gray-200 hover:border-brand-teal/20 hover:scale-105'}`}
                              >
                                 <div className={`h-16 w-16 rounded-[1.5rem] flex items-center justify-center transition-all duration-700 ${method === m.id ? 'bg-brand-teal text-white scale-110' : 'bg-gray-50 group-hover:bg-white'}`}><m.icon size={32}/></div>
                                 <div className="text-[11px] font-black uppercase tracking-widest text-center italic">{m.label}</div>
                              </button>
                           ))}
                        </div>

                        <div className="p-12 bg-gray-50 rounded-[4rem] border border-gray-100 shadow-inner overflow-hidden relative">
                           <div className="absolute top-0 right-0 h-40 w-40 bg-brand-teal opacity-5 rounded-full blur-[60px]" />
                           <div className="relative z-10">
                              {method === 'upi' && <div className="grid md:grid-cols-2 gap-10"><Input label={t('vpaAddress')} placeholder="user@okaxis" variant="flat" /><Input label={t('accountAuthorityName')} placeholder="Ramesh Kumar" variant="flat" /></div>}
                              {method === 'card' && <div className="grid md:grid-cols-2 gap-10"><Input className="md:col-span-2" label={t('secureCardNode')} placeholder="**** **** **** ****" variant="flat" /><Input label={t('expiryProtocol')} placeholder="MM / YY" variant="flat" /><Input label={t('cvcEnigma')} placeholder="***" variant="flat" /></div>}
                              {method === 'cod' && (
                                 <div className="flex items-center gap-8 text-brand-teal p-4">
                                    <div className="h-16 w-16 bg-white rounded-2xl shadow-soft flex items-center justify-center shrink-0 border border-brand-teal/20"><Info size={32}/></div>
                                    <p className="font-dm text-lg font-bold italic leading-relaxed">{t('payUponNodeArrival')}</p>
                                 </div>
                              )}
                           </div>
                        </div>

                        <button 
                          onClick={() => setStep(2)}
                          className="w-full h-24 bg-[#0a1628] text-white rounded-[3rem] font-syne font-black text-xl uppercase tracking-[0.4em] shadow-4xl flex items-center justify-center gap-6 hover:bg-brand-teal hover:scale-[1.02] active:scale-95 transition-all duration-700 italic group"
                        >
                           {t('advanceToValidation')} <ArrowRight size={28} className="group-hover:translate-x-4 transition-transform" />
                        </button>
                     </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="step-2"
                    initial={{ opacity: 0, x: 30 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    exit={{ opacity: 0, x: -30 }}
                    className="space-y-16"
                  >
                     <div className="bg-brand-teal rounded-[3rem] md:rounded-[5rem] p-8 md:p-24 text-white text-center space-y-8 md:space-y-12 relative overflow-hidden group shadow-4xl shadow-brand-teal/30">
                        <div className="absolute top-0 right-0 h-96 w-96 bg-white/10 rounded-full blur-[120px] animate-pulse" />
                        <div className="h-24 w-24 md:h-32 md:w-32 bg-white/10 rounded-[2rem] md:rounded-[3rem] flex items-center justify-center mx-auto backdrop-blur-3xl border-2 border-white/20 mb-6 shadow-4xl"><ShieldCheck size={48} md:size={64} className="text-white drop-shadow-2xl" /></div>
                        <h2 className="font-syne font-black text-4xl md:text-7xl uppercase italic leading-none">{t('authorize')} <br /> {t('synchronization')}?</h2>
                        <p className="text-white/60 font-dm text-lg md:text-xl italic font-bold max-w-lg mx-auto leading-relaxed">{t('authorizeSyncDesc')}</p>
                        
                        <div className="flex flex-col md:flex-row gap-4 md:gap-8 pt-6 md:pt-12">
                           <button onClick={() => setStep(1)} className="flex-1 h-16 md:h-24 bg-white/10 border-2 border-white/20 rounded-2xl md:rounded-[3rem] font-syne font-black text-xs md:text-sm uppercase tracking-[0.2em] md:tracking-[0.3em] hover:bg-white/20 transition-all duration-700 backdrop-blur-3xl italic">{t('modifyArchitecture')}</button>
                           <button onClick={handlePay} disabled={status === 'loading'} className="flex-1 h-16 md:h-24 bg-white text-[#0a1628] rounded-2xl md:rounded-[3rem] font-syne font-black text-xs md:text-sm uppercase tracking-[0.2em] md:tracking-[0.3em] shadow-4xl hover:scale-105 active:scale-95 transition-all duration-700 flex items-center justify-center gap-4 italic">
                              {status === 'loading' ? t('syncing') : t('authorizeTransaction')} <ArrowRight size={24} />
                           </button>
                        </div>

                        {error && (
                           <motion.div 
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="pt-12 flex items-center justify-center gap-4 text-sm font-black text-white bg-red-500/20 py-6 rounded-[2rem] border border-red-500/20 uppercase tracking-widest italic"
                           >
                              <AlertCircle size={20} className="animate-pulse" /> {t('protocolAlert')}: {error}
                           </motion.div>
                        )}
                     </div>

                     <div className="bg-white border border-gray-100 rounded-[4rem] p-12 flex items-center gap-10 shadow-soft group hover:border-brand-teal transition-all duration-1000">
                        <div className="h-20 w-20 bg-gray-50 rounded-[2rem] flex items-center justify-center shrink-0 text-brand-teal group-hover:bg-[#0a1628] group-hover:rotate-12 transition-all duration-700 shadow-inner"><Lock size={32}/></div>
                        <div className="space-y-3 font-dm">
                           <div className="text-[10px] text-gray-200 font-black uppercase tracking-[0.4em] italic leading-none">{t('globalSecurityArchitecture')}</div>
                           <p className="text-gray-300 font-bold italic text-lg leading-relaxed">{t('encryptionDesc')}</p>
                        </div>
                     </div>
                  </motion.div>
                )}
             </AnimatePresence>
          </div>

          {/* Sidebar Summary */}
          <div className="lg:sticky lg:top-32 space-y-16">
             <div className="bg-white border border-gray-100 rounded-[5rem] p-16 space-y-12 shadow-4xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 h-64 w-64 bg-brand-teal opacity-[0.02] rounded-full blur-[100px]" />
                <div className="flex items-center justify-between border-b border-gray-50 pb-10">
                   <div className="flex items-center gap-6">
                      <div className="h-2 w-12 bg-brand-teal rounded-full" />
                      <h3 className="font-syne font-black text-3xl text-[#0a1628] uppercase italic">{t('protocolSummary')}</h3>
                   </div>
                   <Package className="text-gray-100 group-hover:scale-125 transition-transform duration-700" size={36} />
                </div>

                <div className="space-y-8 max-h-[450px] overflow-y-auto pr-6 custom-scrollbar">
                   {items.map((i, idx) => (
                      <div key={i.id || i._id} className="flex items-center gap-8 group/item">
                         <div className="h-20 w-20 bg-gray-50 rounded-2xl overflow-hidden shrink-0 border border-gray-100 group-hover/item:border-brand-teal group-hover/item:scale-110 transition-all duration-500 shadow-inner">
                            <img src={i.image} className="h-full w-full object-contain p-3 mix-blend-multiply opacity-80 group-hover/item:opacity-100" alt={i.name} />
                         </div>
                         <div className="flex-1 space-y-2">
                            <div className="font-syne font-black text-[#0a1628] text-lg italic leading-tight uppercase group-hover/item:text-brand-teal transition-colors">{i.name}</div>
                            <div className="text-[11px] font-dm text-gray-300 font-black uppercase tracking-widest flex items-center justify-between">
                               <span>{t('manifestQuantity')}: <span className="text-[#0a1628]">{i.qty}</span></span>
                               <span className="text-brand-teal font-black text-sm">₹{i.price * i.qty}</span>
                            </div>
                         </div>
                      </div>
                   ))}
                </div>

                <div className="pt-12 border-t border-gray-100 space-y-6">
                   <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-[0.2em] text-gray-200">
                      <span>{t('baseProtocolFlow')}</span>
                      <span className="text-gray-400 italic">₹{totalAmount}</span>
                   </div>
                   <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-[0.2em] text-brand-teal animate-pulse">
                      <span>{t('logisticsNodeSync')}</span>
                      <span className="italic">{t('authorizedFree')}</span>
                   </div>
                   <div className="h-px bg-gray-50" />
                   <div className="flex items-center justify-between">
                      <div className="font-syne font-black text-3xl text-[#0a1628] uppercase italic">{t('totalYield')}</div>
                      <div className="font-syne font-black text-5xl text-brand-teal italic tracking-tighter group-hover:scale-110 transition-transform duration-1000">₹{totalAmount}</div>
                   </div>
                </div>

                <div className="p-10 bg-[#0a1628] rounded-[4rem] text-white space-y-6 text-center border-t-8 border-brand-teal shadow-3xl hover:shadow-brand-teal/20 transition-all duration-1000 group/prob">
                   <div className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-teal italic">{t('deliveryProbability')}</div>
                   <div className="flex flex-col items-center justify-center gap-4">
                      <div className="h-3 w-48 bg-white/5 rounded-full overflow-hidden">
                         <div className="h-full bg-brand-teal w-[99.8%] animate-pulse" />
                      </div>
                      <div className="flex items-center justify-center gap-4">
                         <Activity size={24} className="text-brand-teal group-hover/prob:animate-spin-slow transition-all" />
                         <span className="font-syne font-black text-3xl text-white italic leading-none">99.8%</span>
                      </div>
                      <div className="text-[9px] font-black text-white/20 uppercase tracking-widest italic">{t('districtNetworkVerification')}</div>
                   </div>
                </div>
             </div>

             <div className="px-10 flex items-center justify-between text-[11px] font-black uppercase italic tracking-widest text-gray-200 opacity-50">
                <div className="flex items-center gap-3"><Globe size={16}/> {t('karaikalEnclave')}</div>
                <div className="flex items-center gap-3"><Activity size={16}/> {t('liveSyncActive')}</div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}





