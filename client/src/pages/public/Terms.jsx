import { FileText, Shield, Truck, Wallet } from 'lucide-react';

const SECTIONS = [
  {
    title: 'Using MediReach',
    icon: FileText,
    text: 'You must be 18+ or have guardian consent to create an account and place orders.'
  },
  {
    title: 'Orders & Prescriptions',
    icon: Shield,
    text: 'Prescription medicines require a valid prescription. We verify details before fulfillment.'
  },
  {
    title: 'Delivery & Service',
    icon: Truck,
    text: 'Delivery times are estimates. Delays can occur due to traffic, weather, or pharmacy availability.'
  },
  {
    title: 'Payments & Wallet',
    icon: Wallet,
    text: 'All payments are processed through secure partners. Wallet balances can be used for future orders.'
  }
];

const DETAILS = [
  {
    title: 'Account Responsibilities',
    items: [
      'Keep your login credentials private and secure.',
      'Ensure your delivery address and contact number are accurate.',
      'Notify support if you suspect unauthorized access.'
    ]
  },
  {
    title: 'Cancellations',
    items: [
      'Orders can be canceled before pharmacy confirmation.',
      'Prescriptions already validated or packed cannot be canceled.',
      'Refund timelines are listed in the Refund Policy.'
    ]
  },
  {
    title: 'Limitations',
    items: [
      'MediReach is not responsible for delays caused by external factors.',
      'We are not liable for misuse of medicines purchased on the platform.',
      'Service availability may vary by location and partner pharmacy.'
    ]
  }
];

export default function Terms() {
  return (
    <div className="bg-white">
      <section className="mx-auto max-w-7xl px-6 py-10 md:py-16">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-teal/10 text-brand-teal text-xs font-semibold">
            <FileText size={14} /> Terms of Service
          </div>
          <h1 className="font-heading text-3xl md:text-4xl text-brand-navy mt-3">Clear terms, trusted care.</h1>
          <p className="text-brand-muted mt-3">
            These terms outline how MediReach works, what you can expect from us, and what we expect from you.
          </p>
          <p className="text-xs text-brand-muted mt-3">Effective date: March 24, 2026</p>
        </div>

        <div className="mt-8 grid md:grid-cols-2 gap-4">
          {SECTIONS.map((section) => {
            const Icon = section.icon;
            return (
              <div key={section.title} className="border border-brand-border rounded-2xl p-5 shadow-soft bg-white">
                <div className="flex items-center gap-2 text-brand-navy font-heading text-sm">
                  <Icon size={16} /> {section.title}
                </div>
                <p className="text-sm text-brand-muted mt-3">{section.text}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="bg-brand-off">
        <div className="mx-auto max-w-7xl px-6 py-10 md:py-16 grid md:grid-cols-3 gap-6">
          {DETAILS.map((detail) => (
            <div key={detail.title} className="border border-brand-border rounded-3xl p-6 bg-white shadow-soft">
              <div className="font-heading text-sm text-brand-navy">{detail.title}</div>
              <ul className="mt-4 space-y-2 text-sm text-brand-muted list-disc list-inside">
                {detail.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
