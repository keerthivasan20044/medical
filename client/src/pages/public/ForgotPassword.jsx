import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Mail, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { requestPasswordReset } from '../../store/authSlice.js';
import StatusBanner from '../../components/common/StatusBanner.jsx';
import FormField from '../../components/common/FormField.jsx';
import { toastSuccess } from '../../utils/toast.js';

export default function ForgotPassword() {
  const dispatch = useDispatch();
  const [contact, setContact] = useState('');
  const [sent, setSent] = useState(false);
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    if (!contact.trim()) {
      setLocalError('Enter your email or phone number.');
      return;
    }
    const payload = contact.includes('@') ? { email: contact.trim() } : { phone: contact.trim() };
    const res = await dispatch(requestPasswordReset(payload));
    if (res.meta.requestStatus === 'fulfilled') {
      setSent(true);
      toastSuccess('Reset code sent.');
    } else {
      setSent(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-brand-off flex items-center">
      <div className="mx-auto max-w-md w-full px-6 py-10">
        <div className="bg-white border border-brand-border rounded-3xl p-6 shadow-soft">
          <h1 className="font-heading text-2xl text-brand-navy">Forgot Password</h1>
          <p className="text-sm text-brand-muted mt-2">
            Enter your email or phone number and we will send a reset code.
          </p>

          {sent && (
            <div className="mt-4">
              <StatusBanner tone="success" title="Reset code sent" description="Check your inbox or SMS for the reset token." />
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <FormField label="Email or Phone" required error={localError}>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted" />
                <input
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  className="w-full border border-brand-border rounded-xl px-9 py-2 text-sm"
                  placeholder="you@email.com or +91 98765 43210"
                />
                <Phone size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted" />
              </div>
            </FormField>

            <button type="submit" className="w-full px-4 py-2 rounded-2xl bg-brand-teal text-white text-sm">
              Send Reset Code
            </button>
            <div className="text-xs text-brand-muted text-center">
              Already have a code? <Link to="/reset-password" className="text-brand-teal">Reset here</Link>.
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

