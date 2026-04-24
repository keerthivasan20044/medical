import { motion } from 'framer-motion';
import { 
  Users, ShoppingBag, Store, IndianRupee, 
  ArrowUpRight, Clock, Activity, MapPin 
} from 'lucide-react';
import StatsCard from '../../components/dashboard/StatsCard';
import DataTable from '../../components/dashboard/DataTable';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area 
} from 'recharts';

const REVENUE_DATA = [
  { month: 'Jan', revenue: 280000 }, { month: 'Feb', revenue: 320000 },
  { month: 'Mar', revenue: 380450 }, { month: 'Apr', revenue: 450000 },
  { month: 'May', revenue: 520000 }, { month: 'Jun', revenue: 490000 },
];

const RECENT_ORDERS = [
  { id: 'ORD-1024', customer: 'Ramesh Kumar', pharmacy: 'Apollo Pharmacy', amount: 165, status: 'Out for Delivery' },
  { id: 'ORD-1025', customer: 'Priya Raman', pharmacy: 'MedPlus', amount: 540, status: 'Processing' },
  { id: 'ORD-1026', customer: 'Anand Kumar', pharmacy: 'Sri Murugan', amount: 320, status: 'Confirmed' },
];

export default function AdminOverview() {
  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="text-[10px] font-black text-brand-teal uppercase tracking-[0.3em]">Operational Node v2.4</div>
          <h1 className="font-syne font-black text-4xl text-navy italic tracking-tighter uppercase">Overview Dashboard</h1>
        </div>
        <div className="flex items-center gap-4 bg-white px-6 py-3 rounded-2xl border border-gray-100 shadow-sm">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-black text-navy/60 uppercase tracking-widest italic">System Synchronized</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard label="Total Enclaves" value="10,284" trend="+12%" icon={Users} color="bg-blue-50 text-blue-600" delay={0.1} />
        <StatsCard label="Active Syncs" value="48,291" trend="+8%" icon={ShoppingBag} color="bg-orange-50 text-orange-600" delay={0.2} />
        <StatsCard label="Revenue Manifest" value="₹2.8M" trend="+15%" icon={IndianRupee} color="bg-brand-teal/10 text-brand-teal" delay={0.3} />
        <StatsCard label="Active Nodes" value="8" trend="Stable" icon={Store} color="bg-purple-50 text-purple-600" delay={0.4} />
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-white p-8 rounded-[3.5rem] border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-10">
            <h2 className="font-syne font-black text-xl text-navy uppercase italic">Revenue Projection</h2>
            <div className="flex items-center gap-2 text-[10px] font-black text-navy/40 uppercase tracking-widest italic">
              <Activity size={14} className="text-brand-teal" /> Last 6 Months
            </div>
          </div>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={REVENUE_DATA}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#02C39A" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#02C39A" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#02C39A" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-4 bg-navy rounded-[3.5rem] p-8 text-white relative overflow-hidden flex flex-col justify-between shadow-2xl">
          <div className="absolute top-0 right-0 h-40 w-40 bg-brand-teal/20 rounded-full blur-[100px]" />
          <div className="space-y-1 relative z-10">
            <div className="text-[10px] font-black text-brand-teal uppercase tracking-widest italic">Regional Density</div>
            <h2 className="font-syne font-black text-2xl uppercase italic">Karaikal Mesh</h2>
          </div>
          
          <div className="flex-1 flex items-center justify-center relative z-10">
            {/* Minimalist Map visualization */}
            <div className="h-48 w-48 relative border-2 border-brand-teal/20 rounded-full flex items-center justify-center">
              <div className="h-32 w-32 border border-brand-teal/10 rounded-full animate-ping" />
              <div className="absolute top-1/4 left-1/2 h-2 w-2 bg-brand-teal rounded-full shadow-[0_0_20px_#02C39A]" />
              <div className="absolute bottom-1/4 right-1/3 h-2 w-2 bg-brand-teal rounded-full shadow-[0_0_20px_#02C39A]" />
              <div className="absolute top-1/2 left-1/4 h-3 w-3 bg-white rounded-full shadow-[0_0_20px_#fff] animate-pulse" />
            </div>
          </div>

          <div className="space-y-4 relative z-10 pt-8 border-t border-white/5">
             <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-white/40 uppercase tracking-widest italic">Active Nodes</span>
                <span className="font-syne font-black text-brand-teal italic">100% SECURE</span>
             </div>
             <button className="w-full h-14 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">Launch Geo-Sync</button>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <DataTable 
        title="Recent Global Orders"
        columns={[
          { key: 'id', label: 'Order ID' },
          { key: 'customer', label: 'Initiator' },
          { key: 'pharmacy', label: 'Node' },
          { key: 'amount', label: 'Value', render: (val) => `₹${val}` },
          { 
            key: 'status', 
            label: 'Status',
            render: (val) => (
              <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest w-fit border ${
                val === 'Delivered' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'
              }`}>
                {val}
              </div>
            )
          }
        ]}
        data={RECENT_ORDERS}
        actions={true}
      />
    </div>
  );
}
