import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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
  Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { medicineService, doctorService, orderService, prescriptionService } from '../../services/apiServices';

export default function Home() {
  const { t } = useLanguage();
  const [stats, setStats] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
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

      const orders = ordersData.items || [];
      const prescriptions = rxData.items || [];
      
      setRecentOrders(orders.slice(0, 3));
      setTopMeds((medsData.items || []).slice(0, 4));
      setTopDoctors((docsData.items || []).slice(0, 3));

      setStats([
        { label: t('totalOrders'), value: orders.length.toString().padStart(2, '0'), hint: 'Sync Complete', icon: Package, color: 'text-blue-500' },
        { label: t('activeDelivery'), value: orders.filter(o => o.status !== 'delivered').length.toString().padStart(2, '0'), hint: 'Live Tracking', icon: Truck, color: 'text-emerald-500' },
        { label: t('prescriptions'), value: prescriptions.length.toString().padStart(2, '0'), hint: 'Clinical Vault', icon: ShieldCheck, color: 'text-brand-teal' },
        { label: t('appointments'), value: '00', hint: 'No pending', icon: Calendar, color: 'text-amber-500' }
      ]);
    } catch (err) {
      console.error('Dashboard sync error:', err);
    } finally {
      setLoading(false);
    }
  };

  const QUICK_ACTIONS = [
    { label: t('uploadPrescription'), to: '/prescriptions', icon: Upload, desc: 'Sync medical data' },
    { label: t('bookDoctor'), to: '/doctors', icon: Stethoscope, desc: 'Consult specialists' },
    { label: t('openWallet'), to: '/wallet', icon: Wallet, desc: 'Manage credits' },
    { label: t('orderAgain'), to: '/orders', icon: History, desc: 'Quick re-sync' }
  ];

  return (
    <div className="space-y-12 pb-20">
      {/* Header Hub */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pt-4">
        <div className="space-y-4">
           <div className="px-5 py-2 bg-brand-teal/10 border border-brand-teal/20 rounded-2xl w-fit flex items-center gap-2 text-[10px] font-black text-brand-teal uppercase tracking-[0.2em]">
              <div className="h-1.5 w-1.5 bg-brand-teal rounded-full animate-ping" /> Central Intelligence Hub v4.2
           </div>
           <h1 className="font-syne font-black text-4xl sm:text-6xl text-[#0a1628] leading-none tracking-tighter uppercase italic">{t('welcomeTitle')}</h1>
           <p className="text-gray-400 font-dm text-lg italic tracking-tight">{t('welcomeSubtitle')}</p>
        </div>
        <div className="flex items-center gap-4 bg-gray-50 border border-gray-100 p-2 rounded-3xl">
           <div className="h-16 w-16 rounded-2xl bg-white shadow-sm flex items-center justify-center text-brand-teal"><Bell size={24} /></div>
           <div className="pr-6">
              <div className="text-[10px] font-black uppercase text-gray-300 tracking-widest">{t('lastSync')}</div>
              <div className="text-sm font-bold text-[#0a1628]">{loading ? 'Syncing...' : 'Synced Now'}</div>
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
               <h3 className="font-syne font-black text-4xl text-[#0a1628] uppercase tracking-tighter italic">Initializing Hub...</h3>
               <p className="text-[10px] text-gray-300 font-bold uppercase tracking-[0.4em] italic leading-none animate-pulse">Establishing Secure Clinical Tunnel</p>
            </div>
        </div>
      ) : (
        <>
          {/* Telemetry Stats Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((s, idx) => (
              <motion.div 
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="group bg-white border border-gray-100 rounded-[2.5rem] p-8 hover:shadow-4xl transition-all duration-500 hover:-translate-y-2 relative overflow-hidden"
              >
                <div className="flex justify-between items-start mb-6">
                   <div className={`h-14 w-14 rounded-2xl bg-gray-50 flex items-center justify-center ${s.color} group-hover:bg-[#0a1628] transition duration-500 shadow-inner`}><s.icon size={28}/></div>
                   <div className="text-[10px] font-black text-gray-300 uppercase tracking-widest italic">{s.hint}</div>
                </div>
                <div className="space-y-1">
                   <div className="text-4xl font-syne font-black text-[#0a1628] group-hover:scale-110 transition duration-500 origin-left">{s.value}</div>
                   <div className="text-[11px] font-black text-gray-400 uppercase tracking-widest">{s.label}</div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Primary Dashboard Modules */}
          <div className="grid lg:grid-cols-12 gap-10">
            {/* Real-time Order Tracking Terminal */}
            <div className="lg:col-span-12 xl:col-span-8 bg-[#0a1628] rounded-3xl md:rounded-[3.5rem] p-8 md:p-14 text-white relative overflow-hidden group">
               <div className="absolute top-0 right-0 h-96 w-96 bg-brand-teal opacity-5 rounded-full blur-[100px]" />
               <div className="relative z-10 grid md:grid-cols-[1.5fr_1fr] gap-12 items-center">
                  <div className="space-y-8">
                     <div className="space-y-4">
                        <div className="text-[10px] font-black uppercase text-brand-teal tracking-[0.4em] italic mb-2">Live Fulfillment Sync</div>
                        <h2 className="text-5xl font-syne font-black leading-tight tracking-tighter uppercase">{t('incomingFulfillment')}</h2>
                        <p className="text-white/40 font-dm italic text-lg">{t('fulfillmentStatusText')}</p>
                     </div>
                     {recentOrders[0] ? (
                       <div className="flex items-center gap-10">
                          <div className="space-y-1">
                             <div className="text-white/20 text-[9px] font-black uppercase tracking-widest">Protocol Index</div>
                             <div className="text-xl font-syne font-black">#{recentOrders[0].orderNumber}</div>
                          </div>
                          <div className="h-10 w-px bg-white/10" />
                          <div className="space-y-1">
                             <div className="text-white/20 text-[9px] font-black uppercase tracking-widest">Current Node</div>
                             <div className="text-xl font-syne font-black text-brand-teal tracking-widest uppercase">{recentOrders[0].status}</div>
                          </div>
                       </div>
                     ) : (
                       <p className="text-white/20 font-syne font-black text-xs uppercase italic tracking-widest">No active clinical handshakes.</p>
                     )}
                     <Link to="/orders" className="inline-flex h-16 px-10 bg-white text-[#0a1628] rounded-2xl font-syne font-black text-xs uppercase tracking-[0.2em] items-center gap-4 hover:bg-brand-teal hover:text-white transition-all shadow-4xl">
                        VIEW ALL ORDERS &rarr;
                     </Link>
                  </div>
                  <div className="relative h-96 rounded-[3rem] bg-white/5 border border-white/10 overflow-hidden group-hover:shadow-[0_0_100px_rgba(2,195,154,0.1)] transition-all">
                     <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/dark-v10/static/81.8286,10.9254,14,0/800x800?access_token=YOUR_TOKEN')] opacity-40 grayscale brightness-150 rotate-12 scale-150" />
                     <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628] via-transparent to-transparent" />
                     <div className="absolute inset-0 flex items-center justify-center">
                        <div className="relative">
                           <div className="h-20 w-20 bg-brand-teal/20 rounded-full animate-ping" />
                           <div className="absolute inset-0 flex items-center justify-center">
                              <div className="h-8 w-8 bg-brand-teal rounded-full shadow-2xl border-4 border-[#0a1628]" />
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* Quick Actions Enclave */}
            <div className="lg:col-span-12 xl:col-span-4 bg-gray-50 border border-gray-100 rounded-[3.5rem] p-12 space-y-10">
               <div className="space-y-2">
                  <h3 className="font-syne font-black text-3xl text-[#0a1628] uppercase tracking-tighter italic">{t('quickAccessTerminal')}</h3>
                  <p className="text-[11px] font-black text-gray-300 uppercase tracking-widest">{t('optimizedEfficiency')}</p>
               </div>
               <div className="grid grid-cols-1 gap-4">
                  {QUICK_ACTIONS.map(action => (
                    <Link key={action.label} to={action.to} className="group bg-white border border-gray-50 rounded-3xl p-6 flex items-center gap-6 hover:shadow-2xl transition-all duration-500 hover:-translate-x-2">
                       <div className="h-14 w-14 rounded-2xl bg-gray-50 text-brand-teal flex items-center justify-center group-hover:bg-[#0a1628] group-hover:text-white transition duration-500 shadow-inner"><action.icon size={24}/></div>
                       <div className="space-y-1">
                          <div className="font-syne font-black text-md text-[#0a1628] leading-none uppercase tracking-tight">{action.label}</div>
                          <div className="text-[9px] font-black text-gray-300 uppercase tracking-widest italic">{action.desc}</div>
                       </div>
                       <ChevronRight size={16} className="ml-auto text-gray-200 group-hover:text-brand-teal transition" />
                    </Link>
                  ))}
               </div>
            </div>
          </div>

          {/* Intelligence Nodes: Meds & Doctors */}
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Pharmacy Intelligence Node */}
            <div className="bg-white border border-gray-100 rounded-[4rem] p-12 space-y-10 hover:shadow-4xl transition-all duration-700">
               <div className="flex items-center justify-between">
                  <div className="space-y-1">
                     <h3 className="font-syne font-black text-4xl text-[#0a1628] uppercase tracking-tighter">{t('inventoryProtocol')}</h3>
                     <div className="text-[10px] font-black text-brand-teal uppercase tracking-widest italic">{t('availableToSync')}</div>
                  </div>
                  <Link to="/medicines" className="h-12 w-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-300 hover:text-brand-teal transition"><ArrowRight size={20}/></Link>
               </div>
               
               <div className="grid sm:grid-cols-2 gap-6">
                  {topMeds.map((m) => (
                    <div key={m._id} className="bg-gray-50 border border-gray-100 rounded-[2.5rem] p-8 space-y-6 hover:bg-white hover:shadow-2xl transition duration-500 group">
                       <div className="space-y-2">
                          <div className="text-[9px] font-black text-gray-300 uppercase tracking-widest">{m.category}</div>
                          <div className="font-syne font-black text-xl text-[#0a1628] leading-tight uppercase line-clamp-1">{m.name}</div>
                          <div className="text-xl font-dm italic text-brand-teal font-black tracking-tight">&#8377;{m.price}</div>
                       </div>
                       <Link to={`/medicines/${m._id}`} className="block">
                         <button className="h-12 w-full bg-[#0a1628] text-white rounded-2xl font-syne font-black text-[10px] uppercase tracking-widest hover:bg-brand-teal transition duration-500 shadow-xl group-hover:scale-105">
                            {t('initializeSync')}
                         </button>
                       </Link>
                    </div>
                  ))}
               </div>
            </div>

            {/* Medical Personnel Enclave */}
            <div className="bg-[#0a1628] rounded-[4rem] p-12 text-white space-y-10 relative overflow-hidden group">
               <div className="absolute bottom-0 left-0 h-64 w-64 bg-brand-teal opacity-[0.03] rounded-full blur-[100px]" />
               <div className="flex items-center justify-between relative z-10">
                  <div className="space-y-1">
                     <h3 className="font-syne font-black text-4xl uppercase tracking-tighter italic">{t('medicalConsultants')}</h3>
                     <div className="text-[10px] font-black text-brand-teal uppercase tracking-widest italic">{t('activeSpecialists')}</div>
                  </div>
                  <Link to="/doctors" className="h-12 w-12 bg-white/5 rounded-2xl flex items-center justify-center text-white/30 hover:text-brand-teal transition"><ArrowRight size={20}/></Link>
               </div>

               <div className="space-y-4 relative z-10">
                  {topDoctors.map((d) => (
                    <div key={d._id} className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 flex flex-wrap items-center justify-between gap-6 hover:bg-white/10 transition duration-500 group">
                       <div className="flex items-center gap-6">
                          <div className="h-16 w-16 bg-white/10 rounded-2xl flex items-center justify-center font-syne font-black text-2xl text-brand-teal group-hover:bg-brand-teal group-hover:text-white transition duration-500">
                             {d.avatar?.url ? <img src={d.avatar.url} className="h-full w-full object-cover rounded-2xl shadow-inner" /> : d.name[0]}
                          </div>
                          <div className="space-y-1">
                             <div className="font-syne font-black text-md uppercase tracking-tight">{d.name}</div>
                             <div className="text-[10px] font-black text-white/30 uppercase tracking-widest italic">{d.doctorProfile?.specialization || 'Clinical Specialist'}</div>
                          </div>
                       </div>
                       <Link to={`/doctors/${d._id}`}>
                          <button className="h-14 px-10 bg-white text-[#0a1628] rounded-2xl font-syne font-black text-[10px] uppercase tracking-widest hover:bg-brand-teal hover:text-white transition duration-500 shadow-2xl">
                             {t('bookSession')}
                          </button>
                       </Link>
                    </div>
                  ))}
               </div>
            </div>
          </div>

          {/* History & Categories Interface */}
          <div className="grid lg:grid-cols-12 gap-12">
            {/* Recent Transactions Protocol */}
            <div className="lg:col-span-8 bg-white border border-gray-100 rounded-[4rem] p-12 space-y-10">
               <div className="flex items-center justify-between">
                  <h3 className="font-syne font-black text-3xl text-[#0a1628] uppercase tracking-tighter">{t('transactionHistory')}</h3>
                  <Link to="/orders" className="text-[10px] font-black text-brand-teal uppercase tracking-widest italic">{t('fullArchive')} &rarr;</Link>
               </div>
               
               <div className="space-y-4">
                  {recentOrders.map((o) => (
                    <div key={o._id} className="bg-gray-50 border border-gray-50 rounded-[2.5rem] p-8 flex flex-col md:flex-row md:items-center justify-between gap-8 hover:bg-white hover:shadow-2xl transition duration-500">
                       <div className="flex items-center gap-6">
                          <div className="h-14 w-14 bg-white rounded-2xl flex items-center justify-center text-brand-teal shadow-sm"><History size={24}/></div>
                          <div className="space-y-1">
                             <div className="font-syne font-black text-lg text-[#0a1628] tracking-tight uppercase line-clamp-1">{o.orderNumber}</div>
                             <div className="text-[10px] font-black text-gray-300 uppercase tracking-widest italic line-clamp-1">{o.items.map(i => i.name || 'Clinical Item').join(', ')}</div>
                          </div>
                       </div>
                       <div className="flex items-center gap-12">
                          <div className="text-right">
                             <div className="text-xl font-dm italic text-brand-teal font-black tracking-tight">&#8377;{o.totalAmount}</div>
                             <div className="text-[10px] font-black text-gray-200 uppercase tracking-widest">{new Date(o.createdAt).toLocaleDateString()}</div>
                          </div>
                          <div className={`px-6 py-2 rounded-full text-[9px] font-black uppercase tracking-widest italic border ${
                            o.status === 'delivered' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                          }`}>
                             {o.status.toUpperCase()}
                          </div>
                       </div>
                    </div>
                  ))}
                  {recentOrders.length === 0 && (
                    <div className="py-20 text-center space-y-6">
                       <div className="h-20 w-20 bg-gray-50 rounded-[2rem] flex items-center justify-center mx-auto text-gray-200 shadow-inner"><Package size={32}/></div>
                       <div className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] italic">No transaction nodes detected in history.</div>
                    </div>
                  )}
               </div>
            </div>

            {/* Health Infrastructure Node */}
            <div className="lg:col-span-4 bg-gray-50 border border-gray-100 rounded-[4rem] p-12 space-y-10">
               <h3 className="font-syne font-black text-3xl text-[#0a1628] uppercase tracking-tighter italic">Infrastructure</h3>
               <div className="space-y-4">
                  {[
                    { label: 'Pharmacy Nodes', val: '128 Active', icon: MapPin },
                    { label: 'Verified Staff', val: '430 Personnel', icon: ShieldCheck },
                    { label: 'Uptime Sync', val: '99.9% Digital', icon: Zap }
                  ].map(item => (
                    <div key={item.label} className="bg-white border border-gray-50 rounded-3xl p-6 flex items-center gap-5 hover:shadow-xl transition-all duration-500 group">
                       <div className="h-12 w-12 bg-gray-50 text-gray-300 rounded-2xl flex items-center justify-center group-hover:bg-[#0a1628] group-hover:text-brand-teal transition duration-500"><item.icon size={20}/></div>
                       <div className="space-y-1">
                          <div className="text-[10px] font-black text-gray-300 uppercase tracking-widest italic leading-none">{item.label}</div>
                          <div className="font-syne font-black text-lg text-[#0a1628] uppercase tracking-tight">{item.val}</div>
                       </div>
                    </div>
                  ))}
               </div>
               
               <div className="pt-6 border-t border-gray-100">
                  <Link to="/pharmacies" className="w-full h-16 bg-white border border-gray-200 rounded-2xl font-syne font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-[#0a1628] hover:text-white transition duration-500 shadow-soft">
                     {t('locateNearestNode')} <Plus size={16}/>
                  </Link>
               </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}



