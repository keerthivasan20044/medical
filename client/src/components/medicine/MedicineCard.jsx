import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, Heart, ShoppingBag, Store, FileText, CheckCircle2, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MedicineCard({ item, onAdd, isAdded, layout = 'grid' }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const id = item.id || item._id;
  const { name, brand, generic, category, price, mrp, discount, stock, stockCount, requiresRx, pharmacyName, images } = item;
  
  const isOutOfStock = stock === 'out' || stockCount === 0;
  const isLowStock = stockCount > 0 && stockCount < 20;

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`group bg-white border border-black/[0.03] rounded-[3rem] overflow-hidden shadow-soft hover:shadow-4xl transition-all duration-700 relative flex flex-col ${layout === 'list' ? 'md:flex-row md:h-64' : ''}`}
    >
      {/* Product Image Terminal */}
      <div className={`relative overflow-hidden shrink-0 bg-gray-50 ${layout === 'list' ? 'md:w-64 h-full' : 'h-44 w-full'}`}>
        <img 
          src={images[0]} 
          alt={name} 
          className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110" 
        />
        
        {/* Hub Action Overlays */}
        <div className="absolute top-4 inset-x-4 flex justify-between items-start z-10">
           <button 
             onClick={(e) => { e.preventDefault(); setIsFavorite(!isFavorite); }}
             className={`h-10 w-10 rounded-xl flex items-center justify-center transition-all duration-500 backdrop-blur-md border ${isFavorite ? 'bg-red-500 border-red-500 text-white shadow-lg' : 'bg-white/40 border-white/20 text-white hover:bg-white hover:text-red-500'}`}
           >
              <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} className={isFavorite ? 'animate-heartbeat' : ''} />
           </button>
           {discount > 0 && (
             <div className="bg-red-500 text-white text-[9px] font-black px-3 py-1.5 rounded-lg shadow-4xl tracking-widest uppercase italic border border-red-400/30">
                -{discount}% Sync
             </div>
           )}
        </div>

        {/* Intelligence Telemetry Hover */}
        <div className="absolute inset-0 bg-[#0a1628]/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-500 cursor-pointer flex flex-col items-center justify-center p-6 text-center">
           <Link to={`/medicines/${id}`} className="bg-white text-[#0a1628] font-syne font-black text-[9px] px-6 py-3 rounded-xl flex items-center gap-3 transform translate-y-4 group-hover:translate-y-0 transition-all duration-700 uppercase tracking-widest shadow-4xl hover:bg-brand-teal hover:text-white">
              <Eye size={16} /> Quick View
           </Link>
        </div>
      </div>

      {/* Node Data Matrix */}
      <div className="p-6 flex-1 flex flex-col justify-between">
         <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
               <span className="text-[8px] font-black text-brand-teal bg-brand-teal/5 px-3 py-1 rounded-lg uppercase tracking-widest italic border border-brand-teal/10">{category}</span>
               {requiresRx && (
                 <span className="text-[8px] font-black text-purple-600 bg-purple-50 px-3 py-1 rounded-lg uppercase tracking-widest flex items-center gap-2 italic border border-purple-100">
                    <FileText size={12} /> RX Req.
                 </span>
               )}
            </div>
            
            <div className="space-y-1">
               <Link to={`/medicines/${id}`}>
                  <h3 className="font-syne font-black text-[#0a1628] text-lg leading-tight group-hover:text-brand-teal transition-colors uppercase tracking-tighter italic line-clamp-1">{name}</h3>
               </Link>
               <div className="text-[10px] text-gray-400 font-dm font-bold italic truncate tracking-tight">{brand} • {generic}</div>
            </div>

            <div className="flex items-center gap-4 pt-2">
               <div className="font-syne font-black text-[#0a1628] text-2xl tracking-tighter italic">₹{price}</div>
               {mrp > price && (
                 <div className="text-sm text-gray-300 line-through italic font-dm">₹{mrp}</div>
               )}
            </div>
         </div>

         <div className="space-y-5 pt-6 mt-auto">
            <div className="flex items-center justify-between border-t border-black/[0.03] pt-4">
               <div className={`flex items-center gap-2 text-[8px] font-black uppercase tracking-widest italic ${isOutOfStock ? 'text-red-500' : isLowStock ? 'text-orange-500' : 'text-emerald-500'}`}>
                  <div className={`h-1.5 w-1.5 rounded-full animate-pulse ${isOutOfStock ? 'bg-red-500' : isLowStock ? 'bg-orange-500' : 'bg-emerald-500'}`} />
                  {isOutOfStock ? 'Out of Stock' : isLowStock ? 'Low Stock' : 'In Stock'}
               </div>
               <div className="text-[8px] text-gray-300 font-black uppercase tracking-widest flex items-center gap-2 italic">
                  <Store size={12} className="text-brand-teal" /> {pharmacyName}
               </div>
            </div>

            <button
               onClick={(e) => { e.preventDefault(); onAdd && onAdd(item); }}
               disabled={isOutOfStock}
               className={`w-full h-12 rounded-xl font-syne font-black text-[9px] flex items-center justify-center gap-3 transition-all duration-500 uppercase tracking-widest shadow-soft hover:shadow-4xl ${
                  isAdded 
                  ? 'bg-emerald-500 text-white' 
                  : isOutOfStock 
                    ? 'bg-gray-100 text-gray-300 cursor-not-allowed border border-gray-100' 
                    : 'bg-[#0a1628] text-white hover:bg-brand-teal group-hover:scale-[1.02]'
               }`}
            >
               {isAdded ? (
                 <> <CheckCircle2 size={16} /> Synchronized </>
               ) : isOutOfStock ? (
                 'Node Offline'
               ) : (
                 <> <ShoppingBag size={16} /> Add to Payload </>
               )}
            </button>
         </div>
      </div>
    </motion.div>
  );
}
