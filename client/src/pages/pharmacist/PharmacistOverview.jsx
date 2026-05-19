import { motion } from 'framer-motion';
import { ShoppingBag, Package, FileText, IndianRupee, Clock, Activity, Power, Loader2 } from 'lucide-react';
import StatsCard from '../../components/dashboard/StatsCard';
import DataTable from '../../components/dashboard/DataTable';
import { useState, useEffect } from 'react';
import { pharmacistService } from '../../services/apiServices';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { useLanguage } from '../../context/LanguageContext';

export default function PharmacistOverview() {
  const { t } = useLanguage();
  const { user } = useSelector(state => state.auth);
  const [isOnline, setIsOnline] = useState(true);
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, ordersData] = await Promise.all([
          pharmacistService.getStats(),
          pharmacistService.getOrders()
        ]);
        setStats(statsData);
        setOrders(ordersData.slice(0, 5));
      } catch (err) {
        console.error('Failed to fetch pharmacist data:', err);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="animate-spin text-brand-teal" size={48} />
        <p className="text-xs font-dm font-black text-navy/20 uppercase tracking-widest italic">Synchronizing Node Data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Header with Online Toggle */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="text-[10px] font-black text-brand-teal uppercase tracking-[0.3em]">Node: {user?.name || 'Pharmacy Hub'}</div>
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
        <StatsCard label="Pending Orders" value={stats?.pendingOrders || 0} trend="Live" icon={ShoppingBag} color="bg-blue-50 text-blue-600" delay={0.1} />
        <StatsCard label="Total Orders" value={stats?.totalOrders || 0} trend="All time" icon={Package} color="bg-orange-50 text-orange-600" delay={0.2} />
        <StatsCard label="Total Revenue" value={`₹${stats?.totalRevenue?.toLocaleString() || 0}`} trend="Delivered" icon={IndianRupee} color="bg-emerald-50 text-emerald-600" delay={0.3} />
        <StatsCard label="Medicines" value={stats?.totalMedicines || 0} trend="Catalog" icon={FileText} color="bg-purple-50 text-purple-600" delay={0.4} />
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-8">
           <DataTable 
              title="Recent Orders"
              columns={[
                { key: '_id', label: 'Order ID', render: (val) => val.slice(-6).toUpperCase() },
                { key: 'customerName', label: 'Client', render: (_, row) => row.userId?.name || 'Customer' },
                { key: 'totalAmount', label: 'Total', render: (val) => `₹${val}` },
                { 
                  key: 'status', 
                  label: 'Stage',
                  render: (val) => (
                    <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest w-fit border ${
                      val === 'pending' ? 'bg-blue-50 text-blue-600 border-blue-100 animate-pulse' : 
                      val === 'processing' ? 'bg-amber-50 text-amber-600 border-amber-100' : 
                      'bg-emerald-50 text-emerald-600 border-emerald-100'
                    }`}>
                      {val}
                    </div>
                  )
                },
                { key: 'createdAt', label: 'Date', render: (val) => new Date(val).toLocaleDateString() }
              ]}
              data={orders}
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
