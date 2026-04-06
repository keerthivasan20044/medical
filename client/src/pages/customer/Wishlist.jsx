import { Heart, Pill, ShoppingBag, Trash, Star, ArrowRight } from 'lucide-react';
import PageShell from '../../components/layout/PageShell';

export default function Wishlist() {
  return (
    <PageShell 
      title="Medical Watchlist" 
      subtitle="Critical survival clusters and SKU inventory synchronized for future procurement."
      icon={Heart}
    >
      <div className="p-20 grid md:grid-cols-2 lg:grid-cols-3 gap-12">
         {[1, 2, 3].map(i => (
            <div key={i} className="group bg-white rounded-[4rem] border-2 border-black/[0.03] shadow-3xl hover:shadow-4xl hover:border-brand-teal/20 transition-all duration-700 overflow-hidden flex flex-col h-full relative">
               <div className="h-64 relative overflow-hidden shrink-0 shadow-inner">
                  <img src="/assets/crt_product.png" className="h-full w-full object-cover group-hover:scale-125 transition duration-1000 grayscale group-hover:grayscale-0" alt="Medicine" />
                  <div className="absolute top-6 right-6 h-12 w-12 bg-white/20 backdrop-blur-3xl rounded-xl border border-white/20 flex items-center justify-center text-white cursor-pointer hover:bg-brand-teal hover:text-[#0a1628] transition-all duration-500 active:scale-90"><Trash size={22} /></div>
               </div>

               <div className="p-10 space-y-8 flex-1 flex flex-col justify-between">
                  <div className="space-y-4">
                     <div className="flex items-start justify-between">
                        <h3 className="font-syne font-black text-[#0a1628] text-2xl uppercase italic tracking-tighter leading-tight group-hover:text-brand-teal transition-colors">Dolo 650mg</h3>
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-400 rounded-xl text-[#0a1628] font-black text-xs shadow-xl rotate-3"><Star size={14} fill="currentColor" /> 4.8</div>
                     </div>
                     <p className="text-gray-400 font-dm italic font-bold">Relieves fever and body pain. Crucial for district family health enclaves.</p>
                  </div>

                  <div className="flex items-center justify-between pt-8 border-t border-black/[0.05]">
                     <span className="text-3xl font-syne font-black italic text-[#0a1628]">₹32</span>
                     <button className="h-16 px-8 bg-[#0a1628] text-brand-teal rounded-2xl flex items-center justify-center transition-all duration-500 hover:scale-110 active:scale-95 shadow-4xl gap-4 italic font-black font-syne uppercase text-xs">
                        <ShoppingBag size={20} /> Deploy to Cart
                     </button>
                  </div>
               </div>
            </div>
         ))}
      </div>
    </PageShell>
  );
}
