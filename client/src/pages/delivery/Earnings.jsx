import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, Calendar, ArrowUpRight, 
  ArrowDownRight, CreditCard, Smartphone, 
  Clock, IndianRupee, ShieldCheck, ChevronRight
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { Button } from '../../components/common/Core';

const EARNINGS_HISTORY = [
  { day: 'Mon', amount: 480 },
  { day: 'Tue', amount: 590 },
  { day: 'Wed', amount: 640 },
  { day: 'Thu', amount: 720 },
  { day: 'Fri', amount: 510 },
  { day: 'Sat', amount: 840 },
  { day: 'Sun', amount: 640 }
];

export default function DeliveryEarnings() {
  const [balance, setBalance] = useState(12800);

  return (
    <div className="bg-white min-h-screen pb-20 pt-24 px-8">
       <div className="max-w-7xl mx-auto space-y-16">
          
          {/* Header & Wallet Node */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-12">
             <div className="space-y-4">
                <div className="text-[10px] font-black text-[#028090] uppercase tracking-[0.4em] italic mb-6">Financial Architecture Enclave</div>
                <h1 className="font-syne font-black text-6xl text-[#0a1628] leading-tight tracking-tighter">Earnings <br /> <span className="text-[#028090]">Sync.</span></h1>
                <p className="text-gray-400 font-dm text-xl italic leading-relaxed">Daily yield analysis for Karaikal district logistics fulfillment.</p>
             </div>

             <div className="bg-[#0a1628] p-12 rounded-[5rem] text-white shadow-4xl relative overflow-hidden group w-full max-w-lg">
                <div className="absolute top-0 right-0 h-48 w-48 bg-[#02C39A] rounded-full blur-[100px] opacity-[0.15]" />
                <div className="relative z-10 space-y-10">
                   <div className="flex items-center justify-between">
                      <div className="text-[10px] text-white/30 font-black uppercase tracking-widest">Available Balance</div>
                      <ShieldCheck className="text-[#02C39A] animate-pulse" />
                   </div>
                   <div className="space-y-2">
                      <div className="text-6xl font-syne font-black text-[#02C39A]">₹{balance.toLocaleString()}</div>
                      <div className="text-[10px] text-white/30 font-black uppercase tracking-widest">+₹640 earned today in Karaikal</div>
                   </div>
                   <Button className="w-full h-18 text-lg" icon={<Smartphone size={20}/>}>Withdraw to Bank via UPI</Button>
                </div>
             </div>
          </div>

          {/* Stats Breakdown */}
          <div className="grid md:grid-cols-3 gap-8">
             {[
               { label: 'Base Fare Today', val: '₹240', sub: '₹30 x 8 base units' },
               { label: 'Distance Protocol', val: '₹310', sub: '₹5/km x 62 total km' },
               { label: 'Peak Performance', val: '₹90', sub: 'Night owl + Lunch sprint' }
             ].map(stat => (
               <div key={stat.label} className="p-10 bg-gray-50 rounded-[3.5rem] border border-gray-100 hover:bg-white hover:shadow-3xl transition duration-500 group">
                  <div className="text-[10px] text-gray-300 font-black uppercase tracking-[0.2em] mb-4">{stat.label}</div>
                  <div className="text-4xl font-syne font-black text-[#0a1628] mb-2 group-hover:scale-105 transition">{stat.val}</div>
                  <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest italic">{stat.sub}</div>
               </div>
             ))}
          </div>

          {/* Chart Section */}
          <div className="bg-white p-12 rounded-[4.5rem] border border-gray-100 shadow-sm space-y-12">
             <div className="flex items-center justify-between">
                <h2 className="font-syne font-black text-3xl text-[#0a1628] uppercase tracking-tighter">Yield Breakdown Chart</h2>
                <div className="flex gap-4">
                   {['Today', 'This Week', 'Monthly Enclave'].map((tab, i) => (
                      <button key={tab} className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition duration-500 ${i === 1 ? 'bg-[#0a1628] text-white shadow-2xl' : 'text-gray-300 hover:text-[#028090]'}`}>{tab}</button>
                   ))}
                </div>
             </div>
             
             <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%" minHeight={400}>
                   <AreaChart data={EARNINGS_HISTORY}>
                      <defs>
                         <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#02C39A" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="#02C39A" stopOpacity={0}/>
                         </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#cbd5e1' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#cbd5e1' }} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '2rem', border: 'none', background: '#0a1628', color: '#fff', padding: '1.5rem', boxShadow: '0 20px 50px rgba(0,0,0,0.2)' }}
                        itemStyle={{ color: '#02C39A', fontWeight: 900 }}
                      />
                      <Area type="monotone" dataKey="amount" stroke="#02C39A" strokeWidth={5} fillOpacity={1} fill="url(#colorAmount)" />
                   </AreaChart>
                </ResponsiveContainer>
             </div>
          </div>

          {/* Recent Yield History */}
          <div className="bg-white rounded-[4.5rem] border border-gray-100 shadow-sm overflow-hidden">
             <div className="p-12 border-b border-gray-50 flex items-center justify-between">
                <h2 className="font-syne font-black text-2xl text-[#0a1628] uppercase tracking-tighter">Historical Yield Architecture</h2>
                <Calendar size={24} className="text-gray-300" />
             </div>
             <div className="overflow-x-auto">
                <table className="w-full text-left">
                   <thead>
                      <tr className="bg-gray-50/50">
                         <th className="px-12 py-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">Yield Point</th>
                         <th className="px-8 py-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">Base Protocol</th>
                         <th className="px-8 py-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">Logistic Distance</th>
                         <th className="px-8 py-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">Final Amount</th>
                         <th className="px-8 py-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">Sync Hash</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-50">
                      {[
                        { id: '#MED-0124', base: '₹30', dist: '1.2km (₹6)', total: '₹36', hash: '8x4f...9k' },
                        { id: '#MED-0123', base: '₹30', dist: '4.5km (₹22)', total: '₹52', hash: '3m9u...2p' },
                        { id: '#MED-0122', base: '₹30', dist: '2.8km (₹14)', total: '₹44', hash: '7v1w...5n' }
                      ].map(item => (
                         <tr key={item.id} className="hover:bg-gray-50/50 transition">
                            <td className="px-12 py-8 font-syne font-black text-[#0a1628]">{item.id}</td>
                            <td className="px-8 py-8 text-sm font-dm font-bold text-gray-500">{item.base}</td>
                            <td className="px-8 py-8 text-sm font-dm font-bold text-[#028090]">{item.dist}</td>
                            <td className="px-8 py-8 font-syne font-black text-[#02C39A]">₹{item.total}</td>
                            <td className="px-8 py-8">
                               <div className="px-4 py-2 bg-gray-50 rounded-xl text-[8px] font-black text-gray-300 uppercase tracking-widest inline-block border border-gray-100">{item.hash}</div>
                            </td>
                         </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          </div>

       </div>
    </div>
  );
}
