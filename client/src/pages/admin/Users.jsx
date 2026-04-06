import { useMemo, useState } from 'react';
import { Filter, Search, User } from 'lucide-react';

const USERS = [
  { id: 'u1', name: 'Keerthivasan R.', role: 'Customer', status: 'Active', phone: '+91 98765 43210' },
  { id: 'u2', name: 'Dr. C. Mallika', role: 'Doctor', status: 'Active', phone: '+91 91234 56780' },
  { id: 'u3', name: 'Sri Pharmacy', role: 'Pharmacist', status: 'Pending', phone: '+91 99887 77665' },
  { id: 'u4', name: 'Rajan Kumar', role: 'Delivery', status: 'Suspended', phone: '+91 94444 55555' }
];

const ROLE_FILTERS = ['All', 'Customer', 'Doctor', 'Pharmacist', 'Delivery'];

const STATUS_TONE = {
  Active: 'bg-emerald-50 text-emerald-600',
  Pending: 'bg-orange-50 text-orange-600',
  Suspended: 'bg-red-50 text-red-600'
};

export default function Users() {
  const [query, setQuery] = useState('');
  const [role, setRole] = useState('All');

  const filtered = useMemo(() => {
    return USERS.filter((u) => {
      if (role !== 'All' && u.role !== role) return false;
      if (!query) return true;
      return `${u.name} ${u.role} ${u.phone}`.toLowerCase().includes(query.toLowerCase());
    });
  }, [query, role]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl text-brand-navy">Users</h1>
          <p className="text-sm text-brand-muted">Manage access across customers, doctors, and partners.</p>
        </div>
        <button className="px-4 py-2 rounded-xl bg-brand-teal text-white text-sm btn-hover">Invite User</button>
      </div>

      <div className="bg-white border border-brand-border rounded-2xl p-5 shadow-soft">
        <div className="flex flex-col lg:flex-row lg:items-center gap-3">
          <div className="flex items-center gap-2 border border-brand-border rounded-full px-3 py-2 w-full lg:max-w-sm">
            <Search size={16} className="text-brand-muted" />
            <input
              className="w-full bg-transparent text-sm outline-none"
              placeholder="Search users"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 text-xs text-brand-muted">
            <Filter size={14} /> Filter by role
          </div>
          <div className="flex flex-wrap gap-2">
            {ROLE_FILTERS.map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={`px-3 py-1.5 rounded-full text-xs border ${
                  role === r ? 'bg-brand-teal text-white border-brand-teal' : 'border-brand-border text-brand-muted'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-xs text-brand-muted border-b">
              <tr>
                <th className="py-3">User</th>
                <th>Role</th>
                <th>Status</th>
                <th>Phone</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id} className="border-b">
                  <td className="py-3">
                    <div className="flex items-center gap-3">
                      <span className="h-9 w-9 rounded-xl bg-brand-teal/10 text-brand-teal flex items-center justify-center">
                        <User size={16} />
                      </span>
                      <div>
                        <div className="font-heading text-sm text-brand-navy">{u.name}</div>
                        <div className="text-xs text-brand-muted">ID: {u.id}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="inline-flex px-2 py-0.5 rounded-full text-[11px] bg-brand-off text-brand-navy">{u.role}</span>
                  </td>
                  <td>
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-[11px] ${STATUS_TONE[u.status]}`}>{u.status}</span>
                  </td>
                  <td className="text-brand-muted">{u.phone}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <button className="px-3 py-1 rounded-full border border-brand-border text-xs">View</button>
                      <button className="px-3 py-1 rounded-full bg-red-50 text-red-600 text-xs">Suspend</button>
                      <button className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs">Verify</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center text-sm text-brand-muted py-6">No users found.</div>
          )}
        </div>
      </div>
    </div>
  );
}
