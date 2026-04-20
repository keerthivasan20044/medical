import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search as SearchIcon, X, SlidersHorizontal, 
  ChevronRight, ArrowRight, Pill, 
  Store, User, BookOpen, AlertCircle, 
  TrendingUp, Star, MapPin, CheckCircle,
  ShieldCheck, ArrowUpRight
} from 'lucide-react';
import { medicines, pharmacies, doctors, blogPosts } from '../../utils/data';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext.jsx';

const POPULAR_SEARCHES = ['Paracetamol', 'Vitamin D', 'Insulin', 'Cetirizine', 'Dolo 650'];

export default function SearchResults() {
  const { t } = useLanguage();
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(timer);
  }, [query]);

  const results = useMemo(() => {
    if (!debouncedQuery) return { medicines: [], pharmacies: [], doctors: [], blog: [] };
    const q = debouncedQuery.toLowerCase();
    
    return {
      medicines: medicines.filter(m => 
        (m.name || '').toLowerCase().includes(q) || 
        (m.generic || '').toLowerCase().includes(q) || 
        (m.brand || '').toLowerCase().includes(q)
      ),
      pharmacies: pharmacies.filter(p => 
        (p.name || '').toLowerCase().includes(q) || 
        (p.location || '').toLowerCase().includes(q)
      ),
      doctors: doctors.filter(d => 
        (d.name || '').toLowerCase().includes(q) || 
        (d.spec || '').toLowerCase().includes(q)
      ),
      blog: blogPosts.filter(b => 
        (b.title || '').toLowerCase().includes(q) || 
        (b.excerpt || '').toLowerCase().includes(q)
      )
    };
  }, [debouncedQuery]);

  const counts = {
    All: results.medicines.length + results.pharmacies.length + results.doctors.length + results.blog.length,
    Medicines: results.medicines.length,
    Pharmacies: results.pharmacies.length,
    Doctors: results.doctors.length,
    Blog: results.blog.length
  };

  const hasResults = counts.All > 0;

  return (
    <div className="bg-white min-h-screen pb-40">
      {/* Search Header */}
      <section className="bg-gray-50 pt-32 pb-16 border-b border-gray-100 overflow-hidden">
         <div className="max-w-4xl mx-auto px-6 space-y-12">
            <div className="relative group">
               <div className="absolute -inset-1 bg-gradient-to-r from-[#02C39A] to-[#028090] rounded-[3.5rem] blur opacity-25 group-focus-within:opacity-50 transition duration-1000"></div>
               <div className="relative bg-white border border-gray-100 rounded-3xl md:rounded-[3rem] p-4 md:p-8 flex items-center gap-4 md:gap-6 shadow-2xl transition-all">
                  <div className="h-12 w-12 md:h-14 md:w-14 bg-[#0a1628] text-[#02C39A] rounded-2xl md:rounded-[2rem] flex items-center justify-center shadow-lg shrink-0"><SearchIcon size={20} className="md:w-6 md:h-6" /></div>
                  <input 
                    autoFocus
                    type="text" 
                    placeholder={t('searchPlaceholder')} 
                    className="bg-transparent border-none outline-none font-syne font-black text-lg md:text-3xl placeholder-gray-200 text-[#0a1628] w-full"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                  {query && (
                    <button onClick={() => setQuery('')} className="h-10 w-10 text-gray-400 hover:text-[#0a1628] transition"><X size={24} /></button>
                  )}
               </div>
            </div>

            <div className="flex gap-3 md:gap-4 overflow-x-auto no-scrollbar pb-6 md:pb-0 px-4 justify-start md:justify-center snap-x snap-mandatory scroll-smooth relative z-10">
               {['All', 'Medicines', 'Pharmacies', 'Doctors', 'Blog'].map(tab => (
                  <button
                     key={tab}
                     onClick={() => setActiveTab(tab)}
                     className={`px-6 md:px-10 py-3 md:py-4 rounded-xl md:rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab ? 'bg-[#0a1628] text-white shadow-xl scale-105' : 'bg-white text-gray-400 border border-gray-100 hover:bg-gray-50'}`}
                  >
                     {t(tab.toLowerCase()) || tab} 
                     {counts[tab] > 0 && <span className="ml-2 opacity-40">({counts[tab]})</span>}
                  </button>
               ))}
            </div>

         </div>
      </section>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">
         {!debouncedQuery ? (
            <div className="max-w-2xl mx-auto space-y-16 py-20">
               <div className="text-center space-y-4">
                  <h2 className="font-syne font-black text-4xl text-[#0a1628]">{t('whatLookingFor')}</h2>
                  <p className="text-gray-400 font-dm text-lg italic tracking-wide">{t('searchScanDesc')}</p>
               </div>
               
               <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {POPULAR_SEARCHES.map(term => (
                     <button 
                        key={term} 
                        onClick={() => setQuery(term)}
                        className="p-6 bg-gray-50 border border-transparent hover:border-[#02C39A] hover:bg-white rounded-3xl text-left space-y-3 transition duration-500 group"
                     >
                        <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-gray-300 group-hover:text-[#02C39A] transition"><TrendingUp size={18}/></div>
                        <div className="font-syne font-black text-[#0a1628] text-sm uppercase tracking-widest">{term}</div>
                     </button>
                  ))}
               </div>
            </div>
         ) : !hasResults ? (
            <div className="max-w-2xl mx-auto text-center py-40 space-y-10">
               <div className="h-40 w-40 bg-gray-50 rounded-[4rem] flex items-center justify-center mx-auto text-gray-200 border-2 border-dashed border-gray-100"><AlertCircle size={80}/></div>
               <div className="space-y-4">
                  <h2 className="font-syne font-black text-4xl text-[#0a1628]">{t('noMatches')} <br /><span className="text-red-500">"{debouncedQuery}"</span></h2>
                  <p className="text-gray-400 font-dm text-lg italic underline decoration-[#02C39A] underline-offset-8">{t('didYouMean') || 'Did you mean'}: <button onClick={() => setQuery('Paracetamol')} className="text-[#0a1628] font-black hover:text-[#028090] transition">Paracetamol</button>?</p>
               </div>
               <button onClick={() => setQuery('')} className="px-12 py-5 bg-[#0a1628] text-white rounded-full font-syne font-black text-xs uppercase tracking-widest hover:bg-[#028090] transition shadow-2xl">{t('resetSearch')}</button>
            </div>
         ) : (
            <div className="space-y-32">
               {/* Medicines Grid */}
               {(activeTab === 'All' || activeTab === 'Medicines') && results.medicines.length > 0 && (
                  <section className="space-y-12">
                     <div className="flex items-center justify-between border-b border-gray-50 pb-8">
                        <h2 className="font-syne font-black text-3xl text-[#0a1628] flex items-center gap-6"><Pill className="text-[#028090]" size={36}/> {t('medicinesResults')}</h2>
                        <button className="text-[10px] font-black text-[#028090] uppercase tracking-widest flex items-center gap-2">{t('viewMatches')} <ArrowUpRight size={14}/></button>
                     </div>
                     <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {results.medicines.slice(0, 8).map(m => (
                           <Link to={`/medicines/${m.id}`} key={m.id} className="bg-white rounded-[2.5rem] border border-gray-100 p-6 md:p-8 space-y-6 hover:shadow-2xl transition duration-500 group">
                              <div className="h-44 bg-gray-50 rounded-3xl overflow-hidden relative">
                                 <img src={m.image} className="h-full w-full object-cover group-hover:scale-110 transition duration-700" />
                                 {m.requiresRx && <div className="absolute top-4 right-4 bg-orange-500 text-white px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest shadow-lg">Rx Only</div>}
                              </div>
                              <div className="space-y-1">
                                 <div className="text-[10px] text-gray-300 font-bold uppercase tracking-widest">{m.brand}</div>
                                 <h3 className="font-syne font-black text-xl text-[#0a1628] line-clamp-1 group-hover:text-[#028090] transition">{m.name}</h3>
                                 <div className="text-[10px] text-[#028090] font-bold uppercase tracking-widest italic">{m.generic}</div>
                              </div>
                              <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                                 <div className="font-syne font-black text-2xl text-[#0a1628]">₹{m.price}</div>
                                 <button className="h-12 px-6 bg-[#0a1628] text-white rounded-xl font-syne font-black text-[10px] uppercase tracking-widest hover:bg-[#028090] transition">{t('addToCart')}</button>
                              </div>
                           </Link>
                        ))}
                     </div>
                  </section>
               )}

               {/* Pharmacies Grid */}
               {(activeTab === 'All' || activeTab === 'Pharmacies') && results.pharmacies.length > 0 && (
                  <section className="space-y-12">
                     <div className="flex items-center justify-between border-b border-gray-50 pb-8">
                        <h2 className="font-syne font-black text-3xl text-[#0a1628] flex items-center gap-6"><Store className="text-[#02C39A]" size={36}/> {t('pharmaciesNodes')}</h2>
                     </div>
                     <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {results.pharmacies.map(p => (
                           <Link to={`/pharmacies/${p.id}`} key={p.id} className="p-8 md:p-10 bg-[#0a1628] rounded-[3rem] md:rounded-[3.5rem] text-white space-y-8 group hover:-translate-y-2 transition duration-500 shadow-3xl shadow-[#0a1628]/20 relative overflow-hidden">
                              <div className="absolute top-0 right-0 h-40 w-40 bg-[#028090] rounded-full blur-[80px] opacity-20" />
                              <div className="flex items-start justify-between relative z-10">
                                 <div className="h-16 w-16 bg-white/10 rounded-2xl flex items-center justify-center border border-white/5"><Store size={30} className="text-[#02C39A]"/></div>
                                 <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl text-[10px] font-black"><Star size={14} className="text-amber-400 fill-amber-400" /> {p.rating}</div>
                              </div>
                              <div className="space-y-2 relative z-10">
                                 <h3 className="font-syne font-black text-2xl group-hover:text-[#02C39A] transition">{p.name}</h3>
                                 <p className="text-white/40 font-dm text-sm flex items-center gap-2 italic"><MapPin size={14}/> {p.location}</p>
                              </div>
                              <div className="flex items-center justify-between pt-4 border-t border-white/5 relative z-10">
                                 <div className="text-[10px] font-black uppercase tracking-widest text-[#02C39A]">Open 24/7 Enclave</div>
                                 <div className="text-sm font-dm font-black">{p.distance}</div>
                              </div>
                           </Link>
                        ))}
                     </div>
                  </section>
               )}

               {/* Doctors Grid */}
               {(activeTab === 'All' || activeTab === 'Doctors') && results.doctors.length > 0 && (
                  <section className="space-y-12">
                     <div className="flex items-center justify-between border-b border-gray-50 pb-8">
                        <h2 className="font-syne font-black text-3xl text-[#0a1628] flex items-center gap-6"><User className="text-[#028090]" size={36}/> {t('doctorsAuthorities')}</h2>
                     </div>
                     <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {results.doctors.map(d => (
                           <Link to={`/doctors/${d.id}`} key={d.id} className="bg-gray-50 rounded-[3rem] p-8 space-y-8 hover:bg-white hover:shadow-2xl border border-transparent hover:border-gray-100 transition duration-500 group">
                              <div className="relative">
                                 <img src={d.image} className="h-32 w-32 rounded-[2rem] object-cover ring-4 ring-white shadow-xl mx-auto group-hover:scale-105 transition" />
                                 <div className="absolute -bottom-2 right-1/2 translate-x-12 h-8 w-8 bg-[#02C39A] text-white rounded-xl flex items-center justify-center border-2 border-white shadow-lg"><ShieldCheck size={14}/></div>
                              </div>
                              <div className="text-center space-y-2">
                                 <h3 className="font-syne font-black text-xl text-[#0a1628] group-hover:text-[#028090] transition">{d.name}</h3>
                                 <div className="text-[10px] text-[#028090] font-black uppercase tracking-widest">{d.spec}</div>
                                 <p className="text-[10px] text-gray-400 font-dm italic">{d.hospital}</p>
                              </div>
                              <button className="w-full py-4 bg-white border border-gray-100 rounded-2xl font-syne font-black text-[10px] uppercase tracking-widest text-[#0a1628] group-hover:bg-[#0a1628] group-hover:text-white transition shadow-sm">{t('bookConsultant')}</button>
                           </Link>
                        ))}
                     </div>
                  </section>
               )}

               {/* Blog Results */}
               {(activeTab === 'All' || activeTab === 'Blog') && results.blog.length > 0 && (
                  <section className="space-y-12">
                     <div className="flex items-center justify-between border-b border-gray-50 pb-8">
                        <h2 className="font-syne font-black text-3xl text-[#0a1628] flex items-center gap-6"><BookOpen className="text-[#02C39A]" size={36}/> {t('blogData')}</h2>
                     </div>
                     <div className="grid md:grid-cols-2 gap-8">
                        {results.blog.map(b => (
                           <Link to={`/blog/${b.slug}`} key={b.id} className="flex gap-10 bg-white p-10 rounded-[3.5rem] border border-gray-100 group hover:shadow-3xl transition duration-500">
                              <div className="h-40 w-40 rounded-[2.5rem] overflow-hidden shrink-0">
                                 <img src={b.image} className="h-full w-full object-cover group-hover:scale-110 transition duration-700" />
                              </div>
                              <div className="space-y-4">
                                 <div className="text-[10px] font-black text-[#02C39A] uppercase tracking-widest">{b.category}</div>
                                 <h3 className="font-syne font-black text-2xl text-[#0a1628] leading-tight group-hover:text-[#028090] transition line-clamp-2">{b.title}</h3>
                                 <p className="text-sm font-dm text-gray-400 italic line-clamp-2">{b.excerpt}</p>
                              </div>
                           </Link>
                        ))}
                     </div>
                  </section>
               )}
            </div>
         )}
      </div>
    </div>
  );
}
