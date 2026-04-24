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
export function ReviewCard({ review = {} }) {
  const rating = review.rating || 5;
  const user = review.user || 'Anonymous';
  const comment = review.comment || 'No feedback provided.';
  const date = review.date || 'Recent';

  return (
    <div className="w-full bg-slate-900 p-4 rounded-xl border border-slate-800 flex flex-col gap-3 hover:border-teal-500/30 transition-all duration-300">
       <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
             <div className="h-10 w-10 bg-slate-800 text-teal-400 rounded-full flex items-center justify-center font-bold text-sm shrink-0 border border-white/5">{user[0]}</div>
             <div className="min-w-0">
                <div className="text-sm font-semibold text-white truncate max-w-[150px]">{user}</div>
                <div className="text-[10px] text-slate-500">{date}</div>
             </div>
          </div>
          <div className="flex items-center gap-0.5 shrink-0">
             {[...Array(5)].map((_, i) => (
                <Star key={i} size={10} className={i < rating ? 'text-amber-400 fill-amber-400' : 'text-slate-700'} />
             ))}
          </div>
       </div>
       <p className="text-sm text-slate-400 italic leading-relaxed line-clamp-3">"{comment}"</p>
    </div>
  );
}

/**
 * System notification stream card.
 */
export function NotificationCard({ notification = {} }) {
  const { title = 'System Update', desc = 'No details available.', time = 'Recent', read = true, type = 'system' } = notification;
  return (
    <div className="bg-white p-3 rounded-2xl border border-gray-50 flex items-start gap-4 hover:bg-gray-50 transition group cursor-pointer relative overflow-hidden">
       <div className="h-11 w-11 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center text-teal-600 group-hover:bg-navy group-hover:text-white transition shrink-0">
          <Bell size={20} className="group-hover:animate-shake" />
       </div>
       <div className="space-y-1 flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
             <h4 className="font-syne font-black text-sm text-navy truncate">{title}</h4>
             <div className="text-[9px] text-gray-400 font-black uppercase tracking-widest italic shrink-0">{time}</div>
          </div>
          <p className="text-[11px] font-dm text-gray-500 italic leading-tight line-clamp-2">{desc}</p>
       </div>
       {!read && <div className="absolute top-3 right-3 h-2 w-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_#ef4444]" />}
    </div>
  );
}

/**
 * Promotional architecture offer card.
 */
export function OfferCard({ offer = {}, onCopy }) {
  const { code = 'N/A', type = 'Promo', valid = 'Limited Time', title = 'District Offer', sub = 'No description' } = offer;
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    toast.success(`${code} copied!`);
    if (onCopy) onCopy(code);
  };

  return (
    <div className="bg-navy p-6 rounded-3xl text-white relative overflow-hidden group hover:shadow-2xl transition-all duration-500">
       <div className="absolute top-0 right-0 h-32 w-32 bg-teal-500 rounded-full blur-[60px] opacity-10" />
       <div className="space-y-6 relative z-10">
          <div className="flex items-center justify-between">
             <div className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[9px] font-black uppercase tracking-widest italic flex items-center gap-1.5 border border-white/5">
                <Tag size={10} className="text-teal-400" /> {type}
             </div>
             <div className="text-[9px] text-white/40 font-black uppercase tracking-widest">{valid}</div>
          </div>
          <div className="space-y-2">
             <h3 className="font-syne font-black text-2xl leading-tight group-hover:text-teal-400 transition">{title}</h3>
             <p className="text-white/40 font-dm text-xs italic line-clamp-1">{sub}</p>
          </div>
          <div className="flex gap-3 pt-2">
             <button onClick={handleCopy} className="flex-1 py-3 bg-white/10 hover:bg-white hover:text-navy transition rounded-xl font-syne font-black text-[9px] uppercase tracking-widest border border-white/5 flex items-center justify-center gap-2">
                <Copy size={14} /> {code}
             </button>
             <button className="h-11 w-11 bg-teal-500 text-navy rounded-xl flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all"><ArrowRight size={18}/></button>
          </div>
       </div>
    </div>
  );
}

/**
 * Immunization node card.
 */
export function VaccineCard({ vaccine = {}, onBook }) {
  const { image = '/assets/medicine_default.png', name = 'Authorized Vaccine', type = 'Protocol', recommended = false, desc = 'Authorized immunization.', price = 0 } = vaccine;
  return (
    <div className="bg-white p-5 md:p-8 rounded-3xl border border-gray-100 flex flex-col md:flex-row gap-6 md:gap-8 group hover:shadow-xl transition duration-500 overflow-hidden relative">
       <div className="h-40 w-full md:w-40 rounded-2xl overflow-hidden shrink-0 shadow-lg relative bg-gray-50">
          <img src={image} alt="Vaccine" className="h-full w-full object-cover group-hover:scale-110 transition duration-1000" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy/40 to-transparent" />
          <div className="absolute bottom-3 left-3 text-white font-syne font-black text-[9px] uppercase tracking-widest italic">{type}</div>
       </div>
       <div className="flex-1 space-y-4 flex flex-col justify-center">
          <div className="space-y-1">
             <div className="flex items-center gap-3">
                <div className="px-3 py-1 bg-gray-50 border border-gray-100 rounded-lg text-[9px] font-black text-teal-600 uppercase tracking-widest flex items-center gap-1.5 shadow-sm"><Syringe size={10}/> Protocol</div>
                {recommended && <div className="text-[9px] text-emerald-500 font-dm italic font-bold">Recommended</div>}
             </div>
             <h3 className="font-syne font-black text-xl md:text-2xl text-navy group-hover:text-teal-600 transition leading-tight">{name}</h3>
             <p className="text-gray-400 font-dm italic text-xs leading-relaxed line-clamp-2">{desc}</p>
          </div>
          <div className="pt-4 border-t border-gray-50 flex items-center justify-between gap-4">
             <div className="text-xl font-syne font-black text-navy">₹{price} <span className="text-[8px] text-gray-300 font-black uppercase tracking-widest ml-2 italic">Architecture Fee</span></div>
             <button onClick={onBook} className="px-6 py-3 bg-navy text-white rounded-xl font-syne font-black text-[9px] uppercase tracking-widest hover:bg-teal-600 transition shadow-lg shadow-navy/10">Book Enclave &rarr;</button>
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
