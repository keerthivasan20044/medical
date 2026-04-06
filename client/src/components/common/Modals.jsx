import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle, CheckCircle, Info, ShieldCheck, Pill, ArrowRight, Store, MapPin } from 'lucide-react';
import { Button } from './Core';

/**
 * Standard fixed overlay architecture modal.
 */
export function Modal({ isOpen, onClose, title, children }) {
  return (
    <AnimatePresence>
       {isOpen && (
         <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 md:p-12">
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={onClose}
               className="absolute inset-0 bg-[#0a1628]/60 backdrop-blur-xl"
            />
            <motion.div 
               initial={{ opacity: 0, scale: 0.9, y: 30 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.9, y: 30 }}
               transition={{ type: 'spring', damping: 25, stiffness: 200 }}
               className="relative w-full max-w-2xl bg-white rounded-[5rem] shadow-4xl overflow-hidden"
            >
               <div className="p-12 md:p-20 space-y-12">
                  <div className="flex items-start justify-between">
                     <div className="space-y-2">
                        <h3 className="font-syne font-black text-4xl text-[#0a1628] leading-tight select-none">{title} <br /><span className="text-[#028090]">Protocol.</span></h3>
                        <div className="h-1 w-20 bg-[#02C39A] rounded-full shadow-mint" />
                     </div>
                     <button onClick={onClose} className="h-14 w-14 bg-gray-50 text-gray-300 hover:text-red-500 rounded-2xl flex items-center justify-center transition border border-gray-100 shadow-sm"><X size={24}/></button>
                  </div>
                  <div className="overflow-y-auto max-h-[60vh] no-scrollbar">
                     {children}
                  </div>
               </div>
            </motion.div>
         </div>
       )}
    </AnimatePresence>
  );
}

/**
 * Dual-action confirmation architecture.
 */
export function ConfirmModal({ isOpen, onClose, onConfirm, title, message, type = 'info' }) {
  const configs = {
    danger: { icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-50' },
    success: { icon: CheckCircle, color: 'text-[#02C39A]', bg: 'bg-emerald-50' },
    info: { icon: Info, color: 'text-blue-500', bg: 'bg-blue-50' }
  };
  const c = configs[type];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
       <div className="space-y-12 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
             <div className={`h-20 w-20 ${c.bg} ${c.color} rounded-[2rem] flex items-center justify-center shadow-lg shrink-0 border border-current/10`}><c.icon size={36}/></div>
             <p className="text-xl font-dm text-gray-500 italic leading-relaxed">{message}</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 pt-10 border-t border-gray-50">
             <Button variant="ghost" className="w-full" onClick={onClose}>Architecture Abort</Button>
             <Button variant={type === 'danger' ? 'danger' : 'primary'} className="w-full" onClick={onConfirm}>Confirm Protocol</Button>
          </div>
       </div>
    </Modal>
  );
}

/**
 * High-fidelity image inspection node.
 */
export function ImageModal({ isOpen, onClose, src, alt }) {
  return (
    <AnimatePresence>
       {isOpen && (
         <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6 md:p-32">
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={onClose}
               className="absolute inset-0 bg-[#0a1628]/95 backdrop-blur-2xl"
            />
            <motion.div 
               initial={{ opacity: 0, scale: 0.8 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 0.8 }}
               className="relative w-full h-full flex flex-col items-center justify-center gap-12"
            >
               <button onClick={onClose} className="absolute top-0 right-0 h-20 w-20 bg-white/10 text-white hover:bg-white hover:text-[#0a1628] rounded-full flex items-center justify-center transition border border-white/5 shadow-2xl z-20"><X size={32}/></button>
               <img src={src} alt={alt} className="max-h-full max-w-full rounded-[4rem] shadow-[0_50px_150px_rgba(0,0,0,0.5)] border-8 border-white object-contain relative z-10" />
               <div className="px-12 py-6 bg-white rounded-full text-[#0a1628] font-syne font-black text-xs uppercase tracking-widest shadow-2xl relative z-10">{alt} Protocol Enclave View</div>
            </motion.div>
         </div>
       )}
    </AnimatePresence>
  );
}

/**
 * Instant medicine node preview architecture.
 */
export function QuickViewModal({ isOpen, onClose, medicine }) {
  if (!medicine) return null;
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={medicine.name}>
       <div className="grid md:grid-cols-[250px_1fr] gap-12">
          <div className="h-64 bg-gray-50 rounded-[3.5rem] overflow-hidden border border-gray-100 shadow-inner group">
             <img src={medicine.image} className="h-full w-full object-cover group-hover:scale-110 transition duration-700" alt="Medicine" />
          </div>
          <div className="space-y-8">
             <div className="space-y-2">
                <div className="text-[10px] text-[#028090] font-black uppercase tracking-widest italic">{medicine.generic} Enclave</div>
                <div className="flex items-center gap-6">
                   <div className="text-4xl font-syne font-black text-[#0a1628]">₹{medicine.price}</div>
                   {medicine.requiresRx && <div className="px-6 py-2 bg-indigo-50 border border-indigo-100 rounded-2xl text-indigo-600 font-black text-[10px] uppercase tracking-widest italic shadow-sm flex items-center gap-3"><ShieldCheck size={14}/> Rx node</div>}
                </div>
                <p className="text-gray-400 font-dm text-sm leading-relaxed italic">{medicine.description || 'Verified pharmaceutical architecture for the Karaikal district enclave.'}</p>
             </div>
             
             <div className="grid grid-cols-2 gap-4">
                <div className="p-6 bg-gray-50 rounded-3xl space-y-1">
                   <div className="text-[8px] text-gray-300 font-bold uppercase tracking-widest">Brand Enclave</div>
                   <div className="font-syne font-black text-xs text-[#0a1628]">{medicine.brand}</div>
                </div>
                <div className="p-6 bg-gray-50 rounded-3xl space-y-1">
                   <div className="text-[8px] text-gray-300 font-bold uppercase tracking-widest">Protocol Type</div>
                   <div className="font-syne font-black text-xs text-[#0a1628]">Tablet Enclave</div>
                </div>
             </div>

             <Button className="w-full" icon={<ArrowRight size={18} />}>Order From Pharmacy Enclave</Button>
          </div>
       </div>
    </Modal>
  );
}
