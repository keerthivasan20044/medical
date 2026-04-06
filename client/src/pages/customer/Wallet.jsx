import { useState } from 'react';

const TXNS = [
  { id: 1, label: 'Order #MED-0042', amount: -80, date: 'Today, 9:20 AM' },
  { id: 2, label: 'Recharge', amount: 500, date: 'Yesterday, 6:10 PM' },
  { id: 3, label: 'Order #MED-0038', amount: -140, date: 'Feb 18, 2026' }
];

export default function Wallet() {
  const [balance, setBalance] = useState(480);

  const recharge = (amount) => setBalance((b) => b + amount);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-brand-teal to-brand-mint text-white rounded-3xl p-6 shadow-soft">
        <div className="text-sm text-white/80">MediReach Wallet</div>
        <div className="mt-3 text-4xl font-heading">&#8377;{balance}</div>
        <div className="mt-4 flex flex-wrap gap-2">
          {[100, 200, 500, 1000].map((amt) => (
            <button
              key={amt}
              className="px-4 py-2 rounded-full bg-white/15 text-white text-sm btn-hover"
              onClick={() => recharge(amt)}
            >
              +&#8377;{amt}
            </button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white border border-brand-border rounded-2xl p-6 shadow-soft">
          <h2 className="font-heading text-lg text-brand-navy">Transaction History</h2>
          <div className="mt-4 space-y-3 text-sm">
            {TXNS.map((t) => (
              <div key={t.id} className="flex items-center justify-between border border-brand-border rounded-xl p-3">
                <div>
                  <div className="font-heading text-sm text-brand-navy">{t.label}</div>
                  <div className="text-xs text-brand-muted">{t.date}</div>
                </div>
                <div className={`text-sm font-heading ${t.amount > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                  {t.amount > 0 ? `+\u20B9${t.amount}` : `-\u20B9${Math.abs(t.amount)}`}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-brand-border rounded-2xl p-6 shadow-soft">
          <h2 className="font-heading text-lg text-brand-navy">Redeem Points</h2>
          <p className="text-sm text-brand-muted mt-2">You have 250 loyalty points</p>
          <div className="mt-4 border border-brand-border rounded-xl p-4">
            <div className="text-xs text-brand-muted">Redeem 200 points</div>
            <div className="font-heading text-2xl text-brand-teal mt-2">&#8377;50</div>
            <button className="mt-4 w-full px-4 py-2 rounded-xl bg-brand-teal text-white btn-hover">Redeem Now</button>
          </div>
        </div>
      </div>
    </div>
  );
}

