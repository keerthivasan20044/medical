import { CheckCircle, Download, ShoppingBag, ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { clearCart } from '../../store/cartSlice';
import PageShell from '../../components/layout/PageShell';

export default function OrderSuccess() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(clearCart());
  }, [dispatch]);
  return (
    <PageShell 
      title="Order Confirmed" 
      subtitle="Your order has been placed successfully. The pharmacy is now preparing your medicines."
      icon={CheckCircle}
    >
      <div className="p-8 md:p-20 flex flex-col items-center text-center space-y-12 md:y-16">
         <div className="relative">
            <motion.div 
               initial={{ scale: 0, rotate: -20 }}
               animate={{ scale: 1, rotate: 0 }}
               transition={{ type: "spring", stiffness: 200, damping: 20 }}
               className="h-32 w-32 md:h-48 md:w-48 bg-brand-teal rounded-[2.5rem] md:rounded-[4rem] flex items-center justify-center text-[#0a1628] shadow-[0_30px_60px_rgba(2,195,154,0.3)] relative z-10"
            >
               <CheckCircle size={64} md:size={100} strokeWidth={3} className="animate-pulse" />
            </motion.div>
            <div className="absolute inset-0 bg-brand-teal/20 blur-[80px] md:blur-[100px] animate-pulse" />
         </div>

         <div className="space-y-4 md:space-y-6">
            <h2 className="font-syne font-black text-4xl md:text-5xl text-[#0a1628] tracking-tighter uppercase italic">Order Placed Successfully!</h2>
            <p className="text-gray-400 font-dm italic font-bold text-xl md:text-2xl max-w-2xl mx-auto">
               Your order ID <span className="text-brand-teal font-black">#ORD-{Math.random().toString(36).substr(2, 6).toUpperCase()}</span> is confirmed. Your medicines will be delivered within 30 minutes.
            </p>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 w-full max-w-4xl">
            <div className="p-8 md:p-10 bg-gray-50/50 rounded-[2.5rem] border border-black/[0.03] space-y-3">
               <div className="text-[9px] text-gray-300 font-black uppercase tracking-widest italic leading-none">Payment</div>
               <div className="font-syne font-black text-[#0a1628] text-lg md:text-xl uppercase italic">Secured</div>
            </div>
            <div className="p-8 md:p-10 bg-gray-50/50 rounded-[2.5rem] border border-black/[0.03] space-y-3">
               <div className="text-[9px] text-gray-300 font-black uppercase tracking-widest italic leading-none">Pharmacy</div>
               <div className="font-syne font-black text-[#0a1628] text-lg md:text-xl uppercase italic">Verified</div>
            </div>
            <div className="p-8 md:p-10 bg-gray-50/50 rounded-[2.5rem] border border-black/[0.03] space-y-3">
               <div className="text-[9px] text-gray-300 font-black uppercase tracking-widest italic leading-none">Safety Check</div>
               <div className="font-syne font-black text-[#0a1628] text-lg md:text-xl uppercase italic">Passed</div>
            </div>
         </div>

         <div className="flex flex-col md:flex-row gap-4 md:gap-6 pt-6 md:pt-10 w-full md:w-auto">
            <Link to="/orders" className="w-full md:w-auto">
               <button className="w-full h-16 md:h-20 px-12 bg-[#0a1628] text-brand-teal font-syne font-black text-sm rounded-2xl flex items-center justify-center md:justify-start gap-4 transition-all shadow-4xl hover:scale-105 active:scale-95 italic uppercase tracking-widest">
                  <Truck size={24} /> Track My Order
               </button>
            </Link>
            <Link to="/home" className="w-full md:w-auto">
               <button className="w-full h-16 md:h-20 px-12 bg-white border-2 border-black/[0.03] text-[#0a1628] font-syne font-black text-sm rounded-2xl flex items-center justify-center md:justify-start gap-4 transition-all hover:bg-gray-50 active:scale-95 italic uppercase tracking-widest">
                  <ShoppingBag size={24} /> Back to Home
               </button>
            </Link>
         </div>
         
         <div className="pt-12 md:pt-20 border-t border-black/[0.05] w-full max-w-2xl flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10">
            <span className="flex items-center gap-3 text-[9px] font-black uppercase text-gray-300 tracking-widest italic leading-none"><ShieldCheck size={16} className="text-brand-teal"/> SECURE PAYMENT</span>
            <span className="flex items-center gap-3 text-[9px] font-black uppercase text-gray-300 tracking-widest italic leading-none"><CheckCircle size={16} className="text-emerald-500"/> VERIFIED MEDICINE</span>
         </div>
      </div>
    </PageShell>
  );
}
