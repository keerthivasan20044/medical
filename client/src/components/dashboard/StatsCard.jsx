import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function StatsCard({ label, value, trend, icon: Icon, color, delay = 0 }) {
  const isPositive = trend?.startsWith('+');
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-navy/5 transition-all duration-500 group relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 h-32 w-32 bg-gray-50 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700" />
      
      <div className="flex items-start justify-between relative z-10">
        <div className="space-y-4">
          <div className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 ${color}`}>
            <Icon size={24} />
          </div>
          <div className="space-y-1">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</h3>
            <div className="text-3xl font-syne font-black text-navy italic tracking-tighter">{value}</div>
          </div>
        </div>

        {trend && (
          <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
            isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
          }`}>
            {isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            {trend}
          </div>
        )}
      </div>
      
      {/* Background Micro-animation */}
      <div className="absolute bottom-4 right-6 h-1 w-12 bg-gray-100 rounded-full overflow-hidden">
        <motion.div 
          animate={{ x: [-48, 48] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className={`h-full w-8 rounded-full ${color.split(' ')[0]} opacity-20`} 
        />
      </div>
    </motion.div>
  );
}
