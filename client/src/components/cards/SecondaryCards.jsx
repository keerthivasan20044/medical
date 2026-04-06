import { motion } from 'framer-motion';
import { 
  Star, Clock, Bell, Tag, 
  Syringe, CheckCircle, SlidersHorizontal, 
  Copy, ArrowRight, ShieldCheck, 
  Search, Pill, Info, Zap, 
  AlertCircle, TrendingUp
} from 'lucide-react';
import { toast } from 'react-hot-toast';

/**
 * Customer review node card.
 */
export function ReviewCard({ review }) {
  return (
    <div className="bg-[#f8fafc] p-10 rounded-[3rem] border border-gray-100 flex flex-col justify-between hover:bg-white hover:shadow-2xl hover:-translate-y-2 transition duration-500 group">
       <div className="space-y-6">
          <div className="flex items-center gap-2">
             {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} className={i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'} />
             ))}
          </div>
          <p className="text-xl font-dm text-gray-400 italic leading-relaxed group-hover:text-[#0a1628] transition duration-500">"{review.comment}"</p>
       </div>
       <div className="pt-10 border-t border-gray-50 flex items-center gap-6">
          <div className="h-14 w-14 bg-[#0a1628] text-white rounded-2xl flex items-center justify-center font-black text-xl shadow-lg">{review.user[0]}</div>
          <div>
             <div className="font-syne font-black text-lg text-[#0a1628] uppercase tracking-tighter">{review.user}</div>
             <div className="text-[10px] text-gray-300 font-bold uppercase tracking-widest">{review.date} Enclave</div>
          </div>
       </div>
    </div>
  );
}

/**
 * System notification stream card.
 */
export function NotificationCard({ notification }) {
  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 flex items-start gap-8 hover:bg-gray-50 transition group cursor-pointer">
       <div className="h-14 w-14 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center text-[#028090] group-hover:bg-[#0a1628] group-hover:text-white transition shadow-sm">
          <Bell size={24} className="group-hover:animate-shake" />
       </div>
       <div className="space-y-2 flex-1 relative">
          <div className="flex items-center justify-between">
             <div className="text-[10px] text-gray-300 font-black uppercase tracking-widest italic">{notification.time} Enclave</div>
             {!notification.read && <div className="h-2 w-2 bg-red-500 rounded-full animate-ping-slow" />}
          </div>
          <h4 className="font-syne font-black text-lg text-[#0a1628] leading-tight">{notification.title}</h4>
          <p className="text-xs font-dm text-gray-400 italic leading-relaxed">{notification.desc}</p>
       </div>
    </div>
  );
}

/**
 * Promotional architecture offer card.
 */
export function OfferCard({ offer, onCopy }) {
  const handleCopy = () => {
    navigator.clipboard.writeText(offer.code);
    toast.success(`${offer.code} architecture copied!`);
    if (onCopy) onCopy(offer.code);
  };

  return (
    <div className="bg-[#0a1628] p-10 rounded-[3.5rem] text-white relative overflow-hidden group hover:shadow-4xl transition-all duration-700">
       <div className="absolute top-0 right-0 h-40 w-40 bg-[#028090] rounded-full blur-[80px] opacity-20" />
       <div className="space-y-8 relative z-10">
          <div className="flex items-center justify-between">
             <div className="px-6 py-2 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest italic flex items-center gap-2 border border-white/5 shadow-lg">
                <Tag size={12} className="text-[#02C39A]" /> {offer.type} Enclave
             </div>
             <div className="text-[10px] text-white/30 font-black uppercase tracking-widest">{offer.valid}</div>
          </div>
          <div className="space-y-3">
             <h3 className="font-syne font-black text-3xl leading-tight group-hover:text-[#02C39A] transition">{offer.title}</h3>
             <p className="text-white/40 font-dm text-sm italic">{offer.sub}</p>
          </div>
          <div className="flex gap-4 pt-4">
             <button onClick={handleCopy} className="flex-1 py-4 bg-white/10 hover:bg-white hover:text-[#0a1628] transition rounded-2xl font-syne font-black text-[10px] uppercase tracking-widest border border-white/5 flex items-center justify-center gap-3">
                <Copy size={16} /> {offer.code}
             </button>
             <button className="h-14 w-14 bg-[#02C39A] text-[#0a1628] rounded-2xl flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all"><ArrowRight size={20}/></button>
          </div>
       </div>
    </div>
  );
}

/**
 * Immunization node card.
 */
