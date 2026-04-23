import { useParams, Link } from 'react-router-dom';
import { motion, useScroll, useSpring } from 'framer-motion';
import { 
  Calendar, Clock, User, Share2, 
  MessageSquare, ChevronLeft, ArrowRight,
  Facebook, Twitter, Copy, CheckCircle, 
  BookOpen, List, Mail, MessageCircle,
  Phone, Video, ShieldCheck, Bookmark
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { blogPosts, doctors } from '../../utils/data';
import { useLanguage } from '../../context/LanguageContext';

export default function BlogDetail() {
  const { t } = useLanguage();
  const { slug } = useParams();
  const post = blogPosts.find(p => p.slug === slug);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  if (!post) return <div className="py-40 text-center font-syne font-black text-4xl text-[#0a1628]">{t('articleNotFound')}</div>;

  const doctor = doctors.find(d => d.name === post.author);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success(t('copyLinkSuccess'));
  };

  const relatedPosts = blogPosts.filter(p => p.id !== post.id).slice(0, 3);

  return (
    <div className="bg-white min-h-screen pb-40">
      {/* Progress Bar */}
      <motion.div className="fixed top-0 left-0 right-0 h-2 bg-[#02C39A] origin-left z-[100]" style={{ scaleX }} />

      {/* Hero Section */}
      <section className="relative h-[80vh] min-h-[600px] overflow-hidden group">
         <img src={post.image} alt={post.title} className="h-full w-full object-cover group-hover:scale-105 transition duration-[3s]" />
         <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628] via-[#0a1628]/40 to-transparent" />
         
         <div className="absolute inset-0 flex items-end">
            <div className="max-w-7xl mx-auto px-6 pb-24 space-y-10 w-full">
               <div className="flex flex-wrap items-center gap-6">
                  <Link to="/blog" className="h-14 px-8 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-white font-syne font-black text-[10px] uppercase tracking-widest hover:bg-white hover:text-[#0a1628] transition border border-white/10 group/back">
                     <ChevronLeft size={16} className="group-hover/back:-translate-x-1 transition" /> {t('backToBlog')}
                  </Link>
                  <div className="px-6 py-2 bg-[#02C39A] text-white rounded-full text-[10px] font-black uppercase tracking-widest inline-block shadow-lg">{post.category}</div>
               </div>
               
               <div className="max-w-4xl space-y-6">
                  <h1 className="font-syne font-black text-5xl md:text-7xl text-white tracking-tighter leading-tight drop-shadow-2xl">{post.title}</h1>
                  <div className="flex flex-wrap items-center gap-10 text-[10px] font-black text-white/60 uppercase tracking-widest">
                     <span className="flex items-center gap-3"><User size={16}/> {post.author}</span>
                     <span className="flex items-center gap-3"><Calendar size={16}/> {post.date}</span>
                     <span className="flex items-center gap-3"><Clock size={16}/> {post.readTime}</span>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Main Content Architecture */}
      <section className="max-w-7xl mx-auto px-6 py-24">
         <div className="grid lg:grid-cols-[1fr_350px] gap-20 items-start">
            
            {/* Table of Contents (Sticky Left) */}
            <aside className="hidden xl:block sticky top-32 space-y-12">
               <div className="space-y-6">
                  <h3 className="font-syne font-black text-[#0a1628] uppercase tracking-widest text-sm flex items-center gap-3">
                     <List size={18}/> {t('navigation')}
                  </h3>
                  <div className="space-y-4 border-l-2 border-gray-100 pl-6">
                     <a href="#intro" className="block text-sm font-dm font-bold text-[#028090] hover:text-[#02C39A] transition">{t('overview')}</a>
                     <a href="#medicines" className="block text-sm font-dm font-bold text-gray-400 hover:text-[#0a1628] transition">{t('primaryProtocol')}</a>
                     <a href="#tips" className="block text-sm font-dm font-bold text-gray-400 hover:text-[#0a1628] transition">{t('doctorAdvice')}</a>
                     <a href="#summary" className="block text-sm font-dm font-bold text-gray-400 hover:text-[#0a1628] transition">{t('conclusion')}</a>
                  </div>
               </div>
               <div className="p-10 bg-[#0a1628] rounded-[3rem] text-white space-y-6 shadow-3xl shadow-[#0a1628]/20 group">
                  <Bookmark className="text-[#02C39A] mb-4" />
                  <h4 className="font-syne font-black text-xl">{t('saveForLater')}</h4>
                  <p className="text-white/40 font-dm text-xs leading-relaxed italic">{t('saveArticleDesc')}</p>
                  <button className="w-full py-4 bg-white/10 hover:bg-white/20 transition rounded-2xl font-syne font-black text-[10px] uppercase tracking-widest border border-white/5">{t('saveArticle')}</button>
               </div>
            </aside>

            {/* Article Body */}
            <article className="space-y-16">
               <div className="max-w-4xl space-y-12">
                  <div 
                    id="intro"
                    className="font-dm text-2xl md:text-3xl text-gray-500 leading-relaxed italic border-l-8 border-[#02C39A] pl-10 pt-1 relative"
                  >
                     <p className="relative z-10 leading-relaxed">{post.excerpt}</p>
                  </div>
                  
                  <div 
                    className="prose prose-2xl prose-slate max-w-none font-dm text-[18px] text-gray-600 leading-[2] space-y-10 architecture-content"
                    dangerouslySetInnerHTML={{ __html: post.content || `
                      <p>Full article architecture details for "${post.title}" by ${post.author} appearing here. Healthcare professionals in the Karaikal district contribute these insights to ensure patient awareness and safety across the medical enclave.</p>
                       <img src="/assets/crt_scan.png" class="rounded-[4rem] shadow-2xl my-20" />
                      <h3>Medical Enclave Overview</h3>
                      <p>As we expand our digital healthcare reach into the coastal areas of Tamil Nadu, the need for standardized medical education is vital. Dr. ${post.author.split(' ').pop()} notes that local trends in chronic conditions require specialized community-driven oversight.</p>
                      <blockquote>"Patient education is the first step in preventive healthcare. By understanding these simple protocols, families in Karaikal can significantly improve their long-term health outcomes."</blockquote>
                    ` }} 
                  />
               </div>

               {/* Share Buttons */}
               <div className="pt-20 border-t border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-10">
                  <div className="flex items-center gap-10">
                     <h4 className="font-syne font-black text-[#0a1628] uppercase tracking-widest text-sm">{t('shareArticle')}</h4>
                     <div className="flex items-center gap-4">
                        <button className="h-14 w-14 bg-gray-50 text-[#0a1628] rounded-2xl flex items-center justify-center hover:bg-blue-600 hover:text-white transition shadow-sm"><Facebook size={20}/></button>
                        <button className="h-14 w-14 bg-gray-50 text-[#0a1628] rounded-2xl flex items-center justify-center hover:bg-sky-400 hover:text-white transition shadow-sm"><Twitter size={20}/></button>
                        <button className="h-14 w-14 bg-gray-50 text-[#0a1628] rounded-2xl flex items-center justify-center hover:bg-green-500 hover:text-white transition shadow-sm"><MessageCircle size={20}/></button>
                        <button onClick={copyLink} className="h-14 w-14 bg-gray-50 text-[#0a1628] rounded-2xl flex items-center justify-center hover:bg-[#0a1628] hover:text-white transition shadow-sm"><Link size={20}/></button>
                     </div>
                  </div>
                  <div className="flex items-center gap-6 text-[10px] font-black text-gray-300 uppercase tracking-widest">
                     <span>{t('updateDate')} {post.date}</span>
                     <span className="flex items-center gap-2"><CheckCircle size={14} className="text-[#02C39A]" /> {t('verifiedAuthority')}</span>
                  </div>
               </div>

               {/* Author Bio Card */}
               {doctor && (
                  <div className="p-12 bg-gray-50 rounded-[4rem] border border-gray-100 flex flex-col md:flex-row gap-12 group hover:shadow-2xl transition duration-500">
                     <div className="relative shrink-0">
                        <img src={doctor.image} alt="Doctor" className="h-40 w-40 rounded-[3rem] object-cover ring-8 ring-white shadow-xl group-hover:scale-105 transition" />
                        <div className="absolute -bottom-2 -right-2 h-10 w-10 bg-[#028090] text-white rounded-2xl flex items-center justify-center border-4 border-white shadow-lg"><ShieldCheck size={18}/></div>
                     </div>
                     <div className="space-y-6">
                        <div className="space-y-1">
                           <h3 className="font-syne font-black text-3xl text-[#0a1628] group-hover:text-[#028090] transition">{doctor.name}</h3>
                           <p className="text-[#02C39A] text-[10px] font-black uppercase tracking-widest">{doctor.spec} · {doctor.hospital}</p>
                        </div>
                        <p className="text-gray-500 font-dm italic text-lg leading-relaxed">{doctor.bio}</p>
                        <div className="flex flex-wrap gap-4 pt-4">
                           <Link to={`/doctors/${doctor.id}`} className="px-10 py-4 bg-[#0a1628] text-white rounded-2xl font-syne font-black text-[10px] uppercase tracking-widest hover:bg-[#028090] transition shadow-xl">{t('consultArrow')}</Link>
                           <button className="px-10 py-4 bg-white border border-gray-100 text-gray-400 rounded-2xl font-syne font-black text-[10px] uppercase tracking-widest hover:bg-gray-50 transition">{t('viewFullArchitecture')}</button>
                        </div>
                     </div>
                  </div>
               )}
            </article>

            {/* Side Sidebar (Mobile friendly) */}
            <aside className="space-y-20 lg:sticky lg:top-32 h-fit">
               {/* Related Articles */}
               <div className="space-y-10">
                  <h3 className="font-syne font-black text-[#0a1628] uppercase tracking-widest text-sm flex items-center justify-between">
                     {t('recommended')} <ArrowRight size={18} className="text-[#028090]" />
                  </h3>
                  <div className="space-y-8">
                     {relatedPosts.map(p => (
                        <Link key={p.id} to={`/blog/${p.slug}`} className="flex gap-6 group">
                           <img src={p.image} alt={p.title} className="h-20 w-20 rounded-2xl object-cover shrink-0 group-hover:scale-110 transition duration-500" />
                           <div className="space-y-1">
                              <h4 className="font-syne font-black text-sm text-[#0a1628] line-clamp-2 leading-tight group-hover:text-[#028090] transition">{p.title}</h4>
                              <div className="text-[8px] font-black text-gray-300 uppercase tracking-widest">{p.category} · {p.readTime}</div>
                           </div>
                        </Link>
                     ))}
                  </div>
               </div>

               {/* Quick Support */}
               <div className="p-12 bg-[#028090]/5 border border-[#028090]/10 rounded-[4rem] space-y-10 shadow-sm overflow-hidden relative">
                  <div className="absolute top-0 right-0 h-24 w-24 bg-[#028090] rounded-full blur-[60px] opacity-10" />
                  <h3 className="font-syne font-black text-xl text-[#0a1628] relative z-10">{t('needSupport')}</h3>
                  <div className="space-y-6 relative z-10">
                     <button className="w-full flex items-center justify-between p-6 bg-white rounded-3xl group hover:shadow-2xl transition border border-gray-50">
                        <div className="flex items-center gap-4">
                           <div className="h-10 w-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center group-hover:bg-[#02C39A] group-hover:text-white transition"><MessageCircle size={18}/></div>
                           <span className="text-[10px] font-black uppercase tracking-widest">{t('whatsappEnclave')}</span>
                        </div>
                        <ArrowRight size={16} className="text-gray-300" />
                     </button>
                     <button className="w-full h-16 bg-[#0a1628] text-white rounded-3xl font-syne font-black text-[10px] uppercase tracking-widest hover:bg-[#028090] transition shadow-lg flex items-center justify-center gap-3">
                        <Video size={18} /> {t('instantConsult')}
                     </button>
                  </div>
               </div>
            </aside>
         </div>
      </section>

      {/* Floating CTA */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-6 lg:hidden">
         <Link to="/doctors" className="w-full h-18 bg-[#0a1628] text-white rounded-full flex items-center justify-center gap-4 font-syne font-black text-sm uppercase tracking-widest shadow-4xl animate-bounce-slow">
            <User size={18} /> {t('bookConsultantNow')}
         </Link>
      </div>
    </div>
  );
}
