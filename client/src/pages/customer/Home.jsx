import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Star, 
  Package, 
  Truck, 
  Activity, 
  Calendar, 
  Upload, 
  Stethoscope, 
  Wallet, 
  History, 
  Plus, 
  ArrowRight, 
  Search, 
  Bell,
  MapPin,
  Clock,
  ShieldCheck,
  Zap,
  ChevronRight,
  Loader2,
  Pill,
  RotateCcw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { medicineService, doctorService, orderService, prescriptionService } from '../../services/apiServices';

export default function Home() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [stats, setStats] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [orders, setOrders] = useState([]);
  const [topMeds, setTopMeds] = useState([]);
  const [topDoctors, setTopDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [ordersData, medsData, docsData, rxData] = await Promise.all([
        orderService.getUserOrders(),
        medicineService.getAll({ limit: 4 }),
        doctorService.getAll({ limit: 3 }),
        prescriptionService.getMy()
      ]);

      const fetchedOrders = ordersData.items || [];
      const prescriptions = rxData.items || [];
      
      setOrders(fetchedOrders);
      setRecentOrders(fetchedOrders.slice(0, 3));
      setTopMeds((medsData.items || []).slice(0, 4));
      setTopDoctors((docsData.items || []).slice(0, 3));

      setStats([
        { label: 'Total Orders', value: fetchedOrders.length.toString().padStart(2, '0'), hint: 'Sync Complete', icon: Package, color: 'text-blue-500' },
        { label: 'Active Delivery', value: fetchedOrders.filter(o => o.status !== 'delivered').length.toString().padStart(2, '0'), hint: 'Live Tracking', icon: Truck, color: 'text-emerald-500' },
        { label: 'Prescriptions', value: prescriptions.length.toString().padStart(2, '0'), hint: 'Clinical Vault', icon: ShieldCheck, color: 'text-brand-teal' },
        { label: 'Appointments', value: '00', hint: 'No pending', icon: Calendar, color: 'text-amber-500' }
      ]);
    } catch (err) {
      console.error('Dashboard sync error:', err);
    } finally {
      setLoading(false);
    }
  };

  const QUICK_ACTIONS = [
    { label: 'Upload Prescription', to: '/prescriptions', icon: Upload, desc: 'Upload your prescription' },
    { label: 'Book Doctor', to: '/doctors', icon: Stethoscope, desc: 'Book a doctor appointment' },
    { label: 'Open Wallet', to: '/wallet', icon: Wallet, desc: 'View your wallet balance' },
    { label: 'Order Again', to: '/orders', icon: RotateCcw, desc: 'Reorder previous medicines' }
  ];

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden px-4 md:px-0 pb-32 space-y-12">
      {/* Header Hub */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-4">
        <div className="space-y-3">
           <div className="px-4 py-1.5 bg-teal-500/10 border border-teal-500/20 rounded-xl w-fit flex items-center gap-2 text-[9px] font-black text-teal-600 uppercase tracking-widest">
              <div className="h-1.5 w-1.5 bg-teal-500 rounded-full animate-ping" /> System Status: Online
           </div>
           <h1 className="font-syne font-black text-4xl md:text-6xl text-navy leading-tight tracking-tighter uppercase italic">
             Hello, <br /><span className="text-teal-600">Health Hub</span>
           </h1>
           <p className="text-gray-400 font-dm text-base md:text-lg italic tracking-tight">Your medical overview & quick actions.</p>
        </div>
        <div className="flex items-center gap-4 bg-gray-50 border border-gray-100 p-2 rounded-2xl self-start md:self-auto">
           <div className="h-12 w-12 md:h-16 md:w-16 rounded-xl bg-white shadow-sm flex items-center justify-center text-teal-600 shrink-0"><Bell size={20} /></div>
           <div className="pr-4 md:pr-6">
              <div className="text-[9px] font-black uppercase text-gray-300 tracking-widest">Last Activity</div>
              <div className="text-sm font-bold text-navy truncate">{loading ? 'Syncing...' : 'Updated Now'}</div>
           </div>
        </div>
      </div>

      {loading ? (
        <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-12">
            <div className="relative">
               <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                  className="h-48 w-48 border-[16px] border-[#0a1628]/[0.02] border-t-brand-teal rounded-full"
               />
               <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 size={56} className="animate-spin text-brand-teal/50" />
               </div>
            </div>
            <div className="text-center space-y-3">
               <h3 className="font-syne font-black text-4xl text-[#0a1628] uppercase tracking-tighter italic">Loading Dashboard...</h3>
               <p className="text-[10px] text-gray-300 font-bold uppercase tracking-[0.4em] italic leading-none animate-pulse">Syncing Secure Clinical Data</p>
            </div>
        </div>
      ) : (
        <>
          {/* Order Status Hero */}
          <div className="bg-navy rounded-2xl md:rounded-[3.5rem] p-6 md:p-14 text-white relative overflow-hidden group">
             <div className="absolute top-0 right-0 h-96 w-96 bg-teal-500 opacity-5 rounded-full blur-[100px]" />
             <div className="relative z-10 grid md:grid-cols-[1.5fr_1fr] gap-8 md:gap-12 items-center">
                <div className="space-y-6 md:space-y-8">
                   <div className="space-y-2 md:space-y-4">
                      <div className="text-[9px] font-black uppercase text-teal-400 tracking-widest italic">Live Fulfillment Sync</div>
                      <h2 className="text-3xl md:text-5xl font-syne font-black leading-tight tracking-tighter uppercase">Active Orders</h2>
                      <p className="text-white/40 font-dm italic text-base md:text-lg">
                        {recentOrders[0] ? 'Your current delivery status' : 'No active orders right now'}
                      </p>
                   </div>
                   {recentOrders[0] ? (
                     <div className="flex items-center gap-6 md:gap-10">
                        <div className="space-y-1 min-w-0 flex-1">
                           <div className="text-white/20 text-[8px] md:text-[9px] font-black uppercase tracking-widest">Order ID</div>
                           <div className="text-lg md:text-xl font-syne font-black truncate">#{recentOrders[0].orderNumber}</div>
                        </div>
                        <div className="h-8 md:h-10 w-px bg-white/10" />
                        <div className="space-y-1">
                           <div className="text-white/20 text-[8px] md:text-[9px] font-black uppercase tracking-widest">Status</div>
                           <div className="text-lg md:text-xl font-syne font-black text-teal-400 tracking-widest uppercase">{recentOrders[0].status}</div>
                        </div>
                     </div>
                   ) : null}
                   <button
                     onClick={() => navigate('/orders')}
                     className="w-full sm:w-auto h-14 md:h-16 px-8 md:px-10 bg-white text-navy rounded-xl md:rounded-2xl font-syne font-black text-[10px] md:text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-teal-500 hover:text-white transition-all shadow-xl"
                   >
                      View All Orders ({orders.length}) &rarr;
                   </button>
                </div>
                <div className="relative h-40 md:h-96 rounded-2xl md:rounded-[3rem] bg-white/5 border border-white/10 overflow-hidden hidden md:flex items-center justify-center">
                   <div className="absolute inset-0 bg-[linear-gradient(rgba(2,195,154,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(2,195,154,0.1)_1px,transparent_1px)] bg-[size:20px_20px] opacity-10" />
                   <div className="relative">
                      <div className="h-16 w-16 bg-teal-500/20 rounded-full animate-ping" />
                      <div className="absolute inset-0 flex items-center justify-center">
                         <div className="h-6 w-6 bg-teal-500 rounded-full shadow-2xl border-4 border-navy" />
                      </div>
                   </div>
                </div>
             </div>
          </div>

          {/* Quick Actions Grid */}
          <div className="space-y-6">
             <div className="space-y-1">
                <h2 className="font-syne font-black text-3xl text-[#0a1628] uppercase tracking-tighter italic break-words w-full max-w-full leading-tight">Quick Access</h2>
                <p className="text-[11px] font-black text-gray-300 uppercase tracking-widest">Optimized for you</p>
             </div>
             <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                {QUICK_ACTIONS.map(action => (
                  <Link key={action.label} to={action.to} className="group bg-white border border-gray-50 rounded-2xl md:rounded-3xl p-4 md:p-6 flex flex-col md:flex-row items-center md:items-center gap-3 md:gap-6 hover:shadow-2xl transition-all duration-500 text-center md:text-left">
                     <div className="h-10 w-10 md:h-14 md:w-14 rounded-xl md:rounded-2xl bg-gray-50 text-brand-teal flex items-center justify-center group-hover:bg-[#0a1628] group-hover:text-white transition duration-500 shadow-inner flex-shrink-0"><action.icon size={20}/></div>
                     <div className="space-y-0.5 md:space-y-1 min-w-0">
                        <div className="font-syne font-black text-[10px] md:text-md text-[#0a1628] leading-none uppercase tracking-tight truncate w-full">{action.label}</div>
                        <div className="text-[8px] font-black text-gray-300 uppercase tracking-widest italic truncate hidden md:block">{action.desc}</div>
                     </div>
                     <ChevronRight size={14} className="ml-auto text-gray-200 group-hover:text-brand-teal transition flex-shrink-0 hidden md:block" />
                  </Link>
                ))}
             </div>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((s, idx) => (
              <motion.div 
                key={s.label}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="group bg-white border border-gray-100 rounded-2xl md:rounded-[2.5rem] p-4 md:p-8 hover:shadow-4xl transition-all duration-500 flex flex-col items-center text-center gap-3 md:gap-4"
              >
                 <div className={`h-12 w-12 md:h-16 md:w-16 rounded-2xl bg-gray-50 flex items-center justify-center ${s.color} group-hover:bg-[#0a1628] transition duration-500 shadow-inner overflow-hidden flex-shrink-0`}><s.icon size={24}/></div>
                 <div className="space-y-1">
                    <div className="text-2xl md:text-4xl font-syne font-black text-[#0a1628]">{s.value}</div>
                    <div className="text-[9px] md:text-[10px] font-black text-gray-300 uppercase tracking-widest">{s.label}</div>
                 </div>
              </motion.div>
            ))}
          </div>

           {/* Available Medicines & Active Doctors Split */}
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
             {/* Medicines Node */}
             <div className="bg-white border border-gray-100 rounded-3xl md:rounded-[4rem] p-5 md:p-12 space-y-6 md:space-y-10 hover:shadow-xl transition-all duration-700">
                <div className="flex items-center justify-between gap-4">
                   <div className="space-y-1">
                      <h2 className="font-syne font-black text-2xl md:text-4xl text-navy uppercase tracking-tighter leading-tight">Available Medicines</h2>
                      <p className="text-[10px] md:text-sm text-teal-600 font-black uppercase italic tracking-widest">In stock now</p>
                   </div>
                   <Link to="/medicines" className="h-10 w-10 md:h-12 md:w-12 bg-gray-50 rounded-xl md:rounded-2xl flex items-center justify-center text-gray-300 hover:text-teal-600 transition shrink-0"><ArrowRight size={18}/></Link>
                </div>
                
                <div className="grid grid-cols-2 gap-3 md:gap-6">
                   {topMeds.map((m) => (
                     <div key={m._id} className="bg-gray-50 border border-black/[0.01] rounded-xl md:rounded-[2rem] p-3 md:p-6 space-y-3 md:space-y-6 hover:bg-white hover:shadow-xl transition duration-500 group flex flex-col min-w-0">
                        <div className="space-y-1 min-w-0 flex-1">
                           <div className="text-[7px] md:text-[9px] font-black text-gray-300 uppercase tracking-widest truncate">{m.category}</div>
                           <div className="font-syne font-black text-[11px] md:text-lg text-navy leading-tight uppercase line-clamp-2 min-h-[2.4em]">{m.name}</div>
                           <div className="text-xs md:text-xl font-dm italic text-teal-600 font-black tracking-tight">₹{m.price}</div>
                        </div>
                        <button 
                          onClick={() => navigate(`/medicines/${m._id}`)}
                          className="h-9 md:h-12 w-full bg-navy text-white rounded-lg md:rounded-2xl font-syne font-black text-[8px] md:text-[10px] uppercase tracking-widest hover:bg-teal-500 transition duration-500 shadow-md group-hover:scale-105 active:scale-95"
                        >
                           Add
                        </button>
                     </div>
                   ))}
                </div>
             </div>

            {/* Doctors Personnel */}
            <div className="bg-navy rounded-2xl md:rounded-[4rem] p-6 md:p-12 text-white space-y-8 md:space-y-10 relative overflow-hidden group">
               <div className="absolute bottom-0 left-0 h-64 w-64 bg-teal-500 opacity-[0.03] rounded-full blur-[100px]" />
               <div className="flex items-center justify-between relative z-10 gap-4">
                  <div className="space-y-1 min-w-0">
                     <h2 className="font-syne font-black text-2xl md:text-4xl uppercase tracking-tighter italic leading-tight">Active Doctors</h2>
                     <p className="text-[10px] font-black text-teal-400 uppercase tracking-widest italic">Available specialists</p>
                  </div>
                  <Link to="/doctors" className="h-10 w-10 md:h-12 md:w-12 bg-white/5 rounded-xl md:rounded-2xl flex items-center justify-center text-white/30 hover:text-teal-400 transition shrink-0"><ArrowRight size={18}/></Link>
               </div>

                <div className="grid grid-cols-1 gap-3 md:gap-4 relative z-10">
                  {topDoctors.map((d) => (
                    <div key={d._id} className="bg-white/5 border border-white/10 rounded-xl md:rounded-[2rem] p-4 md:p-6 flex items-center justify-between gap-4 hover:bg-white/10 transition duration-500 group">
                       <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0 pr-2">
                          <div className="h-10 w-10 md:h-16 md:w-16 bg-white/10 rounded-lg md:rounded-2xl flex items-center justify-center font-syne font-black text-lg md:text-2xl text-teal-400 group-hover:bg-teal-500 group-hover:text-white transition duration-500 flex-shrink-0 overflow-hidden shadow-inner">
                             {d.avatar?.url ? <img src={d.avatar.url} className="h-full w-full object-cover" /> : d.name[0]}
                          </div>
                          <div className="space-y-0.5 min-w-0">
                             <div className="font-syne font-black text-xs md:text-base uppercase tracking-tight truncate">{d.name}</div>
                             <div className="text-[8px] md:text-[10px] font-black text-white/30 uppercase tracking-widest italic truncate">{d.doctorProfile?.specialization || 'Clinical Specialist'}</div>
                          </div>
                       </div>
                       <button 
                         onClick={() => navigate(`/doctors/${d._id}`)}
                         className="h-9 px-4 md:px-6 bg-white text-navy rounded-lg md:rounded-xl font-syne font-black text-[8px] md:text-[9px] uppercase tracking-widest hover:bg-teal-500 hover:text-white transition duration-500 shadow-xl flex-shrink-0 active:scale-95"
                       >
                          Book &rarr;
                       </button>
                    </div>
                  ))}
               </div>
            </div>
          </div>

          {/* Transactions History */}
          <div className="bg-white border border-gray-100 rounded-2xl md:rounded-[4rem] p-6 md:p-12 space-y-8 md:space-y-10">
             <div className="flex items-center justify-between gap-4">
                <h2 className="font-syne font-black text-2xl md:text-4xl text-navy uppercase tracking-tighter leading-tight">Transactions</h2>
                <Link to="/orders" className="text-[9px] md:text-[10px] font-black text-teal-600 uppercase tracking-widest italic flex-shrink-0 underline offset-4">History &rarr;</Link>
             </div>
             
             <div className="space-y-3 md:space-y-4">
                {recentOrders.map((o) => (
                  <div key={o._id} className="bg-gray-50 border border-black/[0.01] rounded-2xl p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6 hover:bg-white hover:shadow-xl transition duration-500">
                     <div className="flex items-center gap-4">
                        <div className="h-10 w-10 md:h-12 md:w-12 bg-white rounded-lg md:rounded-xl flex items-center justify-center text-teal-600 shadow-sm shrink-0"><History size={18}/></div>
                        <div className="space-y-0.5 min-w-0">
                           <div className="font-syne font-black text-base md:text-lg text-navy tracking-tight uppercase truncate">#{o.orderNumber}</div>
                           <div className="text-[9px] md:text-[10px] font-black text-gray-300 uppercase tracking-widest italic truncate">
                             {o.items.map(i => i.name).join(', ')}
                           </div>
                        </div>
                     </div>
                     <div className="flex items-center justify-between md:justify-end gap-6 md:gap-10">
                        <div className="text-left md:text-right">
                           <div className="text-lg md:text-xl font-dm italic text-teal-600 font-black tracking-tight">₹{o.totalAmount}</div>
                           <div className="text-[8px] md:text-[9px] font-black text-gray-200 uppercase tracking-widest">{new Date(o.createdAt).toLocaleDateString()}</div>
                        </div>
                        <div className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest italic border ${
                          o.status === 'delivered' ? 'bg-emerald-50 text-emerald-500 border-emerald-100' : 'bg-amber-50 text-amber-500 border-amber-100'
                        }`}>
                           {o.status}
                        </div>
                     </div>
                  </div>
                ))}
             </div>
          </div>
          {recentOrders.length === 0 && (
            <div className="py-20 text-center space-y-4">
               <div className="h-20 w-20 bg-gray-50 rounded-[2.5rem] flex items-center justify-center mx-auto text-gray-200 shadow-inner">
                 <Plus size={40} className="rotate-45" />
               </div>
               <div className="space-y-1">
                 <p className="text-gray-400 font-syne font-black text-lg uppercase italic tracking-tighter">No transactions yet</p>
                 <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em]">Your payment history will appear here</p>
               </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
