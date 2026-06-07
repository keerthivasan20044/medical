import { useState, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, Package, ShieldCheck, Tag, Info, 
  Trash2, CheckCircle, Clock, ArrowRight,
  MoreVertical, Calendar, Zap, Activity, Truck,
  RefreshCw, Loader2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { notificationService } from '../../services/apiServices';
import { socketService } from '../../services/socket';

// Map backend type strings to lucide icons + styles
const TYPE_META = {
  order:        { icon: Truck,       bg: 'bg-brand-teal/10 text-brand-teal' },
  prescription: { icon: ShieldCheck, bg: 'bg-emerald-50 text-emerald-500' },
  offer:        { icon: Tag,         bg: 'bg-purple-50 text-purple-500' },
  system:       { icon: Activity,    bg: 'bg-blue-50 text-blue-500' },
  default:      { icon: Bell,        bg: 'bg-gray-100 text-gray-400' },
};

function getTypeMeta(type) {
  return TYPE_META[type] || TYPE_META.default;
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1)  return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)  return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7)  return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

function dateGroup(dateStr) {
  const d    = new Date(dateStr);
  const now  = new Date();
  const diff = Math.floor((now - d) / 86400000);
  if (diff < 1)  return 'Today';
  if (diff < 2)  return 'Yesterday';
  return 'Earlier';
}

