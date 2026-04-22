import { forwardRef } from 'react';
import { Heart, ShoppingBag } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../store/cartSlice';
import { getMedicineImage } from '../../data/medicineImages';

const MedicineCard = forwardRef(({ item: medicine }, ref) => {
  const dispatch = useDispatch();

  if (!medicine) return null;

  const genericPillsUrl = 'photo-1584308666744-24d5c474f2ae';
  const dbImage = medicine.image || medicine.images?.[0]?.url;
  const imageUrl = (dbImage && !dbImage.includes(genericPillsUrl)) 
    ? dbImage 
    : getMedicineImage(medicine.name, medicine.category);

  return (
    <div ref={ref} className="w-full bg-white rounded-2xl overflow-hidden shadow-sm">
      {/* Image */}
      <div className="relative w-full h-44 overflow-hidden bg-gray-100">
        <img
          src={imageUrl}
          alt={medicine.name}
          className="w-full h-full object-cover"
          loading="lazy"
          onError={e => { e.target.src = getMedicineImage('default') }}
        />
        <button className="absolute top-3 left-3 w-8 h-8 bg-white rounded-full
                           flex items-center justify-center shadow-sm">
          <Heart size={14} className="text-gray-400" />
        </button>
        {medicine.discount && (
          <span className="absolute top-3 right-3 bg-red-500 text-white
                           text-xs font-bold px-2 py-0.5 rounded-full">
            -{medicine.discount}%
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-3">
        <span className="text-[10px] text-teal-600 font-bold bg-teal-50
                         px-2 py-0.5 rounded-full">
          {medicine.category}
        </span>
        <h3 className="font-black text-navy text-sm mt-1 leading-tight
                       line-clamp-2">
          {medicine.name}
        </h3>
        <p className="text-gray-400 text-xs mt-0.5">{medicine.brand}</p>
        <div className="flex items-center gap-2 mt-2 select-none">
          <span className="font-black text-navy text-base">₹{medicine.price}</span>
          {medicine.mrp && (
            <span className="text-gray-400 text-xs line-through">₹{medicine.mrp}</span>
          )}
        </div>
        <div className="flex items-center justify-between mt-1 mb-3">
          <span className="flex items-center gap-1 text-[10px] text-green-500 font-bold">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
            In Stock
          </span>
          {medicine.requiresPrescription && (
            <span className="text-[10px] text-orange-500 font-bold">Rx Required</span>
          )}
        </div>
        <button
          onClick={() => dispatch(addToCart(medicine))}
          className="w-full bg-[#0a0f1e] text-white font-bold py-2.5
                     rounded-xl text-sm flex items-center justify-center gap-2"
        >
          <ShoppingBag size={14} /> Add to Cart
        </button>
      </div>
    </div>
  );
});

MedicineCard.displayName = 'MedicineCard';

export default MedicineCard;
