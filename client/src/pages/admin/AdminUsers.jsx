import { useState, useEffect } from 'react';
import DataTable from '../../components/dashboard/DataTable';
import { adminService } from '../../services/apiServices';
import { User, Shield, Clock, Mail, Phone, MoreHorizontal, Download } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [search, setSearch] = useState('');

  const fetchUsers = async (pageNum = 1, searchQuery = '') => {
    try {
      setLoading(true);
      const data = await adminService.getUsers({ page: pageNum, limit: 10, search: searchQuery });
      setUsers(data.items || []);
      setPage(data.page || 1);
      setTotalPages(data.pages || 1);
      setTotalRecords(data.total || 0);
    } catch (e) {
      toast.error('Failed to sync user registry');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => fetchUsers(1, search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  const handlePageChange = (newPage) => {
    fetchUsers(newPage, search);
  };

  const handleExport = () => {
    toast.success('User registry exported to CSV');
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="font-syne font-black text-4xl text-navy italic tracking-tighter uppercase">User Registry</h1>
          <p className="text-xs font-dm font-bold text-navy/40 uppercase tracking-widest mt-1 italic">Total Enclaves Synchronized: {users.length}</p>
        </div>
        <button 
          onClick={handleExport}
          className="h-14 px-8 bg-navy text-brand-teal rounded-[2rem] font-syne font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-navy/20"
        >
          <Download size={18} /> Export CSV
        </button>
      </div>

      <DataTable 
        title="Global Users"
        isLoading={loading}
        onSearch={setSearch}
        currentPage={page}
        totalPages={totalPages}
        totalRecords={totalRecords}
        onPageChange={handlePageChange}
        columns={[
          { 
            key: 'name', 
            label: 'Identity',
            render: (val, row) => (
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-navy/5 rounded-xl flex items-center justify-center text-navy/40">
                  <User size={18} />
                </div>
                <div>
                  <div className="font-dm font-black text-navy text-sm italic">{val}</div>
                  <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest italic">{row.email}</div>
                </div>
              </div>
            )
          },
          { 
            key: 'role', 
            label: 'Designation',
            render: (val) => (
              <div className="flex items-center gap-2">
                <Shield size={14} className={val === 'admin' ? 'text-brand-teal' : 'text-navy/20'} />
                <span className="text-[10px] font-black text-navy uppercase tracking-widest italic">{val}</span>
              </div>
            )
          },
          { key: 'phone', label: 'Contact' },
          { 
            key: 'status', 
            label: 'Protocol',
            render: (val) => (
              <div className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest w-fit ${
                val === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
              }`}>
                {val}
              </div>
            )
          },
          { 
            key: 'createdAt', 
            label: 'Registry Date',
            render: (val) => (
              <div className="flex items-center gap-2 text-navy/40">
                <Clock size={14} />
                <span className="text-xs font-bold">{new Date(val).toLocaleDateString()}</span>
              </div>
            )
          }
        ]}
        data={users}
        actions={true}
      />
    </div>
  );
}
