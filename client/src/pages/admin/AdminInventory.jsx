import { useState } from 'react';
import DataTable from '../../components/dashboard/DataTable';
import { Package, Store, TrendingDown, AlertTriangle, ArrowUpRight, Filter } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminInventory() {
  const [loading, setLoading] = useState(false);
  const [inventory, setInventory] = useState([
    { id: '1', name: 'Paracetamol 500mg', pharmacies: 12, totalStock: 450, status: 'Healthy', demand: 'High' },
    { id: '2', name: 'Amoxicillin 250mg', pharmacies: 5, totalStock: 42, status: 'Low Stock', demand: 'Medium' },
    { id: '3', name: 'Metformin 500mg', pharmacies: 18, totalStock: 890, status: 'Healthy', demand: 'High' },
    { id: '4', name: 'Insulin Glargine', pharmacies: 3, totalStock: 12, status: 'Critical', demand: 'Low' },
    { id: '5', name: 'Atorvastatin 10mg', pharmacies: 9, totalStock: 230, status: 'Healthy', demand: 'Medium' },
  ]);

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="font-syne font-black text-4xl text-navy italic tracking-tighter uppercase">Inventory Matrix</h1>
          <p className="text-xs font-dm font-bold text-navy/40 uppercase tracking-widest mt-1 italic">Aggregated Stock Intelligence Across Karaikal</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="bg-white px-6 py-3 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-[10px] font-black text-navy/60 uppercase tracking-widest italic">4 Low Stock Items</span>
           </div>
        </div>
      </div>

      {/* Global Stock Stats */}
      <div className="grid md:grid-cols-3 gap-8">
        {[
          { label: 'Total Units', value: '24,500', icon: Package, color: 'text-blue-500 bg-blue-50' },
          { label: 'Stock-out Risks', value: '12 Items', icon: AlertTriangle, color: 'text-red-500 bg-red-50' },
          { label: 'Demand Surge', value: 'Antibiotics', icon: TrendingDown, color: 'text-emerald-500 bg-emerald-50' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm flex items-center justify-between group hover:shadow-xl transition-all">
             <div>
                <div className="text-[10px] font-black text-navy/20 uppercase tracking-[0.2em] mb-2">{stat.label}</div>
                <div className="text-3xl font-syne font-black text-navy italic tracking-tighter">{stat.value}</div>
             </div>
             <div className={`h-14 w-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${stat.color}`}>
                <stat.icon size={24} />
             </div>
          </div>
        ))}
      </div>

      <DataTable 
        title="Cross-Pharmacy Inventory"
        isLoading={loading}
        columns={[
          { 
            key: 'name', 
            label: 'Medicine',
            render: (val) => (
              <div className="font-dm font-black text-navy text-sm italic">{val}</div>
            )
          },
          { 
            key: 'pharmacies', 
            label: 'Active Outlets',
            render: (val) => (
              <div className="flex items-center gap-2">
                <Store size={14} className="text-brand-teal" />
                <span className="text-[10px] font-black text-navy uppercase tracking-widest italic">{val} Pharmacies</span>
              </div>
            )
          },
          { 
            key: 'totalStock', 
            label: 'Total City Stock',
            render: (val) => (
               <div className="font-syne font-black text-navy text-lg italic">{val} Units</div>
            )
          },
          { 
            key: 'demand', 
            label: 'Market Demand',
            render: (val) => (
              <div className={`text-[10px] font-black uppercase tracking-widest ${
                val === 'High' ? 'text-orange-500' : 'text-navy/40'
              }`}>
                {val} Demand
              </div>
            )
          },
          { 
            key: 'status', 
            label: 'Health Status',
            render: (val) => (
              <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest w-fit border ${
                val === 'Healthy' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                val === 'Low Stock' ? 'bg-amber-50 text-amber-600 border-amber-100' : 
                'bg-red-50 text-red-600 border-red-100'
              }`}>
                {val}
              </div>
            )
          }
        ]}
        data={inventory}
        actions={false}
      />
    </div>
  );
}
