import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star, Clock, Phone, Navigation, Truck, Timer, Heart, ShieldCheck, Pill, ShoppingCart, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PharmacyCard_v2({ item, layout = 'grid' }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const { 
    id, name, location, phone, rating, reviewsCount, is24hr, images, 
    status, distance, eta, deliveryFee, freeThreshold, stock, alerts, 
    isTopRated, isFastest, isAyurvedicSpecialist, isBabyCareSpecialist, services 
  } = item;

  // Calculate stock level visual
  const avgStock = Object.values(stock).reduce((a, b) => a + b, 0) / 6;
  const stockColor = avgStock > 80 ? 'bg-emerald-500' : avgStock > 40 ? 'bg-orange-500' : 'bg-red-500';
  const stockLabel = avgStock > 80 ? 'High' : avgStock > 40 ? 'Medium' : 'Low';

  const stockCategories = [
    { name: 'Tablets', key: 'tablets', icon: '💊' },
    { name: 'Syrups', key: 'syrups', icon: '🧴' },
    { name: 'Vaccines', key: 'vaccines', icon: '💉' },
    { name: 'Injections', key: 'injections', icon: '🩺' },
    { name: 'Baby Care', key: 'baby', icon: '👶' },
    { name: 'Ayurvedic', key: 'ayurvedic', icon: '🌿' }
  ];

  if (layout === 'list') {
    return (
      <motion.div 
        layout
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white rounded-[3rem] overflow-hidden shadow-soft hover:shadow-4xl transition-all duration-700 border border-black/[0.03] group flex flex-col md:flex-row h-auto lg:h-80"
      >
        <div className="md:w-80 h-64 md:h-full relative overflow-hidden shrink-0">
          <img src={images[0]} alt={name} className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110" />
          <div className="absolute top-6 left-6 flex flex-col gap-2">
            <div className={`px-4 py-1.5 rounded-full text-[9px] font-black text-white uppercase tracking-widest italic ${status.includes('OPEN') ? 'bg-emerald-500' : 'bg-red-500'}`}>
               {status}
            </div>
          </div>
        </div>
        
        <div className="flex-1 p-8 flex flex-col lg:flex-row gap-10">
           <div className="flex-1 space-y-4">
              <div className="flex items-center gap-4">
                 <h3 className="font-syne font-black text-2xl text-[#0a1628] uppercase italic tracking-tighter group-hover:text-brand-teal transition-colors">{name}</h3>
                 <ShieldCheck size={18} className="text-blue-500" />
              </div>
              <p className="text-gray-400 font-dm italic text-xs flex items-center gap-2">
                 <MapPin size={14} className="text-brand-teal" /> {location}
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                 <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-xl text-[10px] font-black uppercase italic text-[#0a1628]">
                    <Clock size={12} className="text-brand-teal"/> {item.timings}
                 </div>
                 <a href={`tel:${phone}`} className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-xl text-[10px] font-black uppercase italic text-[#0a1628] hover:bg-brand-teal transition-all">
                    <Phone size={12} className="text-brand-teal"/> {phone}
                 </a>
              </div>
           </div>

           <div className="w-full lg:w-72 bg-gray-50/50 rounded-[2rem] p-6 space-y-4 border border-black/[0.01]">
              <div className="flex justify-between items-center">
                 <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest italic flex items-center gap-2"><Activity size={12}/> Live Stock</span>
                 <span className="text-[9px] text-gray-400 italic">Updated 2 min ago</span>
              </div>
              <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                 {stockCategories.slice(0, 4).map(cat => (
                   <div key={cat.key} className="space-y-1">
                      <div className="flex justify-between text-[8px] font-bold text-gray-400">
                         <span>{cat.icon} {cat.name}</span>
                         <span className={stock[cat.key] > 60 ? 'text-emerald-500' : stock[cat.key] > 30 ? 'text-orange-500' : 'text-red-500'}>
                            {stock[cat.key] > 60 ? 'High' : stock[cat.key] > 30 ? 'Med' : 'Low'}
                         </span>
                      </div>
                      <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                         <div 
                           className={`h-full transition-all duration-1000 ${stock[cat.key] > 60 ? 'bg-emerald-500' : stock[cat.key] > 30 ? 'bg-orange-500' : 'bg-red-500'}`} 
                           style={{ width: `${stock[cat.key]}%` }}
                         />
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           <div className="flex flex-col gap-3 justify-center">
              <Link to={`/pharmacies/${id}`} className="block">
                <button className="h-14 px-8 bg-white border border-brand-teal text-brand-teal font-syne font-black text-[10px] uppercase italic tracking-widest rounded-xl hover:bg-brand-teal hover:text-white transition-all flex items-center justify-center gap-3">
                  <Pill size={16}/> View Node
                </button>
              </Link>
              <button className="h-14 px-8 bg-brand-teal text-[#0a1628] font-syne font-black text-[10px] uppercase italic tracking-widest rounded-xl shadow-mint flex items-center justify-center gap-3">
                <ShoppingCart size={16}/> Order Now
              </button>
           </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white rounded-[3rem] overflow-hidden shadow-soft hover:shadow-4xl transition-all duration-700 border border-black/[0.03] group flex flex-col h-full relative"
    >
      {/* Top Image Section Protocol */}
      <div className="h-56 relative overflow-hidden shrink-0">
         <img src={images[0]} alt={name} className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110" />
         
         {/* Badges Overlay Matrix */}
         <div className="absolute top-6 left-6 flex flex-col gap-2">
            <div className={`px-4 py-1.5 rounded-full text-[9px] font-black text-white uppercase tracking-widest italic shadow-lg ${status.includes('OPEN') ? 'bg-emerald-500' : 'bg-red-500'}`}>
               {status}
            </div>
            {is24hr && (
              <div className="px-4 py-1.5 bg-blue-500 rounded-full text-[9px] font-black text-white uppercase tracking-widest italic shadow-lg">
                 24 Hours Node
              </div>
            )}
         </div>

         <div className="absolute top-6 right-6 flex flex-col gap-2">
            <div className="h-10 w-10 bg-white/90 backdrop-blur-md rounded-xl flex items-center justify-center text-blue-500 shadow-lg border border-white/20">
               <ShieldCheck size={20} />
            </div>
            <button 
              onClick={(e) => { e.preventDefault(); setIsFavorite(!isFavorite); }}
              className={`h-10 w-10 backdrop-blur-md rounded-xl flex items-center justify-center transition-all duration-500 shadow-lg border ${isFavorite ? 'bg-red-500 border-red-500 text-white' : 'bg-white/90 border-white/20 text-[#0a1628] hover:text-red-500'}`}
            >
               <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} className={isFavorite ? 'animate-heartbeat' : ''} />
            </button>
         </div>

         <div className="absolute bottom-6 left-6 px-4 py-1.5 bg-white rounded-xl text-[10px] font-black text-[#0a1628] uppercase italic shadow-4xl flex items-center gap-2">
            <Activity size={14} className="text-emerald-500 animate-pulse"/> {eta}
         </div>

         {/* LIVE STOCK METER Pulse */}
         <div className="absolute bottom-0 inset-x-0 h-1.5 bg-gray-200/20 backdrop-blur-sm">
            <motion.div 
               initial={{ width: 0 }}
               whileInView={{ width: `${avgStock}%` }}
               transition={{ duration: 1.5, ease: "easeOut" }}
               className={`h-full ${stockColor}`}
            />
            <div className="absolute -top-6 right-2 px-3 py-0.5 bg-black/60 backdrop-blur-md rounded-lg text-[8px] font-black text-white uppercase italic tracking-widest">
               STOCK: {stockLabel}
            </div>
         </div>
      </div>

      {/* Body Section Hub */}
      <div className="p-8 flex-1 flex flex-col justify-between space-y-8">
         <div className="space-y-4">
            <div className="flex justify-between items-start gap-4">
               <h3 className="font-syne font-black text-xl text-[#0a1628] uppercase italic tracking-tighter group-hover:text-brand-teal transition-all flex-1 line-clamp-2">{name}</h3>
               <div className="flex items-center gap-1.5">
                  <Star fill="#fbbf24" className="text-amber-400" size={16} />
                  <span className="font-syne font-black text-sm text-[#0a1628] italic pt-1">{rating}</span>
                  <span className="text-[10px] font-bold text-gray-300 italic pt-1">({reviewsCount})</span>
               </div>
            </div>

            <div className="flex items-start gap-2 text-gray-400 font-dm font-bold italic text-xs leading-none border-b border-black/[0.02] pb-4">
               <MapPin size={14} className="text-brand-teal shrink-0" /> {location}
            </div>

            <div className="flex flex-wrap gap-2">
               <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase italic text-gray-400">
                  <Clock size={12} className="text-brand-teal"/> {item.timings}
               </div>
               <div className="flex items-center gap-2 bg-gray-100/50 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase italic text-brand-teal">
                  <Navigation size={12}/> {distance}km Away
               </div>
            </div>
         </div>

         {/* LIVE STOCK OVERVIEW Matrix */}
         <div className="bg-gray-50/80 rounded-2xl p-4 space-y-4 border border-black/[0.01]">
            <div className="flex justify-between items-center bg-white/50 rounded-lg px-3 py-2">
               <span className="text-[9px] font-black text-[#0a1628] uppercase tracking-widest italic flex items-center gap-2">📦 Live Stock Registry</span>
               <span className="text-[8px] text-gray-400 italic">Updated 2m ago</span>
            </div>
            
            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
               {stockCategories.map(cat => (
                 <div key={cat.key} className="space-y-1">
                    <div className="flex justify-between text-[8px] font-black text-gray-400 uppercase italic">
                       <span>{cat.icon} {cat.name}</span>
                       <span className={stock[cat.key] > 60 ? 'text-emerald-500' : stock[cat.key] > 30 ? 'text-orange-500' : 'text-red-500'}>
                          {stock[cat.key] > 60 ? 'High' : stock[cat.key] > 30 ? 'Med' : 'Low'}
                       </span>
                    </div>
                    <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                       <motion.div 
                         initial={{ width: 0 }}
                         whileInView={{ width: `${stock[cat.key]}%` }}
                         transition={{ duration: 1, delay: 0.2 }}
                         className={`h-full ${stock[cat.key] > 60 ? 'bg-emerald-500' : stock[cat.key] > 30 ? 'bg-orange-500' : 'bg-red-500'}`} 
                       />
                    </div>
                 </div>
               ))}
            </div>

            {alerts && alerts.length > 0 && (
               <div className="flex flex-wrap gap-2 pt-2 border-t border-black/[0.03]">
                  {alerts.map((alert, i) => (
                    <div key={i} className={`px-2 py-1 rounded text-[8px] font-black uppercase italic tracking-tighter ${alert.includes('Out') || alert.includes('Unavailable') ? 'bg-red-50 text-red-500' : 'bg-orange-50 text-orange-500'}`}>
                       ⚠️ {alert}
                    </div>
                  ))}
               </div>
            )}
         </div>

         <div className="space-y-4">
            <div className="flex items-center justify-between text-[10px] font-black uppercase italic tracking-widest text-gray-400">
               <div className="flex items-center gap-2"><Truck size={12}/> Delivery: \u20B9{deliveryFee}</div>
               <div className="flex items-center gap-2"><Timer size={12}/> {eta}</div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <Link to={`/pharmacies/${id}`} className="block">
                 <button className="w-full h-14 bg-white border border-brand-teal text-brand-teal font-syne font-black text-[9px] uppercase italic tracking-widest rounded-xl hover:bg-brand-teal hover:text-white transition-all flex items-center justify-center gap-3">
                    <Pill size={16}/> Node Hub
                 </button>
               </Link>
               <button className="w-full h-14 bg-[#0a1628] text-brand-teal font-syne font-black text-[9px] uppercase italic tracking-widest rounded-xl shadow-4xl flex items-center justify-center gap-3 hover:bg-brand-teal hover:text-[#0a1628] transition-all">
                  <ShoppingCart size={16}/> Uplink
               </button>
            </div>
         </div>
      </div>

      {/* Specialty Badges Logic */}
      {isTopRated && (
        <div className="absolute top-3 right-20 z-20">
           <div className="bg-amber-500 text-white text-[8px] font-black px-3 py-1 rounded-lg uppercase italic tracking-widest shadow-lg animate-pulse">
              TOP RATED ⭐
           </div>
        </div>
      )}
      {isFastest && (
        <div className="absolute top-14 right-20 z-20">
           <div className="bg-[#0a1628] text-brand-teal text-[8px] font-black px-3 py-1 rounded-lg uppercase italic tracking-widest shadow-lg border border-brand-teal/20">
              FASTEST 🚀
           </div>
        </div>
      )}
    </motion.div>
  );
}
