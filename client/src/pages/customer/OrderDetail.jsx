import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { fetchOrderById } from '../../store/ordersSlice.js';
import { SkeletonBox } from '../../components/common/Skeleton.jsx';

export default function OrderDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentItem, status, error } = useSelector((s) => s.orders);

  useEffect(() => {
    if (id) dispatch(fetchOrderById(id));
  }, [id, dispatch]);

  return (
    <div className="bg-white border border-brand-border rounded-2xl p-6 shadow-soft">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl">Order #{id}</h1>
          <p className="text-sm text-brand-muted">Status: {currentItem?.status || 'Processing'}</p>
        </div>
        <Link to="/orders" className="text-sm text-brand-teal">Back</Link>
      </div>

      {status === 'loading' && (
        <div className="mt-4 space-y-3">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} className="border border-brand-border rounded-xl p-3">
              <SkeletonBox className="h-3 w-1/2 rounded-full" />
              <SkeletonBox className="mt-2 h-3 w-1/3 rounded-full" />
            </div>
          ))}
        </div>
      )}

      {status === 'failed' && (
        <div className="mt-4 text-center">
          <div className="flex items-center justify-center gap-2 text-red-500 text-sm">
            <AlertCircle size={16} /> {error || 'Failed to load order.'}
          </div>
          <button className="mt-3 px-4 py-2 rounded-xl bg-brand-teal text-white btn-hover" onClick={() => dispatch(fetchOrderById(id))}>
            Retry
          </button>
        </div>
      )}

      {status !== 'loading' && status !== 'failed' && (
        <div className="mt-4 space-y-3 text-sm">
          {(currentItem?.items || []).map((i, idx) => (
            <div key={idx} className="border border-brand-border rounded-xl p-3 flex items-center justify-between">
              <span>{i.medicine?.name || 'Medicine'} x{i.qty}</span>
              <span>&#8377;{i.price}</span>
            </div>
          ))}
          {(currentItem?.items || []).length === 0 && (
            <div className="text-xs text-brand-muted">No items found for this order.</div>
          )}
        </div>
      )}

      <div className="mt-6 flex gap-3">
        <Link to={`/orders/${id}/track`} className="px-4 py-2 rounded-xl bg-brand-teal text-white">Track Order</Link>
        <button className="px-4 py-2 rounded-xl border border-brand-border">Download Invoice</button>
      </div>
    </div>
  );
}
