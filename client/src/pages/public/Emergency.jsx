import { Phone, MapPin, Clock, Activity, AlertCircle, ShoppingCart, Zap, ShieldCheck, HeartPulse, Pill, Search, XCircle, Info, ChevronRight, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const emergencyPharmacies = [
  {
    id: 'ph-8',
    name: 'Karaikal Central Pharmacy',
    status: 'OPEN NOW 24/7',
    address: 'Market Road, Karaikal',
    phone: '+91 94432 88888',
    eta: '15-20 min',
    image: '/assets/hospital_pro.png',
    type: 'PRIMARY NODE'
  },
  {
    id: 'ph-3',
    name: 'Sri Murugan Medical',
    status: 'OPEN TILL 11PM + EMERGENCY',
    address: 'Near Bus Stand, Karaikal',
    phone: '+91 94432 33333',
    eta: '20-25 min',
    image: '/assets/hospital_pro.png',
    type: 'SECONDARY NODE'
  }
];

const emergencyContacts = [
  { name: 'Ambulance Protocol', phone: '108', sub: 'Free Dispatch Node', icon: HeartPulse, color: 'text-red-500' },
  { name: 'Govt. General Hospital', phone: '04368-222288', sub: 'Karaikal Hub', icon: ShieldCheck, color: 'text-brand-teal' },
  { name: 'JIPMER Karaikal', phone: '04368-220500', sub: 'Tertiary Care Node', icon: ShieldCheck, color: 'text-blue-500' },
  { name: 'Dr. Priya Raman', phone: '+91 94432 12345', sub: 'Emergency Consultant', icon: User, color: 'text-amber-500' }
];

const kits = [
  { name: 'Fever Pulse Kit', meds: 'Paracetamol + ORS + Electrolytes', icon: Zap, price: 150 },
  { name: 'Respiratory Node', meds: 'Cetirizine + Vitamin C + Cough syrup', icon: Activity, price: 280 },
  { name: 'Diabetes Emergency', meds: 'ORS + Glucose tablets + Dextrose', icon: HeartPulse, price: 120 },
  { name: 'Trauma First Aid', meds: 'Bandage + Antiseptic + Paracetamol', icon: ShieldCheck, price: 220 }
];

export default function EmergencyPage() {
  return (
    <div className="bg-[#f8fafc] min-h-screen pb-48 font-dm">
      {/* Emergency Red Hero Terminal */}
      <section className="bg-red-600 pt-32 pb-48 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.1),transparent_50%)]" />
        <div className="absolute top-0 right-0 h-full w-1/3 bg-white/5 blur-[120px]" />
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:40px_40px]" />
        
        <div className="max-w-7xl mx-auto px-10 relative z-10 space-y-12 text-center lg:text-left">
           <div className="flex items-center justify-center lg:justify-start gap-6">
              <div className="h-16 w-16 bg-white rounded-2xl flex items-center justify-center text-red-600 shadow-4xl animate-bounce"><AlertCircle size={32}/></div>
              <div className="text-[10px] font-black text-white/40 uppercase tracking-[0.5em] italic">District Emergency Protocol</div>
           </div>
           
           <div className="space-y-6">
              <h1 className="font-syne font-black text-6xl lg:text-[10rem] text-white leading-[0.85] tracking-tighter uppercase italic drop-shadow-2xl">
                 Emergency <br/><span className="text-white/40 text-outline-red">Medicine Hub</span>
              </h1>
              <p className="text-white font-dm text-2xl italic max-w-2xl leading-relaxed mx-auto lg:mx-0">
                 Need medication urgently? Initializing district-wide search for 24-hour surgical nodes across the Karaikal medical surgical grid.
              </p>
           </div>
        </div>
      </section>

      {/* Emergency Grid console */}
      <div className="max-w-7xl mx-auto px-10 -mt-24 relative z-20 space-y-20">
         
         <div className="grid lg:grid-cols-12 gap-16">
            
            {/* Left: 24/7 Node Registry */}
            <div className="lg:col-span-8 space-y-12">
               <div className="bg-white border border-red-100 rounded-[4.5rem] p-12 lg:p-16 shadow-soft space-y-12 relative overflow-hidden">
                  <div className="absolute top-0 right-0 h-40 w-40 bg-red-500 opacity-[0.02] rounded-full blur-[80px]" />
                  <h3 className="font-syne font-black text-4xl text-[#0a1628] uppercase italic leading-none flex items-center gap-6">
                     <div className="h-2 w-16 bg-red-600 rounded-full" /> 24-Hour Active Nodes
                  </h3>
                  
                  <div className="grid md:grid-cols-2 gap-12">
                     {emergencyPharmacies.map((p, idx) => (
                        <motion.div 
                          key={p.id}
                          initial={{ opacity: 0, y: 30 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="bg-gray-50/50 border border-red-50 gap-10 p-10 rounded-[4rem] group hover:bg-white hover:shadow-4xl transition-all duration-700 relative overflow-hidden flex flex-col justify-between h-[500px]"
                        >
                           <div className="h-40 w-full rounded-[2.5rem] overflow-hidden group-hover:grayscale-0 grayscale-[0.5] transition-all duration-1000 mb-8"><img src={p.image} className="h-full w-full object-cover" /></div>
                           <div className="space-y-6">
                              <div className="space-y-2">
                                 <div className="text-[10px] font-black text-red-600 uppercase tracking-widest italic">{p.status}</div>
                                 <h4 className="font-syne font-black text-3xl text-[#0a1628] uppercase italic leading-none truncate">{p.name}</h4>
                                 <div className="flex items-center gap-2 text-gray-400 font-dm font-bold italic text-xs"><MapPin size={12}/> {p.address}</div>
                              </div>
                              <div className="flex items-center gap-4 py-6 border-y border-black/[0.03]">
                                 <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center text-red-600 shadow-soft animate-pulse"><Clock size={18}/></div>
                                 <div className="text-[10px] font-black text-[#0a1628] uppercase italic tracking-widest leading-none">ETA: {p.eta} Delivery Node</div>
                              </div>
                           </div>
                           <div className="grid grid-cols-2 gap-4">
                              <a href={`tel:${p.phone}`} className="h-16 bg-[#0a1628] text-white font-syne font-black text-[9px] uppercase italic tracking-widest rounded-2xl flex items-center justify-center gap-3 shadow-4xl hover:bg-red-600 transition-all"><Phone size={16}/> Direct Uplink</a>
                              <button className="h-16 bg-red-600 text-white font-syne font-black text-[9px] uppercase italic tracking-widest rounded-2xl shadow-4xl flex items-center justify-center shadow-red-200/50">Order Pulse</button>
                           </div>
                        </motion.div>
                     ))}
                  </div>
               </div>

               {/* Quick Kits Terminal */}
               <div className="bg-white border border-black/[0.03] rounded-[4.5rem] p-12 lg:p-16 shadow-soft space-y-12 relative overflow-hidden">
                  <h3 className="font-syne font-black text-4xl text-[#0a1628] uppercase italic leading-none flex items-center gap-6">
                     <div className="h-2 w-16 bg-amber-500 rounded-full" /> Quick Response Payloads
                  </h3>
                  <div className="grid md:grid-cols-2 gap-10">
                     {kits.map((kit, i) => (
                        <div key={i} className="bg-gray-50/50 border border-black/[0.01] p-10 rounded-[3rem] group hover:bg-white hover:shadow-soft transition-all duration-700 flex items-center justify-between">
                           <div className="flex items-center gap-6">
                              <div className="h-16 w-16 bg-white rounded-2xl flex items-center justify-center text-[#0a1628] group-hover:bg-amber-500 group-hover:text-white transition-all duration-700 shadow-inner"><kit.icon size={28}/></div>
                              <div className="space-y-1">
                                 <h4 className="font-syne font-black text-xl text-[#0a1628] uppercase italic leading-none">{kit.name}</h4>
                                 <p className="text-[10px] font-bold text-gray-400 italic leading-none">{kit.meds}</p>
                              </div>
                           </div>
                           <button className="h-12 w-12 bg-white rounded-xl flex items-center justify-center text-[#0a1628] shadow-soft hover:bg-[#0a1628] hover:text-white transition-all"><ShoppingCart size={20}/></button>
                        </div>
                     ))}
                  </div>
               </div>
            </div>

            {/* Right: Emergency Contacts Matrix */}
            <div className="lg:col-span-4 space-y-10">
               <div className="bg-[#0a1628] rounded-[4.5rem] p-12 text-white space-y-10 shadow-4xl relative overflow-hidden group sticky top-32">
                  {/* Pulse Telemetry Visualization */}
                  <div className="absolute top-0 right-0 h-64 w-64 bg-red-600 opacity-10 rounded-full blur-[80px]" />
                  <div className="space-y-6 relative z-10">
                     <div className="h-16 w-16 bg-red-600 rounded-2xl flex items-center justify-center animate-pulse shadow-4xl"><Activity size={32}/></div>
                     <h3 className="font-syne font-black text-4xl uppercase italic tracking-tighter leading-none text-white">Universal Uplink</h3>
                     <p className="text-white/40 font-dm font-bold italic text-xl leading-relaxed">Direct district-wide emergency handoff terminal.</p>
                  </div>

                  <div className="space-y-6 relative z-10 border-t border-white/5 pt-10">
                     {emergencyContacts.map((c, i) => (
                        <a key={i} href={`tel:${c.phone}`} className="flex items-center justify-between p-6 bg-white/5 rounded-[2rem] border border-white/5 hover:bg-white/10 transition-all duration-500 group">
                           <div className="flex items-center gap-6">
                              <div className={`h-12 w-12 bg-white/5 rounded-xl flex items-center justify-center ${c.color}`}><c.icon size={24}/></div>
                              <div>
                                 <div className="font-syne font-black text-lg text-white uppercase italic">{c.name}</div>
                                 <div className="text-[9px] font-bold text-white/20 uppercase tracking-widest">{c.sub}</div>
                              </div>
                           </div>
                           <div className="h-10 w-10 bg-white/10 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"><ChevronRight size={20}/></div>
                        </a>
                     ))}
                  </div>

                  <button className="w-full h-20 bg-red-600 text-white font-syne font-black text-[10px] uppercase italic tracking-[0.4em] rounded-[2.5rem] shadow-4xl hover:scale-[1.05] active:scale-95 transition-all flex items-center justify-center gap-6 relative z-10">
                     Broadcast Payload <Zap size={20}/>
                  </button>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
