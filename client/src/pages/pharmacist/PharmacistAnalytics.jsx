import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { Target, TrendingUp, Users, ShoppingBag, Zap, Clock } from 'lucide-react';

const TOP_MEDS = [
  { name: 'Paracetamol', sales: 450 },
  { name: 'Novamox', sales: 380 },
  { name: 'Glycomet', sales: 310 },
  { name: 'Claritin', sales: 240 },
  { name: 'Vicks', sales: 180 },
];

const PEAK_HOURS = [
  { hour: '9AM', orders: 12 }, { hour: '11AM', orders: 45 },
  { hour: '1PM', orders: 28 }, { hour: '3PM', orders: 35 },
  { hour: '5PM', orders: 62 }, { hour: '7PM', orders: 78 },
  { hour: '9PM', orders: 42 },
];

export default function PharmacistAnalytics() {
  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="font-syne font-black text-4xl text-navy italic tracking-tighter uppercase">Market Intelligence</h1>
          <p className="text-xs font-dm font-bold text-navy/40 uppercase tracking-widest mt-1 italic">Node-level Consumer Behavioral Data</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 bg-white p-10 rounded-[3.5rem] border border-gray-100 shadow-sm">
           <div className="flex items-center justify-between mb-10">
              <h3 className="font-syne font-black text-xl text-navy uppercase italic">Top Resource Velocity</h3>
              <Zap size={18} className="text-brand-teal animate-pulse" />
           </div>
           <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={TOP_MEDS} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontStyle: 'italic', fontWeight: 'bold' }} width={80} />
                    <Tooltip contentStyle={{ borderRadius: '20px', border: 'none' }} />
                    <Bar dataKey="sales" fill="#02C39A" radius={[0, 20, 20, 0]} />
                 </BarChart>
              </ResponsiveContainer>
           </div>
        </div>

        <div className="lg:col-span-5 bg-white p-10 rounded-[3.5rem] border border-gray-100 shadow-sm">
           <div className="flex items-center justify-between mb-10">
              <h3 className="font-syne font-black text-xl text-navy uppercase italic">Temporal Order Spikes</h3>
              <Clock size={18} className="text-navy/20" />
           </div>
           <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                 <LineChart data={PEAK_HOURS}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                    <YAxis hide />
                    <Tooltip contentStyle={{ borderRadius: '20px', border: 'none' }} />
                    <Line type="stepAfter" dataKey="orders" stroke="#0a1628" strokeWidth={3} dot={{ fill: '#0a1628', r: 4 }} />
                 </LineChart>
              </ResponsiveContainer>
           </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
         <div className="bg-navy p-8 rounded-[2.5rem] text-white flex items-center justify-between group overflow-hidden relative">
            <div className="absolute top-0 right-0 h-24 w-24 bg-brand-teal/20 rounded-full blur-[40px]" />
            <div>
               <p className="text-[10px] font-black text-brand-teal uppercase tracking-widest italic mb-2">Repeat Rate</p>
               <h4 className="text-3xl font-syne font-black italic tracking-tighter">68%</h4>
            </div>
            <Users size={32} className="text-white/20 group-hover:text-brand-teal transition-colors" />
         </div>
         
         <div className="bg-white border border-gray-100 p-8 rounded-[2.5rem] text-navy flex items-center justify-between group overflow-hidden relative shadow-sm">
            <div>
               <p className="text-[10px] font-black text-navy/40 uppercase tracking-widest italic mb-2">Avg. Basket Value</p>
               <h4 className="text-3xl font-syne font-black italic tracking-tighter">₹842</h4>
            </div>
            <ShoppingBag size={32} className="text-navy/10 group-hover:text-brand-teal transition-colors" />
         </div>

         <div className="bg-brand-teal p-8 rounded-[2.5rem] text-navy flex items-center justify-between group overflow-hidden relative shadow-lg">
            <div>
               <p className="text-[10px] font-black text-navy/40 uppercase tracking-widest italic mb-2">Service Velocity</p>
               <h4 className="text-3xl font-syne font-black italic tracking-tighter">FAST</h4>
            </div>
            <TrendingUp size={32} className="text-navy/20 group-hover:text-navy transition-colors" />
         </div>
      </div>
    </div>
  );
}
