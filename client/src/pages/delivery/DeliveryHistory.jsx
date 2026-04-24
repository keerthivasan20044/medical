import { useState } from 'react';
import DataTable from '../../components/dashboard/DataTable';
import { History, CheckCircle2, Clock, IndianRupee, MapPin, Store } from 'lucide-react';

export default function DeliveryHistory() {
  const HISTORY = [
    { id: 'TSK-101', pharmacy: 'Apollo Pharmacy', customer: 'Suresh K.', payout: 45, date: '2024-04-20 12:30', status: 'Delivered' },
    { id: 'TSK-100', pharmacy: 'MedPlus', customer: 'Priya R.', payout: 35, date: '2024-04-20 10:15', status: 'Delivered' },
    { id: 'TSK-099', pharmacy: 'Sri Murugan', customer: 'John D.', payout: 65, date: '2024-04-19 18:45', status: 'Delivered' },
    { id: 'TSK-098', pharmacy: 'Apollo Pharmacy', customer: 'Meera L.', payout: 40, date: '2024-04-19 14:20', status: 'Cancelled' },
  ];

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="font-syne font-black text-4xl text-navy italic tracking-tighter uppercase">Mission Log</h1>
          <p className="text-xs font-dm font-bold text-navy/40 uppercase tracking-widest mt-1 italic">Past Delivery Performance Registry</p>
        </div>
      </div>

      <DataTable 
        title="Historical Syncs"
        columns={[
          { 
            key: 'id', 
            label: 'Task ID',
            render: (val) => (
              <span className="font-syne font-black text-xs text-brand-teal italic">{val}</span>
            )
          },
          { 
            key: 'pharmacy', 
            label: 'Node',
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
            label: 'Yield', 
            render: (val) => (
              <span className="font-syne font-black text-navy italic">₹{val}</span>
            )
          },
          { 
            key: 'date', 
            label: 'Timestamp',
            render: (val) => (
              <span className="text-[10px] font-bold text-navy/40 uppercase tracking-widest">{val}</span>
            )
          },
          { 
            key: 'status', 
            label: 'Protocol',
            render: (val) => (
              <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest w-fit border ${
                val === 'Delivered' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'
              }`}>
                {val}
              </div>
            )
          }
        ]}
        data={HISTORY}
        actions={true}
      />
    </div>
  );
}
