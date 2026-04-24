import { motion } from 'framer-motion';
import { 
  Pill, Store, User, Clock, 
  MapPin, Star, Heart, Share2, 
  ChevronRight, ArrowUpRight, ShieldCheck, 
  Truck, CheckCircle, Gift, SlidersHorizontal, 
  Tag, Activity, TrendingUp, BookOpen, AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * Standard pharmaceutical unit card.
 */
export function MedicineCard({ medicine, pharmacyId }) {
  const { id, name, brand, generic, category, price, mrp, discount, image, requiresRx } = medicine;
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="w-full max-w-full rounded-2xl overflow-hidden border border-gray-100 bg-white flex flex-col hover:shadow-2xl transition-all duration-300 relative group"
    >
       <div className="aspect-square w-full overflow-hidden bg-gray-50 relative">
          <img 
            src={image} 
            alt={name} 
            className="w-full h-full object-contain p-4 group-hover:scale-110 transition duration-500" 
            loading="lazy"
            onError={(e) => { e.target.src = '/assets/medicine_default.png'; }}
          />
          <div className="absolute top-2 left-2 flex flex-col gap-1">
             {discount > 0 && (
               <div className="bg-red-500 text-white px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg italic">
                 -{discount}%
               </div>
             )}
             {requiresRx && (
               <div className="bg-navy px-2 py-1 rounded-full text-[8px] font-black text-white uppercase tracking-widest flex items-center gap-1 border border-white/10">
                  <ShieldCheck size={10} className="text-[#02C39A]" /> Rx
               </div>
             )}
          </div>
          <button className="absolute top-2 right-2 h-8 w-8 bg-white/80 backdrop-blur-md text-[#0a1628] rounded-lg flex items-center justify-center shadow-md hover:bg-white transition opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100">
            <Heart size={14} />
          </button>
       </div>

       <div className="p-3 flex flex-col gap-1 flex-1">
          <div className="flex items-center justify-between gap-2">
             <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest truncate">{brand}</div>
          </div>
          <h3 className="font-syne font-bold text-sm md:text-base text-[#0a1628] line-clamp-2 min-h-[2.5rem] group-hover:text-teal-600 transition leading-tight">
            {name}
          </h3>
          <div className="text-[9px] text-[#02C39A] font-black uppercase tracking-tighter truncate italic">{generic}</div>
          
          <div className="pt-3 mt-auto flex items-center justify-between gap-2">
             <div className="flex flex-col min-w-0">
                {discount > 0 && <div className="text-[9px] text-gray-300 font-black line-through leading-none italic">₹{mrp}</div>}
                <div className="text-lg font-syne font-black text-[#0a1628]">₹{price}</div>
             </div>
             <button className="h-10 min-w-10 px-3 bg-navy text-teal-400 rounded-xl font-syne font-black text-[9px] uppercase tracking-widest hover:bg-teal-500 hover:text-white transition shadow-lg shadow-navy/10 flex items-center justify-center">
               <span className="hidden sm:inline">Add</span>
               <span className="sm:hidden text-lg">+</span>
             </button>
          </div>
       </div>
    </motion.div>
  );
}

/**
 * Licensed pharmacy node card.
 */
