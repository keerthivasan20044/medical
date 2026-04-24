import { useState } from 'react';
import DataTable from '../../components/dashboard/DataTable';
import { ShoppingBag, Clock, CheckCircle2, XCircle, Package, Truck, AlertCircle } from 'lucide-react';

export default function AdminOrders() {
  const [activeFilter, setActiveFilter] = useState('All');

  const ORDERS = [
    { id: 'ORD-5542', customer: 'Anitha S.', pharmacy: 'Apollo Pharmacy', total: 1240, status: 'Processing', date: '2024-04-20 14:30' },
    { id: 'ORD-5541', customer: 'Vijay R.', pharmacy: 'MedPlus', total: 850, status: 'Delivered', date: '2024-04-20 12:15' },
    { id: 'ORD-5540', customer: 'Meera K.', pharmacy: 'Sri Murugan', total: 2100, status: 'Out for Delivery', date: '2024-04-20 10:45' },
    { id: 'ORD-5539', customer: 'Sathish P.', pharmacy: 'Apollo Pharmacy', total: 450, status: 'Cancelled', date: '2024-04-19 18:20' },
  ];

  const filteredOrders = ORDERS.filter(o => activeFilter === 'All' || o.status === activeFilter);

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="font-syne font-black text-4xl text-navy italic tracking-tighter uppercase">Transaction Log</h1>
          <p className="text-xs font-dm font-bold text-navy/40 uppercase tracking-widest mt-1 italic">Network Order Synchronization</p>
        </div>
        <div className="flex bg-white p-1.5 rounded-[2rem] border border-gray-100 shadow-sm overflow-x-auto no-scrollbar">
          {['All', 'Processing', 'Out for Delivery', 'Delivered', 'Cancelled'].map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-6 py-2.5 rounded-[1.5rem] text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                activeFilter === filter ? 'bg-navy text-white' : 'text-navy/40 hover:text-navy hover:bg-gray-50'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <DataTable 
        title="Order Stream"
        columns={[
          { 
            key: 'id', 
            label: 'Manifest ID',
            render: (val) => (
              <span className="font-syne font-black text-xs text-brand-teal italic">{val}</span>
            )
          },
          { 
            key: 'customer', 
            label: 'Initiator',
            render: (val) => (
              <div className="font-dm font-bold text-navy text-sm italic">{val}</div>
            )
          },
          { key: 'pharmacy', label: 'Processing Node' },
          { key: 'total', label: 'Value', render: (val) => `₹${val}` },
          { 
            key: 'status', 
            label: 'Protocol Status',
            render: (val) => (
              <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest w-fit border flex items-center gap-2 ${
                val === 'Delivered' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                val === 'Cancelled' ? 'bg-red-50 text-red-600 border-red-100' : 
                val === 'Processing' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                'bg-blue-50 text-blue-600 border-blue-100'
              }`}>
                {val === 'Delivered' ? <CheckCircle2 size={12} /> : 
                 val === 'Cancelled' ? <XCircle size={12} /> : 
                 val === 'Processing' ? <Clock size={12} className="animate-spin-slow" /> :
                 <Truck size={12} />}
                {val}
              </div>
            )
          },
          { 
            key: 'date', 
            label: 'Timestamp',
            render: (val) => (
              <span className="text-[10px] font-bold text-navy/40 uppercase tracking-widest">{val}</span>
            )
          }
        ]}
        data={filteredOrders}
        actions={true}
      />
    </div>
  );
}
