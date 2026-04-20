import { useState } from 'react';
import { toast } from 'react-hot-toast';
import api from '../../services/api';
import { CreditCard, ShieldCheck, RefreshCw } from 'lucide-react';

export const RazorpayPayment = ({ order, onPaymentSuccess, onPaymentError }) => {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    if (!order) return;
    setLoading(true);

    try {
      const { data } = await api.post('/api/payments/intent', {
        orderId: order._id || order.id,
        method: 'razorpay'
      });

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_KKL_ARCH_NODE',
        amount: data.intent.amount,
        currency: data.intent.currency,
        name: 'MediReach Pharmacy',
        description: `Order ${order.orderNumber} Delivery in Karaikal`,
        image: 'https://medireach.in/logo.png', // Replace with real logo
        order_id: data.intent.id,
        handler: async (response) => {
          try {
            const confirmRes = await api.post('/api/payments/confirm', {
              orderId: order._id || order.id,
              method: 'razorpay',
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature
            });
            
            toast.success('Architecture Node Payment Secured!');
            if (onPaymentSuccess) onPaymentSuccess(confirmRes.data.order);
          } catch (err) {
            toast.error('Payment confirmation synchronization failed.');
            if (onPaymentError) onPaymentError(err);
          }
        },
        prefill: {
          name: order.customer?.name || 'Customer Name',
          email: order.customer?.email || 'customer@karaikal.com',
          contact: order.customer?.phone || '+919876543210'
        },
        theme: {
          color: '#028090'
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (response) => {
        toast.error(`Payment node failed: ${response.error.description}`);
        if (onPaymentError) onPaymentError(response.error);
      });
      rzp.open();
    } catch (err) {
      toast.error('Failed to initiate payment architecture stream.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className={`w-full h-16 rounded-[1.8rem] flex items-center justify-between px-8 transition-all duration-500 shadow-xl group border-2 ${
        loading ? 'bg-gray-50 border-gray-100' : 'bg-[#0a1628] border-[#0a1628] hover:bg-[#028090] hover:border-[#028090] text-white'
      }`}
    >
      <div className="flex items-center gap-4">
         <div className={`h-10 w-10 flex items-center justify-center rounded-xl bg-white/10 group-hover:bg-white/20`}>
            {loading ? <RefreshCw className="animate-spin text-white/40" size={20} /> : <CreditCard size={20} />}
         </div>
         <div className="text-left">
            <div className="text-[10px] uppercase font-black tracking-widest leading-none mb-1 opacity-50">Secure Architecture</div>
            <div className="text-sm font-syne font-black uppercase tracking-widest">{loading ? 'Initiating Gate...' : 'Pay with Razorpay'}</div>
         </div>
      </div>
      <ShieldCheck className={loading ? 'text-gray-300' : 'text-[#02C39A] group-hover:text-white transition'} />
    </button>
  );
};
