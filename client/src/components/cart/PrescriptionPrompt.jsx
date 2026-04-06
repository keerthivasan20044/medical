import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Upload, X, ShieldCheck, FileText, AlertCircle, CheckCircle2, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PrescriptionPrompt({ onUpload, isUploaded, uploadedFile }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="bg-white border border-red-500/20 rounded-[4rem] p-12 shadow-4xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 h-40 w-40 bg-red-500 opacity-[0.02] rounded-full blur-[80px]" />
      
      <div className="flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
         <div className="flex items-center gap-8">
            <div className={`h-20 w-20 rounded-[2rem] flex items-center justify-center transition-all duration-700 shadow-inner ${isUploaded ? 'bg-emerald-50 text-emerald-500' : 'bg-red-50 text-red-500 group-hover:bg-[#0a1628] group-hover:text-white'}`}>
               {isUploaded ? <ShieldCheck size={36}/> : <FileText size={36}/>}
            </div>
            <div className="space-y-2">
               <h3 className="font-syne font-black text-2xl text-[#0a1628] uppercase italic leading-none flex items-center gap-4">
                  {isUploaded ? 'Protocol Verified' : 'Prescription Required'}
                  {isUploaded && <CheckCircle2 size={20} className="text-emerald-500 animate-pulse" />}
               </h3>
               <p className="text-gray-400 font-dm italic font-bold text-lg leading-relaxed max-w-sm">
                  {isUploaded 
                    ? `Manifest ${uploadedFile?.name || 'document'} successfully synchronized with the district clinical grid.`
                    : 'This payload contains controlled therapeutic nodes. Professional clinical authorization is mandatory.'}
               </p>
            </div>
         </div>

         <div className="flex flex-col gap-4 w-full md:w-auto">
            {!isUploaded ? (
               <Link 
                 to="/order/ph-1/prescription" 
                 className="h-20 px-12 bg-red-600 text-white font-syne font-black text-xs uppercase tracking-[0.4rem] italic rounded-[2.5rem] shadow-4xl flex items-center justify-center gap-6 hover:scale-105 active:scale-95 transition-all duration-700 group/upload cursor-pointer"
               >
                  <Upload size={20} className="group-hover/upload:rotate-12 transition-transform" /> Initialize Upload
               </Link>
            ) : (
               <button 
                 onClick={() => onUpload(null)}
                 className="h-20 px-12 bg-[#0a1628] text-brand-teal font-syne font-black text-xs uppercase tracking-[0.4rem] italic rounded-[2.5rem] shadow-4xl flex items-center justify-center gap-6 hover:bg-red-600 hover:text-white transition-all duration-700 group"
               >
                  <X size={20} className="group-hover:rotate-90 transition-transform" /> Purge Manifest
               </button>
            )}
            
            <div className="flex items-center justify-center gap-3 text-[10px] font-black uppercase italic tracking-widest text-gray-300">
               <ShieldCheck size={14} className="text-emerald-500" /> AES-256 Encrypted Sync
            </div>
         </div>
      </div>

      {isUploaded && (
         <motion.div 
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           className="mt-10 p-6 bg-emerald-50 border border-emerald-100 rounded-[2.5rem] flex items-center gap-8"
        >
           <div className="h-12 w-12 bg-white rounded-xl flex items-center justify-center text-emerald-500 shadow-soft"><Activity size={20} className="animate-pulse" /></div>
           <div className="space-y-1">
              <div className="text-[9px] font-black text-emerald-600 uppercase italic tracking-widest">Active Linkage</div>
              <div className="font-dm font-black text-[#0a1628] text-sm italic">{uploadedFile?.name || 'Clinical_Authorization_Protocol.pdf'}</div>
           </div>
        </motion.div>
      )}
    </div>
  );
}