export function PharmacyCard({ pharmacy, showDistance = true }) {
  return (
    <Link to={`/pharmacies/${pharmacy.id}`} className="block w-full max-w-full rounded-2xl overflow-hidden border border-gray-100 bg-white flex flex-col hover:shadow-2xl transition duration-500 relative group">
       <div className="aspect-video w-full overflow-hidden relative bg-gray-100">
          <img 
            src={pharmacy.image || "https://images.unsplash.com/photo-1587854680352-936b22b91030?auto=format&fit=crop&q=80&w=1000"} 
            alt={pharmacy.name} 
            className="w-full h-full object-cover group-hover:scale-110 transition duration-1000" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
          <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg text-white ${pharmacy.isOpen ? 'bg-teal-500' : 'bg-red-500'}`}>
             {pharmacy.isOpen ? 'Open' : 'Closed'}
          </div>
       </div>
       
       <div className="p-4 flex flex-col gap-2">
          <div className="flex items-start justify-between gap-2">
             <div className="flex-1 min-w-0">
                <h3 className="font-syne font-black text-base md:text-lg text-[#0a1628] group-hover:text-teal-600 transition leading-tight truncate">
                  {pharmacy.name}
                </h3>
                <p className="text-xs font-dm text-gray-400 flex items-center gap-1 italic truncate">
                   <MapPin size={12} className="text-teal-600 shrink-0" /> {pharmacy.location}
                </p>
             </div>
             <div className="flex-shrink-0 flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-lg border border-gray-100">
                <Star size={12} className="text-amber-400 fill-amber-400" />
                <span className="font-syne font-black text-xs text-[#0a1628]">{pharmacy.rating}</span>
             </div>
          </div>
          
          <div className="pt-3 mt-2 border-t border-gray-50 flex items-center justify-between text-[10px] text-gray-400 font-bold uppercase tracking-widest italic">
             <div className="flex items-center gap-1">
                <Clock size={12} className="text-teal-500" /> 24/7
             </div>
             {showDistance && (
                <div className="flex items-center gap-1 text-navy">
                  <Truck size={12} className="text-teal-500" /> {pharmacy.distance}
                </div>
             )}
          </div>
       </div>
    </Link>
  );
}

/**
 * Verified medical authority card.
 */
export function DoctorCard({ doctor, onBook }) {
  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 space-y-6 hover:shadow-2xl transition-all duration-300 group relative">
       <div className="flex flex-col items-center text-center space-y-4">
          <div className="relative shrink-0">
             <img 
               src={doctor.image} 
               alt={doctor.name} 
               className="h-24 w-24 md:h-32 md:w-32 rounded-2xl object-cover ring-4 ring-gray-50 shadow-xl group-hover:scale-105 transition" 
             />
             <div className="absolute -bottom-2 right-1/2 translate-x-10 h-8 w-8 bg-teal-600 text-white rounded-lg flex items-center justify-center border-2 border-white shadow-lg">
               <ShieldCheck size={16} />
             </div>
          </div>
          <div className="space-y-1">
             <h3 className="font-syne font-black text-lg md:text-xl text-[#0a1628] group-hover:text-teal-600 transition leading-tight">
               {doctor.name}
             </h3>
             <div className="text-[10px] text-teal-500 font-black uppercase tracking-widest italic">
               {doctor.spec} · {doctor.qual}
             </div>
             <p className="text-[10px] text-gray-400 font-dm italic truncate max-w-[200px] mx-auto">
               {doctor.hospital}
             </p>
          </div>
       </div>
       
       <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-gray-50 rounded-xl text-center space-y-0.5 border border-transparent hover:border-gray-200 transition">
             <div className="font-syne font-black text-sm text-[#0a1628]">{doctor.experience}Y+</div>
             <div className="text-[8px] text-gray-400 font-black uppercase tracking-widest leading-none">Experience</div>
          </div>
          <div className="p-3 bg-gray-50 rounded-xl text-center space-y-0.5 border border-transparent hover:border-gray-200 transition">
             <div className="font-syne font-black text-sm text-[#0a1628]">₹{doctor.fee}</div>
             <div className="text-[8px] text-gray-400 font-black uppercase tracking-widest leading-none">Consult Fee</div>
          </div>
       </div>

       <button onClick={onBook} className="w-full py-4 bg-navy text-white rounded-xl font-syne font-black text-[10px] uppercase tracking-widest hover:bg-teal-600 transition flex items-center justify-center gap-2 active:scale-95 duration-300">
          Book Consultation &rarr;
       </button>
    </div>
  );
}

/**
 * Order architecture tracker card.
 */
export function OrderCard({ order, showTrack = true }) {
  const statusColors = {
    'Delivered': 'bg-teal-500',
    'In Transit': 'bg-blue-500',
    'Preparing': 'bg-amber-500',
    'Pending': 'bg-gray-400',
    'Cancelled': 'bg-red-500'
  };

  return (
    <div className="w-full max-w-full p-4 rounded-xl border border-slate-800 bg-slate-900 flex flex-col gap-3 hover:border-teal-500/30 transition-all duration-300">
       <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
             <h4 className="text-sm font-semibold text-white truncate">Order #{order.id}</h4>
             <p className="text-[10px] text-slate-400">Placed on {order.date || '24 Mar 2026'}</p>
          </div>
          <div className={`flex-shrink-0 px-2 py-0.5 ${statusColors[order.status] || 'bg-slate-700'} text-white rounded-full text-[10px] font-bold uppercase tracking-wider`}>
             {order.status}
          </div>
       </div>
       
       <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-slate-800 rounded-lg flex items-center justify-center text-teal-400 shrink-0">
            <Pill size={18}/>
          </div>
          <div className="text-xs text-slate-300 truncate flex-1">
            {order.items}
          </div>
          {order.itemThumbnails?.length > 0 && (
            <div className="flex -space-x-2 overflow-hidden flex-shrink-0">
              {order.itemThumbnails.slice(0, 3).map((img, i) => (
                <img key={i} src={img} className="inline-block h-6 w-6 rounded-full ring-2 ring-slate-900 object-cover" alt="" />
              ))}
            </div>
          )}
       </div>
       
       <div className="flex items-center justify-between pt-2 border-t border-white/5 mt-1">
          <div className="flex flex-col">
             <span className="text-[10px] text-slate-500 uppercase font-bold">Total</span>
             <span className="text-base font-bold text-teal-400">₹{order.total}</span>
          </div>
          {showTrack && (
            <Link to={`/orders/${order.id}/track`} className="h-9 px-4 bg-teal-500 hover:bg-teal-400 text-slate-900 rounded-lg font-bold text-xs transition-all flex items-center gap-2">
               Track <Truck size={14} />
            </Link>
          )}
       </div>
    </div>
  
/**
 * Health insight article preview card.
 */
export function BlogCard({ article }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-3xl border border-gray-100 p-4 md:p-6 space-y-6 hover:shadow-2xl transition duration-500 overflow-hidden group"
    >
       <Link to={`/blog/${article.slug}`} className="block h-48 md:h-64 rounded-2xl overflow-hidden relative">
          <img src={article.image} alt="Blog" className="h-full w-full object-cover group-hover:scale-110 transition duration-1000" />
          <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-md text-[#0a1628] rounded-lg text-[9px] font-black uppercase tracking-widest shadow-xl">{article.category}</div>
       </Link>
       
       <div className="space-y-4">
          <div className="flex items-center gap-4 text-[9px] font-black text-gray-300 uppercase tracking-widest italic">
             <span className="flex items-center gap-1.5"><Clock size={12}/> {article.readTime}</span>
             <span className="flex items-center gap-1.5"><User size={12}/> {article.author}</span>
          </div>
          <Link to={`/blog/${article.slug}`} className="block group/title">
             <h3 className="font-syne font-black text-lg md:text-xl text-[#0a1628] leading-tight group-hover/title:text-teal-600 transition duration-300 line-clamp-2">{article.title}</h3>
          </Link>
          <p className="text-gray-400 font-dm text-xs leading-relaxed italic line-clamp-2">{article.excerpt}</p>
          <Link to={`/blog/${article.slug}`} className="pt-2 flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-navy hover:text-teal-600 transition group/link">
             Read Insight <ArrowUpRight className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition duration-300" size={14} />
          </Link>
       </div>
    </motion.div>
  );
}
