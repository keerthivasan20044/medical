import { useState } from 'react';
import DataTable from '../../components/dashboard/DataTable';
import { Pill, Tag, AlertTriangle, Plus, Upload, Filter, Search } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PharmacistInventory() {
  const [loading, setLoading] = useState(false);

  const INVENTORY = [
    { id: '1', name: 'Paracetamol 500mg', brand: 'Crocin', stock: 1240, price: 15, expiry: '2025-12-31', status: 'In Stock' },
    { id: '2', name: 'Amoxicillin 250mg', brand: 'Novamox', stock: 45, price: 120, expiry: '2024-05-20', status: 'Low Stock' },
    { id: '3', name: 'Metformin 500mg', brand: 'Glycomet', stock: 850, price: 45, expiry: '2025-08-15', status: 'In Stock' },
    { id: '4', name: 'Loratadine 10mg', brand: 'Claritin', stock: 0, price: 85, expiry: '2024-03-10', status: 'Out of Stock' },
  ];

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="font-syne font-black text-4xl text-navy italic tracking-tighter uppercase">Local Matrix</h1>
          <p className="text-xs font-dm font-bold text-navy/40 uppercase tracking-widest mt-1 italic">Node Inventory Synchronization</p>
        </div>
        <div className="flex items-center gap-4">
           <button className="h-14 px-6 border-2 border-navy/10 text-navy rounded-[2rem] font-syne font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:bg-navy hover:text-white transition-all">
             <Upload size={18} /> Sync Catalog
           </button>
           <button className="h-14 px-8 bg-brand-teal text-navy rounded-[2rem] font-syne font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:scale-105 transition-all shadow-xl shadow-brand-teal/20">
             <Plus size={18} /> Add Resource
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { label: 'Critically Low', count: 3, icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-50' },
          { label: 'Near Expiry', count: 5, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50' },
          { label: 'Total SKUs', count: 1248, icon: Pill, color: 'text-brand-teal', bg: 'bg-brand-teal/10' },
        ].map((stat) => (
          <div key={stat.label} className={`${stat.bg} p-8 rounded-[2.5rem] border border-gray-100 flex items-center justify-between`}>
             <div>
                <p className="text-[10px] font-black text-navy/40 uppercase tracking-widest italic mb-1">{stat.label}</p>
                <h4 className={`text-3xl font-syne font-black italic tracking-tighter ${stat.color}`}>{stat.count}</h4>
             </div>
             <div className={`h-14 w-14 rounded-2xl flex items-center justify-center bg-white shadow-sm ${stat.color}`}>
                <stat.icon size={24} />
             </div>
          </div>
        ))}
      </div>

      <DataTable 
        title="Node Inventory Matrix"
        isLoading={loading}
        columns={[
          { 
            key: 'name', 
            label: 'Resource',
            render: (val, row) => (
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-navy/5 rounded-xl flex items-center justify-center text-navy/40">
                  <Pill size={18} />
                </div>
                <div>
                  <div className="font-dm font-black text-navy text-sm italic">{val}</div>
                  <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest italic">{row.brand}</div>
                </div>
              </div>
            )
          },
          { key: 'stock', label: 'Unit Stock' },
          { key: 'price', label: 'Node Price', render: (val) => `₹${val}` },
          { 
            key: 'expiry', 
            label: 'Temporal Expiry',
            render: (val) => (
              <span className={`text-[10px] font-bold uppercase tracking-widest italic ${
                new Date(val) < new Date() ? 'text-red-500' : 'text-navy/40'
              }`}>{val}</span>
            )
          },
          { 
            key: 'status', 
            label: 'Integrity Protocol',
            render: (val) => (
              <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest w-fit border ${
                val === 'In Stock' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                val === 'Low Stock' ? 'bg-amber-50 text-amber-600 border-amber-100' : 
                'bg-red-50 text-red-600 border-red-100'
              }`}>
                {val}
              </div>
            )
          }
        ]}
        data={INVENTORY}
        actions={true}
      />
    </div>
  );
}

// Minimal Clock icon for stats
function Clock({ size, className }) {
  return (
    <svg 
      width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}
    >
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
