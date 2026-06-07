import { useEffect, useState } from 'react';
import DataTable from '../../components/dashboard/DataTable';
import OrderManagementModal from '../../components/dashboard/OrderManagementModal';
import { pharmacistService } from '../../services/apiServices';
import { Clock, CheckCircle2, Truck, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useLanguage } from '../../context/LanguageContext';

export default function PharmacistOrders() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('New');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const statusMap = {
    New: 'pending',
    Confirmed: 'confirmed',
    Preparing: 'preparing',
    Transit: 'out for delivery',
    Completed: 'delivered'
  };

  const nextStatusMap = {
    pending: 'confirmed',
    confirmed: 'preparing',
    preparing: 'out for delivery'
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
      const data = await pharmacistService.getOrdersPage(params);
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

  const advanceOrder = async (row) => {
    const nextStatus = nextStatusMap[row.status];
    if (!nextStatus) return;
    try {
      await pharmacistService.updateOrderStatus(row._id, nextStatus);
      toast.success(`Order moved to ${nextStatus}`);
      fetchOrders(page, search, activeTab);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update order');
    }
  };

  const handleOrderUpdated = () => {
    fetchOrders(page, search, activeTab);
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="font-syne font-black text-4xl text-navy italic tracking-tighter uppercase">Orders</h1>
          <p className="text-xs font-dm font-bold text-navy/40 uppercase tracking-widest mt-1 italic">Manage incoming, dispatch, and tracked orders</p>
        </div>
        <div className="flex bg-white p-1.5 rounded-[2rem] border border-gray-100 shadow-sm overflow-x-auto no-scrollbar">
          {['New', 'Confirmed', 'Preparing', 'Transit', 'Completed'].map(tab => (
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
          { key: 'totalAmount', label: 'Total Price', render: (val) => `Rs.${val}` },
          {
            key: 'status',
            label: 'Status',
            render: (val) => (
              <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest w-fit border flex items-center gap-2 ${
                val === 'pending' ? 'bg-blue-50 text-blue-600 border-blue-100 animate-pulse' :
                val === 'confirmed' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                val === 'preparing' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                val === 'out for delivery' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                'bg-gray-50 text-gray-400 border-gray-100'
              }`}>
                {val === 'pending' && <AlertCircle size={12} />}
                {val === 'confirmed' && <CheckCircle2 size={12} />}
                {val === 'preparing' && <Clock size={12} />}
                {val === 'out for delivery' && <Truck size={12} />}
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
          },
          {
            key: 'actions',
            label: 'Action',
            render: (_, row) => {
              const nextStatus = nextStatusMap[row.status];
              return (
                <div className="flex flex-wrap gap-2">
                  {nextStatus && (
                    <button
                      onClick={() => advanceOrder(row)}
                      className="h-9 px-4 bg-navy text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-brand-teal hover:text-navy transition-all"
                    >
                      {nextStatus === 'confirmed' ? 'Confirm' : nextStatus === 'preparing' ? 'Prepare' : 'Ready'}
                    </button>
                  )}
                  <button
                    onClick={() => setSelectedOrder(row)}
                    className="h-9 px-4 bg-gray-50 text-navy rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-navy hover:text-white transition-all"
                  >
                    Manage
                  </button>
                </div>
              );
            }
          }
        ]}
        data={orders}
        actions={false}
      />

      {selectedOrder && (
        <OrderManagementModal
          order={selectedOrder}
          title="Pharmacist Dispatch Control"
          onClose={() => setSelectedOrder(null)}
          onUpdated={handleOrderUpdated}
        />
      )}
    </div>
  );
}
