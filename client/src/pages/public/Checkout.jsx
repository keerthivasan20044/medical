import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { Check, MapPin, CreditCard, ShoppingBag, ShieldCheck, Truck, ChevronRight, Plus, Phone } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../../services/api.js';
import { paymentService } from '../../services/paymentService.js';
import { clearCart } from '../../store/cartSlice';

const STEPS = [
  { id: 1, name: 'LOGIN PROTOCOL', icon: ShieldCheck },
  { id: 2, name: 'DISTRICT ADDRESS', icon: MapPin },
  { id: 3, name: 'ORDER SUMMARY', icon: ShoppingBag },
  { id: 4, name: 'PAYMENT GATEWAY', icon: CreditCard },
];

export default function Checkout() {
  const [activeStep, setActiveStep] = useState(2); // Start at Address
  const { items, subtotal, totalQty } = useSelector(s => s.cart);
  const { user } = useSelector(s => s.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const delivery = subtotal > 500 ? 0 : 40;
  const total = subtotal + delivery;

  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePlaceOrder = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    
    const loadingToast = toast.loading('Initializing Secure Payment Node...');
    
    try {
      // 1. Create Initial Order Architecture
      const { data } = await api.post('/api/orders', {
        items: items.map(i => ({ medicine: i.id, qty: i.qty, price: i.price })),
        deliveryAddress: { 
           address: "Door No. 42, Poompuhar Street", 
           city: "Karaikal", 
           zip: "609602" 
        },
        paymentMethod
      });

      const orderId = data.order._id;

      if (paymentMethod === 'cod') {
        toast.success('Order Protocol Established!', { id: loadingToast });
        dispatch(clearCart());
        navigate(`/orders/track/${orderId}`);
        return;
      }

      // 2. Synchronize Payment Intent (Razorpay)
      const { data: intentData } = await paymentService.createIntent(orderId);
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_YOUR_KEY',
        amount: intentData.intent.amount,
        currency: 'INR',
        name: 'MediReach Pharmacy',
        description: `District Mesh Sync: Order #${orderId.slice(-6)}`,
        image: 'https://cdn-icons-png.flaticon.com/512/822/822143.png',
        order_id: intentData.intent.id,
        handler: async (response) => {
          const confirmToast = toast.loading('Verifying Payment Signature...');
          try {
            await paymentService.confirmPayment({
              orderId,
              method: 'razorpay',
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature
            });
            toast.success('Synchronization Successful!', { id: confirmToast });
            dispatch(clearCart());
            navigate(`/orders/track/${orderId}`);
          } catch (err) {
            toast.error('Payment Verification Hub Failed.', { id: confirmToast });
          }
        },
        prefill: {
          name: user?.name || 'Guest User',
          email: user?.email || 'guest@karaikal.com',
          contact: user?.phone || '9443200000'
        },
        theme: { color: '#028090' }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        toast.error('Payment Interrupted: ' + response.error.description);
      });
      rzp.open();
      toast.dismiss(loadingToast);

    } catch (e) {
      toast.error('Failed to establish Order Protocol.', { id: loadingToast });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-[#f8fafb] min-h-screen pb-24">
      {/* Premium Sticky Header Sync */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50 py-6">
         <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
               <div className="h-10 w-10 bg-[#0a1628] rounded-xl flex items-center justify-center text-brand-teal"><ShieldCheck size={20} /></div>
               <span className="font-syne font-black text-xl text-[#0a1628]">Sync Checkout</span>
            </Link>
            <div className="flex items-center gap-2 text-[10px] font-black text-gray-300 uppercase tracking-widest">
               <ShieldCheck size={14} className="text-emerald-500" /> Secure Encryption Node Active
            </div>
         </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 pt-12">
         <div className="grid lg:grid-cols-[1fr_420px] gap-12 items-start">
            
            {/* Left Column: Step-by-Step Architecture */}
            <div className="space-y-6">
               {STEPS.map((step) => {
                 const isCompleted = step.id < activeStep;
                 const isActive = step.id === activeStep;

                 return (
                    <div key={step.id} className={`bg-white rounded-[2.5rem] border transition-all duration-500 overflow-hidden ${isActive ? 'border-brand-teal shadow-4xl shadow-brand-teal/5' : 'border-gray-100 shadow-sm'}`}>
                       {/* Step Header */}
                       <div className={`p-8 flex items-center justify-between ${isActive ? 'bg-brand-teal/[0.03]' : ''}`}>
                          <div className="flex items-center gap-6">
                             <div className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${isCompleted ? 'bg-emerald-500 text-white' : isActive ? 'bg-brand-teal text-white shadow-xl shadow-brand-teal/20' : 'bg-gray-50 text-gray-300'}`}>
                                {isCompleted ? <Check size={20} /> : <step.icon size={20} />}
                             </div>
                             <div>
                                <h3 className={`font-syne font-black text-sm uppercase tracking-widest ${isActive ? 'text-[#0a1628]' : 'text-gray-400'}`}>{step.name}</h3>
                                {isCompleted && <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest mt-1">Protocol Verified</p>}
                             </div>
                          </div>
                          {!isActive && step.id < activeStep && (
                            <button onClick={() => setActiveStep(step.id)} className="px-4 py-2 border border-gray-100 hover:border-brand-teal text-brand-teal rounded-xl text-[10px] font-black uppercase tracking-widest transition">Change Node</button>
                          )}
                       </div>

                       {/* Step Body */}
                       <AnimatePresence>
                          {isActive && (
                            <motion.div 
                               initial={{ height: 0, opacity: 0 }}
                               animate={{ height: 'auto', opacity: 1 }}
                               exit={{ height: 0, opacity: 0 }}
                               className="px-8 pb-10"
                            >
                               {step.id === 2 && (
                                 <div className="space-y-6 pt-4">
                                    <div className="grid md:grid-cols-2 gap-6">
                                       <div className="p-6 border-2 border-brand-teal bg-brand-teal/[0.02] rounded-3xl space-y-4 relative overflow-hidden group">
                                          <div className="absolute top-0 right-0 h-12 w-12 bg-brand-teal text-white flex items-center justify-center rounded-bl-3xl"><Check size={20}/></div>
                                          <div className="font-syne font-black text-[#0a1628] uppercase tracking-wider">Home Enclave</div>
                                          <p className="text-sm text-gray-400 font-dm leading-relaxed">Door No. 42, Poompuhar Street, <br /> Karaikal - 609602, TN</p>
                                          <div className="flex items-center gap-3 text-xs font-dm font-bold text-[#0a1628]">
                                             <Phone size={14} /> +91 98*** **321
                                          </div>
                                          <button onClick={() => setActiveStep(3)} className="w-full h-12 bg-[#0a1628] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-brand-teal transition">DELIVER TO THIS NODE</button>
                                       </div>
                                       <button className="p-6 border-2 border-dashed border-gray-100 rounded-3xl flex flex-col items-center justify-center gap-4 hover:border-brand-teal hover:bg-gray-50 transition group">
                                          <div className="h-12 w-12 rounded-full border border-gray-100 flex items-center justify-center text-gray-300 group-hover:bg-brand-teal group-hover:text-white transition-all"><Plus size={24}/></div>
                                          <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest group-hover:text-brand-teal">Add New District Node</span>
                                       </button>
                                    </div>
                                 </div>
                               )}

                               {step.id === 3 && (
                                 <div className="space-y-8 pt-4">
                                    {items.map(item => (
                                      <div key={item.id} className="flex gap-6">
                                         <div className="h-20 w-20 bg-gray-50 rounded-2xl p-4 flex items-center justify-center border border-gray-100">
                                            <img src={item.image} className="max-h-full max-w-full mix-blend-multiply" alt="Medicine" />
                                         </div>
                                         <div className="flex-1">
                                            <div className="font-syne font-black text-[#0a1628]">{item.name}</div>
                                            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Qty: {item.qty} Node</div>
                                            <div className="font-syne font-black text-brand-teal mt-2 text-lg">₹{(item.price * item.qty).toLocaleString()}</div>
                                         </div>
                                      </div>
                                    ))}
                                    <button onClick={() => setActiveStep(4)} className="w-full h-16 bg-[#0a1628] text-white rounded-[1.5rem] font-syne font-black text-sm uppercase tracking-[0.2em] shadow-xl hover:bg-brand-teal transition active:scale-95">CONFIRM ORDER ARCHITECTURE &rarr;</button>
                                 </div>
                               )}

                               {step.id === 4 && (
                                 <div className="space-y-8 pt-4">
                                     <div className="grid gap-6">
                                        {/* Razorpay Option */}
                                        <div 
                                          onClick={() => setPaymentMethod('razorpay')}
                                          className={`p-8 bg-white rounded-3xl border-2 transition flex items-center justify-between group cursor-pointer ${paymentMethod === 'razorpay' ? 'border-brand-teal bg-brand-teal/[0.02]' : 'border-gray-100'}`}
                                        >
                                           <div className="flex items-center gap-6">
                                              <div className="h-10 w-16 bg-white border border-gray-100 rounded-xl flex items-center justify-center shadow-sm">
                                                 <img src="https://upload.wikimedia.org/wikipedia/commons/8/89/Razorpay_logo.svg" className="h-4" alt="Razorpay" />
                                              </div>
                                              <div>
                                                 <div className="font-syne font-black text-[#0a1628] text-xs uppercase tracking-widest">RAZORPAY MESH</div>
                                                 <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">UPI, Card, Net Banking</p>
                                              </div>
                                           </div>
                                           <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'razorpay' ? 'border-brand-teal' : 'border-gray-200'}`}>
                                              {paymentMethod === 'razorpay' && <div className="h-3 w-3 bg-brand-teal rounded-full" />}
                                           </div>
                                        </div>

                                        {/* COD Option */}
                                        <div 
                                          onClick={() => setPaymentMethod('cod')}
                                          className={`p-8 bg-white rounded-3xl border-2 transition flex items-center justify-between group cursor-pointer ${paymentMethod === 'cod' ? 'border-brand-teal bg-brand-teal/[0.02]' : 'border-gray-100'}`}
                                        >
                                           <div className="flex items-center gap-6">
                                              <div className="h-10 w-16 bg-white border border-gray-100 rounded-xl flex items-center justify-center shadow-sm">
                                                 <IndianRupee size={20} className="text-emerald-500" />
                                              </div>
                                              <div>
                                                 <div className="font-syne font-black text-[#0a1628] text-xs uppercase tracking-widest">CASH ON DELIVERY</div>
                                                 <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Pay at Delivery Node</p>
                                              </div>
                                           </div>
                                           <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'cod' ? 'border-brand-teal' : 'border-gray-200'}`}>
                                              {paymentMethod === 'cod' && <div className="h-3 w-3 bg-brand-teal rounded-full" />}
                                           </div>
                                        </div>
                                     </div>

                                     <button 
                                        onClick={handlePlaceOrder} 
                                        disabled={isProcessing}
                                        className="w-full h-18 bg-[#0a1628] text-white rounded-[2rem] font-syne font-black text-sm uppercase tracking-[0.2em] shadow-4xl hover:bg-brand-teal hover:scale-[1.02] active:scale-[0.98] transition disabled:opacity-50"
                                     >
                                        {isProcessing ? 'SYNCHRONIZING...' : `EXECUTE FINAL PROTOCOL: ₹${total.toLocaleString()}`}
                                     </button>
                                 </div>
                               )}
                            </motion.div>
                          )}
                       </AnimatePresence>
                    </div>
                 );
               })}
            </div>

            {/* Right Column: Dynamic Price Terminal */}
            <div className="lg:sticky lg:top-36 space-y-8">
               <div className="bg-[#0a1628] rounded-[3.5rem] p-10 text-white relative overflow-hidden shadow-4xl group">
                  <div className="absolute top-0 right-0 h-40 w-40 bg-brand-teal opacity-10 rounded-full blur-[80px]" />
                  <div className="space-y-8 relative z-10">
                     <h2 className="font-syne font-black text-2xl uppercase tracking-tighter">Architecture Summary</h2>
                     
                     <div className="space-y-4">
                        <div className="flex justify-between text-white/40 text-[10px] font-black uppercase tracking-widest">
                           <span>Subtotal Sync ({totalQty} Items)</span>
                           <span className="text-white">₹{subtotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-white/40 text-[10px] font-black uppercase tracking-widest">
                           <span>District Delivery</span>
                           <span className={delivery === 0 ? 'text-emerald-400' : 'text-white'}>
                              {delivery === 0 ? 'FREE PROTOCOL' : `₹${delivery}`}
                           </span>
                        </div>
                        <div className="h-px w-full bg-white/5" />
                        <div className="flex justify-between items-center pt-2">
                           <span className="font-syne font-black text-lg">TOTAL YIELD</span>
                           <span className="font-syne font-black text-4xl text-brand-teal">₹{total.toLocaleString()}</span>
                        </div>
                     </div>

                     <div className="p-6 bg-white/5 border border-white/10 rounded-3xl space-y-2">
                        <div className="text-[9px] font-black text-emerald-400 uppercase tracking-[0.3em] flex items-center gap-2">
                           <div className="h-1.5 w-1.5 bg-emerald-400 rounded-full animate-ping" /> Synchronizing Order
                        </div>
                        <p className="text-[10px] text-white/40 leading-relaxed italic">"Verified medicines will be procured directly from licensed Karaikal node centers."</p>
                     </div>
                  </div>
               </div>

               {/* Trust Badges Enclave */}
               <div className="grid grid-cols-2 gap-4">
                  <div className="p-6 bg-white rounded-3xl border border-gray-100 flex flex-col items-center text-center gap-3">
                     <Truck className="text-brand-teal" size={24} />
                     <div className="text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none">Verified <br /> Delivery Node</div>
                  </div>
                  <div className="p-6 bg-white rounded-3xl border border-gray-100 flex flex-col items-center text-center gap-3">
                     <ShieldCheck className="text-emerald-500" size={24} />
                     <div className="text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none">Security <br /> SHA-256 SYNC</div>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
