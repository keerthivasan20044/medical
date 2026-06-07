import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Eye, EyeOff, KeyRound, ArrowRight, ShieldCheck, Sparkles, Lock } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { resetPassword } from '../../store/authSlice.js';
import { Button, Input } from '../../components/common/Core';
import { useToast } from '../../hooks/core';

export default function ResetPassword() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const [contact, setContact] = useState(location.state?.contact || '');
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!contact.trim() || !token.trim() || !password) {
      toast.error('All fields are required.');
      return;
    }
    if (password !== confirm) {
      toast.error('Passwords do not match.');
      return;
    }

    setLoading(true);
    const payload = contact.includes('@')
      ? { email: contact.trim(), token: token.trim(), password }
      : { phone: contact.trim(), token: token.trim(), password };

    try {
      await dispatch(resetPassword(payload)).unwrap();
      setDone(true);
      toast.success('Password updated. Please sign in.');
      setTimeout(() => navigate('/login'), 800);
    } catch (err) {
      toast.error(err || 'Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-92px)] bg-navy flex items-center justify-center px-4 py-8 md:px-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-5" />
      <div className="absolute top-0 right-0 h-96 w-96 bg-teal-500 rounded-full blur-[150px] opacity-10 animate-pulse" />
      
      <div className="w-full max-w-xl bg-white rounded-2xl md:rounded-[2rem] shadow-2xl overflow-hidden relative z-10 p-5 md:p-8 space-y-7">
        <div className="flex items-start justify-between gap-6 border-b border-gray-50 pb-6">
           <div className="space-y-3 md:space-y-4">
              <div className="px-4 py-1.5 bg-navy rounded-xl w-fit flex items-center gap-2 text-[9px] font-black text-teal-400 uppercase tracking-widest italic">
                 <ShieldCheck size={14} className="animate-pulse" /> Update Password
              </div>
              <h1 className="font-syne font-black text-4xl md:text-5xl text-navy leading-none tracking-tight uppercase italic">
                 Reset <br /><span className="text-teal-500">Password.</span>
              </h1>
           </div>
           <div className="h-11 w-11 bg-gray-50 rounded-xl flex items-center justify-center text-navy shadow-inner shrink-0">
              <Lock className="h-5 w-5 md:h-6 md:w-6" />
           </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-7">
          <p className="text-gray-400 font-dm italic text-base md:text-lg opacity-60">
            Create a new password for your account.
          </p>
          {import.meta.env.DEV && (
            <p className="inline-flex px-4 py-2 rounded-xl bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-widest">
              Development reset code: 123456
            </p>
          )}
          
          <div className="space-y-6">
            <Input 
              label="Email or Phone" 
              placeholder="you@email.com or +91 98765 43210"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              required
            />
            
            <Input 
              label="Reset Code" 
              icon={KeyRound}
              placeholder="Paste reset token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              required
            />

            <div className="relative">
              <Input 
                label="New Password" 
                type={show ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="New password"
                required
              />
              <button
                type="button"
                onClick={() => setShow((v) => !v)}
                className="absolute right-4 top-[36px] text-gray-400 hover:text-navy transition-colors"
              >
                {show ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <Input 
              label="Confirm Password" 
              type={show ? 'text' : 'password'}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Confirm password"
              required
            />
          </div>

          <Button 
            loading={loading}
            className="w-full py-6 text-base font-syne font-black uppercase tracking-widest italic shadow-4xl"
            icon={<ArrowRight size={20}/>}
          >
            Reset Password
          </Button>
        </form>

        <div className="pt-6 border-t border-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-[10px] font-black uppercase italic tracking-widest text-gray-300">
           <div className="flex items-center gap-6">
              <button onClick={() => navigate('/login')} className="hover:text-teal-500 transition-colors">Back to Login</button>
              <button onClick={() => navigate('/')} className="hover:text-teal-500 transition-colors">Go Home</button>
           </div>
           <div className="flex items-center gap-2"><Sparkles size={14} className="text-teal-500 animate-pulse"/> SECURE MODE</div>
        </div>
      </div>
    </div>
  );
}
