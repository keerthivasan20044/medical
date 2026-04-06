import { useState } from 'react';
import { FileText, Plus, Send } from 'lucide-react';

const TEMPLATE_MEDICINES = [
  { name: 'Dolo 650', dosage: '1-0-1', duration: '3 days' },
  { name: 'Cough Syrup', dosage: '0-0-1', duration: '5 days' }
];

export default function Prescriptions() {
  const [form, setForm] = useState({ patient: '', diagnosis: '', notes: '' });
  const [meds, setMeds] = useState([
    { name: '', dosage: '', timing: '', duration: '' }
  ]);

  const addRow = () => setMeds((prev) => [...prev, { name: '', dosage: '', timing: '', duration: '' }]);
  const updateRow = (idx, key, value) => {
    setMeds((prev) => prev.map((row, i) => (i === idx ? { ...row, [key]: value } : row)));
  };

  const applyTemplate = () => {
    setMeds(TEMPLATE_MEDICINES.map((m) => ({ name: m.name, dosage: m.dosage, timing: 'After food', duration: m.duration })));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-brand-border rounded-2xl p-6 shadow-soft">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading text-2xl text-brand-navy">Write Prescription</h1>
            <p className="text-sm text-brand-muted">Create and send digital prescriptions.</p>
          </div>
          <button className="px-4 py-2 rounded-xl border border-brand-border text-sm btn-hover flex items-center gap-2" onClick={applyTemplate}>
            <FileText size={14} /> Use Template
          </button>
        </div>

        <div className="mt-6 grid md:grid-cols-2 gap-4">
          <input
            className="border border-brand-border rounded-xl px-3 py-2"
            placeholder="Patient Name"
            value={form.patient}
            onChange={(e) => setForm({ ...form, patient: e.target.value })}
          />
          <input
            className="border border-brand-border rounded-xl px-3 py-2"
            placeholder="Diagnosis"
            value={form.diagnosis}
            onChange={(e) => setForm({ ...form, diagnosis: e.target.value })}
          />
        </div>

        <div className="mt-5">
          <div className="text-sm font-heading text-brand-navy">Medicines</div>
          <div className="mt-3 space-y-3">
            {meds.map((row, idx) => (
              <div key={idx} className="grid md:grid-cols-4 gap-3">
                <input
                  className="border border-brand-border rounded-xl px-3 py-2"
                  placeholder="Medicine"
                  value={row.name}
                  onChange={(e) => updateRow(idx, 'name', e.target.value)}
                />
                <input
                  className="border border-brand-border rounded-xl px-3 py-2"
                  placeholder="Dosage (1-0-1)"
                  value={row.dosage}
                  onChange={(e) => updateRow(idx, 'dosage', e.target.value)}
                />
                <input
                  className="border border-brand-border rounded-xl px-3 py-2"
                  placeholder="Timing"
                  value={row.timing}
                  onChange={(e) => updateRow(idx, 'timing', e.target.value)}
                />
                <input
                  className="border border-brand-border rounded-xl px-3 py-2"
                  placeholder="Duration"
                  value={row.duration}
                  onChange={(e) => updateRow(idx, 'duration', e.target.value)}
                />
              </div>
            ))}
          </div>
          <button className="mt-3 px-4 py-2 rounded-xl border border-brand-border text-sm btn-hover flex items-center gap-2" onClick={addRow}>
            <Plus size={14} /> Add Medicine
          </button>
        </div>

        <div className="mt-5">
          <textarea
            className="border border-brand-border rounded-xl px-3 py-2 w-full"
            rows="4"
            placeholder="Notes / Advice"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          />
        </div>

        <button className="mt-4 w-full px-4 py-3 rounded-xl bg-brand-teal text-white btn-hover flex items-center justify-center gap-2">
          <Send size={16} /> Send Prescription
        </button>
      </div>
    </div>
  );
}
