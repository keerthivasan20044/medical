import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, ShoppingBag, Store, Pill, IndianRupee, Clock, 
  TrendingUp, Activity, MapPin, Search, Filter, 
  ChevronRight, ArrowUpRight, ArrowDownRight, MoreVertical,
  CheckCircle, AlertCircle, Phone, Video, RefreshCw
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area 
} from 'recharts';
import { useSocket } from '../../context/SocketContext.jsx';
import { adminService } from '../../services/apiServices';

const REVENUE_DATA = [
  { month: 'Jan', revenue: 280000 }, { month: 'Feb', revenue: 320000 },
  { month: 'Mar', revenue: 380450 }, { month: 'Apr', revenue: 450000 },
  { month: 'May', revenue: 520000 }, { month: 'Jun', revenue: 490000 },
  { month: 'Jul', revenue: 580000 }, { month: 'Aug', revenue: 640000 },
  { month: 'Sep', revenue: 710000 }, { month: 'Oct', revenue: 780000 },
  { month: 'Nov', revenue: 840000 }, { month: 'Dec', revenue: 920000 },
];

const CATEGORY_DATA = [
  { name: 'Tablets', value: 62 },
  { name: 'Syrups', value: 22 },
  { name: 'Vaccines', value: 8 },
  { name: 'Injections', value: 8 }
];

const COLORS = ['#028090', '#02C39A', '#0a1628', '#F39C12'];

const DAU_DATA = [
  { day: 'Mon', users: 245 }, { day: 'Tue', users: 312 },
  { day: 'Wed', users: 289 }, { day: 'Thu', users: 401 },
  { day: 'Fri', users: 378 }, { day: 'Sat', users: 445 },
  { day: 'Sun', users: 512 }
];

const PHARMACY_PERFORMANCE = [
  { id: 1, name: 'Apollo Pharmacy', orders: 42, revenue: 8450, rating: 4.7, status: 'Active' },
  { id: 2, name: 'MedPlus', orders: 38, revenue: 6820, rating: 4.5, status: 'Active' },
  { id: 3, name: 'Sri Murugan Medical', orders: 56, revenue: 9200, rating: 4.9, status: 'Active' },
  { id: 4, name: 'Life Care Medicals', orders: 28, revenue: 4100, rating: 4.6, status: 'Active' },
  { id: 5, name: 'MK Medical Kitchen', orders: 19, revenue: 2900, rating: 4.4, status: 'Active' },
  { id: 6, name: 'Grace Pharmacy', orders: 31, revenue: 5600, rating: 4.8, status: 'Active' },
  { id: 7, name: 'Sri Dhanvantri', orders: 15, revenue: 2100, rating: 4.3, status: 'Active' },
  { id: 8, name: 'Karaikal Central', orders: 48, revenue: 8800, rating: 4.7, status: 'Active' }
];

const RECENT_ORDERS = [
  { id: 'ORD-1024', customer: 'Ramesh Kumar', pharmacy: 'Apollo Pharmacy', amount: 165, status: 'Out for Delivery' },
  { id: 'ORD-1025', customer: 'Priya Raman', pharmacy: 'MedPlus', amount: 540, status: 'Processing' },
  { id: 'ORD-1026', customer: 'Anand Kumar', pharmacy: 'Sri Murugan', amount: 320, status: 'Confirmed' },
  { id: 'ORD-1027', customer: 'Lakshmi Devi', pharmacy: 'Life Care', amount: 890, status: 'Delivered' },
  { id: 'ORD-1028', customer: 'Suresh Prabhu', pharmacy: 'Apollo Pharmacy', amount: 210, status: 'Processing' },
  { id: 'ORD-1029', customer: 'Kavitha S', pharmacy: 'MK Medical', amount: 1200, status: 'Delivered' },
  { id: 'ORD-1030', customer: 'Vignesh R', pharmacy: 'Grace Pharmacy', amount: 450, status: 'Processing' },
  { id: 'ORD-1031', customer: 'Meena K', pharmacy: 'Sri Dhanvantri', amount: 150, status: 'Confirmed' },
  { id: 'ORD-1032', customer: 'Selvam T', pharmacy: 'Karaikal Central', amount: 980, status: 'Out for Delivery' },
  { id: 'ORD-1033', customer: 'Deepa M', pharmacy: 'Apollo Pharmacy', amount: 670, status: 'Delivered' }
];

