import { CalendarClock, Download, FileText } from 'lucide-react';

const REPORTS = [
  { name: 'Orders Report - Mar 2026', type: 'Orders', updated: 'Today', size: '1.2 MB' },
  { name: 'Revenue Report - Q4 2025', type: 'Revenue', updated: 'Yesterday', size: '900 KB' },
  { name: 'Expiry Report - Feb 2026', type: 'Compliance', updated: 'Mar 02', size: '720 KB' }
];

export default function Reports() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl text-brand-navy">Reports</h1>
          <p className="text-sm text-brand-muted">Generate and download operational reports.</p>
        </div>
        <button className="px-4 py-2 rounded-xl bg-brand-teal text-white text-sm btn-hover flex items-center gap-2">
          <CalendarClock size={14} /> Schedule Report
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {REPORTS.map((r) => (
          <div key={r.name} className="bg-white border border-brand-border rounded-2xl p-5 shadow-soft card-hover">
            <div className="flex items-start justify-between">
              <div>
                <div className="font-heading text-sm text-brand-navy">{r.name}</div>
                <div className="text-xs text-brand-muted">{r.type} · Updated {r.updated}</div>
              </div>
              <span className="h-10 w-10 rounded-xl bg-brand-teal/10 text-brand-teal flex items-center justify-center">
                <FileText size={16} />
              </span>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs text-brand-muted">Size: {r.size}</span>
              <button className="px-3 py-1 rounded-full bg-brand-teal text-white text-xs btn-hover flex items-center gap-1">
                <Download size={12} /> Download
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-brand-border rounded-2xl p-6 shadow-soft">
        <h2 className="font-heading text-lg text-brand-navy">Automated Reports</h2>
        <div className="mt-4 space-y-3 text-sm">
          {[
            { name: 'Weekly Performance Summary', schedule: 'Every Monday, 9 AM' },
            { name: 'Monthly Revenue Snapshot', schedule: '1st of every month' }
          ].map((item) => (
            <div key={item.name} className="border border-brand-border rounded-xl p-4 flex items-center justify-between">
              <div>
                <div className="font-heading text-sm text-brand-navy">{item.name}</div>
                <div className="text-xs text-brand-muted">{item.schedule}</div>
              </div>
              <button className="px-3 py-1 rounded-full border border-brand-border text-xs">Manage</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
