import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Calendar, Clock, User, 
  ChevronRight, ArrowRight, Filter, 
  BookOpen, Heart, Share2, Sparkles,
  Stethoscope, ShieldCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { blogPosts } from '../../utils/data';

const CATEGORIES = ['All', 'Health Tips', 'Medicine Guide', 'Nutrition', 'Karaikal News', 'COVID'];

export default function Blog() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = activeCategory === 'All' || post.category === activeCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-white min-h-screen pb-20 pt-24">
      {/* Header Section */}
      <section className="bg-gray-50 py-24 border-b border-gray-100">
         <div className="max-w-7xl mx-auto px-6 space-y-8">
            <div className="space-y-4">
               <h1 className="font-syne font-black text-5xl md:text-7xl text-[#0a1628] tracking-tighter">Health Tips & <br /><span className="text-[#028090]">Medical News.</span></h1>
               <p className="text-gray-400 font-dm text-lg md:text-2xl max-w-2xl italic">Written by Karaikal doctors for Karaikal people. Localized medical architecture insights.</p>
            </div>
            
            <div className="flex flex-col md:flex-row gap-6 pt-10">
               <div className="flex-1 bg-white border border-gray-100 rounded-3xl px-8 py-5 flex items-center gap-4 shadow-sm focus-within:shadow-xl focus-within:border-[#028090]/20 transition group">
                  <Search className="text-gray-300 group-focus-within:text-[#028090]" size={24} />
                  <input 
                    type="text" 
                    placeholder="Search for tips, diseases, or medical news..." 
                    className="bg-transparent border-none outline-none font-dm text-lg w-full text-[#0a1628]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
               </div>
               <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-2">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeCategory === cat ? 'bg-[#0a1628] text-white shadow-xl scale-105' : 'bg-white text-gray-400 border border-gray-100 hover:bg-gray-50'}`}
                    >
                      {cat}
                    </button>
                  ))}
               </div>
            </div>
         </div>
      </section>

      {/* Featured Post (Visual only for now) */}
      <section className="max-w-7xl mx-auto px-6 py-16">
         <div className="grid lg:grid-cols-2 gap-12 group">
            <div className="relative overflow-hidden rounded-[4rem] h-[500px] shadow-2xl">
               <img src={blogPosts[0].image} alt="Featured" className="h-full w-full object-cover group-hover:scale-110 transition duration-700" />
               <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628] via-transparent to-transparent opacity-80" />
               <div className="absolute bottom-12 left-12 right-12 space-y-4">
                  <div className="px-6 py-2 bg-[#02C39A] text-white rounded-full text-[10px] font-black uppercase tracking-widest inline-block shadow-lg">Featured Architecture Article</div>
                  <h2 className="text-white font-syne font-black text-4xl leading-tight hover:text-[#02C39A] transition cursor-pointer">{blogPosts[0].title}</h2>
               </div>
            </div>
            <div className="flex flex-col justify-center space-y-8">
               <div className="space-y-4">
                  <div className="flex items-center gap-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                     <span className="flex items-center gap-2"><Calendar size={14}/> {blogPosts[0].date}</span>
                     <span className="flex items-center gap-2"><Clock size={14}/> {blogPosts[0].readTime}</span>
                     <span className="text-[#028090]">{blogPosts[0].category}</span>
                  </div>
                  <p className="text-xl font-dm text-gray-500 leading-relaxed italic">{blogPosts[0].excerpt}</p>
               </div>
               <div className="flex items-center gap-4 p-6 bg-gray-50 rounded-[2.5rem] border border-gray-100 hover:shadow-lg transition">
                  <div className="h-14 w-14 bg-[#0a1628] text-white rounded-2xl flex items-center justify-center font-black text-xl">{blogPosts[0].author[4]}</div>
                  <div>
                     <div className="font-syne font-black text-[#0a1628]">{blogPosts[0].author}</div>
                     <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{blogPosts[0].authorHospital}</div>
                  </div>
               </div>
               <Link to={`/blog/${blogPosts[0].slug}`} className="w-fit px-12 py-5 bg-[#0a1628] text-white rounded-3xl font-syne font-black text-xs uppercase tracking-widest hover:bg-[#028090] transition shadow-2xl shadow-[#0a1628]/20 flex items-center gap-4 group/btn">
                  Read Full Article <ArrowRight className="group-hover/btn:translate-x-1 transition" size={18} />
               </Link>
            </div>
         </div>
      </section>

      {/* Blog Grid */}
      <section className="max-w-7xl mx-auto px-6 py-24 space-y-16">
         <div className="flex items-center justify-between border-b border-gray-50 pb-8">
            <h2 className="font-syne font-black text-3xl text-[#0a1628]">Recent Architecture Articles</h2>
            <div className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Showing {filteredPosts.length} Results</div>
         </div>

         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
            <AnimatePresence mode="popLayout">
               {filteredPosts.slice(1).map((post, idx) => (
                  <motion.div
                     layout
                     key={post.id}
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     exit={{ opacity: 0, scale: 0.95 }}
                     transition={{ delay: idx * 0.05 }}
                     className="bg-white rounded-[3.5rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col group hover:shadow-3xl transition-all duration-500"
                  >
                     <Link to={`/blog/${post.slug}`} className="h-64 relative block overflow-hidden">
                        <img src={post.image} alt={post.title} className="h-full w-full object-cover group-hover:scale-110 transition duration-700" />
                        <div className="absolute top-6 left-6 px-6 py-2 bg-white/90 backdrop-blur-md text-[#0a1628] rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">{post.category}</div>
                     </Link>
                     <div className="p-10 space-y-6 flex-1 flex flex-col">
                        <div className="space-y-4">
                           <div className="flex items-center gap-4 text-[10px] font-black text-gray-300 uppercase tracking-widest">
                              <span className="flex items-center gap-1.5"><Calendar size={12}/> {post.date}</span>
                              <span className="flex items-center gap-1.5"><Clock size={12}/> {post.readTime}</span>
                           </div>
                           <Link to={`/blog/${post.slug}`}>
                              <h3 className="font-syne font-black text-2xl text-[#0a1628] leading-tight hover:text-[#028090] transition line-clamp-2">{post.title}</h3>
                           </Link>
                           <p className="text-sm font-dm text-gray-400 italic line-clamp-3">{post.excerpt}</p>
                        </div>
                        
                        <div className="mt-auto pt-8 flex items-center justify-between">
                           <div className="flex items-center gap-3">
                              <div className="h-10 w-10 bg-gray-50 text-[#0a1628] rounded-xl flex items-center justify-center font-black text-[10px] border border-gray-100">{post.author[post.author.startsWith('Dr') ? 4 : 0]}</div>
                              <div className="text-[10px] font-black text-[#0a1628] uppercase tracking-widest leading-none">{post.author}</div>
                           </div>
                           <Link to={`/blog/${post.slug}`} className="h-12 w-12 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center text-gray-400 hover:bg-[#0a1628] hover:text-white transition shadow-sm">
                              <ChevronRight size={18} />
                           </Link>
                        </div>
                     </div>
                  </motion.div>
               ))}
            </AnimatePresence>
         </div>

         <div className="pt-16 flex justify-center">
            <button className="px-16 py-6 bg-white border-2 border-gray-100 text-[#0a1628] font-syne font-black text-sm uppercase tracking-[0.2em] rounded-3xl hover:bg-[#0a1628] hover:text-white hover:border-[#0a1628] transition-all shadow-xl">Load More Articles</button>
         </div>
      </section>

      {/* Newsletter */}
      <section className="max-w-7xl mx-auto px-6 py-24">
         <div className="bg-[#0a1628] rounded-[5rem] p-16 md:p-32 text-center text-white relative overflow-hidden group shadow-3xl shadow-[#0a1628]/20">
            <div className="absolute top-0 right-0 h-64 w-64 bg-[#028090] rounded-full blur-[120px] opacity-10" />
            <div className="max-w-3xl mx-auto space-y-12 relative z-10">
               <h2 className="font-syne font-black text-5xl md:text-7xl leading-tight">Join the Karaikal <br /><span className="text-[#02C39A]">Health Network.</span></h2>
               <p className="text-white/40 font-dm text-lg md:text-2xl italic leading-relaxed">Weekly architecture insights, local medical trends, and exclusive pharmacy offers delivered to your inbox.</p>
               <div className="flex flex-col md:flex-row gap-4 max-w-xl mx-auto">
                  <input type="email" placeholder="Your medical email..." className="flex-1 bg-white/5 border border-white/10 rounded-3xl px-10 py-6 text-lg outline-none focus:bg-white/10 focus:border-[#02C39A] transition" />
                  <button className="px-12 py-6 bg-[#02C39A] text-[#0a1628] rounded-3xl font-syne font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-mint shadow-2xl">Subscribe Now &rarr;</button>
               </div>
            </div>
         </div>
      </section>
    </div>
  );
}
