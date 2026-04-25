import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Eye, EyeOff, KeyRound, ArrowRight, ShieldCheck, Globe, Sparkles, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { resetPassword } from '../../store/authSlice.js';
import { Button, Input } from '../../components/common/Core';
import { useToast } from '../../hooks/core';

export default function ResetPassword() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  const [contact, setContact] = useState('');
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
      const res = await dispatch(resetPassword(payload));
      if (res.meta.requestStatus === 'fulfilled') {
        setDone(true);
        toast.success('Password updated. Please sign in.');
        setTimeout(() => navigate('/login'), 800);
      }
    } catch (err) {
      toast.error('Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center p-4 md:p-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-5" />
      <div className="absolute top-0 right-0 h-96 w-96 bg-teal-500 rounded-full blur-[150px] opacity-10 animate-pulse" />
      
      <div className="w-full max-w-2xl bg-white rounded-2xl md:rounded-[5rem] shadow-2xl overflow-hidden relative z-10 p-6 md:p-12 lg:p-20 space-y-10 md:space-y-12">
        <div className="flex items-center justify-between border-b border-gray-50 pb-8 md:pb-10">
           <div className="space-y-3 md:space-y-4">
              <div className="px-4 md:px-5 py-1.5 md:py-2 bg-navy rounded-xl w-fit flex items-center gap-2 md:gap-3 text-[9px] md:text-[10px] font-black text-teal-400 uppercase tracking-[0.3em] md:tracking-[0.4em] italic">
                 <ShieldCheck size={14} className="animate-pulse" /> Update Password
              </div>
              <h1 className="font-syne font-black text-3xl md:text-5xl lg:text-6xl text-navy leading-[0.85] tracking-tighter uppercase italic">
                 Reset <br /><span className="text-teal-500">Password.</span>
              </h1>
           </div>
           <div className="h-12 w-12 md:h-14 md:w-14 bg-gray-50 rounded-xl md:rounded-2xl flex items-center justify-center text-navy shadow-inner">
              <Lock size={20} md:size={24} />
           </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 md:space-y-10">
          <p className="text-gray-400 font-dm italic text-base md:text-lg opacity-60">
            Create a new password for your account.
          </p>
          
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
            className="w-full py-8 text-xl font-syne font-black uppercase tracking-[0.2em] italic shadow-4xl"
            icon={<ArrowRight size={20}/>}
          >
            Reset Password
          </Button>
        </form>

        <div className="pt-10 border-t border-gray-50 flex items-center justify-between gap-6 text-[10px] font-black uppercase italic tracking-widest text-gray-300">
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