export default function NotificationsPage() {
  const user = useSelector(s => s.auth?.user);
  const [notifs, setNotifs]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  // ── Fetch from backend ──────────────────────────────────────────────
  const fetchNotifs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await notificationService.getAll();
      setNotifs(data.items || []);
    } catch (err) {
      console.error('[Notifications] fetch failed:', err);
      setError('Could not load notifications. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchNotifs(); }, [fetchNotifs]);

  // ── Socket.io — live push ────────────────────────────────────────────
  useEffect(() => {
    const sock = socketService.socket;
    if (!sock) return;
    const handler = (newNotif) => {
      setNotifs(prev => [newNotif, ...prev]);
    };
    sock.on('notification:new', handler);
    return () => sock.off('notification:new', handler);
  }, []);

  // ── Actions ─────────────────────────────────────────────────────────
  const markRead = async (id) => {
    setNotifs(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
    try { await notificationService.markRead(id); } catch { /* optimistic */ }
  };

  const markAllRead = async () => {
    setNotifs(prev => prev.map(n => ({ ...n, isRead: true })));
    try { await notificationService.markAllRead(); } catch { /* optimistic */ }
  };

  // Client-side delete only (no backend delete endpoint)
  const deleteNotif = (id) => {
    setNotifs(prev => prev.filter(n => n._id !== id));
  };

  // ── Group by date ────────────────────────────────────────────────────
  const grouped = useMemo(() => {
    const groups = { Today: [], Yesterday: [], Earlier: [] };
    notifs.forEach(n => {
      const g = dateGroup(n.createdAt);
      groups[g].push(n);
    });
    return groups;
  }, [notifs]);

  const unreadCount = notifs.filter(n => !n.isRead).length;

  // ── Render ───────────────────────────────────────────────────────────
  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-32 pt-8 px-4 md:px-0">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="px-5 py-2 bg-[#0a1628] rounded-xl w-fit flex items-center gap-3 text-[10px] font-black text-brand-teal uppercase tracking-[0.4em] italic">
            <Bell size={14} className="animate-shake" /> Transmission Stream
          </div>
          <h1 className="font-syne font-black text-5xl md:text-7xl text-[#0a1628] uppercase italic leading-none tracking-tighter">
            Page <span className="text-brand-teal">Alerts</span>
          </h1>
          {unreadCount > 0 && (
            <p className="text-sm font-dm font-bold text-gray-400 italic">
              {unreadCount} unread message{unreadCount > 1 ? 's' : ''}
            </p>
          )}
        </div>

        <div className="flex gap-4">
          <button
            onClick={fetchNotifs}
            className="h-16 w-16 bg-white border border-black/[0.03] rounded-2xl flex items-center justify-center text-gray-400 hover:text-brand-teal hover:border-brand-teal transition-all shadow-soft"
            title="Refresh"
          >
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
          </button>
          <button
            onClick={markAllRead}
            disabled={unreadCount === 0}
            className="h-16 px-8 bg-white border border-black/[0.03] text-[#0a1628] font-syne font-black text-[10px] uppercase italic tracking-widest rounded-2xl hover:bg-[#0a1628] hover:text-brand-teal transition-all shadow-soft disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Mark All Read
          </button>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-32 gap-4 text-brand-teal">
          <Loader2 size={32} className="animate-spin" />
          <span className="font-syne font-black text-sm uppercase italic tracking-widest">Updateing Stream…</span>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="flex flex-col items-center gap-6 py-24 text-center">
          <div className="h-24 w-24 bg-red-50 rounded-[2rem] flex items-center justify-center text-red-400">
            <Info size={40} />
          </div>
          <p className="font-syne font-black text-xl text-[#0a1628] uppercase italic">{error}</p>
          <button onClick={fetchNotifs} className="h-14 px-10 bg-[#0a1628] text-brand-teal rounded-2xl font-syne font-black text-[10px] uppercase tracking-widest italic hover:bg-brand-teal hover:text-[#0a1628] transition-all">
            Retry
          </button>
        </div>
      )}

      {/* Main list */}
      {!loading && !error && (
        <div className="space-y-16">
          {Object.entries(grouped).map(([date, items]) => items.length > 0 && (
            <div key={date} className="space-y-8">
              <div className="flex items-center gap-6">
                <div className="h-px flex-1 bg-black/[0.03]" />
                <h3 className="font-syne font-black text-xs text-gray-300 uppercase italic tracking-[0.4em] whitespace-nowrap">
                  {date} Matrix
                </h3>
                <div className="h-px flex-1 bg-black/[0.03]" />
              </div>

              <div className="grid gap-6">
                <AnimatePresence mode="popLayout">
                  {items.map((n, idx) => {
                    const { icon: Icon, bg } = getTypeMeta(n.type);
                    return (
                      <motion.div
                        layout
                        key={n._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ delay: idx * 0.04 }}
                        className={`bg-white border border-black/[0.03] rounded-[2.5rem] md:rounded-[3.5rem] p-8 md:p-10 flex flex-col md:flex-row gap-8 items-start md:items-center shadow-soft hover:shadow-4xl transition-all duration-700 relative overflow-hidden group ${!n.isRead ? 'border-l-[6px] border-brand-teal' : 'border-l-[6px] border-gray-100'}`}
                        onClick={() => markRead(n._id)}
                      >
                        <div className={`h-16 w-16 rounded-3xl flex items-center justify-center shrink-0 shadow-sm transition-all duration-700 group-hover:scale-110 ${bg}`}>
                          <Icon size={28} />
                        </div>

                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-4">
                            <span className="text-[10px] font-black uppercase tracking-widest text-[#0a1628]">
                              {n.type || 'System'} Service
                            </span>
                            <span className="text-[9px] text-gray-300 font-bold uppercase tracking-widest italic">
                              {timeAgo(n.createdAt)}
                            </span>
                            {!n.isRead && (
                              <span className="h-2 w-2 rounded-full bg-brand-teal animate-pulse" />
                            )}
                          </div>
                          <h4 className={`font-syne font-black text-xl md:text-2xl uppercase italic tracking-tighter transition ${!n.isRead ? 'text-[#0a1628]' : 'text-gray-400'}`}>
                            {n.title}
                          </h4>
                          <p className="text-gray-400 font-dm italic text-base font-bold leading-relaxed">
                            {n.body}
                          </p>
                          {n.link && (
                            <Link
                              to={n.link}
                              className="inline-flex items-center gap-2 text-[10px] font-black text-brand-teal uppercase tracking-widest italic hover:gap-4 transition-all mt-2"
                              onClick={e => e.stopPropagation()}
                            >
                              View Details <ArrowRight size={12} />
                            </Link>
                          )}
                        </div>

                        <div className="flex gap-4 w-full md:w-auto">
                          {!n.isRead && (
                            <button
                              className="flex-1 md:flex-none h-14 px-6 bg-brand-teal/10 text-brand-teal font-syne font-black text-[9px] uppercase italic tracking-widest rounded-xl hover:bg-brand-teal hover:text-white transition-all"
                              onClick={e => { e.stopPropagation(); markRead(n._id); }}
                            >
                              Mark Read
                            </button>
                          )}
                          <button
                            onClick={e => { e.stopPropagation(); deleteNotif(n._id); }}
                            className="h-14 w-14 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center text-gray-300 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>
          ))}

          {notifs.length === 0 && (
            <div className="flex flex-col items-center justify-center py-32 space-y-12">
              <div className="relative">
                <div className="h-48 w-48 bg-gray-50 rounded-[4rem] flex items-center justify-center text-gray-100 shadow-inner">
                  <Bell size={96} />
                </div>
                <div className="absolute -bottom-6 -right-6 h-20 w-20 bg-white shadow-4xl rounded-3xl flex items-center justify-center text-brand-teal border border-black/[0.03] animate-pulse">
                  <CheckCircle size={32} />
                </div>
              </div>
              <div className="text-center space-y-4">
                <h3 className="font-syne font-black text-3xl text-[#0a1628] uppercase italic tracking-tighter">
                  Null Stream Activity
                </h3>
                <p className="text-gray-400 font-dm italic text-lg font-bold max-w-sm mx-auto">
                  Your clinical transmission hub is currently updatehronized and silent.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
