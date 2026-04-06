import { ShoppingCart, Trash2, Activity, ShieldCheck, Zap, Info, ArrowLeft, ArrowRight } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import CartItem from '../../components/cart/CartItem.jsx';
import CartSummary from '../../components/cart/CartSummary.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import { useCart } from '../../hooks/useCart.js';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { motion, AnimatePresence } from 'framer-motion';
import PrescriptionPrompt from '../../components/cart/PrescriptionPrompt.jsx';
import { useMemo } from 'react';

export default function Cart() {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const {
    items,
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
    note,
    prescription,
    changeQty,
    removeItem,
    clearCart,
    applyCoupon,
    clearCoupon,
    setTip,
    setNote,
    setPrescription,
    clearPrescription
  } = useCart();

  const needsPrescription = useMemo(() => items.some(i => i.requiresRx), [items]);

  if (items.length === 0) {
    return (
      <div className="bg-[#f8fafc] min-h-screen py-32 px-10">
         <div className="max-w-4xl mx-auto">
            <EmptyState
              icon={ShoppingCart}
              title={t('cartEmptyTitle')}
              description={t('cartEmptyDesc')}
              actionLabel={t('browseInventory')}
              actionHref="/medicines"
            />
         </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-48 pt-24">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
         <div className="flex flex-col lg:flex-row items-end justify-between gap-12 mb-20">
            <div className="space-y-6">
               <div className="px-6 py-2.5 bg-[#0a1628] rounded-2xl w-fit flex items-center gap-3 text-[10px] font-black text-brand-teal uppercase tracking-[0.4em] italic">
                  <Activity size={16} className="animate-pulse" /> {t('acquisitionManifest')} v4.2
               </div>
               <h1 className="font-syne font-black text-7xl lg:text-9xl text-[#0a1628] leading-[0.85] tracking-tighter uppercase italic">
                  {t('my')} <span className="text-brand-teal">{t('inventory')}</span>
               </h1>
            </div>
            <button
               type="button"
               onClick={clearCart}
               className="h-16 px-10 bg-white border-2 border-red-500/20 text-red-500 rounded-2xl font-syne font-black text-[10px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all duration-500 flex items-center gap-4 italic group shadow-soft"
            >
               <Trash2 size={18} className="group-hover:rotate-12 transition-transform" /> {t('clearManifestRegistry')}
            </button>
         </div>

         <div className="grid lg:grid-cols-[1.3fr_1fr] gap-16 items-start">
            <div className="space-y-12">
               {needsPrescription && (
                  <PrescriptionPrompt 
                     isUploaded={!!prescription} 
                     uploadedFile={prescription}
                     onUpload={(file) => {
                        if (file) setPrescription({ name: file.name, size: file.size });
                        else clearPrescription();
                     }} 
                  />
               )}
               {/* Item Registry Container */}
               <div className="bg-white border border-gray-100 rounded-[5rem] p-12 shadow-4xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 h-64 w-64 bg-brand-teal opacity-[0.02] rounded-full blur-[100px]" />
                  <div className="space-y-10 relative z-10">
                     <div className="flex items-center justify-between border-b border-gray-100 pb-10 px-4">
                        <div className="flex items-center gap-6">
                           <div className="h-2 w-16 bg-brand-teal rounded-full" />
                           <h2 className="font-syne font-black text-2xl text-[#0a1628] uppercase tracking-tighter italic">{t('therapeuticNodes')}</h2>
                        </div>
                        <div className="text-[10px] font-black text-gray-300 uppercase tracking-widest italic">{items.length} {t('activeSyncs')}</div>
                     </div>
                     
                     <div className="space-y-6">
                        <AnimatePresence>
                           {items.map((item, idx) => (
                              <motion.div
                                 key={item.id}
                                 initial={{ opacity: 0, x: -20 }}
                                 animate={{ opacity: 1, x: 0 }}
                                 exit={{ opacity: 0, x: 20 }}
                                 transition={{ delay: idx * 0.1 }}
                              >
                                 <CartItem
                                    item={item}
                                    onIncrease={() => changeQty(item.id, 1)}
                                    onDecrease={() => changeQty(item.id, -1)}
                                    onRemove={() => removeItem(item.id)}
                                 />
                              </motion.div>
                           ))}
                        </AnimatePresence>
                     </div>
                  </div>
               </div>

               {/* Logistics Synchronization Notes */}
               <div className="bg-[#0a1628] rounded-[4rem] p-12 text-white relative overflow-hidden border-l-[16px] border-brand-teal shadow-4xl shadow-[#0a1628]/20">
                  <div className="absolute top-0 right-0 h-64 w-64 bg-brand-teal opacity-[0.03] rounded-full blur-[100px]" />
                  <div className="space-y-8 relative z-10">
                     <div className="flex items-center gap-6">
                        <div className="h-16 w-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-brand-teal shadow-2xl transition-all duration-500 rotate-3"><Info size={28} /></div>
                        <div className="space-y-1">
                           <h3 className="font-syne font-black text-2xl uppercase tracking-tighter italic leading-none">{t('deliveryProtocolNotes')}</h3>
                           <div className="text-[10px] font-black text-brand-teal uppercase tracking-[0.2em] italic">{t('districtLogisticsSync')}</div>
                        </div>
                     </div>
                     <p className="text-white/40 font-dm italic font-bold leading-relaxed">{t('deliveryNotesInstructions')}</p>
                     <textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="Ex: Entrance door code: 128-Sync, verified recipient node..."
                        rows={5}
                        className="w-full bg-white/5 border border-white/10 rounded-[2.5rem] px-10 py-8 text-white font-syne font-black text-xs uppercase tracking-widest focus:border-brand-teal focus:bg-white/10 outline-none transition-all duration-500 placeholder:text-white/10 italic resize-none"
                     />
                  </div>
               </div>

               {/* Verification Shield */}
               <div className="bg-white border border-gray-100 rounded-[4rem] p-12 shadow-soft flex items-center justify-between group hover:border-brand-teal/20 transition-all duration-700">
                  <div className="flex items-center gap-8">
                     <div className="h-20 w-20 bg-gray-50 border border-gray-100 rounded-[2rem] flex items-center justify-center text-brand-teal shadow-inner group-hover:bg-[#0a1628] transition-all duration-500"><ShieldCheck size={36} /></div>
                     <div className="space-y-2">
                        <h4 className="font-syne font-black text-2xl text-[#0a1628] uppercase tracking-tighter italic leading-none">{t('architecturalIntegrity')}</h4>
                        <p className="text-gray-300 font-dm italic font-bold text-lg">{t('integrityVerificationDesc')}</p>
                     </div>
                  </div>
                  <Link to="/medicines" className="h-16 w-16 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center text-gray-300 hover:bg-brand-teal hover:text-white transition-all duration-500 shadow-soft">
                     <ArrowRight size={24} />
                  </Link>
               </div>
            </div>

            <div className="lg:sticky lg:top-32">
               <CartSummary
                  subtotal={subtotal}
                  deliveryFee={deliveryFee}
                  packagingFee={packagingFee}
                  tax={tax}
                  discount={discount}
                  tip={tip}
                  totalAmount={totalAmount}
                  coupon={coupon}
                  couponError={couponError}
                  couponStatus={couponStatus}
                  onApplyCoupon={applyCoupon}
                  onClearCoupon={clearCoupon}
                  onTipChange={setTip}
                  onCheckout={() => {
                     if (needsPrescription && !prescription) {
                        const pharmacyId = items[0]?.pharmacyId || 'ph-1';
                        navigate(`/order/${pharmacyId}/prescription`);
                     } else {
                        navigate('/checkout');
                     }
                  }}
                  isCheckoutDisabled={items.length === 0}
               />
               
               <div className="mt-12 px-8 flex items-center justify-between text-[11px] font-black uppercase italic tracking-[0.2em] text-gray-200">
                  <div className="flex items-center gap-3">
                     <Zap size={16} className="text-amber-500" /> Secure Sync Protocol
                  </div>
                  <div className="flex items-center gap-3">
                     <ShieldCheck size={16} className="text-emerald-500" /> Karaikal Mesh Verified
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}

