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
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white rounded-[3rem] border border-gray-100 p-6 md:p-10 space-y-6 hover:shadow-3xl hover:-translate-y-2 transition-all duration-500 overflow-hidden relative group"
    >
       <div className="absolute top-0 right-0 h-40 w-40 bg-[#028090] rounded-full blur-[80px] opacity-0 group-hover:opacity-10 transition duration-1000" />
       
       <div className="relative h-48 bg-gray-50 rounded-[2.5rem] overflow-hidden">
          <img src={image} alt={name} className="h-full w-full object-cover group-hover:scale-110 transition duration-700" />
          <div className="absolute top-4 left-4 flex gap-4">
             <button className="h-10 w-10 bg-white/90 backdrop-blur-md text-[#0a1628] rounded-xl flex items-center justify-center shadow-lg hover:bg-white transition"><Heart size={18} /></button>
             {discount > 0 && <div className="bg-red-500 text-white px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest shadow-lg italic">-{discount}% Enclave</div>}
          </div>
          {requiresRx && (
            <div className="absolute bottom-4 right-4 px-4 py-1.5 bg-[#0a1628] text-white rounded-full text-[8px] font-black uppercase tracking-widest shadow-lg flex items-center gap-2 border border-white/10">
               <ShieldCheck size={12} className="text-[#02C39A]" /> Rx Protocol
            </div>
          )}
       </div>

       <div className="space-y-4">
          <div className="space-y-1">
             <div className="flex items-center justify-between">
                <div className="text-[10px] text-gray-300 font-bold uppercase tracking-widest leading-none">{brand}</div>
                <div className="text-[10px] text-gray-200 font-bold uppercase tracking-widest italic">{category}</div>
             </div>
             <h3 className="font-syne font-black text-xl text-[#0a1628] line-clamp-1 group-hover:text-[#028090] transition">{name}</h3>
             <div className="text-[10px] text-[#02C39A] font-black uppercase tracking-widest italic">{generic}</div>
          </div>
          
          <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
             <div className="flex flex-col">
                <div className="text-[10px] text-gray-300 font-black line-through leading-none italic">₹{mrp}</div>
                <div className="text-3xl font-syne font-black text-[#0a1628]">₹{price}</div>
             </div>
             <button className="h-14 px-8 bg-[#0a1628] text-[#02C39A] rounded-2xl font-syne font-black text-[10px] uppercase tracking-widest hover:bg-[#028090] hover:text-white transition shadow-lg shadow-[#0a1628]/20">Add Protocol</button>
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
    <Link to={`/pharmacies/${pharmacy.id}`} className="block relative group">
       <div className="absolute -inset-1 bg-gradient-to-r from-[#02C39A] to-[#028090] rounded-[4rem] blur opacity-0 group-hover:opacity-25 transition duration-1000"></div>
       <div className="relative bg-white border border-gray-50 rounded-[4rem] p-8 md:p-12 space-y-10 group-hover:shadow-4xl transition duration-500 overflow-hidden">
          <div className="flex items-start justify-between">
             <div className="relative">
                <div className="h-20 w-20 bg-[#0a1628] text-[#02C39A] rounded-3xl flex items-center justify-center shadow-2xl relative z-10 scale-110"><Store size={36} /></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-24 w-24 bg-[#028090] rounded-full blur-2xl opacity-20 animate-pulse" />
             </div>
             <div className="flex items-center gap-2 bg-gray-50 px-6 py-3 rounded-2xl border border-gray-100">
                <Star size={16} className="text-amber-400 fill-amber-400" />
                <span className="font-syne font-black text-xs text-[#0a1628]">{pharmacy.rating}</span>
                <span className="text-[10px] text-gray-300 font-bold uppercase tracking-widest">Enclave Score</span>
             </div>
          </div>
          
          <div className="space-y-4">
             <h3 className="font-syne font-black text-3xl text-[#0a1628] group-hover:text-[#028090] transition leading-tight">{pharmacy.name}</h3>
             <p className="text-lg font-dm text-gray-400 flex items-center gap-3 italic">
                <MapPin size={20} className="text-[#028090]" /> {pharmacy.location}
             </p>
          </div>
          
          <div className="pt-10 border-t border-gray-50 flex items-center justify-between">
             <div className="space-y-1">
                <div className="text-[10px] text-gray-200 font-black uppercase tracking-widest">Enclave Status</div>
                <div className="text-xs font-dm font-black text-[#0a1628] flex items-center gap-2">
                   <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse-ring" /> Open 24/7 Enclave
                </div>
             </div>
             {showDistance && (
                <div className="px-6 py-3 bg-[#0a1628] text-white rounded-2xl font-syne font-black text-xs uppercase tracking-widest italic">{pharmacy.distance} Enclave Node</div>
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
    <div className="bg-white rounded-[3.5rem] p-8 md:p-12 border border-gray-50 space-y-10 hover:shadow-3xl hover:-translate-y-2 transition-all duration-500 group relative">
       <div className="absolute top-0 right-0 h-40 w-40 bg-[#02C39A] rounded-full blur-[80px] opacity-0 group-hover:opacity-10 transition duration-1000" />
       
       <div className="flex flex-col items-center text-center space-y-6">
          <div className="relative shrink-0">
             <img src={doctor.image} alt={doctor.name} className="h-44 w-44 rounded-[4rem] object-cover ring-8 ring-gray-50 shadow-2xl group-hover:scale-105 transition" />
             <div className="absolute -bottom-4 right-1/2 translate-x-12 h-12 w-12 bg-[#028090] text-white rounded-2xl flex items-center justify-center border-4 border-white shadow-xl animate-float-up"><ShieldCheck size={20} /></div>
          </div>
          <div className="space-y-2">
             <h3 className="font-syne font-black text-3xl text-[#0a1628] group-hover:text-[#028090] transition">{doctor.name}</h3>
             <div className="text-[10px] text-[#02C39A] font-black uppercase tracking-widest italic">{doctor.spec} · {doctor.qual}</div>
             <p className="text-xs text-gray-300 font-dm italic">{doctor.hospital}</p>
          </div>
       </div>
       
       <div className="grid grid-cols-2 gap-4">
          <div className="p-6 bg-gray-50 rounded-3xl text-center space-y-1 group-hover:bg-white border border-transparent group-hover:border-gray-100 transition duration-500">
             <div className="font-syne font-black text-xl text-[#0a1628]">{doctor.experience}Y+</div>
             <div className="text-[8px] text-gray-300 font-black uppercase tracking-widest">Enclave Exp</div>
          </div>
          <div className="p-6 bg-gray-50 rounded-3xl text-center space-y-1 group-hover:bg-white border border-transparent group-hover:border-gray-100 transition duration-500">
             <div className="font-syne font-black text-xl text-[#0a1628]">₹{doctor.fee}</div>
             <div className="text-[8px] text-gray-300 font-black uppercase tracking-widest">Protocol Fee</div>
          </div>
       </div>

       <button onClick={onBook} className="w-full py-6 bg-[#0a1628] text-white rounded-3xl font-syne font-black text-xs uppercase tracking-widest hover:bg-[#028090] transition flex items-center justify-center gap-4 group-hover:shadow-2xl active:scale-95 duration-500">
          Book Authorized Consultation &rarr;
       </button>
    </div>
  );
}

/**
 * Order architecture tracker card.
 */
export function OrderCard({ order, showTrack = true }) {
  const statusColors = {
    'Delivered': 'bg-[#02C39A]',
    'In Transit': 'bg-blue-500',
    'Preparing': 'bg-orange-500',
    'Pending': 'bg-gray-300'
  };

  return (
    <div className="bg-white rounded-[3rem] border border-gray-100 p-10 space-y-10 hover:shadow-2xl transition duration-500 relative overflow-hidden group">
       <div className="flex items-start justify-between">
          <div className="space-y-1">
             <h4 className="font-syne font-black text-2xl text-[#0a1628]">Order #{order.id}</h4>
             <p className="text-xs font-dm text-gray-400 italic">Placed on 24 Mar 2026</p>
          </div>
          <div className={`px-6 py-2 ${statusColors[order.status] || 'bg-gray-200'} text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg animate-pulse`}>
             {order.status} Enclave
          </div>
       </div>
       
       <div className="p-8 bg-gray-50 rounded-3xl space-y-4">
          <div className="flex items-center gap-4">
             <div className="h-12 w-12 bg-white rounded-xl flex items-center justify-center text-[#028090]"><Pill size={20}/></div>
             <div className="text-sm font-dm font-black text-gray-600 truncate">{order.items}</div>
          </div>
       </div>
       
       <div className="flex items-center justify-between pt-6 border-t border-gray-50">
          <div className="space-y-1">
             <div className="text-[10px] text-gray-300 font-black uppercase tracking-widest">Payable Enclave</div>
             <div className="text-2xl font-syne font-black text-[#0a1628]">₹{order.total}</div>
          </div>
          {showTrack && (
            <Link to={`/orders/${order.id}/track`} className="h-14 px-10 bg-[#0a1628] text-white rounded-2xl font-syne font-black text-[10px] uppercase tracking-widest hover:bg-[#028090] transition flex items-center gap-3">
               Track Node <Truck size={18} />
            </Link>
          )}
       </div>
    </div>
  );
}

/**
 * Health insight article preview card.
 */
export function BlogCard({ article }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-[3.5rem] border border-gray-100 p-8 space-y-8 hover:shadow-3xl transition duration-700 overflow-hidden group"
    >
       <Link to={`/blog/${article.slug}`} className="block h-64 rounded-[3rem] overflow-hidden relative">
          <img src={article.image} alt="Blog" className="h-full w-full object-cover group-hover:scale-110 transition duration-1000" />
          <div className="absolute top-6 left-6 px-6 py-2 bg-white/90 backdrop-blur-md text-[#0a1628] rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">{article.category}</div>
       </Link>
       
       <div className="space-y-6">
          <div className="flex items-center gap-6 text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] italic">
             <span className="flex items-center gap-2"><Clock size={14}/> {article.readTime}</span>
             <span className="flex items-center gap-2"><User size={14}/> {article.author}</span>
          </div>
          <Link to={`/blog/${article.slug}`} className="block group/title">
             <h3 className="font-syne font-black text-2xl text-[#0a1628] leading-tight group-hover/title:text-[#028090] transition duration-500">{article.title}</h3>
          </Link>
          <p className="text-gray-400 font-dm text-sm leading-relaxed italic line-clamp-2">{article.excerpt}</p>
          <Link to={`/blog/${article.slug}`} className="pt-6 flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-[#0a1628] hover:text-[#02C39A] transition group/link">
             Read Architecture Insight <ArrowUpRight className="group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition duration-500" size={16} />
          </Link>
       </div>
    </motion.div>
  );
}
