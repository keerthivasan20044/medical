import { Edit, User, Save, X } from 'lucide-react';
import PageShell from '../../components/layout/PageShell';

export default function EditProfile() {
  return (
    <PageShell 
      title="Profile Sync" 
      subtitle="Edit your district node identification and health credentials."
      icon={Edit}
      actions={
        <button className="h-16 px-10 bg-brand-teal text-[#0a1628] font-syne font-black text-xs rounded-2xl flex items-center gap-3 active:scale-95 shadow-4xl italic uppercase tracking-wider">
          <Save size={18} /> Update Payload
        </button>
      }
    >
      <div className="p-20 space-y-12 max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row gap-12 items-center pb-12 border-b border-black/[0.03]">
           <div className="h-40 w-40 rounded-[3rem] bg-[#0a1628] flex items-center justify-center text-brand-teal text-6xl font-black italic shadow-4xl relative group cursor-pointer">
              T
              <div className="absolute inset-0 bg-[#0a1628]/80 opacity-0 group-hover:opacity-100 transition-opacity rounded-[3rem] flex items-center justify-center text-xs uppercase tracking-widest font-black italic">Change Node</div>
           </div>
           <div className="space-y-3">
              <h3 className="font-syne font-black text-3xl text-[#0a1628] uppercase italic tracking-tighter">Terminal Node_Alpha</h3>
              <p className="text-gray-400 font-dm italic font-bold">Authenticated Profile · Karaikal Central</p>
           </div>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
           {['Full Name', 'District ID (Email)', 'Mobile Handshake', 'Clinical Age'].map(label => (
             <div key={label} className="space-y-3">
                <label className="text-[10px] font-black text-gray-300 uppercase tracking-widest italic">{label}</label>
                <input type="text" placeholder={`Enter ${label}...`} className="w-full bg-gray-50/50 border border-black/[0.03] rounded-2xl h-14 px-6 font-dm italic font-bold text-[#0a1628] outline-none focus:border-brand-teal transition-all" />
             </div>
           ))}
        </div>
      </div>
    </PageShell>
  );
}
