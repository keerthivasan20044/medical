import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Navigation, IndianRupee, Store, Clock, Zap, Map as MapIcon, List, Filter, Search, AlertCircle } from 'lucide-react';
import { useDelivery } from '../../hooks/useDelivery';
import DeliveryMap from '../../components/delivery/DeliveryMap';
import toast from 'react-hot-toast';

export default function DeliveryAvailable() {
  const { availableTasks, fetchAvailable, acceptTask, loading } = useDelivery();
  const [viewMode, setViewMode] = useState('list');
  const [filterRadius, setFilterRadius] = useState(5); // km

  useEffect(() => {
    fetchAvailable();
  }, []);

  const handleAccept = async (id) => {
    try {
      await acceptTask(id);
      // Success handled in hook
    } catch (err) {
      // Error handled in hook
    }
  };

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col">
      {/* Header with Filters */}
      <div className="p-6 md:p-10 space-y-8 bg-white border-b border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="font-syne font-black text-4xl text-navy italic tracking-tighter uppercase">Discovery Hub</h1>
            <p className="text-xs font-dm font-bold text-navy/40 uppercase tracking-widest mt-1 italic">Real-time Regional Task Synchronization</p>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="flex bg-gray-50 p-1.5 rounded-[1.8rem] border border-gray-100 shadow-sm">
                <button 
                  onClick={() => setViewMode('list')}
                  className={`px-6 py-2.5 rounded-[1.5rem] text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                    viewMode === 'list' ? 'bg-navy text-white shadow-lg shadow-navy/20' : 'text-navy/40 hover:text-navy hover:bg-gray-50'
                  }`}
                >
                  <List size={14} /> List
                </button>
                <button 
                  onClick={() => setViewMode('map')}
                  className={`px-6 py-2.5 rounded-[1.5rem] text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                    viewMode === 'map' ? 'bg-navy text-white shadow-lg shadow-navy/20' : 'text-navy/40 hover:text-navy hover:bg-gray-50'
                  }`}
                >
                  <MapIcon size={14} /> Map
                </button>
             </div>
             
             <div className="h-10 w-[1px] bg-gray-100 mx-2" />
             
             <button className="h-12 w-12 bg-white border border-gray-100 rounded-xl flex items-center justify-center text-navy/40 hover:text-brand-teal transition-all">
                <Filter size={20} />
             </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center gap-4">
           <div className="flex items-center gap-3 px-6 py-3 bg-gray-50 border border-gray-100 rounded-2xl">
              <span className="text-[10px] font-black text-navy/40 uppercase tracking-widest italic">Radius</span>
              <input 
                type="range" min="1" max="20" step="1" 
                value={filterRadius} 
                onChange={(e) => setFilterRadius(e.target.value)}
                className="w-32 accent-brand-teal" 
              />
              <span className="text-[10px] font-black text-navy uppercase italic">{filterRadius}km</span>
           </div>
           {['Urgent', 'Regular', 'Standard'].map(type => (
             <button key={type} className="px-6 py-3 bg-white border border-gray-100 rounded-2xl text-[10px] font-black text-navy/40 uppercase tracking-widest italic hover:border-brand-teal hover:text-navy transition-all">
                {type}
             </button>
           ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden relative">
        {viewMode === 'list' ? (
          <div className="h-full overflow-y-auto p-6 md:p-10">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                <AnimatePresence>
                   {availableTasks.length > 0 ? (
                      availableTasks.map((task, idx) => (
                        <motion.div
                          key={task._id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ delay: idx * 0.05 }}
                          className="bg-white rounded-[3rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-navy/5 transition-all group overflow-hidden relative"
                        >
                           <div className="absolute top-0 right-0 h-2 w-full bg-brand-teal opacity-20 group-hover:opacity-100 transition-opacity" />
                           
                           <div className="p-8 space-y-6">
                              <div className="flex items-start justify-between">
                                 <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                       <div className="h-1.5 w-1.5 rounded-full bg-brand-teal animate-pulse" />
                                       <div className="text-[10px] font-black text-navy/20 uppercase tracking-widest italic">Node Sync Active</div>
                                    </div>
                                    <h3 className="font-syne font-black text-xl text-navy uppercase italic">{task.pharmacyId?.name || 'Node Unknown'}</h3>
                                 </div>
                                 <div className="h-12 w-12 bg-navy/5 rounded-2xl flex items-center justify-center text-navy/40 group-hover:text-brand-teal group-hover:bg-navy transition-all shadow-sm">
                                    <Store size={24} />
                                 </div>
                              </div>

                              <div className="space-y-4">
                                 <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 bg-brand-teal/10 rounded-lg flex items-center justify-center text-brand-teal">
                                       <MapPin size={16} />
                                    </div>
                                    <div>
                                       <div className="text-[8px] font-black text-navy/20 uppercase tracking-widest italic leading-none mb-1">Pickup</div>
                                       <div className="text-xs font-dm font-bold text-navy italic">{task.pharmacyId?.address || 'Karaikal'}</div>
                                    </div>
                                 </div>
                                 <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 bg-navy/5 rounded-lg flex items-center justify-center text-navy/40">
                                       <Navigation size={16} />
                                    </div>
                                    <div>
                                       <div className="text-[8px] font-black text-navy/20 uppercase tracking-widest italic leading-none mb-1">Drop Sector</div>
                                       <div className="text-xs font-dm font-bold text-navy/60 italic">{task.deliveryAddress?.split(',')[0] || 'Nagore Rd'}</div>
                                    </div>
                                 </div>
                              </div>

                              <div className="flex items-center justify-between pt-6 border-t border-gray-100 mt-4">
                                 <div className="flex items-center gap-4">
                                    <div className="text-center">
                                       <div className="text-[9px] font-black text-navy/20 uppercase tracking-widest italic leading-none">Net Payout</div>
                                       <div className="text-xl font-syne font-black text-navy italic tracking-tighter">₹{task.deliveryFare || 45}</div>
                                    </div>
                                    <div className="h-8 w-[1px] bg-gray-100" />
                                    <div className="text-center">
                                       <div className="text-[9px] font-black text-navy/20 uppercase tracking-widest italic leading-none">Dist</div>
                                       <div className="text-xl font-syne font-black text-navy italic tracking-tighter">2.4<span className="text-[10px] ml-0.5">KM</span></div>
                                    </div>
                                 </div>
                                 <button 
                                   onClick={() => handleAccept(task._id)}
                                   className="h-12 px-6 bg-brand-teal text-navy rounded-xl font-syne font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-brand-teal/20"
                                 >
                                   Accept Mission
                                 </button>
                              </div>
                           </div>
                        </motion.div>
                      ))
                   ) : (
                      <div className="col-span-full h-[400px] flex flex-col items-center justify-center text-center space-y-6">
                         <div className="h-20 w-20 bg-navy/5 rounded-[2.5rem] flex items-center justify-center text-navy/10">
                            <Zap size={40} />
                         </div>
                         <div className="space-y-1">
                            <h3 className="font-syne font-black text-2xl text-navy uppercase italic">Sector Clear</h3>
                            <p className="text-xs font-dm font-bold text-navy/40 uppercase tracking-widest italic">No pending distribution tasks in your vicinity.</p>
                         </div>
                         <button 
                           onClick={fetchAvailable}
                           className="h-14 px-8 bg-white border border-navy/10 text-navy rounded-2xl font-syne font-black text-xs uppercase tracking-widest hover:bg-navy hover:text-white transition-all shadow-sm"
                         >
                            Force Registry Sync
                         </button>
                      </div>
                   )}
                </AnimatePresence>
             </div>
          </div>
        ) : (
          <div className="h-full">
             <DeliveryMap tasks={availableTasks} />
          </div>
        )}
      </div>
    </div>
  );
}
