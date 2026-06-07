import { useState, useEffect } from 'react';
import DataTable from '../../components/dashboard/DataTable';
import { pharmacistService } from '../../services/apiServices';
import { Pill, AlertTriangle, Plus, Upload, Clock, Save, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useLanguage } from '../../context/LanguageContext';
import { Link } from 'react-router-dom';

export default function PharmacistInventory() {
  const { t } = useLanguage();
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [importing, setImporting] = useState(false);
  const [stats, setStats] = useState({
    lowStock: 0,
    nearExpiry: 0,
    totalItems: 0
  });

  const fetchInventory = async (pageNum = 1, searchQuery = '') => {
    try {
      setLoading(true);
      const data = await pharmacistService.getInventory({ page: pageNum, limit: 10, q: searchQuery });
      setMedicines(data.items || []);
      setPage(data.page || 1);
      setTotalPages(data.pages || 1);
      setTotalRecords(data.total || 0);
      
      // Calculate stats locally
      const now = new Date();
      const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
      setStats({
        lowStock: (data.items || []).filter(m => m.stock < 10 && m.stock > 0).length,
        nearExpiry: (data.items || []).filter(m => {
          if (!m.expiryDate) return false;
          const expiryDate = new Date(m.expiryDate);
          return expiryDate > now && expiryDate <= thirtyDaysFromNow;
        }).length,
        totalItems: data.total || 0
      });
    } catch (e) {
      toast.error('Failed to load inventory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => fetchInventory(1, search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  const handlePageChange = (newPage) => {
    fetchInventory(newPage, search);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this medicine from active inventory?')) return;
    try {
      await pharmacistService.deleteMedicine(id);
      toast.success('Medicine removed from inventory');
      fetchInventory(page, search);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to remove medicine');
    }
  };

  const handleEdit = (medicine) => {
    setEditing({
      _id: medicine._id,
      name: medicine.name || '',
      brand: medicine.brand || '',
      category: medicine.category || '',
      price: medicine.price || 0,
      mrp: medicine.mrp || medicine.price || 0,
      stock: medicine.stock || 0,
      unit: medicine.unit || '',
      image: medicine.image || medicine.images?.[0]?.url || '',
      description: medicine.description || '',
      dosage: medicine.dosage || '',
      sideEffects: Array.isArray(medicine.sideEffects) ? medicine.sideEffects.join(', ') : medicine.sideEffects || '',
      expiryDate: medicine.expiryDate ? new Date(medicine.expiryDate).toISOString().slice(0, 10) : '',
      batchNumber: medicine.batchNumber || '',
      requiresPrescription: Boolean(medicine.requiresPrescription)
    });
  };

  const setEditField = (key, value) => setEditing((prev) => ({ ...prev, [key]: value }));

  const handleSaveEdit = async () => {
    if (!editing?._id) return;
    if (!editing.name.trim()) {
      toast.error('Medicine name is required');
      return;
    }
    try {
      setSaving(true);
      const sideEffectsArray = (editing.sideEffects || '')
        .split(',')
        .map(effect => effect.trim())
        .filter(effect => effect.length > 0);
      
      await pharmacistService.updateMedicine(editing._id, {
        name: editing.name.trim(),
        brand: editing.brand.trim(),
        category: editing.category.trim(),
        price: Number(editing.price) || 0,
        mrp: Number(editing.mrp) || Number(editing.price) || 0,
        stock: Number(editing.stock) || 0,
        unit: editing.unit.trim(),
        image: editing.image.trim(),
        description: editing.description.trim(),
        dosage: editing.dosage?.trim() || undefined,
        sideEffects: sideEffectsArray,
        batchNumber: editing.batchNumber?.trim() || undefined,
        expiryDate: editing.expiryDate || undefined,
        requiresPrescription: editing.requiresPrescription
      });
      toast.success('Medicine updated');
      setEditing(null);
      fetchInventory(page, search);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update medicine');
    } finally {
      setSaving(false);
    }
  };

  const handleCSVImport = async (file) => {
    if (!file) return;
    try {
      setImporting(true);
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim());
      if (lines.length < 2) {
        toast.error('CSV file must have headers and at least one row');
        return;
      }

      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      const requiredFields = ['name', 'category', 'price'];
      const hasRequiredFields = requiredFields.every(field => headers.includes(field));
      
      if (!hasRequiredFields) {
        toast.error(`CSV must have columns: ${requiredFields.join(', ')}`);
        return;
      }

      let imported = 0;
      let failed = 0;

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        if (values.length < headers.length) continue;

        const row = {};
        headers.forEach((header, index) => {
          row[header] = values[index] || '';
        });

        try {
          const sideEffects = row.sideeffects?.split('|').map(e => e.trim()).filter(e => e) || [];
          
          await pharmacistService.createMedicine({
            name: row.name,
            brand: row.brand || '',
            category: row.category,
            unit: row.unit || '',
            price: Number(row.price) || 0,
            mrp: Number(row.mrp) || Number(row.price) || 0,
            stock: Number(row.stock) || 0,
            batchNumber: row.batchnumber || '',
            expiryDate: row.expirydate || '',
            description: row.description || '',
            dosage: row.dosage || '',
            sideEffects: sideEffects,
            requiresPrescription: row.requiresprescription?.toLowerCase() === 'true'
          });
          imported++;
        } catch (err) {
          console.error(`Row ${i} failed:`, err);
          failed++;
        }
      }

      toast.success(`Imported ${imported} medicines. Failed: ${failed}`);
      fetchInventory(1, '');
      setImporting(false);
    } catch (err) {
      toast.error('Failed to parse CSV file');
      setImporting(false);
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="font-syne font-black text-4xl text-navy italic tracking-tighter uppercase">Inventory</h1>
          <p className="text-xs font-dm font-bold text-navy/40 uppercase tracking-widest mt-1 italic">Manage Your Stock</p>
        </div>
        <div className="flex items-center gap-4">
           <input 
             id="csv-input" 
             type="file" 
             accept=".csv" 
             onChange={(e) => handleCSVImport(e.target.files?.[0])}
             disabled={importing}
             className="hidden" 
           />
           <button 
             onClick={() => document.getElementById('csv-input').click()}
             disabled={importing}
             className="h-14 px-6 border-2 border-navy/10 text-navy rounded-[2rem] font-syne font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:bg-navy hover:text-white transition-all disabled:opacity-50"
           >
             <Upload size={18} /> {importing ? 'Importing...' : 'Import Catalog'}
           </button>
           <Link to="/pharmacist/inventory/add" className="h-14 px-8 bg-brand-teal text-navy rounded-[2rem] font-syne font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:scale-105 transition-all shadow-xl shadow-brand-teal/20">
             <Plus size={18} /> Add Medicine
           </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { label: 'Low Stock', count: stats.lowStock, icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-50' },
          { label: 'Expiring Soon', count: stats.nearExpiry, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50' },
          { label: 'Total Items', count: stats.totalItems, icon: Pill, color: 'text-brand-teal', bg: 'bg-brand-teal/10' },
        ].map((stat) => (
          <div key={stat.label} className={`${stat.bg} p-8 rounded-[2.5rem] border border-gray-100 flex items-center justify-between`}>
             <div>
                <p className="text-[10px] font-black text-navy/40 uppercase tracking-widest italic mb-1">{stat.label}</p>
                <h4 className={`text-3xl font-syne font-black italic tracking-tighter ${stat.color}`}>{stat.count}</h4>
             </div>
             <div className={`h-14 w-14 rounded-2xl flex items-center justify-center bg-white shadow-sm ${stat.color}`}>
                <stat.icon size={24} />
             </div>
          </div>
        ))}
      </div>

      <DataTable 
        title="Inventory List"
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
          { key: 'stock', label: 'Stock' },
          { key: 'price', label: 'Price', render: (val) => `₹${val}` },
          { 
            key: 'expiryDate', 
            label: 'Expiry Date',
            render: (val) => (
              <span className={`text-[10px] font-bold uppercase tracking-widest italic ${
                new Date(val) < new Date() ? 'text-red-500' : 'text-navy/40'
              }`}>{val ? new Date(val).toLocaleDateString() : 'N/A'}</span>
            )
          },
          { 
            key: 'status', 
            label: 'Status',
            render: (val, row) => {
              const status = row.stock === 0 ? 'Out of Stock' : row.stock < 10 ? 'Low Stock' : 'In Stock';
              return (
                <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest w-fit border ${
                  status === 'In Stock' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                  status === 'Low Stock' ? 'bg-amber-50 text-amber-600 border-amber-100' : 
                  'bg-red-50 text-red-600 border-red-100'
                }`}>
                  {status}
                </div>
              );
            }
          }
        ]}
        data={medicines}
        actions={true}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {editing && (
        <div className="fixed inset-0 z-[4200] flex items-end justify-center bg-navy/70 p-0 backdrop-blur-sm md:items-center md:p-6">
          <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-t-3xl bg-white p-5 shadow-2xl md:rounded-3xl md:p-7">
            <div className="flex items-start justify-between gap-4 border-b border-gray-100 pb-5">
              <div>
                <div className="text-[10px] font-black uppercase tracking-widest text-brand-teal">Inventory CRUD</div>
                <h2 className="font-syne text-2xl font-black uppercase text-navy">Edit Medicine</h2>
              </div>
              <button onClick={() => setEditing(null)} className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-50 text-navy/40 hover:bg-red-50 hover:text-red-600" aria-label="Close edit medicine">
                <X size={20} />
              </button>
            </div>

            <div className="grid gap-4 py-6 md:grid-cols-2">
              {[
                ['name', 'Medicine Name', 'text'],
                ['brand', 'Brand', 'text'],
                ['category', 'Category', 'text'],
                ['unit', 'Unit', 'text'],
                ['price', 'Selling Price', 'number'],
                ['mrp', 'MRP', 'number'],
                ['stock', 'Stock', 'number'],
                ['expiryDate', 'Expiry Date', 'date'],
                ['batchNumber', 'Batch Number', 'text'],
                ['dosage', 'Dosage Instructions', 'text'],
                ['image', 'Product Image URL', 'url']
              ].map(([key, label, type]) => (
                <label key={key} className="space-y-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-navy/40">{label}</span>
                  <input
                    type={type}
                    value={editing[key]}
                    onChange={(event) => setEditField(key, event.target.value)}
                    className="h-12 w-full rounded-2xl border border-gray-100 bg-gray-50 px-4 font-semibold text-navy outline-none focus:border-brand-teal"
                  />
                </label>
              ))}
              <label className="space-y-2 md:col-span-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-navy/40">Description</span>
                <textarea
                  value={editing.description}
                  onChange={(event) => setEditField('description', event.target.value)}
                  className="min-h-32 w-full rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 font-semibold text-navy outline-none focus:border-brand-teal resize-none"
                  placeholder="Enter medicine description (uses, benefits, storage, etc.)"
                />
              </label>
              <label className="space-y-2 md:col-span-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-navy/40">Side Effects (comma-separated)</span>
                <textarea
                  value={editing.sideEffects}
                  onChange={(event) => setEditField('sideEffects', event.target.value)}
                  className="min-h-24 w-full rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 font-semibold text-navy outline-none focus:border-brand-teal resize-none"
                  placeholder="e.g., Nausea, Dizziness, Headache"
                />
              </label>
              <label className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-gray-50 p-4 md:col-span-2">
                <input
                  type="checkbox"
                  checked={editing.requiresPrescription}
                  onChange={(event) => setEditField('requiresPrescription', event.target.checked)}
                  className="h-5 w-5 accent-brand-teal"
                />
                <span className="text-xs font-black uppercase tracking-widest text-navy">Requires prescription</span>
              </label>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">
              <button onClick={() => setEditing(null)} className="h-12 rounded-2xl border border-gray-100 px-6 text-xs font-black uppercase tracking-widest text-navy/50 hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={handleSaveEdit} disabled={saving} className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-navy px-7 text-xs font-black uppercase tracking-widest text-brand-teal disabled:opacity-50">
                <Save size={16} /> {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
