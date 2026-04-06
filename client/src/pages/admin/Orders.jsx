import { useMemo, useState } from 'react';
import { ArrowUpDown, Package, Search, Truck } from 'lucide-react';

const ORDERS = [
  { id: 'MED-2041', customer: 'Ramesh K.', pharmacy: 'Apollo Pharmacy', amount: 420, status: 'Preparing', time: '10:40 AM' },
  { id: 'MED-2042', customer: 'Priya S.', pharmacy: 'MedPlus', amount: 260, status: 'Dispatched', time: '10:55 AM' },
  { id: 'MED-2043', customer: 'Anand M.', pharmacy: 'Grace Pharmacy', amount: 180, status: 'New', time: '11:05 AM' },
  { id: 'MED-2044', customer: 'Asha P.', pharmacy: 'Sri Murugan', amount: 610, status: 'Delivered', time: '11:20 AM' }
];

const STATUS_TONE = {
  New: 'bg-brand-off text-brand-navy',
  Preparing: 'bg-orange-50 text-orange-600',
  Dispatched: 'bg-indigo-50 text-indigo-600',
  Delivered: 'bg-emerald-50 text-emerald-600'
};

export default function Orders() {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('All');

  const filtered = useMemo(() => {
    return ORDERS.filter((o) => {
      if (status !== 'All' && o.status !== status) return false;
      if (!query) return true;
      return `${o.id} ${o.customer} ${o.pharmacy}`.toLowerCase().includes(query.toLowerCase());
    });
  }, [query, status]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl text-brand-navy">All Orders</h1>
          <p className="text-sm text-brand-muted">Track and manage ongoing orders.</p>
        </div>
        <button className="px-4 py-2 rounded-xl border border-brand-border text-sm btn-hover flex items-center gap-2">
          <ArrowUpDown size={14} /> Sort
        </button>
      </div>

      <div className="bg-white border border-brand-border rounded-2xl p-5 shadow-soft">
        <div className="flex flex-col lg:flex-row lg:items-center gap-3">
          <div className="flex items-center gap-2 border border-brand-border rounded-full px-3 py-2 w-full lg:max-w-sm">
            <Search size={16} className="text-brand-muted" />
            <input
              className="w-full bg-transparent text-sm outline-none"
              placeholder="Search orders"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {['All', 'New', 'Preparing', 'Dispatched', 'Delivered'].map((s) => (
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
                <th className="py-3">Order</th>
                <th>Customer</th>
                <th>Pharmacy</th>
                <th>Status</th>
                <th>Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <tr key={o.id} className="border-b">
                  <td className="py-3">
                    <div className="font-heading text-sm text-brand-navy">#{o.id}</div>
                    <div className="text-xs text-brand-muted">{o.time}</div>
                  </td>
                  <td>{o.customer}</td>
                  <td className="text-brand-muted">{o.pharmacy}</td>
                  <td><span className={`inline-flex px-2 py-0.5 rounded-full text-[11px] ${STATUS_TONE[o.status]}`}>{o.status}</span></td>
                  <td className="font-heading text-sm">{`\u20B9${o.amount}`}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <button className="px-3 py-1 rounded-full border border-brand-border text-xs flex items-center gap-1">
                        <Package size={12} /> View
                      </button>
                      <button className="px-3 py-1 rounded-full bg-brand-teal/10 text-brand-teal text-xs flex items-center gap-1">
                        <Truck size={12} /> Assign
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center text-sm text-brand-muted py-6">No orders found.</div>
          )}
        </div>
      </div>
    </div>
  );
}
