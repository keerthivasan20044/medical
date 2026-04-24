import { useState } from 'react';
import DataTable from '../../components/dashboard/DataTable';
import { Pill, Briefcase, Tag, AlertTriangle, Upload, Plus, Package } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminMedicines() {
  const MEDICINES = [
    { id: '1', name: 'Paracetamol 500mg', brand: 'Crocin', category: 'Pain Relief', price: 15, stock: 4500, status: 'In Stock' },
    { id: '2', name: 'Amoxicillin 250mg', brand: 'Novamox', category: 'Antibiotics', price: 120, stock: 800, status: 'In Stock' },
    { id: '3', name: 'Metformin 500mg', brand: 'Glycomet', category: 'Diabetes', price: 45, stock: 120, status: 'Low Stock' },
    { id: '4', name: 'Loratadine 10mg', brand: 'Claritin', category: 'Allergy', price: 85, stock: 0, status: 'Out of Stock' },
  ];

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="font-syne font-black text-4xl text-navy italic tracking-tighter uppercase">Medicine Manifest</h1>
          <p className="text-xs font-dm font-bold text-navy/40 uppercase tracking-widest mt-1 italic">Global Catalog Synchronization</p>
        </div>
        <div className="flex items-center gap-4">
          <button className="h-14 px-6 border-2 border-navy/10 text-navy rounded-[2rem] font-syne font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:bg-navy hover:text-white transition-all">
            <Upload size={18} /> Bulk Import
          </button>
          <button className="h-14 px-8 bg-navy text-brand-teal rounded-[2rem] font-syne font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:scale-105 transition-all shadow-xl shadow-navy/20">
            <Plus size={18} /> New Entry
          </button>
        </div>
      </div>

      <DataTable 
        title="Inventory Matrix"
        columns={[
          { 
            key: 'name', 
            label: 'Medicine',
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
          { 
            key: 'category', 
            label: 'Classification',
            render: (val) => (
              <div className="flex items-center gap-2">
                <Tag size={12} className="text-brand-teal" />
                <span className="text-[10px] font-black text-navy uppercase tracking-widest italic">{val}</span>
              </div>
            )
          },
          { key: 'price', label: 'Unit Price', render: (val) => `₹${val}` },
          { 
            key: 'stock', 
            label: 'Global Stock',
            render: (val) => (
              <div className="flex items-center gap-3">
                <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden w-20">
                  <div 
                    className={`h-full rounded-full ${val < 500 ? 'bg-red-500' : 'bg-emerald-500'}`} 
                    style={{ width: `${Math.min(100, val / 50)}%` }} 
                  />
                </div>
                <span className="text-xs font-bold text-navy">{val}</span>
              </div>
            )
          },
          { 
            key: 'status', 
            label: 'Availability',
            render: (val) => (
              <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest w-fit border ${
                val === 'In Stock' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                val === 'Low Stock' ? 'bg-amber-50 text-amber-600 border-amber-100' : 
                'bg-red-50 text-red-600 border-red-100'
              }`}>
                {val === 'Out of Stock' && <AlertTriangle size={10} />}
                {val}
              </div>
            )
          }
        ]}
        data={MEDICINES}
        actions={true}
      />
    </div>
  );
}
