import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Navigation, MapPin, IndianRupee, Star, Power, Clock, CheckCircle2, TrendingUp, AlertCircle, ChevronRight, User } from 'lucide-react';
import StatsCard from '../../components/dashboard/StatsCard';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { useSelector } from 'react-redux';
import { deliveryService } from '../../services/apiServices';
import toast from 'react-hot-toast';

const WEEKLY_DATA = [
  { day: 'Mon', count: 8 }, { day: 'Tue', count: 12 },
  { day: 'Wed', count: 10 }, { day: 'Thu', count: 15 },
  { day: 'Fri', count: 18 }, { day: 'Sat', count: 22 },
  { day: 'Sun', count: 14 },
];

export default function DeliveryOverview() {
  const { user } = useSelector(state => state.auth);
  const [isOnline, setIsOnline] = useState(true);
  const [activeOrder, setActiveOrder] = useState(null);
  const [recentDeliveries, setRecentDeliveries] = useState([
    { id: 'ORD-1024', pharmacy: 'Apollo Pharmacy', date: 'Today, 14:20', earnings: 45 },
    { id: 'ORD-1023', pharmacy: 'MedPlus', date: 'Today, 12:15', earnings: 35 },
  ]);

  const handleToggleOnline = async () => {
    try {
      // API call to toggle status would go here
      setIsOnline(!isOnline);
      toast.success(isOnline ? 'You are now OFFLINE' : 'You are now ONLINE');
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="space-y-10 pb-24">
      {/* Header with Profile & Earnings */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
           <div className="h-16 w-16 bg-navy rounded-2xl flex items-center justify-center text-brand-teal shadow-xl border-2 border-white overflow-hidden">
              {user?.avatar ? <img src={user.avatar} alt="" className="h-full w-full object-cover" /> : <User size={32} />}
           </div>
           <div>
              <div className="flex items-center gap-2">
                 <h1 className="font-syne font-black text-2xl text-navy uppercase italic">{user?.name || 'Partner'}</h1>
                 <div className="flex items-center gap-1 text-amber-500 font-syne font-black text-xs">
                    <Star size={14} fill="currentColor" /> 4.9
                 </div>
              </div>
              <div className="text-[10px] font-black text-navy/40 uppercase tracking-widest italic mt-1">Agent ID: {user?._id?.slice(-8).toUpperCase()}</div>
           </div>
        </div>

        <div className="flex items-center gap-6">
           <div className="text-right">
              <div className="text-[10px] font-black text-navy/40 uppercase tracking-widest italic leading-none">Today Earnings</div>
              <div className="text-3xl font-syne font-black text-navy italic tracking-tighter">₹1,240</div>
           </div>
           <div className="h-10 w-[1px] bg-gray-100" />
           <button 
             onClick={handleToggleOnline}
             className={`h-14 px-8 rounded-[2rem] font-syne font-black text-xs uppercase tracking-widest flex items-center gap-3 transition-all shadow-xl ${
               isOnline ? 'bg-emerald-500 text-white shadow-emerald-500/20' : 'bg-red-500 text-white shadow-red-500/20'
             }`}
           >
             <Power size={18} />
             {isOnline ? 'Online' : 'Offline'}
           </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatsCard label="Today" value="12" trend="+3" icon={CheckCircle2} color="bg-blue-50 text-blue-600" />
        <StatsCard label="This Week" value="₹4,280" trend="+12%" icon={IndianRupee} color="bg-emerald-50 text-emerald-600" />
        <StatsCard label="Rating" value="4.9" trend="Top 5%" icon={Star} color="bg-amber-50 text-amber-600" />
        <StatsCard label="Success" value="98%" trend="Stable" icon={TrendingUp} color="bg-purple-50 text-purple-600" />
      </div>

      {/* Active Order Card */}
      {activeOrder ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-navy rounded-[3.5rem] p-8 text-white relative overflow-hidden group shadow-2xl"
        >
           <div className="absolute top-0 right-0 h-40 w-40 bg-brand-teal/20 rounded-full blur-[80px]" />
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
              <div className="space-y-2">
                 <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-brand-teal animate-pulse" />
                    <span className="text-[10px] font-black text-brand-teal uppercase tracking-widest italic">Mission in Progress</span>
                 </div>
                 <h2 className="text-2xl font-syne font-black uppercase italic">Out for Delivery</h2>
                 <p className="text-sm font-dm font-bold text-white/40 italic">Client: Anitha S. • 12 Nagore Road</p>
              </div>
              <button className="h-14 px-8 bg-brand-teal text-navy rounded-2xl font-syne font-black text-xs uppercase tracking-widest hover:scale-105 transition-all flex items-center gap-2">
                 Resume Mission <ChevronRight size={18} />
              </button>
           </div>
        </motion.div>
      ) : (
        <div className="bg-white p-8 rounded-[3.5rem] border border-gray-100 shadow-sm flex items-center justify-center min-h-[140px] text-center italic text-navy/20 font-dm font-bold">
           No active mission. Go online to receive requests.
        </div>
      )}

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Recent Deliveries */}
        <div className="lg:col-span-7 space-y-6">
           <div className="flex items-center justify-between px-4">
              <h3 className="font-syne font-black text-xl text-navy uppercase italic">Recent Logs</h3>
              <button className="text-[10px] font-black text-brand-teal uppercase tracking-widest italic hover:underline">View All</button>
           </div>
           <div className="space-y-4">
              {recentDeliveries.map((delivery) => (
                <div key={delivery.id} className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm flex items-center justify-between group hover:shadow-lg transition-all">
                   <div className="flex items-center gap-4">
                      <div className="h-12 w-12 bg-navy/5 rounded-2xl flex items-center justify-center text-navy/40 group-hover:text-brand-teal transition-all">
                         <Clock size={24} />
                      </div>
                      <div>
                         <div className="font-dm font-black text-navy text-sm italic">{delivery.pharmacy}</div>
                         <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest italic">{delivery.date}</div>
                      </div>
                   </div>
                   <div className="text-right">
                      <div className="text-lg font-syne font-black text-navy italic">+₹{delivery.earnings}</div>
                      <div className="text-[9px] font-black text-emerald-500 uppercase tracking-widest italic leading-none">Settled</div>
                   </div>
                </div>
              ))}
           </div>
        </div>

        {/* Weekly Performance */}
        <div className="lg:col-span-5 bg-white p-8 rounded-[3.5rem] border border-gray-100 shadow-sm">
           <h3 className="font-syne font-black text-xl text-navy uppercase italic mb-8 px-2">Performance Mesh</h3>
           <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                 <LineChart data={WEEKLY_DATA}>
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                    <YAxis hide />
                    <Tooltip contentStyle={{ borderRadius: '20px', border: 'none' }} />
                    <Line type="monotone" dataKey="count" stroke="#02C39A" strokeWidth={4} dot={{ fill: '#02C39A', r: 4 }} activeDot={{ r: 8 }} />
                 </LineChart>
              </ResponsiveContainer>
           </div>
           <div className="mt-6 p-6 bg-navy rounded-[2.5rem] text-white flex items-center justify-between">
              <div>
                 <div className="text-[10px] font-black text-brand-teal uppercase tracking-widest italic mb-1">Weekly High</div>
                 <div className="font-syne font-black text-2xl italic tracking-tighter">22 TASKS</div>
              </div>
              <TrendingUp size={32} className="text-brand-teal/40" />
           </div>
        </div>
      </div>
    </div>
  );
}
