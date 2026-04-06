import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Eye, EyeOff, KeyRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { resetPassword } from '../../store/authSlice.js';
import StatusBanner from '../../components/common/StatusBanner.jsx';
import FormField from '../../components/common/FormField.jsx';
import { toastSuccess } from '../../utils/toast.js';

export default function ResetPassword() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [contact, setContact] = useState('');
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [show, setShow] = useState(false);
  const [localError, setLocalError] = useState('');
  const [done, setDone] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    if (!contact.trim() || !token.trim() || !password) {
      setLocalError('All fields are required.');
      return;
    }
    if (password !== confirm) {
      setLocalError('Passwords do not match.');
      return;
    }

    const payload = contact.includes('@')
      ? { email: contact.trim(), token: token.trim(), password }
      : { phone: contact.trim(), token: token.trim(), password };

    const res = await dispatch(resetPassword(payload));
    if (res.meta.requestStatus === 'fulfilled') {
      setDone(true);
      toastSuccess('Password updated. Please sign in.');
      setTimeout(() => navigate('/login'), 800);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-brand-off flex items-center">
      <div className="mx-auto max-w-md w-full px-6 py-10">
        <div className="bg-white border border-brand-border rounded-3xl p-6 shadow-soft">
          <h1 className="font-heading text-2xl text-brand-navy">Reset Password</h1>
          <p className="text-sm text-brand-muted mt-2">
            Enter your reset code and choose a new password.
          </p>

          {done && (
            <div className="mt-4">
              <StatusBanner tone="success" title="Password updated" description="Redirecting to login..." />
            </div>
          )}

          {localError && (
            <div className="mt-4">
              <StatusBanner tone="error" title="Reset failed" description={localError} />
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <FormField label="Email or Phone" required>
              <input
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                className="w-full border border-brand-border rounded-xl px-3 py-2 text-sm"
                placeholder="you@email.com or +91 98765 43210"
              />
            </FormField>
            <FormField label="Reset Code" required>
              <div className="relative">
                <KeyRound size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted" />
                <input
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  className="w-full border border-brand-border rounded-xl px-9 py-2 text-sm"
                  placeholder="Paste reset token"
                />
              </div>
            </FormField>
            <FormField label="New Password" required>
              <div className="relative">
                <input
                  type={show ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-brand-border rounded-xl px-3 py-2 text-sm"
                  placeholder="New password"
                />
                <button
                  type="button"
                  onClick={() => setShow((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted"
                >
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </FormField>
            <FormField label="Confirm Password" required>
              <input
                type={show ? 'text' : 'password'}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="w-full border border-brand-border rounded-xl px-3 py-2 text-sm"
                placeholder="Confirm password"
              />
            </FormField>

            <button type="submit" className="w-full px-4 py-2 rounded-2xl bg-brand-teal text-white text-sm">
              Reset Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

