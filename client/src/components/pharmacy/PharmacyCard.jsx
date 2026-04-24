import { motion } from 'framer-motion';
import { Store, MapPin, Star, Clock, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PharmacyCard({ pharmacy, idx }) {
  const isOpen = pharmacy.isOpen !== false;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.05 }}
      className="bg-white rounded-[3rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-navy/5 transition-all group overflow-hidden flex flex-col h-full"
    >
      {/* Photo Header */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <img 
          src={pharmacy.mainPhoto || 'https://images.unsplash.com/photo-1586015555751-63bb77f4322a?q=80&w=1000&auto=format&fit=crop'} 
          alt={pharmacy.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/60 via-transparent to-transparent" />
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex gap-2">
           <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest backdrop-blur-md border ${
             isOpen ? 'bg-emerald-500/80 text-white border-white/20' : 'bg-red-500/80 text-white border-white/20'
           }`}>
             {isOpen ? 'Open Now' : 'Closed'}
           </div>
           {pharmacy.isVerified && (
             <div className="h-8 w-8 bg-brand-teal text-navy rounded-full flex items-center justify-center border-2 border-white shadow-lg">
                <ShieldCheck size={16} />
             </div>
           )}
        </div>

        <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between text-white">
           <div>
              <div className="flex items-center gap-1 text-amber-400 mb-1">
                 <Star size={12} fill="currentColor" />
                 <span className="text-xs font-syne font-black italic">{pharmacy.rating || '4.8'}</span>
                 <span className="text-[10px] text-white/60 font-bold ml-1">({pharmacy.reviewCount || 120})</span>
              </div>
           </div>
           <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest italic">
              <Zap size={12} className="text-brand-teal" /> {pharmacy.deliveryTime || '15 min'}
           </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-8 flex-1 flex flex-col space-y-4">
        <div>
           <h3 className="font-syne font-black text-xl text-navy uppercase italic group-hover:text-brand-teal transition-colors leading-tight flex-1 min-w-0 truncate">
             {pharmacy.name}
           </h3>
           <div className="flex items-center gap-2 text-xs font-dm font-bold text-navy/40 italic mt-1">
              <MapPin size={14} className="text-brand-teal" />
              {pharmacy.address?.split(',').slice(0, 2).join(',')}
           </div>
        </div>

        <div className="flex flex-wrap gap-2 pt-2">
           {pharmacy.services?.slice(0, 3).map(service => (
             <span key={service} className="px-3 py-1 bg-gray-50 border border-gray-100 rounded-lg text-[8px] font-black text-navy/40 uppercase tracking-widest italic">
                {service}
             </span>
           ))}
        </div>

        <div className="pt-6 mt-auto flex items-center justify-between border-t border-gray-50">
           <div className="text-navy/40 text-[10px] font-black uppercase tracking-widest italic">
              {pharmacy.city || 'Karaikal'}
           </div>
           <Link 
             to={`/pharmacies/${pharmacy._id}`}
             className="h-10 w-10 bg-navy text-brand-teal rounded-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-lg shadow-navy/10"
           >
              <ArrowRight size={18} />
           </Link>
        </div>
      </div>
    </motion.div>
  );
}
