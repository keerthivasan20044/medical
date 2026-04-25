import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Navigation, MapPin, IndianRupee, Star, Power, Clock, CheckCircle2, TrendingUp, AlertCircle, ChevronRight, User, Loader2 } from 'lucide-react';
import StatsCard from '../../components/dashboard/StatsCard';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { useSelector } from 'react-redux';
import { useDelivery } from '../../hooks/useDelivery';
import toast from 'react-hot-toast';

export default function DeliveryOverview() {
  const { user } = useSelector(state => state.auth);
  const { history, earnings, activeTask, fetchHistory, fetchEarnings, loading } = useDelivery();
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    fetchHistory();
    fetchEarnings();
  }, []);

  const handleToggleOnline = async () => {
    try {
      setIsOnline(!isOnline);
      toast.success(isOnline ? 'You are now OFFLINE' : 'You are now ONLINE');
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const weeklyData = history?.reduce((acc, order) => {
    const day = new Date(order.deliveredAt).toLocaleDateString('en-US', { weekday: 'short' });
    const existing = acc.find(d => d.day === day);
    if (existing) existing.count += 1;
    else acc.push({ day, count: 1 });
    return acc;
  }, []).slice(-7) || [];

  const recentLogs = history?.slice(0, 3).map(order => ({
    id: order.orderNumber || order._id?.slice(-6).toUpperCase(),
    pharmacy: order.pharmacyId?.name || 'Pharmacy Node',
    date: new Date(order.deliveredAt).toLocaleString('en-IN', { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' }),
    earnings: order.deliveryFare || 45
  })) || [];

  if (loading && history.length === 0) {
    return (
      <div className="h-screen flex flex-col items-center justify-center space-y-4 pb-48">
        <Loader2 className="animate-spin text-brand-teal" size={48} />
        <p className="text-xs font-dm font-black text-navy/20 uppercase tracking-widest italic">Synchronizing Node Data...</p>
      </div>
    );
  }

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
              <div className="text-[10px] font-black text-navy/40 uppercase tracking-widest italic leading-none">Total Yield</div>
              <div className="text-3xl font-syne font-black text-navy italic tracking-tighter">₹{earnings.totalEarnings?.toFixed(2)}</div>
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
        <StatsCard label="Completed" value={earnings.deliveryCount} trend="+3" icon={CheckCircle2} color="bg-blue-50 text-blue-600" />
        <StatsCard label="Yield" value={`₹${earnings.totalEarnings?.toFixed(0)}`} trend="+12%" icon={IndianRupee} color="bg-emerald-50 text-emerald-600" />
        <StatsCard label="Rating" value="4.9" trend="Top 5%" icon={Star} color="bg-amber-50 text-amber-600" />
        <StatsCard label="Efficiency" value="98%" trend="Stable" icon={TrendingUp} color="bg-purple-50 text-purple-600" />
      </div>

      {/* Active Order Card */}
      {activeTask ? (
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
                 <h2 className="text-2xl font-syne font-black uppercase italic">{activeTask.deliveryStatus?.replace('_', ' ')}</h2>
                 <p className="text-sm font-dm font-bold text-white/40 italic mt-1 leading-relaxed max-w-md">
                   {activeTask.pharmacyId?.name} &rarr; {activeTask.deliveryAddress}
                 </p>
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
              {recentLogs.map((delivery) => (
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
              {recentLogs.length === 0 && !loading && (
                <div className="bg-white p-12 rounded-[2.5rem] border border-dashed border-gray-100 text-center text-navy/20 font-dm font-bold italic">
                   No recent activity logs found.
                </div>
              )}
           </div>
        </div>

        {/* Weekly Performance */}
        <div className="lg:col-span-5 bg-white p-8 rounded-[3.5rem] border border-gray-100 shadow-sm">
           <h3 className="font-syne font-black text-xl text-navy uppercase italic mb-8 px-2">Performance Mesh</h3>
           <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                 <LineChart data={weeklyData.length > 0 ? weeklyData : [{day: 'N/A', count: 0}]}>
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                    <YAxis hide />
                    <Tooltip contentStyle={{ borderRadius: '20px', border: 'none' }} />
                    <Line type="monotone" dataKey="count" stroke="#02C39A" strokeWidth={4} dot={{ fill: '#02C39A', r: 4 }} activeDot={{ r: 8 }} />
                 </LineChart>
              </ResponsiveContainer>
           </div>
           <div className="mt-6 p-6 bg-navy rounded-[2.5rem] text-white flex items-center justify-between">
              <div>
                 <div className="text-[10px] font-black text-brand-teal uppercase tracking-widest italic mb-1">Node Status</div>
                 <div className="font-syne font-black text-2xl italic tracking-tighter uppercase">{isOnline ? 'Active' : 'Standby'}</div>
              </div>
              <TrendingUp size={32} className="text-brand-teal/40" />
           </div>
        </div>
      </div>
    </div>
  );
}
