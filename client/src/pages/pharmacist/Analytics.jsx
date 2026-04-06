const revenue = [220, 260, 280, 320, 400, 360, 420, 460, 380, 520, 610, 700];
const orders = [40, 48, 55, 60, 58, 70, 65, 72, 68, 80, 88, 92];
const topMeds = [
  { name: 'Dolo 650', value: 86 },
  { name: 'Amoxicillin', value: 72 },
  { name: 'Vitamin D3', value: 64 },
  { name: 'Insulin', value: 52 }
];

export default function Analytics() {
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white border border-brand-border rounded-2xl p-6 shadow-soft">
          <h2 className="font-heading text-lg text-brand-navy">Monthly Revenue</h2>
          <div className="mt-4 flex items-end gap-2 h-40">
            {revenue.map((v, idx) => (
              <div key={idx} className="flex-1 bg-brand-teal/10 rounded-t-xl relative">
                <div className="absolute bottom-0 left-0 right-0 bg-brand-teal rounded-t-xl" style={{ height: `${(v / 700) * 100}%` }} />
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white border border-brand-border rounded-2xl p-6 shadow-soft">
          <h2 className="font-heading text-lg text-brand-navy">Daily Orders Trend</h2>
          <div className="mt-4 flex items-end gap-2 h-40">
            {orders.map((v, idx) => (
              <div key={idx} className="flex-1 bg-brand-mint/20 rounded-t-xl relative">
                <div className="absolute bottom-0 left-0 right-0 bg-brand-mint rounded-t-xl" style={{ height: `${(v / 100) * 100}%` }} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white border border-brand-border rounded-2xl p-6 shadow-soft">
          <h2 className="font-heading text-lg text-brand-navy">Top Medicines Sold</h2>
          <div className="mt-4 space-y-3">
            {topMeds.map((m) => (
              <div key={m.name} className="flex items-center gap-3">
                <div className="w-28 text-xs text-brand-muted">{m.name}</div>
                <div className="flex-1 h-3 bg-brand-off rounded-full overflow-hidden">
                  <div className="h-full bg-brand-teal" style={{ width: `${m.value}%` }} />
                </div>
                <div className="text-xs text-brand-muted">{m.value}%</div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white border border-brand-border rounded-2xl p-6 shadow-soft">
          <h2 className="font-heading text-lg text-brand-navy">Customer Retention</h2>
          <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <div className="border border-brand-border rounded-xl p-4">
              <div className="text-xs text-brand-muted">Repeat Rate</div>
              <div className="font-heading text-xl text-brand-teal">62%</div>
            </div>
            <div className="border border-brand-border rounded-xl p-4">
              <div className="text-xs text-brand-muted">Churn</div>
              <div className="font-heading text-xl text-red-500">8%</div>
            </div>
            <div className="border border-brand-border rounded-xl p-4">
              <div className="text-xs text-brand-muted">Avg Order Value</div>
              <div className="font-heading text-xl text-brand-navy">&#8377;320</div>
            </div>
            <div className="border border-brand-border rounded-xl p-4">
              <div className="text-xs text-brand-muted">Active Customers</div>
              <div className="font-heading text-xl text-brand-navy">1.2k</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-brand-border rounded-2xl p-6 shadow-soft">
        <h2 className="font-heading text-lg text-brand-navy">Coverage Map — Karaikal</h2>
        <div className="mt-4 grid md:grid-cols-3 gap-3 text-sm">
          {['Karaikal Core', 'Nagore', 'Poompuhar', 'Keezhavur', 'New Colony', 'Collectorate Street'].map((area) => (
            <div key={area} className="border border-brand-border rounded-xl p-3 text-brand-muted">
              {area}
              <div className="mt-2 h-2 rounded-full bg-brand-off">
                <div className="h-full rounded-full bg-brand-teal" style={{ width: `${40 + Math.random() * 60}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

