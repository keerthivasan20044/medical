import { useState } from 'react';
import { Truck, ShieldCheck, FileText, AlertCircle, Plus, Camera, History } from 'lucide-react';
import toast from 'react-hot-toast';

export default function DeliveryVehicle() {
  const [vehicle, setVehicle] = useState({
    type: 'Electric Scooter',
    number: 'PY-02-AK-9842',
    status: 'Verified',
    documents: [
      { name: 'RC Book', expiry: '2028-12-31', status: 'Active' },
      { name: 'Insurance', expiry: '2024-11-15', status: 'Active' },
      { name: 'Pollution', expiry: '2024-05-20', status: 'Expiring Soon' },
    ]
  });

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="font-syne font-black text-4xl text-navy italic tracking-tighter uppercase">Vehicle</h1>
          <p className="text-xs font-dm font-bold text-navy/40 uppercase tracking-widest mt-1 italic">Manage your registered vehicle</p>
        </div>
        <button className="h-14 px-8 bg-navy text-brand-teal rounded-[2rem] font-syne font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:scale-105 transition-all shadow-xl shadow-navy/20">
           <Plus size={18} /> Update Vehicle
        </button>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Main Asset Card */}
        <div className="lg:col-span-7 bg-white p-12 rounded-[4rem] border border-gray-100 shadow-sm space-y-12">
           <div className="flex items-center gap-8">
              <div className="h-24 w-24 bg-navy rounded-3xl flex items-center justify-center text-brand-teal shadow-2xl">
                 <Truck size={48} />
              </div>
              <div className="space-y-2">
                 <h2 className="font-syne font-black text-3xl text-navy uppercase italic">{vehicle.type}</h2>
                 <div className="px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100 w-fit">
                    {vehicle.status}
                 </div>
              </div>
           </div>

           <div className="grid grid-cols-2 gap-8 border-y border-gray-50 py-10">
              <div>
                 <div className="text-[10px] font-black text-navy/20 uppercase tracking-[0.2em] mb-2">Registration No</div>
                 <div className="text-xl font-syne font-black text-navy uppercase italic tracking-widest">{vehicle.number}</div>
              </div>
              <div>
                 <div className="text-[10px] font-black text-navy/20 uppercase tracking-[0.2em] mb-2">Assigned Area</div>
                 <div className="text-xl font-syne font-black text-navy uppercase italic tracking-widest">Karaikal-B1</div>
              </div>
           </div>

           <div className="space-y-6">
              <h3 className="font-syne font-black text-lg text-navy uppercase italic">Vehicle Documents</h3>
              <div className="space-y-4">
                 {vehicle.documents.map((doc) => (
                    <div key={doc.name} className="flex items-center justify-between p-6 bg-gray-50 rounded-3xl group hover:bg-white hover:shadow-xl transition-all">
                       <div className="flex items-center gap-4">
                          <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center text-navy/20 group-hover:text-brand-teal transition-all shadow-sm">
                             <FileText size={20} />
                          </div>
                          <div>
                             <div className="font-dm font-black text-navy text-sm italic">{doc.name}</div>
                             <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest italic">Expires: {doc.expiry}</div>
                          </div>
                       </div>
                       <div className={`px-4 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${
                         doc.status === 'Active' ? 'text-emerald-500 bg-emerald-50' : 'text-amber-500 bg-amber-50'
                       }`}>
                          {doc.status}
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Action Sidebar */}
        <div className="lg:col-span-5 space-y-8">
           <div className="bg-navy p-10 rounded-[3.5rem] text-white space-y-8">
              <div className="space-y-2">
                 <h3 className="font-syne font-black text-xl uppercase italic">Quick Health Check</h3>
                 <p className="text-xs text-white/40 font-dm font-bold uppercase tracking-tight italic">Check your vehicle before starting deliveries.</p>
              </div>
              <div className="space-y-4">
                 {[
                   { label: 'Tire Pressure', status: 'Optimal' },
                   { label: 'Battery Health', status: '94%' },
                   { label: 'Safety Kit', status: 'Present' }
                 ].map(item => (
                   <div key={item.label} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                      <span className="text-[10px] font-black uppercase tracking-widest text-white/60">{item.label}</span>
                      <span className="text-[10px] font-black uppercase tracking-widest text-brand-teal italic">{item.status}</span>
                   </div>
                 ))}
              </div>
              <button className="w-full h-14 bg-brand-teal text-navy rounded-2xl font-syne font-black text-[10px] uppercase tracking-widest hover:bg-white transition-all shadow-2xl">
                 Start Check
              </button>
           </div>

           <div className="bg-white p-10 rounded-[3.5rem] border border-gray-100 shadow-sm space-y-6">
              <div className="flex items-center gap-3 text-navy">
                 <History size={20} className="text-brand-teal" />
                 <h3 className="font-syne font-black text-lg uppercase italic tracking-tighter">Issue History</h3>
              </div>
              <div className="flex flex-col items-center justify-center py-10 text-center space-y-4">
                 <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-200">
                    <ShieldCheck size={32} />
                 </div>
                 <p className="text-[10px] font-black text-navy/20 uppercase tracking-widest italic">No incidents recorded in the last 90 days.</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
