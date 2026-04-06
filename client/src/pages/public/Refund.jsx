import { BadgeCheck, Calendar, ClipboardList, RefreshCcw, ShieldCheck } from 'lucide-react';

const HIGHLIGHTS = [
  {
    title: 'Instant Cancellations',
    text: 'Cancel before pharmacy confirmation for a full refund.'
  },
  {
    title: 'Damaged Items',
    text: 'Report damaged or missing items within 24 hours of delivery.'
  },
  {
    title: 'Prescription Items',
    text: 'Prescription medicines are non-returnable unless damaged.'
  }
];

const STEPS = [
  {
    title: 'Submit a Request',
    text: 'Use the Help Center or contact support with your order ID.',
    icon: ClipboardList
  },
  {
    title: 'Verification',
    text: 'Our team verifies order status, packaging, and delivery notes.',
    icon: ShieldCheck
  },
  {
    title: 'Refund Processed',
    text: 'Refunds are processed to the original payment method or wallet.',
    icon: RefreshCcw
  }
];

const TIMELINE = [
  { label: 'UPI', value: '1-3 business days' },
  { label: 'Cards', value: '3-7 business days' },
  { label: 'Net Banking', value: '2-5 business days' },
  { label: 'MediReach Wallet', value: 'Instant' }
];

export default function Refund() {
  return (
    <div className="bg-white">
      <section className="mx-auto max-w-7xl px-6 py-10 md:py-16">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-teal/10 text-brand-teal text-xs font-semibold">
            <BadgeCheck size={14} /> Refund Policy
          </div>
          <h1 className="font-heading text-3xl md:text-4xl text-brand-navy mt-3">Fair refunds, fast resolutions.</h1>
          <p className="text-brand-muted mt-3">
            We aim to resolve issues quickly while keeping medicines safe and compliant.
          </p>
          <p className="text-xs text-brand-muted mt-3">Effective date: March 24, 2026</p>
        </div>

        <div className="mt-8 grid md:grid-cols-3 gap-4">
          {HIGHLIGHTS.map((item) => (
            <div key={item.title} className="border border-brand-border rounded-2xl p-5 shadow-soft bg-white">
              <div className="font-heading text-sm text-brand-navy">{item.title}</div>
              <p className="text-sm text-brand-muted mt-2">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-brand-off">
        <div className="mx-auto max-w-7xl px-6 py-10 md:py-16 grid lg:grid-cols-[1.1fr_0.9fr] gap-8">
          <div className="space-y-4">
            {STEPS.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div key={step.title} className="bg-white border border-brand-border rounded-3xl p-6 shadow-soft">
                  <div className="flex items-center gap-3">
                    <span className="h-10 w-10 rounded-xl bg-brand-teal/10 text-brand-teal flex items-center justify-center">
                      <Icon size={18} />
                    </span>
                    <div>
                      <div className="text-xs text-brand-muted">Step {idx + 1}</div>
                      <div className="font-heading text-sm text-brand-navy">{step.title}</div>
                    </div>
                  </div>
                  <p className="text-sm text-brand-muted mt-3">{step.text}</p>
                </div>
              );
            })}
          </div>

          <div className="bg-white border border-brand-border rounded-3xl p-6 shadow-soft h-fit">
            <div className="flex items-center gap-2 text-brand-navy font-heading text-sm">
              <Calendar size={16} /> Typical Timelines
            </div>
            <div className="mt-4 space-y-3">
              {TIMELINE.map((item) => (
                <div key={item.label} className="flex items-center justify-between text-sm border border-brand-border rounded-2xl px-4 py-3">
                  <span className="text-brand-navy">{item.label}</span>
                  <span className="text-brand-muted">{item.value}</span>
                </div>
              ))}
            </div>
            <div className="mt-5 text-xs text-brand-muted">
              Business days exclude weekends and public holidays.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
