import { Calendar, MapPin, Star } from 'lucide-react';

const HISTORY = [
  { id: 'MED-0038', date: 'Mar 22, 2026', distance: '4.2 km', amount: 80, rating: 5 },
  { id: 'MED-0037', date: 'Mar 21, 2026', distance: '3.1 km', amount: 60, rating: 4 },
  { id: 'MED-0036', date: 'Mar 20, 2026', distance: '5.0 km', amount: 90, rating: 5 }
];

export default function History() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl text-brand-navy">Delivery History</h1>
          <p className="text-sm text-brand-muted">Completed orders and ratings.</p>
        </div>
        <button className="px-4 py-2 rounded-xl border border-brand-border text-sm btn-hover flex items-center gap-2">
          <Calendar size={14} /> Export
        </button>
      </div>

      <div className="bg-white border border-brand-border rounded-2xl p-6 shadow-soft">
        <div className="space-y-3">
          {HISTORY.map((h) => (
            <div key={h.id} className="border border-brand-border rounded-2xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                <div className="font-heading text-sm text-brand-navy">#{h.id}</div>
                <div className="text-xs text-brand-muted">{h.date}</div>
              </div>
              <div className="flex items-center gap-4 text-sm text-brand-muted">
                <span className="flex items-center gap-1"><MapPin size={12} /> {h.distance}</span>
                <span className="font-heading text-brand-navy">{`?${h.amount}`}</span>
                <span className="flex items-center gap-1 text-amber-500"><Star size={12} /> {h.rating}.0</span>
              </div>
              <button className="px-3 py-1 rounded-full border border-brand-border text-xs">View Receipt</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
