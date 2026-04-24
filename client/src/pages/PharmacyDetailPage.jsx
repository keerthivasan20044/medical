import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Share2, Heart, Star, MapPin, Phone, Clock, Zap, 
  Info, Box, MessageSquare, Camera, ShieldCheck, Navigation, ChevronRight, Store 
} from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

// Tab Components (Inline for brevity, or we could split files)
import PharmacyAbout from '../components/pharmacy/PharmacyAbout';
import PharmacyMedicines from '../components/pharmacy/PharmacyMedicines';
import PharmacyReviews from '../components/pharmacy/PharmacyReviews';
import PharmacyPhotos from '../components/pharmacy/PharmacyPhotos';

export default function PharmacyDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pharmacy, setPharmacy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('medicines');
  const [isFavorite, setIsFavorite] = useState(false);

  const fetchPharmacy = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/api/pharmacies/${id}`);
      setPharmacy(res.data);
    } catch (err) {
      toast.error('Failed to sync node data');
      navigate('/pharmacies');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPharmacy();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
       <div className="h-20 w-20 border-4 border-brand-teal border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const TABS = [
    { id: 'about', label: 'Protocol', icon: Info },
    { id: 'medicines', label: 'Inventory', icon: Box },
    { id: 'reviews', label: 'Validation', icon: MessageSquare },
    { id: 'photos', label: 'Visuals', icon: Camera },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-[60vh] md:h-[70vh] overflow-hidden">
        <motion.img 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
          src={pharmacy?.mainPhoto || 'https://images.unsplash.com/photo-1586015555751-63bb77f4322a?q=80&w=1000&auto=format&fit=crop'} 
          alt={pharmacy?.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/20 to-transparent" />
        
        {/* Floating Controls */}
        <div className="absolute top-8 left-8 right-8 flex items-center justify-between z-20">
           <button 
             onClick={() => navigate(-1)}
             className="h-14 w-14 bg-white/20 backdrop-blur-xl border border-white/20 text-white rounded-2xl flex items-center justify-center hover:bg-white hover:text-navy transition-all"
           >
              <ArrowLeft size={24} />
           </button>
           <div className="flex gap-3">
              <button className="h-14 w-14 bg-white/20 backdrop-blur-xl border border-white/20 text-white rounded-2xl flex items-center justify-center hover:bg-white hover:text-navy transition-all">
                 <Share2 size={24} />
              </button>
              <button 
                onClick={() => setIsFavorite(!isFavorite)}
                className={`h-14 w-14 backdrop-blur-xl border border-white/20 rounded-2xl flex items-center justify-center transition-all ${
                  isFavorite ? 'bg-red-500 text-white' : 'bg-white/20 text-white hover:bg-white hover:text-navy'
                }`}
              >
                 <Heart size={24} fill={isFavorite ? 'currentColor' : 'none'} />
              </button>
           </div>
        </div>

        {/* Content Overlay */}
        <div className="absolute bottom-16 left-8 right-8 z-10 max-w-7xl mx-auto">
           <div className="space-y-6">
              <div className="flex items-center gap-2">
                 <div className="h-1.5 w-1.5 rounded-full bg-brand-teal animate-pulse" />
                 <span className="text-[10px] font-black text-brand-teal uppercase tracking-[0.4em] italic">Authorized Node</span>
              </div>
              <h1 className="font-syne font-black text-5xl md:text-7xl text-white italic tracking-tighter uppercase leading-none max-w-4xl">
                {pharmacy?.name}
              </h1>
              <div className="flex flex-wrap items-center gap-6 pt-4">
                 <div className="flex items-center gap-2 text-white">
                    <Star size={20} className="text-amber-400" fill="currentColor" />
                    <span className="text-lg font-syne font-black italic">{pharmacy?.rating || '4.8'}</span>
                    <span className="text-xs text-white/40 font-bold ml-1">({pharmacy?.reviewCount || '120'} validations)</span>
                 </div>
                 <div className="h-8 w-[1px] bg-white/10" />
                 <div className="flex items-center gap-2 text-white/60 text-sm font-dm font-bold italic">
                    <MapPin size={18} className="text-brand-teal" /> {pharmacy?.city}, Puducherry
                 </div>
                 <div className="h-8 w-[1px] bg-white/10" />
                 <div className="flex items-center gap-2 text-emerald-400 text-sm font-dm font-bold italic">
                    <Clock size={18} /> Open 24/7
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* Action Mesh */}
      <div className="max-w-7xl mx-auto px-8 -mt-10 relative z-20">
         <div className="bg-white p-4 rounded-[2.5rem] border border-gray-100 shadow-2xl flex flex-wrap gap-4">
            <button className="flex-1 min-w-[200px] h-16 bg-navy text-brand-teal rounded-2xl font-syne font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:scale-[1.02] transition-all">
               <Navigation size={20} /> Get Directions
            </button>
            <button className="flex-1 min-w-[200px] h-16 bg-brand-teal text-navy rounded-2xl font-syne font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:scale-[1.02] transition-all">
               <Phone size={20} /> Emergency Dial
            </button>
            <button className="flex-1 min-w-[200px] h-16 bg-gray-50 text-navy/40 rounded-2xl font-syne font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-navy hover:text-white transition-all">
               <Zap size={20} /> Priority Chat
            </button>
         </div>
      </div>

      {/* Tabs System */}
      <div className="max-w-7xl mx-auto px-8 pt-16">
         <div className="flex items-center gap-8 border-b border-gray-100 mb-12 overflow-x-auto pb-1 no-scrollbar">
            {TABS.map((tab) => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 pb-6 relative transition-all min-w-fit ${
                  activeTab === tab.id ? 'text-navy' : 'text-navy/20 hover:text-navy/40'
                }`}
              >
                 <tab.icon size={20} className={activeTab === tab.id ? 'text-brand-teal' : ''} />
                 <span className="text-[10px] font-black uppercase tracking-[0.2em] italic">{tab.label}</span>
                 {activeTab === tab.id && (
                    <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-1 bg-brand-teal rounded-full" />
                 )}
              </button>
            ))}
         </div>

         {/* Tab Content */}
         <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="pb-24"
            >
               {activeTab === 'about' && <PharmacyAbout pharmacy={pharmacy} />}
               {activeTab === 'medicines' && <PharmacyMedicines pharmacyId={id} />}
               {activeTab === 'reviews' && <PharmacyReviews pharmacyId={id} />}
               {activeTab === 'photos' && <PharmacyPhotos pharmacy={pharmacy} />}
            </motion.div>
         </AnimatePresence>
      </div>
    </div>
  );
}
