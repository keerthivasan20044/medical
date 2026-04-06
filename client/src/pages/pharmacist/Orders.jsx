import { useMemo, useState } from 'react';

const ORDERS = [
  { id: 'MED-1042', customer: 'Ramesh K.', items: 3, amount: 420, status: 'New', time: '5 min ago', otp: '4286' },
  { id: 'MED-1043', customer: 'Priya S.', items: 2, amount: 260, status: 'Preparing', time: '12 min ago', otp: '1024' },
  { id: 'MED-1044', customer: 'Anand M.', items: 1, amount: 120, status: 'Dispatched', time: '20 min ago', otp: '9912' }
];

const STATUSES = ['New', 'Preparing', 'Dispatched', 'Completed'];

export default function Orders() {
  const [orders, setOrders] = useState(ORDERS);
  const [view, setView] = useState('Kanban');

  const grouped = useMemo(() => {
    return STATUSES.reduce((acc, s) => {
      acc[s] = orders.filter((o) => o.status === s);
      return acc;
    }, {});
  }, [orders]);

  const updateStatus = (id, status) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  };

  const assignAgent = (id, agent) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, agent } : o)));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl text-brand-navy">Incoming Orders</h1>
          <p className="text-sm text-brand-muted">Manage orders by status.</p>
        </div>
        <div className="flex items-center gap-2">
          {['Kanban', 'List'].map((t) => (
            <button
              key={t}
              className={`px-4 py-2 rounded-full text-xs border ${
                view === t ? 'bg-brand-teal text-white border-brand-teal' : 'border-brand-border text-brand-muted'
              }`}
              onClick={() => setView(t)}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {view === 'Kanban' ? (
        <div className="grid lg:grid-cols-4 gap-4">
          {STATUSES.map((status) => (
            <div key={status} className="bg-white border border-brand-border rounded-2xl p-4">
              <div className="font-heading text-sm text-brand-navy">{status}</div>
              <div className="mt-3 space-y-3">
                {grouped[status].map((o) => (
                  <div key={o.id} className="border border-brand-border rounded-2xl p-3 card-hover">
                    <div className="font-heading text-sm text-brand-navy">#{o.id}</div>
                    <div className="text-xs text-brand-muted">{o.customer} · {o.items} items</div>
                    <div className="text-xs text-brand-muted">&#8377;{o.amount} · {o.time}</div>
                    <div className="mt-3 flex flex-wrap gap-2 text-xs">
                      {status === 'New' && (
                        <>
                          <button className="px-2 py-1 rounded-full bg-emerald-50 text-emerald-600" onClick={() => updateStatus(o.id, 'Preparing')}>Confirm</button>
                          <button className="px-2 py-1 rounded-full bg-red-50 text-red-600" onClick={() => updateStatus(o.id, 'Cancelled')}>Cancel</button>
                        </>
                      )}
                      {status === 'Preparing' && (
                        <button className="px-2 py-1 rounded-full bg-brand-teal/10 text-brand-teal" onClick={() => updateStatus(o.id, 'Dispatched')}>Dispatch</button>
                      )}
                      {status === 'Dispatched' && (
                        <span className="px-2 py-1 rounded-full bg-brand-mint/20 text-brand-mint">OTP: {o.otp}</span>
                      )}
                    </div>
                    <select
                      className="mt-3 w-full border border-brand-border rounded-xl px-3 py-1 text-xs"
                      onChange={(e) => assignAgent(o.id, e.target.value)}
                    >
                      <option>Assign Delivery Agent</option>
                      <option>Rajan Kumar</option>
                      <option>Priya S</option>
                    </select>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((o) => (
            <div key={o.id} className="border border-brand-border rounded-2xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                <div className="font-heading text-sm text-brand-navy">#{o.id} · {o.customer}</div>
                <div className="text-xs text-brand-muted">{o.items} items · &#8377;{o.amount} · {o.time}</div>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600" onClick={() => updateStatus(o.id, 'Preparing')}>Confirm</button>
                <button className="px-3 py-1 rounded-full bg-brand-teal/10 text-brand-teal" onClick={() => updateStatus(o.id, 'Dispatched')}>Dispatch</button>
                <button className="px-3 py-1 rounded-full bg-red-50 text-red-600" onClick={() => updateStatus(o.id, 'Cancelled')}>Cancel</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

