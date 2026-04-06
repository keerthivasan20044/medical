import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, ShoppingBag, Plus, Minus, 
  Trash2, Bell, CheckCircle, Package, 
  Clock, ArrowRight, ShieldCheck, Zap
} from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { Button } from '../common/Core';

/**
 * Side-sliding basket enclave.
 */
export function CartDrawer({ isOpen, onClose }) {
  const { items, subtotal, removeItem, changeQty } = useCart();

  return (
    <AnimatePresence>
       {isOpen && (
          <>
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={onClose}
               className="fixed inset-0 bg-[#0a1628]/40 backdrop-blur-md z-[100]"
            />
            <motion.div 
               initial={{ x: '100%' }}
               animate={{ x: 0 }}
               exit={{ x: '100%' }}
               transition={{ type: 'spring', damping: 25, stiffness: 200 }}
               className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-4xl z-[110] flex flex-col"
            >
               <div className="p-10 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                  <div className="space-y-1">
                     <h3 className="font-syne font-black text-2xl text-[#0a1628] flex items-center gap-4">Enclave Cart <ShoppingBag size={24} /></h3>
                     <p className="text-[10px] text-gray-300 font-black uppercase tracking-widest">{items.length} Architecture Nodes</p>
                  </div>
                  <button onClick={onClose} className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center text-gray-400 hover:text-red-500 transition shadow-sm border border-gray-50"><X size={20}/></button>
               </div>

               <div className="flex-1 overflow-y-auto p-10 space-y-8 no-scrollbar">
                  {items.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center space-y-8 opacity-20 filter grayscale">
                       <ShoppingBag size={120} />
                       <div className="font-syne font-black text-2xl uppercase tracking-[0.2em]">Enclave Empty</div>
                    </div>
                  ) : (
                    items.map(item => (
                       <div key={item.id} className="flex gap-8 group">
                          <div className="h-28 w-28 bg-gray-50 rounded-3xl overflow-hidden shrink-0 border border-gray-100">
                             <img src={item.image} alt="Medicine" className="h-full w-full object-cover group-hover:scale-110 transition duration-700" />
                          </div>
                          <div className="flex-1 space-y-4">
                             <div className="space-y-1">
                                <h4 className="font-syne font-black text-[#0a1628] uppercase tracking-tighter text-sm">{item.name}</h4>
                                <div className="text-[10px] text-[#028090] font-black uppercase tracking-widest italic">{item.pharmacyName} Enclave</div>
                             </div>
                             <div className="flex items-center justify-between">
                                <div className="flex items-center bg-gray-50 rounded-xl px-4 py-2 gap-4 border border-gray-100">
                                   <button onClick={() => changeQty(item.id, -1)} className="text-gray-400 hover:text-red-500 transition"><Minus size={14}/></button>
                                   <span className="font-syne font-black text-sm text-[#0a1628]">{item.qty}</span>
                                   <button onClick={() => changeQty(item.id, 1)} className="text-[#02C39A] hover:text-[#028090] transition"><Plus size={14}/></button>
                                </div>
                                <div className="font-syne font-black text-lg text-[#0a1628]">₹{(item.price * item.qty).toFixed(2)}</div>
                             </div>
                             <button onClick={() => removeItem(item.id)} className="text-[8px] font-black text-red-500 uppercase tracking-widest flex items-center gap-2 hover:underline"><Trash2 size={12}/> Purge From Enclave</button>
                          </div>
                       </div>
                    ))
                  )}
               </div>

               <div className="p-10 bg-gray-50 border-t border-gray-100 space-y-8">
                  <div className="space-y-4">
                     <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-300">
                        <span>Subtotal Enclave</span>
                        <span className="text-[#0a1628]">₹{subtotal.toFixed(2)}</span>
                     </div>
                     <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-emerald-500">
                        <span>Enclave Discounts</span>
                        <span>-₹0.00</span>
                     </div>
                     <div className="pt-6 border-t border-gray-100 flex justify-between items-center">
                        <span className="font-syne font-black text-[#0a1628] uppercase tracking-widest text-sm">Payable Node</span>
                        <span className="font-syne font-black text-3xl text-[#0a1628]">₹{subtotal.toFixed(2)}</span>
                     </div>
                  </div>
                  
                  <div className="flex gap-4">
                     <Button variant="ghost" className="flex-1" onClick={onClose}>Architecture Clear</Button>
                     <Button className="flex-[2]" icon={<Zap size={18} />}>Proceed to Checkout</Button>
                  </div>
                  <div className="flex items-center justify-center gap-3 text-[8px] font-black text-gray-300 uppercase tracking-widest">
                     <ShieldCheck size={12} className="text-[#02C39A]" /> Verified Medical Enclave Protocol
                  </div>
               </div>
            </motion.div>
          </>
       )}
    </AnimatePresence>
  );
}

/**
 * Dropdown stream for system alerts.
 */
export function NotificationPanel({ isOpen, onClose, notifications = [] }) {
  return (
    <AnimatePresence>
       {isOpen && (
         <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100]"
          />
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="absolute top-24 right-0 w-full max-w-lg bg-white border border-gray-100 rounded-[3.5rem] shadow-4xl z-[110] overflow-hidden"
          >
             <div className="p-10 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
                <h3 className="font-syne font-black text-2xl text-[#0a1628] flex items-center gap-4">Enclave Alert Stream <Bell size={24} className="animate-shake" /></h3>
                <button className="text-[8px] font-black text-[#028090] uppercase tracking-widest hover:underline decoration-2 underline-offset-4 decoration-[#02C39A]">Mark Protocol as Read</button>
             </div>
             
             <div className="max-h-[500px] overflow-y-auto p-8 space-y-4 no-scrollbar">
                {notifications.length === 0 ? (
                  <div className="py-20 text-center space-y-6 opacity-30">
                     <Package size={64} className="mx-auto" />
                     <p className="font-syne font-black uppercase text-xs tracking-widest">No Active Alarms in Stream</p>
                  </div>
                ) : (
                  notifications.map(n => (
                    <div key={n.id} className="p-6 bg-white border border-transparent hover:bg-gray-50 hover:border-gray-50 rounded-[2rem] transition flex items-start gap-6 group cursor-pointer">
                       <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${n.bg || 'bg-blue-50 text-blue-500'}`}>
                          {n.icon || <Bell size={20}/>}
                       </div>
                       <div className="space-y-1 flex-1">
                          <div className="flex items-center justify-between">
                             <div className="text-[8px] text-gray-300 font-bold uppercase tracking-widest italic">{n.time} Enclave</div>
                             {!n.read && <div className="h-1.5 w-1.5 bg-red-500 rounded-full" />}
                          </div>
                          <h4 className="font-syne font-black text-sm text-[#0a1628] group-hover:text-[#028090] transition">{n.title}</h4>
                          <p className="text-xs font-dm text-gray-400 italic line-clamp-1">{n.desc}</p>
                       </div>
                    </div>
                  ))
                )}
             </div>

             <div className="p-10 border-t border-gray-50 text-center">
                <button className="text-[10px] font-black text-[#0a1628] uppercase tracking-[0.3em] flex items-center justify-center gap-3 w-full group">
                   Visit Command Notification Center <ArrowRight size={14} className="group-hover:translate-x-2 transition" />
                </button>
             </div>
          </motion.div>
         </>
       )}
    </AnimatePresence>
  );
}
