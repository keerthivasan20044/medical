import { useState, useEffect } from 'react';
import DataTable from '../../components/dashboard/DataTable';
import { adminService } from '../../services/apiServices';
import { User, Truck, ShieldCheck, Clock, MapPin, Star, Phone, MoreHorizontal, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminDelivery() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [search, setSearch] = useState('');

  const fetchAgents = async (pageNum = 1, searchQuery = '') => {
    try {
      setLoading(true);
      // Reusing getUsers with role delivery
      const data = await adminService.getUsers({ 
        page: pageNum, 
        limit: 10, 
        search: searchQuery,
        role: 'delivery' 
      });
      setAgents(data.items || []);
      setPage(data.page || 1);
      setTotalPages(data.pages || 1);
      setTotalRecords(data.total || 0);
    } catch (e) {
      toast.error('Failed to sync delivery fleet');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => fetchAgents(1, search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  const handlePageChange = (newPage) => {
    fetchAgents(newPage, search);
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="font-syne font-black text-4xl text-navy italic tracking-tighter uppercase">Delivery Fleet</h1>
          <p className="text-xs font-dm font-bold text-navy/40 uppercase tracking-widest mt-1 italic">Managing Last-Mile Logistics Nodes</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="bg-white px-6 py-3 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-brand-teal animate-pulse" />
              <span className="text-[10px] font-black text-navy/60 uppercase tracking-widest italic">{totalRecords} Agents Online</span>
           </div>
        </div>
      </div>

      <DataTable 
        title="Delivery Partners"
        isLoading={loading}
        onSearch={setSearch}
        currentPage={page}
        totalPages={totalPages}
        totalRecords={totalRecords}
        onPageChange={handlePageChange}
        columns={[
          { 
            key: 'name', 
            label: 'Agent Identity',
            render: (val, row) => (
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-navy text-brand-teal rounded-xl flex items-center justify-center">
                   <Truck size={18} />
                </div>
                <div>
                  <div className="font-dm font-black text-navy text-sm italic">{val}</div>
                  <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest italic">{row.phone}</div>
                </div>
              </div>
            )
          },
          { 
            key: 'city', 
            label: 'Operating Zone',
            render: (val, row) => (
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-brand-teal" />
                <span className="text-[10px] font-black text-navy uppercase tracking-widest italic">Karaikal Central</span>
              </div>
            )
          },
          { 
            key: 'isVerified', 
            label: 'Protocol',
            render: (val) => (
              <div className={`flex items-center gap-2 px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest w-fit ${
                val ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
              }`}>
                {val ? 'Verified' : 'Pending'}
              </div>
            )
          },
          { 
            key: 'rating', 
            label: 'Fleet Rating',
            render: (val) => (
              <div className="flex items-center gap-1 text-amber-500 font-syne font-black text-xs">
                <Star size={14} fill="currentColor" /> {val || '4.5'}
              </div>
            )
          },
          { 
            key: 'status', 
            label: 'Availability',
            render: (val, row) => (
              <div className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${
                row.isActive ? 'text-emerald-500' : 'text-red-400'
              }`}>
                <div className={`h-2 w-2 rounded-full ${row.isActive ? 'bg-emerald-500 animate-pulse' : 'bg-red-400'}`} />
                {row.isActive ? 'Active' : 'Suspended'}
              </div>
            )
          }
        ]}
        data={agents}
        actions={true}
      />
    </div>
  );
}
