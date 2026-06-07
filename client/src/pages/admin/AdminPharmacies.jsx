import { useState, useEffect } from 'react';
import DataTable from '../../components/dashboard/DataTable';
import { pharmacyService } from '../../services/apiServices';
import { Store, MapPin, Star, Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminPharmacies() {
  const [activeTab, setActiveTab] = useState('active');
  const [pharmacies, setPharmacies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: 'Karaikal',
    state: 'Puducherry',
    pincode: '',
    phone: '',
    email: '',
    licenseNumber: '',
    services: 'Home Delivery, Emergency',
    status: 'active'
  });

  const fetchPharmacies = async (pageNum = 1, searchQuery = '', status = 'active') => {
    try {
      setLoading(true);
      const params = { 
        page: pageNum, 
        limit: 10, 
        search: searchQuery
      };
      if (status) params.status = status;
      const data = await pharmacyService.getAdminAll(params);
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

  const handleDeletePharmacy = async (id) => {
    if (!window.confirm('Are you sure you want to delete this pharmacy?')) return;
    try {
      await pharmacyService.delete(id);
      toast.success('Pharmacy deleted');
      fetchPharmacies(page, search, activeTab);
    } catch (err) {
      toast.error('Failed to decommission pharmacy');
    }
  };

  const openCreate = () => {
    setEditing(null);
    setFormData({
      name: '',
      address: '',
      city: 'Karaikal',
      state: 'Puducherry',
      pincode: '',
      phone: '',
      email: '',
      licenseNumber: '',
      services: 'Home Delivery, Emergency',
      status: 'active'
    });
    setModalOpen(true);
  };

  const openEdit = (row) => {
    setEditing(row);
    setFormData({
      name: row.name || '',
      address: row.address || '',
      city: row.city || 'Karaikal',
      state: row.state || 'Puducherry',
      pincode: row.pincode || '',
      phone: Array.isArray(row.phone) ? row.phone.join(', ') : row.phone || '',
      email: row.email || '',
      licenseNumber: row.licenseNumber || row.license || '',
      services: Array.isArray(row.services) ? row.services.join(', ') : row.services || '',
      status: row.status || 'active'
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await pharmacyService.update(editing._id || editing.id, formData);
        toast.success('Pharmacy updated');
      } else {
        await pharmacyService.create(formData);
        toast.success('Pharmacy registered');
      }
      setModalOpen(false);
      fetchPharmacies(page, search, activeTab);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save pharmacy');
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="font-syne font-black text-4xl text-navy italic tracking-tighter uppercase">Pharmacies</h1>
          <p className="text-xs font-dm font-bold text-navy/40 uppercase tracking-widest mt-1 italic">Managed Pharmacies</p>
        </div>
        <button 
          onClick={openCreate}
          className="h-14 px-8 bg-brand-teal text-navy rounded-[2rem] font-syne font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-brand-teal/20"
        >
          <Plus size={18} /> Register Pharmacy
        </button>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-navy/60 backdrop-blur-md">
          <div className="bg-white w-full max-w-3xl rounded-3xl p-8 shadow-4xl space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-syne font-black text-2xl text-navy uppercase">{editing ? 'Edit Pharmacy' : 'Register Pharmacy'}</h2>
              <button onClick={() => setModalOpen(false)} className="h-10 w-10 rounded-xl bg-gray-50 text-navy/45 hover:text-navy" aria-label="Close pharmacy form">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-5">
              {[
                ['name', 'Pharmacy Name', true],
                ['city', 'City', true],
                ['address', 'Address', true],
                ['pincode', 'Pincode', false],
                ['phone', 'Phone Numbers', false],
                ['email', 'Email', false],
                ['licenseNumber', 'License Number', false],
                ['services', 'Services', false]
              ].map(([key, label, required]) => (
                <label key={key} className={key === 'address' ? 'md:col-span-2 space-y-2' : 'space-y-2'}>
                  <span className="text-[10px] font-black uppercase tracking-widest text-navy/40">{label}</span>
                  <input
                    required={required}
                    value={formData[key]}
                    onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                    className="w-full h-12 rounded-2xl border border-gray-100 bg-gray-50 px-4 font-dm font-bold text-sm outline-none focus:border-brand-teal"
                  />
                </label>
              ))}
              <label className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-navy/40">Status</span>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full h-12 rounded-2xl border border-gray-100 bg-gray-50 px-4 font-dm font-bold text-sm outline-none focus:border-brand-teal"
                >
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="suspended">Suspended</option>
                </select>
              </label>
              <button className="md:col-span-2 h-14 rounded-2xl bg-navy text-brand-teal font-syne font-black text-xs uppercase tracking-widest">
                {editing ? 'Save Pharmacy' : 'Create Pharmacy'}
              </button>
            </form>
          </div>
        </div>
      )}

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
          { key: 'orders', label: 'Total Orders' },
          { 
            key: 'status', 
            label: 'Service',
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
        onEdit={openEdit}
        onDelete={handleDeletePharmacy}
      />
    </div>
  );
}
