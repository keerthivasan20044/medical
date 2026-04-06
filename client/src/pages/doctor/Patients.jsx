import { useMemo, useState } from 'react';
import { Search, UserCircle } from 'lucide-react';

const PATIENTS = [
  { id: 'P-2041', name: 'Keerthivasan R.', condition: 'Hypertension', lastVisit: 'Mar 18, 2026' },
  { id: 'P-2042', name: 'Priya M.', condition: 'Seasonal Allergy', lastVisit: 'Mar 16, 2026' },
  { id: 'P-2043', name: 'Arjun S.', condition: 'Diabetes', lastVisit: 'Mar 11, 2026' }
];

export default function Patients() {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    if (!query) return PATIENTS;
    return PATIENTS.filter((p) => `${p.name} ${p.condition}`.toLowerCase().includes(query.toLowerCase()));
  }, [query]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl text-brand-navy">Patients</h1>
          <p className="text-sm text-brand-muted">Track patient history and records.</p>
        </div>
        <button className="px-4 py-2 rounded-xl bg-brand-teal text-white text-sm btn-hover">Add Patient</button>
      </div>

      <div className="bg-white border border-brand-border rounded-2xl p-5 shadow-soft">
        <div className="flex items-center gap-2 border border-brand-border rounded-full px-3 py-2 w-full lg:max-w-sm">
          <Search size={16} className="text-brand-muted" />
          <input
            className="w-full bg-transparent text-sm outline-none"
            placeholder="Search patients"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-xs text-brand-muted border-b">
              <tr>
                <th className="py-3">Patient</th>
                <th>Condition</th>
                <th>Last Visit</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-b">
                  <td className="py-3">
                    <div className="flex items-center gap-3">
                      <span className="h-9 w-9 rounded-xl bg-brand-teal/10 text-brand-teal flex items-center justify-center">
                        <UserCircle size={16} />
                      </span>
                      <div>
                        <div className="font-heading text-sm text-brand-navy">{p.name}</div>
                        <div className="text-xs text-brand-muted">ID: {p.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="text-brand-muted">{p.condition}</td>
                  <td className="text-brand-muted">{p.lastVisit}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <button className="px-3 py-1 rounded-full border border-brand-border text-xs">View</button>
                      <button className="px-3 py-1 rounded-full bg-brand-teal/10 text-brand-teal text-xs">Prescribe</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center text-sm text-brand-muted py-6">No patients found.</div>
          )}
        </div>
      </div>
    </div>
  );
}
