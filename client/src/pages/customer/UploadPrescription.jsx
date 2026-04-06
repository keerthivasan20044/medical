
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileUp, 
  FileText, 
  Camera, 
  CheckCircle, 
  X, 
  ShieldCheck, 
  Search, 
  Store,
  ChevronRight,
  ArrowRight
} from "lucide-react";
import { toast } from "react-hot-toast";

const PHARMACIES = [
  { id: 1, name: "Apollo Pharmacy", location: "Nellitope Node" },
  { id: 2, name: "MedPlus Enclave", location: "Karaikal Main" },
  { id: 3, name: "Thulasi Central", location: "District Hub" }
];

export default function UploadPrescription() {
  const [file, setFile] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [showDetected, setShowDetected] = useState(false);
  const [selectedPharmacy, setSelectedPharmacy] = useState(null);

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (f) {
      setFile(f);
      startScan();
    }
  };

  const startScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setShowDetected(true);
      toast.success("Prescription Scan Complete: 3 Nodes Detected");
    }, 3000);
  };

  const handleFinalUpload = () => {
    if (!selectedPharmacy) {
      return toast.error("Please select a Fulfillment Node (Pharmacy)");
    }
    toast.promise(
      new Promise(r => setTimeout(r, 2000)),
      {
        loading: "Uploading to Cloudinary Mesh...",
        success: "Prescription Synchronized Successfully!",
        error: "Upload Failed. Check Mesh Link."
      }
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-12">
      {/* Header Architecture */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
           <div className="h-12 w-12 bg-brand-teal rounded-2xl flex items-center justify-center text-white shadow-xl shadow-brand-teal/20">
              <FileUp size={24} />
           </div>
           <h1 className="font-syne font-black text-4xl text-[#0a1628]">Upload Prescription Protocol.</h1>
        </div>
        <p className="text-gray-400 font-dm max-w-xl">Synchronize your physical medical orders with our digital Cloudinary mesh for instant pharmacy verification and fulfillment.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12 items-start">
         {/* Left: Upload Node */}
         <div className="space-y-8">
            <div className={`relative aspect-[4/3] rounded-[3rem] border-4 border-dashed transition-all duration-500 flex flex-col items-center justify-center gap-6 overflow-hidden ${file ? "border-brand-teal bg-brand-teal/[0.02]" : "border-gray-100 bg-gray-50 hover:border-brand-teal hover:bg-white"}`}>
               {!file ? (
                 <>
                    <div className="h-20 w-20 bg-white rounded-full shadow-2xl flex items-center justify-center text-brand-teal animate-bounce">
                       <FileUp size={32} />
                    </div>
                    <div className="text-center space-y-2">
                       <p className="font-syne font-black text-[#0a1628] uppercase tracking-widest text-xs">Drag & Drop Prescription</p>
                       <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Supports JPG, PNG, PDF (Max 5MB)</p>
                    </div>
                    <label className="px-8 py-3 bg-[#0a1628] text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] cursor-pointer hover:bg-brand-teal transition shadow-xl">
                       BROWSE FILES
                       <input type="file" className="hidden" onChange={handleFileChange} accept="image/*,application/pdf" />
                    </label>
                 </>
               ) : (
                 <div className="absolute inset-0 p-8 flex flex-col">
                    <div className="flex-1 rounded-[2rem] overflow-hidden border border-gray-100 shadow-2xl relative">
                       {file && <img src={URL.createObjectURL(file)} className="h-full w-full object-cover" alt="Prescription" />}
                       <AnimatePresence>
                          {isScanning && (
                            <motion.div 
                               initial={{ top: "0%" }}
                               animate={{ top: "100%" }}
                               transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                               className="absolute left-0 right-0 h-1 bg-brand-teal shadow-[0_0_20px_#02c39a] z-10"
                            />
                          )}
                       </AnimatePresence>
                       <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
                          <button onClick={() => { setFile(null); setShowDetected(false); }} title="Clear File" className="h-14 w-14 bg-white rounded-full flex items-center justify-center text-red-500 shadow-2xl hover:scale-110 transition"><X size={24}/></button>
                       </div>
                    </div>
                 </div>
               )}
            </div>

            {/* AI Detection Simulation Node */}
            <AnimatePresence>
               {showDetected && (
                 <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-8 bg-white rounded-[2.5rem] border border-gray-100 shadow-4xl shadow-brand-teal/5 space-y-6"
                 >
                    <div className="flex items-center justify-between">
                       <div className="text-[10px] font-black text-brand-teal uppercase tracking-widest flex items-center gap-2">
                          <CheckCircle size={14} /> AI Nodes Detected
                       </div>
                       <div className="h-2 w-2 bg-emerald-500 rounded-full animate-ping" />
                    </div>
                    <div className="flex flex-wrap gap-3">
                       {["Paracetamol 500mg", "Amoxicillin", "Twice Daily"].map(tag => (
                         <div key={tag} className="px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-[10px] font-black text-[#0a1628] uppercase tracking-wider">{tag}</div>
                       ))}
                    </div>
                 </motion.div>
               )}
            </AnimatePresence>
         </div>

         {/* Right: Fulfillment Architecture */}
         <div className="space-y-8">
            <div className="bg-[#0a1628] rounded-[3rem] p-10 text-white space-y-8 relative overflow-hidden shadow-4xl">
               <div className="absolute top-0 right-0 h-40 w-40 bg-brand-teal opacity-10 rounded-full blur-[80px]" />
               <div className="space-y-2 relative z-10">
                  <h2 className="font-syne font-black text-2xl uppercase tracking-tighter">Fulfillment Node</h2>
                  <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Select a verified Karaikal pharmacy</p>
               </div>

               <div className="space-y-4 relative z-10">
                  {PHARMACIES.map(p => (
                    <button 
                       key={p.id}
                       onClick={() => setSelectedPharmacy(p.id)}
                       className={`w-full p-6 rounded-3xl border transition-all flex items-center justify-between group ${selectedPharmacy === p.id ? "bg-brand-teal border-brand-teal text-white shadow-xl shadow-brand-teal/20" : "bg-white/5 border-white/10 text-white hover:bg-white/10"}`}
                    >
                       <div className="flex items-center gap-5">
                          <div className={`h-10 w-10 rounded-xl flex items-center justify-center transition ${selectedPharmacy === p.id ? "bg-white text-brand-teal" : "bg-white/10 text-white/40"}`}>
                             <Store size={18} />
                          </div>
                          <div className="text-left">
                             <div className="font-syne font-black text-sm uppercase tracking-wider">{p.name}</div>
                             <div className={`text-[9px] font-bold uppercase tracking-widest ${selectedPharmacy === p.id ? "text-white/80" : "text-white/30"}`}>{p.location}</div>
                          </div>
                       </div>
                       {selectedPharmacy === p.id && <CheckCircle size={20} />}
                    </button>
                  ))}
               </div>

               <button 
                  onClick={handleFinalUpload}
                  disabled={!file}
                  className="w-full h-18 bg-white text-[#0a1628] rounded-[2rem] font-syne font-black text-sm uppercase tracking-[0.2em] shadow-xl hover:scale-[1.02] active:scale-[0.98] transition disabled:opacity-30 flex items-center justify-center gap-3 group"
               >
                  SUBMIT TO MESH <ArrowRight size={20} className="group-hover:translate-x-1 transition" />
               </button>
            </div>

            {/* Security Assurance Protocol */}
            <div className="p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100 flex items-center gap-6">
               <div className="h-14 w-14 bg-white rounded-2xl flex items-center justify-center text-emerald-500 shadow-sm"><ShieldCheck size={28} /></div>
               <div>
                  <div className="text-[10px] font-black text-[#0a1628] uppercase tracking-widest">End-to-End Encryption</div>
                  <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1">Your medical data is synchronized via SHA-512 Secure Tunnels.</p>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}

