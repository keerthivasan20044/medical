import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { TrendingUp, Users, ShoppingBag, Target, Activity, Calendar } from 'lucide-react';

const REVENUE_DATA = [
  { day: 'Mon', current: 4000, previous: 2400 },
  { day: 'Tue', current: 3000, previous: 1398 },
  { day: 'Wed', current: 2000, previous: 9800 },
  { day: 'Thu', current: 2780, previous: 3908 },
  { day: 'Fri', current: 1890, previous: 4800 },
  { day: 'Sat', current: 2390, previous: 3800 },
  { day: 'Sun', current: 3490, previous: 4300 },
];

const CATEGORY_DATA = [
  { name: 'Pain Relief', value: 400 },
  { name: 'Antibiotics', value: 300 },
  { name: 'Diabetes', value: 300 },
  { name: 'Cardiac', value: 200 },
];

const COLORS = ['#02C39A', '#028090', '#0a1628', '#8da8b8'];

export default function AdminAnalytics() {
  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="font-syne font-black text-4xl text-navy italic tracking-tighter uppercase">Intelligence Unit</h1>
          <p className="text-xs font-dm font-bold text-navy/40 uppercase tracking-widest mt-1 italic">Analytical Performance Matrices</p>
        </div>
        <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-gray-100">
           <Calendar size={18} className="text-navy/40 ml-2" />
           <select className="bg-transparent border-none outline-none font-syne font-black text-[10px] uppercase tracking-widest text-navy px-2 cursor-pointer">
              <option>Last 30 Days</option>
              <option>Last Quarter</option>
              <option>Year to Date</option>
           </select>
        </div>
      </div>

      {/* Primary Analytics Grid */}
      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-white p-10 rounded-[3.5rem] border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-navy rounded-2xl flex items-center justify-center text-brand-teal">
                <TrendingUp size={24} />
              </div>
              <div>
                <h3 className="font-syne font-black text-xl text-navy uppercase italic">Performance Convergence</h3>
                <p className="text-[10px] font-black text-navy/40 uppercase tracking-widest">Growth vs Previous Period</p>
              </div>
            </div>
          </div>
          
          <div className="h-[400px]">
             <ResponsiveContainer width="100%" height="100%">
                <LineChart data={REVENUE_DATA}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                  <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)' }} />
                  <Line type="monotone" dataKey="current" stroke="#02C39A" strokeWidth={4} dot={{ fill: '#02C39A', strokeWidth: 2, r: 4 }} activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="previous" stroke="#0a1628" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                </LineChart>
             </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-4 bg-white p-10 rounded-[3.5rem] border border-gray-100 shadow-sm flex flex-col">
          <h3 className="font-syne font-black text-xl text-navy uppercase italic mb-8">Niche Distribution</h3>
          <div className="flex-1 h-[300px]">
             <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={CATEGORY_DATA}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {CATEGORY_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
             </ResponsiveContainer>
          </div>
          <div className="space-y-3 pt-6 border-t border-gray-50">
             {CATEGORY_DATA.map((item, idx) => (
               <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                     <div className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[idx] }} />
                     <span className="text-[10px] font-black text-navy/60 uppercase tracking-widest italic">{item.name}</span>
                  </div>
                  <span className="font-syne font-black text-navy text-xs">{item.value} units</span>
               </div>
             ))}
          </div>
        </div>
      </div>

      {/* Secondary Metrics */}
      <div className="grid md:grid-cols-3 gap-8">
         <div className="bg-navy p-8 rounded-[2.5rem] text-white flex items-center justify-between">
            <div>
               <p className="text-[10px] font-black text-brand-teal uppercase tracking-widest italic mb-2">User Retention</p>
               <h4 className="text-3xl font-syne font-black italic tracking-tighter">84.2%</h4>
            </div>
            <div className="h-16 w-16 bg-white/10 rounded-2xl flex items-center justify-center">
               <Users size={28} className="text-brand-teal" />
            </div>
         </div>
         <div className="bg-brand-teal p-8 rounded-[2.5rem] text-navy flex items-center justify-between">
            <div>
               <p className="text-[10px] font-black text-navy/40 uppercase tracking-widest italic mb-2">Order Conversion</p>
               <h4 className="text-3xl font-syne font-black italic tracking-tighter">12.5%</h4>
            </div>
            <div className="h-16 w-16 bg-navy/10 rounded-2xl flex items-center justify-center">
               <Target size={28} className="text-navy" />
            </div>
         </div>
         <div className="bg-white border border-gray-100 p-8 rounded-[2.5rem] text-navy flex items-center justify-between shadow-sm">
            <div>
               <p className="text-[10px] font-black text-navy/40 uppercase tracking-widest italic mb-2">Active Sessions</p>
               <h4 className="text-3xl font-syne font-black italic tracking-tighter">1,248</h4>
            </div>
            <div className="h-16 w-16 bg-navy/5 rounded-2xl flex items-center justify-center">
               <Activity size={28} className="text-navy/20" />
            </div>
         </div>
      </div>
    </div>
  );
}