export default function AdminDashboard() {
  const [stats, setStats] = useState([
    { label: 'Total Users', value: '10,284', trend: '+12%', icon: Users, color: 'text-blue-600 bg-blue-50' },
    { label: 'Total Orders', value: '48,291', trend: '+8%', icon: ShoppingBag, color: 'text-orange-600 bg-orange-50' },
    { label: 'Active Pharmacies', value: '8 (Karaikal)', trend: 'Stable', icon: Store, color: 'text-emerald-600 bg-emerald-50' },
    { label: 'Total Medicines', value: '5,240', trend: '+142', icon: Pill, color: 'text-purple-600 bg-purple-50' },
    { label: 'Today Revenue', value: '₹28,450', trend: '+15%', icon: IndianRupee, color: 'text-[#028090] bg-[#028090]/10' },
    { label: 'Pending Orders', value: '23', trend: '-5', icon: Clock, color: 'text-red-500 bg-red-50' }
  ]);
  const [loading, setLoading] = useState(true);
  const [telemetryNodes, setTelemetryNodes] = useState([]);

  const { socket } = useSocket();
  const [orders, setOrders] = useState(RECENT_ORDERS);

  useEffect(() => {
    const fetchAdminNode = async () => {
       try {
          const data = await adminService.getStats();
          setStats(prev => [
            { ...prev[0], value: (data.totalUsers || 0).toLocaleString() },
            { ...prev[1], value: (data.ordersToday || 0).toLocaleString() },
            { ...prev[2], value: `${data.activePharmacies || 0} (Karaikal)` },
            { ...prev[3], value: (data.medicines || 0).toLocaleString() },
            { ...prev[4], value: `₹${(data.revenue || 0).toLocaleString()}` },
            { ...prev[5], value: (data.deliveries || 0).toLocaleString() }
          ]);
       } catch (e) {
          console.warn('Admin Node Sync Failed. Reverting to Mock Architecture.');
       } finally {
          setLoading(false);
       }
    };
    fetchAdminNode();

    // REAL-TIME DASHBOARD PULSE
    if (socket) {
      socket.on('order:new', (data) => {
        setOrders(prev => [data.order, ...prev.slice(0, 9)]);
        setStats(prev => prev.map(s => 
          s.label === 'Total Orders' ? { ...s, value: (parseInt(s.value.replace(/,/g, '')) + 1).toLocaleString() } : s
        ));
      });

      socket.on('order:status-update', (data) => {
        setOrders(prev => prev.map(o => o.id === data.orderId ? { ...o, status: data.status } : o));
      });

      socket.on('telemetry:pulse', (data) => {
        setTelemetryNodes(prev => {
          const existing = prev.find(n => n.orderId === data.orderId);
          if (existing) {
             return prev.map(n => n.orderId === data.orderId ? { ...n, ...data.telemetry } : n);
          }
          return [ { ...data.telemetry, orderId: data.orderId }, ...prev ].slice(0, 4);
        });
      });
    }

    return () => {
      if (socket) {
        socket.off('order:new');
        socket.off('order:status-update');
        socket.off('telemetry:pulse');
      }
    };
  }, [socket]);

  return (
    <div className="bg-[#f0f2f5] min-h-screen pb-20 pt-24 px-8">
      <div className="max-w-[1600px] mx-auto space-y-12">
         {/* Header */}
         <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
               <div className="text-[10px] font-black text-[#028090] uppercase tracking-[0.3em]">Command Center v2.0</div>
               <h1 className="font-syne font-black text-4xl text-[#0a1628]">MediPharm Admin — <span className="text-[#028090]">Karaikal Operations</span></h1>
            </div>
            <div className="flex items-center gap-4 bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
               <div className="px-6 py-2 border-r border-gray-100 hidden lg:block">
                  <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">System Status</div>
                  <div className={`text-sm font-dm font-black uppercase flex items-center gap-2 ${loading ? 'text-amber-500' : 'text-emerald-500'}`}>
                     <div className={`h-2 w-2 rounded-full ${loading ? 'bg-amber-500 animate-spin' : 'bg-emerald-500 animate-pulse'}`} /> 
                     {loading ? 'Synchronizing Nodes...' : 'Nodes Synchronized'}
                  </div>
               </div>
                <button className="h-12 w-12 bg-gray-50 text-[#028090] rounded-xl flex items-center justify-center hover:bg-white hover:shadow-lg transition"><RefreshCw size={18}/></button>
            </div>
         </div>

         {/* Quick Action Matrix */}
         <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
               { label: 'Add Pharmacy', icon: Store, color: 'bg-[#0a1628]', textColor: 'text-brand-teal' },
               { label: 'Add Medicine', icon: Pill, color: 'bg-brand-teal', textColor: 'text-[#0a1628]' },
               { label: 'System Reports', icon: Activity, color: 'bg-white', textColor: 'text-[#0a1628]' },
               { label: 'Manage Nodes', icon: Users, color: 'bg-white', textColor: 'text-[#0a1628]' }
            ].map(action => (
               <button key={action.label} className={`h-24 md:h-28 rounded-[2rem] flex items-center justify-between px-8 shadow-soft border border-black/[0.02] hover:shadow-4xl transition-all duration-700 active:scale-95 group ${action.color} ${action.textColor}`}>
                  <div className="space-y-1 text-left">
                     <div className="text-[10px] font-black uppercase tracking-[0.2em] italic opacity-40">Execute Protocol</div>
                     <div className="font-syne font-black text-sm md:text-lg uppercase italic tracking-tighter leading-none">{action.label}</div>
                  </div>
                  <div className={`h-12 w-12 rounded-xl flex items-center justify-center transition-all duration-700 group-hover:rotate-12 ${action.color === 'bg-white' ? 'bg-gray-50' : 'bg-white/10'}`}><action.icon size={22} /></div>
               </button>
            ))}
         </div>

         {/* Stats Row */}
         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {stats.map((stat, i) => (
              <motion.div 
               key={stat.label}
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: i * 0.05 }}
               className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition relative group cursor-pointer overflow-hidden"
             >
                <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 mb-4 transition duration-500 group-hover:scale-110 ${stat.color}`}>
                   <stat.icon size={22} />
                </div>
                <div className="space-y-1 relative z-10">
                   <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{stat.label}</div>
                   <div className="text-2xl font-syne font-black text-[#0a1628]">{stat.value}</div>
                   <div className={`text-[10px] font-black uppercase flex items-center gap-1 ${stat.trend.startsWith('+') ? 'text-emerald-500' : stat.label === 'Active Pharmacies' ? 'text-blue-400' : 'text-red-400'}`}>
                      {stat.trend.startsWith('+') ? <ArrowUpRight size={12} /> : stat.trend.startsWith('-') ? <ArrowDownRight size={12} /> : null} {stat.trend}
                   </div>
                </div>
             </motion.div>
            ))}
         </div>

         {/* Charts Row */}
         <div className="grid lg:grid-cols-12 gap-10">
            {/* Revenue Chart */}
            <div className="lg:col-span-12 bg-white p-10 rounded-[3.5rem] border border-gray-100 shadow-sm space-y-8">
               <div className="flex items-center justify-between">
                  <h2 className="font-syne font-black text-[#0a1628] text-2xl flex items-center gap-3">
                     <IndianRupee className="text-[#028090]" /> Monthly Revenue Analysis
                  </h2>
                  <select className="bg-gray-50 border-none rounded-xl px-4 py-2 text-xs font-dm font-bold text-[#028090] outline-none">
                     <option>Year 2026</option>
                     <option>Year 2025</option>
                  </select>
               </div>
               <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                     <BarChart data={REVENUE_DATA} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <defs>
                           <linearGradient id="barTeal" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#02C39A" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#028090" stopOpacity={0.8}/>
                           </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#cbd5e1' }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#cbd5e1' }} />
                        <Tooltip 
                          cursor={{ fill: '#f8fafc' }}
                          contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', fontFamily: 'DM Sans', fontWeight: 700 }}
                        />
                        <Bar dataKey="revenue" fill="url(#barTeal)" radius={[10, 10, 0, 0]} barSize={40} />
                     </BarChart>
                  </ResponsiveContainer>
               </div>
            </div>
         </div>

         {/* Telemetry Real-Time Audit Hub */}
         <div className="grid lg:grid-cols-12 gap-10">
            <div className="lg:col-span-12 bg-[#0a1628] rounded-[4rem] p-12 text-white relative overflow-hidden group">
               <div className="absolute top-0 right-0 h-40 w-40 bg-brand-teal opacity-10 blur-[80px]" />
               <div className="flex items-center justify-between mb-10 relative z-10">
                  <div className="space-y-1">
                     <h2 className="font-syne font-black text-3xl">Logistics Telemetry Audit</h2>
                     <p className="text-white/40 font-dm text-sm">Monitoring live trajectories across the Karaikal medical enclave.</p>
                  </div>
                  <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-6 py-2 rounded-2xl">
                     <div className="h-2 w-2 bg-emerald-500 rounded-full animate-ping" />
                     <span className="text-[10px] font-black uppercase tracking-widest text-[#02C39A]">Real-Time Monitor Active</span>
                  </div>
               </div>

               <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
                  {telemetryNodes.length === 0 ? (
                     <div className="lg:col-span-4 p-12 text-center text-white/20 font-syne font-black uppercase tracking-widest border border-dashed border-white/10 rounded-[3rem]">
                        No Active District Trajectories Detected.
                     </div>
                  ) : (
                     telemetryNodes.map((node, i) => (
                        <motion.div 
                         initial={{ opacity: 0, scale: 0.9 }}
                         animate={{ opacity: 1, scale: 1 }}
                         key={node.orderId} 
                         className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] space-y-4 hover:bg-white/[0.08] transition group"
                        >
                           <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-white/40">
                              <span>Agent Node #{node.orderId.slice(-4)}</span>
                              <span className="text-[#02C39A] flex items-center gap-1">
                                 <Activity size={10} className="animate-pulse" /> Live Sync
                              </span>
                           </div>
                           <div className="flex items-end justify-between">
                              <div className="font-syne font-black text-4xl text-white">{node.progress}<span className="text-white/20 text-xl">%</span></div>
                              <div className={`text-[10px] font-black uppercase tracking-widest border rounded-full px-3 py-1 ${
                                 node.status === 'delivered' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/20' : 'text-brand-teal border-brand-teal/20'
                              }`}>
                                 {node.status}
                              </div>
                           </div>
                           <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                              <motion.div initial={{ width: 0 }} animate={{ width: `${node.progress}%` }} className="h-full bg-brand-teal" />
                           </div>
                           <div className="text-[9px] text-white/30 font-bold uppercase tracking-widest flex items-center justify-between">
                              <div className="flex items-center gap-2 italic">ETA: {node.eta}m remaining</div>
                              <div className="h-2 w-2 rounded-full bg-brand-teal animate-pulse" />
                           </div>
                        </motion.div>
                     ))
                  )}
               </div>
            </div>
         </div>

         {/* Third Chart Row - DAU */}
         <div className="bg-white p-12 rounded-[4rem] text-[#0a1628] border border-gray-100 shadow-sm space-y-10 relative overflow-hidden group">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
               <div className="space-y-1">
                  <h2 className="font-syne font-black text-3xl">Daily Active Users Trend</h2>
                  <p className="text-gray-400 font-dm text-sm">Synchronized real-time heartbeat of Karaikal district enclave.</p>
               </div>
               <div className="flex items-center gap-6">
                  <div className="text-center">
                     <div className="text-[10px] text-white/30 font-bold uppercase tracking-widest">Peak Users Today</div>
                     <div className="text-3xl font-syne font-black text-[#02C39A]">512</div>
                  </div>
                  <div className="h-10 w-[1px] bg-white/10" />
                  <div className="text-center">
                     <div className="text-[10px] text-white/30 font-bold uppercase tracking-widest">7-day Growth</div>
                     <div className="text-3xl font-syne font-black text-blue-400">+24%</div>
                  </div>
               </div>
            </div>
            <div className="h-[300px] w-full relative z-10">
               <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={DAU_DATA}>
                     <XAxis dataKey="day" hide />
                     <Tooltip 
                       contentStyle={{ borderRadius: '20px', border: 'none', background: '#0a1628', color: '#fff' }}
                       itemStyle={{ color: '#02C39A' }}
                     />
                     <Line type="monotone" dataKey="users" stroke="#02C39A" strokeWidth={5} dot={{ r: 6, fill: '#0a1628', stroke: '#02C39A', strokeWidth: 3 }} />
                  </LineChart>
               </ResponsiveContainer>
            </div>
         </div>

         {/* Pharmacy & Map Row */}
         <div className="grid lg:grid-cols-[1fr_450px] gap-12">
             {/* Pharmacy Performance Table */}
             <div className="bg-white rounded-[3.5rem] border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-10 border-b border-gray-50 flex items-center justify-between">
                   <h2 className="font-syne font-black text-2xl text-[#0a1628]">Pharmacy Performance</h2>
                   <button className="h-10 w-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 hover:text-[#0a1628] hover:shadow-lg transition"><Filter size={18} /></button>
                </div>
                <div className="overflow-x-auto">
                   <table className="w-full text-left">
                      <thead>
                         <tr className="bg-gray-50/50">
                            <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Pharmacy</th>
                            <th className="px-6 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Today Orders</th>
                            <th className="px-6 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Revenue</th>
                            <th className="px-6 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Rating</th>
                            <th className="px-6 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                         {PHARMACY_PERFORMANCE.map(p => (
                            <tr key={p.id} className="hover:bg-gray-50/50 transition border-transparent hover:border-l-4 hover:border-l-[#028090]">
                               <td className="px-10 py-6">
                                  <div className="font-dm font-bold text-[#0a1628]">{p.name}</div>
                               </td>
                               <td className="px-6 py-6">
                                  <div className="font-syne font-black text-[#028090]">{p.orders}</div>
                               </td>
                               <td className="px-6 py-6 font-syne font-black text-[#0a1628]">₹{p.revenue}</td>
                               <td className="px-6 py-6">
                                  <div className="flex items-center gap-1.5 font-black text-amber-500 text-xs">
                                     <Activity size={12} /> {p.rating}
                                  </div>
                               </td>
                               <td className="px-6 py-6">
                                  <div className="flex items-center gap-2 text-[10px] font-black text-emerald-500 uppercase tracking-widest">
                                     <div className="h-2 w-2 bg-emerald-500 rounded-full" /> {p.status}
                                  </div>
                               </td>
                            </tr>
                         ))}
                      </tbody>
                   </table>
                </div>
             </div>

             {/* Coverage Map */}
             <div className="bg-white p-10 rounded-[4rem] border border-gray-100 shadow-sm space-y-8 flex flex-col relative overflow-hidden">
                <div className="absolute top-0 right-0 h-32 w-32 bg-[#028090] rounded-full blur-[100px] opacity-10" />
                <div className="flex items-center justify-between relative z-10">
                   <h2 className="font-syne font-black text-2xl text-[#0a1628]">Regional Coverage</h2>
                   <div className="flex items-center gap-2 bg-emerald-50 px-4 py-1.5 rounded-full text-[10px] font-black text-[#028090] uppercase tracking-widest shadow-sm">
                      <CheckCircle size={14} /> 100% Active
                   </div>
                </div>
                
                {/* CSS Karaikal Map Structure */}
                <div className="flex-1 min-h-[400px] bg-gray-50 rounded-[3rem] border border-dashed border-gray-200 relative overflow-hidden group">
                   <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(2,195,154,0.05)_0%,transparent_70%)]" />
                   
                   {/* Grid Lines */}
                   <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#0a1628 1px, transparent 1px), linear-gradient(90deg, #0a1628 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

                   {/* Representative Pins */}
                   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px]">
                      {/* Radius Circles */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full border border-[#028090]/10 rounded-full animate-ping-slow" />
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] border border-[#02C39A]/20 rounded-full" />
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] border-2 border-dashed border-[#028090]/20 rounded-full animate-rotate-slow" />
                      
                      {/* Pins */}
                      {[
                         { t: '15%', l: '35%', n: 'Karaikal Port' },
                         { t: '45%', l: '50%', n: 'Market Road' },
                         { t: '70%', l: '20%', n: 'Nagore Road' },
                         { t: '30%', l: '80%', n: 'New Colony' },
                         { t: '60%', l: '65%', n: 'Church Street' }
                      ].map((pin, i) => (
                         <div key={i} className="absolute flex flex-col items-center" style={{ top: pin.t, left: pin.l }}>
                            <div className="h-4 w-4 bg-[#028090] rounded-full ring-8 ring-[#028090]/10 animate-pulse" />
                            <div className="mt-2 bg-[#028090] text-white text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg shadow-lg opacity-40 group-hover:opacity-100 transition duration-500 whitespace-nowrap">{pin.n}</div>
                         </div>
                      ))}
                   </div>
                   
                   {/* Heatmap Overlay Simulation */}
                   <div className="absolute bottom-6 left-6 right-6 p-6 bg-[#0a1628] rounded-[2rem] text-white shadow-2xl flex items-center justify-between group-hover:-translate-y-2 transition duration-500">
                      <div className="space-y-1">
                         <div className="text-[10px] text-white/30 font-bold uppercase tracking-widest">Delivery Density</div>
                         <div className="text-sm font-syne font-black text-[#02C39A] uppercase tracking-widest">High Concentration Area</div>
                      </div>
                      <Activity size={24} className="text-[#02C39A] animate-pulse" />
                   </div>
                </div>
             </div>
         </div>

         {/* Recent Orders */}
         <div className="bg-white rounded-[4rem] border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-12 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
               <div className="space-y-1">
                  <h2 className="font-syne font-black text-3xl text-[#0a1628]">Recent Architecture Events</h2>
                  <p className="text-gray-400 font-dm italic">Real-time order sync across the Karaikal medical enclave.</p>
               </div>
               <div className="flex bg-gray-50 p-2 rounded-2xl items-center gap-2">
                  <input type="text" placeholder="Search order ID..." className="bg-transparent border-none outline-none font-dm text-sm px-4 w-48" />
                  <button className="h-10 w-10 bg-[#0a1628] text-white rounded-xl flex items-center justify-center shadow-lg"><Search size={16} /></button>
               </div>
            </div>
            
            <div className="overflow-x-auto">
               <table className="w-full text-left">
                  <thead>
                     <tr className="bg-gray-50/50">
                        <th className="px-12 py-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">Order ID</th>
                        <th className="px-8 py-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">Customer</th>
                        <th className="px-8 py-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">Pharmacy</th>
                        <th className="px-8 py-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">Amount</th>
                        <th className="px-8 py-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                        <th className="px-8 py-8 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Actions</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                     {orders.map((ord, idx) => (
                        <tr key={ord.id || ord.orderNumber} className="hover:bg-gray-50/50 transition">
                           <td className="px-12 py-8 font-syne font-black text-[#0a1628]">{ord.id || ord.orderNumber}</td>
                           <td className="px-8 py-8">
                              <div className="flex items-center gap-3">
                                 <div className="h-10 w-10 bg-[#028090]/10 text-[#028090] rounded-xl flex items-center justify-center font-black text-xs">{ord.customer?.name?.[0] || ord.customer?.[0] || 'U'}</div>
                                 <span className="font-dm font-black text-[#0a1628]">{ord.customer?.name || ord.customer}</span>
                              </div>
                           </td>
                           <td className="px-8 py-8 text-sm font-dm font-bold text-gray-500">{ord.pharmacy?.name || ord.pharmacy}</td>
                           <td className="px-8 py-8 font-syne font-black text-[#028090]">₹{ord.amount || ord.totalAmount}</td>
                           <td className="px-8 py-8">
                              <div className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest inline-flex items-center gap-2 ${
                                 ord.status === 'Delivered' ? 'bg-emerald-50 text-emerald-600' : 
                                 ord.status === 'Processing' ? 'bg-amber-50 text-amber-600' :
                                 'bg-blue-50 text-blue-600'
                              }`}>
                                 <div className={`h-2 w-2 rounded-full ${ord.status === 'Delivered' ? 'bg-emerald-600' : 'bg-amber-600'}`} /> {ord.status}
                              </div>
                           </td>
                           <td className="px-8 py-8 text-center">
                              <button className="h-10 w-10 border border-gray-100 rounded-xl flex items-center justify-center text-gray-400 hover:text-[#028090] hover:bg-white hover:shadow-lg transition mx-auto cursor-pointer"><ChevronRight size={18} /></button>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
            
            <div className="p-10 border-t border-gray-50 text-center">
               <button className="font-syne font-black text-[#0a1628] text-xs uppercase tracking-widest border-b-2 border-gray-100 hover:border-[#028090] transition px-4 pb-1">View All Historical Transactions</button>
            </div>
         </div>
      </div>
    </div>
  );
}
