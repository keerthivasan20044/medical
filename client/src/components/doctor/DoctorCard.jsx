import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, ShieldCheck, Activity, Video, Calendar, ArrowRight } from 'lucide-react';

export default function DoctorCard({ item }) {
  const statusColors = {
    online: 'bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]',
    busy: 'bg-amber-500 text-white shadow-[0_0_15px_rgba(245,158,11,0.4)]',
    offline: 'bg-gray-400 text-white'
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      className="bg-white border border-black/[0.03] rounded-[3rem] p-8 shadow-soft hover:shadow-4xl transition-all duration-700 group relative overflow-hidden h-full flex flex-col"
    >
      <div className="absolute top-0 right-0 h-32 w-32 bg-brand-teal opacity-[0.02] rounded-full blur-[60px]" />
      
      {/* Bio Header */}
      <div className="flex items-start justify-between mb-8">
        <div className="relative">
           <div className="h-20 w-20 rounded-[2.2rem] bg-gray-50 flex items-center justify-center font-syne font-black text-2xl text-brand-teal border border-black/[0.01] group-hover:bg-[#0a1628] group-hover:text-white transition-all duration-700 shadow-inner">
             {item.name[4]}
           </div>
           <div className={`absolute -bottom-1 -right-1 h-6 w-6 rounded-lg border-[3px] border-white flex items-center justify-center ${statusColors[item.status || 'online']}`}>
              <Activity size={10} className="animate-pulse" />
           </div>
        </div>
        
        <div className="text-right space-y-1">
           <div className="flex items-center gap-1.5 text-amber-500 font-syne font-black text-xs">
              <Star size={14} fill="currentColor" /> {item.rating || '4.9'}
           </div>
           <div className="text-[9px] text-gray-300 font-black uppercase tracking-widest italic">{item.exp || '12+'}Y CLINICAL NODE</div>
        </div>
      </div>

      <div className="space-y-4 mb-10 flex-1">
        <div>
           <h3 className="font-syne font-black text-xl text-[#0a1628] uppercase italic tracking-tighter group-hover:text-brand-teal transition-colors">{item.name}</h3>
           <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] italic mt-1 flex items-center gap-2">
              <ShieldCheck size={12} className="text-brand-teal" /> {item.spec || item.specialization || 'General Physician'}
           </p>
        </div>

        <div className="space-y-3 pt-4 border-t border-black/[0.02]">
           <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-[#0a1628] italic">
              <span className="text-gray-300">Consultation Fee</span>
              <span className="text-lg font-syne text-brand-teal tracking-tighter">₹{item.fee || 200}</span>
           </div>
           <div className="flex items-center gap-2 text-[9px] font-bold text-emerald-500 uppercase tracking-widest italic bg-emerald-50/50 w-fit px-3 py-1.5 rounded-lg border border-emerald-100">
              <Video size={10} /> Live Virtual Node Available
           </div>
        </div>
      </div>

      <div className="flex gap-4">
         <Link to={`/doctors/${item.id || item._id}`} className="h-14 w-14 bg-gray-50 text-gray-400 border border-black/[0.03] rounded-2xl flex items-center justify-center hover:bg-[#0a1628] hover:text-brand-teal transition shadow-inner">
            <Activity size={20} />
         </Link>
         <button className="flex-1 h-14 bg-[#0a1628] text-brand-teal rounded-2xl font-syne font-black text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-brand-teal hover:text-[#0a1628] transition-all shadow-4xl group/btn italic">
            Procure Session <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
         </button>
      </div>
    </motion.div>
  );
}

