import { Calendar, Clock, MapPin, User, ChevronRight, CheckCircle, Info } from 'lucide-react';
import PageShell from '../../components/layout/PageShell';

export default function BookAppointment() {
  return (
    <PageShell 
      title="Appointment Async" 
      subtitle="Synchronize your clinical schedule with certified district clinicians."
      icon={Calendar}
      actions={
        <button className="h-16 px-10 bg-brand-teal text-[#0a1628] font-syne font-black text-xs rounded-2xl flex items-center gap-3 active:scale-95 shadow-4xl italic uppercase tracking-wider group">
          <Calendar size={18} className="group-hover:animate-bounce" /> Authorize Session
        </button>
      }
    >
      <div className="p-20 grid lg:grid-cols-2 gap-24">
         <div className="space-y-12">
            <div className="bg-[#0a1628] p-12 rounded-[4rem] text-white space-y-12 shadow-4xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 h-40 w-40 bg-brand-teal opacity-5 rounded-full blur-[80px]" />
               <div className="flex gap-8 items-center relative z-10">
                  <div className="h-24 w-24 rounded-[2rem] overflow-hidden border-2 border-brand-teal/20 group-hover:border-brand-teal transition-all duration-700 shadow-2xl">
                     <img src="/assets/doctor_icon.png" className="h-full w-full object-cover" />
                  </div>
                  <div>
                     <h3 className="font-syne font-black text-2xl uppercase italic tracking-tighter text-brand-teal">Dr. S. Priya Raman</h3>
                     <p className="text-white/40 font-dm italic font-bold">General Physician · Karaikal Govt Hospital</p>
                  </div>
               </div>
               
               <div className="grid grid-cols-2 gap-6 relative z-10">
                  <div className="p-8 bg-white/5 rounded-3xl border border-white/5 space-y-2">
                     <div className="text-[10px] text-brand-teal font-black uppercase tracking-widest italic leading-none">Consultation Fee</div>
                     <div className="text-3xl font-syne font-black italic text-white flex items-center gap-2">₹200</div>
                  </div>
                  <div className="p-8 bg-white/5 rounded-3xl border border-white/5 space-y-2">
                     <div className="text-[10px] text-brand-teal font-black uppercase tracking-widest italic leading-none">Terminal Node</div>
                     <div className="text-xl font-syne font-black italic text-white uppercase tracking-tighter">KKL-CENTRAL-01</div>
                  </div>
               </div>
            </div>

            <div className="space-y-8">
               <h4 className="font-syne font-black text-2xl text-[#0a1628] uppercase italic leading-none flex items-center gap-4">
                  <Clock className="text-brand-teal" size={24} /> Select Time Protocol
               </h4>
               <div className="grid grid-cols-4 gap-4">
                  {['09:00', '10:30', '11:45', '14:00', '15:30', '17:00', '18:15', '20:00'].map(time => (
                     <button key={time} className="h-14 font-syne font-black text-xs border border-black/[0.03] bg-gray-50 rounded-xl hover:bg-brand-teal hover:text-[#0a1628] transition-all italic tracking-widest active:scale-90">
                        {time}
                     </button>
                  ))}
               </div>
            </div>
         </div>

         <div className="space-y-12">
            <div className="bg-gray-50/50 p-12 rounded-[4rem] border border-black/[0.03] space-y-12">
               <h4 className="font-syne font-black text-2xl text-[#0a1628] uppercase italic leading-none flex items-center gap-4">
                  <Calendar className="text-brand-teal" size={24} /> Select Date Handshake
               </h4>
               <div className="p-8 bg-white rounded-[2.5rem] shadow-inner border border-black/[0.01]">
                  {/* High Fidelity Date Picker View Mockup */}
                  <div className="grid grid-cols-7 gap-4 text-center">
                     {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => <div key={d} className="text-[10px] text-gray-300 font-black italic uppercase leading-none pb-4">{d}</div>)}
                     {[...Array(31)].map((_, i) => (
                        <div key={i} className={`h-12 w-12 flex items-center justify-center font-syne font-black text-sm italic rounded-xl cursor-not-allowed ${i+1 === 26 ? 'bg-[#0a1628] text-brand-teal shadow-4xl' : 'text-gray-200'}`}>
                           {i+1}
                        </div>
                     ))}
                  </div>
               </div>
            </div>
            
            <div className="bg-brand-teal/5 border-2 border-dashed border-brand-teal/20 p-10 rounded-[3rem] space-y-4">
               <div className="flex items-center gap-4 text-brand-teal font-syne font-black text-sm uppercase italic">
                  <Info size={20} /> SYNC_POLICY_AUTOADHERE
               </div>
               <p className="text-[#0a1628]/60 font-dm italic font-bold">Rescheduling is available within 4 hours of the synchronized session time via the Command Center.</p>
            </div>
         </div>
      </div>
    </PageShell>
  );
}
