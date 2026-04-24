import { Minus, Plus, Trash2, Activity, ShieldCheck, Zap } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function CartItem({ item, onIncrease, onDecrease, onRemove }) {
  const { t } = useLanguage();
  
  return (
    <div className="group bg-white hover:bg-gray-50/50 border border-gray-100 rounded-2xl md:rounded-[2.5rem] p-3 md:p-8 transition-all duration-300 hover:shadow-xl relative overflow-hidden flex flex-col xl:flex-row xl:items-center justify-between gap-4 md:gap-10">
      <div className="absolute top-0 right-0 h-32 w-32 bg-teal-500 opacity-[0.01] rounded-full blur-[60px]" />
      
      <div className="flex items-center gap-4 md:gap-8 relative z-10">
         <div className="h-14 w-14 md:h-24 md:w-24 bg-gray-50 rounded-xl md:rounded-[1.8rem] flex items-center justify-center p-2 md:p-4 border border-gray-100 shrink-0 group-hover:rotate-2 transition-transform duration-500">
            <img src={item.image} alt={item.name} className="h-full w-full object-contain mix-blend-multiply opacity-80 group-hover:opacity-100 transition-opacity" />
         </div>
         <div className="space-y-1 min-w-0 flex-1">
            <div className="flex items-center gap-2">
               <div className="h-1 w-6 bg-teal-500 rounded-full" />
               <span className="text-[8px] md:text-[10px] text-teal-600 font-black uppercase tracking-widest italic truncate">{item.category}</span>
            </div>
            <h3 className="font-syne font-black text-base md:text-2xl text-navy uppercase italic tracking-tighter leading-tight truncate">{item.name}</h3>
            <div className="flex items-center gap-3">
               <div className="text-[9px] md:text-[11px] font-dm font-black text-gray-300 italic whitespace-nowrap">₹{item.price}</div>
               <div className="h-1 w-1 bg-gray-200 rounded-full" />
               <div className="flex items-center gap-1 text-[8px] md:text-[10px] font-black text-teal-600 uppercase tracking-widest italic">
                  <Activity size={10} className="animate-pulse" /> {t('synced')}
               </div>
            </div>
         </div>
         <button
           type="button"
           onClick={onRemove}
           className="h-10 w-10 md:h-16 md:w-16 rounded-xl md:rounded-2xl bg-white border border-red-500/10 text-red-500/30 flex items-center justify-center hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-500 shadow-soft md:hidden shrink-0"
           aria-label={t('removeNode')}
         >
           <Trash2 size={16} />
         </button>
      </div>

      <div className="flex items-center justify-between xl:justify-end gap-6 md:gap-8 xl:gap-12 relative z-10 xl:ml-auto border-t border-gray-50 pt-4 xl:border-none xl:pt-0">
         <div className="flex items-center gap-4 bg-white border border-gray-100 rounded-xl md:rounded-2xl p-1.5 md:p-2 px-3 md:px-6 shadow-sm group-hover:shadow-lg transition-all duration-500">
          <button
            type="button"
            onClick={onDecrease}
            className="h-8 w-8 md:h-10 md:w-10 rounded-lg md:rounded-xl bg-gray-50 text-gray-400 flex items-center justify-center hover:bg-navy hover:text-white transition-all duration-300"
          >
            <Minus size={12} />
          </button>
          <span className="font-syne font-black text-base md:text-2xl text-navy w-6 md:w-8 text-center italic">{item.qty}</span>
          <button
            type="button"
            onClick={onIncrease}
            className="h-8 w-8 md:h-10 md:w-10 rounded-lg md:rounded-xl bg-gray-50 text-gray-400 flex items-center justify-center hover:bg-teal-500 hover:text-white transition-all duration-300"
          >
            <Plus size={12} />
          </button>
        </div>

        <div className="space-y-0.5 text-right min-w-[70px] md:min-w-[120px]">
           <div className="text-[8px] md:text-[10px] text-gray-200 font-black uppercase tracking-widest italic">{t('syncYield')}</div>
           <div className="text-lg md:text-3xl font-syne font-black text-navy tracking-tighter italic origin-right group-hover:scale-105 transition-transform">₹{item.price * item.qty}</div>
        </div>

        <button
          type="button"
          onClick={onRemove}
          className="hidden md:flex h-16 w-16 rounded-2xl bg-white border-2 border-red-500/10 text-red-500/30 items-center justify-center hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-500 shadow-soft"
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

