import { Link } from 'react-router-dom';

export default function PaymentFailure() {
  return (
    <div className="bg-white border border-brand-border rounded-2xl p-6 shadow-soft">
      <h1 className="font-heading text-2xl text-red-600">Payment Failed</h1>
      <p className="text-sm text-brand-muted">Your payment could not be completed. Please try again.</p>
      <div className="mt-4 flex gap-3">
        <Link to="/checkout" className="px-4 py-2 rounded-xl bg-brand-teal text-white">Retry Payment</Link>
        <Link to="/cart" className="px-4 py-2 rounded-xl border border-brand-border">Back to Cart</Link>
      </div>
    </div>
  );
}
