import { AlertTriangle, CheckCircle2, Info, ShieldAlert } from 'lucide-react';

const TONE_MAP = {
  error: {
    icon: ShieldAlert,
    wrapper: 'bg-red-50 border-red-200 text-red-700'
  },
  success: {
    icon: CheckCircle2,
    wrapper: 'bg-emerald-50 border-emerald-200 text-emerald-700'
  },
  warning: {
    icon: AlertTriangle,
    wrapper: 'bg-amber-50 border-amber-200 text-amber-700'
  },
  info: {
    icon: Info,
    wrapper: 'bg-sky-50 border-sky-200 text-sky-700'
  }
};

export default function StatusBanner({ tone = 'info', title, description, action }) {
  const meta = TONE_MAP[tone] || TONE_MAP.info;
  const Icon = meta.icon;

  return (
    <div className={`border rounded-2xl p-3 flex items-start gap-3 ${meta.wrapper}`}>
      <Icon size={18} />
      <div className="flex-1 text-sm">
        {title && <div className="font-semibold">{title}</div>}
        {description && <div className="text-xs mt-1">{description}</div>}
        {action}
      </div>
    </div>
  );
}
