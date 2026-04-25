import { useState, useEffect } from 'react';
import DataTable from '../../components/dashboard/DataTable';
import { pharmacyService } from '../../services/apiServices';
import { Store, MapPin, Star, ShieldCheck, AlertCircle, Plus, Filter, Search } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminPharmacies() {
  const [activeTab, setActiveTab] = useState('active');
  const [pharmacies, setPharmacies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [search, setSearch] = useState('');

  const fetchPharmacies = async (pageNum = 1, searchQuery = '', status = 'active') => {
    try {
      setLoading(true);
      const params = { 
        page: pageNum, 
        limit: 10, 
        search: searchQuery,
        status: status === 'all' ? '' : status
      };
      const data = await pharmacyService.getAll(params);
      setPharmacies(data.items || []);
      setPage(data.page || 1);
      setTotalPages(data.pages || 1);
      setTotalRecords(data.total || 0);
    } catch (e) {
      toast.error('Failed to load pharmacies');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => fetchPharmacies(1, search, activeTab), 500);
    return () => clearTimeout(timer);
  }, [search, activeTab]);

  const handlePageChange = (newPage) => {
    fetchPharmacies(newPage, search, activeTab);
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="font-syne font-black text-4xl text-navy italic tracking-tighter uppercase">Pharmacies</h1>
          <p className="text-xs font-dm font-bold text-navy/40 uppercase tracking-widest mt-1 italic">Managed Pharmacies</p>
        </div>
        <button 
          className="h-14 px-8 bg-brand-teal text-navy rounded-[2rem] font-syne font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-brand-teal/20"
        >
          <Plus size={18} /> Register Pharmacy
        </button>
      </div>

      {/* Custom Tabs */}
      <div className="flex items-center gap-4 bg-white p-2 rounded-[2.5rem] border border-gray-100 shadow-sm w-fit">
        {['all', 'active', 'pending', 'suspended'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-8 py-3 rounded-[2rem] text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
              activeTab === tab ? 'bg-navy text-white shadow-lg' : 'text-navy/40 hover:text-navy hover:bg-gray-50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <DataTable 
        title={`${activeTab === 'all' ? 'All' : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Pharmacies`}
        isLoading={loading}
        onSearch={setSearch}
        currentPage={page}
        totalPages={totalPages}
        totalRecords={totalRecords}
        onPageChange={handlePageChange}
        columns={[
          { 
            key: 'name', 
            label: 'Pharmacy',
            render: (val, row) => (
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-navy text-brand-teal rounded-xl flex items-center justify-center">
                  <Store size={18} />
                </div>
                <div>
                  <div className="font-dm font-black text-navy text-sm italic">{val}</div>
                  <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest italic flex items-center gap-1">
                    <MapPin size={10} /> {row.city}
                  </div>
                </div>
              </div>
            )
          },
          { 
            key: 'rating', 
            label: 'Integrity',
            render: (val) => (
              <div className="flex items-center gap-1 text-amber-500 font-syne font-black text-xs">
                <Star size={14} fill="currentColor" /> {val}
              </div>
            )
          },
          { key: 'orders', label: 'Total Syncs' },
          { 
            key: 'status', 
            label: 'Protocol',
            render: (val) => (
              <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest w-fit border ${
                val === 'active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                val === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-100 animate-pulse' : 
                'bg-red-50 text-red-600 border-red-100'
              }`}>
                {val}
              </div>
            )
          }
        ]}
        data={pharmacies}
        actions={true}
      />
    </div>
  );
}
