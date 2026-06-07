import { forwardRef } from 'react';
import { ShoppingBag } from 'lucide-react';
import { getMedicineImage, getMedicineVisualType } from '../../utils/medicineImages';

const VISUAL_META = {
  tablet: { label: 'Tablets', bg: 'bg-emerald-50', text: 'text-emerald-700', ring: 'ring-emerald-100' },
  capsules: { label: 'Capsules', bg: 'bg-indigo-50', text: 'text-indigo-700', ring: 'ring-indigo-100' },
  syrup: { label: 'Syrup', bg: 'bg-amber-50', text: 'text-amber-700', ring: 'ring-amber-100' },
  vaccine: { label: 'Vaccine', bg: 'bg-cyan-50', text: 'text-cyan-700', ring: 'ring-cyan-100' },
  injection: { label: 'Injection', bg: 'bg-green-50', text: 'text-green-700', ring: 'ring-green-100' },
  drops: { label: 'Drops', bg: 'bg-blue-50', text: 'text-blue-700', ring: 'ring-blue-100' },
  cream: { label: 'Cream', bg: 'bg-pink-50', text: 'text-pink-700', ring: 'ring-pink-100' },
  device: { label: 'Device', bg: 'bg-slate-50', text: 'text-slate-700', ring: 'ring-slate-100' },
  firstAid: { label: 'First Aid', bg: 'bg-rose-50', text: 'text-rose-700', ring: 'ring-rose-100' },
  wellness: { label: 'Wellness', bg: 'bg-lime-50', text: 'text-lime-700', ring: 'ring-lime-100' },
  ayurvedic: { label: 'Herbal', bg: 'bg-lime-50', text: 'text-lime-700', ring: 'ring-lime-100' }
};

const MedicineCard = forwardRef(({ item: medicine, onAdd, isAdded, layout = 'grid' }, ref) => {
  if (!medicine) return null;

  const imageUrl = getMedicineImage(medicine);
  const visualType = getMedicineVisualType(medicine);
  const visual = VISUAL_META[visualType] || VISUAL_META.tablet;
  const isList = layout === 'list';

  return (
    <div
      ref={ref}
      className={`w-full max-w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:border-teal-500/50 hover:shadow-md ${
        isList ? 'grid grid-cols-[112px_1fr]' : 'flex flex-col'
      }`}
    >
      <div className={`${isList ? 'h-full min-h-32' : 'aspect-[4/3]'} relative w-full bg-slate-100 group overflow-hidden`}>
        <div className={`absolute left-2 top-2 z-10 rounded-full bg-white/90 px-2 py-1 text-[9px] font-black uppercase tracking-widest ${visual.text} ring-1 ${visual.ring}`}>
          {visual.label}
        </div>
        <img
          src={imageUrl}
          alt={medicine.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
          onError={e => { e.currentTarget.src = getMedicineImage({ category: 'default' }); }}
        />
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/25 to-transparent" />
        {medicine.discount && (
          <div className="absolute left-2 top-2 rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white shadow-lg">
            -{medicine.discount}%
          </div>
        )}
      </div>

      <div className="flex min-h-[9.25rem] flex-1 flex-col gap-2 p-3">
        <h3 className="min-h-[2.5rem] text-sm font-black leading-tight text-slate-950 line-clamp-2">
          {medicine.name}
        </h3>
        <div className="flex items-center gap-2 min-w-0">
          <p className="truncate text-xs font-medium text-slate-500">{medicine.brand || 'MediPharm'}</p>
          {medicine.requiresPrescription && (
            <span className="shrink-0 rounded-full bg-purple-50 px-2 py-0.5 text-[9px] font-black uppercase text-purple-700">Rx</span>
          )}
        </div>

        <div className="mt-auto flex items-center justify-between gap-2 pt-2">
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="text-lg font-black leading-none text-teal-600">Rs.{medicine.price}</span>
            {medicine.mrp > medicine.price && (
              <span className="mt-1 text-[10px] text-slate-400 line-through">Rs.{medicine.mrp}</span>
            )}
          </div>
          <button
            type="button"
            onClick={() => onAdd?.(medicine)}
            className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-slate-900 shadow-lg shadow-teal-500/20 transition-all active:scale-95 ${
              isAdded ? 'bg-teal-300' : 'bg-teal-500 hover:bg-teal-400'
            }`}
            aria-label={`Add ${medicine.name} to cart`}
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
