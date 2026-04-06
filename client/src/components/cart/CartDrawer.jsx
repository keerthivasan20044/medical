import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, X, Minus, Plus, Trash2, ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { removeItem, changeQty, clearCart } from '../../store/cartSlice';

export default function CartDrawer({ isOpen, onClose }) {
  const { items, subtotal, totalQty, deliveryFee, totalAmount } = useSelector(s => s.cart);
  const dispatch = useDispatch();
  const progressToFree = Math.max(0, 500 - subtotal);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Node */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#0a1628]/60 backdrop-blur-sm z-[200]"
          />

          {/* Side Drawer Terminal */}
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-screen w-full max-w-[480px] bg-white shadow-4xl z-[201] flex flex-col"
          >
            {/* Header Handover */}
            <div className="p-8 border-b border-gray-50 flex items-center justify-between">
               <div className="space-y-1">
                  <div className="flex items-center gap-3">
                     <ShoppingBag className="text-brand-teal" size={24} />
                     <h2 className="font-syne font-black text-2xl text-[#0a1628]">Sync Cart <span className="text-gray-300">/</span> {totalQty}</h2>
                  </div>
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest pl-9">District Fulfillment Protocol</p>
               </div>
               <div className="flex items-center gap-4">
                  <button onClick={() => dispatch(clearCart())} className="text-[10px] font-black text-red-500 uppercase tracking-widest hover:underline">Clear Protocol</button>
                  <button onClick={onClose} className="h-12 w-12 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:text-brand-teal transition hover:rotate-90 duration-500">
                     <X size={24} />
                  </button>
               </div>
            </div>

            {/* Free Delivery Logic Node */}
            <div className="px-8 py-6 bg-gray-50/50 border-b border-gray-50">
               <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#0a1628]">
                     {progressToFree > 0 ? `Add ₹${progressToFree} more for FREE delivery` : 'FREE Delivery Protocol Unlocked!'}
                  </span>
                  <Truck className={progressToFree > 0 ? 'text-gray-300' : 'text-emerald-500 animate-bounce'} size={14} />
               </div>
               <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, (subtotal/500)*100)}%` }}
                    className={`h-full transition-colors duration-500 ${progressToFree > 0 ? 'bg-brand-teal' : 'bg-emerald-500'}`} 
                  />
               </div>
            </div>

            {/* Scrollable Items Enclave */}
            <div className="flex-1 overflow-y-auto no-scrollbar p-8 space-y-8">
               {items.length === 0 ? (
                 <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-30">
                    <div className="h-24 w-24 rounded-full border-4 border-dashed border-gray-200 flex items-center justify-center text-gray-300">
                       <ShoppingBag size={48} />
                    </div>
                    <p className="font-syne font-bold text-xl text-[#0a1628]">Cart Architecture Empty. <br /> Start Procuring.</p>
                 </div>
               ) : (
                 items.map((item, i) => (
                    <motion.div 
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex gap-6 group"
                    >
                       <div className="h-24 w-24 bg-gray-50 rounded-3xl p-4 flex items-center justify-center border border-transparent group-hover:border-brand-teal/20 transition duration-500 overflow-hidden">
                          <img src={item.image} alt={item.name} className="max-h-full max-w-full object-contain mix-blend-multiply group-hover:scale-110 transition duration-500" />
                       </div>
                       <div className="flex-1 space-y-3">
                          <div className="flex justify-between items-start">
                             <div>
                                <h4 className="font-syne font-black text-[#0a1628] flex items-center gap-2">
                                   {item.name} 
                                   <div className="h-2 w-2 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                                </h4>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none mt-1">{item.brand}</p>
                             </div>
                             <button onClick={() => dispatch(removeItem(item.id))} className="text-gray-200 hover:text-red-500 transition"><Trash2 size={16}/></button>
                          </div>
                          
                          <div className="flex items-center justify-between">
                             <div className="flex items-center gap-4 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
                                <button onClick={() => dispatch(changeQty({ id: item.id, delta: -1 }))} disabled={item.qty <= 1} className="text-gray-400 hover:text-[#0a1628] disabled:opacity-30 transition"><Minus size={14}/></button>
                                <span className="font-syne font-black text-sm text-[#0a1628] w-4 text-center">{item.qty}</span>
                                <button onClick={() => dispatch(changeQty({ id: item.id, delta: 1 }))} className="text-gray-400 hover:text-[#0a1628] transition"><Plus size={14}/></button>
                             </div>
                             <div className="font-syne font-black text-[#0a1628]">₹{(item.price * item.qty).toLocaleString()}</div>
                          </div>
                       </div>
                    </motion.div>
                 ))
               )}
            </div>

            {/* Footer Summary Handover */}
            <div className="p-8 bg-white border-t border-gray-50 space-y-8">
               <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                     <span className="text-gray-400 font-dm">Subtotal Enclave</span>
                     <span className="font-syne font-black text-[#0a1628]">₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                     <span className="text-gray-400 font-dm">District Delivery Fee</span>
                     <span className={`font-syne font-black ${deliveryFee === 0 ? 'text-emerald-500' : 'text-[#0a1628]'}`}>
                        {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                     </span>
                  </div>
                  <div className="h-px w-full bg-gray-50" />
                  <div className="flex justify-between items-center pt-2">
                     <span className="font-syne font-black text-xl text-[#0a1628]">Total Protocol</span>
                     <span className="font-syne font-black text-3xl text-brand-teal">₹{totalAmount.toLocaleString()}</span>
                  </div>
               </div>

               <div className="space-y-4">
                  <Link 
                     to="/checkout" 
                     onClick={onClose}
                     className="w-full h-18 bg-[#0a1628] text-white rounded-[2rem] flex items-center justify-between px-10 font-syne font-black text-[11px] uppercase tracking-[0.2em] shadow-4xl hover:bg-brand-teal transition-all group active:scale-95"
                  >
                     Checkout Sync <ArrowRight className="group-hover:translate-x-2 transition" size={18} />
                  </Link>
                  <div className="flex items-center justify-center gap-2 text-[8px] font-black text-gray-300 uppercase tracking-widest">
                     <ShieldCheck size={12} className="text-emerald-500" /> SECURED BY SHA-256 ENCRYPTION NODE
                  </div>
               </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
