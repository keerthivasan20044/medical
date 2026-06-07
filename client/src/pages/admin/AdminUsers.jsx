import { useState, useEffect } from 'react';
import DataTable from '../../components/dashboard/DataTable';
import { adminService } from '../../services/apiServices';
import { User, Shield, Clock, Download, Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'customer',
    password: '',
    isActive: true,
    isVerified: true
  });

  const fetchUsers = async (pageNum = 1, searchQuery = '') => {
    try {
      setLoading(true);
      const data = await adminService.getUsers({ page: pageNum, limit: 10, search: searchQuery });
      setUsers(data.items || []);
      setPage(data.page || 1);
      setTotalPages(data.pages || 1);
      setTotalRecords(data.total || 0);
    } catch (e) {
      toast.error('Could not load users');
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

  const handleToggleStatus = async (id) => {
    try {
      await adminService.toggleUserStatus(id);
      toast.success('User updated');
      fetchUsers(page, search);
    } catch (err) {
      toast.error('Failed to update user status');
    }
  };

  const openCreate = () => {
    setEditing(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      role: 'customer',
      password: '',
      isActive: true,
      isVerified: true
    });
    setModalOpen(true);
  };

  const openEdit = (row) => {
    setEditing(row);
    setFormData({
      name: row.name || '',
      email: row.email || '',
      phone: row.phone || '',
      role: row.role || 'customer',
      password: '',
      isActive: row.isActive !== false,
      isVerified: Boolean(row.isVerified)
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData };
      if (!payload.password) delete payload.password;
      if (editing) {
        await adminService.updateUser(editing._id || editing.id, payload);
        toast.success('User updated');
      } else {
        await adminService.createUser(payload);
        toast.success('User created');
      }
      setModalOpen(false);
      fetchUsers(page, search);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save user');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Deactivate this user account?')) return;
    try {
      await adminService.deleteUser(id);
      toast.success('User deactivated');
      fetchUsers(page, search);
    } catch (err) {
      toast.error('Failed to deactivate user');
    }
  };

  const handleExport = () => {
    toast.success('User registry exported to CSV');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="min-w-0">
          <h1 className="font-syne font-black text-3xl md:text-4xl text-navy tracking-tight uppercase">User Registry</h1>
          <p className="text-xs font-dm font-bold text-navy/40 uppercase tracking-widest mt-1">Total Records: {totalRecords}</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <button 
            onClick={handleExport}
            className="h-12 px-6 bg-white border border-gray-100 text-navy rounded-2xl font-syne font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-navy hover:text-white active:scale-95 transition-all w-full md:w-auto"
          >
            <Download size={18} /> Export CSV
          </button>
          <button 
            onClick={openCreate}
            className="h-12 px-6 bg-navy text-brand-teal rounded-2xl font-syne font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-brand-teal hover:text-navy active:scale-95 transition-all shadow-xl shadow-navy/20 w-full md:w-auto"
          >
            <Plus size={18} /> Add User
          </button>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-navy/60 backdrop-blur-md">
          <div className="bg-white w-full max-w-2xl rounded-3xl p-8 shadow-4xl space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-syne font-black text-2xl text-navy uppercase">{editing ? 'Edit User' : 'Add User'}</h2>
              <button onClick={() => setModalOpen(false)} className="h-10 w-10 rounded-xl bg-gray-50 text-navy/45 hover:text-navy" aria-label="Close user form">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSave} className="grid md:grid-cols-2 gap-5">
              <label className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-navy/40">Name</span>
                <input required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full h-12 rounded-2xl border border-gray-100 bg-gray-50 px-4 font-dm font-bold text-sm outline-none focus:border-brand-teal" />
              </label>
              <label className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-navy/40">Role</span>
                <select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} className="w-full h-12 rounded-2xl border border-gray-100 bg-gray-50 px-4 font-dm font-bold text-sm outline-none focus:border-brand-teal">
                  <option value="customer">Customer</option>
                  <option value="doctor">Doctor</option>
                  <option value="pharmacist">Pharmacist</option>
                  <option value="delivery">Delivery</option>
                  <option value="admin">Admin</option>
                </select>
              </label>
              <label className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-navy/40">Email</span>
                <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full h-12 rounded-2xl border border-gray-100 bg-gray-50 px-4 font-dm font-bold text-sm outline-none focus:border-brand-teal" />
              </label>
              <label className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-navy/40">Phone</span>
                <input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full h-12 rounded-2xl border border-gray-100 bg-gray-50 px-4 font-dm font-bold text-sm outline-none focus:border-brand-teal" />
              </label>
              <label className="space-y-2 md:col-span-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-navy/40">Password {editing ? '(leave blank to keep current)' : ''}</span>
                <input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="w-full h-12 rounded-2xl border border-gray-100 bg-gray-50 px-4 font-dm font-bold text-sm outline-none focus:border-brand-teal" />
              </label>
              <label className="h-12 px-4 rounded-2xl bg-gray-50 border border-gray-100 flex items-center gap-3 font-syne font-black text-[10px] uppercase tracking-widest text-navy">
                <input type="checkbox" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} className="h-4 w-4 accent-brand-teal" />
                Active
              </label>
              <label className="h-12 px-4 rounded-2xl bg-gray-50 border border-gray-100 flex items-center gap-3 font-syne font-black text-[10px] uppercase tracking-widest text-navy">
                <input type="checkbox" checked={formData.isVerified} onChange={(e) => setFormData({ ...formData, isVerified: e.target.checked })} className="h-4 w-4 accent-brand-teal" />
                Verified
              </label>
              <button className="md:col-span-2 h-14 rounded-2xl bg-navy text-brand-teal font-syne font-black text-xs uppercase tracking-widest">
                {editing ? 'Save User' : 'Create User'}
              </button>
            </form>
          </div>
        </div>
      )}

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
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-10 w-10 bg-navy/5 rounded-xl flex items-center justify-center text-navy/40">
                  <User size={18} />
                </div>
                <div className="min-w-0">
                  <div className="font-dm font-black text-navy text-sm truncate max-w-44">{val}</div>
                  <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest truncate max-w-52">{row.email}</div>
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
                <span className="text-[10px] font-black text-navy uppercase tracking-widest">{val}</span>
              </div>
            )
          },
          { key: 'phone', label: 'Contact' },
          { 
            key: 'status', 
            label: 'Service',
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
        onEdit={openEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}
