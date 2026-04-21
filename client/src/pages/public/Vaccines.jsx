import { useState } from 'react';
import { ShieldCheck, ChevronDown, Calendar, MapPin, Clock, CheckCircle2, Zap, XCircle, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const vaccineData = [
  { 
    name: 'COVID Booster', price: 500,
    availability: { 'ph-1': 20, 'ph-2': 15, 'ph-7': 8, 'ph-8': 30 },
    info: 'Enhances immunity against COVID-19 variants after primary doses.',
    schedule: 'Every 6-9 months',
    for: 'Adults 18+'
  },
  { 
    name: 'Hepatitis B', price: 200,
    availability: { 'ph-1': 8, 'ph-2': 25, 'ph-7': 12, 'ph-8': 20 },
    info: 'Prevents Hepatitis B virus infection which affects the liver.',
    schedule: '0, 1, and 6 months',
    for: 'All age groups'
  },
  { 
    name: 'Typhoid Vi', price: 250,
    availability: { 'ph-1': 15, 'ph-2': 18, 'ph-7': 10, 'ph-8': 22 },
    info: 'Protection against Typhoid fever caused by Salmonella Typhi.',
    schedule: 'Single dose with 2-year booster',
    for: 'Travelers and residents'
  },
  { 
    name: 'MMR (Children)', price: 350,
    availability: { 'ph-1': 12, 'ph-2': 8, 'ph-7': 15, 'ph-8': 4 },
    info: 'Triple protection against Measles, Mumps, and Rubella.',
    schedule: '1st: 1yr, 2nd: 4-6yrs',
    for: 'Children below 12'
  },
  { 
    name: 'Flu Vaccine', price: 450,
    availability: { 'ph-1': 0, 'ph-2': 0, 'ph-7': 5, 'ph-8': 0 },
    info: 'Seasonal protection against influenza viruses.',
    schedule: 'Annual dose',
    for: 'High-risk and elderly'
  },
  { 
    name: 'Rabies', price: 350,
    availability: { 'ph-1': 10, 'ph-2': 0, 'ph-7': 8, 'ph-8': 14 },
    info: 'Critical post-exposure prophylaxis for animal bites.',
    schedule: '0, 3, 7, 14, 28 days',
    for: 'Emergency cases'
  }
];

const pharmacies = [
  { id: 'ph-1', name: 'Apollo' },
  { id: 'ph-2', name: 'MedPlus' },
  { id: 'ph-7', name: 'Grace' },
  { id: 'ph-8', name: 'KKL Cen' }
];

export default function VaccinesPage() {
  const [expandedVaccine, setExpandedVaccine] = useState(null);

  const getStatusIcon = (qty) => {
    if (qty > 10) return <div className="flex items-center gap-2 text-emerald-500"><CheckCircle2 size={16}/> <span className="font-syne font-black italic">✓ {qty}</span></div>;
    if (qty > 0) return <div className="flex items-center gap-2 text-amber-500"><Zap size={16}/> <span className="font-syne font-black italic">⚡ {qty}</span></div>;
    return <div className="flex items-center gap-2 text-red-500"><XCircle size={16}/> <span className="font-syne font-black italic">✗ Out</span></div>;
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-48 font-dm overflow-x-hidden">
      {/* Hero Section Protocol */}
      <section className="bg-[#0a1628] pt-32 pb-48 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(2,195,154,0.1),transparent_50%)]" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 bg-brand-teal/5 rounded-full blur-[120px]" />
        
        <div className="max-w-7xl mx-auto px-6 md:px-10 relative z-10 space-y-12">
           <div className="flex items-center gap-4 text-[10px] font-black text-white/40 uppercase tracking-[0.4em] italic mb-8">
              <span>Home</span> <ChevronDown size={14} className="opacity-40 -rotate-90" /> <span>Vaccines</span>
           </div>
           
           <div className="space-y-6">
              <h1 className="font-syne font-black text-4xl md:text-8xl lg:text-9xl text-white leading-[0.85] tracking-tighter uppercase italic drop-shadow-2xl break-words">
                 Vaccine <br/><span className="text-brand-teal text-outline-white">Availability</span>
              </h1>
              <p className="text-white/40 font-dm text-lg md:text-2xl italic max-w-xl leading-relaxed">
                 Check vaccine availability at pharmacies near you in Karaikal. Professional immunization records and tracking.
              </p>
           </div>
        </div>
      </section>

      {/* Vaccination Directory Control Center */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 -mt-20 relative z-20 space-y-16 overflow-x-hidden">
         
         {/* Live Status Table */}
         <div className="bg-white border border-black/[0.03] rounded-[3rem] md:rounded-[4.5rem] p-6 md:p-16 shadow-soft overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
               <div className="flex items-center gap-6">
                  <div className="h-2 w-16 bg-brand-teal rounded-full" />
                  <h2 className="font-syne font-black text-3xl md:text-4xl text-[#0a1628] uppercase italic leading-none">Vaccination Directory</h2>
               </div>
               <div className="bg-emerald-50 text-emerald-500 px-6 py-2 rounded-xl text-[10px] font-black uppercase italic tracking-[0.2em] flex items-center gap-4 border border-emerald-100 self-start">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  Live Inventory Sync
               </div>
            </div>

            <div className="overflow-x-auto no-scrollbar -mx-6 md:mx-0">
               <table className="w-full border-separate border-spacing-y-4 md:border-spacing-y-6 px-6 md:px-0">
                  <thead>
                     <tr className="text-[10px] font-black text-gray-300 uppercase italic tracking-widest text-left">
                        <th className="px-4 md:px-8 pb-4">Vaccine</th>
                        {pharmacies.map(p => <th key={p.id} className="pb-4 text-center">{p.name}</th>)}
                        <th className="pb-4 text-right">District Price</th>
                     </tr>
                  </thead>
                  <tbody>
                     {vaccineData.map((v, i) => (
                        <tr key={i} className="group hover:scale-[1.01] transition-all duration-500">
                           <td className="bg-gray-50/50 border border-black/[0.01] rounded-l-[1.5rem] md:rounded-l-[2rem] px-4 md:px-8 py-6 md:py-10">
                              <div className="flex items-center gap-4 md:gap-6 min-w-0 pr-4">
                                 <div className="h-12 w-12 md:h-16 md:w-16 bg-[#0a1628] rounded-xl md:rounded-2xl flex items-center justify-center text-brand-teal shadow-4xl group-hover:rotate-12 transition-all duration-700 shrink-0">
                                    <ShieldCheck size={24} className="md:size-7"/>
                                 </div>
                                 <div className="flex-1 min-w-0">
                                    <div className="font-syne font-black text-[#0a1628] text-base md:text-2xl uppercase italic tracking-tighter group-hover:text-brand-teal transition-all truncate">{v.name}</div>
                                    <div className="text-[9px] md:text-[10px] font-black text-gray-300 uppercase tracking-widest italic truncate">{v.for}</div>
                                 </div>
                              </div>
                           </td>
                           {pharmacies.map(p => (
                             <td key={p.id} className="bg-gray-50/50 border-y border-black/[0.01] text-center p-4">
                                <div className="flex flex-col items-center gap-2">
                                   {getStatusIcon(v.availability[p.id])}
                                </div>
                             </td>
                           ))}
                           <td className="bg-gray-50/50 border border-black/[0.01] rounded-r-[1.5rem] md:rounded-r-[2rem] px-4 md:px-8 py-6 md:py-10 text-right">
                              <div className="space-y-1">
                                 <div className="font-syne font-black text-[#0a1628] text-xl md:text-2xl italic">₹{v.price}</div>
                                 <button className="h-8 md:h-10 px-4 md:px-6 bg-[#0a1628] text-brand-teal font-syne font-black text-[8px] md:text-[9px] uppercase italic tracking-widest rounded-xl hover:bg-brand-teal hover:text-[#0a1628] transition-all duration-700">
                                    Book
                                 </button>
                              </div>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>

            {/* Protocol Legend */}
            <div className="flex flex-wrap gap-8 md:gap-12 mt-12 pt-12 border-t border-black/[0.03] justify-center lg:justify-start">
               <div className="flex items-center gap-4">
                  <div className="text-emerald-500"><CheckCircle2 size={16}/></div>
                  <span className="text-[10px] font-black text-gray-400 uppercase italic tracking-widest">Available</span>
               </div>
               <div className="flex items-center gap-4">
                  <div className="text-amber-500"><Zap size={16}/></div>
                  <span className="text-[10px] font-black text-gray-400 uppercase italic tracking-widest">Low Stock (⚡)</span>
               </div>
               <div className="flex items-center gap-4">
                  <div className="text-red-500"><XCircle size={16}/></div>
                  <span className="text-[10px] font-black text-gray-400 uppercase italic tracking-widest">Out of Stock (✗)</span>
               </div>
            </div>
         </div>

         {/* Information Section Accordion */}
         <div className="grid lg:grid-cols-2 gap-16">
            <div className="space-y-12">
               <div className="space-y-4">
                  <div className="text-[10px] font-black text-brand-teal uppercase tracking-[0.4em] italic leading-none">Clinical Information</div>
                  <h3 className="font-syne font-black text-4xl md:text-5xl text-[#0a1628] uppercase italic tracking-tighter">Vaccine Protocols</h3>
                  <p className="text-gray-400 font-dm font-bold italic text-lg md:text-xl max-w-xl leading-relaxed">Integrated tracking for immunization schedules and district medical appointments.</p>
               </div>
               
               <div className="space-y-6">
                  {vaccineData.map((v, i) => (
                     <div key={i} className="bg-white border border-black/[0.03] rounded-[2rem] md:rounded-[2.5rem] overflow-hidden group shadow-soft transition-all duration-700 hover:shadow-4xl">
                        <button 
                          onClick={() => setExpandedVaccine(expandedVaccine === i ? null : i)}
                          className="w-full p-6 md:p-10 flex items-center justify-between text-left"
                        >
                           <div className="flex items-center gap-6 min-w-0 flex-1">
                              <div className="h-10 w-10 md:h-14 md:w-14 bg-gray-50 rounded-xl flex items-center justify-center text-[#0a1628] group-hover:bg-brand-teal group-hover:text-white transition-all duration-700 font-syne font-black italic shadow-inner shrink-0">{i+1}</div>
                              <span className="font-syne font-black text-lg md:text-2xl text-[#0a1628] uppercase italic tracking-tight truncate pr-4">{v.name}</span>
                           </div>
                           <div className={`transition-transform duration-700 shrink-0 ${expandedVaccine === i ? 'rotate-180' : ''}`}><ChevronDown /></div>
                        </button>
                        <AnimatePresence>
                           {expandedVaccine === i && (
                              <motion.div 
                                 initial={{ height: 0, opacity: 0 }}
                                 animate={{ height: 'auto', opacity: 1 }}
                                 exit={{ height: 0, opacity: 0 }}
                                 className="overflow-hidden"
                              >
                                 <div className="p-6 md:p-10 pt-0 space-y-8">
                                    <div className="h-px bg-black/[0.03] w-full" />
                                    <div className="grid md:grid-cols-2 gap-8">
                                       <div className="space-y-3">
                                          <div className="text-[9px] font-black text-brand-teal uppercase tracking-widest italic">Clinical Utility</div>
                                          <p className="text-gray-400 text-sm font-dm font-bold italic leading-relaxed">{v.info}</p>
                                       </div>
                                       <div className="space-y-6">
                                          <div className="flex items-center gap-4">
                                             <Activity size={18} className="text-brand-teal" />
                                             <div className="space-y-0.5">
                                                <div className="text-[9px] font-black text-gray-300 uppercase italic">Schedule</div>
                                                <div className="font-syne font-black text-[#0a1628] text-xs uppercase italic">{v.schedule}</div>
                                             </div>
                                          </div>
                                          <div className="flex items-center gap-4">
                                             <ShieldCheck size={18} className="text-brand-teal" />
                                             <div className="space-y-0.5">
                                                <div className="text-[9px] font-black text-gray-300 uppercase italic">Target Groups</div>
                                                <div className="font-syne font-black text-[#0a1628] text-xs uppercase italic">{v.for}</div>
                                             </div>
                                          </div>
                                       </div>
                                    </div>
                                    <button className="w-full h-16 bg-[#0a1628] text-brand-teal font-syne font-black text-[10px] uppercase italic tracking-[0.3em] rounded-2xl flex items-center justify-center gap-4 hover:bg-brand-teal hover:text-[#0a1628] transition-all duration-700 shadow-4xl group">
                                       Schedule Appointment <Zap size={18} className="group-hover:rotate-12 transition-all"/>
                                    </button>
                                 </div>
                              </motion.div>
                           )}
                        </AnimatePresence>
                     </div>
                  ))}
               </div>
            </div>

            {/* Quick Action Clinical Hub */}
            <div className="space-y-12">
               <div className="bg-[#0a1628] rounded-[3rem] md:rounded-[5rem] p-10 md:p-16 text-white space-y-12 relative overflow-hidden group shadow-4xl border-t-[16px] border-brand-teal lg:sticky lg:top-32">
                  <div className="absolute top-0 right-0 h-40 w-40 bg-brand-teal opacity-10 rounded-full blur-[80px]" />
                  
                  <div className="space-y-6 relative z-10 text-center lg:text-left">
                     <div className="h-16 w-16 md:h-20 md:w-20 bg-white/5 backdrop-blur-3xl rounded-3xl flex items-center justify-center text-brand-teal shadow-2xl mx-auto lg:mx-0 group-hover:rotate-12 transition-all duration-1000"><Calendar size={32}/></div>
                     <h3 className="font-syne font-black text-3xl md:text-5xl uppercase italic tracking-tighter leading-none">Vaccine <br/>Scheduling</h3>
                     <p className="text-white/40 font-dm font-bold italic text-lg leading-relaxed">Book vaccine time slots at certified medical facilities near you. Secure verification provided.</p>
                  </div>

                  <div className="space-y-8 relative z-10">
                     <div className="flex flex-col gap-6">
                        <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] italic mb-2 px-2">Appointment Details</div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           <div className="h-16 bg-white/5 rounded-xl flex items-center px-6 gap-4 border border-white/5 text-xs font-black italic text-brand-teal uppercase tracking-widest"><MapPin size={16}/> Karaikal Hub</div>
                           <div className="h-16 bg-white/5 rounded-xl flex items-center px-6 gap-4 border border-white/5 text-xs font-black italic text-brand-teal uppercase tracking-widest"><Clock size={16}/> Next 48H</div>
                        </div>
                     </div>
                     <button className="w-full h-20 md:h-24 bg-brand-teal text-[#0a1628] font-syne font-black text-xs uppercase italic tracking-[0.3em] md:tracking-[0.5em] rounded-[2.5rem] md:rounded-[3rem] shadow-mint hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-6">
                        Confirm Appointment <Activity size={24} className="animate-pulse" />
                     </button>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
