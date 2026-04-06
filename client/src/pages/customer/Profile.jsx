import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Bell,
  Camera,
  CreditCard,
  FileText,
  LogOut,
  MapPin,
  Package,
  Pencil,
  Shield,
  Star,
  User
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'personal', label: 'Personal Info', icon: User },
  { id: 'addresses', label: 'Addresses', icon: MapPin },
  { id: 'orders', label: 'Order History', icon: Package },
  { id: 'prescriptions', label: 'Prescriptions', icon: FileText },
  { id: 'notifications', label: 'Notification Settings', icon: Bell },
  { id: 'privacy', label: 'Privacy & Security', icon: Shield },
  { id: 'payments', label: 'Payment Methods', icon: CreditCard }
];

export default function Profile() {
  const { user, role } = useSelector((s) => s.auth);
  const [active, setActive] = useState('personal');

  const initials = useMemo(() => {
    const name = user?.name || 'MediReach User';
    return name.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase();
  }, [user]);

  return (
    <div className="grid lg:grid-cols-[280px_1fr] gap-6">
      <aside className="bg-white border border-brand-border rounded-3xl p-6 shadow-soft h-fit">
        <div className="flex flex-col items-center text-center">
          <div className="relative group">
            <div className="h-28 w-28 rounded-full bg-gradient-to-br from-brand-teal to-brand-mint text-white flex items-center justify-center text-3xl font-heading">
              {initials}
            </div>
            <button
              aria-label="Change avatar"
              className="absolute inset-0 rounded-full bg-black/40 text-white opacity-0 group-hover:opacity-100 transition flex items-center justify-center"
            >
              <Camera size={20} />
            </button>
          </div>
          <div className="mt-4 font-heading text-lg text-brand-navy">{user?.name || 'Keerthivasan R.'}</div>
          <span className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs bg-brand-mint/20 text-brand-mint">
            {role || 'customer'}
          </span>
          <div className="mt-4 flex items-center gap-2 text-sm text-brand-muted">
            <Star size={16} className="text-amber-400 fill-amber-400" /> Loyalty Points: 250 pts
          </div>
        </div>

        <div className="mt-6 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActive(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition ${
                  active === item.id ? 'bg-brand-teal/10 text-brand-teal' : 'text-brand-muted hover:bg-brand-off'
                }`}
              >
                <Icon size={16} /> {item.label}
              </button>
            );
          })}
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-red-500 hover:bg-red-50">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      <section className="bg-white border border-brand-border rounded-3xl p-6 shadow-soft">
        {active === 'personal' && (
          <div>
            <div className="flex items-center justify-between">
              <h1 className="font-heading text-xl text-brand-navy">Personal Info</h1>
              <button className="text-sm text-brand-teal flex items-center gap-2">
                <Pencil size={14} /> Edit
              </button>
            </div>
            <div className="mt-6 grid md:grid-cols-2 gap-4">
              {[
                { label: 'Name', value: user?.name || 'Keerthivasan R.' },
                { label: 'Email', value: user?.email || 'user@karaikal.in' },
                { label: 'Phone', value: user?.phone || '+91 98765 43210' },
                { label: 'DOB', value: '12 Aug 1998' },
                { label: 'Gender', value: 'Male' },
                { label: 'Blood Group', value: 'O+' },
                { label: 'Allergies', value: 'None' }
              ].map((field) => (
                <div key={field.label} className="border border-brand-border rounded-2xl p-4 relative">
                  <button aria-label={`Edit ${field.label}`} className="absolute top-3 right-3 text-brand-muted">
                    <Pencil size={12} />
                  </button>
                  <div className="text-xs text-brand-muted">{field.label}</div>
                  <div className="font-heading text-sm mt-1">{field.value}</div>
                </div>
              ))}
            </div>
            <button className="mt-6 px-5 py-2 rounded-xl bg-gradient-to-r from-brand-mint to-brand-teal text-brand-navy text-sm font-semibold">
              Save Changes
            </button>
          </div>
        )}

        {active === 'addresses' && (
          <div>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <h1 className="font-heading text-xl text-brand-navy">Addresses</h1>
              <div className="flex items-center gap-2">
                <button className="px-4 py-2 rounded-xl border border-brand-teal text-brand-teal text-sm">
                  Add New Address
                </button>
                <button className="px-4 py-2 rounded-xl bg-brand-teal text-white text-sm">
                  Detect with GPS
                </button>
              </div>
            </div>
            <div className="mt-6 grid md:grid-cols-2 gap-4">
              {[
                { label: 'Home', value: '42 Gandhi Nagar, Karaikal 609602' },
                { label: 'Office', value: '12 Beach Road, Karaikal 609602' }
              ].map((addr) => (
                <div key={addr.label} className="border border-brand-border rounded-2xl p-4">
                  <div className="text-xs text-brand-muted">{addr.label}</div>
                  <div className="font-heading text-sm mt-1">{addr.value}</div>
                  <div className="mt-3 flex items-center gap-3 text-xs">
                    <button className="text-brand-teal">Edit</button>
                    <button className="text-red-500">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {active === 'prescriptions' && (
          <div>
            <h1 className="font-heading text-xl text-brand-navy">Health Records</h1>
            <div className="mt-4 grid md:grid-cols-2 gap-4">
              <div className="border border-brand-border rounded-2xl p-4">
                <div className="text-xs text-brand-muted">Blood Group</div>
                <div className="font-heading text-sm mt-1">O+</div>
              </div>
              <div className="border border-brand-border rounded-2xl p-4">
                <div className="text-xs text-brand-muted">Allergies</div>
                <div className="font-heading text-sm mt-1">None</div>
              </div>
              <div className="border border-brand-border rounded-2xl p-4 md:col-span-2">
                <div className="text-xs text-brand-muted">Chronic Conditions</div>
                <div className="font-heading text-sm mt-1">No chronic conditions</div>
              </div>
            </div>
            <div className="mt-6 border border-dashed border-brand-teal rounded-2xl p-4 text-sm text-brand-muted">
              Upload lab reports (Cloudinary)
            </div>
          </div>
        )}

        {active === 'orders' && (
          <div>
            <h1 className="font-heading text-xl text-brand-navy">Order History</h1>
            <p className="text-sm text-brand-muted mt-2">Your recent orders will appear here.</p>
          </div>
        )}

        {active === 'notifications' && (
          <div>
            <h1 className="font-heading text-xl text-brand-navy">Notification Settings</h1>
            <p className="text-sm text-brand-muted mt-2">Manage alerts for order updates and promotions.</p>
          </div>
        )}

        {active === 'privacy' && (
          <div>
            <h1 className="font-heading text-xl text-brand-navy">Privacy & Security</h1>
            <p className="text-sm text-brand-muted mt-2">Control your password, device access, and privacy settings.</p>
          </div>
        )}

        {active === 'payments' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h1 className="font-heading text-2xl text-brand-navy">Payment Methods</h1>
            <p className="text-sm text-brand-muted mt-1">Manage your district-authorized credit cards, UPI IDs, and medical wallets.</p>
            
            <div className="mt-8 space-y-6">
              {/* SAVED CARDS SECTION */}
              <div>
                <h2 className="text-sm font-semibold text-brand-navy mb-4 flex items-center gap-2">
                  <CreditCard size={16} className="text-brand-teal" /> Saved Credit & Debit Cards
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="relative group overflow-hidden bg-gradient-to-br from-[#028090] to-[#00BF72] p-5 rounded-3xl text-white shadow-lg cursor-pointer">
                    <div className="absolute top-0 right-0 p-4 opacity-20 transform scale-150 group-hover:scale-[1.7] transition-transform duration-700">
                      <CreditCard size={100} />
                    </div>
                    <div className="relative z-10">
                      <div className="flex justify-between items-start">
                        <div className="bg-white/20 px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest">Primary</div>
                        <div className="font-bold skew-x-[-10deg]">VISA</div>
                      </div>
                      <div className="mt-8 text-xl tracking-[0.2em] font-mono">•••• •••• •••• 4242</div>
                      <div className="mt-6 flex justify-between items-end text-xs">
                        <div>
                          <div className="opacity-60 text-[10px] uppercase">Card Holder</div>
                          <div className="font-medium tracking-wide uppercase">{user?.name}</div>
                        </div>
                        <div>
                          <div className="opacity-60 text-[10px] uppercase">Expires</div>
                          <div className="font-medium">12/28</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <button className="border-2 border-dashed border-brand-border rounded-3xl p-6 flex flex-col items-center justify-center gap-2 text-brand-muted hover:border-brand-teal hover:text-brand-teal transition-all duration-300">
                    <div className="h-10 w-10 rounded-full bg-brand-off flex items-center justify-center">
                      <Pencil size={20} className="rotate-45" />
                    </div>
                    <div className="text-sm font-medium">Add New Card</div>
                  </button>
                </div>
              </div>

              {/* UPI SECTION */}
              <div className="pt-6 border-t border-brand-border">
                <h2 className="text-sm font-semibold text-brand-navy mb-4 flex items-center gap-2">
                  <Star size={16} className="text-[#028090]" /> UPI Identifiers
                </h2>
                <div className="space-y-3">
                  {[
                    { id: 'upi-1', label: 'Primary UPI', value: 'keerthivk@oksbi', status: 'Verified' },
                    { id: 'upi-2', label: 'Secondary UPI', value: '8876XXXX20@ybl', status: 'Secondary' }
                  ].map((upi) => (
                    <div key={upi.id} className="flex items-center justify-between p-4 border border-brand-border rounded-2xl hover:bg-brand-off transition-colors cursor-pointer group">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center font-bold text-blue-600 text-xs italic">UPI</div>
                        <div>
                          <div className="text-xs text-brand-muted">{upi.label}</div>
                          <div className="text-sm font-heading text-brand-navy">{upi.value}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${upi.status === 'Verified' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                          {upi.status}
                        </span>
                        <div className="text-brand-muted opacity-0 group-hover:opacity-100 transition-opacity">
                          <Pencil size={14} />
                        </div>
                      </div>
                    </div>
                  ))}
                  <button className="w-full text-center text-sm font-semibold text-brand-teal py-2 hover:underline">
                    + Link New UPI ID
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
