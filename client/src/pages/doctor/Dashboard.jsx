import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CalendarCheck, FileText, Star, Users, 
  Video, Activity, Clock, ShieldCheck, 
  PlusCircle, RefreshCw, MessageSquare, Phone
} from 'lucide-react';

const KPIS = [
  { label: "Today's Consultations", value: '12', icon: Video, color: 'text-brand-teal bg-brand-teal/10' },
  { label: 'Verified Patients', value: '482', icon: Users, color: 'text-emerald-600 bg-emerald-50' },
  { label: 'Professional Rating', value: '4.9', icon: Star, color: 'text-amber-500 bg-amber-50' },
  { label: 'Rx Nodes Issued', value: '23', icon: FileText, color: 'text-indigo-600 bg-indigo-50' }
];

export default function DoctorDashboard() {
  const [loading, setLoading] = useState(false);

  return (
    <div className="bg-[#f0f2f5] min-h-screen pb-20 pt-24 px-6 md:px-8">
      <div className="max-w-[1500px] mx-auto space-y-12">
        {/* Header Architecture */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 pb-12 border-b border-gray-100">
           <div className="space-y-4">
              <div className="flex items-center gap-4">
                 <div className="h-16 w-16 rounded-[2.2rem] bg-[#0a1628] text-white flex items-center justify-center shadow-3xl">
                    <Activity size={32} />
                 </div>
                 <div className="space-y-1">
                    <h1 className="font-syne font-black text-4xl text-[#0a1628]">Dr. S. Priya Raman — <span className="text-brand-teal">Karaikal General</span></h1>
                    <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
                       <span className="flex items-center gap-2 text-brand-teal"><ShieldCheck size={14} /> MBDS, MD Psychiatry</span>
                       <span className="flex items-center gap-2"><Clock size={14} /> Active Node: Today 4PM - 9PM</span>
                    </div>
                 </div>
              </div>
           </div>
           
           <div className="flex bg-[#0a1628] p-3 rounded-2xl items-center gap-6 shadow-2xl">
              <div className="px-5 border-r border-white/10">
                 <div className="text-[8px] text-white/30 font-black uppercase tracking-[0.2em]">Consultation Status</div>
                 <div className="text-xs font-dm font-black text-white uppercase tracking-widest flex items-center gap-2">
                    <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" /> Live & Available
                 </div>
              </div>
              <button className="h-12 px-8 bg-brand-teal text-white rounded-xl font-syne font-black text-[10px] uppercase tracking-widest flex items-center gap-3 hover:bg-[#028090] transition shadow-lg shadow-brand-teal/20">
                 <PlusCircle size={14} /> Create Prescription Node
              </button>
           </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
           {KPIS.map((k, i) => (
             <motion.div 
               key={k.label}
               initial={{ opacity: 0, y: 10 }}
               whileInView={{ opacity: 1, y: 0 }}
               transition={{ delay: i * 0.05 }}
               className="bg-white p-8 rounded-[3.5rem] border border-gray-100 shadow-sm flex items-center justify-between hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group"
             >
                <div className="space-y-1">
                   <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{k.label}</div>
                   <div className="text-3xl font-syne font-black text-[#0a1628]">{k.value}</div>
                </div>
                <div className={`h-14 w-14 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:rotate-12 transition duration-500 shadow-sm ${k.color}`}>
                   <k.icon size={22} />
                </div>
             </motion.div>
           ))}
        </div>

        {/* Schedule & Consultation Row */}
        <div className="grid lg:grid-cols-[1fr_450px] gap-12">
           <div className="space-y-10">
              <h2 className="font-syne font-black text-3xl text-[#0a1628] flex items-center gap-4">
                 <CalendarCheck className="text-brand-teal" /> 
                 Consultation Architecture <span className="text-gray-200">/</span> <span className="text-[14px] font-dm text-gray-400 font-black uppercase tracking-widest">Live Schedule</span>
              </h2>
              <div className="grid gap-6">
                 {[
                    { time: '09:00 AM', patient: 'Keerthivasan R.', type: 'Video Consult', status: 'Confirmed', alert: true },
                    { time: '10:30 AM', patient: 'Priya M.', type: 'In-Clinic Sync', status: 'Checked-in', alert: false },
                    { time: '11:15 AM', patient: 'Arjun S.', type: 'Emergency Node', status: 'Priority', alert: true }
                 ].map((t) => (
                    <div key={t.time} className="bg-white border-2 border-gray-50 rounded-[3.5rem] p-10 flex flex-col md:flex-row md:items-center justify-between gap-10 hover:shadow-4xl hover:border-brand-teal/20 transition group relative overflow-hidden">
                       {t.alert && (
                          <div className="absolute top-0 right-0 bg-brand-teal text-white text-[8px] font-black px-6 py-1.5 rounded-bl-2xl uppercase tracking-[0.2em] shadow-lg animate-pulse">Incoming Video Call</div>
                       )}
                       <div className="flex items-center gap-8">
                          <div className="h-20 w-20 rounded-[2rem] bg-gray-50 flex items-center justify-center font-black text-2xl text-brand-teal border border-gray-100 group-hover:bg-brand-teal group-hover:text-white transition">{t.patient[0]}</div>
                          <div className="space-y-1">
                             <div className="text-[10px] font-black text-brand-teal uppercase tracking-widest">{t.time}</div>
                             <div className="text-2xl font-syne font-black text-[#0a1628]">{t.patient}</div>
                             <div className="text-xs font-dm font-bold text-gray-400">{t.type}</div>
                          </div>
                       </div>
                       <div className="flex flex-wrap gap-4">
                          <button className="h-16 px-8 bg-[#0a1628] text-white rounded-[1.8rem] font-syne font-black text-[11px] uppercase tracking-widest hover:bg-brand-teal transition shadow-xl flex items-center gap-3">
                             {t.type.includes('Video') ? <Video size={16}/> : <Activity size={16}/>} Start Protocol
                          </button>
                          <div className="flex items-center gap-2">
                             <button className="h-16 w-16 bg-gray-50 text-gray-400 rounded-[1.8rem] flex items-center justify-center hover:bg-emerald-50 hover:text-emerald-600 transition shadow-sm"><Phone size={20}/></button>
                             <button className="h-16 w-16 bg-gray-50 text-gray-400 rounded-[1.8rem] flex items-center justify-center hover:bg-amber-50 hover:text-amber-600 transition shadow-sm"><MessageSquare size={20}/></button>
                          </div>
                       </div>
                    </div>
                 ))}
              </div>
           </div>

           {/* Quick Actions & Enclave Controls */}
           <div className="space-y-10">
              <div className="bg-[#0a1628] p-12 rounded-[4.5rem] text-white shadow-3xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 h-48 w-48 bg-brand-teal rounded-full blur-[100px] opacity-[0.15]" />
                 <h2 className="font-syne font-black text-2xl mb-10 flex items-center justify-between relative z-10">
                    Quick Architecture <PlusCircle size={22} className="text-brand-teal" />
                 </h2>
                 <div className="space-y-4 relative z-10">
                    {[
                       { label: 'Issue Digital Rx Node', icon: FileText, color: 'hover:bg-brand-teal' },
                       { label: 'Sync Lab Handover', icon: Activity, color: 'hover:bg-emerald-600' },
                       { label: 'Review Patient History', icon: Users, color: 'hover:bg-indigo-600' },
                       { label: 'Architecture Settings', icon: ShieldCheck, color: 'hover:bg-gray-700' }
                    ].map(link => (
                       <button 
                         key={link.label}
                         className={`w-full h-18 bg-white/5 border border-white/5 rounded-[1.8rem] flex items-center justify-between px-8 text-[11px] font-black uppercase tracking-widest transition duration-500 ${link.color}`}
                       >
                          {link.label}
                          <link.icon size={18} className="opacity-30" />
                       </button>
                    ))}
                 </div>
                 <div className="mt-12 pt-10 border-t border-white/5 flex items-center justify-between relative z-10">
                    <div className="space-y-1">
                       <div className="text-[8px] text-white/30 font-black uppercase tracking-widest">Encryption Status</div>
                       <div className="text-[10px] font-syne font-black text-brand-teal">AES-256 SECURED NODE</div>
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

