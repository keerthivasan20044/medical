export default function HealthRecords() {
  return (
    <div className="space-y-6">
      <div className="bg-white border border-brand-border rounded-2xl p-6 shadow-soft">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl">Health Records</h1>
            <p className="text-sm text-brand-muted">Store lab reports and share them with doctors.</p>
          </div>
          <button className="px-5 py-2 rounded-xl bg-brand-teal text-white">Upload Report</button>
        </div>
        <div className="mt-4 border border-dashed border-brand-teal rounded-2xl p-6 text-center text-sm text-brand-muted">
          Drag & drop files here or click Upload
        </div>
      </div>

      <div className="bg-white border border-brand-border rounded-2xl p-6 shadow-soft">
        <h2 className="font-heading text-lg">Recent Reports</h2>
        <div className="mt-4 space-y-3 text-sm">
          {[
            { name: 'Blood Test - CBC', date: '02 Mar 2026', size: '1.2 MB' },
            { name: 'Thyroid Profile', date: '21 Feb 2026', size: '900 KB' },
            { name: 'Vitamin D', date: '11 Feb 2026', size: '780 KB' }
          ].map((r) => (
            <div key={r.name} className="border border-brand-border rounded-xl p-3 flex items-center justify-between">
              <div>
                <div className="font-heading text-sm">{r.name}</div>
                <div className="text-xs text-brand-muted">{r.date} · {r.size}</div>
              </div>
              <button className="text-xs text-brand-teal">View</button>
            </div>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white border border-brand-border rounded-2xl p-6 shadow-soft">
          <h2 className="font-heading text-lg">Vitals Summary</h2>
          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div className="border border-brand-border rounded-xl p-3">
              <div className="text-xs text-brand-muted">Blood Group</div>
              <div className="font-heading">B+</div>
            </div>
            <div className="border border-brand-border rounded-xl p-3">
              <div className="text-xs text-brand-muted">Allergies</div>
              <div className="font-heading">None</div>
            </div>
            <div className="border border-brand-border rounded-xl p-3">
              <div className="text-xs text-brand-muted">Chronic</div>
              <div className="font-heading">Diabetes</div>
            </div>
            <div className="border border-brand-border rounded-xl p-3">
              <div className="text-xs text-brand-muted">Last Checkup</div>
              <div className="font-heading">12 Feb</div>
            </div>
          </div>
        </div>
        <div className="bg-white border border-brand-border rounded-2xl p-6 shadow-soft">
          <h2 className="font-heading text-lg">Share With Doctor</h2>
          <p className="text-sm text-brand-muted">Generate a secure link to share with your doctor.</p>
          <button className="mt-4 px-4 py-2 rounded-xl bg-brand-teal text-white">Generate Link</button>
        </div>
      </div>
    </div>
  );
}
