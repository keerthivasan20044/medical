import { motion } from 'framer-motion';
import { ShoppingBag, Package, FileText, IndianRupee, Clock, Activity, Power } from 'lucide-react';
import StatsCard from '../../components/dashboard/StatsCard';
import DataTable from '../../components/dashboard/DataTable';
import { useState } from 'react';

export default function PharmacistOverview() {
  const [isOnline, setIsOnline] = useState(true);

  const RECENT_ORDERS = [
    { id: 'ORD-5542', customer: 'Anitha S.', total: 1240, status: 'New', date: 'Just now' },
    { id: 'ORD-5541', customer: 'Vijay R.', total: 850, status: 'Preparing', date: '12 mins ago' },
    { id: 'ORD-5540', customer: 'Meera K.', total: 2100, status: 'Ready', date: '45 mins ago' },
  ];

  return (
    <div className="space-y-10">
      {/* Header with Online Toggle */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="text-[10px] font-black text-brand-teal uppercase tracking-[0.3em]">Node: Apollo Pharmacy #42</div>
          <h1 className="font-syne font-black text-4xl text-navy italic tracking-tighter uppercase">Pharmacist Hub</h1>
        </div>
        <button 
          onClick={() => setIsOnline(!isOnline)}
          className={`h-14 px-8 rounded-[2rem] font-syne font-black text-xs uppercase tracking-widest flex items-center gap-3 transition-all shadow-xl ${
            isOnline ? 'bg-emerald-500 text-white shadow-emerald-500/20' : 'bg-red-500 text-white shadow-red-500/20'
          }`}
        >
          <Power size={18} />
          {isOnline ? 'System Online' : 'System Offline'}
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard label="New Requests" value="4" trend="+2 today" icon={ShoppingBag} color="bg-blue-50 text-blue-600" delay={0.1} />
        <StatsCard label="Low Stock" value="12" trend="Action Required" icon={Package} color="bg-orange-50 text-orange-600" delay={0.2} />
        <StatsCard label="Today's Revenue" value="₹12,450" trend="+18%" icon={IndianRupee} color="bg-emerald-50 text-emerald-600" delay={0.3} />
        <StatsCard label="Prescriptions" value="8" trend="Pending Verification" icon={FileText} color="bg-purple-50 text-purple-600" delay={0.4} />
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-8">
           <DataTable 
              title="Immediate Actions"
              columns={[
                { key: 'id', label: 'Order ID' },
                { key: 'customer', label: 'Client' },
                { key: 'total', label: 'Total', render: (val) => `₹${val}` },
                { 
                  key: 'status', 
                  label: 'Stage',
                  render: (val) => (
                    <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest w-fit border ${
                      val === 'New' ? 'bg-blue-50 text-blue-600 border-blue-100 animate-pulse' : 
                      val === 'Preparing' ? 'bg-amber-50 text-amber-600 border-amber-100' : 
                      'bg-emerald-50 text-emerald-600 border-emerald-100'
                    }`}>
                      {val}
                    </div>
                  )
                },
                { key: 'date', label: 'Elapsed' }
              ]}
              data={RECENT_ORDERS}
              actions={true}
           />
        </div>

        {/* Pharmacy Status Card */}
        <div className="lg:col-span-4 space-y-6">
           <div className="bg-navy rounded-[3rem] p-8 text-white relative overflow-hidden flex flex-col justify-between shadow-2xl h-full">
              <div className="absolute top-0 right-0 h-40 w-40 bg-brand-teal/20 rounded-full blur-[80px]" />
              <div className="space-y-4 relative z-10">
                 <div className="text-[10px] font-black text-brand-teal uppercase tracking-widest italic">Operational Metrics</div>
                 <div className="space-y-6">
                    <div className="flex items-center justify-between">
                       <span className="text-sm font-dm font-bold text-white/40 italic">Avg. Preparation Time</span>
                       <span className="font-syne font-black text-brand-teal italic">12 MIN</span>
                    </div>
                    <div className="flex items-center justify-between">
                       <span className="text-sm font-dm font-bold text-white/40 italic">Order Fill Rate</span>
                       <span className="font-syne font-black text-brand-teal italic">98.4%</span>
                    </div>
                    <div className="flex items-center justify-between">
                       <span className="text-sm font-dm font-bold text-white/40 italic">Customer Satisfaction</span>
                       <span className="font-syne font-black text-brand-teal italic">4.9/5.0</span>
                    </div>
                 </div>
              </div>
              
              <div className="pt-8 relative z-10">
                 <button className="w-full h-14 bg-brand-teal text-navy rounded-2xl font-syne font-black text-xs uppercase tracking-widest hover:scale-105 transition-all">Download Report</button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
