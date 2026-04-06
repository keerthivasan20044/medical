import { motion } from 'framer-motion';
import { 
  ShieldCheck, Truck, Zap, Phone, Package, Search, 
  Store, CreditCard, MapPin, User, ChevronRight, 
  Star, FileText, Headphones, ArrowRight, Play, CheckCircle, 
  X, AlertCircle, Share2, Upload, Activity, Clock, Globe, Heart,
  Database, Terminal, Cpu, MessageSquare, Plus, Edit, Trash, Download,
  Eye, Calendar, Pill, Wallet, Map, Settings, HelpCircle, Info
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext.jsx';

/**
 * High-Fidelity Page Shell for MediReach Command Center
 * Used to populate new routes quickly with consistent district aesthetic.
 */
export default function PageShell({ title, subtitle, icon: Icon, children, actions }) {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-24 pt-10">
      <header className="bg-[#0a1628] pt-32 pb-48 relative overflow-hidden">
        {/* HUD Grid Background */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(2,128,144,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(2,128,144,0.1) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        <div className="absolute top-0 right-0 h-[800px] w-[800px] bg-brand-teal opacity-5 rounded-full blur-[150px] translate-x-1/2 -translate-y-1/2" />
        
        <div className="max-w-7xl mx-auto px-10 relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-12">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-4 px-6 py-2 bg-brand-teal/10 border border-brand-teal/20 rounded-2xl text-[10px] font-black text-brand-teal uppercase tracking-[0.4em] italic backdrop-blur-3xl">
              {Icon && <Icon size={16} className="animate-pulse" />}
              {t('districtNode') || 'DISTRICT_NODE_ACTIVE'}
            </div>
            <h1 className="font-syne font-black text-6xl md:text-8xl text-white uppercase italic tracking-tighter leading-none">
              {title}
            </h1>
            <p className="text-white/40 font-dm text-xl md:text-2xl italic font-bold max-w-2xl leading-relaxed">
              {subtitle}
            </p>
          </motion.div>
          
          {actions && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-wrap gap-4"
            >
              {actions}
            </motion.div>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-10 -mt-24 relative z-20">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-[4rem] shadow-4xl border border-black/[0.03] overflow-hidden"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}

export function StatCard({ label, value, icon: Icon, color = "bg-brand-teal" }) {
  return (
    <div className="bg-white p-10 rounded-[3rem] border border-black/[0.02] shadow-soft hover:shadow-4xl transition-all duration-700 group flex items-center gap-8">
      <div className={`h-20 w-20 rounded-2xl ${color}/10 flex items-center justify-center text-brand-teal group-hover:scale-110 transition-transform duration-700`}>
        {Icon && <Icon size={32} />}
      </div>
      <div className="space-y-1">
        <div className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] italic">{label}</div>
        <div className="text-4xl font-syne font-black text-[#0a1628] italic tracking-tighter">{value}</div>
      </div>
    </div>
  );
}

export function EmptyState({ title, desc, icon: Icon }) {
  return (
    <div className="py-40 flex flex-col items-center justify-center text-center space-y-8 px-10">
      <div className="h-32 w-32 bg-gray-50 rounded-[2.5rem] flex items-center justify-center text-gray-200 border-2 border-dashed border-gray-100 italic">
        {Icon ? <Icon size={64} strokeWidth={1} /> : <Database size={64} strokeWidth={1} />}
      </div>
      <div className="space-y-3">
        <h3 className="font-syne font-black text-3xl text-[#0a1628] uppercase italic">{title}</h3>
        <p className="text-gray-400 font-dm italic font-bold max-w-md mx-auto">{desc}</p>
      </div>
    </div>
  );
}
