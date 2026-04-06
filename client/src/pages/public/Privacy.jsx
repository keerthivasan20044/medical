import { Database, Eye, Lock, Mail, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const POLICY = [
  {
    title: 'Information We Collect',
    items: [
      'Account details like name, email, phone number, and saved addresses.',
      'Order data such as prescriptions, medicine requests, and delivery notes.',
      'Device and usage data for security, fraud prevention, and analytics.'
    ]
  },
  {
    title: 'How We Use Data',
    items: [
      'To process orders, verify prescriptions, and coordinate delivery.',
      'To provide support, notify you about order status, and send service updates.',
      'To improve product performance, availability, and safety.'
    ]
  },
  {
    title: 'Sharing & Disclosure',
    items: [
      'Pharmacies and delivery partners only receive data required to fulfill your order.',
      'We do not sell personal data to third parties.',
      'We may share data when required by law or to protect user safety.'
    ]
  },
  {
    title: 'Retention & Security',
    items: [
      'Data is retained only as long as needed for service or legal compliance.',
      'We encrypt sensitive data in transit and apply access controls.',
      'You can request deletion of your account data at any time.'
    ]
  }
];

const RIGHTS = [
  { title: 'Access', text: 'Request a copy of the personal data we hold about you.' },
  { title: 'Correction', text: 'Update inaccurate or incomplete account information.' },
  { title: 'Deletion', text: 'Ask us to remove your data where permitted by law.' },
  { title: 'Opt-out', text: 'Manage marketing preferences in Settings.' }
];

export default function Privacy() {
  return (
    <div className="bg-white">
      <section className="mx-auto max-w-7xl px-6 py-10 md:py-16 grid lg:grid-cols-[1.1fr_0.9fr] gap-8 items-start">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-teal/10 text-brand-teal text-xs font-semibold">
            <ShieldCheck size={14} /> Privacy Policy
          </div>
          <h1 className="font-heading text-3xl md:text-4xl text-brand-navy mt-3">Your data, handled with care.</h1>
          <p className="text-brand-muted mt-3 max-w-2xl">
            This policy explains what MediReach collects, why we need it, and how you can control your information.
          </p>
          <p className="text-xs text-brand-muted mt-3">Effective date: March 24, 2026</p>

          <div className="mt-8 grid md:grid-cols-2 gap-4">
            {POLICY.map((section) => (
              <div key={section.title} className="border border-brand-border rounded-2xl p-5 shadow-soft bg-white">
                <div className="font-heading text-sm text-brand-navy">{section.title}</div>
                <ul className="mt-3 space-y-2 text-sm text-brand-muted list-disc list-inside">
                  {section.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <div className="border border-brand-border rounded-3xl p-6 shadow-soft bg-brand-off">
            <div className="flex items-center gap-2 text-brand-navy font-heading text-sm">
              <Eye size={16} /> Your Privacy Controls
            </div>
            <p className="text-sm text-brand-muted mt-2">
              Update marketing preferences or download your data from the Settings page.
            </p>
            <Link
              to="/settings"
              className="mt-4 inline-flex items-center justify-center px-4 py-2 rounded-xl bg-brand-teal text-white text-sm btn-hover"
            >
              Go to Settings
            </Link>
          </div>

          <div className="border border-brand-border rounded-3xl p-6 shadow-soft">
            <div className="flex items-center gap-2 text-brand-navy font-heading text-sm">
              <Database size={16} /> Your Rights
            </div>
            <div className="mt-4 space-y-3">
              {RIGHTS.map((right) => (
                <div key={right.title} className="border border-brand-border rounded-2xl p-4 bg-white">
                  <div className="text-xs text-brand-muted">{right.title}</div>
                  <div className="text-sm text-brand-navy mt-1">{right.text}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-brand-border rounded-3xl p-6 shadow-soft bg-white">
            <div className="flex items-center gap-2 text-brand-navy font-heading text-sm">
              <Lock size={16} /> Security Contact
            </div>
            <p className="text-sm text-brand-muted mt-2">
              Report a security issue or request data deletion.
            </p>
            <div className="mt-3 inline-flex items-center gap-2 text-sm text-brand-teal">
              <Mail size={16} /> security@medireach.in
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
