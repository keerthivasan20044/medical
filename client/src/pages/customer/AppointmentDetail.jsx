import { Calendar, Clock, MapPin, User, ChevronRight, CheckCircle, Video, MessageSquare, Download } from 'lucide-react';
import PageShell from '../../components/layout/PageShell';

export default function AppointmentDetail() {
  return (
    <PageShell 
      title="Session Meta" 
      subtitle="Full synchronization logs for clinical session ID: APT-5521-KKL."
      icon={Calendar}
      actions={
        <div className="flex gap-4">
          <button className="h-16 px-10 bg-brand-teal text-[#0a1628] font-syne font-black text-xs rounded-2xl flex items-center gap-3 active:scale-95 shadow-4xl italic uppercase tracking-wider group">
            <Video size={18} className="group-hover:animate-pulse" /> Join Tele-Pulse
          </button>
          <button className="h-16 px-10 bg-[#0a1628] text-brand-teal font-syne font-black text-xs rounded-2xl flex items-center gap-3 active:scale-95 shadow-4xl italic uppercase tracking-wider">
            <MessageSquare size={18} /> Chat Clinician
          </button>
        </div>
      }
    >
      <div className="p-20 grid lg:grid-cols-2 gap-24">
         <div className="space-y-12">
            <div className="bg-gray-50/50 p-12 rounded-[4rem] border border-black/[0.03] space-y-12">
               <div className="flex items-center gap-6">
                  <div className="h-20 w-20 bg-[#0a1628] rounded-[2rem] flex items-center justify-center text-brand-teal shadow-2xl animate-spin-slow"><Clock size={32}/></div>
                  <div className="space-y-1">
                     <div className="text-[10px] text-gray-300 font-black uppercase tracking-widest italic">Sync Lockdown</div>
                     <div className="font-syne font-black text-[#0a1628] text-xl uppercase italic flex items-center gap-3">CONFIRMED_Section <CheckCircle size={18} className="text-brand-teal"/></div>
                  </div>
               </div>
               
               <div className="space-y-8">
                  <div className="flex border-b border-black/[0.03] pb-6 justify-between items-center text-gray-400 font-dm italic font-bold">
                     <span>Session ID:</span>
                     <span className="text-[#0a1628]">APT-5521-KKL-SYNC</span>
                  </div>
                  <div className="flex border-b border-black/[0.03] pb-6 justify-between items-center text-gray-400 font-dm italic font-bold">
                     <span>Scheduled Time:</span>
                     <span className="text-[#0a1628]">26 Mar 2026, 17:00</span>
                  </div>
                  <div className="flex border-b border-black/[0.03] pb-6 justify-between items-center text-gray-400 font-dm italic font-bold">
                     <span>Location:</span>
                     <span className="text-[#0a1628]">Tele-Pulse (Video)</span>
                  </div>
               </div>
            </div>
         </div>
         
         <div className="bg-[#0a1628] p-12 rounded-[4rem] text-white space-y-12 shadow-4xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 h-[600px] w-[600px] bg-brand-teal opacity-5 rounded-full blur-[150px]" />
            <div className="flex items-center gap-8 relative z-10">
               <div className="h-24 w-24 rounded-[2rem] overflow-hidden border-2 border-brand-teal/20 group-hover:border-brand-teal transition-all duration-700 shadow-2xl">
                  <img src="/assets/doctor_icon.png" className="h-full w-full object-cover" />
               </div>
               <div>
                  <h3 className="font-syne font-black text-2xl uppercase italic tracking-tighter text-brand-teal">Dr. S. Priya Raman</h3>
                  <p className="text-white/40 font-dm italic font-bold">General Physician · Karaikal District Clinician</p>
               </div>
            </div>
            
            <div className="space-y-6 relative z-10">
               <h4 className="text-[10px] text-brand-teal font-black uppercase tracking-[0.4em] italic">Post-Session Artifacts</h4>
               <div className="p-8 bg-white/5 border border-white/5 rounded-3xl group hover:bg-white/10 transition-all cursor-pointer flex items-center justify-between">
                  <div className="flex items-center gap-6">
                     <Download className="text-brand-teal" size={24} />
                     <div className="font-syne font-black text-white text-lg uppercase italic tracking-tighter shrink-0">PRESCRIPTION_HANDSHAKE_P01</div>
                  </div>
                  <ChevronRight size={20} className="text-white/20 group-hover:text-white transition-opacity" />
               </div>
            </div>
         </div>
      </div>
    </PageShell>
  );
}
