import { MessageSquare, Send, Paperclip, User, ShieldCheck } from 'lucide-react';
import PageShell from '../../components/layout/PageShell';

export default function Chat() {
  return (
    <PageShell 
      title="Tele-Pulse Chat" 
      subtitle="Encrypted real-time communication with Karaikal pharmacies and clinicians."
      icon={MessageSquare}
    >
      <div className="h-[750px] flex flex-col relative overflow-hidden bg-gray-50/50">
         <div className="p-10 bg-white border-b border-black/[0.03] flex items-center justify-between relative z-10 shadow-soft">
            <div className="flex items-center gap-8">
               <div className="h-20 w-20 bg-[#0a1628] rounded-2xl flex items-center justify-center text-brand-teal shadow-2xl relative">
                  <User size={32} />
                  <div className="absolute -bottom-1 -right-1 h-6 w-6 bg-brand-teal rounded-full border-4 border-white animate-pulse" />
               </div>
               <div className="space-y-1">
                  <div className="text-[10px] text-gray-300 font-black uppercase tracking-widest italic leading-none">Terminal Sync Active</div>
                  <div className="font-syne font-black text-[#0a1628] text-2xl uppercase italic tracking-tighter">Apollo Pharmacy Support</div>
               </div>
            </div>
            
            <div className="px-6 py-2 bg-brand-teal/10 border border-brand-teal/20 rounded-xl text-[10px] text-brand-teal font-black uppercase tracking-widest italic flex items-center gap-4">
               <ShieldCheck size={16} /> END_TO_END_ENCRYPTED
            </div>
         </div>

         <div className="flex-1 p-12 overflow-y-auto space-y-12 no-scrollbar">
            {/* Mock Chat History */}
            <div className="flex flex-col items-start gap-4 max-w-xl">
               <div className="py-6 px-10 bg-[#0a1628] rounded-[2.5rem] rounded-bl-none text-white font-dm italic font-bold text-xl shadow-4xl border-l-[12px] border-brand-teal">
                  Hello Commander. How can we synchronize your medical procurement today?
               </div>
               <div className="text-[10px] text-gray-300 font-black uppercase tracking-widest italic px-4">Pharmacist Node · 10:42 AM</div>
            </div>

            <div className="flex flex-col items-end gap-4 max-w-xl ml-auto">
               <div className="py-6 px-10 bg-brand-teal rounded-[2.5rem] rounded-br-none text-[#0a1628] font-dm italic font-bold text-xl shadow-4xl border-r-[12px] border-[#0a1628]">
                  Checking inventory for Dolo 650mg at Central Enclave.
               </div>
               <div className="text-[10px] text-gray-300 font-black uppercase tracking-widest italic px-4">Terminal Alpha · 10:44 AM</div>
            </div>
         </div>

         <div className="p-10 bg-white border-t border-black/[0.03] space-y-6 shadow-4xl relative z-10">
            <div className="flex p-4 bg-gray-50 border-2 border-transparent focus-within:border-brand-teal rounded-[2rem] group transition-all duration-700 shadow-inner">
               <button className="h-16 w-16 text-gray-300 hover:text-brand-teal transition-colors"><Paperclip size={24}/></button>
               <input type="text" placeholder="Type transmission payload..." className="bg-transparent flex-1 px-8 font-dm italic font-bold text-xl text-[#0a1628] outline-none placeholder:text-gray-300" />
               <button className="h-16 w-16 bg-[#0a1628] text-brand-teal rounded-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-4xl animate-pulse"><Send size={24} /></button>
            </div>
         </div>
      </div>
    </PageShell>
  );
}
