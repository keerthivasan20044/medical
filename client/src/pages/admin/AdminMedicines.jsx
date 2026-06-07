import { useRef, useState, useEffect } from 'react';
import DataTable from '../../components/dashboard/DataTable';
import { medicineService } from '../../services/apiServices';
import { Pill, Tag, AlertTriangle, Upload, Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminMedicines() {
  const csvInputRef = useRef(null);
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [search, setSearch] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    category: 'Fever & Pain',
    price: '',
    stock: '',
    requiresPrescription: false,
    description: ''
  });

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

  const resetForm = () => {
    setEditing(null);
    setFormData({
      name: '',
      brand: '',
      category: 'Fever & Pain',
      price: '',
      stock: '',
      requiresPrescription: false,
      description: ''
    });
  };

  const openEdit = (row) => {
    setEditing(row);
    setFormData({
      name: row.name || '',
      brand: row.brand || '',
      category: row.category || 'Fever & Pain',
      price: row.price ?? '',
      stock: row.stock ?? '',
      requiresPrescription: Boolean(row.requiresPrescription),
      description: row.description || ''
    });
    setIsModalOpen(true);
  };

  const handleSaveMedicine = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock)
      };
      if (editing) {
        await medicineService.update(editing._id || editing.id, payload);
        toast.success('Medicine updated');
      } else {
        await medicineService.create(payload);
        toast.success('Medicine added to global catalog');
      }
      setIsModalOpen(false);
      resetForm();
      fetchMedicines(page, search);
    } catch (err) {
      toast.error('Failed to save medicine');
    }
  };

  const handleDeleteMedicine = async (id) => {
    if (!window.confirm('Are you sure you want to deactivate this medicine?')) return;
    try {
      await medicineService.delete(id);
      toast.success('Medicine deactivated');
      fetchMedicines(page, search);
    } catch (err) {
      toast.error('Failed to delete medicine');
    }
  };

  const parseCsvLine = (line) => {
    const values = [];
    let current = '';
    let quoted = false;

    for (let i = 0; i < line.length; i += 1) {
      const char = line[i];
      const next = line[i + 1];

      if (char === '"' && quoted && next === '"') {
        current += '"';
        i += 1;
      } else if (char === '"') {
        quoted = !quoted;
      } else if (char === ',' && !quoted) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim());
    return values;
  };

  const handleCsvImport = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const lines = text.split(/\r?\n/).map(line => line.trim()).filter(Boolean);
      if (lines.length < 2) {
        toast.error('CSV must include a header and at least one medicine');
        return;
      }

      const headers = parseCsvLine(lines[0]).map(header => header.toLowerCase());
      const required = ['name', 'category', 'price', 'stock'];
      const missing = required.filter(field => !headers.includes(field));
      if (missing.length > 0) {
        toast.error(`Missing columns: ${missing.join(', ')}`);
        return;
      }

      const rows = lines.slice(1).map((line) => {
        const values = parseCsvLine(line);
        return headers.reduce((acc, header, index) => {
          acc[header] = values[index] || '';
          return acc;
        }, {});
      });

      let imported = 0;
      for (const row of rows) {
        await medicineService.create({
          name: row.name,
          brand: row.brand || row.name,
          category: row.category,
          price: Number(row.price || 0),
          stock: Number(row.stock || 0),
          description: row.description || '',
          requiresPrescription: ['true', 'yes', '1', 'rx'].includes(String(row.requiresprescription || row.rx || '').toLowerCase())
        });
        imported += 1;
      }

      toast.success(`Imported ${imported} medicines`);
      fetchMedicines(1, search);
    } catch (err) {
      toast.error(err.response?.data?.message || 'CSV import failed');
    } finally {
      event.target.value = '';
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
    <div className="space-y-10 relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="font-syne font-black text-4xl text-navy italic tracking-tighter uppercase">Medicine Catalog</h1>
          <p className="text-xs font-dm font-bold text-navy/40 uppercase tracking-widest mt-1 italic">View and Manage Global Registry</p>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => csvInputRef.current?.click()} className="h-14 px-6 border-2 border-navy/10 text-navy rounded-[2rem] font-syne font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:bg-navy hover:text-white transition-all">
            <Upload size={18} /> Bulk Import
          </button>
          <input
            ref={csvInputRef}
            type="file"
            accept=".csv,text/csv"
            className="hidden"
            onChange={handleCsvImport}
          />
          <button 
            onClick={() => { resetForm(); setIsModalOpen(true); }}
            className="h-14 px-8 bg-navy text-brand-teal rounded-[2rem] font-syne font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:scale-105 transition-all shadow-xl shadow-navy/20"
          >
            <Plus size={18} /> Add Medicine
          </button>
        </div>
      </div>

      {/* Add Medicine Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-navy/60 backdrop-blur-md">
           <div className="bg-white w-full max-w-xl rounded-[3rem] p-12 shadow-4xl space-y-8 animate-in fade-in zoom-in duration-300">
              <div className="flex items-center justify-between">
                 <h2 className="font-syne font-black text-2xl text-navy uppercase italic">{editing ? 'Edit Medicine' : 'New Medicine Registry'}</h2>
                 <button onClick={() => { setIsModalOpen(false); resetForm(); }} className="text-navy/20 hover:text-navy transition" aria-label="Close add medicine modal">
                    <X size={24} />
                 </button>
              </div>
              
              <form onSubmit={handleSaveMedicine} className="space-y-6">
                 <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-navy/40 tracking-widest">Generic Name</label>
                       <input 
                         required
                         className="w-full h-14 bg-gray-50 border border-gray-100 rounded-2xl px-6 outline-none focus:border-brand-teal transition-all font-dm font-bold italic"
                         value={formData.name}
                         onChange={e => setFormData({...formData, name: e.target.value})}
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-navy/40 tracking-widest">Brand Name</label>
                       <input 
                         required
                         className="w-full h-14 bg-gray-50 border border-gray-100 rounded-2xl px-6 outline-none focus:border-brand-teal transition-all font-dm font-bold italic"
                         value={formData.brand}
                         onChange={e => setFormData({...formData, brand: e.target.value})}
                       />
                    </div>
                 </div>
                 <div className="grid grid-cols-3 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-navy/40 tracking-widest">Category</label>
                       <select 
                         className="w-full h-14 bg-gray-50 border border-gray-100 rounded-2xl px-4 outline-none focus:border-brand-teal transition-all font-syne font-black text-[10px] uppercase tracking-widest"
                         value={formData.category}
                         onChange={e => setFormData({...formData, category: e.target.value})}
                       >
                          <option>Fever & Pain</option>
                          <option>Antibiotics</option>
                          <option>Allergy</option>
                          <option>Digestive Care</option>
                          <option>Vaccines</option>
                          <option>Skin Care</option>
                          <option>Wellness</option>
                          <option>Diabetes</option>
                       </select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-navy/40 tracking-widest">Unit Price</label>
                       <input 
                         required
                         type="number"
                         className="w-full h-14 bg-gray-50 border border-gray-100 rounded-2xl px-6 outline-none focus:border-brand-teal transition-all font-dm font-bold italic"
                         value={formData.price}
                         onChange={e => setFormData({...formData, price: e.target.value})}
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-navy/40 tracking-widest">Initial Stock</label>
                       <input 
                         required
                         type="number"
                         className="w-full h-14 bg-gray-50 border border-gray-100 rounded-2xl px-6 outline-none focus:border-brand-teal transition-all font-dm font-bold italic"
                         value={formData.stock}
                         onChange={e => setFormData({...formData, stock: e.target.value})}
                       />
                    </div>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 items-end">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-navy/40 tracking-widest">Description</label>
                       <input
                         className="w-full h-14 bg-gray-50 border border-gray-100 rounded-2xl px-6 outline-none focus:border-brand-teal transition-all font-dm font-bold italic"
                         value={formData.description}
                         onChange={e => setFormData({...formData, description: e.target.value})}
                       />
                    </div>
                    <label className="h-14 px-5 bg-gray-50 border border-gray-100 rounded-2xl flex items-center gap-3 font-syne font-black text-[10px] uppercase tracking-widest text-navy">
                      <input
                        type="checkbox"
                        checked={formData.requiresPrescription}
                        onChange={e => setFormData({...formData, requiresPrescription: e.target.checked})}
                        className="h-4 w-4 accent-brand-teal"
                      />
                      Rx Required
                    </label>
                 </div>
                 <button className="w-full h-16 bg-navy text-brand-teal rounded-2xl font-syne font-black text-xs uppercase tracking-widest hover:bg-brand-teal hover:text-navy transition-all shadow-xl shadow-navy/20">
                    {editing ? 'Save Changes' : 'Finalize Registration'}
                 </button>
              </form>
           </div>
        </div>
      )}

      <DataTable 
        title="Global Catalog"
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
        onEdit={openEdit}
        onDelete={handleDeleteMedicine}
      />
    </div>
  );
}
