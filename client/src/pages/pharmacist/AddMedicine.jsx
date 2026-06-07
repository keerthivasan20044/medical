import { useState } from 'react';
import { ArrowLeft, Database, Save, ShieldCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { pharmacistService } from '../../services/apiServices';

const initialForm = {
  name: '',
  brand: '',
  category: '',
  unit: '',
  description: '',
  dosage: '',
  sideEffects: '',
  image: '',
  price: '',
  mrp: '',
  stock: '',
  batchNumber: '',
  expiryDate: '',
  requiresPrescription: false
};

export default function AddMedicine() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);

  const updateField = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.name.trim() || !form.category.trim()) {
      toast.error('Medicine name and category are required');
      return;
    }

    try {
      setSaving(true);
      const sideEffectsArray = form.sideEffects
        .split(',')
        .map(effect => effect.trim())
        .filter(effect => effect.length > 0);
      
      await pharmacistService.createMedicine({
        ...form,
        sideEffects: sideEffectsArray,
        price: Number(form.price) || 0,
        mrp: Number(form.mrp) || Number(form.price) || 0,
        stock: Number(form.stock) || 0
      });
      toast.success('Medicine added to inventory');
      navigate('/pharmacist/inventory');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add medicine');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <Link to="/pharmacist/inventory" className="mb-5 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-navy/40 hover:text-brand-teal">
            <ArrowLeft size={14} /> Back to inventory
          </Link>
          <h1 className="font-syne text-4xl font-black uppercase italic tracking-tighter text-navy">Add Medicine</h1>
          <p className="mt-1 text-xs font-bold uppercase italic tracking-widest text-navy/40">Register a new stock item for your pharmacy</p>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="flex h-14 items-center justify-center gap-3 rounded-[2rem] bg-brand-teal px-8 font-syne text-xs font-black uppercase tracking-widest text-navy shadow-xl shadow-brand-teal/20 transition-all hover:scale-105 disabled:opacity-60"
        >
          <Save size={18} /> {saving ? 'Saving...' : 'Save Medicine'}
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm md:p-8">
          <div className="grid gap-6 md:grid-cols-2">
            <Field label="Medicine Name" value={form.name} onChange={(value) => updateField('name', value)} placeholder="Dolo 650mg" required />
            <Field label="Manufacturer / Brand" value={form.brand} onChange={(value) => updateField('brand', value)} placeholder="Micro Labs" />
            <Field label="Category" value={form.category} onChange={(value) => updateField('category', value)} placeholder="Fever & Pain" required />
            <Field label="Unit / Strength" value={form.unit} onChange={(value) => updateField('unit', value)} placeholder="10 tablets" />
            <Field label="Dosage Instructions" value={form.dosage} onChange={(value) => updateField('dosage', value)} placeholder="Take 1-2 tablets every 4-6 hours" />
            <Field label="Price" type="number" value={form.price} onChange={(value) => updateField('price', value)} placeholder="25" />
            <Field label="MRP" type="number" value={form.mrp} onChange={(value) => updateField('mrp', value)} placeholder="30" />
            <Field label="Stock Quantity" type="number" value={form.stock} onChange={(value) => updateField('stock', value)} placeholder="100" />
            <Field label="Batch ID" value={form.batchNumber} onChange={(value) => updateField('batchNumber', value)} placeholder="BATCH-2026-01" />
            <Field label="Expiry Date" type="date" value={form.expiryDate} onChange={(value) => updateField('expiryDate', value)} />
            <Field label="Product Image URL" value={form.image} onChange={(value) => updateField('image', value)} placeholder="https://..." />
          </div>

          <div className="mt-6 space-y-3">
            <label className="text-[10px] font-black uppercase italic tracking-widest text-navy/30">Description & Usage</label>
            <textarea
              rows="4"
              value={form.description}
              onChange={(event) => updateField('description', event.target.value)}
              className="w-full rounded-2xl border border-gray-100 bg-gray-50/50 p-5 font-dm text-sm font-bold text-navy outline-none transition-all focus:border-brand-teal focus:bg-white"
              placeholder="Clinical notes, benefits, storage instructions (e.g., Store in cool dry place)..."
            />
          </div>

          <div className="mt-6 space-y-3">
            <label className="text-[10px] font-black uppercase italic tracking-widest text-navy/30">Side Effects (comma-separated)</label>
            <textarea
              rows="3"
              value={form.sideEffects}
              onChange={(event) => updateField('sideEffects', event.target.value)}
              className="w-full rounded-2xl border border-gray-100 bg-gray-50/50 p-5 font-dm text-sm font-bold text-navy outline-none transition-all focus:border-brand-teal focus:bg-white"
              placeholder="e.g., Nausea, Dizziness, Headache, Drowsiness"
            />
          </div>

          <label className="mt-6 flex w-fit items-center gap-3 rounded-2xl border border-gray-100 bg-gray-50 px-5 py-4 text-xs font-black uppercase tracking-widest text-navy/60">
            <input
              type="checkbox"
              checked={form.requiresPrescription}
              onChange={(event) => updateField('requiresPrescription', event.target.checked)}
              className="h-4 w-4 accent-brand-teal"
            />
            Requires prescription
          </label>
        </section>

        <aside className="space-y-6">
          <div className="rounded-3xl bg-navy p-8 text-white shadow-sm">
            <h4 className="flex items-center gap-3 font-syne text-xl font-black uppercase italic tracking-tighter text-brand-teal">
              <Database size={22} /> Inventory Status
            </h4>
            <div className="mt-8 space-y-4">
              <InfoTile label="Mode" value="Direct Save" />
              <InfoTile label="Visibility" value="Active Stock" />
              <InfoTile label="Owner" value="Linked Pharmacy" />
            </div>
          </div>

          <div className="rounded-3xl border border-gray-100 bg-white p-7 shadow-sm">
            <div className="flex items-center gap-3 font-syne text-sm font-black uppercase italic text-brand-teal">
              <ShieldCheck size={22} /> Stock Rule
            </div>
            <p className="mt-4 text-sm font-bold italic leading-relaxed text-navy/50">
              Saved medicines are linked to your pharmacy account and become visible in your inventory and pharmacy medicine list.
            </p>
          </div>
        </aside>
      </div>
    </form>
  );
}

function Field({ label, value, onChange, placeholder = '', type = 'text', required = false }) {
  return (
    <div className="space-y-3">
      <label className="text-[10px] font-black uppercase italic tracking-widest text-navy/30">{label}</label>
      <input
        type={type}
        required={required}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="h-14 w-full rounded-2xl border border-gray-100 bg-gray-50/50 px-5 font-dm text-sm font-bold text-navy outline-none transition-all focus:border-brand-teal focus:bg-white"
      />
    </div>
  );
}

function InfoTile({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/5 bg-white/5 p-5">
      <div className="text-[9px] font-black uppercase italic tracking-widest text-brand-teal">{label}</div>
      <div className="mt-2 font-syne text-lg font-black uppercase italic text-white">{value}</div>
    </div>
  );
}
