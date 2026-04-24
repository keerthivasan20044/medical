import { MapPin, Phone, Mail, Clock, ShieldCheck, Calendar, Info, Globe } from 'lucide-react';

export default function PharmacyAbout({ pharmacy }) {
  const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div className="grid lg:grid-cols-12 gap-12">
      {/* Left: General Info */}
      <div className="lg:col-span-7 space-y-12">
        <section className="space-y-6">
           <h3 className="font-syne font-black text-2xl text-navy uppercase italic flex items-center gap-3">
              <Info size={24} className="text-brand-teal" /> Node Description
           </h3>
           <p className="text-sm font-dm font-bold text-navy/60 italic leading-relaxed">
             {pharmacy.description || `${pharmacy.name} is a premier medical node providing verified healthcare fulfillment and priority pharmaceutical distribution in the ${pharmacy.city} region. Engineered for maximum integrity and rapid local synchronization.`}
           </p>
        </section>

        <section className="space-y-8">
           <h3 className="font-syne font-black text-2xl text-navy uppercase italic flex items-center gap-3">
              <ShieldCheck size={24} className="text-brand-teal" /> Operational Services
           </h3>
           <div className="grid md:grid-cols-2 gap-4">
              {pharmacy.services?.map(service => (
                <div key={service} className="p-6 bg-gray-50 border border-gray-100 rounded-3xl flex items-center gap-4 group hover:border-brand-teal transition-all">
                   <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center text-navy/20 group-hover:text-brand-teal transition-all">
                      <ShieldCheck size={20} />
                   </div>
                   <span className="text-[10px] font-black text-navy uppercase tracking-widest italic">{service}</span>
                </div>
              ))}
           </div>
        </section>

        <section className="space-y-6">
           <h3 className="font-syne font-black text-2xl text-navy uppercase italic flex items-center gap-3">
              <MapPin size={24} className="text-brand-teal" /> Territorial Identity
           </h3>
           <div className="bg-navy p-8 rounded-[3rem] text-white flex flex-col md:flex-row gap-8 items-center">
              <div className="h-40 w-full md:w-48 bg-white/5 rounded-3xl overflow-hidden relative">
                 {/* Map Placeholder */}
                 <div className="absolute inset-0 flex items-center justify-center text-[10px] font-black uppercase tracking-widest opacity-20">
                    Map Sync Pending
                 </div>
              </div>
              <div className="flex-1 space-y-4">
                 <div>
                    <div className="text-[10px] font-black text-brand-teal uppercase tracking-widest italic mb-1">Global Address</div>
                    <div className="text-sm font-dm font-bold italic">{pharmacy.address}</div>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                       <div className="text-[10px] font-black text-white/20 uppercase tracking-widest italic mb-1">City</div>
                       <div className="text-sm font-dm font-bold italic">{pharmacy.city}</div>
                    </div>
                    <div>
                       <div className="text-[10px] font-black text-white/20 uppercase tracking-widest italic mb-1">Zip</div>
                       <div className="text-sm font-dm font-bold italic">{pharmacy.pincode || '609602'}</div>
                    </div>
                 </div>
              </div>
           </div>
        </section>
      </div>

      {/* Right: Operating Hours & Quick Stats */}
      <div className="lg:col-span-5 space-y-8">
        <div className="bg-white p-10 rounded-[3.5rem] border border-gray-100 shadow-sm space-y-8">
           <h3 className="font-syne font-black text-xl text-navy uppercase italic flex items-center gap-3">
              <Clock size={24} className="text-brand-teal" /> Sync Windows
           </h3>
           <div className="space-y-4">
              {DAYS.map(day => {
                const dayInfo = pharmacy.hours?.find(h => h.day === day);
                return (
                  <div key={day} className="flex items-center justify-between py-1 border-b border-gray-50 last:border-0">
                     <span className="text-[10px] font-black text-navy/40 uppercase tracking-widest italic">{day}</span>
                     <span className={`text-[10px] font-black uppercase tracking-widest italic ${dayInfo?.closed ? 'text-red-500' : 'text-navy'}`}>
                        {dayInfo?.closed ? 'Closed' : `${dayInfo?.open || '09:00'} - ${dayInfo?.close || '21:00'}`}
                     </span>
                  </div>
                );
              })}
           </div>
        </div>

        <div className="bg-gray-50 p-10 rounded-[3.5rem] border border-gray-100 space-y-8">
           <h3 className="font-syne font-black text-xl text-navy uppercase italic">Node Registry</h3>
           <div className="space-y-6">
              <div className="flex items-center gap-4">
                 <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center text-navy/20">
                    <Calendar size={18} />
                 </div>
                 <div>
                    <div className="text-[9px] font-black text-navy/20 uppercase tracking-widest italic leading-none">Established</div>
                    <div className="text-xs font-dm font-bold text-navy italic">2018 (6 years operational)</div>
                 </div>
              </div>
              <div className="flex items-center gap-4">
                 <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center text-navy/20">
                    <Globe size={18} />
                 </div>
                 <div>
                    <div className="text-[9px] font-black text-navy/20 uppercase tracking-widest italic leading-none">Global Registry</div>
                    <div className="text-xs font-dm font-bold text-navy italic">LIC: {pharmacy.licenseNumber || 'PY-482910-A'}</div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
