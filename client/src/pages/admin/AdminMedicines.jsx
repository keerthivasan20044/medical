import { useState, useEffect } from 'react';
import DataTable from '../../components/dashboard/DataTable';
import { medicineService } from '../../services/apiServices';
import { Pill, Briefcase, Tag, AlertTriangle, Upload, Plus, Package, Search } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminMedicines() {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [search, setSearch] = useState('');

  const fetchMedicines = async (pageNum = 1, searchQuery = '') => {
    try {
      setLoading(true);
      const data = await medicineService.getAll({ page: pageNum, limit: 10, q: searchQuery });
      setMedicines(data.items || []);
      setPage(data.page || 1);
      setTotalPages(data.pages || 1);
      setTotalRecords(data.total || 0);
    } catch (e) {
      toast.error('Failed to load medicines');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => fetchMedicines(1, search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  const handlePageChange = (newPage) => {
    fetchMedicines(newPage, search);
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="font-syne font-black text-4xl text-navy italic tracking-tighter uppercase">Medicine Catalog</h1>
          <p className="text-xs font-dm font-bold text-navy/40 uppercase tracking-widest mt-1 italic">View and Manage Medicines</p>
        </div>
        <div className="flex items-center gap-4">
          <button className="h-14 px-6 border-2 border-navy/10 text-navy rounded-[2rem] font-syne font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:bg-navy hover:text-white transition-all">
            <Upload size={18} /> Bulk Import
          </button>
          <button className="h-14 px-8 bg-navy text-brand-teal rounded-[2rem] font-syne font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:scale-105 transition-all shadow-xl shadow-navy/20">
            <Plus size={18} /> Add Medicine
          </button>
        </div>
      </div>

      <DataTable 
        title="Medicine Inventory"
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
          { 
            key: 'category', 
            label: 'Category',
            render: (val) => (
              <div className="flex items-center gap-2">
                <Tag size={12} className="text-brand-teal" />
                <span className="text-[10px] font-black text-navy uppercase tracking-widest italic">{val}</span>
              </div>
            )
          },
          { key: 'price', label: 'Price', render: (val) => `₹${val}` },
          { 
            key: 'stock', 
            label: 'Stock Level',
            render: (val) => (
              <div className="flex items-center gap-3">
                <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden w-20">
                  <div 
                    className={`h-full rounded-full ${val < 10 ? 'bg-red-500' : val < 50 ? 'bg-amber-500' : 'bg-emerald-500'}`} 
                    style={{ width: `${Math.min(100, val)}%` }} 
                  />
                </div>
                <span className="text-xs font-bold text-navy">{val}</span>
              </div>
            )
          },
          { 
            key: 'isActive', 
            label: 'Status',
            render: (val, row) => {
              const status = row.stock === 0 ? 'Out of Stock' : row.stock < 10 ? 'Low Stock' : 'In Stock';
              return (
                <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest w-fit border ${
                  status === 'In Stock' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                  status === 'Low Stock' ? 'bg-amber-50 text-amber-600 border-amber-100' : 
                  'bg-red-50 text-red-600 border-red-100'
                }`}>
                  {status === 'Out of Stock' && <AlertTriangle size={10} />}
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
