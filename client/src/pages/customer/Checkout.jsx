import { useMemo, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  CreditCard,
  Lock,
  MapPin,
  Package,
  ShoppingBag,
  Smartphone,
  Truck
} from 'lucide-react';
import { createOrder, confirmPayment, createPaymentIntent, logPaymentRetry } from '../../store/paymentsSlice.js';
import { useLanguage } from '../../context/LanguageContext';
import { getMedicineImage } from '../../utils/medicineImages';

function loadRazorpay() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

const SAVED_ADDRESSES = [
  { id: 1, label: 'Home', address: '42 Gandhi Nagar, Karaikal', city: 'Puducherry', zip: '609602', default: true },
  { id: 2, label: 'Work', address: 'District Hospital Compx, Nagore Rd', city: 'Karaikal', zip: '609602', default: false }
];

const PAYMENT_METHODS = [
  { id: 'upi', icon: Smartphone, label: 'UPI' },
  { id: 'card', icon: CreditCard, label: 'Card' },
  { id: 'cod', icon: Truck, label: 'COD' }
];

function getItemImage(item) {
  return getMedicineImage(item);
}

export default function CheckoutPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user } = useSelector((s) => s.auth);
  const { items, totalAmount, note, prescription } = useSelector((s) => s.cart);
  const { status } = useSelector((s) => s.payments);
  const [method, setMethod] = useState('upi');
  const [error, setError] = useState('');
  const [selectedAddress, setSelectedAddress] = useState(SAVED_ADDRESSES[0].id);

  const deliveryFee = totalAmount >= 500 || totalAmount === 0 ? 0 : 35;
  const discount = totalAmount > 1000 ? 100 : 0;
  const finalTotal = Math.max(0, totalAmount + deliveryFee - discount);
  const selectedAddressData = SAVED_ADDRESSES.find((a) => a.id === selectedAddress);

  useEffect(() => {
    if (items.length === 0) navigate('/cart');
    window.scrollTo(0, 0);
  }, [items, navigate]);

  const payload = useMemo(() => ({
    pharmacyId: items[0]?.pharmacyId || 'ph-1',
    items: items.map((i) => ({ medicine: i.id || i._id, quantity: i.quantity, price: i.price })),
    totalAmount: finalTotal,
    deliveryAddress: selectedAddressData?.address || '',
    paymentMethod: method,
    note,
    prescriptionUrl: prescription?.url || ''
  }), [items, finalTotal, method, note, prescription, selectedAddressData]);

  const handlePay = async () => {
    setError('');
    const orderRes = await dispatch(createOrder(payload));
    if (orderRes.meta.requestStatus !== 'fulfilled') {
      setError(orderRes.payload || 'Order could not be created.');
      return;
    }

    const orderId = orderRes.payload._id || orderRes.payload.id;

    if (method === 'cod') {
      const confirm = await dispatch(confirmPayment({ orderId, method }));
      return confirm.meta.requestStatus === 'fulfilled'
        ? navigate('/checkout/success')
        : setError(confirm.payload || 'Payment confirmation failed.');
    }

    const intentRes = await dispatch(createPaymentIntent({ orderId, method }));
    if (intentRes.meta.requestStatus !== 'fulfilled') {
      setError(intentRes.payload || 'Payment gateway is not ready.');
      return;
    }

    if (intentRes.payload?.mock) {
      const confirm = await dispatch(confirmPayment({
        orderId,
        method,
        razorpay_payment_id: `pay_mock_${Math.random().toString(36).substring(2, 11)}`,
        razorpay_order_id: intentRes.payload.id,
        razorpay_signature: 'mock_signature'
      }));
      return confirm.meta.requestStatus === 'fulfilled'
        ? navigate('/checkout/success')
        : setError(confirm.payload || 'Mock payment failed.');
    }

    const ok = await loadRazorpay();
    if (!ok) {
      setError('Payment gateway could not be loaded.');
      return;
    }

    const rzp = new window.Razorpay({
      key: intentRes.payload.key || import.meta.env.VITE_RAZORPAY_KEY_ID || '',
      amount: intentRes.payload.amount,
      currency: intentRes.payload.currency,
      name: 'MediReach',
      description: 'Medicine order payment',
      order_id: intentRes.payload.id,
      prefill: {
        name: user?.name || 'MediReach User',
        email: user?.email || '',
        contact: user?.phone || ''
      },
      theme: { color: '#028090' },
      handler: async (response) => {
        const confirm = await dispatch(confirmPayment({
          orderId,
          method,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_signature: response.razorpay_signature
        }));
        return confirm.meta.requestStatus === 'fulfilled'
          ? navigate('/checkout/success')
          : setError(confirm.payload || 'Payment verification failed.');
      }
    });

    rzp.on('payment.failed', (response) => {
      setError(response.error?.description || 'Payment failed.');
      dispatch(logPaymentRetry({ orderId, reason: response.error?.reason || 'unknown' }));
    });

    rzp.open();
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 pb-24 pt-8 md:px-8 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-xs font-bold uppercase tracking-widest text-teal-300">
              <ShoppingBag size={14} />
              Order checkout
            </div>
            <h1 className="text-4xl font-extrabold leading-none text-slate-950 md:text-5xl">
              Checkout
            </h1>
          </div>
          <div className="flex w-fit items-center gap-3 rounded-2xl border border-teal-100 bg-teal-50 px-4 py-3 text-sm font-bold text-teal-800">
            <Truck size={18} />
            Estimated delivery: <span className="text-slate-950">25-35 mins</span>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-8">
            <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-5">
              <div className="flex items-center gap-3">
                <Package className="text-teal-600" size={22} />
                <h2 className="text-xl font-extrabold text-slate-950">Item list</h2>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-500">
                {items.length} item{items.length === 1 ? '' : 's'}
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {items.map((item) => (
                <div key={item.id || item._id} className="grid grid-cols-[64px_minmax(0,1fr)_auto] items-center gap-4 py-5">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-100 bg-slate-50 overflow-hidden">
                    <img
                      src={getItemImage(item)}
                      alt={item.name || 'Medicine'}
                      className="h-full w-full object-cover"
                      onError={(event) => {
                        event.currentTarget.src = getMedicineImage({ category: item.category || 'default' });
                      }}
                    />
                  </div>
                  <div className="min-w-0">
                    <h3 className="truncate text-base font-extrabold text-slate-950 md:text-lg">
                      {item.name || 'Medicine'}
                    </h3>
                    <p className="mt-1 text-sm font-semibold text-slate-400">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-right text-base font-extrabold text-teal-700">
                    INR {(Number(item.price || 0) * Number(item.quantity || 1)).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-2xl bg-slate-50 p-5">
              <div className="space-y-3 text-sm font-bold text-slate-500">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-slate-900">INR {totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery fee</span>
                  <span className={deliveryFee === 0 ? 'text-emerald-600' : 'text-slate-900'}>
                    {deliveryFee === 0 ? 'Free' : `INR ${deliveryFee}`}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-teal-700">
                    <span>Discount</span>
                    <span>- INR {discount}</span>
                  </div>
                )}
              </div>
              <div className="mt-5 flex items-end justify-between border-t border-slate-200 pt-5">
                <span className="text-lg font-extrabold text-slate-950">Grand total</span>
                <span className="text-3xl font-extrabold text-slate-950">INR {finalTotal.toLocaleString()}</span>
              </div>
            </div>
          </section>

          <aside className="rounded-3xl bg-slate-950 p-5 text-white shadow-xl md:p-6">
            <section>
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-teal-300">
                    <MapPin size={20} />
                  </div>
                  <h2 className="text-lg font-extrabold">Delivery address</h2>
                </div>
              </div>

              <div className="space-y-3">
                {SAVED_ADDRESSES.map((address) => (
                  <button
                    key={address.id}
                    type="button"
                    onClick={() => setSelectedAddress(address.id)}
                    className={`w-full rounded-2xl border p-4 text-left transition ${
                      selectedAddress === address.id
                        ? 'border-teal-400 bg-teal-400/10'
                        : 'border-white/10 bg-white/[0.03] hover:border-white/30'
                    }`}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs font-extrabold uppercase tracking-widest text-teal-300">{address.label}</span>
                      {selectedAddress === address.id && <CheckCircle size={16} className="text-teal-300" />}
                    </div>
                    <div className="truncate text-base font-extrabold text-white">{address.address}</div>
                    <div className="mt-1 text-xs font-bold uppercase tracking-widest text-white/40">
                      {address.city} - {address.zip}
                    </div>
                  </button>
                ))}
              </div>
            </section>

            <section className="mt-8 border-t border-white/10 pt-8">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-teal-300">
                  <CreditCard size={20} />
                </div>
                <h2 className="text-lg font-extrabold">Payment method</h2>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {PAYMENT_METHODS.map((payment) => (
                  <button
                    key={payment.id}
                    type="button"
                    onClick={() => setMethod(payment.id)}
                    className={`flex min-h-24 flex-col items-center justify-center gap-2 rounded-2xl border text-sm font-extrabold transition ${
                      method === payment.id
                        ? 'border-white bg-white text-slate-950'
                        : 'border-white/10 bg-white/[0.03] text-white/50 hover:text-white'
                    }`}
                  >
                    <payment.icon size={20} />
                    {payment.label}
                  </button>
                ))}
              </div>

              {error && (
                <div className="mt-5 flex gap-3 rounded-2xl border border-red-400/20 bg-red-500/10 p-4 text-sm font-bold text-red-200">
                  <AlertCircle size={18} className="shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="button"
                onClick={handlePay}
                disabled={status === 'loading'}
                className="mt-6 flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-teal-400 px-5 text-sm font-extrabold uppercase tracking-widest text-slate-950 transition hover:bg-teal-300 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === 'loading' ? 'Processing' : 'Pay now'}
                <ArrowRight size={18} />
              </button>

              <div className="mt-4 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-white/30">
                <Lock size={13} />
                Secure payment
              </div>
            </section>
          </aside>
        </div>

        <Link
          to="/cart"
          className="mt-6 inline-flex items-center gap-2 text-sm font-extrabold text-slate-400 transition hover:text-slate-950"
        >
          <ArrowLeft size={16} />
          Back to cart
        </Link>
      </div>
    </main>
  );
}
