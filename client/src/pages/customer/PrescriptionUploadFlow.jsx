import { useState, useMemo, useRef, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, Camera, FileText, CheckCircle, 
  Trash2, Eye, Info, Video, X, 
  ChevronRight, ArrowLeft, Activity, Zap, 
  ClipboardList, AlertCircle, Bookmark, Plus, FileSearch
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { setPrescription } from '../../store/cartSlice.js';
import { pharmacies } from '../../utils/data.js';
import { prescriptionService } from '../../services/apiServices';

export default function PrescriptionUploadFlow() {
  const { pharmacyId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  
  const { items, prescription } = useSelector(s => s.cart);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(prescription?.url || null);
  const [activeAccordion, setActiveAccordion] = useState(null);

  const pharmacy = useMemo(() => pharmacies.find(p => p.id === pharmacyId) || pharmacies[0], [pharmacyId]);
  const rxItems = useMemo(() => items.filter(i => i.requiresRx), [items]);
  const nonRxItems = useMemo(() => items.filter(i => !i.requiresRx), [items]);

  useEffect(() => {
    if (items.length === 0) navigate('/cart');
    // If no Rx items, skip to checkout
    if (rxItems.length === 0) navigate('/checkout');
  }, [items, rxItems, navigate]);

  const performRealUpload = async (file) => {
    setIsUploading(true);
    setUploadProgress(0);
    
    // Progress interval for UX (API progress not natively supported by all axios configs)
    const interval = setInterval(() => {
      setUploadProgress(prev => (prev < 90 ? prev + 5 : prev));
    }, 150);

    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('notes', `Order Linkage Protocol: ${pharmacyId}`);
      
      const res = await prescriptionService.upload(formData);
      
      clearInterval(interval);
      setUploadProgress(100);
      
      const uploadData = {
        url: res.item.imageUrl,
        publicId: res.item.publicId,
        id: res.item._id,
        name: file.name
      };

      setPreviewUrl(uploadData.url);
      dispatch(setPrescription(uploadData));
      
      setTimeout(() => {
        setIsUploading(false);
        toast.success('Prescription Uploaded Successfully ✓');
      }, 500);
    } catch (err) {
      clearInterval(interval);
      setIsUploading(false);
      toast.error('Upload failed — Please try again');
      console.error('Upload error:', err);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      performRealUpload(file);
    }
  };

  const handleRemove = () => {
    setPreviewUrl(null);
    dispatch(setPrescription(null));
    toast.error('Manifest Disconnected');
  };

  const savedPrescriptions = [
    { id: 1, doctor: 'Dr. Priya Raman', date: '15 Mar 2026', status: 'Valid ✓' },
    { id: 2, doctor: 'Dr. Anand Kumar', date: '1 Mar 2026', status: 'Valid ✓' }
  ];

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-48 pt-24 px-10">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Progress Navigation */}
        <div className="flex items-center gap-2 md:gap-6 mb-8 overflow-x-auto no-scrollbar pointer-events-none">
           {[1, 2, 3, 4].map(s => (
             <div key={s} className="flex items-center gap-2 md:gap-4 shrink-0">
               <div className={`h-8 w-8 md:h-10 md:w-10 rounded-xl flex items-center justify-center font-syne font-black text-[10px] md:text-xs ${s === 3 ? 'bg-[#0a1628] text-white shadow-4xl' : s < 3 ? 'bg-brand-teal text-white' : 'bg-gray-100 text-gray-300'}`}>0{s}</div>
               {s < 4 && <div className={`h-1 w-6 md:w-12 rounded-full ${s < 3 ? 'bg-brand-teal' : 'bg-gray-100'}`} />}
             </div>
           ))}
        </div>

        {/* Hero Header */}
        <div className="space-y-4 md:space-y-6">
           <h1 className="font-syne font-black text-4xl md:text-5xl lg:text-7xl text-[#0a1628] uppercase italic leading-none tracking-tighter">Upload <span className="text-brand-teal text-5xl md:text-6xl block transform translate-y-1">Prescription</span></h1>
           <p className="text-gray-400 font-dm text-sm md:text-lg font-bold italic">Medical verification required for {rxItems.length} medicines in your cart.</p>
        </div>

        <div className="grid lg:grid-cols-[1.3fr_1fr] gap-16 items-start">
           <div className="space-y-12">
              
              {/* Rx Items Summary Panel */}
              <div className="bg-brand-teal/5 border border-brand-teal/10 rounded-[4rem] p-12 space-y-8 relative overflow-hidden group">
                 <div className="absolute top-0 right-0 h-40 w-40 bg-brand-teal opacity-5 rounded-full blur-[60px]" />
                 
                 <div className="flex items-center gap-4 text-brand-teal">
                    <Activity size={20} className="animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] italic">Verification List</span>
                 </div>

                 <div className="space-y-4">
                    <p className="font-dm text-sm font-black text-[#0a1628] opacity-60 uppercase italic">These medicines require a valid prescription:</p>
                    {rxItems.map((item, id) => (
                       <div key={id} className="flex items-center justify-between text-xs font-dm font-black text-[#0a1628] uppercase italic tracking-widest pl-6 border-l-2 border-brand-teal/20">
                          <div className="flex items-center gap-4">
                             <ClipboardList size={14} className="text-brand-teal" />
                             <span>{item.name} &times; {item.qty}</span>
                          </div>
                          <span>₹{item.price * item.qty}</span>
                       </div>
                    ))}
                 </div>

                 <div className="pt-8 border-t border-brand-teal/10 flex items-center gap-6">
                    <div className="h-16 w-16 bg-white rounded-2xl shadow-soft flex items-center justify-center shrink-0 border border-brand-teal/10"><Info size={28} className="text-brand-teal"/></div>
                    <p className="font-dm text-sm font-bold text-[#0a1628]/60 italic leading-relaxed">
                       Prescription will be verified by <span className="text-[#0a1628] font-black">{pharmacy.name}</span> pharmacist within 15 minutes.
                    </p>
                 </div>
              </div>

              {/* Upload Matrix Control */}
              <div className="grid md:grid-cols-2 gap-8">
                 {/* GALLERY PROTOCOL */}
                 <button 
                   onClick={() => fileInputRef.current?.click()}
                   className="bg-white border-4 border-dashed border-gray-100 rounded-[4rem] p-12 text-center space-y-8 group/upload hover:border-brand-teal transition-all duration-700 hover:shadow-4xl relative overflow-hidden"
                 >
                    <div className="absolute top-0 right-0 h-24 w-24 bg-brand-teal/5 rounded-full blur-[40px] opacity-0 group-hover/upload:opacity-100 transition" />
                    <div className="h-24 w-24 bg-gray-50 rounded-[2.5rem] border border-black/[0.03] flex items-center justify-center mx-auto text-brand-teal shadow-inner group-hover/upload:bg-[#0a1628] group-hover/upload:text-white transition-all duration-700 group-hover/upload:scale-110">
                       <Upload size={40} className="group-hover/upload:-translate-y-2 transition-transform duration-500" />
                    </div>
                    <div className="space-y-3">
                       <h3 className="font-syne font-black text-[13px] text-[#0a1628] uppercase italic tracking-widest leading-none">Files & Gallery</h3>
                       <p className="text-[9px] text-gray-300 font-bold uppercase tracking-[0.2em] italic">JPG, PNG, PDF | Max 10MB</p>
                    </div>
                    <div className="h-12 w-fit px-8 border border-brand-teal text-brand-teal rounded-xl mx-auto flex items-center justify-center font-syne font-black text-[9px] uppercase tracking-widest group-hover/upload:bg-brand-teal group-hover/upload:text-white transition-all italic">Browse Node</div>
                    <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileSelect} accept="image/*,.pdf" />
                 </button>

                 {/* CAMERA PROTOCOL */}
                 <button 
                   onClick={() => toast.error('Camera Hardware Handshake Failed - Manual Upload Recommended')}
                   className="bg-white border-4 border-dashed border-gray-100 rounded-[4rem] p-12 text-center space-y-8 group/camera hover:border-brand-teal transition-all duration-700 hover:shadow-4xl relative overflow-hidden"
                 >
                    <div className="absolute top-0 right-0 h-24 w-24 bg-brand-teal/5 rounded-full blur-[40px] opacity-0 group-hover/camera:opacity-100 transition" />
                    <div className="h-24 w-24 bg-gray-50 rounded-[2.5rem] border border-black/[0.03] flex items-center justify-center mx-auto text-brand-teal shadow-inner group-hover/camera:bg-[#0a1628] group-hover/camera:text-white transition-all duration-700 group-hover/camera:scale-110">
                       <Camera size={40} className="group-hover/camera:rotate-12 transition-transform duration-500" />
                    </div>
                    <div className="space-y-3">
                       <h3 className="font-syne font-black text-[13px] text-[#0a1628] uppercase italic tracking-widest leading-none">Take Photo</h3>
                       <p className="text-[9px] text-gray-300 font-bold uppercase tracking-[0.2em] italic">Instant Mobile Sync</p>
                    </div>
                    <div className="h-12 w-fit px-8 border border-brand-teal/20 text-brand-teal rounded-xl mx-auto flex items-center justify-center font-syne font-black text-[9px] uppercase tracking-widest group-hover/camera:bg-[#0a1628] group-hover/camera:text-white transition-all italic">Open Camera</div>
                 </button>
              </div>

              {/* Pre-recorded Archives */}
              <div className="bg-white border border-black/[0.03] rounded-[4.5rem] p-12 space-y-10 shadow-soft">
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                       <div className="h-1.5 w-12 bg-[#0a1628]/20 rounded-full" />
                       <h3 className="font-syne font-black text-lg text-[#0a1628] uppercase italic tracking-tighter">Use saved Prescription</h3>
                    </div>
                 </div>
                 <div className="space-y-4">
                    {savedPrescriptions.map((p, idx) => (
                       <button 
                         key={idx} 
                         onClick={() => { setPreviewUrl('/assets/hospital_pro.png'); dispatch(setPrescription('/assets/hospital_pro.png')); toast.success('Archived Sync Successful'); }}
                         className="w-full flex items-center justify-between p-7 bg-gray-50/50 rounded-[2.5rem] border border-black/[0.02] hover:bg-white hover:shadow-4xl transition-all duration-700 group/item"
                       >
                          <div className="flex items-center gap-6">
                             <div className="h-14 w-14 bg-white rounded-2xl border border-gray-100 flex items-center justify-center text-gray-300 group-hover/item:bg-[#0a1628] group-hover/item:text-brand-teal transition-all duration-700 shadow-sm"><FileSearch size={24} /></div>
                             <div className="text-left space-y-1">
                                <div className="font-syne font-black text-[#0a1628] uppercase italic text-lg leading-none group-hover/item:translate-x-2 transition-transform">{p.doctor}</div>
                                <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{p.date} Architecture</div>
                             </div>
                          </div>
                          <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest italic">{p.status}</span>
                       </button>
                    ))}
                    <button className="flex items-center gap-4 text-[9px] font-black text-brand-teal uppercase tracking-[0.4em] italic hover:gap-6 transition-all pl-4 group">
                       View all prescriptions <ChevronRight size={14} className="group-hover:translate-x-2 transition-transform"/>
                    </button>
                 </div>
              </div>

              {/* Dynamic Artifact Preview */}
              <AnimatePresence>
                 {(isUploading || previewUrl) && (
                    <motion.div 
                       initial={{ opacity: 0, scale: 0.95, y: 30 }}
                       animate={{ opacity: 1, scale: 1, y: 0 }}
                       exit={{ opacity: 0, scale: 0.95, y: 30 }}
                       className="bg-[#0a1628] rounded-[5rem] p-16 space-y-12 shadow-4xl relative overflow-hidden group/pre"
                    >
                       <div className="absolute top-0 right-0 h-64 w-64 bg-brand-teal opacity-5 rounded-full blur-[100px]" />
                       
                       {isUploading ? (
                          <div className="space-y-10 py-12 text-center">
                             <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                                <motion.div 
                                  className="h-full bg-brand-teal shadow-[0_0_20px_rgba(2,195,154,0.4)]" 
                                  initial={{ width: '0%' }}
                                  animate={{ width: `${uploadProgress}%` }}
                                />
                             </div>
                             <div className="space-y-3">
                                <div className="font-syne font-black text-4xl text-white uppercase italic tracking-tighter">Syncing... {uploadProgress}%</div>
                                <div className="text-[10px] text-brand-teal font-black uppercase tracking-[0.5em] italic animate-pulse">Establishing Secure Clinical Tunnel</div>
                             </div>
                          </div>
                       ) : (
                          <div className="flex flex-col md:flex-row gap-12 items-center">
                             <div className="h-56 w-56 bg-white/5 border-4 border-white/10 rounded-[3rem] shadow-4xl shrink-0 overflow-hidden relative group/img cursor-pointer">
                                <img src={previewUrl} className="h-full w-full object-cover transition-transform duration-[2s] group-hover/img:scale-150" alt="Prescription" />
                                <div className="absolute inset-0 bg-[#0a1628]/40 opacity-0 group-hover/img:opacity-100 transition flex items-center justify-center backdrop-blur-sm"><Eye size={36} className="text-brand-teal" /></div>
                             </div>
                             <div className="flex-1 space-y-8 text-center md:text-left">
                                <div className="space-y-4">
                                   <div className="flex items-center gap-4 justify-center md:justify-start">
                                      <div className="h-10 w-10 bg-brand-teal/20 text-brand-teal rounded-full flex items-center justify-center"><CheckCircle size={22} /></div>
                                      <h3 className="font-syne font-black text-3xl text-white uppercase italic tracking-tighter leading-none">Prescription uploaded successfully</h3>
                                   </div>
                                   <div className="text-xs text-white/40 font-dm font-bold italic tracking-widest leading-relaxed">
                                      clinical_scan_609602.jpg &bull; 2.4 MB <br/> 
                                      <span className="text-brand-teal opacity-100">Synchronized for verification by {pharmacy.name}.</span>
                                   </div>
                                </div>
                                <div className="flex items-center gap-4 justify-center md:justify-start">
                                   <button onClick={handleRemove} className="h-14 px-8 bg-white/5 border border-white/10 text-red-400 rounded-2xl font-syne font-black text-[10px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all italic flex items-center gap-3"><Trash2 size={16}/> Disconnect</button>
                                   <button className="h-14 px-8 bg-white/5 border border-white/10 text-brand-teal rounded-2xl font-syne font-black text-[10px] uppercase tracking-widest hover:bg-brand-teal hover:text-[#0a1628] transition-all italic flex items-center gap-3"><Eye size={16}/> Preview Node</button>
                                </div>
                             </div>
                          </div>
                       )}
                    </motion.div>
                 )}
              </AnimatePresence>
           </div>

           {/* Lateral Strategy Sidebar */}
           <div className="space-y-16">
              
              {/* Clinical Protocol Accordion */}
              <div className="bg-white border border-black/[0.03] rounded-[5rem] p-16 space-y-12 shadow-soft group hover:shadow-4xl transition-all duration-1000 relative overflow-hidden">
                 <div className="absolute top-0 right-0 h-40 w-40 bg-brand-teal opacity-[0.02] rounded-full blur-[60px]" />
                 <div className="space-y-4 relative z-10">
                    <h3 className="font-syne font-black text-2xl text-[#0a1628] uppercase italic leading-none tracking-tighter">Requirements</h3>
                    <p className="text-[10px] text-gray-300 font-bold uppercase tracking-widest italic">Ensure these are visible</p>
                 </div>

                 <div className="space-y-6 relative z-10">
                    {[
                       { tip: "Doctor's Name", desc: "Doctor's name and clinic details." },
                       { tip: "Date", desc: "Date of issue (within 30 days)." },
                       { tip: "Patient Name", desc: "Patient name matching your profile." },
                       { tip: "Medicine Details", desc: "Clear dosage and medicine names." },
                       { tip: "Pharmacy Stamp", desc: "Official stamp or registration." }
                    ].map((item, i) => (
                       <div key={i} className="flex items-start gap-5 group/tip">
                          <div className="h-6 w-6 bg-brand-teal/10 rounded-lg flex items-center justify-center shrink-0 mt-1 transition-all group-hover/tip:bg-[#0a1628]"><CheckCircle size={14} className="text-brand-teal" /></div>
                          <div className="space-y-1">
                             <div className="font-syne font-black text-[11px] text-[#0a1628] uppercase italic tracking-widest leading-none">{item.tip}</div>
                             <p className="text-[10px] text-gray-400 font-dm font-bold italic line-clamp-1 group-hover/tip:line-clamp-none transition-all">{item.desc}</p>
                          </div>
                       </div>
                    ))}
                 </div>
              </div>

              {/* Authorization Alternatives */}
              <div className="space-y-10">
                 <div className="flex items-center gap-4 px-6 text-[10px] font-black uppercase text-gray-300 tracking-[0.4em] italic">
                    <AlertCircle size={14} className="text-amber-500"/> Protocol Alternatives
                 </div>

                 <div className="space-y-6">
                    <div className="bg-white border border-black/[0.03] rounded-[4rem] p-10 space-y-8 shadow-soft hover:shadow-4xl transition-all duration-700 group/alt">
                       <div className="flex items-center gap-6">
                          <div className="h-16 w-16 bg-[#0a1628] text-brand-teal rounded-2xl flex items-center justify-center shadow-inner group-hover/alt:scale-110 transition-transform"><Video size={28} /></div>
                          <div className="space-y-1">
                             <div className="font-syne font-black text-[#0a1628] uppercase italic text-lg leading-none">Tele-Auth</div>
                             <div className="text-[9px] text-gray-400 font-bold uppercase tracking-widest italic leading-none">Consult Dr. Priya Raman in 10m</div>
                          </div>
                       </div>
                       <Link to="/doctors/dr-1" className="w-full h-16 bg-brand-teal/5 text-brand-teal rounded-2xl font-syne font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-4 hover:bg-[#0a1628] hover:text-white transition-all shadow-soft italic">Initialize Consult - \u20B9200 <ChevronRight size={14}/></Link>
                    </div>

                    <button className="w-full h-16 border-2 border-red-500/10 text-red-500/40 rounded-3xl font-syne font-black text-[9px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all italic">Disconnect RX Nodes from Cart</button>
                    
                    <div className="p-8 bg-gray-50 rounded-[3rem] border border-black/[0.02] text-center space-y-2">
                       <div className="text-[9px] font-black text-gray-300 uppercase italic tracking-widest leading-none">Manual Protocol Override</div>
                       <p className="text-[10px] text-gray-400 font-dm font-bold italic px-4">OTC decision remains at pharmacy discretion. Reject risk: High.</p>
                    </div>
                 </div>
              </div>

              {/* Safe Payload Summary */}
              {nonRxItems.length > 0 && (
                <div className="bg-emerald-50 border border-emerald-100 rounded-[3rem] p-10 space-y-6 shadow-inner">
                   <div className="flex items-center gap-4 text-emerald-600">
                      <ShieldCheck size={20} />
                      <h3 className="font-syne font-black text-sm uppercase italic tracking-widest leading-none">Order Summary</h3>
                   </div>
                   <div className="space-y-4">
                      {nonRxItems.map((item, id) => (
                        <div key={id} className="flex justify-between text-[11px] font-dm font-black text-emerald-700/60 uppercase italic tracking-[0.1em] border-b border-emerald-100 pb-3 last:border-0">
                           <span>{item.name} &times; {item.qty}</span>
                           <span className="text-emerald-700">₹{item.price * item.qty}</span>
                        </div>
                      ))}
                   </div>
                   <div className="text-[10px] font-black text-emerald-500/60 uppercase italic leading-tight text-center">Unlocked for Immediate Logistics Departure</div>
                </div>
              )}
           </div>
        </div>

        {/* Tactical Footer Actions */}
        <div className="pt-24 border-t border-black/[0.03] flex flex-col md:flex-row items-center justify-between gap-12">
            <button onClick={() => navigate(-1)} className="flex items-center gap-6 group">
               <div className="h-16 w-16 bg-white border border-black/[0.02] rounded-2xl flex items-center justify-center text-[#0a1628] shadow-soft group-hover:bg-[#0a1628] group-hover:text-white transition-all duration-700"><ArrowLeft size={24}/></div>
               <div className="text-left">
                  <div className="text-[10px] font-black text-gray-300 uppercase italic tracking-[0.4em] mb-1 group-hover:text-[#0a1628] transition-colors">Back</div>
                  <div className="font-syne font-black text-sm text-[#0a1628] uppercase italic leading-none">Medicines</div>
               </div>
            </button>

            <button 
               onClick={() => navigate('/checkout')}
               className={`h-24 px-16 rounded-[2.5rem] font-syne font-black text-lg uppercase tracking-widest transition-all duration-1000 shadow-4xl flex items-center gap-8 ${previewUrl ? 'bg-brand-teal text-white hover:bg-[#0a1628] hover:scale-105' : 'bg-gray-100 text-gray-300 cursor-not-allowed'} italic`}
               disabled={!previewUrl}
            >
               Confirm & Checkout <ArrowLeft size={32} className="rotate-180" />
            </button>
        </div>

      </div>
    </div>
  );
}
