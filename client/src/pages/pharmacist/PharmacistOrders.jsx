import { useState, useEffect } from 'react';
import DataTable from '../../components/dashboard/DataTable';
import { orderService } from '../../services/apiServices';
import { ShoppingBag, Clock, CheckCircle2, XCircle, Package, Truck, AlertCircle, Search } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PharmacistOrders() {
  const [activeTab, setActiveTab] = useState('New');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [search, setSearch] = useState('');

  const statusMap = {
    'New': 'pending',
    'Preparing': 'processing',
    'Ready': 'shipped',
    'Completed': 'delivered'
  };

  const fetchOrders = async (pageNum = 1, searchQuery = '', tab = 'New') => {
    try {
      setLoading(true);
      const params = {
        page: pageNum,
        limit: 10,
        search: searchQuery,
        status: statusMap[tab]
      };
      const data = await orderService.getAll(params); // The API should handle filtering by pharmacist identity automatically via token
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
    const timer = setTimeout(() => fetchOrders(1, search, activeTab), 500);
    return () => clearTimeout(timer);
  }, [search, activeTab]);

  const handlePageChange = (newPage) => {
    fetchOrders(newPage, search, activeTab);
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="font-syne font-black text-4xl text-navy italic tracking-tighter uppercase">Orders</h1>
          <p className="text-xs font-dm font-bold text-navy/40 uppercase tracking-widest mt-1 italic">Manage Incoming and Current Orders</p>
        </div>
        <div className="flex bg-white p-1.5 rounded-[2rem] border border-gray-100 shadow-sm overflow-x-auto no-scrollbar">
          {['New', 'Preparing', 'Ready', 'Completed'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-8 py-2.5 rounded-[1.5rem] text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                activeTab === tab ? 'bg-navy text-white shadow-lg shadow-navy/20' : 'text-navy/40 hover:text-navy hover:bg-gray-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <DataTable 
        title={`${activeTab} Orders`}
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
              <div className="font-dm font-bold text-navy text-sm italic">{row.customerId?.name || 'Guest'}</div>
            )
          },
          { key: 'items', label: 'Items', render: (val, row) => row.items?.length || 0 },
          { key: 'totalAmount', label: 'Total Price', render: (val) => `₹${val}` },
          { 
            key: 'status', 
            label: 'Status',
            render: (val) => (
              <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest w-fit border flex items-center gap-2 ${
                val === 'pending' ? 'bg-blue-50 text-blue-600 border-blue-100 animate-pulse' : 
                val === 'processing' ? 'bg-amber-50 text-amber-600 border-amber-100' : 
                val === 'shipped' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                'bg-gray-50 text-gray-400 border-gray-100'
              }`}>
                {val === 'pending' && <AlertCircle size={12} />}
                {val === 'processing' && <Clock size={12} />}
                {val === 'shipped' && <Package size={12} />}
                {val === 'delivered' && <CheckCircle2 size={12} />}
                {val}
              </div>
            )
          },
          { 
            key: 'createdAt', 
            label: 'Time',
            render: (val) => (
              <span className="text-[10px] font-bold text-navy/40 uppercase tracking-widest">
                {new Date(val).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
