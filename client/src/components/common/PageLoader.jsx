import { Pill } from 'lucide-react';

export default function PageLoader({ label = 'Loading...' }) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-brand-teal to-brand-mint text-white flex items-center justify-center logo-pulse">
        <Pill size={24} />
      </div>
      <div className="text-sm text-brand-muted">{label}</div>
    </div>
  );
}
