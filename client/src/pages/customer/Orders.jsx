import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AlertCircle } from 'lucide-react';
import { fetchOrders } from '../../store/ordersSlice.js';
import api from '../../services/api.js';
import { SkeletonBox } from '../../components/common/Skeleton.jsx';

const statusColor = {
  'In Transit': 'text-orange-600 bg-orange-50',
  Delivered: 'text-green-600 bg-green-50',
  Pending: 'text-blue-600 bg-blue-50'
};

export default function Orders() {
  const dispatch = useDispatch();
  const { items, status, error } = useSelector((s) => s.orders);

  useEffect(() => {
    if (status === 'idle') dispatch(fetchOrders());
  }, [status, dispatch]);

  const download = async (id, orderNumber) => {
    const res = await api.get(`/api/payments/receipt/${id}`, { responseType: 'blob' });
    const url = window.URL.createObjectURL(res.data);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt-${orderNumber || id}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-brand-border rounded-2xl p-6 shadow-soft">
        <div className="flex items-center justify-between">
          <h1 className="font-heading text-2xl">My Orders</h1>
          <button className="px-4 py-2 rounded-xl border border-brand-border">Filter</button>
        </div>

        {status === 'loading' && (
          <div className="mt-4 space-y-3">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="border border-brand-border rounded-xl p-4">
                <SkeletonBox className="h-4 w-1/3 rounded-full" />
                <SkeletonBox className="mt-2 h-3 w-2/3 rounded-full" />
                <SkeletonBox className="mt-4 h-8 rounded-xl" />
              </div>
            ))}
          </div>
        )}

        {status === 'failed' && (
          <div className="mt-4 text-center">
            <div className="flex items-center justify-center gap-2 text-red-500 text-sm">
              <AlertCircle size={16} /> {error || 'Failed to load orders.'}
            </div>
            <button className="mt-3 px-4 py-2 rounded-xl bg-brand-teal text-white btn-hover" onClick={() => dispatch(fetchOrders())}>
              Retry
            </button>
          </div>
        )}

        {status !== 'loading' && status !== 'failed' && (
          <div className="mt-4 space-y-3 text-sm">
            {items.map((o) => (
              <div key={o.id || o._id} className="border border-brand-border rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <div className="font-heading text-sm">#{o.id || o.orderNumber}</div>
                  <div className="text-xs text-brand-muted">{o.items || o.itemsSummary || 'Medicines'}</div>
                  <div className="text-xs text-brand-muted">{o.date || '02 Mar 2026'}</div>
                </div>
                <div className="text-sm font-heading">&#8377;{o.total || o.totalAmount}</div>
                <span className={`text-xs px-2 py-1 rounded-full ${statusColor[o.status] || 'text-blue-600 bg-blue-50'}`}>{o.status}</span>
                <div className="flex gap-2">
                  <Link to={`/orders/${o.id || o._id}/track`} className="text-xs text-brand-teal">Track</Link>
                  <button className="text-xs text-brand-teal" onClick={() => download(o._id, o.orderNumber)}>Receipt</button>
                </div>
              </div>
            ))}
            {items.length === 0 && (
              <div className="text-xs text-brand-muted">No orders yet.</div>
            )}
          </div>
        )}
      </div>

      <div className="bg-white border border-brand-border rounded-2xl p-6 shadow-soft">
        <h2 className="font-heading text-lg">Order Summary</h2>
        <div className="mt-4 grid md:grid-cols-3 gap-3 text-sm">
          <div className="border border-brand-border rounded-xl p-4">
            <div className="text-xs text-brand-muted">Total Spend</div>
            <div className="font-heading text-xl">&#8377;482</div>
          </div>
          <div className="border border-brand-border rounded-xl p-4">
            <div className="text-xs text-brand-muted">Active Orders</div>
            <div className="font-heading text-xl">1</div>
          </div>
          <div className="border border-brand-border rounded-xl p-4">
            <div className="text-xs text-brand-muted">Delivered</div>
            <div className="font-heading text-xl">2</div>
          </div>
        </div>
      </div>
    </div>
  );
}
