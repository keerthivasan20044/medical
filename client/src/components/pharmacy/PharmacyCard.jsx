import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const PharmacyCard = ({ item: pharmacy }) => {
  const navigate = useNavigate();

  return (
    <div className="w-full bg-[#12151f] rounded-3xl overflow-hidden mb-4">
      {/* Image with overlays */}
      <div className="relative w-full h-48 overflow-hidden">
        <img src={pharmacy.image || '/placeholder-pharmacy.png'} className="w-full h-full object-cover grayscale"
             onError={e => e.target.src = '/placeholder-pharmacy.png'} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute top-3 right-3 flex gap-2">
          <span className="bg-teal-500 text-white text-xs font-bold px-3 py-1 rounded-full">
            Open Now
          </span>
        </div>
        <div className="absolute bottom-3 left-3">
          <span className="bg-black/40 backdrop-blur text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
            Free Delivery
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Name + Rating */}
        <div className="flex items-start gap-2 mb-2">
          <h3 className="flex-1 min-w-0 font-black text-teal-400 text-lg
                         leading-tight break-words">
            {pharmacy.name}
          </h3>
          <span className="flex-shrink-0 bg-red-700 text-white text-xs
                           font-bold px-2 py-1 rounded-lg">
            ★ {pharmacy.rating || '4.5'}
          </span>
        </div>

        {/* Address */}
        <p className="text-gray-400 text-xs line-clamp-2 mb-3">
          {pharmacy.address || pharmacy.location}
        </p>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-3">
          <span className="text-xs bg-teal-900/50 text-teal-300 px-3 py-1 rounded-full">
            Verified
          </span>
          <span className="text-xs bg-teal-900/50 text-teal-300 px-3 py-1 rounded-full">
            Licensed
          </span>
          <span className="text-xs bg-teal-900/50 text-teal-300 px-3 py-1 rounded-full">
            24/7
          </span>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-[10px]">License No.</p>
            <p className="text-white font-bold text-sm">{pharmacy.licenseId || 'N/A'}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-teal-400 text-sm font-bold">
              {pharmacy.distance || '1.2'} km
            </span>
            <button
              onClick={() => navigate(`/pharmacies/${pharmacy.id || pharmacy._id}`)}
              className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center"
            >
              <ChevronRight size={18} className="text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PharmacyCard;
