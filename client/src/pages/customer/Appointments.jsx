import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Video, Calendar, Clock, MapPin, CheckCircle, XCircle, 
  ChevronRight, ArrowRight, User, Stethoscope, Hospital, Star, 
  MoreVertical, AlertCircle, Phone, VideoIcon, PlusCircle, 
  CheckSquare, History, X 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const UPCOMING = [
  {
    id: 'APT-1024',
    doctor: 'Dr. S. Priya Raman',
    specialty: 'General Physician',
    hospital: 'Govt. General Hospital, Karaikal',
    date: 'Tomorrow, 4:00 PM',
    type: 'Video Call',
    fee: '₹200',
    status: 'Confirmed',
    paid: true,
    img: 'https://i.pravatar.cc/100?img=47'
  }
];

const PAST = [
  {
    id: 'APT-0988',
    doctor: 'Dr. M. Meena Krishnan',
    specialty: 'Pediatrician',
    hospital: 'Child Care Hospital, Market Road',
    date: '10 Mar 2026, 5:00 PM',
    type: 'Video Call',
    status: 'Completed',
    img: 'https://i.pravatar.cc/100?img=16'
  }
];

export default function Appointments() {
  const [activeTab, setActiveTab] = useState('Upcoming');

  const handleCancel = (id) => {
    toast.success(`Appointment ${id} cancelled. Refund processed.`);
  };

  const handleJoin = (id) => {
    toast.success(`Initializing encrypted video tunnel for ${id}...`);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20 pt-10 px-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-gray-50">
        <div className="space-y-2">
           <h1 className="font-syne font-black text-5xl text-[#0a1628]">My Appointments</h1>
           <p className="text-gray-400 font-dm italic">Your active healthcare architecture schedule in Karaikal district.</p>
        </div>
        <Link 
          to="/doctors" 
          className="px-10 py-5 bg-gradient-to-r from-[#02C39A] to-[#028090] text-white font-syne font-black text-sm uppercase tracking-widest rounded-3xl shadow-2xl shadow-[#02C39A]/40 hover:scale-[1.05] active:scale-95 transition-all flex items-center gap-3"
        >
          <PlusCircle size={20} /> Find Available Doctors
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-4 bg-gray-50/50 p-2 rounded-[2rem] w-fit mx-auto lg:mx-0 shadow-sm border border-gray-100">
        {[
           { name: 'Upcoming', icon: Calendar },
           { name: 'Past', icon: History },
           { name: 'Cancelled', icon: X }
        ].map(t => (
          <button
            key={t.name}
            onClick={() => setActiveTab(t.name)}
            className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-3 ${activeTab === t.name ? 'bg-[#0a1628] text-white shadow-xl scale-105' : 'bg-transparent text-gray-400 hover:text-gray-600'}`}
          >
            <t.icon size={14} /> {t.name}
            {t.name === 'Upcoming' && <span className="text-[8px] bg-[#028090] text-white px-2 py-0.5 rounded-full">{UPCOMING.length}</span>}
          </button>
        ))}
      </div>

      {/* List Section */}
      <AnimatePresence mode="wait">
        <motion.div
           key={activeTab}
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           exit={{ opacity: 0, scale: 0.95 }}
           className="space-y-8 min-h-[400px]"
        >
           {activeTab === 'Upcoming' && (
              <div className="grid grid-cols-1 gap-8">
                 {UPCOMING.map((apt, idx) => (
                    <motion.div
                       key={apt.id}
                       initial={{ opacity: 0, y: 20 }}
                       animate={{ opacity: 1, y: 0 }}
                       className="bg-white border-2 border-gray-50 rounded-[4rem] p-10 md:p-14 flex flex-col lg:flex-row gap-12 lg:items-center relative group hover:border-[#028090]/20 hover:shadow-3xl transition duration-500 overflow-hidden"
                    >
                       <div className="absolute top-0 right-0 h-48 w-48 bg-[#028090] rounded-full blur-[120px] opacity-[0.03]" />
                       
                       <div className="flex items-center gap-8 lg:w-1/3">
                          <div className="relative shrink-0">
                             <img src={apt.img} alt={apt.doctor} className="h-28 w-28 rounded-[2.5rem] object-cover ring-8 ring-gray-50/50 p-1 bg-white group-hover:scale-110 transition duration-700" />
                             <div className="absolute -bottom-1 -right-1 h-8 w-8 bg-[#028090] border-4 border-white text-white rounded-full flex items-center justify-center p-1 shadow-lg">
                                <Video size={14} />
                             </div>
                          </div>
                          <div className="space-y-1">
                             <h3 className="font-syne font-black text-2xl text-[#0a1628] leading-tight">{apt.doctor}</h3>
                             <p className="text-[10px] font-black text-[#02C39A] uppercase tracking-widest">{apt.specialty}</p>
                             <div className="text-xs font-dm text-gray-400 italic pt-1 flex items-center gap-2"><MapPin size={12} className="text-gray-300" /> {apt.hospital}</div>
                          </div>
                       </div>

                       <div className="lg:w-1/3 grid grid-cols-2 gap-8 border-y lg:border-y-0 lg:border-x border-gray-100 py-8 lg:py-4 lg:px-12">
                          <div className="space-y-3">
                             <div className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Date & Time</div>
                             <div className="font-syne font-black text-xl text-[#0a1628] leading-tight">{apt.date}</div>
                             <div className="text-[10px] font-bold text-[#028090] uppercase tracking-[0.2em] bg-emerald-50 px-3 py-1 rounded-full inline-block">Confirmed ✓</div>
                          </div>
                          <div className="space-y-3">
                             <div className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Type & Fee</div>
                             <div className="font-syne font-black text-xl text-[#0a1628] leading-tight flex items-center gap-2">{apt.type}</div>
                             <div className="text-[10px] font-black text-gray-400">{apt.fee} (Paid via UPI)</div>
                          </div>
                       </div>

                       <div className="lg:w-1/3 space-y-8 text-center lg:text-right">
                          <div className="bg-amber-50 p-6 rounded-[2.5rem] border border-amber-100/40">
                             <p className="text-xs font-dm text-amber-700 font-bold italic leading-relaxed">
                                "Video call link will be active 5 min before appointment."
                             </p>
                          </div>
                          <div className="flex flex-wrap lg:justify-end gap-3">
                             <button onClick={() => handleJoin(apt.id)} className="flex-1 lg:flex-none h-16 px-10 bg-[#0a1628] text-white rounded-3xl font-syne font-black text-xs uppercase tracking-widest hover:bg-[#028090] transition shadow-2xl shadow-[#0a1628]/20 flex items-center justify-center gap-3 group/btn">
                                Join Video Call <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition" />
                             </button>
                             <button className="h-16 px-8 bg-white border border-gray-100 rounded-3xl font-syne font-black text-xs uppercase tracking-widest text-[#0a1628] hover:bg-gray-50 transition">Reschedule</button>
                             <button onClick={() => handleCancel(apt.id)} className="h-16 w-16 bg-white border border-red-50 text-red-500 rounded-3xl flex items-center justify-center hover:bg-red-500 hover:text-white transition"><XCircle size={24} /></button>
                          </div>
                       </div>
                    </motion.div>
                 ))}
              </div>
           )}

           {activeTab === 'Past' && (
              <div className="grid gap-6">
                 {PAST.map((apt, idx) => (
                    <motion.div 
                       key={apt.id}
                       initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                       className="bg-white border border-gray-100 p-8 rounded-[3rem] shadow-sm flex flex-col md:flex-row items-center justify-between gap-8 group hover:shadow-2xl transition duration-500"
                    >
                       <div className="flex items-center gap-6">
                          <img src={apt.img} alt="Doc" className="h-16 w-16 rounded-2xl filter grayscale" />
                          <div>
                             <h4 className="font-syne font-black text-[#0a1628] text-xl group-hover:text-[#028090] transition">{apt.doctor}</h4>
                             <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{apt.specialty} · {apt.date}</div>
                          </div>
                       </div>
                       <div className="flex items-center gap-4">
                          <div className="text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-6 py-2 rounded-full">Completed</div>
                          <button className="h-12 px-8 bg-gray-50 text-[#0a1628] font-syne font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-[#0a1628] hover:text-white transition">Book Again</button>
                       </div>
                    </motion.div>
                 ))}
              </div>
           )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
