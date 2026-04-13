import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { 
  CalendarCheck, FileText, Star, Users, 
  Video, Activity, Clock, ShieldCheck, 
  PlusCircle, RefreshCw, MessageSquare, Phone,
  Settings, User, ArrowRight
} from 'lucide-react';

const KPIS = [
  { label: "Today's Consultations", value: '12', icon: Video, color: 'text-brand-teal bg-brand-teal/10' },
  { label: 'Verified Patients', value: '482', icon: Users, color: 'text-emerald-600 bg-emerald-50' },
  { label: 'Professional Rating', value: '4.9', icon: Star, color: 'text-amber-500 bg-amber-50' },
  { label: 'Rx Nodes Issued', value: '23', icon: FileText, color: 'text-indigo-600 bg-indigo-50' }
];

export default function DoctorDashboard() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-48 pt-24 px-6 md:px-10">
      <div className="max-w-[1500px] mx-auto space-y-12 md:space-y-20">
        
        {/* Header Architecture */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 pb-12 border-b border-black/[0.03]">
           <div className="space-y-6">
              <div className="flex items-center gap-4">
                 <div className="h-16 w-16 rounded-[2.2rem] bg-[#0a1628] text-white flex items-center justify-center shadow-3xl">
                    <Activity size={32} />
                 </div>
                 <div className="space-y-1">
                    <h1 className="font-syne font-black text-3xl md:text-4xl text-[#0a1628] uppercase italic tracking-tighter leading-none">
                       Dr. S. Priya Raman — <span className="text-brand-teal">Karaikal General</span>
                    </h1>
                    <div className="flex flex-wrap items-center gap-4 text-[10px] font-black uppercase tracking-widest text-gray-400 italic">
                       <span className="flex items-center gap-2 text-brand-teal"><ShieldCheck size={14} /> MBDS, MD Psychiatry</span>
                       <span className="flex items-center gap-2"><Clock size={14} /> Active Node: Today 4PM - 9PM</span>
                    </div>
                 </div>
              </div>
           </div>
           
           <div className="flex items-center gap-6 bg-white border border-black/[0.03] p-4 rounded-[2.5rem] shadow-soft">
              <div className="px-6 border-r border-black/[0.03] hidden sm:block">
                 <div className="text-[8px] text-gray-300 font-black uppercase tracking-[0.2em] italic">Consultation Status</div>
                 <div className="text-xs font-dm font-black text-[#0a1628] uppercase tracking-widest flex items-center gap-2 italic">
                    <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" /> Live & Available
                 </div>
              </div>
              <div className="flex items-center gap-3">
                 <Link to="/profile">
                    <button className="h-12 w-12 bg-gray-50 border border-black/[0.03] text-gray-400 rounded-xl flex items-center justify-center hover:bg-[#0a1628] hover:text-brand-teal transition shadow-inner" title="Profile Settings">
                       <Settings size={18} />
                    </button>
                 </Link>
                 <button className="h-12 px-8 bg-[#0a1628] text-brand-teal rounded-xl font-syne font-black text-[10px] uppercase tracking-widest flex items-center gap-3 hover:bg-brand-teal hover:text-[#0a1628] transition-all shadow-4xl italic">
                    <PlusCircle size={14} /> Create Rx Node
                 </button>
              </div>
           </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
           {KPIS.map((k, i) => (
             <motion.div 
               key={k.label}
               initial={{ opacity: 0, y: 10 }}
               whileInView={{ opacity: 1, y: 0 }}
               transition={{ delay: i * 0.05 }}
               className="bg-white p-8 md:p-10 rounded-[3.5rem] border border-black/[0.03] shadow-soft flex items-center justify-between hover:shadow-4xl hover:-translate-y-2 transition-all duration-500 group"
             >
                <div className="space-y-1">
                   <div className="text-[10px] text-gray-300 font-bold uppercase tracking-widest italic leading-none">{k.label}</div>
                   <div className="text-3xl md:text-4xl font-syne font-black text-[#0a1628] italic uppercase tracking-tighter">{k.value}</div>
                </div>
                <div className={`h-14 w-14 md:h-16 md:w-16 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:rotate-12 transition duration-500 shadow-sm ${k.color}`}>
                   <k.icon size={22} className="md:w-6 md:h-6" />
                </div>
             </motion.div>
           ))}
        </div>

        {/* Schedule & Consultation Row */}
        <div className="grid lg:grid-cols-[1fr_450px] gap-12 md:gap-20">
           <div className="space-y-10">
              <h2 className="font-syne font-black text-2xl md:text-3xl text-[#0a1628] flex items-center gap-6 uppercase italic tracking-tighter">
                 <div className="h-2 w-16 bg-brand-teal rounded-full" /> 
                 Consultation Architecture <span className="text-gray-100 italic">/</span> <span className="text-[14px] font-dm text-gray-300 font-black uppercase tracking-widest italic">Live Schedule</span>
              </h2>
              <div className="grid gap-6">
                 {[
                    { time: '09:00 AM', patient: 'Keerthivasan R.', type: 'Video Consult', status: 'Confirmed', alert: true },
                    { time: '10:30 AM', patient: 'Priya M.', type: 'In-Clinic Sync', status: 'Checked-in', alert: false },
                    { time: '11:15 AM', patient: 'Arjun S.', type: 'Emergency Node', status: 'Priority', alert: true }
                 ].map((t) => (
                    <div key={t.time} className="bg-white border border-black/[0.03] rounded-[3.5rem] md:rounded-[4.5rem] p-10 flex flex-col md:flex-row md:items-center justify-between gap-10 hover:shadow-4xl hover:border-brand-teal/20 transition group relative overflow-hidden">
                       {t.alert && (
                          <div className="absolute top-0 right-0 bg-brand-teal text-[#0a1628] text-[8px] font-black px-8 py-2 rounded-bl-3xl uppercase tracking-[0.3em] shadow-mint animate-pulse z-10 italic">Incoming Video Call</div>
                       )}
                       <div className="flex items-center gap-8">
                          <div className="h-20 w-20 rounded-[2.5rem] bg-gray-50 flex items-center justify-center font-syne font-black text-2xl text-brand-teal border border-black/[0.01] group-hover:bg-[#0a1628] group-hover:text-white transition duration-700 shadow-inner">{t.patient[0]}</div>
                          <div className="space-y-1">
                             <div className="text-[10px] font-black text-brand-teal uppercase tracking-widest italic">{t.time}</div>
                             <div className="text-2xl font-syne font-black text-[#0a1628] uppercase italic tracking-tighter">{t.patient}</div>
                             <div className="text-xs font-dm font-bold text-gray-300 italic uppercase">{t.type}</div>
                          </div>
                       </div>
                       <div className="flex flex-wrap gap-4">
                          <button className="h-16 px-8 bg-[#0a1628] text-white rounded-[1.8rem] font-syne font-black text-[11px] uppercase tracking-widest hover:bg-brand-teal hover:text-[#0a1628] transition-all shadow-4xl flex items-center gap-3 italic group">
                             {t.type.includes('Video') ? <Video size={16}/> : <Activity size={16}/>} START_PROTOCOL <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                          </button>
                          <div className="flex items-center gap-2">
                             <button className="h-16 w-16 bg-gray-50 text-gray-300 rounded-[1.8rem] flex items-center justify-center hover:bg-emerald-50 hover:text-emerald-600 transition shadow-inner"><Phone size={20}/></button>
                             <button className="h-16 w-16 bg-gray-50 text-gray-300 rounded-[1.8rem] flex items-center justify-center hover:bg-amber-50 hover:text-amber-600 transition shadow-inner"><MessageSquare size={20}/></button>
                          </div>
                       </div>
                    </div>
                 ))}
              </div>
           </div>

           {/* Quick Actions & Enclave Controls */}
           <div className="space-y-10">
              <div className="bg-[#0a1628] p-12 rounded-[4.5rem] text-white shadow-3xl relative overflow-hidden group border-t-[12px] border-brand-teal">
                 <div className="absolute top-0 right-0 h-48 w-48 bg-brand-teal rounded-full blur-[100px] opacity-[0.15]" />
                 <h2 className="font-syne font-black text-2xl mb-10 flex items-center justify-between relative z-10 uppercase italic tracking-tighter">
                    Quick Architecture <PlusCircle size={22} className="text-brand-teal" />
                 </h2>
                 <div className="space-y-4 relative z-10">
                     {[
                        { label: 'Issue Digital Rx Node', icon: FileText, color: 'hover:bg-brand-teal', to: '/doctor/prescriptions' },
                        { label: 'Manage Node Identity', icon: User, color: 'hover:bg-brand-teal', to: '/profile' },
                        { label: 'Sync Lab Handover', icon: Activity, color: 'hover:bg-emerald-600', to: '/doctor/dashboard' },
                        { label: 'Review Patient History', icon: Users, color: 'hover:bg-indigo-600', to: '/doctor/patients' },
                        { label: 'Architecture Settings', icon: ShieldCheck, color: 'hover:bg-gray-700', to: '/settings' }
                     ].map(link => (
                        <button 
                          key={link.label}
                          onClick={() => navigate(link.to)}
                          className={`w-full h-18 bg-white/5 border border-white/5 rounded-[1.8rem] flex items-center justify-between px-8 text-[11px] font-black uppercase tracking-widest transition duration-500 ${link.color} italic`}
                        >
                           {link.label}
                           <link.icon size={18} className="opacity-30" />
                        </button>
                     ))}
                 </div>
                 <div className="mt-12 pt-10 border-t border-white/5 flex items-center justify-between relative z-10">
                    <div className="space-y-1">
                       <div className="text-[8px] text-white/30 font-black uppercase tracking-widest italic">Encryption Status</div>
                       <div className="text-[10px] font-syne font-black text-brand-teal italic">AES-256 SECURED NODE</div>
                    </div>
                    <RefreshCw size={20} className="text-white/20 animate-spin-slow" />
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
