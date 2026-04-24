import { Sparkles, Tag, ShieldCheck, Zap, Activity, Info, CreditCard } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';

const TIP_PRESETS = [0, 20, 50, 100];

export default function CartSummary({
  subtotal,
  deliveryFee,
  packagingFee,
  tax,
  discount,
  tip,
  totalAmount,
  coupon,
  couponError,
  couponStatus,
  onApplyCoupon,
  onClearCoupon,
  onTipChange,
  onCheckout,
  isCheckoutDisabled
}) {
  const { t } = useLanguage();
  const [code, setCode] = useState(coupon?.code || '');

  useEffect(() => {
    setCode(coupon?.code || '');
  }, [coupon]);

  return (
    <div className="bg-white border border-gray-100 rounded-2xl md:rounded-[4rem] p-6 md:p-12 shadow-xl sticky top-32 overflow-hidden group">
      <div className="absolute top-0 right-0 h-48 w-48 bg-teal-500 opacity-[0.02] rounded-full blur-[100px]" />
      
      <div className="flex items-center gap-4 md:gap-6 relative z-10 border-b border-gray-50 pb-6 md:pb-10 mb-6 md:mb-10">
         <div className="h-12 w-12 md:h-16 md:w-16 bg-navy rounded-xl md:rounded-2xl flex items-center justify-center text-teal-400 shadow-xl rotate-3 shrink-0"><Activity size={24} /></div>
         <div className="space-y-0.5">
            <h2 className="font-syne font-black text-xl md:text-3xl text-navy uppercase tracking-tighter italic leading-none">{t('yieldSummary')}</h2>
            <div className="text-[9px] md:text-[10px] font-black text-teal-600 uppercase tracking-widest italic">{t('manifestVerification')}</div>
         </div>
      </div>

      <div className="space-y-6 relative z-10">
         <div className="flex items-center justify-between group/row">
          <span className="text-[10px] md:text-[11px] font-black text-gray-300 uppercase tracking-widest italic group-hover/row:text-navy transition-colors">{t('subtotalNode')}</span>
          <span className="font-syne font-black text-lg md:text-2xl text-navy italic">₹{subtotal}</span>
        </div>
        <div className="flex items-center justify-between group/row">
          <span className="text-[10px] md:text-[11px] font-black text-gray-300 uppercase tracking-widest italic group-hover/row:text-navy transition-colors">{t('deliveryProtocolFee')}</span>
          <span className="font-syne font-black text-lg md:text-2xl text-navy italic">₹{deliveryFee}</span>
        </div>
        <div className="flex items-center justify-between group/row">
          <span className="text-[10px] md:text-[11px] font-black text-gray-300 uppercase tracking-widest italic group-hover/row:text-navy transition-colors">{t('packagingSync')}</span>
          <span className="font-syne font-black text-lg md:text-2xl text-navy italic">₹{packagingFee}</span>
        </div>
        <div className="flex items-center justify-between group/row border-b border-gray-50 pb-4 md:pb-6 mb-4 md:mb-6">
          <span className="text-[10px] md:text-[11px] font-black text-gray-300 uppercase tracking-widest italic group-hover/row:text-navy transition-colors">{t('taxesProtocol')}</span>
          <span className="font-syne font-black text-lg md:text-2xl text-navy italic">₹{tax}</span>
        </div>
        
        <AnimatePresence>
          {discount > 0 && (
            <motion.div 
               initial={{ opacity: 0, height: 0 }}
               animate={{ opacity: 1, height: 'auto' }}
               exit={{ opacity: 0, height: 0 }}
               className="flex items-center justify-between text-emerald-500 bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100"
            >
              <span className="text-[11px] font-black uppercase tracking-widest italic">{t('authorizedDiscount')}</span>
              <span className="font-syne font-black text-2xl italic">- ₹{discount}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {tip > 0 && (
            <motion.div 
               initial={{ opacity: 0, height: 0 }}
               animate={{ opacity: 1, height: 'auto' }}
               exit={{ opacity: 0, height: 0 }}
               className="flex items-center justify-between text-brand-teal p-4 rounded-2xl bg-brand-teal/5 border border-brand-teal/10"
            >
              <span className="text-[11px] font-black uppercase tracking-widest italic">{t('deliveryNodeTip')}</span>
              <span className="font-syne font-black text-2xl italic">₹{tip}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-8 md:mt-12 p-6 md:p-10 bg-navy rounded-2xl md:rounded-[3.5rem] text-white flex items-center justify-between shadow-xl border-t-4 md:border-t-[8px] border-teal-500 relative overflow-hidden group/total">
        <div className="absolute top-0 right-0 h-40 w-40 bg-teal-500 opacity-5 rounded-full blur-[60px]" />
        <div className="relative z-10 space-y-1 md:space-y-2">
           <div className="text-[8px] md:text-[10px] text-white/30 font-black uppercase tracking-widest italic">{t('totalSyncAmount')}</div>
           <div className="text-3xl md:text-5xl font-syne font-black text-white tracking-tighter italic origin-left group-hover/total:scale-110 transition-transform duration-700">₹{totalAmount}</div>
        </div>
        <div className="h-12 w-12 md:h-20 md:w-20 bg-white/5 border border-white/10 rounded-xl md:rounded-3xl flex items-center justify-center text-teal-400 shadow-2xl transition-all duration-700 group-hover/total:rotate-12 group-hover/total:bg-white group-hover/total:text-navy"><Zap size={24} /></div>
      </div>

      {/* Coupon Authorization */}
      <div className="mt-8 md:mt-12 space-y-4">
        <div className="flex items-center gap-4 px-4">
           <div className="h-1 w-6 bg-teal-500 rounded-full" />
           <div className="text-[9px] md:text-[10px] text-gray-300 font-black uppercase tracking-widest italic">{t('couponAuthorization')}</div>
        </div>
        <div className="flex items-center gap-3 bg-gray-50 border border-gray-100 p-1.5 rounded-xl md:rounded-[2rem] shadow-inner transition-all duration-500 focus-within:bg-white focus-within:shadow-xl group/coupon">
          <div className="h-10 w-10 md:h-14 md:w-14 bg-white border border-gray-100 rounded-lg md:rounded-2xl flex items-center justify-center text-gray-200 group-focus-within/coupon:bg-navy group-focus-within/coupon:text-teal-400 transition-all duration-500 shrink-0"><Tag size={18} /></div>
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder={t('enterAuthCode')}
            className="flex-1 bg-transparent border-none outline-none text-navy font-syne font-black text-sm md:text-lg uppercase tracking-widest placeholder:text-gray-200 italic pr-2 min-w-0"
          />
          {coupon ? (
            <button
              type="button"
              onClick={onClearCoupon}
              className="h-10 md:h-14 px-4 md:px-8 rounded-lg md:rounded-2xl bg-red-500 text-white font-syne font-black text-[9px] md:text-[10px] uppercase tracking-widest shadow-xl hover:scale-105 transition-all italic shrink-0"
            >
              {t('revoke')}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onApplyCoupon(code)}
              className="h-10 md:h-14 px-4 md:px-8 rounded-lg md:rounded-2xl bg-teal-500 text-white font-syne font-black text-[9px] md:text-[10px] uppercase tracking-widest shadow-xl hover:scale-105 transition-all italic shrink-0"
              disabled={couponStatus === 'loading'}
            >
              {couponStatus === 'loading' ? t('syncing') : t('authorize')}
            </button>
          )}
        </div>
        <AnimatePresence>
          {couponError && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-6 text-[10px] text-red-500 font-black uppercase italic tracking-widest">{couponError}</motion.div>}
          {coupon && !couponError && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-6 text-[10px] text-emerald-500 font-black uppercase italic tracking-widest">{t('authCodeValidated')}: {coupon.code}</motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Tip Synchronizer */}
      <div className="mt-12 space-y-4 border-t border-gray-100 pt-12">
        <div className="flex items-center gap-4 px-4">
           <div className="h-1.5 w-6 bg-amber-500 rounded-full" />
           <div className="text-[10px] text-gray-300 font-black uppercase tracking-widest italic">{t('logisticsTipSync')}</div>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {TIP_PRESETS.map((amount) => (
            <button
              key={amount}
              type="button"
              onClick={() => onTipChange(amount)}
              className={`h-16 rounded-2xl border-2 font-syne font-black text-xs transition-all duration-500 italic ${
                tip === amount ? 'border-brand-teal bg-[#0a1628] text-brand-teal shadow-4xl' : 'border-gray-50 text-gray-200 hover:border-brand-teal hover:text-brand-teal'
              }`}
            >
              {amount === 0 ? t('noSyncTip') : `₹${amount}`}
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={onCheckout}
        className="mt-10 md:mt-16 w-full h-16 md:h-24 bg-teal-500 text-white rounded-xl md:rounded-[2.5rem] font-syne font-black text-sm md:text-xl uppercase tracking-[0.2em] md:tracking-[0.3em] shadow-xl hover:bg-navy hover:scale-105 active:scale-95 transition-all duration-500 flex items-center justify-center gap-4 md:gap-6 italic group/checkout"
        disabled={isCheckoutDisabled}
      >
        <CreditCard size={20} className="md:size-7" /> {t('initializeCheckout')}
        <div className="h-10 w-10 md:h-12 md:w-12 bg-white/20 rounded-lg md:rounded-xl flex items-center justify-center group-hover/checkout:bg-teal-500 group-hover/checkout:text-white transition-all"><ArrowRight size={18} className="md:size-6" /></div>
      </button>
    </div>
  );
}

