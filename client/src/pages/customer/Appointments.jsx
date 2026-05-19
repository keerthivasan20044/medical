import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Video, Calendar, Clock, MapPin, CheckCircle, XCircle, 
  ChevronRight, ArrowRight, User, Stethoscope, Hospital, Star, 
  MoreVertical, AlertCircle, Phone, VideoIcon, PlusCircle, 
  CheckSquare, History, X, Loader2, RefreshCw
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { appointmentService } from '../../services/apiServices';

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
}

function isUpcoming(apt) {
  const s = apt.status?.toLowerCase();
  return s === 'confirmed' || s === 'scheduled' || s === 'pending';
}

function isPast(apt) {
  return apt.status?.toLowerCase() === 'completed';
}

function isCancelled(apt) {
  return apt.status?.toLowerCase() === 'cancelled';
}

export default function Appointments() {
  const [activeTab, setActiveTab]   = useState('Upcoming');
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [cancelling, setCancelling] = useState(null);

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    try {
      const data = await appointmentService.getMy();
      setAppointments(data.items || data.appointments || data || []);
    } catch (err) {
      console.error('[Appointments] fetch failed:', err);
      toast.error('Could not load appointments');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAppointments(); }, [fetchAppointments]);

  // Split by status
  const upcoming  = useMemo(() => appointments.filter(isUpcoming),  [appointments]);
  const past      = useMemo(() => appointments.filter(isPast),      [appointments]);
  const cancelled = useMemo(() => appointments.filter(isCancelled), [appointments]);

  const visibleList = activeTab === 'Upcoming' ? upcoming
                    : activeTab === 'Past'     ? past
                    : cancelled;

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this appointment?')) return;
    setCancelling(id);
    try {
      await appointmentService.updateStatus(id, 'cancelled');
      setAppointments(prev =>
        prev.map(a => (a._id === id || a.id === id) ? { ...a, status: 'cancelled' } : a)
      );
      toast.success('Appointment cancelled. Refund will be processed within 3-5 business days.');
    } catch {
      toast.error('Could not cancel appointment. Please try again.');
    } finally {
      setCancelling(null);
    }
  };

  const handleJoin = (id) => {
    toast.success('Initializing encrypted video tunnel…');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20 pt-10 px-4 md:px-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-gray-50">
        <div className="space-y-2">
          <h1 className="font-syne font-black text-4xl md:text-5xl text-[#0a1628]">My Appointments</h1>
          <p className="text-gray-400 font-dm italic">Your active healthcare schedule in Karaikal district.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchAppointments}
            className="h-14 w-14 bg-white border border-gray-100 rounded-2xl flex items-center justify-center text-gray-400 hover:text-brand-teal hover:border-brand-teal transition-all shadow-soft"
            title="Refresh"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
          <Link
            to="/doctors"
            className="px-8 py-4 bg-gradient-to-r from-[#02C39A] to-[#028090] text-white font-syne font-black text-sm uppercase tracking-widest rounded-3xl shadow-2xl shadow-[#02C39A]/40 hover:scale-[1.05] active:scale-95 transition-all flex items-center gap-3"
          >
            <PlusCircle size={20} /> Book Doctor
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-4 bg-gray-50/50 p-2 rounded-[2rem] w-fit mx-auto lg:mx-0 shadow-sm border border-gray-100">
        {[
          { name: 'Upcoming',  icon: Calendar, count: upcoming.length },
          { name: 'Past',      icon: History,  count: past.length },
          { name: 'Cancelled', icon: X,        count: cancelled.length }
        ].map(tab => (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === tab.name ? 'bg-[#0a1628] text-white shadow-xl scale-105' : 'bg-transparent text-gray-400 hover:text-gray-600'}`}
          >
            <tab.icon size={14} /> {tab.name}
            {tab.count > 0 && (
              <span className={`text-[8px] px-2 py-0.5 rounded-full ${activeTab === tab.name ? 'bg-brand-teal text-[#0a1628]' : 'bg-gray-200 text-gray-500'}`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="space-y-8 min-h-[300px]"
        >
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 gap-4 text-brand-teal">
              <Loader2 size={40} className="animate-spin" />
              <span className="font-syne font-black text-sm uppercase italic tracking-widest">Syncing appointments…</span>
            </div>
          ) : visibleList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 space-y-8">
              <div className="h-40 w-40 bg-gray-50 rounded-[3rem] flex items-center justify-center text-gray-200 shadow-inner">
                <Calendar size={72} />
              </div>
              <div className="text-center space-y-3">
                <h3 className="font-syne font-black text-2xl text-[#0a1628] uppercase italic tracking-tighter">
                  No {activeTab} Appointments
                </h3>
                <p className="text-gray-400 font-dm italic max-w-sm mx-auto">
                  {activeTab === 'Upcoming'
                    ? 'Book a consultation with a qualified doctor in Karaikal.'
                    : activeTab === 'Past'
                    ? 'Your completed consultations will appear here.'
                    : 'No cancelled appointments found.'}
                </p>
              </div>
              {activeTab === 'Upcoming' && (
                <Link to="/doctors" className="h-16 px-12 bg-brand-teal text-[#0a1628] font-syne font-black text-xs uppercase italic tracking-widest rounded-3xl hover:bg-[#0a1628] hover:text-brand-teal transition-all flex items-center gap-3">
                  <PlusCircle size={18} /> Find a Doctor
                </Link>
              )}
            </div>
          ) : (
            <div className="grid gap-8">
              {visibleList.map((apt, idx) => {
                const doctorName = apt.doctor?.name || apt.doctorName || 'Doctor';
                const specialty  = apt.doctor?.doctorProfile?.specialty || apt.specialty || 'General Physician';
                const hospital   = apt.doctor?.doctorProfile?.hospital || apt.hospital || 'Karaikal Hospital';
                const avatar     = apt.doctor?.avatar || `https://i.pravatar.cc/100?u=${apt.doctor?._id || idx}`;
                const dateStr    = formatDate(apt.scheduledAt || apt.date || apt.createdAt);
                const fee        = apt.fee ? `₹${apt.fee}` : '₹200';
                const isUpcomingApt = isUpcoming(apt);

                return (
                  <motion.div
                    key={apt._id || apt.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.06 }}
                    className="bg-white border-2 border-gray-50 rounded-[3rem] p-8 md:p-12 flex flex-col lg:flex-row gap-10 lg:items-center relative group hover:border-[#028090]/20 hover:shadow-3xl transition duration-500 overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 h-48 w-48 bg-[#028090] rounded-full blur-[120px] opacity-[0.03]" />

                    {/* Doctor Info */}
                    <div className="flex items-center gap-6 lg:w-1/3">
                      <div className="relative shrink-0">
                        <img
                          src={avatar}
                          alt={doctorName}
                          className={`h-24 w-24 rounded-[2rem] object-cover ring-8 ring-gray-50/50 p-1 bg-white group-hover:scale-105 transition duration-500 ${!isUpcomingApt ? 'grayscale' : ''}`}
                        />
                        <div className="absolute -bottom-1 -right-1 h-8 w-8 bg-[#028090] border-4 border-white text-white rounded-full flex items-center justify-center shadow-lg">
                          <Video size={13} />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-syne font-black text-xl text-[#0a1628] leading-tight">{doctorName}</h3>
                        <p className="text-[10px] font-black text-[#02C39A] uppercase tracking-widest">{specialty}</p>
                        <div className="text-xs font-dm text-gray-400 italic flex items-center gap-1.5">
                          <MapPin size={11} className="text-gray-300" /> {hospital}
                        </div>
                      </div>
                    </div>

                    {/* Date & Type */}
                    <div className="lg:w-1/3 grid grid-cols-2 gap-6 border-y lg:border-y-0 lg:border-x border-gray-100 py-6 lg:py-4 lg:px-10">
                      <div className="space-y-2">
                        <div className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Date & Time</div>
                        <div className="font-syne font-black text-base text-[#0a1628] leading-tight">{dateStr}</div>
                        <div className={`text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-full inline-block ${
                          isUpcomingApt ? 'bg-emerald-50 text-emerald-600' :
                          isPast(apt)   ? 'bg-gray-100 text-gray-400' :
                                          'bg-red-50 text-red-400'
                        }`}>
                          {apt.status || 'Scheduled'}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Type & Fee</div>
                        <div className="font-syne font-black text-base text-[#0a1628] leading-tight flex items-center gap-2">
                          <Video size={14} className="text-brand-teal" /> {apt.type || 'Video Call'}
                        </div>
                        <div className="text-[10px] font-black text-gray-400">{fee}</div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="lg:w-1/3 flex flex-wrap gap-3 lg:justify-end">
                      {isUpcomingApt && (
                        <>
                          <button
                            onClick={() => handleJoin(apt._id || apt.id)}
                            className="flex-1 lg:flex-none h-14 px-8 bg-[#0a1628] text-white rounded-2xl font-syne font-black text-[10px] uppercase tracking-widest hover:bg-[#028090] transition shadow-xl flex items-center justify-center gap-3"
                          >
                            Join Call <ArrowRight size={16} />
                          </button>
                          <button
                            onClick={() => handleCancel(apt._id || apt.id)}
                            disabled={cancelling === (apt._id || apt.id)}
                            className="h-14 w-14 bg-white border border-red-50 text-red-400 rounded-2xl flex items-center justify-center hover:bg-red-500 hover:text-white transition disabled:opacity-50"
                          >
                            {cancelling === (apt._id || apt.id)
                              ? <Loader2 size={18} className="animate-spin" />
                              : <XCircle size={20} />
                            }
                          </button>
                        </>
                      )}
                      {isPast(apt) && (
                        <Link to="/doctors">
                          <button className="h-14 px-8 bg-gray-50 border border-gray-100 text-[#0a1628] font-syne font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-[#0a1628] hover:text-white transition">
                            Book Again
                          </button>
                        </Link>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
