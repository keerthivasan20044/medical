import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import api from '../../services/api.js';

export default function PaymentSuccess() {
  const { lastOrder } = useSelector((s) => s.payments);

  const downloadReceipt = async () => {
    if (!lastOrder?._id && !lastOrder?.id) return;
    const id = lastOrder._id || lastOrder.id;
    const res = await api.get(`/api/payments/receipt/${id}`, { responseType: 'blob' });
    const url = window.URL.createObjectURL(res.data);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt-${lastOrder.orderNumber || id}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white border border-brand-border rounded-2xl p-6 shadow-soft">
      <h1 className="font-heading text-2xl text-green-600">Payment Success</h1>
      <p className="text-sm text-brand-muted">Your payment was processed successfully.</p>

      <div className="mt-4 border border-brand-border rounded-2xl p-4">
        <div className="text-sm font-heading">Receipt</div>
        <div className="text-xs text-brand-muted">Order: {lastOrder?.orderNumber || lastOrder?.id}</div>
        <div className="text-xs text-brand-muted">Amount: &#8377;{lastOrder?.totalAmount || 0}</div>
        <div className="text-xs text-brand-muted">Status: {lastOrder?.paymentStatus || 'paid'}</div>
      </div>

      <div className="mt-4 flex gap-3">
        <button onClick={downloadReceipt} className="px-4 py-2 rounded-xl border border-brand-border">Download Receipt</button>
        <Link to="/orders" className="px-4 py-2 rounded-xl bg-brand-teal text-white">View Orders</Link>
        <Link to="/home" className="px-4 py-2 rounded-xl border border-brand-border">Back Home</Link>
      </div>
    </div>
  );
}

