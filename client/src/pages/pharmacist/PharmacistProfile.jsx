import { useState } from 'react';
import { User, Store, MapPin, Clock, ShieldCheck, Camera, Save, Phone, Mail } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PharmacistProfile() {
  const [loading, setLoading] = useState(false);

  const handleSave = () => {
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 1000)),
      {
        loading: 'Updating Node registry...',
        success: 'Profile Synchronized!',
        error: 'Update Failed.',
      }
    );
  };

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="font-syne font-black text-4xl text-navy italic tracking-tighter uppercase">Node Identity</h1>
          <p className="text-xs font-dm font-bold text-navy/40 uppercase tracking-widest mt-1 italic">Authorized Pharmacist Profile</p>
        </div>
        <button 
          onClick={handleSave}
          className="h-14 px-8 bg-navy text-brand-teal rounded-[2rem] font-syne font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:scale-105 transition-all shadow-xl shadow-navy/20"
        >
          <Save size={18} /> Sync Profile
        </button>
      </div>

      <div className="grid lg:grid-cols-12 gap-10">
        {/* Left: Avatar & Pharmacy Photo */}
        <div className="lg:col-span-4 space-y-8">
           <div className="bg-white p-8 rounded-[3.5rem] border border-gray-100 shadow-sm text-center">
              <div className="relative inline-block mx-auto">
                 <div className="h-32 w-32 bg-navy rounded-[2.5rem] border-4 border-white shadow-2xl flex items-center justify-center text-white overflow-hidden">
                    <User size={64} />
                 </div>
                 <button className="absolute -bottom-2 -right-2 h-10 w-10 bg-brand-teal text-navy rounded-xl flex items-center justify-center shadow-lg hover:scale-110 transition-all border-2 border-white">
                    <Camera size={18} />
                 </button>
              </div>
              <div className="mt-6">
                 <h3 className="font-syne font-black text-xl text-navy uppercase italic">Dr. K. Vasan</h3>
                 <p className="text-[10px] font-black text-navy/40 uppercase tracking-widest italic">Reg #KL-48291-PH</p>
              </div>
           </div>

           <div className="bg-navy p-10 rounded-[3.5rem] text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 h-40 w-40 bg-brand-teal/20 rounded-full blur-[80px]" />
              <div className="flex items-center gap-4 mb-8">
                 <div className="h-12 w-12 bg-white/10 rounded-2xl flex items-center justify-center text-brand-teal">
                    <Store size={24} />
                 </div>
                 <h4 className="font-syne font-black text-lg uppercase italic">Pharmacy Assets</h4>
              </div>
              <div className="aspect-video bg-white/5 rounded-2xl border border-white/10 flex flex-col items-center justify-center cursor-pointer hover:bg-white/10 transition-all group-hover:scale-[1.02]">
                 <Camera size={32} className="text-white/20 mb-2" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Upload Store Front</span>
              </div>
           </div>
        </div>

        {/* Right: Form Details */}
        <div className="lg:col-span-8 bg-white p-10 rounded-[3.5rem] border border-gray-100 shadow-sm">
           <div className="space-y-12">
              <div className="space-y-8">
                 <h3 className="font-syne font-black text-xl text-navy uppercase italic flex items-center gap-3">
                    <ShieldCheck size={24} className="text-brand-teal" /> Personal Credentials
                 </h3>
                 <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-navy/40 uppercase tracking-widest italic ml-1">Full Name</label>
                       <input type="text" defaultValue="Dr. Keerthivasan" className="w-full h-14 bg-gray-50 border border-gray-100 rounded-2xl px-6 font-dm font-bold text-navy outline-none focus:border-brand-teal transition-all" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-navy/40 uppercase tracking-widest italic ml-1">License ID</label>
                       <input type="text" defaultValue="KL-48291-PH" disabled className="w-full h-14 bg-gray-200 border border-gray-100 rounded-2xl px-6 font-dm font-bold text-navy/40 outline-none cursor-not-allowed" />
                    </div>
                 </div>
              </div>

              <div className="space-y-8">
                 <h3 className="font-syne font-black text-xl text-navy uppercase italic flex items-center gap-3">
                    <MapPin size={24} className="text-brand-teal" /> Pharmacy Node Location
                 </h3>
                 <div className="space-y-8">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-navy/40 uppercase tracking-widest italic ml-1">Store Address</label>
                       <textarea rows="3" defaultValue="42, Main Road, Karaikal Central, Karaikal - 609602" className="w-full bg-gray-50 border border-gray-100 rounded-3xl px-6 py-4 font-dm font-bold text-navy outline-none focus:border-brand-teal transition-all resize-none"></textarea>
                    </div>
                    <div className="grid md:grid-cols-2 gap-8">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-navy/40 uppercase tracking-widest italic ml-1">Contact Phone</label>
                          <div className="relative">
                             <Phone size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-navy/20" />
                             <input type="text" defaultValue="+91 98765 43210" className="w-full h-14 bg-gray-50 border border-gray-100 rounded-2xl pl-14 pr-6 font-dm font-bold text-navy outline-none focus:border-brand-teal transition-all" />
                          </div>
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-navy/40 uppercase tracking-widest italic ml-1">Support Email</label>
                          <div className="relative">
                             <Mail size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-navy/20" />
                             <input type="email" defaultValue="apollo.karaikal@medipharm.in" className="w-full h-14 bg-gray-50 border border-gray-100 rounded-2xl pl-14 pr-6 font-dm font-bold text-navy outline-none focus:border-brand-teal transition-all" />
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
