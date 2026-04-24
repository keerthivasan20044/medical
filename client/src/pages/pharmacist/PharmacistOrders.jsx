import { useState } from 'react';
import DataTable from '../../components/dashboard/DataTable';
import { ShoppingBag, Clock, CheckCircle2, XCircle, Package, Truck, AlertCircle } from 'lucide-react';

export default function PharmacistOrders() {
  const [activeTab, setActiveTab] = useState('New');

  const ORDERS = [
    { id: 'ORD-5542', customer: 'Anitha S.', items: 3, total: 1240, status: 'New', date: 'Just now' },
    { id: 'ORD-5541', customer: 'Vijay R.', items: 1, total: 850, status: 'Preparing', date: '12 mins ago' },
    { id: 'ORD-5540', customer: 'Meera K.', items: 5, total: 2100, status: 'Ready', date: '45 mins ago' },
    { id: 'ORD-5539', customer: 'Sathish P.', items: 2, total: 450, status: 'Completed', date: 'Yesterday' },
  ];

  const filteredOrders = ORDERS.filter(o => o.status === activeTab);

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="font-syne font-black text-4xl text-navy italic tracking-tighter uppercase">Order Pipeline</h1>
          <p className="text-xs font-dm font-bold text-navy/40 uppercase tracking-widest mt-1 italic">Real-time Fulfillment Management</p>
        </div>
        <div className="flex bg-white p-1.5 rounded-[2rem] border border-gray-100 shadow-sm overflow-x-auto no-scrollbar">
          {['New', 'Preparing', 'Ready', 'Completed'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-8 py-2.5 rounded-[1.5rem] text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                activeTab === tab ? 'bg-navy text-white shadow-lg shadow-navy/20' : 'text-navy/40 hover:text-navy hover:bg-gray-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <DataTable 
        title={`${activeTab} Pipeline`}
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
            label: 'Client Identity',
            render: (val) => (
              <div className="font-dm font-bold text-navy text-sm italic">{val}</div>
            )
          },
          { key: 'items', label: 'Unit Count' },
          { key: 'total', label: 'Value Impact', render: (val) => `₹${val}` },
          { 
            key: 'status', 
            label: 'Current Phase',
            render: (val) => (
              <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest w-fit border flex items-center gap-2 ${
                val === 'New' ? 'bg-blue-50 text-blue-600 border-blue-100 animate-pulse' : 
                val === 'Preparing' ? 'bg-amber-50 text-amber-600 border-amber-100' : 
                val === 'Ready' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                'bg-gray-50 text-gray-400 border-gray-100'
              }`}>
                {val === 'New' && <AlertCircle size={12} />}
                {val === 'Preparing' && <Clock size={12} />}
                {val === 'Ready' && <Package size={12} />}
                {val === 'Completed' && <CheckCircle2 size={12} />}
                {val}
              </div>
            )
          },
          { 
            key: 'date', 
            label: 'Sync Time',
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
