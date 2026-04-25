import { useState } from 'react';
import DataTable from '../../components/dashboard/DataTable';
import { Gift, Ticket, Zap, MessageSquare, Plus, Trash2, Edit2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminPromotions() {
  const [coupons, setCoupons] = useState([
    { id: '1', code: 'HEALTH20', discount: '20%', type: 'Percentage', expiry: '2024-12-31', uses: 1245, status: 'Active' },
    { id: '2', code: 'FLAT100', discount: '₹100', type: 'Fixed', expiry: '2024-06-30', uses: 890, status: 'Active' },
    { id: '3', code: 'WELCOME50', discount: '50%', type: 'Percentage', expiry: '2024-05-15', uses: 2400, status: 'Expired' },
  ]);

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="font-syne font-black text-4xl text-navy italic tracking-tighter uppercase">Promotions</h1>
          <p className="text-xs font-dm font-bold text-navy/40 uppercase tracking-widest mt-1 italic">Manage Coupons and Campaigns</p>
        </div>
        <button 
          className="h-14 px-8 bg-navy text-brand-teal rounded-[2rem] font-syne font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:scale-105 transition-all shadow-xl shadow-navy/20"
        >
          <Plus size={18} /> Create Campaign
        </button>
      </div>

      {/* Campaign Types */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { label: 'Discount Coupons', icon: Ticket, count: 12, color: 'bg-blue-500' },
          { label: 'Notifications', icon: MessageSquare, count: 4, color: 'bg-brand-teal' },
          { label: 'Flash Sales', icon: Zap, count: 2, color: 'bg-orange-500' },
        ].map((type) => (
          <div key={type.label} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all group overflow-hidden relative">
            <div className={`absolute top-0 right-0 h-2 w-full ${type.color} opacity-10 group-hover:opacity-100 transition-opacity`} />
            <div className="flex items-center gap-4">
              <div className={`h-14 w-14 rounded-2xl flex items-center justify-center text-white ${type.color} shadow-lg`}>
                <type.icon size={24} />
              </div>
              <div>
                <h4 className="font-syne font-black text-lg text-navy uppercase italic">{type.label}</h4>
                <p className="text-[10px] font-black text-navy/40 uppercase tracking-widest">{type.count} Active Campaigns</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <DataTable 
        title="Coupons"
        columns={[
          { 
            key: 'code', 
            label: 'Coupon Code',
            render: (val) => (
              <div className="flex items-center gap-2">
                <div className="px-3 py-1 bg-navy/5 border border-navy/10 rounded-lg font-syne font-black text-xs text-navy tracking-widest uppercase italic">
                  {val}
                </div>
              </div>
            )
          },
          { 
            key: 'discount', 
            label: 'Discount',
            render: (val) => (
              <span className="font-syne font-black text-brand-teal italic">{val}</span>
            )
          },
          { key: 'uses', label: 'Uses' },
          { 
            key: 'expiry', 
            label: 'Expiry Date',
            render: (val) => (
              <span className="text-[10px] font-bold text-navy/40 uppercase tracking-widest italic">{val}</span>
            )
          },
          { 
            key: 'status', 
            label: 'Status',
            render: (val) => (
              <div className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest w-fit border ${
                val === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'
              }`}>
                {val}
              </div>
            )
          }
        ]}
        data={coupons}
        actions={true}
      />
    </div>
  );
}
