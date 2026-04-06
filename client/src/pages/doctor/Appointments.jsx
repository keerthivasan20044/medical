import { useMemo, useState } from 'react';
import { Calendar, Search, Video } from 'lucide-react';

const APPOINTMENTS = [
  { id: 'A-1001', time: '09:00 AM', patient: 'Keerthivasan R.', type: 'Video', status: 'Confirmed' },
  { id: 'A-1002', time: '10:30 AM', patient: 'Priya M.', type: 'Clinic', status: 'Checked-in' },
  { id: 'A-1003', time: '11:15 AM', patient: 'Arjun S.', type: 'Video', status: 'Pending' },
  { id: 'A-1004', time: '01:00 PM', patient: 'Anita S.', type: 'Clinic', status: 'Completed' }
];

export default function Appointments() {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('All');

  const filtered = useMemo(() => {
    return APPOINTMENTS.filter((a) => {
      if (status !== 'All' && a.status !== status) return false;
      if (!query) return true;
      return `${a.patient} ${a.id}`.toLowerCase().includes(query.toLowerCase());
    });
  }, [query, status]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl text-brand-navy">Appointments</h1>
          <p className="text-sm text-brand-muted">Manage your daily consultation schedule.</p>
        </div>
        <button className="px-4 py-2 rounded-xl bg-brand-teal text-white text-sm btn-hover">Add Slot</button>
      </div>

      <div className="bg-white border border-brand-border rounded-2xl p-5 shadow-soft">
        <div className="flex flex-col lg:flex-row lg:items-center gap-3">
          <div className="flex items-center gap-2 border border-brand-border rounded-full px-3 py-2 w-full lg:max-w-sm">
            <Search size={16} className="text-brand-muted" />
            <input
              className="w-full bg-transparent text-sm outline-none"
              placeholder="Search appointments"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {['All', 'Confirmed', 'Checked-in', 'Pending', 'Completed'].map((s) => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={`px-3 py-1.5 rounded-full text-xs border ${
                  status === s ? 'bg-brand-teal text-white border-brand-teal' : 'border-brand-border text-brand-muted'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 space-y-3">
          {filtered.map((a) => (
            <div key={a.id} className="border border-brand-border rounded-2xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                <div className="font-heading text-sm text-brand-navy">{a.time} · {a.patient}</div>
                <div className="text-xs text-brand-muted">Appointment #{a.id}</div>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-brand-off text-brand-navy">
                  {a.type === 'Video' ? <Video size={12} /> : <Calendar size={12} />} {a.type}
                </span>
                <span className={`inline-flex px-2 py-0.5 rounded-full text-[11px] ${a.status === 'Checked-in' ? 'bg-emerald-50 text-emerald-600' : a.status === 'Confirmed' ? 'bg-brand-teal/10 text-brand-teal' : a.status === 'Completed' ? 'bg-indigo-50 text-indigo-600' : 'bg-orange-50 text-orange-600'}`}>
                  {a.status}
                </span>
                <button className="px-3 py-1 rounded-full bg-brand-teal text-white text-xs btn-hover">Start</button>
                <button className="px-3 py-1 rounded-full border border-brand-border text-xs">Reschedule</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
