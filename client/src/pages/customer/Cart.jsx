import { ShoppingCart, Trash2, Activity, ShieldCheck, Zap, Info, ArrowLeft, ArrowRight } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import CartItem from '../../components/cart/CartItem';
import CartSummary from '../../components/cart/CartSummary';
import EmptyState from '../../components/common/EmptyState';
import { useCart } from '../../hooks/useCart.js';
import { useLanguage } from '../../context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import PrescriptionPrompt from '../../components/cart/PrescriptionPrompt';
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
    incrementQty,
    decrementQty,
    removeFromCart,
    clearCart,
    applyCoupon,
    clearCoupon,
    setTip,
    setNote,
    setPrescription,
    clearPrescription
  } = useCart();

  const needsPrescription = useMemo(() => items.some(i => i.requiresRx), [items]);

  const handleCheckout = () => {
    if (needsPrescription && !prescription) {
       const pharmacyId = items[0]?.pharmacyId || 'ph-1';
       navigate(`/order/${pharmacyId}/prescription`);
    } else {
       navigate('/checkout');
    }
  };

  if (items.length === 0) {
    return (
      <div className="bg-[#f8fafc] min-h-screen py-32 px-6 px-10">
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
    <div className="bg-[#f8fafc] min-h-screen pb-64 md:pb-48 pt-20 md:pt-24">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
         <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8 mb-12 md:mb-20">
            <div className="space-y-4 md:space-y-6 w-full">
               <div className="px-5 py-2 bg-[#0a1628] rounded-xl w-fit flex items-center gap-3 text-[9px] md:text-[10px] font-black text-brand-teal uppercase tracking-[0.4em] italic leading-none">
                  <Activity size={14} className="animate-pulse" /> {t('shoppingCart')}
               </div>
               <h1 className="font-syne font-black text-5xl md:text-7xl lg:text-9xl text-[#0a1628] leading-[0.85] tracking-tighter uppercase italic">
                  {t('my')} <span className="text-brand-teal">{t('inventory')}</span>
               </h1>
            </div>
            <button
               type="button"
               onClick={clearCart}
               className="h-14 md:h-16 px-8 md:px-10 bg-white border border-red-500/10 text-red-500 rounded-2xl font-syne font-black text-[9px] md:text-[10px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all duration-500 flex items-center gap-3 md:gap-4 italic group shadow-soft w-full md:w-auto justify-center"
            >
               <Trash2 size={16} /> {t('clearManifestRegistry')}
            </button>
         </div>

         <div className="grid lg:grid-cols-[1.3fr_1fr] gap-10 md:gap-16 items-start">
            <div className="space-y-10 md:space-y-12">
               {needsPrescription && (
                  <PrescriptionPrompt 
                     isUploaded={!!prescription} 
                     uploadedFile={prescription}
                     onUpload={(data) => {
                        if (data) setPrescription(data);
                        else clearPrescription();
                     }} 
                  />
               )}
               {/* Item Registry Container */}
               <div className="bg-white border border-black/[0.03] rounded-[2.5rem] md:rounded-[5rem] p-6 md:p-12 shadow-4xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 h-64 w-64 bg-brand-teal opacity-[0.02] rounded-full blur-[100px]" />
                  <div className="space-y-8 md:space-y-10 relative z-10">
                     <div className="flex items-center justify-between border-b border-gray-50 pb-8 px-2 md:px-4">
                        <div className="flex items-center gap-4 md:gap-6">
                           <div className="h-1.5 w-10 md:w-16 bg-brand-teal rounded-full" />
                           <h2 className="font-syne font-black text-xl md:text-2xl text-[#0a1628] uppercase tracking-tighter italic">{t('selectedItems')}</h2>
                        </div>
                        <div className="text-[9px] md:text-[10px] font-black text-gray-300 uppercase tracking-widest italic">{items.length} {t('activeSyncs')}</div>
                     </div>
                     
                     <div className="space-y-4 md:space-y-6">
                        <AnimatePresence>
                           {items.map((item, idx) => (
                              <motion.div
                                 key={item.id}
                                 initial={{ opacity: 0, y: 10 }}
                                 animate={{ opacity: 1, y: 0 }}
                                 exit={{ opacity: 0, scale: 0.95 }}
                                 transition={{ delay: idx * 0.05 }}
                              >
                                 <CartItem
                                    item={item}
                                    onIncrease={() => incrementQty(item._id || item.id)}
                                    onDecrease={() => decrementQty(item._id || item.id)}
                                    onRemove={() => removeFromCart(item._id || item.id)}
                                 />
                              </motion.div>
                           ))}
                        </AnimatePresence>
                     </div>
                  </div>
               </div>

               {/* Logistics Synchronization Notes */}
               <div className="bg-[#0a1628] rounded-[2.5rem] md:rounded-[4rem] p-8 md:p-12 text-white relative overflow-hidden border-l-[12px] md:border-l-[16px] border-brand-teal shadow-4xl">
                  <div className="absolute top-0 right-0 h-40 w-40 bg-brand-teal opacity-[0.03] rounded-full blur-[100px]" />
                  <div className="space-y-6 md:space-y-8 relative z-10">
                     <div className="flex items-center gap-6">
                        <div className="h-12 w-12 md:h-16 md:w-16 bg-white/5 border border-white/10 rounded-xl md:rounded-2xl flex items-center justify-center text-brand-teal"><Info size={24} /></div>
                        <div className="space-y-0.5">
                           <h3 className="font-syne font-black text-xl md:text-2xl uppercase tracking-tighter italic leading-none">{t('deliveryNotes')}</h3>
                           <div className="text-[9px] font-black text-brand-teal uppercase tracking-[0.2em] italic">DISTRICT LOGISTICS</div>
                        </div>
                     </div>
                     <p className="text-white/40 font-dm italic font-bold text-sm md:text-base">{t('deliveryNotesInstructions')}</p>
                     <textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="Ex: Entrance door code: 128-Sync..."
                        rows={4}
                        className="w-full bg-white/5 border border-white/10 rounded-[1.5rem] md:rounded-[2.5rem] px-6 md:px-10 py-6 md:py-8 text-white font-syne font-black text-[10px] md:text-xs uppercase tracking-widest focus:border-brand-teal outline-none transition-all placeholder:text-white/10 italic resize-none"
                     />
                  </div>
               </div>

               {/* Verification Shield - Hidden on mobile, shown on desktop */}
               <div className="hidden md:flex bg-white border border-gray-100 rounded-[4rem] p-12 shadow-soft items-center justify-between group hover:border-brand-teal/20 transition-all duration-700">
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
               <div className="hidden lg:block">
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
                     onCheckout={handleCheckout}
                     isCheckoutDisabled={items.length === 0}
                  />
               </div>
               
               {/* Mobile Coupon & Summary Section */}
               <div className="lg:hidden space-y-10 mb-10">
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
                     onCheckout={handleCheckout}
                     isCheckoutDisabled={items.length === 0}
                  />
               </div>

               <div className="hidden md:flex mt-12 px-8 items-center justify-between text-[11px] font-black uppercase italic tracking-[0.2em] text-gray-200">
                  <div className="flex items-center gap-3">
                     <Zap size={16} className="text-amber-500" /> Secure Delivery Protocol
                  </div>
                  <div className="flex items-center gap-3">
                     <ShieldCheck size={16} className="text-emerald-500" /> KARAIKAL MESH
                  </div>
               </div>
            </div>
         </div>
      </div>

      {/* MOBILE STICKY CHECKOUT BAR - PREVENTS UI COLLISION */}
      <AnimatePresence>
         {items.length > 0 && (
            <motion.div 
              initial={{ y: 200 }}
              animate={{ y: 0 }}
              className="lg:hidden fixed bottom-[90px] inset-x-4 z-[100] bg-[#0a1628] h-20 rounded-2xl border border-white/10 shadow-4xl flex items-center justify-between px-6 gap-6"
            >
               <div className="flex flex-col">
                  <span className="text-[8px] font-black text-white/30 uppercase italic tracking-widest">TOTAL AMOUNT</span>
                  <div className="font-syne font-black text-brand-teal text-3xl italic leading-none">₹{totalAmount}</div>
               </div>
               <button 
                 onClick={handleCheckout}
                 className="flex-1 h-12 bg-brand-teal text-[#0a1628] font-syne font-black text-[10px] uppercase italic tracking-widest rounded-xl shadow-mint active:scale-95 transition-transform"
               >
                  PROCEED TO CHECKOUT
               </button>
            </motion.div>
         )}
      </AnimatePresence>
    </div>
  );
}
