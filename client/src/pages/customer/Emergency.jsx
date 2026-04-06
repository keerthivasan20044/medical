export default function Emergency() {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-red-50 to-brand-off border border-red-200 rounded-3xl p-6 shadow-soft">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl text-red-600">Emergency Request</h1>
            <p className="text-sm text-brand-muted">Get urgent medicines delivered from the nearest open pharmacy.</p>
          </div>
          <button className="px-5 py-3 rounded-2xl bg-red-600 text-white font-ui">Request Emergency Delivery</button>
        </div>
        <div className="mt-4 grid md:grid-cols-3 gap-3 text-sm">
          {['Nearest open pharmacies', 'Priority dispatch', 'Live ETA updates'].map((t) => (
            <div key={t} className="bg-white border border-red-100 rounded-2xl p-4">
              <div className="font-heading text-red-600">{t}</div>
              <div className="text-xs text-brand-muted">Response in under 10 minutes</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="bg-white border border-brand-border rounded-2xl p-6 shadow-soft">
          <h2 className="font-heading text-lg">Emergency Details</h2>
          <div className="mt-4 grid md:grid-cols-2 gap-4">
            <input className="border border-brand-border rounded-xl px-3 py-2" placeholder="Patient Name" />
            <input className="border border-brand-border rounded-xl px-3 py-2" placeholder="Phone Number" />
            <input className="border border-brand-border rounded-xl px-3 py-2 md:col-span-2" placeholder="Medicines Required" />
            <textarea className="border border-brand-border rounded-xl px-3 py-2 md:col-span-2" rows="3" placeholder="Symptoms / Notes"></textarea>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <button className="px-4 py-2 rounded-xl border border-brand-border">Attach Prescription</button>
            <button className="px-5 py-2 rounded-xl bg-brand-teal text-white">Submit Request</button>
          </div>
        </div>

        <div className="bg-white border border-brand-border rounded-2xl p-6 shadow-soft">
          <h2 className="font-heading text-lg">Nearby Open Pharmacies</h2>
          <div className="mt-4 space-y-3 text-sm">
            {[
              { name: 'Sri Murugan Medical Store', distance: '0.8 km', eta: '6 min' },
              { name: 'Apollo Pharmacy', distance: '1.4 km', eta: '9 min' },
              { name: 'Medplus Pharmacy', distance: '1.9 km', eta: '12 min' }
            ].map((p) => (
              <div key={p.name} className="border border-brand-border rounded-xl p-3 flex items-center justify-between">
                <div>
                  <div className="font-heading text-sm">{p.name}</div>
                  <div className="text-xs text-brand-muted">{p.distance} · ETA {p.eta}</div>
                </div>
                <button className="text-xs text-brand-teal">Select</button>
              </div>
            ))}
          </div>
          <div className="mt-4 h-40 rounded-xl bg-gradient-to-br from-brand-navy to-brand-slate text-white flex items-center justify-center text-xs">
            Map Preview
          </div>
        </div>
      </div>
    </div>
  );
}
