import { useParams, Link } from 'react-router-dom';
import { Star, MapPin, ChevronLeft, MessageSquare, Filter, ShieldCheck, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { pharmacies } from '../../utils/data.js';
import PageShell from '../../components/layout/PageShell';

export default function PharmacyReviewsPage() {
  const { id } = useParams();
  const pharmacy = pharmacies.find(p => p.id === id);

  if (!pharmacy) return null;

  return (
    <PageShell 
      title="Audit Streams" 
      subtitle={`Comprehensive clinical review logs for ${pharmacy.name}.`}
      icon={MessageSquare}
    >
      <div className="p-6 md:p-12 lg:p-20 space-y-10 md:space-y-16">
         <div className="bg-navy rounded-2xl md:rounded-[5rem] p-8 md:p-20 text-white grid md:grid-cols-[1fr_2fr] gap-10 md:gap-20 items-center border-l-[10px] md:border-l-[20px] border-teal-500 shadow-2xl">
            <div className="text-center space-y-2 md:space-y-4">
               <div className="font-syne font-black text-6xl md:text-9xl text-teal-400 leading-none italic">{pharmacy.rating}</div>
               <div className="text-[10px] md:text-xs font-black uppercase italic tracking-widest text-white/40">{pharmacy.reviewsCount} AUDITED SESSIONS</div>
            </div>
            <div className="space-y-3 md:space-y-4">
               {[5, 4, 3, 2, 1].map(s => (
                 <div key={s} className="flex items-center gap-4 md:gap-6">
                    <span className="text-[10px] md:text-xs font-black font-syne italic w-4">{s}</span>
                    <div className="flex-1 h-1.5 md:h-2 bg-white/5 rounded-full overflow-hidden">
                       <div className="h-full bg-teal-400 shadow-[0_0_15px_rgba(45,212,191,0.5)]" style={{ width: s === 5 ? '60%' : s === 4 ? '28%' : '8%' }} />
                    </div>
                    <span className="text-[9px] md:text-[10px] font-black font-syne text-white/40 italic w-8 md:w-10 text-right">{s === 5 ? '60%' : s === 4 ? '28%' : '8%'}</span>
                 </div>
               ))}
            </div>
         </div>

         <div className="grid gap-6 md:gap-8">
            {[1,2,3,4,5,6,7,8,9,10].map((_, i) => (
               <motion.div 
                 key={i}
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 className="bg-white p-6 md:p-12 rounded-2xl md:rounded-[4rem] border border-black/[0.03] space-y-4 md:space-y-6 hover:shadow-xl transition-all duration-500 border-l-[6px] md:border-l-[12px] border-gray-50 hover:border-teal-500"
               >
                  <div className="flex justify-between items-start">
                     <div className="flex items-center gap-4 md:gap-6">
                        <div className="h-12 w-12 md:h-16 md:w-16 bg-gray-100 rounded-xl md:rounded-[1.5rem] flex items-center justify-center text-gray-400 font-syne font-black text-lg md:text-xl italic">U</div>
                        <div className="space-y-0.5">
                           <div className="font-syne font-black text-navy text-lg md:text-xl uppercase italic tracking-tighter">Verified Resident</div>
                           <div className="text-[9px] md:text-[10px] font-black text-gray-300 uppercase tracking-widest italic leading-none">Karaikal District Node</div>
                        </div>
                     </div>
                     <div className="flex text-amber-500 gap-0.5 scale-75 md:scale-100 origin-right">
                        {[1,2,3,4,5].map(s => <Star key={s} size={14} fill="currentColor"/>)}
                     </div>
                  </div>
                  <p className="text-gray-400 font-dm italic text-lg md:text-xl font-bold leading-relaxed">"Exceptional clinical synchronization and fulfillment protocols. Highly recommended for district residents."</p>
               </motion.div>
            ))}
         </div>
      </div>
    </PageShell>
  );
}
