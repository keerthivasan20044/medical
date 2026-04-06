import { Minus, Plus, Trash2, Activity, ShieldCheck, Zap } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext.jsx';

export default function CartItem({ item, onIncrease, onDecrease, onRemove }) {
  const { t } = useLanguage();
  
  return (
    <div className="group bg-white hover:bg-gray-50/50 border border-gray-100 rounded-[2.5rem] p-8 transition-all duration-700 hover:shadow-2xl relative overflow-hidden flex flex-col xl:flex-row xl:items-center justify-between gap-10">
      <div className="absolute top-0 right-0 h-40 w-40 bg-brand-teal opacity-[0.01] rounded-full blur-[60px]" />
      
      <div className="flex items-center gap-8 relative z-10">
         <div className="h-24 w-24 bg-gray-50 rounded-[1.8rem] flex items-center justify-center p-4 border border-gray-50 shadow-inner group-hover:bg-white group-hover:rotate-3 transition-all duration-700">
            <img src={item.image} alt={item.name} className="h-full w-full object-contain mix-blend-multiply opacity-80 group-hover:opacity-100 transition-opacity" />
         </div>
         <div className="space-y-3">
            <div className="flex items-center gap-3">
               <div className="h-1.5 w-8 bg-brand-teal rounded-full" />
               <span className="text-[10px] text-brand-teal font-black uppercase tracking-widest italic">{item.category}</span>
            </div>
            <h3 className="font-syne font-black text-2xl text-[#0a1628] uppercase tracking-tighter italic leading-none">{item.name}</h3>
            <div className="flex items-center gap-4">
               <div className="text-[11px] font-dm font-black text-gray-300 italic">₹{item.price} {t('perUnit')}</div>
               <div className="h-1 w-1 bg-gray-200 rounded-full" />
               <div className="flex items-center gap-1.5 text-[10px] font-black text-brand-teal uppercase tracking-widest italic">
                  <Activity size={12} className="animate-pulse" /> {t('synced')}
               </div>
            </div>
         </div>
      </div>

      <div className="flex flex-wrap items-center gap-8 xl:gap-12 relative z-10 xl:ml-auto">
        <div className="flex items-center gap-6 bg-white border border-gray-100 rounded-2xl p-2 px-6 shadow-soft group-hover:shadow-4xl transition-all duration-700">
          <button
            type="button"
            onClick={onDecrease}
            className="h-10 w-10 rounded-xl bg-gray-50 text-gray-300 flex items-center justify-center hover:bg-[#0a1628] hover:text-white transition-all duration-500"
          >
            <Minus size={18} />
          </button>
          <span className="font-syne font-black text-2xl text-[#0a1628] w-8 text-center italic">{item.qty}</span>
          <button
            type="button"
            onClick={onIncrease}
            className="h-10 w-10 rounded-xl bg-gray-50 text-gray-300 flex items-center justify-center hover:bg-brand-teal hover:text-white transition-all duration-500"
          >
            <Plus size={18} />
          </button>
        </div>

        <div className="space-y-1 text-right min-w-[120px]">
           <div className="text-[10px] text-gray-200 font-black uppercase tracking-widest italic">{t('syncYield')}</div>
           <div className="text-3xl font-syne font-black text-[#0a1628] tracking-tighter italic origin-right group-hover:scale-110 transition-transform duration-700">₹{item.price * item.qty}</div>
        </div>

        <button
          type="button"
          onClick={onRemove}
          className="h-16 w-16 rounded-2xl bg-white border-2 border-red-500/10 text-red-500/30 flex items-center justify-center hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-500 shadow-soft"
          aria-label={t('removeNode')}
        >
          <Trash2 size={22} className="group-hover:rotate-12 transition-transform" />
        </button>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-1 bg-gray-50 group-hover:h-2 transition-all duration-700">
         <div className="h-full bg-brand-teal opacity-10 group-hover:opacity-30 transition-opacity" />
      </div>
    </div>
  );
}

