import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, Camera, CheckCircle, Clock, Eye, Download, 
  Trash2, ShoppingBag, FileText, AlertCircle, ShieldCheck, RefreshCcw
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
  const cameraInputRef = useRef(null);

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
        doctor: item.doctorName || (item.doctor?.name) || 'Prescription',
        hospital: item.notes || 'Uploaded by you',
        date: new Date(item.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
        status: item.status.charAt(0).toUpperCase() + item.status.slice(1),
        medicines: (item.medicines || []).map(m => m.name || m),
        img: item.imageUrl,
        isPdf: item.imageUrl?.startsWith('data:application/pdf') || item.imageUrl?.toLowerCase().includes('.pdf'),
        verified: item.status === 'verified',
        verifiedBy: item.verifiedBy
      }));
      setPrescriptions(mapped);
    } catch (err) {
      toast.error(t('clinicalRecordsUpdateError'));
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File must be 10MB or smaller');
        e.target.value = '';
        return;
      }
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Please upload a JPG, PNG, WEBP, or PDF file');
        e.target.value = '';
        return;
      }
      performRealUpload(file);
      e.target.value = '';
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
      formData.append('doctorName', 'New Scan');
      formData.append('notes', 'Uploaded from prescriptions page');
      
      const res = await prescriptionService.upload(formData);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      setTimeout(() => {
        setIsUploading(false);
        toast.success(t('rxUpdateSuccess'));
        fetchPrescriptions();
      }, 500);
    } catch (err) {
      clearInterval(progressInterval);
      setIsUploading(false);
      toast.error(t('rxUpdateError'));
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

  const filteredPrescriptions = prescriptions.filter((rx) => {
    if (filter === 'All') return true;
    if (filter === 'Verified') return rx.status === 'Approved' || rx.status === 'Verified' || rx.verified;
    return rx.status === filter;
  });

  const counts = prescriptions.reduce((acc, rx) => {
    acc.All += 1;
    if (rx.status === 'Pending') acc.Pending += 1;
    if (rx.status === 'Dispensed') acc.Dispensed += 1;
    if (rx.status === 'Approved' || rx.status === 'Verified' || rx.verified) acc.Verified += 1;
    return acc;
  }, { All: 0, Verified: 0, Pending: 0, Dispensed: 0 });

  return (
    <div className="px-4 py-5 md:px-8 xl:px-10 md:py-8 overflow-x-hidden w-full max-w-screen pb-24 md:pb-16 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-100 bg-teal-50 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-teal-700">
            <ShieldCheck size={13} /> Prescriptions
          </div>
          <h1 className="mt-3 text-2xl md:text-4xl font-black font-syne text-slate-900">My Prescriptions</h1>
          <p className="text-sm text-slate-500 mt-1">Upload and view your prescriptions.</p>
        </div>
        <button
          onClick={fetchPrescriptions}
          className="inline-flex h-11 w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-xs font-black uppercase tracking-widest text-slate-500 hover:border-teal-200 hover:text-teal-700"
        >
          <RefreshCcw size={15} /> Refresh
        </button>
      </div>

      {/* Upload Section */}
      <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
        <div className="bg-teal-50 border border-teal-100 rounded-3xl p-4 md:p-6">
           {!isUploading ? (
             <div 
                className="border-2 border-dashed border-teal-200 rounded-2xl p-5 md:p-8 bg-white transition-all cursor-pointer group hover:border-teal-400 min-h-[220px] flex flex-col 2xl:flex-row 2xl:items-center justify-between gap-6 overflow-hidden"
                onClick={() => fileInputRef.current?.click()}
             >
                <div className="flex flex-col sm:flex-row sm:items-center gap-5 text-left min-w-0">
                  <div className="h-16 w-16 md:h-20 md:w-20 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center group-hover:scale-105 group-hover:bg-teal-500 group-hover:text-white transition duration-300 shadow-sm shrink-0">
                     <Upload size={26} />
                  </div>
                  <div className="min-w-0">
                     <h3 className="font-syne font-black text-xl md:text-3xl text-navy leading-tight">Upload Prescription</h3>
                     <p className="mt-2 text-xs md:text-sm text-gray-500 font-medium max-w-xl">Upload a prescription file or take a photo with your phone.</p>
                     <p className="mt-3 text-[10px] text-gray-400 font-black uppercase tracking-widest">PDF, JPG, PNG, WEBP | Max 10MB</p>
                  </div>
                </div>

                <div className="flex w-full flex-col gap-3 sm:max-w-[240px] 2xl:shrink-0">
                   <button type="button" className="h-12 px-5 bg-navy text-teal-400 font-syne font-black text-[10px] uppercase tracking-widest rounded-xl shadow-md hover:bg-teal-500 hover:text-white transition">
                      Upload Now
                   </button>
                   <button type="button" onClick={(e) => { e.stopPropagation(); cameraInputRef.current?.click(); }} className="h-12 px-5 bg-white border border-gray-100 text-gray-500 font-syne font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-gray-50 hover:text-teal-600 transition flex items-center justify-center gap-2">
                      <Camera size={16} /> Take Photo
                   </button>
                </div>
                <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} accept="image/*,.pdf" />
                <input type="file" ref={cameraInputRef} className="hidden" onChange={handleFileUpload} accept="image/*" capture="environment" />
             </div>
           ) : (
             <div className="p-8 md:p-10 space-y-7 bg-white border-2 border-dashed border-[#02C39A] rounded-2xl min-h-[220px] flex flex-col justify-center">
                <div className="h-20 w-20 mx-auto bg-[#02C39A]/10 text-[#02C39A] rounded-full flex items-center justify-center relative">
                   <motion.div 
                     animate={{ rotate: 360 }}
                     transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                     className="absolute inset-0 border-4 border-[#02C39A] border-t-transparent rounded-full"
                   />
                   <FileText size={32} />
                </div>
                <div className="space-y-2">
                   <h3 className="font-syne font-black text-xl md:text-2xl text-center text-[#0a1628]">{t('processingMedicalArch')}</h3>
                   <div className="text-sm font-dm font-bold text-[#02C39A]">{uploadProgress}% {t('updateedStatusLabel')}</div>
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

        <div className="grid grid-cols-2 gap-3 xl:grid-cols-1 xl:self-start">
          {[
            { label: 'Total', value: counts.All, tone: 'bg-slate-900 text-white' },
            { label: 'Approved', value: counts.Verified, tone: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
            { label: 'Pending', value: counts.Pending, tone: 'bg-amber-50 text-amber-700 border-amber-100' },
            { label: 'Dispensed', value: counts.Dispensed, tone: 'bg-blue-50 text-blue-700 border-blue-100' }
          ].map((stat) => (
            <div key={stat.label} className={`rounded-2xl border p-4 ${stat.tone}`}>
              <div className="text-[10px] font-black uppercase tracking-widest opacity-70">{stat.label}</div>
              <div className="mt-1 font-syne text-3xl font-black">{String(stat.value).padStart(2, '0')}</div>
            </div>
          ))}
        </div>
      </section>

      {/* List Section */}
      <section className="space-y-4">
         <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">History</h2>
              <p className="text-xs text-slate-400">{filteredPrescriptions.length} record{filteredPrescriptions.length === 1 ? '' : 's'}</p>
            </div>
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
               {['All', 'Verified', 'Pending', 'Dispensed'].map(filterItem => (
                 <button 
                    key={filterItem}
                    onClick={() => setFilter(filterItem)}
                    className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold tracking-wide transition-all ${filter === filterItem ? 'bg-slate-900 text-teal-400' : 'bg-white border border-slate-100 text-slate-500 hover:text-teal-700'}`}
                 >
                    {filterItem} <span className="opacity-60">({counts[filterItem]})</span>
                 </button>
               ))}
            </div>
         </div>

         <div className="grid gap-3">
            <AnimatePresence mode="popLayout">
               {filteredPrescriptions.map((rx, idx) => (
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
                       {rx.isPdf ? (
                         <div className="h-full w-full flex flex-col items-center justify-center gap-3 bg-white text-teal-600">
                           <FileText size={44} />
                           <span className="text-[10px] font-black uppercase tracking-widest">PDF</span>
                         </div>
                       ) : (
                         <img src={rx.img} alt="Rx" className="h-full w-full object-cover group-hover:scale-110 transition duration-700" />
                       )}
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
                             rx.status.includes('Approved') || rx.status.includes('Verified') || rx.verified ? 'bg-emerald-50 text-emerald-600' :
                             rx.status.includes('Pending') ? 'bg-amber-50 text-amber-600' : 'bg-gray-50 text-gray-400'
                          }`}>
                             {rx.verified || rx.status === 'Approved' || rx.status === 'Verified' ? <CheckCircle size={12} /> : rx.status.includes('Pending') ? <Clock size={12} /> : <AlertCircle size={12} />}
                             {rx.verified || rx.status === 'Approved' || rx.status === 'Verified' ? `Approved` : rx.status}
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
                       {(rx.status === 'Approved' || rx.status === 'Verified') && (
                         <button className="flex-1 md:w-40 py-3 bg-navy text-white rounded-xl text-[10px] font-syne font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg hover:bg-teal-600 transition">
                            <ShoppingBag size={16} /> Order
                         </button>
                       )}
                       <div className="flex gap-2 flex-1 md:flex-none">
                          <Link to={`/prescriptions/${rx.id}`} className="h-10 w-full md:w-12 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center text-gray-400 hover:bg-navy hover:text-white transition" title="View">
                             <Eye size={16} />
                          </Link>
                          <a href={rx.img} download className="h-10 w-full md:w-12 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center text-gray-400 hover:bg-navy hover:text-white transition" title="Download">
                             <Download size={16} />
                          </a>
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
            {loading && (
              <div className="rounded-2xl border border-slate-100 bg-white p-10 text-center">
                <Clock className="mx-auto animate-spin text-teal-600" size={30} />
                <p className="mt-3 text-sm font-bold text-slate-400">Loading prescriptions...</p>
              </div>
            )}
            {!loading && filteredPrescriptions.length === 0 && (
              <div className="rounded-3xl border border-dashed border-gray-200 bg-white p-10 md:p-14 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 text-gray-300">
                  <FileText size={34} />
                </div>
                <h3 className="mt-4 font-syne font-black text-navy uppercase">No prescriptions found</h3>
                <p className="mt-1 text-sm text-gray-400">Upload a prescription or change the filter.</p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-navy px-5 text-xs font-black uppercase tracking-widest text-teal-400 hover:bg-teal-500 hover:text-white"
                >
                  Upload Prescription
                </button>
              </div>
            )}
         </div>
      </section>
    </div>
  );
}
