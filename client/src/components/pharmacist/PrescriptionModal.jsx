import { X, ZoomIn, ShieldCheck, Download, Activity, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PrescriptionModal({ isOpen, onClose, prescription, orderId }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 lg:p-12 overflow-hidden">
        <motion.div 
           initial={{ opacity: 0 }} 
           animate={{ opacity: 1 }} 
           exit={{ opacity: 0 }}
           onClick={onClose}
           className="absolute inset-0 bg-[#0a1628]/95 backdrop-blur-2xl" 
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          className="bg-white w-full max-w-5xl rounded-[5rem] overflow-hidden flex flex-col lg:flex-row shadow-4xl relative z-10 border border-white/10 h-full max-h-[90vh]"
        >
           {/* Image/Doc Review Panel */}
           <div className="flex-1 bg-gray-100 p-8 lg:p-16 relative overflow-auto custom-scrollbar flex items-center justify-center">
              <div className="absolute top-10 left-10 z-20 flex gap-4">
                 <div className="h-16 px-8 bg-white/80 backdrop-blur-xl border border-white rounded-2xl flex items-center justify-center text-[#0a1628] font-syne font-black text-[10px] uppercase tracking-widest italic shadow-soft">
                    <ZoomIn size={18} className="mr-3" /> Digital Microscope Active
                 </div>
              </div>
              <img 
                src={prescription || '/assets/hospital_pro.png'} 
                className="max-w-full rounded-[2.5rem] shadow-4xl border-8 border-white group-hover:scale-105 transition-transform duration-1000 origin-center" 
                alt="Prescription Manifest"
              />
           </div>

           {/* Authorization Control Node */}
           <div className="w-full lg:w-[400px] bg-white p-12 lg:p-16 flex flex-col justify-between border-l border-gray-100">
              <div className="space-y-12">
                 <div className="flex items-center justify-between">
                    <div className="h-16 w-16 bg-gray-50 rounded-2xl flex items-center justify-center text-brand-teal shadow-inner border border-gray-100"><FileText size={28}/></div>
                    <button onClick={onClose} className="h-14 w-14 bg-gray-50 rounded-xl flex items-center justify-center text-gray-300 hover:bg-red-500 hover:text-white transition-all duration-300"><X size={24}/></button>
                 </div>

                 <div className="space-y-6">
                    <div className="px-6 py-2 bg-[#0a1628] rounded-xl w-fit flex items-center gap-3 text-[9px] font-black text-brand-teal uppercase tracking-[0.4em] italic leading-none">
                       <Activity size={14} className="animate-pulse" /> Clinical Verification Hub
                    </div>
                    <h2 className="font-syne font-black text-4xl text-[#0a1628] uppercase italic leading-none tracking-tighter">Manifest <br/>Verification</h2>
                    <div className="text-[10px] font-black text-gray-300 uppercase italic tracking-widest">Order ID: {orderId}</div>
                 </div>

                 <div className="p-8 bg-gray-50 rounded-[3rem] border border-gray-100 space-y-6">
                    <div className="flex items-center gap-4 text-emerald-500">
                       <ShieldCheck size={20} />
                       <span className="text-[10px] font-black uppercase tracking-widest italic">Encrypted Secure Link</span>
                    </div>
                    <p className="text-gray-400 font-dm italic text-lg font-bold leading-relaxed">
                       Review clinical signatures and therapeutic requirements against the district medical database.
                    </p>
                 </div>
              </div>

              <div className="space-y-4">
                 <button className="w-full h-20 bg-[#0a1628] text-brand-teal font-syne font-black text-xs uppercase tracking-[0.4em] rounded-[2.5rem] shadow-4xl hover:scale-[1.02] active:scale-95 transition-all italic flex items-center justify-center gap-4 group">
                    <Download size={20} className="group-hover:translate-y-1 transition-transform"/> Save to Registry
                 </button>
                 <button onClick={onClose} className="w-full h-20 bg-gray-50 text-gray-400 font-syne font-black text-[10px] uppercase tracking-widest rounded-[2.5rem] hover:bg-white hover:text-[#0a1628] transition-all italic border border-transparent hover:border-gray-100">
                    Exit Authorization
                 </button>
              </div>
           </div>
        </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
