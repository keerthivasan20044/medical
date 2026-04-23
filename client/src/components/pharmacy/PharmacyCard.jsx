import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Star, MapPin, Truck, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const PharmacyCard = ({ item: pharmacy, loading }) => {
  const navigate = useNavigate();
  const [imgLoaded, setImgLoaded] = useState(false);

  // Shimmer Skeleton State
  if (loading) {
    return (
      <div className="w-full bg-[#12151f] rounded-[2.5rem] overflow-hidden mb-6 border border-white/5 animate-pulse">
        <div className="w-full h-48 bg-white/5" />
        <div className="p-6 space-y-4">
          <div className="flex gap-4">
            <div className="h-8 bg-white/5 rounded-xl flex-1" />
            <div className="h-8 w-16 bg-white/5 rounded-xl" />
          </div>
          <div className="h-4 bg-white/5 rounded-full w-3/4" />
          <div className="flex gap-2">
            <div className="h-6 w-20 bg-white/5 rounded-full" />
            <div className="h-6 w-20 bg-white/5 rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  const mainImg = pharmacy.mainPhoto || pharmacy.image || '/assets/pharmacy_pro.png';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
      className="w-full bg-[#12151f] rounded-[2.5rem] overflow-hidden mb-6 border border-white/5 hover:border-teal-500/30 transition-all duration-500 group shadow-2xl"
    >
      {/* Image Container */}
      <div className="relative w-full h-52 overflow-hidden">
        {/* Loading shimmer for image */}
        {!imgLoaded && <div className="absolute inset-0 bg-white/5 animate-pulse" />}
        
        <img 
          src={mainImg} 
          alt={pharmacy.name}
          onLoad={() => setImgLoaded(true)}
          className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
          onError={e => {
            e.target.src = 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800&q=80';
            setImgLoaded(true);
          }}
          loading="lazy"
        />
        
        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#12151f] via-transparent to-transparent" />
        
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <span className={`backdrop-blur-md border px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest italic flex items-center gap-2 ${pharmacy.isOpen || pharmacy.status?.includes('OPEN') ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'}`}>
            <div className={`h-1.5 w-1.5 rounded-full animate-pulse ${pharmacy.isOpen || pharmacy.status?.includes('OPEN') ? 'bg-emerald-500' : 'bg-red-500'}`} />
            {pharmacy.isOpen || pharmacy.status?.includes('OPEN') ? 'Active' : 'Closed'}
          </span>
        </div>

        <div className="absolute bottom-4 left-4">
          <div className="flex items-center gap-2 bg-black/40 backdrop-blur-xl border border-white/10 px-3 py-1.5 rounded-2xl">
            <Truck size={14} className="text-teal-400" />
            <span className="text-white text-[10px] font-black uppercase tracking-tighter italic">
              {pharmacy.deliveryFee === 0 ? 'Free Delivery' : `₹${pharmacy.deliveryFee || 30} Delivery`}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-start justify-between gap-4 mb-3">
          <h3 className="font-syne font-black text-xl text-white group-hover:text-teal-400 transition-colors uppercase italic leading-none tracking-tighter truncate">
            {pharmacy.name}
          </h3>
          <div className="flex items-center gap-1.5 bg-teal-500 text-[#0a1628] px-2.5 py-1 rounded-xl shadow-lg shadow-teal-500/20">
            <Star size={12} fill="currentColor" />
            <span className="font-syne font-black text-xs italic">{pharmacy.rating || '4.5'}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-gray-500 mb-4">
          <MapPin size={14} className="shrink-0" />
          <p className="text-[11px] font-medium truncate uppercase tracking-wider italic">
            {pharmacy.area || (pharmacy.address?.city) || 'Karaikal'}
          </p>
        </div>

        {/* Badges Row */}
        <div className="flex flex-wrap gap-2 mb-6">
          <div className="px-3 py-1.5 bg-white/5 border border-white/5 rounded-xl flex items-center gap-1.5 group/badge hover:bg-teal-500/10 transition-colors">
            <ShieldCheck size={12} className="text-teal-400" />
            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest italic group-hover/badge:text-teal-400">Verified</span>
          </div>
          <div className="px-3 py-1.5 bg-white/5 border border-white/5 rounded-xl flex items-center gap-1.5">
            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest italic">Licensed</span>
          </div>
          {pharmacy.is24hr && (
            <div className="px-3 py-1.5 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-1.5">
              <span className="text-[9px] font-black text-red-400 uppercase tracking-widest italic">24/7</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          <div className="space-y-0.5">
            <p className="text-gray-500 text-[8px] font-black uppercase tracking-[0.2em] italic leading-none">Distance</p>
            <p className="text-white font-syne font-black text-lg italic tracking-tighter">{pharmacy.distance || '1.2'} <span className="text-[10px] text-gray-500 ml-0.5 uppercase">km</span></p>
          </div>
          
          <button
            onClick={() => navigate(`/pharmacies/${pharmacy.id || pharmacy._id}`)}
            className="h-12 w-12 bg-teal-500 rounded-2xl flex items-center justify-center text-[#0a1628] shadow-xl shadow-teal-500/20 hover:scale-110 active:scale-95 transition-all"
          >
            <ChevronRight size={22} strokeWidth={3} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default PharmacyCard;