export function VaccineCard({ vaccine, onBook }) {
  return (
    <div className="bg-white p-10 rounded-[4rem] border border-gray-100 flex flex-col md:flex-row gap-12 group hover:shadow-3xl transition duration-500 overflow-hidden relative">
       <div className="absolute top-0 right-0 h-24 w-24 bg-teal-500 rounded-full blur-[60px] opacity-0 group-hover:opacity-10 transition duration-1000" />
       <div className="h-40 w-40 rounded-[3rem] overflow-hidden shrink-0 shadow-2xl relative">
          <img src={vaccine.image} alt="Vaccine" className="h-full w-full object-cover group-hover:scale-110 transition duration-1000" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628]/40 to-transparent" />
          <div className="absolute bottom-4 left-4 text-white font-syne font-black text-[10px] uppercase tracking-widest italic">{vaccine.type}</div>
       </div>
       <div className="flex-1 space-y-6 flex flex-col justify-center">
          <div className="space-y-2">
             <div className="flex items-center gap-6">
                <div className="px-4 py-1.5 bg-[#f8fafc] border border-gray-50 rounded-xl text-[10px] font-black text-[#028090] uppercase tracking-widest flex items-center gap-2 shadow-sm"><Syringe size={12}/> Protocol Enclave</div>
                {vaccine.recommended && <div className="text-[10px] text-emerald-500 font-dm italic font-bold">Highly Recommended Architecture</div>}
             </div>
             <h3 className="font-syne font-black text-3xl text-[#0a1628] group-hover:text-[#028090] transition">{vaccine.name}</h3>
             <p className="text-gray-400 font-dm italic text-lg leading-relaxed line-clamp-2">{vaccine.desc}</p>
          </div>
          <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
             <div className="text-2xl font-syne font-black text-[#0a1628]">₹{vaccine.price} <span className="text-[10px] text-gray-200 font-black uppercase tracking-widest ml-4 italic underline decoration-[#02C39A]">Architecture Fee</span></div>
             <button onClick={onBook} className="px-10 py-4 bg-[#0a1628] text-white rounded-2xl font-syne font-black text-[10px] uppercase tracking-widest hover:bg-[#028090] transition shadow-xl shadow-[#0a1628]/20">Book Authorized Enclave &rarr;</button>
          </div>
       </div>
    </div>
  );
}

/**
 * ARCHITECTURE STATUS BADGES
 */
export function StockBadge({ qty }) {
  const config = qty > 20 ? { label: 'In Stock Enclave', color: 'bg-emerald-50 text-emerald-600', dot: 'bg-emerald-500' } :
                qty > 0  ? { label: 'Low Stock Protocol', color: 'bg-orange-50 text-orange-600', dot: 'bg-orange-500' } :
                            { label: 'Out of Enclave', color: 'bg-red-50 text-red-600', dot: 'bg-red-500' };

  return (
    <div className={`px-4 py-1 rounded-xl text-[8px] font-black uppercase tracking-widest flex items-center gap-3 ${config.color} shadow-sm border border-transparent hover:border-white transition`}>
       <div className={`h-1.5 w-1.5 rounded-full ${config.dot} animate-pulse-ring`} /> {config.label} ({qty})
    </div>
  );
}

export function OnlineStatus({ status }) {
  const configs = {
    online: { label: '🟢 Online Enclave', color: 'text-emerald-500' },
    busy: { label: '🟠 Busy Protocol', color: 'text-orange-500' },
    offline: { label: '🔴 Offline Stream', color: 'text-gray-300' }
  };
  const c = configs[status] || configs.offline;
  return <div className={`text-[10px] font-black uppercase tracking-[0.2em] italic ${c.color} animate-fade-in`}>{c.label}</div>;
}

export function OrderStatus({ status }) {
  const steps = ['Protocol Pending', 'Enclave Processing', 'Node In-Transit', 'Delivered Sync'];
  const current = steps.indexOf(status) || 0;

  return (
    <div className="flex items-center gap-4 py-8">
       {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-4">
             <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center transition-all duration-700 ${i <= current ? 'bg-[#02C39A] border-[#02C39A] text-white shadow-mint' : 'bg-white border-gray-100 text-gray-200'}`}>
                {i < current ? <CheckCircle size={10} /> : <div className="h-1 w-1 bg-current rounded-full" />}
             </div>
             {i < steps.length - 1 && <div className={`h-1 w-12 rounded-full transition-all duration-1000 ${i < current ? 'bg-[#02C39A]' : 'bg-gray-100'}`} />}
          </div>
       ))}
    </div>
  );
}

export function VerifiedBadge() {
  return (
    <div className="px-6 py-2 bg-[#028090]/5 border border-[#028090]/10 rounded-2xl flex items-center gap-3 text-[#0a1628] font-syne font-black text-[10px] uppercase tracking-widest italic shadow-sm">
       <CheckCircle size={12} className="text-[#028090] animate-bounce-slow" /> Verified Architecture
    </div>
  );
}

export function RxBadge() {
  return (
    <div className="px-6 py-2 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center gap-3 text-indigo-700 font-syne font-black text-[10px] uppercase tracking-widest italic shadow-sm group hover:bg-indigo-700 hover:text-white transition duration-500">
       <ShieldCheck size={12} className="group-hover:animate-float" /> Rx Protocol Authority
    </div>
  );
}

export function RatingStars({ rating, count }) {
  return (
    <div className="flex items-center gap-4">
       <div className="flex items-center gap-1.5">
          {[...Array(5)].map((_, i) => (
             <Star key={i} size={14} className={i < Math.floor(rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-100'} />
          ))}
       </div>
       <span className="text-[10px] font-black text-[#0a1628] uppercase tracking-tighter">{rating} <span className="text-gray-200 italic ml-2">({count} Enclave Nodes)</span></span>
    </div>
  );
}

export function PriceBadge({ price, mrp, discount }) {
  return (
    <div className="flex flex-col">
       <div className="flex items-center gap-4">
          <div className="text-3xl font-syne font-black text-[#0a1628]">₹{price}</div>
          {discount > 0 && <div className="px-3 py-1 bg-red-500 text-white rounded-lg text-[8px] font-black uppercase tracking-widest shadow-lg animate-pulse">Save {discount}%</div>}
       </div>
       {mrp > price && <div className="text-[10px] text-gray-200 font-black line-through italic tracking-widest uppercase">MRP: ₹{mrp} Protocol</div>}
    </div>
  );
}
