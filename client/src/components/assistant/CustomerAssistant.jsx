import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Bot,
  ChevronRight,
  MessageCircle,
  PackageSearch,
  Pill,
  ReceiptText,
  Search,
  ShoppingCart,
  Headphones,
  Truck,
  Upload,
  X
} from 'lucide-react';

const QUICK_ACTIONS = [
  { label: 'Find medicines', icon: Search, path: '/medicines', reply: 'Search by medicine name, brand, or category. Open a product and press Add to Cart.' },
  { label: 'Go to cart', icon: ShoppingCart, path: '/cart', reply: 'Your cart shows selected medicines, quantities, coupons, and checkout total.' },
  { label: 'Checkout', icon: ReceiptText, path: '/checkout', reply: 'Checkout lets you confirm address, payment method, and prescription requirements.' },
  { label: 'My orders', icon: PackageSearch, path: '/orders', reply: 'Your orders page shows current and past purchases.' },
  { label: 'Track order', icon: Truck, path: '/orders', reply: 'Open an order and choose Track to see live GPS updates.' },
  { label: 'Upload Rx', icon: Upload, path: '/prescriptions/upload', reply: 'Upload a prescription when a medicine requires pharmacist verification.' },
  { label: 'Billing', icon: ReceiptText, path: '/receipts', reply: 'Billing shows receipts and lets you download invoices for paid and pending orders.' },
  { label: 'Support', icon: Headphones, path: '/help', reply: 'Help Center has support for order, delivery, payment, and account issues.' }
];

function getAssistantReply(text, cartCount) {
  const query = text.toLowerCase();
  if (query.includes('cart')) return `You have ${cartCount} item(s) in cart. Use Go to cart to review quantities or Checkout to place the order.`;
  if (query.includes('order') || query.includes('track')) return 'Open My orders, select an order, then use Track Order for live delivery location and OTP details.';
  if (query.includes('bill') || query.includes('invoice') || query.includes('receipt')) return 'Open Billing to download receipts. Paid online orders also receive receipt email when payment is confirmed.';
  if (query.includes('buy') || query.includes('purchase') || query.includes('medicine')) return 'To purchase: search medicines, add items to cart, open cart, then checkout. Prescription items will ask for Rx upload.';
  if (query.includes('prescription') || query.includes('rx')) return 'Prescription medicines need an uploaded prescription before pharmacist approval and dispatch.';
  if (query.includes('delivery')) return 'Delivery partners share GPS after pickup. You can follow the rider from the order tracking page.';
  if (query.includes('help') || query.includes('support')) return 'Use Help Center or Contact for account, payment, delivery, and pharmacy support.';
  return 'I can help you find medicines, go to cart, checkout, upload prescriptions, view orders, and track delivery.';
}

export default function CustomerAssistant() {
  const navigate = useNavigate();
  const cartCount = useSelector((state) => state.cart?.totalQuantity || 0);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [history, setHistory] = useState([
    {
      role: 'assistant',
      text: 'Hi, I can guide you through buying medicines, cart, checkout, prescriptions, and order tracking.'
    }
  ]);

  const statusText = useMemo(() => (
    cartCount > 0 ? `${cartCount} cart item${cartCount === 1 ? '' : 's'}` : 'Ready to help'
  ), [cartCount]);

  const addAssistantMessage = (text) => {
    setHistory((prev) => [...prev, { role: 'assistant', text }].slice(-8));
  };

  const handleAction = (action) => {
    addAssistantMessage(action.reply);
    navigate(action.path);
    setOpen(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const text = message.trim();
    if (!text) return;
    setHistory((prev) => [...prev, { role: 'user', text }, { role: 'assistant', text: getAssistantReply(text, cartCount) }].slice(-8));
    setMessage('');
  };

  return (
    <div className="fixed bottom-24 right-4 z-[3500] md:bottom-6 md:right-6">
      {open && (
        <div className="mb-3 flex h-[30rem] max-h-[calc(100vh-6rem)] w-[calc(100vw-1.25rem)] max-w-[23rem] flex-col overflow-hidden rounded-3xl border border-white/20 bg-white shadow-2xl md:h-[32rem] md:max-w-sm">
          <div className="flex items-center justify-between bg-navy px-4 py-3 text-white">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-brand-teal text-navy">
                <Bot size={22} />
              </div>
              <div className="min-w-0">
                <div className="font-syne text-sm font-black uppercase leading-tight">MediReach Assistant</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-white/40">{statusText}</div>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white/70 hover:bg-white hover:text-navy" aria-label="Close assistant">
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50 p-4">
            {history.map((item, index) => (
              <div key={`${item.role}-${index}`} className={`flex ${item.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm font-semibold leading-relaxed ${
                  item.role === 'user' ? 'bg-brand-teal text-white' : 'bg-white text-navy shadow-sm'
                }`}>
                  {item.text}
                </div>
              </div>
            ))}
          </div>

          <div className="grid max-h-44 grid-cols-2 gap-2 overflow-y-auto border-t border-gray-100 bg-white p-3">
            {QUICK_ACTIONS.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.label}
                  onClick={() => handleAction(action)}
                  className="flex min-h-11 items-center justify-between gap-2 rounded-2xl border border-gray-100 bg-gray-50 px-3 text-left text-[9px] font-black uppercase tracking-wider text-navy hover:border-brand-teal hover:bg-white"
                >
                  <span className="flex min-w-0 items-center gap-2">
                    <Icon size={15} className="shrink-0 text-brand-teal" />
                    <span className="truncate">{action.label}</span>
                  </span>
                  <ChevronRight size={14} className="shrink-0 text-navy/30" />
                </button>
              );
            })}
          </div>

          <form onSubmit={handleSubmit} className="flex gap-2 border-t border-gray-100 bg-white p-3">
            <input
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Ask how to buy..."
              className="min-w-0 flex-1 rounded-2xl border border-gray-100 bg-gray-50 px-4 text-sm font-semibold text-navy outline-none focus:border-brand-teal"
            />
            <button className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-navy text-brand-teal" aria-label="Send assistant message">
              <MessageCircle size={18} />
            </button>
          </form>
        </div>
      )}

      <button
        onClick={() => setOpen((value) => !value)}
        className="flex h-14 items-center gap-3 rounded-2xl bg-navy px-4 text-white shadow-2xl hover:bg-brand-teal hover:text-navy md:h-16 md:px-5"
        aria-label="Open customer assistant"
      >
        <Bot size={22} />
        <span className="hidden font-syne text-[10px] font-black uppercase tracking-widest md:block">Assistant</span>
        {cartCount > 0 && (
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-black text-white">
            {cartCount}
          </span>
        )}
      </button>
    </div>
  );
}
