import { forwardRef } from 'react';
import { Heart, ShoppingBag, Activity } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../store/cartSlice';
import { getMedicineImage } from '../../utils/medicineImages';

const MedicineCard = forwardRef(({ item: medicine }, ref) => {
  const dispatch = useDispatch();

  if (!medicine) return null;

  const genericPillsUrl = 'photo-1584308666744-24d5c474f2ae';
  const dbImage = medicine.image || medicine.images?.[0]?.url;
  const imageUrl = (dbImage && !dbImage.includes(genericPillsUrl)) 
    ? dbImage 
    : getMedicineImage(medicine.name, medicine.category);

  return (
    <div ref={ref} className="w-full max-w-full rounded-xl overflow-hidden border border-slate-800 bg-slate-900 flex flex-col hover:border-teal-500/50 transition-all duration-300">
      <div className="aspect-square w-full bg-slate-800 p-3 relative group">
        <img 
          src={imageUrl} 
          alt={medicine.name}
          className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110" 
          loading="lazy"
          onError={e => { e.target.src = getMedicineImage('default') }}
        />
        {medicine.discount && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg">
            -{medicine.discount}%
          </div>
        )}
      </div>
      <div className="p-3 flex flex-col gap-2 flex-1">
        <h3 className="text-sm font-semibold text-white line-clamp-2 min-h-[2.5rem] leading-tight">{medicine.name}</h3>
        <p className="text-xs text-slate-400 truncate">{medicine.brand || 'MediPharm'}</p>
        <div className="flex items-center justify-between gap-2 mt-auto pt-2">
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-lg font-bold text-teal-400">₹{medicine.price}</span>
            {medicine.mrp > medicine.price && (
              <span className="text-[10px] text-slate-500 line-through">₹{medicine.mrp}</span>
            )}
          </div>
          <button 
            onClick={() => dispatch(addToCart(medicine))}
            className="flex-shrink-0 w-10 h-10 rounded-lg bg-teal-500 hover:bg-teal-400 active:scale-95 transition-all flex items-center justify-center text-slate-900 shadow-lg shadow-teal-500/20"
          >
            <ShoppingBag size={18} />
          </button>
        </div>
      </div>
    </div>
  );
});

MedicineCard.displayName = 'MedicineCard';

export default MedicineCard;
