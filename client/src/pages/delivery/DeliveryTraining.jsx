import { useState } from 'react';
import { BookOpen, CheckCircle, Clock, Play, Award, Shield, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

export default function DeliveryTraining() {
  const [activeCourse, setActiveCourse] = useState(null);

  const courses = [
    { id: 'safety', title: 'Road Safety', desc: 'Karaikal traffic guidelines and emergency safety.', duration: '15 min', status: 'Completed', icon: Shield, color: 'text-emerald-500 bg-emerald-50' },
    { id: 'hygiene', title: 'Medical Handling', desc: 'Sanitization and temperature control for medicines.', duration: '20 min', status: 'In Progress', icon: Clock, color: 'text-amber-500 bg-amber-50' },
    { id: 'customer', title: 'Customer Ethics', desc: 'Professional delivery conduct and verification.', duration: '10 min', status: 'Pending', icon: BookOpen, color: 'text-blue-500 bg-blue-50' },
    { id: 'app', title: 'Using the App', desc: 'Complete guide to the MediReach delivery app.', duration: '12 min', status: 'Pending', icon: Play, color: 'text-purple-500 bg-purple-50' },
  ];

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="font-syne font-black text-4xl text-navy italic tracking-tighter uppercase">Training</h1>
          <p className="text-xs font-dm font-bold text-navy/40 uppercase tracking-widest mt-1 italic">Lessons and certificates</p>
        </div>
        <div className="bg-white px-6 py-3 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
           <Award className="text-amber-500" size={20} />
           <div>
              <div className="text-[8px] font-black text-navy/20 uppercase tracking-[0.2em] leading-none mb-1">Rank</div>
              <div className="text-xs font-black text-navy uppercase italic">Gold Associate</div>
           </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {courses.map((c) => (
          <div key={c.id} className="bg-white p-10 rounded-[3.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
             <div className="flex items-start justify-between gap-4">
                <div className={`h-16 w-16 rounded-2xl flex items-center justify-center transition-all duration-700 group-hover:scale-110 group-hover:rotate-6 ${c.color}`}>
                   <c.icon size={28} />
                </div>
                <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest italic border ${
                  c.status === 'Completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                  c.status === 'In Progress' ? 'bg-amber-50 text-amber-600 border-amber-100' : 
                  'bg-gray-50 text-gray-400 border-gray-100'
                }`}>
                   {c.status}
                </div>
             </div>

             <div className="mt-8 space-y-3">
                <h3 className="font-syne font-black text-xl text-navy uppercase italic tracking-tighter">{c.title}</h3>
                <p className="text-xs font-dm font-bold text-navy/40 leading-relaxed uppercase tracking-tight italic">{c.desc}</p>
             </div>

             <div className="mt-8 flex items-center gap-6">
                <div className="flex items-center gap-2 text-[10px] font-black text-navy/40 uppercase tracking-widest">
                   <Clock size={14} /> {c.duration}
                </div>
                <button 
                  onClick={() => toast.success('Opening lesson...')}
                  className="flex-1 h-14 bg-navy text-brand-teal rounded-2xl font-syne font-black text-[10px] uppercase tracking-widest hover:bg-brand-teal hover:text-navy transition-all shadow-xl"
                >
                   {c.status === 'Completed' ? 'RE-CERTIFY' : 'START LESSON'}
                </button>
             </div>
          </div>
        ))}
      </div>

      {/* Certification History */}
      <div className="bg-navy rounded-[4rem] p-12 text-white relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-10">
         <div className="absolute top-0 right-0 h-96 w-96 bg-brand-teal opacity-5 rounded-full blur-[100px]" />
         <div className="space-y-3 relative z-10 text-center md:text-left">
            <h2 className="font-syne font-black text-3xl uppercase italic tracking-tighter leading-none">ID Card</h2>
            <p className="text-white/40 font-dm text-sm italic uppercase tracking-widest">Download your delivery partner ID.</p>
         </div>
         <button className="h-16 px-12 bg-white text-navy rounded-2xl font-syne font-black text-xs uppercase tracking-widest hover:bg-brand-teal transition-all shadow-4xl relative z-10 whitespace-nowrap">
            Download ID
         </button>
      </div>
    </div>
  );
}
