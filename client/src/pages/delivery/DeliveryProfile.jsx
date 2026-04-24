import { useState } from 'react';
import { User, Navigation, MapPin, ShieldCheck, Camera, Save, Phone, Mail, Bike, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

export default function DeliveryProfile() {
  const [loading, setLoading] = useState(false);

  const handleSave = () => {
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 1000)),
      {
        loading: 'Updating Agent registry...',
        success: 'Profile Synchronized!',
        error: 'Update Failed.',
      }
    );
  };

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="font-syne font-black text-4xl text-navy italic tracking-tighter uppercase">Agent Identity</h1>
          <p className="text-xs font-dm font-bold text-navy/40 uppercase tracking-widest mt-1 italic">Authorized Delivery Partner Profile</p>
        </div>
        <button 
          onClick={handleSave}
          className="h-14 px-8 bg-navy text-brand-teal rounded-[2rem] font-syne font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:scale-105 transition-all shadow-xl shadow-navy/20"
        >
          <Save size={18} /> Sync Registry
        </button>
      </div>

      <div className="grid lg:grid-cols-12 gap-10">
        {/* Left: Avatar & Vehicle Info */}
        <div className="lg:col-span-4 space-y-8">
           <div className="bg-white p-8 rounded-[3.5rem] border border-gray-100 shadow-sm text-center relative overflow-hidden group">
              <div className="absolute top-0 right-0 h-2 w-full bg-brand-teal" />
              <div className="relative inline-block mx-auto">
                 <div className="h-32 w-32 bg-navy rounded-[2.5rem] border-4 border-white shadow-2xl flex items-center justify-center text-white overflow-hidden">
                    <User size={64} />
                 </div>
                 <button className="absolute -bottom-2 -right-2 h-10 w-10 bg-brand-teal text-navy rounded-xl flex items-center justify-center shadow-lg hover:scale-110 transition-all border-2 border-white">
                    <Camera size={18} />
                 </button>
              </div>
              <div className="mt-6">
                 <h3 className="font-syne font-black text-xl text-navy uppercase italic">Sathish Kumar</h3>
                 <p className="text-[10px] font-black text-navy/40 uppercase tracking-widest italic">Agent ID #DP-48291</p>
              </div>
           </div>

           <div className="bg-navy p-10 rounded-[3.5rem] text-white relative overflow-hidden group shadow-2xl">
              <div className="absolute top-0 right-0 h-40 w-40 bg-brand-teal/20 rounded-full blur-[80px]" />
              <div className="flex items-center gap-4 mb-8">
                 <div className="h-12 w-12 bg-white/10 rounded-2xl flex items-center justify-center text-brand-teal">
                    <Bike size={24} />
                 </div>
                 <h4 className="font-syne font-black text-lg uppercase italic">Transit Asset</h4>
              </div>
              <div className="space-y-6 relative z-10">
                 <div className="space-y-1">
                    <div className="text-[10px] font-black text-white/40 uppercase tracking-widest italic">Vehicle Type</div>
                    <div className="font-dm font-bold text-white text-sm">Electric Scooter ( Ather 450X )</div>
                 </div>
                 <div className="space-y-1">
                    <div className="text-[10px] font-black text-white/40 uppercase tracking-widest italic">Registration Number</div>
                    <div className="font-dm font-bold text-brand-teal text-sm">PY-01-BK-4829</div>
                 </div>
                 <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[10px] font-black text-white/40 uppercase tracking-widest italic">Asset Verification</span>
                    <span className="px-3 py-1 bg-brand-teal/20 text-brand-teal rounded-full text-[9px] font-black uppercase italic">Verified</span>
                 </div>
              </div>
           </div>
        </div>

        {/* Right: Personal & Documents */}
        <div className="lg:col-span-8 bg-white p-10 rounded-[3.5rem] border border-gray-100 shadow-sm">
           <div className="space-y-12">
              <div className="space-y-8">
                 <h3 className="font-syne font-black text-xl text-navy uppercase italic flex items-center gap-3">
                    <ShieldCheck size={24} className="text-brand-teal" /> Personal Protocol
                 </h3>
                 <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-navy/40 uppercase tracking-widest italic ml-1">Full Identity</label>
                       <input type="text" defaultValue="Sathish Kumar" className="w-full h-14 bg-gray-50 border border-gray-100 rounded-2xl px-6 font-dm font-bold text-navy outline-none focus:border-brand-teal transition-all" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-navy/40 uppercase tracking-widest italic ml-1">Aadhar Verification</label>
                       <input type="text" defaultValue="•••• •••• 4291" disabled className="w-full h-14 bg-gray-200 border border-gray-100 rounded-2xl px-6 font-dm font-bold text-navy/40 outline-none cursor-not-allowed" />
                    </div>
                 </div>
              </div>

              <div className="space-y-8">
                 <h3 className="font-syne font-black text-xl text-navy uppercase italic flex items-center gap-3">
                    <FileText size={24} className="text-brand-teal" /> Legal Registry
                 </h3>
                 <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                       <div className="text-[10px] font-black text-navy/40 uppercase tracking-widest italic ml-1">Driving License</div>
                       <div className="h-32 bg-gray-50 border border-gray-100 rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-all border-dashed border-2">
                          <FileText size={24} className="text-navy/20 mb-2" />
                          <span className="text-[10px] font-black text-navy/40 uppercase tracking-widest">Update License Scan</span>
                       </div>
                    </div>
                    <div className="space-y-4">
                       <div className="text-[10px] font-black text-navy/40 uppercase tracking-widest italic ml-1">Vehicle Insurance</div>
                       <div className="h-32 bg-gray-50 border border-gray-100 rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-all border-dashed border-2">
                          <ShieldCheck size={24} className="text-navy/20 mb-2" />
                          <span className="text-[10px] font-black text-navy/40 uppercase tracking-widest">Update Policy Scan</span>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="space-y-8">
                 <h3 className="font-syne font-black text-xl text-navy uppercase italic flex items-center gap-3">
                    <MapPin size={24} className="text-brand-teal" /> Operational Radius
                 </h3>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-navy/40 uppercase tracking-widest italic ml-1">Preferred Sector</label>
                    <select className="w-full h-14 bg-gray-50 border border-gray-100 rounded-2xl px-6 font-dm font-bold text-navy outline-none focus:border-brand-teal transition-all appearance-none cursor-pointer">
                       <option>Karaikal Central</option>
                       <option>Nagore Region</option>
                       <option>Puducherry Hub</option>
                    </select>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
