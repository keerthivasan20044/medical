import { useParams, Link } from 'react-router-dom';
import { Star, MapPin, ChevronLeft, MessageSquare, Filter, ShieldCheck, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { pharmacies } from '../../utils/data.js';
import PageShell from '../../components/layout/PageShell.jsx';

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
      <div className="p-20 space-y-16">
         <div className="flex bg-[#0a1628] rounded-[5rem] p-20 text-white grid md:grid-cols-[1fr_2fr] gap-20 items-center border-l-[20px] border-brand-teal shadow-4xl">
            <div className="text-center space-y-4">
               <div className="font-syne font-black text-9xl text-brand-teal leading-none italic">{pharmacy.rating}</div>
               <div className="text-xs font-black uppercase italic tracking-widest text-white/40">{pharmacy.reviewsCount} AUDITED SESSIONS</div>
            </div>
            <div className="space-y-4">
               {[5, 4, 3, 2, 1].map(s => (
                 <div key={s} className="flex items-center gap-6">
                    <span className="text-xs font-black font-syne italic w-4">{s}</span>
                    <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                       <div className="h-full bg-brand-teal shadow-mint" style={{ width: s === 5 ? '60%' : s === 4 ? '28%' : '8%' }} />
                    </div>
                    <span className="text-[10px] font-black font-syne text-white/40 italic w-10 text-right">{s === 5 ? '60%' : s === 4 ? '28%' : '8%'}</span>
                 </div>
               ))}
            </div>
         </div>

         <div className="grid gap-8">
            {[1,2,3,4,5,6,7,8,9,10].map((_, i) => (
               <motion.div 
                 key={i}
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 className="bg-white p-12 rounded-[4rem] border border-black/[0.03] space-y-6 hover:shadow-4xl transition-all duration-700 border-l-[12px] border-gray-50 hover:border-brand-teal"
               >
                  <div className="flex justify-between items-start">
                     <div className="flex items-center gap-6">
                        <div className="h-16 w-16 bg-gray-100 rounded-[1.5rem] flex items-center justify-center text-gray-400 font-syne font-black text-xl italic">U</div>
                        <div className="space-y-0.5">
                           <div className="font-syne font-black text-[#0a1628] text-xl uppercase italic tracking-tighter">Verified Resident Node</div>
                           <div className="text-[10px] font-black text-gray-300 uppercase tracking-widest italic">Karaikal District Node</div>
                        </div>
                     </div>
                     <div className="flex text-amber-500 gap-0.5"><Star size={14} fill="currentColor"/><Star size={14} fill="currentColor"/><Star size={14} fill="currentColor"/><Star size={14} fill="currentColor"/><Star size={14} fill="currentColor"/></div>
                  </div>
                  <p className="text-gray-400 font-dm italic text-xl font-bold leading-relaxed">"Exceptional clinical synchronization and fulfillment protocols. Highly recommended for district residents."</p>
               </motion.div>
            ))}
         </div>
      </div>
    </PageShell>
  );
}
