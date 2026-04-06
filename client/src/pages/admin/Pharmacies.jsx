import { useMemo, useState } from 'react';
import { Building2, MapPin, Search, ShieldCheck } from 'lucide-react';

const PHARMACIES = [
  { id: 'p1', name: 'Apollo Pharmacy', location: 'New Colony', status: 'Verified', rating: 4.8 },
  { id: 'p2', name: 'MedPlus Pharmacy', location: 'Collectorate Street', status: 'Verified', rating: 4.6 },
  { id: 'p3', name: 'Sri Murugan Medical', location: 'Near Bus Stand', status: 'Pending', rating: 4.4 },
  { id: 'p4', name: 'Life Care Medicals', location: 'Poompuhar Street', status: 'Pending', rating: 4.3 },
  { id: 'p5', name: 'MK Medical Store', location: 'Nagore Road', status: 'Suspended', rating: 4.1 }
];

const STATUS_TONE = {
  Verified: 'bg-emerald-50 text-emerald-600',
  Pending: 'bg-orange-50 text-orange-600',
  Suspended: 'bg-red-50 text-red-600'
};

export default function Pharmacies() {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('All');

  const filtered = useMemo(() => {
    return PHARMACIES.filter((p) => {
      if (status !== 'All' && p.status !== status) return false;
      if (!query) return true;
      return `${p.name} ${p.location}`.toLowerCase().includes(query.toLowerCase());
    });
  }, [query, status]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl text-brand-navy">Pharmacies</h1>
          <p className="text-sm text-brand-muted">Verify and manage partner pharmacies.</p>
        </div>
        <button className="px-4 py-2 rounded-xl bg-brand-teal text-white text-sm btn-hover">Add Pharmacy</button>
      </div>

      <div className="bg-white border border-brand-border rounded-2xl p-5 shadow-soft">
        <div className="flex flex-col lg:flex-row lg:items-center gap-3">
          <div className="flex items-center gap-2 border border-brand-border rounded-full px-3 py-2 w-full lg:max-w-sm">
            <Search size={16} className="text-brand-muted" />
            <input
              className="w-full bg-transparent text-sm outline-none"
              placeholder="Search pharmacy"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {['All', 'Verified', 'Pending', 'Suspended'].map((s) => (
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

        <div className="mt-5 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-xs text-brand-muted border-b">
              <tr>
                <th className="py-3">Pharmacy</th>
                <th>Location</th>
                <th>Status</th>
                <th>Rating</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className={`border-b ${p.status === 'Pending' ? 'bg-orange-50/40' : ''}`}>
                  <td className="py-3">
                    <div className="flex items-center gap-3">
                      <span className="h-9 w-9 rounded-xl bg-brand-teal/10 text-brand-teal flex items-center justify-center">
                        <Building2 size={16} />
                      </span>
                      <div>
                        <div className="font-heading text-sm text-brand-navy">{p.name}</div>
                        <div className="text-xs text-brand-muted">ID: {p.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="text-brand-muted">
                    <div className="flex items-center gap-2"><MapPin size={12} /> {p.location}</div>
                  </td>
                  <td><span className={`inline-flex px-2 py-0.5 rounded-full text-[11px] ${STATUS_TONE[p.status]}`}>{p.status}</span></td>
                  <td className="text-brand-muted">{p.rating}?</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <button className="px-3 py-1 rounded-full border border-brand-border text-xs">View</button>
                      <button className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs flex items-center gap-1">
                        <ShieldCheck size={12} /> Verify
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center text-sm text-brand-muted py-6">No pharmacies found.</div>
          )}
        </div>
      </div>
    </div>
  );
}
