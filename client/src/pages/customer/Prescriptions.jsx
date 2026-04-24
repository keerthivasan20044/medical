import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, Camera, CheckCircle, Clock, Eye, Download, 
  Trash2, ShoppingBag, X, FileText, AlertCircle, Search, Filter 
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { prescriptionService } from '../../services/apiServices';
import { useLanguage } from '../../context/LanguageContext';

export default function Prescriptions() {
  const { t } = useLanguage();
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [filter, setFilter] = useState('All');
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      setLoading(true);
      const data = await prescriptionService.getMy();
      // Map API status to UI status
      const mapped = (data.items || []).map(item => ({
        id: item._id,
        doctor: item.doctorName || (item.doctor?.name) || 'Clinical Order',
        hospital: item.notes || 'Enclave Upload',
        date: new Date(item.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
        status: item.status.charAt(0).toUpperCase() + item.status.slice(1),
        medicines: item.medicines.map(m => m.name || m),
        img: item.imageUrl,
        verified: item.status === 'verified',
        verifiedBy: item.verifiedBy
      }));
      setPrescriptions(mapped);
    } catch (err) {
      toast.error(t('clinicalVaultSyncError'));
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      performRealUpload(file);
    }
  };

  const performRealUpload = async (file) => {
    setIsUploading(true);
    setUploadProgress(0);
    
    // Progress simulation while waiting for API
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => (prev < 90 ? prev + 10 : prev));
    }, 200);

    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('doctor', 'New Scan'); // Fallback
      
      const res = await prescriptionService.upload(formData);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      setTimeout(() => {
        setIsUploading(false);
        toast.success(t('rxSyncSuccess'));
        fetchPrescriptions();
      }, 500);
    } catch (err) {
      clearInterval(progressInterval);
      setIsUploading(false);
      toast.error(t('rxSyncError'));
    }
  };

  const handleDelete = async (id) => {
    try {
      await prescriptionService.delete(id);
      setPrescriptions(prescriptions.filter(p => p.id !== id));
      toast.success(t('rxRemoved'));
    } catch (err) {
      toast.error(t('rxDeleteError'));
    }
  };

  return (
    <div className="px-3 py-4 md:px-10 md:py-12 overflow-x-hidden w-full max-w-screen pb-24 md:pb-16 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-4xl font-bold text-slate-900">My Prescriptions</h1>
        <p className="text-sm text-slate-400 mt-1">Upload and manage your medical prescriptions</p>
      </div>

      {/* Upload Section */}
      <section className="bg-teal-50 border border-teal-100 rounded-2xl md:rounded-[3rem] p-4 md:p-12">
        <div className="max-w-2xl mx-auto text-center space-y-6 relative z-10">
           {!isUploading ? (
             <div 
                className="border-2 border-dashed border-teal-200 rounded-xl md:rounded-[2.5rem] p-6 md:p-16 bg-white transition-all cursor-pointer group hover:border-teal-400 min-h-[180px] flex flex-col items-center justify-center gap-3"
                onClick={() => fileInputRef.current?.click()}
             >
                <div className="h-14 w-14 md:h-20 md:w-20 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center group-hover:scale-110 group-hover:bg-teal-500 group-hover:text-white transition duration-500 shadow-lg">
                   <Upload size={24} />
                </div>
                <div className="text-center px-2">
                   <h3 className="font-syne font-black text-base md:text-2xl text-navy leading-tight">Upload Prescription</h3>
                   <p className="text-[9px] md:text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">PDF, JPG, PNG (Max 5MB)</p>
                </div>
                
                <div className="mt-6 flex flex-wrap justify-center gap-4">
                   <button className="px-6 md:px-10 py-3 md:py-5 bg-navy text-teal-400 font-syne font-black text-[10px] md:text-sm uppercase tracking-widest rounded-xl md:rounded-3xl shadow-xl hover:bg-teal-500 hover:text-white transition">
                      Upload Now
                   </button>
                   <button className="px-6 md:px-10 py-3 md:py-5 bg-white border border-gray-100 text-gray-400 font-syne font-black text-[10px] md:text-sm uppercase tracking-widest rounded-xl md:rounded-3xl hover:bg-gray-50 hover:text-teal-600 transition flex items-center gap-2">
                      <Camera size={16} /> Scan
                   </button>
                </div>
                <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} accept="image/*,.pdf" />
             </div>
           ) : (
             <div className="p-16 space-y-8 bg-white border-2 border-dashed border-[#02C39A] rounded-[3rem]">
                <div className="h-24 w-24 mx-auto bg-[#02C39A]/10 text-[#02C39A] rounded-full flex items-center justify-center relative">
                   <motion.div 
                     animate={{ rotate: 360 }}
                     transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                     className="absolute inset-0 border-4 border-[#02C39A] border-t-transparent rounded-full"
                   />
                   <FileText size={32} />
                </div>
                <div className="space-y-2">
                   <h3 className="font-syne font-black text-2xl text-[#0a1628]">{t('processingMedicalArch')}</h3>
                   <div className="text-sm font-dm font-bold text-[#02C39A]">{uploadProgress}% {t('syncedStatusLabel')}</div>
                </div>
                <div className="max-w-xs mx-auto h-3 bg-gray-100 rounded-full overflow-hidden">
                   <motion.div 
                     className="h-full bg-gradient-to-r from-[#02C39A] to-[#028090]"
                     animate={{ width: `${uploadProgress}%` }}
                   />
                </div>
                <button onClick={() => setIsUploading(false)} className="text-[10px] font-black text-red-500 uppercase tracking-widest hover:underline">{t('cancelUpload')}</button>
             </div>
           )}
        </div>
      </section>

      {/* List Section */}
      <section className="space-y-4">
         <div className="flex flex-col gap-3">
            <h2 className="text-lg font-bold text-slate-900">History</h2>
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
               {['All', 'Verified', 'Pending', 'Dispensed'].map(filterItem => (
                 <button 
                    key={filterItem}
                    onClick={() => setFilter(filterItem)}
                    className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold tracking-wide transition-all ${filter === filterItem ? 'bg-slate-900 text-teal-400' : 'bg-slate-100 text-slate-500'}`}
                 >
                    {filterItem}
                 </button>
               ))}
            </div>
         </div>

         <div className="grid gap-3">
            <AnimatePresence mode="popLayout">
               {prescriptions.map((rx, idx) => (
                 <motion.div
                    layout
                    key={rx.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-white border border-gray-100 rounded-2xl md:rounded-[3rem] p-5 md:p-10 flex flex-col md:flex-row gap-6 md:gap-10 shadow-sm hover:shadow-xl transition-all group"
                 >
                    {/* Thumbnail */}
                    <div className="h-40 md:h-56 w-full md:w-48 bg-gray-50 rounded-xl md:rounded-[2.5rem] overflow-hidden border border-gray-100 shrink-0 relative group-hover:ring-4 ring-teal-500/10 transition duration-500">
                       <img src={rx.img} alt="Rx" className="h-full w-full object-cover group-hover:scale-110 transition duration-700" />
                       <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                          <Eye className="text-white" size={24} />
                       </div>
                    </div>

                    {/* Content */}
                    <div className="grow space-y-4 md:space-y-6">
                       <div className="flex flex-wrap items-start justify-between gap-4">
                          <div className="space-y-0.5">
                             <div className="text-[9px] font-black text-teal-600 uppercase tracking-widest">{rx.id}</div>
                             <h3 className="font-syne font-black text-lg md:text-2xl text-navy group-hover:text-teal-600 transition truncate max-w-[200px] md:max-w-none">
                                {rx.doctor}
                             </h3>
                             <p className="text-xs text-gray-400 font-dm italic">{rx.hospital}</p>
                          </div>
                          <div className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 ${
                             rx.status.includes('Verified') || rx.verified ? 'bg-emerald-50 text-emerald-600' :
                             rx.status.includes('Pending') ? 'bg-amber-50 text-amber-600' : 'bg-gray-50 text-gray-400'
                          }`}>
                             {rx.verified || rx.status === 'Verified' ? <CheckCircle size={12} /> : rx.status.includes('Pending') ? <Clock size={12} /> : <AlertCircle size={12} />}
                             {rx.verified || rx.status === 'Verified' ? `Verified` : rx.status}
                          </div>
                       </div>

                       <div className="grid grid-cols-2 gap-4 py-4 border-y border-gray-50">
                          <div className="space-y-0.5">
                             <div className="text-[9px] font-black text-gray-300 uppercase tracking-widest">Date</div>
                             <div className="text-xs font-dm font-bold text-gray-600">{rx.date}</div>
                          </div>
                          <div className="space-y-0.5">
                             <div className="text-[9px] font-black text-gray-300 uppercase tracking-widest">Items</div>
                             <div className="text-xs font-dm font-bold text-navy truncate">{rx.medicines.length} Medicines</div>
                          </div>
                       </div>

                       <div className="flex flex-wrap gap-2">
                          {rx.medicines.slice(0, 3).map(m => (
                            <span key={m} className="px-3 py-1 bg-gray-50 text-navy rounded-lg text-[9px] font-black uppercase tracking-tighter border border-gray-100">
                               {m}
                            </span>
                          ))}
                          {rx.medicines.length > 3 && <span className="text-[9px] text-gray-300 font-bold self-center">+{rx.medicines.length - 3} More</span>}
                       </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-row md:flex-col gap-3 shrink-0 justify-stretch md:justify-center">
                       {rx.status === 'Verified' && (
                         <button className="flex-1 md:w-40 py-3 bg-navy text-white rounded-xl text-[10px] font-syne font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg hover:bg-teal-600 transition">
                            <ShoppingBag size={16} /> Order
                         </button>
                       )}
                       <div className="flex gap-2 flex-1 md:flex-none">
                          <button className="h-10 w-full md:w-12 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center text-gray-400 hover:bg-navy hover:text-white transition" title="Download">
                             <Download size={16} />
                          </button>
                          <button 
                             onClick={() => handleDelete(rx.id)}
                             className="h-10 w-full md:w-12 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center text-gray-400 hover:bg-red-500 hover:text-white transition"
                             title="Delete"
                          >
                             <Trash2 size={16} />
                          </button>
                       </div>
                    </div>
                 </motion.div>
               ))}
            </AnimatePresence>
         </div>
      </section>
    </div>
  );
}
