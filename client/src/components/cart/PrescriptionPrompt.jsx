import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Upload, X, ShieldCheck, FileText, AlertCircle, CheckCircle2, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PrescriptionPrompt({ onUpload, isUploaded, uploadedFile }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="bg-white border border-red-500/20 rounded-2xl md:rounded-[4rem] p-5 md:p-12 shadow-4xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 h-40 w-40 bg-red-500 opacity-[0.02] rounded-full blur-[80px]" />
      
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-12 relative z-10">
         <div className="flex flex-col sm:flex-row items-center gap-5 md:gap-8 text-center sm:text-left min-w-0">
            <div className={`h-14 w-14 md:h-20 md:w-20 shrink-0 rounded-2xl md:rounded-[2rem] flex items-center justify-center transition-all duration-700 shadow-inner ${isUploaded ? 'bg-emerald-50 text-emerald-500' : 'bg-red-50 text-red-500 group-hover:bg-[#0a1628] group-hover:text-white'}`}>
               {isUploaded ? <ShieldCheck size={28}/> : <FileText size={28}/>}
            </div>
            <div className="space-y-2 min-w-0">
               <h3 className="font-syne font-black text-xl md:text-2xl text-[#0a1628] uppercase italic leading-tight md:leading-none flex items-center justify-center sm:justify-start gap-3 md:gap-4 break-words">
                  {isUploaded ? 'Prescription Added' : 'Prescription Required'}
                  {isUploaded && <CheckCircle2 size={20} className="text-emerald-500 animate-pulse" />}
               </h3>
               <p className="text-gray-400 font-dm italic font-bold text-sm md:text-lg leading-relaxed max-w-sm">
                  {isUploaded 
                    ? `File ${uploadedFile?.name || 'document'} uploaded successfully.`
                    : 'This cart has prescription medicines. Please upload a valid prescription.'}
               </p>
            </div>
         </div>

         <div className="flex flex-col gap-4 w-full md:w-auto">
            {!isUploaded ? (
               <Link 
                 to="/prescriptions/upload" 
                 className="h-14 md:h-20 px-6 md:px-12 bg-red-600 text-white font-syne font-black text-[10px] md:text-xs uppercase tracking-[0.16em] md:tracking-[0.4rem] italic rounded-xl md:rounded-[2.5rem] shadow-4xl flex items-center justify-center gap-3 md:gap-6 hover:scale-105 active:scale-95 transition-all duration-700 group/upload cursor-pointer"
               >
                  <Upload size={20} className="group-hover/upload:rotate-12 transition-transform" /> Upload Prescription
               </Link>
            ) : (
               <button 
                 onClick={() => onUpload(null)}
                 className="h-14 md:h-20 px-6 md:px-12 bg-[#0a1628] text-brand-teal font-syne font-black text-[10px] md:text-xs uppercase tracking-[0.16em] md:tracking-[0.4rem] italic rounded-xl md:rounded-[2.5rem] shadow-4xl flex items-center justify-center gap-3 md:gap-6 hover:bg-red-600 hover:text-white transition-all duration-700 group"
               >
                  <X size={20} className="group-hover:rotate-90 transition-transform" /> Remove Upload
               </button>
            )}
            
            <div className="flex items-center justify-center gap-3 text-[10px] font-black uppercase italic tracking-widest text-gray-300">
               <ShieldCheck size={14} className="text-emerald-500" /> Secure Upload
            </div>
         </div>
      </div>

      {isUploaded && (
         <motion.div 
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           className="mt-6 md:mt-10 p-4 md:p-6 bg-emerald-50 border border-emerald-100 rounded-2xl md:rounded-[2.5rem] flex items-center gap-4 md:gap-8"
        >
           <div className="h-12 w-12 bg-white rounded-xl flex items-center justify-center text-emerald-500 shadow-soft"><Activity size={20} className="animate-pulse" /></div>
           <div className="space-y-1">
              <div className="text-[9px] font-black text-emerald-600 uppercase italic tracking-widest">Active Linkage</div>
              <div className="font-dm font-black text-[#0a1628] text-sm italic">{uploadedFile?.name || 'Prescription.pdf'}</div>
           </div>
        </motion.div>
      )}
    </div>
  );
}
