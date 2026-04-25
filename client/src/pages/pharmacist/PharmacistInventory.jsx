import { useState, useEffect } from 'react';
import DataTable from '../../components/dashboard/DataTable';
import { medicineService } from '../../services/apiServices';
import { Pill, Tag, AlertTriangle, Plus, Upload, Filter, Search, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PharmacistInventory() {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [search, setSearch] = useState('');
  const [stats, setStats] = useState({
    lowStock: 0,
    nearExpiry: 0,
    totalItems: 0
  });

  const fetchInventory = async (pageNum = 1, searchQuery = '') => {
    try {
      setLoading(true);
      // The API should handle filtering by pharmacist identity automatically via token
      // or we can pass pharmacistId if needed. Assuming the backend already does this for /api/medicines/my-inventory
      const data = await medicineService.getAll({ page: pageNum, limit: 10, q: searchQuery });
      setMedicines(data.items || []);
      setPage(data.page || 1);
      setTotalPages(data.pages || 1);
      setTotalRecords(data.total || 0);
      
      // Calculate stats locally or fetch from specialized endpoint
      setStats({
        lowStock: (data.items || []).filter(m => m.stock < 10 && m.stock > 0).length,
        nearExpiry: 0, // Would need expiry date logic
        totalItems: data.total || 0
      });
    } catch (e) {
      toast.error('Failed to load inventory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => fetchInventory(1, search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  const handlePageChange = (newPage) => {
    fetchInventory(newPage, search);
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="font-syne font-black text-4xl text-navy italic tracking-tighter uppercase">Inventory</h1>
          <p className="text-xs font-dm font-bold text-navy/40 uppercase tracking-widest mt-1 italic">Manage Your Stock</p>
        </div>
        <div className="flex items-center gap-4">
           <button className="h-14 px-6 border-2 border-navy/10 text-navy rounded-[2rem] font-syne font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:bg-navy hover:text-white transition-all">
             <Upload size={18} /> Import Catalog
           </button>
           <button className="h-14 px-8 bg-brand-teal text-navy rounded-[2rem] font-syne font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:scale-105 transition-all shadow-xl shadow-brand-teal/20">
             <Plus size={18} /> Add Medicine
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { label: 'Low Stock', count: stats.lowStock, icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-50' },
          { label: 'Expiring Soon', count: stats.nearExpiry, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50' },
          { label: 'Total Items', count: stats.totalItems, icon: Pill, color: 'text-brand-teal', bg: 'bg-brand-teal/10' },
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
        title="Inventory List"
        isLoading={loading}
        onSearch={setSearch}
        currentPage={page}
        totalPages={totalPages}
        totalRecords={totalRecords}
        onPageChange={handlePageChange}
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
          { key: 'stock', label: 'Stock' },
          { key: 'price', label: 'Price', render: (val) => `₹${val}` },
          { 
            key: 'expiryDate', 
            label: 'Expiry Date',
            render: (val) => (
              <span className={`text-[10px] font-bold uppercase tracking-widest italic ${
                new Date(val) < new Date() ? 'text-red-500' : 'text-navy/40'
              }`}>{val ? new Date(val).toLocaleDateString() : 'N/A'}</span>
            )
          },
          { 
            key: 'status', 
            label: 'Status',
            render: (val, row) => {
              const status = row.stock === 0 ? 'Out of Stock' : row.stock < 10 ? 'Low Stock' : 'In Stock';
              return (
                <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest w-fit border ${
                  status === 'In Stock' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                  status === 'Low Stock' ? 'bg-amber-50 text-amber-600 border-amber-100' : 
                  'bg-red-50 text-red-600 border-red-100'
                }`}>
                  {status}
                </div>
              );
            }
          }
        ]}
        data={medicines}
        actions={true}
      />
    </div>
  );
}
