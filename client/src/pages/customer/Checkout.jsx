import { useMemo, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, ArrowRight, CreditCard, Smartphone, 
  Truck, CheckCircle, MapPin, Package, Lock, 
  ChevronRight, ArrowLeft, Info, AlertCircle, Activity, Zap, Globe, Plus, ShoppingBag
} from 'lucide-react';
import { createOrder, confirmPayment, createPaymentIntent } from '../../store/paymentsSlice.js';
import { Button, Input } from '../../components/common/Core';
import { useLanguage } from '../../context/LanguageContext';

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

const SAVED_ADDRESSES = [
  { id: 1, label: 'Home', address: '42 Gandhi Nagar, Karaikal', city: 'Puducherry', zip: '609602', default: true },
  { id: 2, label: 'Work', address: 'District Hospital Compx, Nagore Rd', city: 'Karaikal', zip: '609602', default: false }
];

export default function CheckoutPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user } = useSelector((s) => s.auth);
  const { items, totalAmount, note, prescription } = useSelector((s) => s.cart);
  const { status } = useSelector((s) => s.payments);
  const [method, setMethod] = useState('upi');
  const [error, setError] = useState('');
  const [selectedAddress, setSelectedAddress] = useState(SAVED_ADDRESSES[0].id);

  const deliveryFee = 35;
  const discount = totalAmount > 1000 ? 100 : 0;
  const finalTotal = totalAmount + deliveryFee - discount;

  useEffect(() => {
    if (items.length === 0) navigate('/cart');
    window.scrollTo(0, 0);
  }, [items, navigate]);

  const payload = useMemo(() => ({
    pharmacyId: items[0]?.pharmacyId || 'ph-1', // Derive from first item or default
    items: items.map((i) => ({ medicine: i.id || i._id, quantity: i.quantity, price: i.price })),
    totalAmount: finalTotal,
    deliveryAddress: SAVED_ADDRESSES.find(a => a.id === selectedAddress)?.address || '',
    paymentMethod: method,
    note,
    prescriptionUrl: prescription?.url || ''
  }), [items, finalTotal, method, note, prescription, selectedAddress]);

  const handlePay = async () => {
    setError('');
    const orderRes = await dispatch(createOrder(payload));
    if (orderRes.meta.requestStatus !== 'fulfilled') {
      setError('Enclave synchronization failed.');
      return;
    }

    const orderId = orderRes.payload._id || orderRes.payload.id;

    if (method === 'cod') {
      const confirm = await dispatch(confirmPayment({ orderId, method }));
      return confirm.meta.requestStatus === 'fulfilled' ? navigate('/checkout/success') : setError('Protocol confirmation failed.');
    }

    const ok = await loadRazorpay();
    if (!ok) return setError('Satellite payment node offline.');

    const intentRes = await dispatch(createPaymentIntent({ orderId, method }));
    if (intentRes.meta.requestStatus !== 'fulfilled') return setError('Payment intent failed.');

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID || '',
      amount: intentRes.payload.amount,
      currency: intentRes.payload.currency,
      name: 'MediReach Enclave',
      description: 'Medical Architecture Procurement',
      order_id: intentRes.payload.id,
      handler: async (response) => {
        const confirm = await dispatch(confirmPayment({
          orderId,
          method,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_signature: response.razorpay_signature
        }));
        return confirm.meta.requestStatus === 'fulfilled' ? navigate('/checkout/success') : setError('Node synchronization failed.');
      },
    };

    const rzp = new window.Razorpay({
      ...options,
      prefill: {
        name: user?.name || 'MediPharm User',
        email: user?.email || '',
        contact: user?.phone || ''
      }
    });

    rzp.on('payment.failed', (response) => {
      setError(response.error.description || 'Payment failed during satellite handshake.');
      dispatch(logPaymentRetry({ orderId, reason: response.error.reason }));
    });

    rzp.open();
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-64 pt-24 overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        
        <div className="grid lg:grid-cols-[1fr_1.2fr] gap-12 md:gap-20 items-start">
          
          {/* Left Column: Order Summary */}
          <section className="space-y-8 md:space-y-12">
             <div className="space-y-3 md:space-y-4">
                <div className="px-4 py-1.5 bg-navy rounded-xl w-fit flex items-center gap-2 text-[9px] md:text-[10px] font-black text-teal-400 uppercase tracking-widest italic leading-none">
                   <Activity size={12} className="animate-pulse" /> Order Sync
                </div>
                <h1 className="font-syne font-black text-4xl md:text-7xl text-navy uppercase italic leading-tight tracking-tighter">
                   Checkout
                </h1>
                <div className="bg-teal-500/5 border border-teal-500/10 p-3 md:p-4 rounded-xl md:rounded-2xl flex items-center gap-3 md:gap-4 text-teal-600 shrink-0">
                   <Truck size={18} className="animate-bounce-slow" />
                   <div className="font-syne font-black text-[9px] md:text-xs uppercase italic tracking-widest leading-none">Estimated Delivery: <span className="text-navy">25–35 Mins</span></div>
                </div>
             </div>

             <div className="bg-white border border-gray-100 rounded-2xl md:rounded-[3.5rem] p-5 md:p-12 shadow-xl space-y-8 md:space-y-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 h-40 w-40 bg-teal-500 opacity-[0.02] rounded-full blur-[80px]" />
                
                <div className="flex items-center justify-between border-b border-gray-50 pb-6 md:pb-8">
                   <div className="flex items-center gap-3 md:gap-4">
                      <div className="h-1 w-8 md:w-16 bg-teal-500 rounded-full" />
                      <h3 className="font-syne font-black text-xl md:text-2xl text-navy uppercase italic">Item List</h3>
                   </div>
                   <span className="text-[8px] md:text-[10px] font-black text-gray-300 uppercase tracking-widest">{items.length} Modules</span>
                </div>

                <div className="space-y-6 md:space-y-8 max-h-[400px] md:max-h-[500px] overflow-y-auto pr-2 no-scrollbar">
                   {items.map((i) => (
                      <div key={i.id || i._id} className="flex items-center gap-4 md:gap-6 group">
                         <div className="h-14 w-14 md:h-20 md:w-20 bg-gray-50 rounded-xl md:rounded-2xl overflow-hidden shrink-0 border border-gray-100 p-1.5 md:p-2">
                            <img src={i.image} alt={i.name} className="h-full w-full object-contain group-hover:scale-110 transition duration-500" />
                         </div>
                         <div className="flex-1 min-w-0 space-y-0.5 md:space-y-1">
                            <div className="font-syne font-black text-navy text-sm md:text-lg uppercase italic tracking-tight leading-tight truncate">{i.name}</div>
                            <div className="flex justify-between items-center text-[8px] md:text-[10px] font-black uppercase text-gray-300 tracking-widest">
                               <span>Qty: {i.qty}</span>
                               <span className="text-teal-600">₹{i.price * i.qty}</span>
                            </div>
                         </div>
                      </div>
                   ))}
                </div>                 <div className="pt-6 md:pt-10 border-t border-gray-50 space-y-4 md:space-y-6">
                   <div className="space-y-3 md:space-y-4">
                      <div className="flex justify-between text-gray-400 font-syne font-black text-[9px] md:text-[10px] uppercase italic tracking-widest">
                         <span>Subtotal</span>
                         <span>₹{totalAmount}</span>
                      </div>
                      <div className="flex justify-between text-gray-400 font-syne font-black text-[9px] md:text-[10px] uppercase italic tracking-widest">
                         <span>Delivery Fee</span>
                         <span className="text-emerald-500">₹{deliveryFee}</span>
                      </div>
                      {discount > 0 && (
                        <div className="flex justify-between text-teal-600 font-syne font-black text-[9px] md:text-[10px] uppercase italic tracking-widest">
                           <span>Discount</span>
                           <span>-₹{discount}</span>
                        </div>
                      )}
                   </div>
                   <div className="h-px bg-gray-50" />
                   <div className="flex justify-between items-end pt-2 md:pt-4">
                      <div className="font-syne font-black text-lg md:text-2xl text-navy uppercase italic">Grand Total</div>
                      <div className="font-syne font-black text-3xl md:text-5xl text-teal-600 italic tracking-tighter">₹{finalTotal}</div>
                   </div>
                </div>
             </div>
          </section>

          {/* Right Column: Payment & Address */}
          <section className="space-y-8 md:space-y-12">
             <div className="bg-navy rounded-2xl md:rounded-[4.5rem] p-6 md:p-16 text-white space-y-10 md:space-y-12 shadow-2xl relative overflow-hidden border-t-[12px] md:border-t-[20px] border-teal-500">
                <div className="absolute top-0 right-0 h-48 w-48 bg-teal-500 opacity-5 rounded-full blur-[100px]" />
                
                {/* Address Section */}
                <div className="space-y-6 md:space-y-8 relative z-10">
                   <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4 md:gap-6">
                         <div className="h-10 w-10 md:h-14 md:w-14 bg-white/5 border border-white/10 rounded-xl md:rounded-2xl flex items-center justify-center text-teal-400 shrink-0"><MapPin size={20}/></div>
                         <h2 className="font-syne font-black text-lg md:text-2xl uppercase italic tracking-tighter">Delivery Address</h2>
                      </div>
                      <button className="h-9 w-9 md:h-12 md:w-12 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center text-teal-400 hover:bg-teal-500 hover:text-navy transition-all shrink-0"><Plus size={18}/></button>
                   </div>

                   <div className="grid gap-3 md:gap-4">
                      {SAVED_ADDRESSES.map(addr => (
                         <button 
                            key={addr.id}
                            onClick={() => setSelectedAddress(addr.id)}
                            className={`p-4 md:p-6 rounded-2xl md:rounded-[2rem] border-2 text-left transition-all duration-500 relative group ${selectedAddress === addr.id ? 'bg-white/10 border-teal-500 ring-4 md:ring-8 ring-teal-500/5' : 'bg-transparent border-white/10 hover:border-white/30'}`}
                         >
                            <div className="flex justify-between items-start mb-1.5 md:mb-2">
                               <div className="text-[8px] md:text-[9px] font-black uppercase text-teal-400 tracking-widest italic">{addr.label}</div>
                               {selectedAddress === addr.id && <CheckCircle size={14} className="text-teal-500" />}
                            </div>
                            <div className="font-dm font-black text-sm md:text-lg italic text-white/80 group-hover:text-white transition-colors truncate">{addr.address}</div>
                            <div className="text-[8px] md:text-[10px] font-black text-white/40 uppercase tracking-widest">{addr.city} &bull; {addr.zip}</div>
                         </button>
                      ))}
                   </div>
                </div>

                {/* Payment Section */}
                <div className="space-y-6 md:space-y-8 relative z-10 pt-8 md:pt-10 border-t border-white/5">
                   <div className="flex items-center gap-4 md:gap-6">
                      <div className="h-10 w-10 md:h-14 md:w-14 bg-white/5 border border-white/10 rounded-xl md:rounded-2xl flex items-center justify-center text-teal-400 shrink-0"><CreditCard size={20}/></div>
                      <h2 className="font-syne font-black text-lg md:text-2xl uppercase italic tracking-tighter">Payment Method</h2>
                   </div>

                   <div className="grid grid-cols-3 gap-3 md:gap-4">
                      {[
                         { id: 'upi', icon: Smartphone, label: 'UPI' },
                         { id: 'card', icon: CreditCard, label: 'CARD' },
                         { id: 'cod', icon: Truck, label: 'COD' }
                      ].map(m => (
                         <button 
                            key={m.id}
                            onClick={() => setMethod(m.id)}
                            className={`py-4 md:py-6 rounded-xl md:rounded-[1.8rem] border-2 transition-all duration-500 flex flex-col items-center gap-2 md:gap-3 ${method === m.id ? 'bg-white text-navy border-white' : 'bg-transparent border-white/10 text-white/40 hover:text-white hover:border-white/30'}`}
                         >
                            <m.icon size={18} className="md:size-5" />
                            <span className="text-[8px] md:text-[9px] font-black uppercase tracking-widest">{m.label}</span>
                         </button>
                      ))}
                   </div>

                   {error && (
                      <div className="p-3 md:p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 md:gap-4 text-red-500 text-[8px] md:text-[10px] font-black uppercase tracking-widest italic animate-shake">
                         <AlertCircle size={14}/> {error}
                      </div>
                   )}

                   <button 
                      onClick={handlePay}
                      disabled={status === 'loading'}
                      className="w-full h-16 md:h-24 bg-teal-500 text-navy rounded-xl md:rounded-[3rem] font-syne font-black text-sm md:text-xl uppercase tracking-[0.2em] md:tracking-[0.4em] shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4 md:gap-6 italic overflow-hidden relative group"
                   >
                      <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
                      {status === 'loading' ? 'PROCESSING...' : 'PAY NOW'} 
                      <ArrowRight size={20} className="md:size-6" />
                   </button>
                   
                   <div className="flex items-center justify-center gap-4 text-[9px] font-black text-white/20 uppercase tracking-[0.4em] italic">
                      <Lock size={12}/> Secure 256-bit AES Encryption Node
                   </div>
                </div>
             </div>

             <div className="text-center space-y-6">
                <Link to="/cart" className="inline-flex items-center gap-3 text-gray-300 font-syne font-black text-[10px] uppercase italic tracking-[0.2em] hover:text-[#0a1628] transition-colors group">
                   <ArrowLeft size={14} className="group-hover:-translate-x-2 transition-transform" /> Back to Cart
                </Link>
             </div>
          </section>

        </div>
      </div>
    </div>
  );
}
