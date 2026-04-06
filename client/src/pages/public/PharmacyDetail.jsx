import { useState, useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, MapPin, Phone, Clock, Truck, ShieldCheck, Heart, ChevronRight, Share2, Navigation, Info, Search, Filter, ShoppingBag, Plus, Award, Calendar, CheckCircle2, MessageSquare, Tag, Zap, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation as SwiperNav, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { pharmacies, medicines } from '../../utils/data.js';
import MedicineCard from '../../components/medicine/MedicineCard.jsx';
import PageShell from '../../components/layout/PageShell.jsx';

import { useLanguage } from '../../context/LanguageContext.jsx';

export default function PharmacyDetailPage() {
  const { id } = useParams();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('Medicines'); // Medicines, About, Reviews, Offers
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const pharmacy = useMemo(() => pharmacies.find(p => p.id === id), [id]);
  const pharmacyMedicines = useMemo(() => medicines.filter(m => m.pharmacyId === id), [id]);
  
  const filteredMedicines = useMemo(() => {
    return pharmacyMedicines.filter(m => {
      const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || m.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [pharmacyMedicines, searchQuery, selectedCategory]);

  const categories = ['All', ...new Set(pharmacyMedicines.map(m => m.category))];

  if (!pharmacy) {
    return (
      <div className="min-h-screen bg-[#0a1628] flex items-center justify-center p-10">
         <div className="text-center space-y-8 max-w-xl">
            <div className="h-32 w-32 bg-white/5 border border-white/10 rounded-[3.5rem] flex items-center justify-center mx-auto text-brand-teal shadow-3xl animate-pulse"><Info size={64}/></div>
            <h2 className="font-syne font-black text-5xl text-white uppercase italic tracking-tighter">{t('skuNotFound')}</h2>
            <p className="text-white/40 font-dm text-xl italic font-bold leading-relaxed">{t('skuNotFoundDesc', { id })}</p>
            <Link to="/pharmacies">
               <button className="h-20 px-16 bg-brand-teal text-[#0a1628] font-syne font-black text-xs uppercase tracking-[0.3em] shadow-mint hover:scale-[1.05] active:scale-95 transition-all italic flex items-center gap-4 mx-auto">
                  <ChevronRight size={20} className="rotate-180"/> {t('returnRegistry')}
               </button>
            </Link>
         </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-48">
      {/* Hero: Image Slider */}
      <section className="relative h-[65vh] overflow-hidden group">
         <Swiper
           modules={[SwiperNav, Pagination, Autoplay]}
           navigation
           pagination={{ clickable: true }}
           autoplay={{ delay: 5000 }}
           className="h-full w-full"
         >
           {pharmacy.images.map((img, i) => (
             <SwiperSlide key={i}>
                <img src={img} alt={pharmacy.name} className="h-full w-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105" />
             </SwiperSlide>
           ))}
         </Swiper>
         
         {/* Overlay Header */}
         <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628] via-[#0a1628]/20 to-transparent pointer-events-none" />
         
         <div className="absolute top-10 left-10 z-20 flex items-center gap-4 text-[10px] font-black text-white/80 uppercase tracking-[0.4em] italic drop-shadow-lg">
            <Link to="/" className="hover:text-brand-teal transition-colors">Home</Link>
            <ChevronRight size={14} className="opacity-40" />
            <Link to="/pharmacies" className="hover:text-brand-teal transition-colors">Pharmacies</Link>
            <ChevronRight size={14} className="opacity-40" />
            <span className="text-brand-teal">{pharmacy.name}</span>
         </div>

         <div className="absolute bottom-20 left-10 lg:left-20 z-20 space-y-6 max-w-4xl pr-10">
            <div className="flex flex-wrap gap-4">
               <div className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest italic flex items-center gap-2 backdrop-blur-3xl border ${pharmacy.is24hr ? 'bg-red-500/20 text-red-100 border-red-500/30' : 'bg-emerald-500/20 text-emerald-100 border-emerald-500/30'}`}>
                  <div className={`h-2 w-2 rounded-full animate-pulse ${pharmacy.is24hr ? 'bg-red-500' : 'bg-emerald-500'}`} />
                  {pharmacy.is24hr ? 'District Emergency Hub' : 'Verified Clinical Node'}
               </div>
               <div className="px-6 py-2 bg-brand-teal text-[#0a1628] text-[10px] font-black uppercase tracking-widest italic flex items-center gap-2 rounded-full shadow-mint">
                  <Star size={14} fill="currentColor" /> {pharmacy.rating} Rating
               </div>
            </div>
            <h1 className="font-syne font-black text-6xl lg:text-9xl text-white leading-[0.85] tracking-tighter uppercase italic drop-shadow-2xl">
               {pharmacy.name}
            </h1>
         </div>

         <div className="absolute top-10 right-10 z-20 flex gap-4">
            <button className="h-16 w-16 bg-white/10 backdrop-blur-3xl border border-white/20 rounded-2xl flex items-center justify-center text-white hover:bg-white hover:text-[#0a1628] transition-all group active:scale-95 shadow-4xl">
               <Share2 size={24} className="group-hover:rotate-12 transition-transform" />
            </button>
            <button className="h-16 w-16 bg-white/10 backdrop-blur-3xl border border-white/20 rounded-2xl flex items-center justify-center text-white hover:bg-red-500 hover:text-white hover:border-red-500 transition-all group active:scale-95 shadow-4xl">
               <Heart size={24} className="group-hover:animate-heartbeat" />
            </button>
         </div>
      </section>

      {/* Sticky Info Hub Bar */}
      <section className="sticky top-0 z-40 bg-white border-b border-black/[0.03] shadow-soft">
         <div className="max-w-7xl mx-auto px-10 h-32 flex items-center justify-between gap-12 overflow-x-auto whitespace-nowrap no-scrollbar">
            <div className="flex items-center gap-12">
               <div className="flex items-center gap-4 group cursor-default">
                  <div className="h-12 w-12 bg-gray-50 rounded-xl flex items-center justify-center text-brand-teal group-hover:bg-[#0a1628] transition-all duration-500 shadow-inner"><MapPin size={20}/></div>
                  <div className="space-y-0.5">
                     <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic leading-none">{pharmacy.area}</div>
                     <div className="font-dm font-black text-[#0a1628] text-sm italic">{pharmacy.location.split(',')[0]}</div>
                  </div>
               </div>
               
               <div className="flex items-center gap-4 group cursor-default border-l border-black/[0.03] pl-12">
                  <div className="h-12 w-12 bg-gray-50 rounded-xl flex items-center justify-center text-brand-teal group-hover:bg-[#0a1628] transition-all duration-500 shadow-inner"><Truck size={20}/></div>
                  <div className="space-y-0.5">
                     <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic leading-none">Deliver Pulse</div>
                     <div className="font-dm font-black text-[#0a1628] text-sm italic">25-35 Min &bull; \u20B9{pharmacy.deliveryFee}</div>
                  </div>
               </div>

               <div className="flex items-center gap-4 group cursor-default border-l border-black/[0.03] pl-12">
                  <div className="h-12 w-12 bg-gray-50 rounded-xl flex items-center justify-center text-brand-teal group-hover:bg-[#0a1628] transition-all duration-500 shadow-inner"><Clock size={20}/></div>
                  <div className="space-y-0.5">
                     <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic leading-none">Terminal State</div>
                     <div className="font-dm font-black text-[#0a1628] text-sm italic uppercase">{pharmacy.timings}</div>
                  </div>
               </div>
            </div>

            <div className="flex items-center gap-6 shrink-0">
               <a href={`https://www.google.com/maps/dir/?api=1&destination=${pharmacy.gps.lat},${pharmacy.gps.lng}`} target="_blank" rel="noreferrer">
                  <button className="h-16 px-10 bg-gray-50 border border-black/[0.02] text-[#0a1628] font-syne font-black text-[10px] uppercase italic tracking-widest rounded-2xl hover:bg-[#0a1628] hover:text-white transition-all duration-500 flex items-center gap-3">
                     <Navigation size={18} /> Global Sync
                  </button>
               </a>
               <button className="h-16 px-10 bg-brand-teal text-[#0a1628] font-syne font-black text-[10px] uppercase italic tracking-widest rounded-2xl shadow-mint hover:scale-[1.05] active:scale-95 transition-all flex items-center justify-center gap-3">
                  <Plus size={18}/> New Payload
               </button>
            </div>
         </div>
      </section>

      {/* Main Terminal Activity Grid */}
      <div className="max-w-7xl mx-auto px-10 py-20 lg:py-32 grid lg:grid-cols-12 gap-20">
         
         <div className="lg:col-span-8 space-y-16">
            {/* Navigation Tabs Node */}
            <div className="flex bg-white border border-black/[0.03] p-3 rounded-[3rem] shadow-soft overflow-x-auto no-scrollbar whitespace-nowrap justify-between">
               {['Medicines', 'About', 'Reviews', 'Offers'].map(tab => (
                 <button
                   key={tab}
                   onClick={() => setActiveTab(tab)}
                   className={`h-20 px-12 rounded-[2.5rem] font-syne font-black text-xs uppercase italic tracking-widest transition-all duration-700 active:scale-95 flex items-center gap-4 ${activeTab === tab ? 'bg-[#0a1628] text-brand-teal shadow-4xl' : 'text-gray-300 hover:text-[#0a1628]'}`}
                 >
                    {tab === 'Medicines' && <ShoppingBag size={18}/>}
                    {tab === 'About' && <Info size={18}/>}
                    {tab === 'Reviews' && <MessageSquare size={18}/>}
                    {tab === 'Offers' && <Tag size={18}/>}
                    {t(`tab${tab}`)}
                 </button>
               ))}
            </div>

            {/* Tab Panes Panel */}
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
                          <div className="h-2 w-16 bg-brand-teal rounded-full" /> Inventory Uplink
                       </h3>
                       <div className="flex gap-4 w-full md:w-auto">
                          <div className="h-16 flex-1 md:w-72 bg-gray-50 border border-black/[0.03] rounded-2xl flex items-center px-6 text-[#0a1628] focus-within:border-brand-teal transition-all group">
                             <Search size={20} className="text-gray-300 group-focus-within:text-brand-teal transition-colors" />
                             <input type="text" placeholder="Search in node..." className="bg-transparent flex-1 px-4 font-dm italic font-bold text-lg outline-none" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
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
                            {cat} Node
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
                          <div className="h-2 w-16 bg-brand-teal rounded-full" /> Architecture Protocol
                       </h3>
                       <div className="grid md:grid-cols-2 gap-8">
                          {[
                             { label: 'Clinical Responsible', val: pharmacy.owner, icon: CheckCircle2 },
                             { label: 'Protocol ID (License)', val: pharmacy.license, icon: ShieldCheck },
                             { label: 'Financial Matrix (GST)', val: pharmacy.gst, icon: Award },
                             { label: 'Initialization Year', val: pharmacy.established, icon: Calendar }
                          ].map(item => (
                            <div key={item.label} className="bg-white p-10 rounded-[3rem] border border-black/[0.03] flex items-center gap-8 group hover:shadow-4xl transition-all duration-700">
                               <div className="h-14 w-14 bg-gray-50 rounded-2xl flex items-center justify-center text-brand-teal group-hover:bg-[#0a1628] transition-all"><item.icon size={28}/></div>
                               <div className="space-y-0.5">
                                  <div className="text-[10px] font-black text-gray-300 uppercase tracking-widest italic">{item.label}</div>
                                  <div className="font-syne font-black text-[#0a1628] text-xl uppercase italic tracking-tighter">{item.val}</div>
                               </div>
                            </div>
                          ))}
                       </div>
                    </div>

                    <div className="space-y-10">
                       <h3 className="font-syne font-black text-3xl text-[#0a1628] uppercase italic leading-none flex items-center gap-6">
                          <div className="h-2 w-16 bg-brand-teal rounded-full" /> Terminal Facilities
                       </h3>
                       <div className="flex flex-wrap gap-6">
                          {pharmacy.facilities.map(f => (
                            <div key={f} className="h-20 px-10 bg-white border border-black/[0.03] rounded-[2rem] flex items-center gap-4 text-xs font-black font-syne text-[#0a1628] uppercase italic shadow-soft">
                               <CheckCircle2 size={18} className="text-brand-teal" /> {f}
                            </div>
                          ))}
                       </div>
                    </div>

                    <div className="space-y-10">
                       <h3 className="font-syne font-black text-3xl text-[#0a1628] uppercase italic leading-none flex items-center gap-6">
                          <div className="h-2 w-16 bg-brand-teal rounded-full" /> Geo-Coordinate Lock
                       </h3>
                       <div className="h-96 w-full bg-gray-100 rounded-[4rem] overflow-hidden border border-black/[0.03] shadow-4xl relative group">
                          <div className="absolute inset-0 bg-[#0a1628]/5 pointer-events-none z-10" />
                          <iframe 
                             title="Pharmacy Geo Lock"
                             className="w-full h-full grayscale-[0.8] opacity-60 filter contrast-125 brightness-90 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000"
                             frameBorder="0" scrolling="no" marginHeight="0" marginWidth="0"
                             src={`https://maps.google.com/maps?q=${pharmacy.gps.lat},${pharmacy.gps.lng}&z=16&output=embed`}
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
                          <div className="text-xs font-black uppercase italic tracking-widest text-white/40">{pharmacy.reviewsCount} AUDITED SESSIONS</div>
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
                             <div className="h-2 w-16 bg-brand-teal rounded-full" /> Audit Streams
                          </h3>
                          <button className="h-16 px-10 bg-[#0a1628] text-brand-teal font-syne font-black text-xs uppercase italic tracking-widest rounded-2xl shadow-4xl hover:scale-105 transition-all">Write Review</button>
                       </div>
                       
                       <div className="grid gap-8">
                          {[
                             { name: 'Suresh Kumar', area: 'Karaikal Town', text: 'Fast synchronization and professional fulfillment. Best clinical node in the town.', rating: 5 },
                             { name: 'Anitha R.', area: 'Nagore Road', text: 'Prescription verification was swift. Excellent availability of chronic meds.', rating: 4 },
                             { name: 'Muthuvel S.', area: 'Poompuhar', text: 'Synchronized home delivery protocol is highly reliable.', rating: 5 }
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
                       { title: 'Vitamin Pulse Promo', text: '20% off on Multivitamin sync protocols this weekend.', color: 'from-brand-teal to-[#1a3a4a]', expiry: '2h 45m' },
                       { title: 'Logistics Matrix', text: 'Free delivery on all payloads above \u20B9300 today.', color: 'from-[#0a1628] to-[#1a3a4a]', expiry: '5h 12m' }
                    ].map((offer, i) => (
                       <div key={i} className={`p-12 rounded-[4.5rem] bg-gradient-to-br ${offer.color} text-white space-y-12 relative overflow-hidden group shadow-4xl`}>
                          <div className="absolute top-0 right-0 h-40 w-40 bg-white opacity-0 group-hover:opacity-5 rounded-full blur-[80px] transition-opacity" />
                          <div className="space-y-6 relative z-10">
                             <div className="px-5 py-2 bg-white/10 border border-white/20 rounded-xl w-fit flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] italic">
                                <Zap className="animate-pulse" size={14} /> ACTIVE_OFFER_NODE
                             </div>
                             <h4 className="font-syne font-black text-3xl uppercase italic tracking-tighter leading-tight">{offer.title}</h4>
                             <p className="text-white/60 font-dm italic text-xl font-bold">{offer.text}</p>
                          </div>
                          <div className="flex items-center justify-between relative z-10 pt-8 border-t border-white/10">
                             <div className="space-y-1">
                                <div className="text-[10px] font-black uppercase tracking-widest text-white/40">Sync Lock Ends In:</div>
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

         {/* Sidebar Quick-Response Hub */}
         <div className="lg:col-span-4 space-y-12">
            <div className="bg-white border border-black/[0.03] rounded-[4.5rem] p-16 space-y-12 shadow-soft hover:shadow-4xl transition-all duration-1000 group">
               <div className="flex items-center gap-6 text-[#0a1628]">
                  <div className="h-16 w-16 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center shadow-inner text-brand-teal group-hover:bg-[#0a1628] transition-all duration-500"><Award size={28}/></div>
                  <h4 className="font-syne font-black text-2xl uppercase tracking-tighter italic leading-none">Certifications</h4>
               </div>
               <div className="space-y-8">
                  {[
                     { label: 'Licensed Fulfillment', val: 'Verified_2019' },
                     { label: 'Cold Storage Matrix', val: 'Active_Optimal' },
                     { label: 'Clinical Handshake', val: '99.9% Reliable' }
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
                  <h3 className="font-syne font-black text-3xl uppercase italic tracking-tighter leading-none">Emergency Sync</h3>
                  <p className="text-white/40 font-dm text-lg italic leading-relaxed">Need clinical support immediately? Initialize a direct bridge to this node.</p>
               </div>
               <a href={`tel:${pharmacy.phone.replace(/\s+/g, '')}`} className="block">
                  <button className="w-full h-20 bg-brand-teal text-[#0a1628] font-syne font-black text-xs uppercase tracking-[0.3em] shadow-mint hover:scale-[1.05] active:scale-95 transition-all italic flex items-center justify-center gap-4">
                     <Phone size={20}/> Call Enclave
                  </button>
               </a>
            </div>
         </div>
      </div>

      {/* Sticky Mobile Command Bar */}
      <div className="lg:hidden fixed bottom-10 left-10 right-10 z-[100] bg-[#0a1628] h-20 rounded-[2.5rem] shadow-4xl border border-white/10 backdrop-blur-3xl flex items-center justify-between px-6">
         <a href={`tel:${pharmacy.phone.replace(/\s+/g, '')}`} className="h-14 w-14 bg-white/5 rounded-2xl flex items-center justify-center text-brand-teal border border-white/5"><Phone size={20}/></a>
         <a href={`https://www.google.com/maps/dir/?api=1&destination=${pharmacy.gps.lat},${pharmacy.gps.lng}`} className="h-14 w-14 bg-white/5 rounded-2xl flex items-center justify-center text-brand-teal border border-white/5"><Navigation size={20}/></a>
         <button className="flex-1 h-14 mx-4 bg-brand-teal text-[#0a1628] font-syne font-black text-[10px] uppercase italic tracking-widest rounded-2xl shadow-mint">Order Payload</button>
      </div>
    </div>
  );
}
