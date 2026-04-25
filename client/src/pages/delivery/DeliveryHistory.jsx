import { useEffect } from 'react';
import DataTable from '../../components/dashboard/DataTable';
import { History, CheckCircle2, Clock, IndianRupee, MapPin, Store, Loader2 } from 'lucide-react';
import { useDelivery } from '../../hooks/useDelivery';

export default function DeliveryHistory() {
  const { history, fetchHistory, loading } = useDelivery();

  useEffect(() => {
    fetchHistory();
  }, []);

  const formattedData = history.map(order => ({
    id: order.orderNumber || (order._id || order.id).slice(-6),
    pharmacy: order.pharmacyId?.name || 'Unknown Pharmacy',
    customer: order.customerName || 'Resident Node',
    payout: order.deliveryFare || 45,
    date: new Date(order.deliveredAt || order.createdAt).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }),
    status: order.deliveryStatus || 'Delivered'
  }));

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="font-syne font-black text-4xl text-navy italic tracking-tighter uppercase">Delivery History</h1>
          <p className="text-xs font-dm font-bold text-navy/40 uppercase tracking-widest mt-1 italic">View all your past delivery records</p>
        </div>
      </div>

      {loading ? (
        <div className="h-64 flex flex-col items-center justify-center space-y-4">
          <Loader2 className="animate-spin text-brand-teal" size={40} />
          <p className="text-xs font-dm font-black text-navy/20 uppercase tracking-widest italic">Synchronizing Logs...</p>
        </div>
      ) : (
        <DataTable 
          title="Past Deliveries"
          columns={[
            { 
              key: 'id', 
              label: 'Order ID',
              render: (val) => (
                <span className="font-syne font-black text-xs text-brand-teal italic">#{val}</span>
              )
            },
            { 
              key: 'pharmacy', 
              label: 'Pharmacy',
              render: (val) => (
                <div className="flex items-center gap-2 font-dm font-bold text-navy text-sm italic">
                  <Store size={14} className="text-navy/20" /> {val}
                </div>
              )
            },
            { 
              key: 'customer', 
              label: 'Recipient',
              render: (val) => (
                <div className="flex items-center gap-2 font-dm font-bold text-navy/60 text-sm italic">
                  <MapPin size={14} className="text-navy/10" /> {val}
                </div>
              )
            },
            { 
              key: 'payout', 
              label: 'Earnings', 
              render: (val) => (
                <span className="font-syne font-black text-navy italic">₹{val}</span>
              )
            },
            { 
              key: 'date', 
              label: 'Date & Time',
              render: (val) => (
                <span className="text-[10px] font-bold text-navy/40 uppercase tracking-widest">{val}</span>
              )
            },
            { 
              key: 'status', 
              label: 'Status',
              render: (val) => (
                <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest w-fit border ${
                  val?.toLowerCase() === 'delivered' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'
                }`}>
                  {val}
                </div>
              )
            }
          ]}
          data={formattedData}
          actions={true}
        />
      )}
    </div>
  );
}
