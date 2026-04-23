import { useState, useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, MapPin, Phone, Clock, Truck, ShieldCheck, Heart, ChevronRight, Share2, Navigation, Info, Search, Filter, ShoppingBag, Plus, Award, Calendar, CheckCircle2, MessageSquare, Tag, Zap, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation as SwiperNav, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { pharmacies as mockPharmacies, medicines as mockMedicines } from '../../utils/data.js';
import MedicineCard from '../../components/medicine/MedicineCard';
import PageShell from '../../components/layout/PageShell';
import { pharmacyService, medicineService } from '../../services/apiServices';
import { normalizeUrl } from '../../utils/url';
import { Loader2 } from 'lucide-react';

import { useLanguage } from '../../context/LanguageContext';

export default function PharmacyDetailPage() {
  const { id } = useParams();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('Medicines'); // Medicines, About, Reviews, Offers
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const [pharmacy, setPharmacy] = useState(null);
  const [pharmacyMedicines, setPharmacyMedicines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setPharmacy(null);
    setPharmacyMedicines([]);
    setLoading(true);
    fetchPharmacyDetails();
  }, [id]);

  const fetchPharmacyDetails = async () => {
    try {
      setLoading(true);
      const [pharmData, medData] = await Promise.all([
        pharmacyService.getById(id),
        medicineService.getAll({ pharmacyId: id })
      ]);
      setPharmacy(pharmData);
      setPharmacyMedicines(medData.items || []);
    } catch (err) {
      console.warn('Failed to load pharmacy details, using mock data...', err);
      const fallbackPharm = mockPharmacies.find(p => p.id === id || p._id === id);
      const fallbackMeds = mockMedicines.filter(m => m.pharmacyId === id || m.pharmacyId === fallbackPharm?.id);
      setPharmacy(fallbackPharm);
      setPharmacyMedicines(fallbackMeds);
    } finally {
      setLoading(false);
    }
  };

  const filteredMedicines = useMemo(() => {
    return pharmacyMedicines.filter(m => {
      const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || m.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [pharmacyMedicines, searchQuery, selectedCategory]);

  const categories = useMemo(() => ['All', ...new Set(pharmacyMedicines.map(m => m.category))], [pharmacyMedicines]);

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8fafc] space-y-6">
       <Loader2 className="animate-spin text-brand-teal" size={48}/>
       <p className="font-syne font-black text-[#0a1628] uppercase italic tracking-[0.3em] animate-pulse">Loading Pharmacy details...</p>
    </div>
  );

  if (!pharmacy) {
    return (
      <div className="min-h-screen bg-[#0a1628] flex items-center justify-center p-10">
         <div className="text-center space-y-8 max-w-xl">
            <div className="h-32 w-32 bg-white/5 border border-white/10 rounded-[3.5rem] flex items-center justify-center mx-auto text-brand-teal shadow-3xl animate-pulse"><Info size={64}/></div>
            <h2 className="font-syne font-black text-5xl text-white uppercase italic tracking-tighter">{t('skuNotFound')}</h2>
            <p className="text-white/40 font-dm text-xl italic font-bold leading-relaxed">{t('skuNotFoundDesc', { id })}</p>
            <Link to="/pharmacies">
               <button className="h-20 px-16 bg-brand-teal text-[#0a1628] font-syne font-black text-xs uppercase tracking-[0.3em] shadow-mint hover:scale-[1.05] active:scale-95 transition-all italic flex items-center gap-4 mx-auto">
                   <ChevronRight size={20} className="rotate-180"/> Return to Pharmacies
               </button>
            </Link>
         </div>
      </div>
    );
  }

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentPhotoIdx, setCurrentPhotoIdx] = useState(0);

  const allPhotos = useMemo(() => {
    const list = [];
    if (pharmacy?.customPhotos?.length) list.push(...pharmacy.customPhotos);
    if (pharmacy?.photos?.length) list.push(...pharmacy.photos);
    if (!list.length && pharmacy?.image) list.push(pharmacy.image);
    return list.length ? list : ['https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=1200&q=80'];
  }, [pharmacy]);

  const openLightbox = (idx) => {
    setCurrentPhotoIdx(idx);
    setLightboxOpen(true);
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-36 w-full max-w-full overflow-x-hidden">
      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-10"
          >
            <button 
              onClick={() => setLightboxOpen(false)}
              className="absolute top-6 right-6 h-12 w-12 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all z-30"
            >
              <Plus size={24} className="rotate-45" />
            </button>
            
            <div className="relative w-full max-w-6xl aspect-[4/3] md:aspect-video flex items-center justify-center">
              <motion.img 
                key={currentPhotoIdx}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                src={normalizeUrl(allPhotos[currentPhotoIdx])} 
                className="max-w-full max-h-full object-contain rounded-3xl shadow-2xl"
              />
              
              {allPhotos.length > 1 && (
                <>
                  <button 
                    onClick={() => setCurrentPhotoIdx((prev) => (prev - 1 + allPhotos.length) % allPhotos.length)}
                    className="absolute left-4 h-14 w-14 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all"
                  >
                    <ChevronRight size={32} className="rotate-180" />
                  </button>
                  <button 
                    onClick={() => setCurrentPhotoIdx((prev) => (prev + 1) % allPhotos.length)}
                    className="absolute right-4 h-14 w-14 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all"
                  >
                    <ChevronRight size={32} />
                  </button>
                </>
              )}
            </div>
            
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3">
              {allPhotos.map((_, i) => (
                <button 
                  key={i}
                  onClick={() => setCurrentPhotoIdx(i)}
                  className={`h-2 transition-all duration-500 rounded-full ${currentPhotoIdx === i ? 'w-10 bg-brand-teal' : 'w-2 bg-white/20'}`}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Breadcrumb Terminal */}
      <section className="bg-white/30 backdrop-blur-sm border-b border-black/[0.02] py-4 mt-16 md:mt-24">
         <div className="max-w-7xl mx-auto px-6 md:px-10">
            <div className="flex flex-wrap items-center gap-3 text-[8px] md:text-[10px] font-black text-gray-300 uppercase tracking-[0.4em] italic leading-none">
               <Link to="/" className="hover:text-brand-teal hidden md:block">{t('home') || 'Home'}</Link>
               <ChevronRight size={12} className="opacity-40 hidden md:block" />
               <Link to="/pharmacies" className="hover:text-brand-teal">{t('pharmacies') || 'Pharmacies'}</Link>
               <ChevronRight size={12} className="opacity-40" />
               <span className="text-brand-teal truncate max-w-[150px]">{pharmacy.name}</span>
            </div>
         </div>
      </section>

      {/* Hero: Image Slider */}
      <section className="relative h-[65vh] overflow-hidden group">
         <Swiper
           modules={[SwiperNav, Pagination, Autoplay]}
           navigation
           pagination={{ clickable: true }}
           autoplay={{ delay: 5000 }}
           className="h-full w-full"
         >
           {allPhotos.map((img, i) => (
             <SwiperSlide key={i} onClick={() => openLightbox(i)} className="cursor-zoom-in">
                <img src={normalizeUrl(img)} alt={pharmacy.name} className="h-full w-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105" />
             </SwiperSlide>
           ))}
         </Swiper>
         
          {/* Overlay Header */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628] via-[#0a1628]/40 to-transparent pointer-events-none" />
          
          {/* Breadcrumb - top left, clear of buttons */}
          <div className="absolute top-6 left-6 z-20 flex items-center gap-2 text-[10px] font-bold text-white/70 uppercase tracking-widest">
             <Link to="/" className="hover:text-brand-teal transition-colors">Home</Link>
             <ChevronRight size={12} className="opacity-40" />
             <Link to="/pharmacies" className="hover:text-brand-teal transition-colors">Pharmacies</Link>
             <ChevronRight size={12} className="opacity-40" />
             <span className="text-white font-black truncate max-w-[100px]">{pharmacy.name}</span>
          </div>

          {/* Action buttons - top RIGHT, not overlapping breadcrumb */}
          <div className="absolute top-6 right-6 z-20 flex gap-3">
             <button className="h-10 w-10 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white hover:text-[#0a1628] transition-all active:scale-95">
                <Share2 size={18} />
             </button>
             <button className="h-10 w-10 bg-red-500 rounded-full flex items-center justify-center text-white transition-all active:scale-95 shadow-lg">
                <Heart size={18} fill="white" />
             </button>
          </div>

          {/* Hero Text */}
          <div className="absolute bottom-6 left-6 right-6 z-20 space-y-4 overflow-hidden">
             <div className="flex flex-wrap gap-2">
                <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest italic flex items-center gap-2 backdrop-blur-md border ${pharmacy.is24hr ? 'bg-red-500/20 text-red-100 border-red-500/30' : 'bg-emerald-500/20 text-emerald-100 border-emerald-500/30'}`}>
                   <div className={`h-1.5 w-1.5 rounded-full animate-pulse ${pharmacy.is24hr ? 'bg-red-500' : 'bg-emerald-500'}`} />
                   {pharmacy.is24hr ? '24/7 EMERGENCY' : 'TRUSTED PHARMACY'}
                </div>
                <div className="px-4 py-1.5 bg-brand-teal/90 text-[#0a1628] text-[9px] font-black uppercase tracking-widest italic flex items-center gap-1.5 rounded-full">
                   <Star size={12} fill="currentColor" /> {pharmacy.rating}
                </div>
             </div>
             <h1
               className="font-black text-white leading-[0.9] break-words w-full"
               style={{ fontSize: 'clamp(2.2rem, 12vw, 5rem)' }}
             >
                {pharmacy.name}
             </h1>
          </div>
      </section>


      {/* Pharmacy Information Bar */}
      <section className="sticky top-0 z-40 bg-white border-b border-black/[0.03] shadow-soft">
         <div className="max-w-7xl mx-auto px-10 h-32 flex items-center justify-between gap-12 overflow-x-auto whitespace-nowrap no-scrollbar">
            <div className="flex items-center gap-12">
               <div className="flex items-center gap-4 group cursor-default">
                  <div className="h-12 w-12 bg-gray-50 rounded-xl flex items-center justify-center text-brand-teal group-hover:bg-[#0a1628] transition-all duration-500 shadow-inner"><MapPin size={20}/></div>
                  <div className="space-y-0.5">
                     <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic leading-none">{pharmacy.area}</div>
                     <div className="font-dm font-black text-[#0a1628] text-sm italic">{(pharmacy.location || pharmacy.address || 'Karaikal').split(',')[0]}</div>
                  </div>
               </div>
               
               <div className="flex items-center gap-4 group cursor-default border-l border-black/[0.03] pl-12">
                  <div className="h-12 w-12 bg-gray-50 rounded-xl flex items-center justify-center text-brand-teal group-hover:bg-[#0a1628] transition-all duration-500 shadow-inner"><Truck size={20}/></div>
                  <div className="space-y-0.5">
                     <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic leading-none">Delivery Time</div>
                     <div className="font-dm font-black text-[#0a1628] text-sm italic">
                        {pharmacy.deliveryTime || '25-35'} Min &bull; {pharmacy.deliveryFee === 0 ? 'Free Delivery' : `₹${pharmacy.deliveryFee || 30}`}
                     </div>
                  </div>
               </div>

               <div className="flex items-center gap-4 group cursor-default border-l border-black/[0.03] pl-12">
                  <div className="h-12 w-12 bg-gray-50 rounded-xl flex items-center justify-center text-brand-teal group-hover:bg-[#0a1628] transition-all duration-500 shadow-inner"><Clock size={20}/></div>
                  <div className="space-y-0.5">
                     <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic leading-none">Opening Hours</div>
                     <div className="font-dm font-black text-[#0a1628] text-sm italic uppercase">{pharmacy.timings}</div>
                  </div>
               </div>
            </div>

            <div className="flex items-center gap-6 shrink-0">
               <a href={`https://www.google.com/maps/dir/?api=1&destination=${pharmacy.gps?.lat || 10.9254},${pharmacy.gps?.lng || 79.8386}`} target="_blank" rel="noreferrer">
                  <button className="h-16 px-10 bg-gray-50 border border-black/[0.02] text-[#0a1628] font-syne font-black text-[10px] uppercase italic tracking-widest rounded-2xl hover:bg-[#0a1628] hover:text-white transition-all duration-500 flex items-center gap-3">
                     <Navigation size={18} /> View Map
                  </button>
               </a>
               <button className="h-16 px-10 bg-brand-teal text-[#0a1628] font-syne font-black text-[10px] uppercase italic tracking-widest rounded-2xl shadow-mint hover:scale-[1.05] active:scale-95 transition-all flex items-center justify-center gap-3">
                   <Plus size={18}/> Order Now
               </button>
            </div>
         </div>
      </section>

      {/* Pharmacy Details */}
      <div className="max-w-7xl mx-auto px-10 py-20 lg:py-32 grid lg:grid-cols-12 gap-20">
         
         <div className="lg:col-span-8 space-y-16">
            {/* Navigation Tabs */}
            <div className="flex w-full overflow-x-auto hide-scrollbar border-b border-gray-200 bg-white sticky top-[60px] z-20">
               {[
                 { id: 'Medicines', label: 'Medicines', icon: ShoppingBag },
                 { id: 'About', label: 'About', icon: Info },
                 { id: 'Reviews', label: 'Reviews', icon: MessageSquare },
                 { id: 'Offers', label: 'Offers', icon: Tag },
               ].map(tab => (
                 <button
                   key={tab.id}
                   onClick={() => setActiveTab(tab.id)}
                   className={`flex-1 flex flex-col items-center gap-1 py-4 text-[10px] font-black uppercase italic tracking-widest transition-all duration-300 min-w-[80px] ${
                     activeTab === tab.id
                       ? 'text-brand-teal border-b-2 border-brand-teal bg-brand-teal/5'
                       : 'text-gray-300'
                   }`}
                 >
                   <tab.icon size={18} />
                   {tab.label}
                 </button>
               ))}
            </div>

            {/* Tabs Content */}
            <motion.div 
               key={activeTab}
               initial={{ opacity: 0, y: 30 }}
               animate={{ opacity: 1, y: 0 }}
               className="min-h-[600px]"
            >
               {activeTab === 'Medicines' && (
                 <div className="space-y-16">
                    <div className="flex flex-col md:flex-row gap-8 items-center justify-between border-b border-black/[0.03] pb-12">
                       <h3 className="font-syne font-black text-3xl text-[#0a1628] uppercase italic leading-none flex items-center gap-6">
                           <div className="h-2 w-16 bg-brand-teal rounded-full" /> Pharmacy Medicines
                       </h3>
                       <div className="flex gap-4 w-full md:w-auto">
                          <div className="h-16 flex-1 md:w-72 bg-gray-50 border border-black/[0.03] rounded-2xl flex items-center px-6 text-[#0a1628] focus-within:border-brand-teal transition-all group">
                             <Search size={20} className="text-gray-300 group-focus-within:text-brand-teal transition-colors" />
                             <input type="text" placeholder="Search medicines..." className="bg-transparent flex-1 px-4 font-dm italic font-bold text-lg outline-none" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                          </div>
                          <button className="h-16 w-16 bg-[#0a1628] rounded-2xl flex items-center justify-center text-brand-teal shadow-4xl"><Filter size={24}/></button>
                       </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                       {categories.map(cat => (
                         <button
                           key={cat}
                           onClick={() => setSelectedCategory(cat)}
                           className={`h-12 px-6 rounded-xl font-syne font-black text-[9px] uppercase tracking-[0.2em] italic transition-all duration-500 border ${selectedCategory === cat ? 'bg-brand-teal text-[#0a1628] border-brand-teal shadow-lg' : 'bg-white text-gray-300 border-black/[0.03] hover:text-[#0a1628] hover:border-[#0a1628]'}`}
                         >
                            {cat}
                         </button>
                       ))}
                    </div>

                    <div className="grid md:grid-cols-2 gap-10">
                       {filteredMedicines.map((m, idx) => (
                         <motion.div key={m.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.05 }}>
                            <MedicineCard item={m} />
                         </motion.div>
                       ))}
                    </div>
                 </div>
               )}

               {activeTab === 'About' && (
                 <div className="space-y-20">
                    <div className="space-y-10">
                       <h3 className="font-syne font-black text-3xl text-[#0a1628] uppercase italic leading-none flex items-center gap-6">
                          <div className="h-2 w-16 bg-brand-teal rounded-full" /> Pharmacy Details
                       </h3>
                       <div className="grid md:grid-cols-2 gap-6">
                          {[
                             { label: 'Owner', val: pharmacy.ownerName || pharmacy.owner, icon: CheckCircle2 },
                             { label: 'License', val: pharmacy.licenseId || pharmacy.license, icon: ShieldCheck },
                             { label: 'Tax ID', val: pharmacy.gst, icon: Award },
                             { label: 'Founded', val: pharmacy.established, icon: Calendar }
                          ].map(item => (
                            <div key={item.label} className="bg-white p-8 rounded-[2.5rem] border border-black/[0.03] flex items-center gap-6 group hover:shadow-xl transition-all duration-500">
                               <div className="h-14 w-14 bg-gray-50 rounded-2xl flex items-center justify-center text-brand-teal group-hover:bg-[#0a1628] transition-all"><item.icon size={28}/></div>
                               <div className="space-y-0.5 min-w-0">
                                  <div className="text-[10px] font-black text-gray-300 uppercase tracking-widest italic">{item.label}</div>
                                  <div className="font-syne font-black text-[#0a1628] text-xl uppercase italic tracking-tighter truncate">{item.val || 'Not Available'}</div>
                               </div>
                            </div>
                          ))}
                       </div>
                    </div>

                    <div className="space-y-10">
                       <h3 className="font-syne font-black text-3xl text-[#0a1628] uppercase italic leading-none flex items-center gap-6">
                          <div className="h-2 w-16 bg-brand-teal rounded-full" /> Services
                       </h3>
                       <div className="flex flex-wrap gap-6">
                          {(pharmacy.facilities || []).map(f => (
                            <div key={f} className="h-20 px-10 bg-white border border-black/[0.03] rounded-[2rem] flex items-center gap-4 text-xs font-black font-syne text-[#0a1628] uppercase italic shadow-soft">
                               <CheckCircle2 size={18} className="text-brand-teal" /> {f}
                            </div>
                          ))}
                       </div>
                    </div>

                    <div className="space-y-10">
                       <h3 className="font-syne font-black text-3xl text-[#0a1628] uppercase italic leading-none flex items-center gap-6">
                          <div className="h-2 w-16 bg-brand-teal rounded-full" /> Location Details
                       </h3>
                       <div className="h-96 w-full bg-gray-100 rounded-[4rem] overflow-hidden border border-black/[0.03] shadow-4xl relative group">
                          <div className="absolute inset-0 bg-[#0a1628]/5 pointer-events-none z-10" />
                          <iframe 
                             title="Pharmacy Location"
                             className="w-full h-full grayscale-[0.8] opacity-60 filter contrast-125 brightness-90 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000"
                             frameBorder="0" scrolling="no" marginHeight="0" marginWidth="0"
                             src={`https://maps.google.com/maps?q=${pharmacy.gps?.lat || 10.9254},${pharmacy.gps?.lng || 79.8386}&z=16&output=embed`}
                          />
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                             <div className="h-20 w-20 bg-brand-teal shadow-mint rounded-[2rem] flex items-center justify-center text-[#0a1628] animate-bounce-slow">
                                <Navigation size={32} />
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>
               )}

               {activeTab === 'Reviews' && (
                 <div className="space-y-20">
                    <div className="bg-[#0a1628] rounded-[5rem] p-16 text-white grid md:grid-cols-[1fr_2fr] gap-20 items-center relative overflow-hidden border-l-[20px] border-brand-teal shadow-4xl">
                       <div className="text-center space-y-4">
                          <div className="font-syne font-black text-9xl text-brand-teal leading-none italic">{pharmacy.rating}</div>
                          <div className="flex justify-center text-brand-teal gap-1"><Star fill="currentColor" size={24}/><Star fill="currentColor" size={24}/><Star fill="currentColor" size={24}/><Star fill="currentColor" size={24}/><Star fill="currentColor" size={12} className="opacity-50"/></div>
                          <div className="text-xs font-black uppercase italic tracking-widest text-white/40">{pharmacy.reviewsCount} CUSTOMER REVIEWS</div>
                       </div>
                       <div className="space-y-4">
                          {[5, 4, 3, 2, 1].map(s => (
                            <div key={s} className="flex items-center gap-6">
                               <span className="text-xs font-black font-syne italic w-4">{s}</span>
                               <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                                  <motion.div 
                                    initial={{ width: 0 }}
                                    whileInView={{ width: s === 5 ? '60%' : s === 4 ? '28%' : '8%' }}
                                    className="h-full bg-brand-teal shadow-mint"
                                  />
                               </div>
                               <span className="text-[10px] font-black font-syne text-white/40 italic w-10 text-right">{s === 5 ? '60%' : s === 4 ? '28%' : s === 3 ? '8%' : '2%'}</span>
                            </div>
                          ))}
                       </div>
                    </div>

                    <div className="space-y-12">
                       <div className="flex justify-between items-center px-10">
                          <h3 className="font-syne font-black text-3xl text-[#0a1628] uppercase italic leading-none flex items-center gap-6">
                             <div className="h-2 w-16 bg-brand-teal rounded-full" /> Customer Reviews
                          </h3>
                          <button className="h-16 px-10 bg-[#0a1628] text-brand-teal font-syne font-black text-xs uppercase italic tracking-widest rounded-2xl shadow-4xl hover:scale-105 transition-all">Write Review</button>
                       </div>
                       
                       <div className="grid gap-8">
                           {[
                              { name: 'Suresh Kumar', area: 'Karaikal Town', text: 'Fast service and professional. Best pharmacy in the town.', rating: 5 },
                              { name: 'Anitha R.', area: 'Nagore Road', text: 'Prescription verification was swift. Excellent availability of chronic meds.', rating: 4 },
                              { name: 'Muthuvel S.', area: 'Poompuhar', text: 'Home delivery service is highly reliable.', rating: 5 }
                           ].map((r, i) => (
                             <div key={i} className="bg-white p-12 rounded-[4rem] border border-black/[0.03] space-y-6 hover:shadow-4xl transition-all duration-700 border-l-[12px] border-gray-50 hover:border-brand-teal">
                                <div className="flex justify-between items-start">
                                   <div className="flex items-center gap-6">
                                      <div className="h-16 w-16 bg-gray-100 rounded-[1.5rem] flex items-center justify-center text-gray-400 font-syne font-black text-xl italic">{r.name[0]}</div>
                                      <div className="space-y-0.5">
                                         <div className="font-syne font-black text-[#0a1628] text-xl uppercase italic tracking-tighter">{r.name}</div>
                                         <div className="text-[10px] font-black text-gray-300 uppercase tracking-widest italic">{r.area}</div>
                                      </div>
                                   </div>
                                   <div className="flex text-amber-500 gap-0.5">{Array.from({length: 5}).map((_, i) => <Star key={i} size={14} fill={i < r.rating ? 'currentColor' : 'none'} className={i < r.rating ? '' : 'opacity-20'}/>)}</div>
                                </div>
                                <p className="text-gray-400 font-dm italic text-xl font-bold leading-relaxed">"{r.text}"</p>
                             </div>
                          ))}
                       </div>
                    </div>
                 </div>
               )}

               {activeTab === 'Offers' && (
                 <div className="grid md:grid-cols-2 gap-12">
                     {[
                        { title: 'Vitamin Offer', text: '20% off on Multivitamins this weekend.', color: 'from-brand-teal to-[#1a3a4a]', expiry: '2h 45m' },
                        { title: 'Delivery Offer', text: 'Free delivery on all orders above \u20B9300 today.', color: 'from-[#0a1628] to-[#1a3a4a]', expiry: '5h 12m' }
                     ].map((offer, i) => (
                       <div key={i} className={`p-12 rounded-[4.5rem] bg-gradient-to-br ${offer.color} text-white space-y-12 relative overflow-hidden group shadow-4xl`}>
                          <div className="absolute top-0 right-0 h-40 w-40 bg-white opacity-0 group-hover:opacity-5 rounded-full blur-[80px] transition-opacity" />
                          <div className="space-y-6 relative z-10">
                             <div className="px-5 py-2 bg-white/10 border border-white/20 rounded-xl w-fit flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] italic">
                                <Zap className="animate-pulse" size={14} /> EXCLUSIVE OFFER
                             </div>
                             <h4 className="font-syne font-black text-3xl uppercase italic tracking-tighter leading-tight">{offer.title}</h4>
                             <p className="text-white/60 font-dm italic text-xl font-bold">{offer.text}</p>
                          </div>
                          <div className="flex items-center justify-between relative z-10 pt-8 border-t border-white/10">
                             <div className="space-y-1">
                                <div className="text-[10px] font-black uppercase tracking-widest text-white/40">Expires In:</div>
                                <div className="font-syne font-black text-brand-teal text-xl italic">{offer.expiry}</div>
                             </div>
                             <button className="h-16 w-16 bg-white rounded-2xl flex items-center justify-center text-[#0a1628] shadow-4xl hover:bg-brand-teal hover:scale-110 transition-all"><Plus size={24}/></button>
                          </div>
                       </div>
                    ))}
                 </div>
               )}
            </motion.div>
         </div>

         {/* Quick Info */}
         <div className="lg:col-span-4 space-y-12">
            <div className="bg-white border border-black/[0.03] rounded-[4.5rem] p-16 space-y-12 shadow-soft hover:shadow-4xl transition-all duration-1000 group">
               <div className="flex items-center gap-6 text-[#0a1628]">
                  <div className="h-16 w-16 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center shadow-inner text-brand-teal group-hover:bg-[#0a1628] transition-all duration-500"><Award size={28}/></div>
                  <h4 className="font-syne font-black text-2xl uppercase tracking-tighter italic leading-none">Certifications</h4>
               </div>
               <div className="space-y-8">
                  {[
                     { label: 'Licensed Pharmacy', val: 'Verified 2019' },
                     { label: 'Safe Cooling', val: 'Always Checked' },
                     { label: 'Quality Partner', val: '99.9% Reliable' }
                  ].map(c => (
                     <div key={c.label} className="flex justify-between items-center border-b border-black/[0.03] pb-6 group/row">
                        <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest italic group-hover/row:text-[#0a1628] transition-colors">{c.label}</span>
                        <div className="flex items-center gap-3 text-brand-teal font-syne font-black italic text-xs">
                           <CheckCircle2 size={14}/> {c.val}
                        </div>
                     </div>
                  ))}
               </div>
            </div>

            <div className="bg-[#0a1628] rounded-[4.5rem] p-16 text-white text-center space-y-10 relative overflow-hidden border-l-[16px] border-brand-teal shadow-4xl group">
               <div className="absolute top-0 right-0 h-40 w-40 bg-brand-teal opacity-5 rounded-full blur-[80px]" />
               <div className="h-24 w-24 bg-white/5 border border-white/10 rounded-[2.5rem] flex items-center justify-center mx-auto text-brand-teal shadow-3xl group-hover:rotate-12 transition-all duration-700"><Activity size={48}/></div>
               <div className="space-y-4">
                  <h3 className="font-syne font-black text-3xl uppercase italic tracking-tighter leading-none">Emergency Contact</h3>
                  <p className="text-white/40 font-dm text-lg italic leading-relaxed">Need help immediately? Call this pharmacy directly.</p>
               </div>
               <a href={`tel:${(pharmacy.phone || '').replace(/\s+/g, '')}`} className="block">
                  <button className="w-full h-20 bg-brand-teal text-[#0a1628] font-syne font-black text-xs uppercase tracking-[0.3em] shadow-mint hover:scale-[1.05] active:scale-95 transition-all italic flex items-center justify-center gap-4">
                     <Phone size={20}/> Call Pharmacy
                  </button>
               </a>
            </div>
         </div>
      </div>

      {/* Mobile Actions - Fixed at bottom above nav */}
      <div className="lg:hidden fixed bottom-16 left-0 right-0 z-[100] px-4 pb-3">
         <div className="bg-[#0a1628] rounded-2xl p-3 flex items-center gap-3 shadow-2xl border border-white/10 backdrop-blur-3xl">
            <button className="h-12 w-12 bg-white/5 rounded-xl flex items-center justify-center text-brand-teal border border-white/5 flex-shrink-0">
               <Phone size={18}/>
            </button>
            <button className="h-12 w-12 bg-white/5 rounded-xl flex items-center justify-center text-brand-teal border border-white/5 flex-shrink-0">
               <Navigation size={18}/>
            </button>
            <button className="flex-1 h-12 bg-brand-teal text-[#0a1628] font-syne font-black text-[10px] uppercase italic tracking-widest rounded-xl shadow-mint">
               Order Medicines
            </button>
         </div>
      </div>
    </div>
  );
}
