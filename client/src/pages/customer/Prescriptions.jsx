import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, Camera, CheckCircle, Clock, Eye, Download, 
  Trash2, ShoppingBag, X, FileText, AlertCircle, Search, Filter 
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { prescriptionService } from '../../services/apiServices';
import { useLanguage } from '../../context/LanguageContext.jsx';

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
    <div className="max-w-6xl mx-auto space-y-10 pb-20 pt-10 px-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-syne font-black text-4xl text-[#0a1628]">{t('myPrescriptions')}</h1>
          <p className="text-gray-400 mt-2 font-dm italic">{t('prescriptionVaultDesc')}</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="p-3 bg-white border border-gray-100 rounded-2xl shadow-sm text-gray-400"><Search size={18} /></div>
           <div className="p-3 bg-white border border-gray-100 rounded-2xl shadow-sm text-gray-400"><Filter size={18} /></div>
        </div>
      </div>

      {/* Upload Section */}
      <section className="bg-[#028090]/5 border border-[#028090]/10 rounded-[3rem] p-8 md:p-12">
        <div className="max-w-2xl mx-auto text-center space-y-8 relative z-10">
           {!isUploading ? (
             <div 
               className="border-2 border-dashed border-[#028090]/30 rounded-[3rem] p-16 bg-white transition-all cursor-pointer group hover:border-[#02C39A] hover:shadow-2xl hover:shadow-[#028090]/5"
               onClick={() => fileInputRef.current?.click()}
               onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('border-[#02C39A]', 'bg-gray-50'); }}
               onDragLeave={(e) => { e.preventDefault(); e.currentTarget.classList.remove('border-[#02C39A]', 'bg-gray-50'); }}
               onDrop={(e) => { e.preventDefault(); e.currentTarget.classList.remove('border-[#02C39A]', 'bg-gray-50'); performRealUpload(e.dataTransfer.files[0]); }}
             >
                <div className="h-24 w-24 mx-auto bg-[#028090]/10 text-[#028090] rounded-full flex items-center justify-center group-hover:scale-110 group-hover:bg-[#02C39A] group-hover:text-white transition duration-500 mb-8 shadow-xl shadow-[#028090]/10">
                   <Upload size={48} />
                </div>
                <h3 className="font-syne font-black text-2xl text-[#0a1628]">{t('dragPrescription')}</h3>
                <p className="text-gray-400 font-dm text-sm mt-2 font-bold uppercase tracking-widest leading-none">{t('acceptedFormats')}</p>
                
                <div className="mt-10 flex flex-wrap justify-center gap-6">
                   <button className="px-10 py-5 bg-gradient-to-r from-[#02C39A] to-[#028090] text-white font-syne font-black text-sm uppercase tracking-widest rounded-3xl shadow-2xl shadow-[#02C39A]/40 hover:scale-105 active:scale-95 transition">
                      {t('uploadNow')} &rarr;
                   </button>
                   <button className="px-10 py-5 bg-white border border-gray-100 text-gray-400 font-syne font-black text-sm uppercase tracking-widest rounded-3xl hover:bg-gray-50 hover:text-[#028090] transition flex items-center gap-3">
                      <Camera size={20} /> {t('cameraCapture')}
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
      <section className="space-y-8">
         <div className="flex items-center justify-between border-b border-gray-50 pb-6">
            <h2 className="font-syne font-black text-3xl text-[#0a1628]">{t('myHistory')}</h2>
            <div className="flex gap-2">
               {['All', 'Verified', 'Pending', 'Dispensed'].map(filterItem => (
                 <button 
                    key={filterItem}
                    onClick={() => setFilter(filterItem)}
                    className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${filter === filterItem ? 'bg-[#0a1628] text-white shadow-xl' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
                 >
                    {filterItem}
                 </button>
               ))}
            </div>
         </div>

         <div className="grid gap-8">
            <AnimatePresence mode="popLayout">
               {prescriptions.map((rx, idx) => (
                 <motion.div
                    layout
                    key={rx.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-white border border-gray-100 rounded-[3rem] p-8 md:p-10 flex flex-col md:flex-row gap-10 shadow-sm hover:shadow-2xl hover:border-[#028090]/20 transition-all group"
                 >
                    {/* Thumbnail */}
                    <div className="h-56 w-full md:w-48 bg-gray-50 rounded-[2.5rem] overflow-hidden border border-gray-100 shrink-0 relative group-hover:ring-4 ring-[#02C39A]/10 transition duration-500">
                       <img src={rx.img} alt="Rx" className="h-full w-full object-cover group-hover:scale-110 transition duration-700" />
                       <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                          <Eye className="text-white" size={32} />
                       </div>
                    </div>

                    {/* Content */}
                    <div className="grow space-y-6">
                       <div className="flex flex-wrap items-start justify-between gap-6">
                          <div className="space-y-1">
                             <div className="text-[10px] font-black text-[#028090] uppercase tracking-[0.2em]">{rx.id}</div>
                             <h3 className="font-syne font-black text-2xl text-[#0a1628] leading-tight group-hover:text-[#028090] transition">
                                {rx.doctor}
                             </h3>
                             <p className="text-sm text-gray-400 font-dm italic">{rx.hospital}</p>
                          </div>
                          <div className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${
                             rx.status.includes('Verified') || rx.verified ? 'bg-emerald-50 text-emerald-600 shadow-sm shadow-emerald-600/10' :
                             rx.status.includes('Pending') ? 'bg-amber-50 text-amber-600' : 'bg-gray-50 text-gray-400'
                          }`}>
                             {rx.verified || rx.status === 'Verified' ? <CheckCircle size={14} /> : rx.status.includes('Pending') ? <Clock size={14} /> : <AlertCircle size={14} />}
                             {rx.verified || rx.status === 'Verified' ? `${t('verifiedBy')} ${rx.verifiedBy || t('pharmacist')}` : t(rx.status.toLowerCase()) || rx.status}
                          </div>
                       </div>

                       <div className="grid sm:grid-cols-2 gap-8 py-6 border-y border-gray-50">
                          <div className="space-y-1">
                             <div className="text-[10px] font-black text-gray-300 uppercase tracking-widest">{t('prescribedDate')}</div>
                             <div className="text-sm font-dm font-bold text-gray-600">{rx.date}</div>
                          </div>
                          {rx.expiry && (
                            <div className="space-y-1">
                               <div className="text-[10px] font-black text-gray-300 uppercase tracking-widest">{t('expiresOn')}</div>
                               <div className="text-sm font-dm font-bold text-red-500">{rx.expiry}</div>
                            </div>
                          )}
                          {!rx.expiry && rx.status === 'Dispensed (used)' && (
                            <div className="space-y-1">
                               <div className="text-[10px] font-black text-gray-300 uppercase tracking-widest">{t('archiveStatus')}</div>
                               <div className="text-sm font-dm font-bold text-gray-400 italic">{t('dispensedUsed')}</div>
                            </div>
                          )}
                       </div>

                       <div className="space-y-3">
                          <div className="text-[10px] font-black text-gray-300 uppercase tracking-widest">{t('medicinesIncluded')}</div>
                          <div className="flex flex-wrap gap-2">
                             {rx.medicines.map(m => (
                               <span key={m} className="px-4 py-1.5 bg-gray-50 text-[#0a1628] rounded-xl text-[10px] font-black uppercase tracking-tighter border border-gray-100">
                                  {m}
                               </span>
                             ))}
                          </div>
                       </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-row md:flex-col gap-3 shrink-0 justify-end md:justify-center">
                       {rx.status === 'Verified' && (
                         <button className="flex-1 md:w-48 py-4 bg-[#0a1628] text-white rounded-[1.3rem] text-xs font-syne font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl hover:bg-[#028090] transition group/btn">
                            <ShoppingBag size={18} /> {t('orderRx')}
                         </button>
                       )}
                       {rx.status.includes('Pending') && (
                         <button onClick={() => handleDelete(rx.id)} className="flex-1 md:w-48 py-4 border-2 border-red-50 text-red-500 rounded-[1.3rem] text-xs font-syne font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-red-500 hover:text-white transition">{t('cancelRx')}</button>
                       )}
                       <div className="flex gap-3">
                          <button className="h-14 w-14 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center text-gray-400 hover:bg-[#0a1628] hover:text-white transition shadow-sm" title="Download">
                             <Download size={20} />
                          </button>
                          <button 
                             onClick={() => handleDelete(rx.id)}
                             className="h-14 w-14 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center text-gray-400 hover:bg-red-500 hover:text-white transition shadow-sm"
                             title="Delete"
                          >
                             <Trash2 size={20} />
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
