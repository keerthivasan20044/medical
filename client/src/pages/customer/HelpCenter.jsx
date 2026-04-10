import { HelpCircle, Phone, Mail, MessageSquare, ChevronRight, Globe, ShieldCheck, Heart } from 'lucide-react';
import PageShell from '../../components/layout/PageShell';

export default function HelpCenter() {
  return (
    <PageShell 
      title="Tech Support Pulse" 
      subtitle="Direct link to district command center and architectural help resources."
      icon={HelpCircle}
    >
      <div className="p-20 grid lg:grid-cols-2 gap-24">
         <div className="space-y-12">
            <h3 className="font-syne font-black text-4xl text-[#0a1628] uppercase italic tracking-tighter leading-none flex items-center gap-6">
               <div className="h-2 w-16 bg-brand-teal rounded-full" /> Common Enclave Queries
            </h3>
            
            <div className="space-y-4">
               {['How to synchronize my prescription?', 'What is the Avg Logistics Sync?', 'Emergency Protocol: Govt Hospital contact', 'How to authorize a new pharmacy node?'].map(q => (
                  <div key={q} className="p-10 bg-gray-50/50 rounded-[2.5rem] border border-black/[0.03] group hover:bg-[#0a1628] hover:text-white transition-all duration-700 cursor-pointer flex items-center justify-between">
                     <span className="font-dm text-2xl italic font-bold text-[#0a1628] group-hover:text-white transition-colors">{q}</span>
                     <ChevronRight className="text-brand-teal transform group-hover:translate-x-2 transition-transform" size={24} />
                  </div>
               ))}
            </div>
         </div>

         <div className="space-y-12">
            <h3 className="font-syne font-black text-4xl text-[#0a1628] uppercase italic tracking-tighter leading-none flex items-center gap-6">
               <div className="h-2 w-16 bg-brand-teal rounded-full" /> Direct Command Node
            </h3>
            
            <div className="grid grid-cols-1 gap-6">
               {[
                  { label: 'Voice Handshake', val: '+91 94432 XXXXX', icon: Phone },
                  { label: 'Uplink Support', val: 'support@medipharm.com', icon: Mail },
                  { label: 'Live Tele-Support', val: '10 AM - 8 PM', icon: MessageSquare }
               ].map(item => (
                  <div key={item.label} className="bg-white p-12 rounded-[3.5rem] border border-black/[0.01] shadow-soft hover:shadow-4xl transition-all duration-700 flex items-center gap-10 group cursor-pointer relative overflow-hidden">
                     <div className="absolute top-0 right-0 h-40 w-40 bg-brand-teal opacity-0 group-hover:opacity-5 rounded-full blur-[80px] transition-opacity" />
                     <div className="h-20 w-20 bg-[#0a1628] rounded-[1.8rem] flex items-center justify-center text-brand-teal shadow-2xl group-hover:scale-110 transition-transform duration-700">
                        <item.icon size={32} />
                     </div>
                     <div className="space-y-1 relative z-10">
                        <div className="text-[10px] text-gray-300 font-black uppercase tracking-widest italic leading-none">{item.label}</div>
                        <div className="font-syne font-black text-[#0a1628] text-2xl uppercase italic tracking-tighter">{item.val}</div>
                     </div>
                  </div>
               ))}
            </div>
            
            <div className="bg-brand-teal/5 border-2 border-dashed border-brand-teal/20 p-12 rounded-[4rem] space-y-6">
               <div className="flex items-center gap-4 text-brand-teal font-syne font-black text-sm uppercase italic">
                  <ShieldCheck size={24} /> MISSION_SECURITY_PROTOCOL
               </div>
               <p className="text-[#0a1628]/60 font-dm italic font-bold">MediPharm Command Center operates 24/7 for emergency logistics and district synchronization.</p>
            </div>
         </div>
      </div>
    </PageShell>
  );
}
