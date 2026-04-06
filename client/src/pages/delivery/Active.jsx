import { useState } from 'react';
import { useOtpConfirm } from '../../hooks/useOtpConfirm.js';
import { useLiveLocationSender } from '../../hooks/useLiveLocationSender.js';

export default function Active() {
  const orderId = 'MED-0042';
  const coords = useLiveLocationSender(orderId, true);
  const { confirm, status, error, verified } = useOtpConfirm();
  const [digits, setDigits] = useState(['', '', '', '']);

  const code = digits.join('');

  const handleChange = (idx, val) => {
    const next = [...digits];
    next[idx] = val.slice(-1);
    setDigits(next);
  };

  const handleConfirm = async () => {
    if (code.length < 4) return;
    await confirm(orderId, code);
  };

  const lat = coords?.lat || 10.9254;
  const lng = coords?.lng || 79.8380;
  const mapSrc = `https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`;

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="bg-white border border-brand-border rounded-2xl p-6 shadow-soft">
        <h1 className="font-heading text-xl">Active Delivery</h1>
        <p className="text-sm text-brand-muted">#{orderId} · 12 min ETA</p>

        <div className="mt-4">
          <div className="text-xs text-brand-muted">Enter Customer OTP</div>
          <div className="mt-2 flex gap-2">
            {digits.map((d, i) => (
              <input
                key={i}
                value={d}
                onChange={(e) => handleChange(i, e.target.value)}
                className="w-12 h-12 text-center border border-brand-border rounded-xl text-lg"
                maxLength={1}
              />
            ))}
          </div>
          {error && <div className="mt-2 text-xs text-red-600">{error}</div>}
          {verified && <div className="mt-2 text-xs text-green-600">Delivery confirmed.</div>}
          <button onClick={handleConfirm} className="mt-4 px-4 py-2 rounded-xl bg-brand-teal text-white" disabled={status === 'loading'}>
            {status === 'loading' ? 'Verifying...' : 'Confirm OTP'}
          </button>
        </div>
      </div>

      <div className="bg-white border border-brand-border rounded-2xl p-6 shadow-soft">
        <h2 className="font-heading text-lg">Live Map</h2>
        <div className="mt-4 rounded-2xl overflow-hidden border border-brand-border">
          <iframe title="Delivery Map" src={mapSrc} className="w-full h-64" loading="lazy"></iframe>
        </div>
        <div className="mt-3 text-xs text-brand-muted">Sharing live location to customer.</div>
      </div>
    </div>
  );
}
