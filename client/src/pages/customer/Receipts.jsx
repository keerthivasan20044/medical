import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AlertCircle } from 'lucide-react';
import { fetchReceipts } from '../../store/paymentsSlice.js';
import api from '../../services/api.js';
import { SkeletonBox } from '../../components/common/Skeleton';

export default function Receipts() {
  const dispatch = useDispatch();
  const { receipts, status, error } = useSelector((s) => s.payments);

  useEffect(() => {
    dispatch(fetchReceipts());
  }, [dispatch]);

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

  const exportCsv = async () => {
    const res = await api.get('/api/payments/receipts.csv', { responseType: 'blob' });
    const url = window.URL.createObjectURL(res.data);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'receipts.csv';
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white border border-brand-border rounded-2xl p-6 shadow-soft">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl">Receipts</h1>
        <button className="text-sm text-brand-teal" onClick={exportCsv}>Export CSV</button>
      </div>

      {status === 'loading' && (
        <div className="mt-4 space-y-3">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="border border-brand-border rounded-xl p-3">
              <SkeletonBox className="h-4 w-1/3 rounded-full" />
              <SkeletonBox className="mt-2 h-3 w-2/3 rounded-full" />
              <SkeletonBox className="mt-3 h-3 w-1/2 rounded-full" />
            </div>
          ))}
        </div>
      )}

      {status === 'failed' && (
        <div className="mt-4 text-center">
          <div className="flex items-center justify-center gap-2 text-red-500 text-sm">
            <AlertCircle size={16} /> {error || 'Failed to load receipts.'}
          </div>
          <button className="mt-3 px-4 py-2 rounded-xl bg-brand-teal text-white btn-hover" onClick={() => dispatch(fetchReceipts())}>
            Retry
          </button>
        </div>
      )}

      {status !== 'loading' && status !== 'failed' && (
        <div className="mt-4 space-y-3 text-sm">
          {receipts.map((r) => (
            <div key={r._id} className="border border-brand-border rounded-xl p-3 flex items-center justify-between">
              <div>
                <div className="font-heading text-sm">{r.orderNumber}</div>
                <div className="text-xs text-brand-muted">&#8377;{r.totalAmount} · {r.paymentStatus}</div>
                <div className="text-xs text-brand-muted">{new Date(r.createdAt).toLocaleDateString()}</div>
              </div>
              <button className="text-xs text-brand-teal" onClick={() => download(r._id, r.orderNumber)}>Download</button>
            </div>
          ))}
          {receipts.length === 0 && <div className="text-xs text-brand-muted">No receipts yet.</div>}
        </div>
      )}
    </div>
  );
}
