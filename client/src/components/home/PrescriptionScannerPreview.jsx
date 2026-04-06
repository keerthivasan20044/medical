import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { 
  FileText, Upload, CheckCircle, Zap, ShieldCheck, 
  Search, Pill, Activity, Terminal, ExternalLink 
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext.jsx';
import prescriptionImg from '../../assets/images/prescription-ocr.png';

export default function PrescriptionScannerPreview() {
  const { t } = useLanguage();
  const [scanning, setScanning] = useState(false);
  const [step, setStep] = useState(0);

  const STEPS = [
    { title: 'Optical_Sync_Start', icon: FileText, color: 'text-brand-teal' },
    { title: 'Neural_Layer_Scan', icon: Search, color: 'text-blue-500' },
    { title: 'Node_Auth_Link', icon: ShieldCheck, color: 'text-emerald-500' },
    { title: 'Enclave_Inventory_Match', icon: Zap, color: 'text-amber-500' }
  ];

  useEffect(() => {
    if (scanning) {
      const interval = setInterval(() => {
        setStep(s => {
          if (s >= STEPS.length - 1) {
            setScanning(false);
            return 0;
          }
          return s + 1;
        });
      }, 1500);
      return () => clearInterval(interval);
    }
  }, [scanning]);

  return (
    <section className="py-24 lg:py-40 bg-gray-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-32 items-center">
          
          <div className="space-y-12 md:space-y-16">
            <div className="space-y-6 md:space-y-8 text-center lg:text-left">
              <div className="inline-flex items-center gap-4 px-6 py-2 bg-[#0a1628]/5 border border-black/5 rounded-full text-[#0a1628] font-syne font-black text-[10px] uppercase tracking-[0.4em] italic shadow-inner mx-auto lg:mx-0">
                <Terminal size={14} className="text-brand-teal" /> Neural_Vision_v2.0
              </div>
              <h2 className="font-syne font-black text-[#0a1628] text-4xl md:text-6xl lg:text-8xl leading-[0.9] uppercase italic tracking-tighter mx-auto lg:mx-0">
                Smart Node <br /><span className="text-brand-teal">OCR Scanner.</span>
              </h2>
              <p className="text-gray-400 font-dm text-lg md:text-2xl italic font-bold max-w-xl leading-relaxed mx-auto lg:mx-0">
                Upload any handwritten prescription. Our district-wide neural network identifies medicine nodes and synchronizes with local terminal stocks instantly.
              </p>
            </div>

            <div className="space-y-8">
               {[
                 { label: 'Neural Accuracy', val: '98.9% Pulse', icon: Activity },
                 { label: 'Latency', icon: Zap, val: '0.4s Sync' },
                 { label: 'Protocol Match', icon: ShieldCheck, val: '128 District Nodes' }
               ].map((f, i) => (
                 <div key={i} className="flex items-center gap-8 group justify-center lg:justify-start">
                    <div className="h-14 w-14 bg-white rounded-2xl flex items-center justify-center text-[#0a1628] shadow-soft group-hover:bg-brand-teal transition-all duration-500">
                       <f.icon size={26} />
                    </div>
                    <div className="space-y-0.5 text-left">
                       <div className="text-[10px] font-black text-gray-300 uppercase tracking-widest italic">{f.label}</div>
                       <div className="text-xl font-syne font-black text-[#0a1628] uppercase italic tracking-tighter">{f.val}</div>
                    </div>
                 </div>
               ))}
            </div>

            <button 
              onClick={() => setScanning(true)}
              className="h-20 px-12 bg-[#0a1628] text-white rounded-[2rem] font-syne font-black text-xs uppercase tracking-[0.3em] italic flex items-center gap-6 hover:bg-brand-teal transition-all shadow-4xl group mx-auto lg:mx-0"
            >
              Initialize Scanner Protocol <Upload size={20} className="group-hover:-translate-y-2 transition-transform" />
            </button>
          </div>

          <div className="relative">
             {/* Scanner HUD Interaction */}
             <div className="bg-white p-6 md:p-12 rounded-[2.5rem] md:rounded-[5rem] border-8 border-gray-100 shadow-[0_60px_120px_rgba(10,22,40,0.1)] relative overflow-hidden min-h-[400px] md:min-h-[600px] flex flex-col items-center justify-center text-center group">
                
                <AnimatePresence mode="wait">
                   {!scanning ? (
                     <motion.div 
                       key="idle"
                       initial={{ opacity: 0, scale: 0.9 }}
                       animate={{ opacity: 1, scale: 1 }}
                       exit={{ opacity: 0, scale: 0.9 }}
                       className="space-y-12"
                     >
                        <div className="relative">
                           <div className="h-40 w-40 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-200 mx-auto relative overflow-hidden group-hover:scale-110 transition-transform duration-700">
                              <FileText size={64} />
                              <div className="absolute inset-0 bg-brand-teal/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                           </div>
                           <motion.div 
                              animate={{ y: [0, 40, 0] }}
                              transition={{ repeat: Infinity, duration: 4 }}
                              className="absolute -right-8 -bottom-4 h-16 w-16 bg-brand-teal text-[#0a1628] rounded-2xl flex items-center justify-center shadow-4xl border-4 border-white"
                           >
                              <Search size={24} />
                           </motion.div>
                        </div>
                        <div className="space-y-4">
                           <h3 className="font-syne font-black text-3xl text-[#0a1628] uppercase italic">Scan Enclave Nodes</h3>
                           <p className="text-gray-300 text-sm font-bold font-dm uppercase tracking-widest">Awaiting Pulse Upload...</p>
                        </div>
                     </motion.div>
                   ) : (
                     <motion.div 
                       key="scanning"
                       initial={{ opacity: 0 }}
                       animate={{ opacity: 1 }}
                       exit={{ opacity: 0 }}
                       className="w-full space-y-12"
                     >
                        <div className="relative h-64 w-full bg-gray-50 rounded-3xl overflow-hidden border border-gray-100 shadow-inner group">
                           <img src={prescriptionImg} className="h-full w-full object-cover opacity-40 grayscale group-hover:grayscale-0 transition duration-1000" />
                           
                           {/* Neural Scan Line */}
                           <motion.div 
                              animate={{ top: ['0%', '100%'] }}
                              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                              className="absolute left-0 right-0 h-1 bg-brand-teal shadow-[0_0_20px_#02C39A] z-20"
                           />

                           {/* Detected Blocks */}
                           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} className="absolute top-[20%] left-[10%] h-12 w-40 bg-brand-teal/20 backdrop-blur-sm border border-brand-teal/30 flex items-center px-4">
                              <span className="text-[8px] font-black text-brand-teal uppercase tracking-widest">PARACETAMOL_NODE</span>
                           </motion.div>
                           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} transition={{delay: 0.5}} className="absolute top-[50%] right-[10%] h-10 w-32 bg-brand-teal/20 backdrop-blur-sm border border-brand-teal/30 flex items-center px-4">
                              <span className="text-[8px] font-black text-brand-teal uppercase tracking-widest">DOLO_SYNC</span>
                           </motion.div>
                        </div>

                        <div className="space-y-8">
                           <div className="flex items-center justify-center gap-4 md:gap-10 overflow-x-auto pb-4 md:pb-0 no-scrollbar">
                              {STEPS.map((s, i) => (
                                <div key={i} className="flex flex-col items-center gap-3 shrink-0">
                                   <div className={`h-10 w-10 md:h-12 md:w-12 rounded-xl flex items-center justify-center transition-all duration-500 ${step >= i ? `${s.color} bg-white shadow-xl` : 'bg-gray-50 text-gray-200'}`}>
                                      <s.icon size={step >= i ? 18 : 16} className={step === i ? 'animate-pulse' : ''} />
                                   </div>
                                   <div className={`text-[7px] md:text-[8px] font-black uppercase tracking-widest italic transition-all ${step >= i ? 'text-[#0a1628]' : 'text-gray-200'}`}>{s.title}</div>
                                </div>
                              ))}
                           </div>
                           <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                              <motion.div 
                                 animate={{ width: `${(step + 1) * 25}%` }}
                                 className="h-full bg-brand-teal shadow-[0_0_10px_#02C39A]"
                              />
                           </div>
                        </div>
                     </motion.div>
                   )}
                </AnimatePresence>

                {/* Simulated Results Enclave */}
                {scanning && step === 3 && (
                   <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-8 p-6 bg-emerald-50 rounded-2xl border border-emerald-100 w-full flex items-center justify-between"
                   >
                      <div className="flex items-center gap-4 text-emerald-600">
                         <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center shadow-sm"><Zap size={20}/></div>
                         <div className="text-left">
                            <div className="text-[10px] font-black uppercase tracking-widest leading-none">Status</div>
                            <div className="text-sm font-black font-syne uppercase italic">Nodes Identified & Synced</div>
                         </div>
                      </div>
                      <ExternalLink size={18} className="text-emerald-300" />
                   </motion.div>
                )}

                {/* HUD Corner Data */}
                <div className="absolute top-8 left-8 text-[8px] font-black text-gray-200 uppercase tracking-[0.4em] italic leading-none">Neural_Vision_0.2.2</div>
                <div className="absolute top-8 right-8 text-[8px] font-black text-gray-200 uppercase tracking-[0.4em] italic leading-none">Karaikal_Enclave</div>
             </div>

             {/* Floor Decoration */}
             <div className="absolute -bottom-20 -left-20 h-64 w-64 bg-brand-teal/5 rounded-full blur-[100px] -z-10" />
          </div>

        </div>
      </div>
    </section>
  );
}
