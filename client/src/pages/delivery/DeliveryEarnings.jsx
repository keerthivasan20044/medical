import { useEffect } from 'react';
import DataTable from '../../components/dashboard/DataTable';
import { IndianRupee, TrendingUp, Calendar, Download, Wallet, ArrowUpRight, Navigation, Loader2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useDelivery } from '../../hooks/useDelivery';

export default function DeliveryEarnings() {
  const { earnings, fetchEarnings, loading } = useDelivery();

  useEffect(() => {
    fetchEarnings();
  }, []);

  const chartData = earnings.history?.map(item => ({
    date: new Date(item.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
    amount: item.amount
  })).slice(-7) || [];

  const payoutData = earnings.history?.map((item, idx) => ({
    id: `PAY-${(item.id || idx).toString().slice(-4)}`,
    task: `ORD-${(item.id || idx).toString().slice(-4)}`,
    type: 'Fare',
    amount: item.amount,
    date: new Date(item.date).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }),
    status: 'Credited'
  })).reverse() || [];

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center space-y-4 pb-48">
        <Loader2 className="animate-spin text-brand-teal" size={48} />
        <p className="text-xs font-dm font-black text-navy/20 uppercase tracking-widest italic">Retrieving Yield Matrix...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="font-syne font-black text-4xl text-navy italic tracking-tighter uppercase">Yield Registry</h1>
          <p className="text-xs font-dm font-bold text-navy/40 uppercase tracking-widest mt-1 italic">Agent Financial Performance Manifest</p>
        </div>
        <button 
          className="h-14 px-8 bg-navy text-brand-teal rounded-[2rem] font-syne font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:scale-105 transition-all shadow-xl shadow-navy/20"
        >
          <Download size={18} /> Statement
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-10 rounded-[3.5rem] border border-gray-100 shadow-sm relative overflow-hidden group">
           <div className="absolute top-0 right-0 h-24 w-24 bg-emerald-50 rounded-full -mr-12 -mt-12 group-hover:scale-110 transition-transform" />
           <p className="text-[10px] font-black text-navy/40 uppercase tracking-widest italic mb-2 relative z-10">Wallet Balance</p>
           <h4 className="text-4xl font-syne font-black italic tracking-tighter text-navy relative z-10">₹{earnings.totalEarnings?.toFixed(2)}</h4>
           <div className="mt-6 flex items-center gap-2 text-emerald-600 font-dm font-bold text-xs relative z-10">
              <ArrowUpRight size={14} /> Available for Withdrawal
           </div>
        </div>
        
        <div className="bg-navy p-10 rounded-[3.5rem] text-white relative overflow-hidden group">
           <div className="absolute top-0 right-0 h-24 w-24 bg-white/5 rounded-full -mr-12 -mt-12" />
           <p className="text-[10px] font-black text-brand-teal uppercase tracking-widest italic mb-2 relative z-10">Total Deliveries</p>
           <h4 className="text-4xl font-syne font-black italic tracking-tighter text-white relative z-10">{earnings.deliveryCount}</h4>
           <div className="mt-6 flex items-center gap-2 text-brand-teal font-dm font-bold text-xs relative z-10">
              <TrendingUp size={14} /> Completed Missions
           </div>
        </div>

        <div className="bg-brand-teal p-10 rounded-[3.5rem] text-navy relative overflow-hidden group">
           <div className="absolute top-0 right-0 h-24 w-24 bg-navy/5 rounded-full -mr-12 -mt-12" />
           <p className="text-[10px] font-black text-navy/40 uppercase tracking-widest italic mb-2 relative z-10">Estimated Bonus</p>
           <h4 className="text-4xl font-syne font-black italic tracking-tighter text-navy relative z-10">₹{(earnings.totalEarnings * 0.1).toFixed(2)}</h4>
           <div className="mt-6 flex items-center gap-2 text-navy/40 font-dm font-bold text-xs relative z-10">
              <Navigation size={14} /> Efficiency Incentive
           </div>
        </div>
      </div>

      <div className="bg-white p-10 rounded-[3.5rem] border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-10">
          <h3 className="font-syne font-black text-xl text-navy uppercase italic">Yield Projection</h3>
          <div className="flex items-center gap-2 text-[10px] font-black text-navy/40 uppercase tracking-widest italic">
             <Calendar size={14} /> Recent Missions
          </div>
        </div>
        <div className="h-[300px]">
           <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorEarn" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#02C39A" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#02C39A" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)' }} />
                <Area type="monotone" dataKey="amount" stroke="#02C39A" strokeWidth={4} fillOpacity={1} fill="url(#colorEarn)" />
              </AreaChart>
           </ResponsiveContainer>
        </div>
      </div>

      <DataTable 
        title="Payout Matrix"
        columns={[
          { key: 'id', label: 'Payout ID' },
          { key: 'task', label: 'Mission ID' },
          { 
            key: 'type', 
            label: 'Protocol',
            render: (val) => (
              <span className={`text-[10px] font-black uppercase tracking-widest italic ${
                val === 'Fare' ? 'text-emerald-500' : 'text-blue-500'
              }`}>{val}</span>
            )
          },
          { 
            key: 'amount', 
            label: 'Impact', 
            render: (val) => (
              <span className={`font-syne font-black text-sm italic ${val > 0 ? 'text-navy' : 'text-red-500'}`}>
                {val > 0 ? `+₹${val}` : `-₹${Math.abs(val)}`}
              </span>
            )
          },
          { key: 'date', label: 'Sync Time' },
          { 
            key: 'status', 
            label: 'Finality',
            render: (val) => (
              <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest w-fit border ${
                val === 'Credited' || val === 'Transferred' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'
              }`}>
                {val}
              </div>
            )
          }
        ]}
        data={payoutData}
      />
    </div>
  );
}
