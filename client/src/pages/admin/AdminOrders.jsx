import { useState, useEffect } from 'react';
import DataTable from '../../components/dashboard/DataTable';
import { orderService } from '../../services/apiServices';
import { ShoppingBag, Clock, CheckCircle2, XCircle, Package, Truck, AlertCircle, Search } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminOrders() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [search, setSearch] = useState('');

  const fetchOrders = async (pageNum = 1, searchQuery = '', filter = 'All') => {
    try {
      setLoading(true);
      const params = {
        page: pageNum,
        limit: 10,
        search: searchQuery,
        status: filter === 'All' ? '' : filter.toLowerCase()
      };
      const data = await orderService.getAll(params);
      setOrders(data.items || []);
      setPage(data.page || 1);
      setTotalPages(data.pages || 1);
      setTotalRecords(data.total || 0);
    } catch (e) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => fetchOrders(1, search, activeFilter), 500);
    return () => clearTimeout(timer);
  }, [search, activeFilter]);

  const handlePageChange = (newPage) => {
    fetchOrders(newPage, search, activeFilter);
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="font-syne font-black text-4xl text-navy italic tracking-tighter uppercase">Order Management</h1>
          <p className="text-xs font-dm font-bold text-navy/40 uppercase tracking-widest mt-1 italic">View and Manage All Orders</p>
        </div>
        <div className="flex bg-white p-1.5 rounded-[2rem] border border-gray-100 shadow-sm overflow-x-auto no-scrollbar">
          {['All', 'Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-6 py-2.5 rounded-[1.5rem] text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                activeFilter === filter ? 'bg-navy text-white' : 'text-navy/40 hover:text-navy hover:bg-gray-50'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <DataTable 
        title="All Orders"
        isLoading={loading}
        onSearch={setSearch}
        currentPage={page}
        totalPages={totalPages}
        totalRecords={totalRecords}
        onPageChange={handlePageChange}
        columns={[
          { 
            key: 'orderNumber', 
            label: 'Order ID',
            render: (val) => (
              <span className="font-syne font-black text-xs text-brand-teal italic">{val}</span>
            )
          },
          { 
            key: 'customerId', 
            label: 'Customer',
            render: (val, row) => (
              <div className="font-dm font-bold text-navy text-sm italic">{row.customerId?.name || 'Unknown'}</div>
            )
          },
          { 
            key: 'pharmacyId', 
            label: 'Pharmacy',
            render: (val, row) => (
              <div className="font-dm font-bold text-navy text-sm italic">{row.pharmacyId?.name || 'Unknown'}</div>
            )
          },
          { key: 'totalAmount', label: 'Price', render: (val) => `₹${val}` },
          { 
            key: 'status', 
            label: 'Status',
            render: (val) => (
              <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest w-fit border flex items-center gap-2 ${
                val === 'delivered' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                val === 'cancelled' ? 'bg-red-50 text-red-600 border-red-100' : 
                val === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                'bg-blue-50 text-blue-600 border-blue-100'
              }`}>
                {val === 'delivered' ? <CheckCircle2 size={12} /> : 
                 val === 'cancelled' ? <XCircle size={12} /> : 
                 val === 'pending' ? <Clock size={12} className="animate-spin-slow" /> :
                 <Truck size={12} />}
                {val}
              </div>
            )
          },
          { 
            key: 'createdAt', 
            label: 'Date',
            render: (val) => (
              <span className="text-[10px] font-bold text-navy/40 uppercase tracking-widest">
                {new Date(val).toLocaleDateString()} {new Date(val).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            )
          }
        ]}
        data={orders}
        actions={true}
      />
    </div>
  );
}
