import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Mail, Phone, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { requestPasswordReset } from '../../store/authSlice.js';
import { Button, Input } from '../../components/common/Core';
import { useToast } from '../../hooks/core';

export default function ForgotPassword() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  const [contact, setContact] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!contact.trim()) {
      toast.error('Enter your email or phone number.');
      return;
    }
    setLoading(true);
    const payload = contact.includes('@') ? { email: contact.trim() } : { phone: contact.trim() };
    try {
      await dispatch(requestPasswordReset(payload)).unwrap();
      setSent(true);
      toast.success('Reset code sent.');
    } catch (err) {
      toast.error('Failed to send reset code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-92px)] bg-[#0a1628] flex items-center justify-center px-4 py-8 md:px-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-5" />
      <div className="absolute top-0 right-0 h-96 w-96 bg-[#028090] rounded-full blur-[150px] opacity-10 animate-pulse" />
      
      <div className="w-full max-w-xl bg-white rounded-2xl md:rounded-[2rem] shadow-2xl overflow-hidden relative z-10 p-5 md:p-8 space-y-7">
        <div className="flex items-start justify-between gap-6 border-b border-gray-50 pb-6">
           <div className="space-y-3 md:space-y-4">
              <div className="px-4 py-1.5 bg-navy rounded-xl w-fit flex items-center gap-2 text-[9px] font-black text-teal-400 uppercase tracking-widest italic">
                 <ShieldCheck size={14} className="animate-pulse" /> Account Recovery
              </div>
              <h1 className="font-syne font-black text-4xl md:text-5xl text-navy leading-none tracking-tight uppercase italic">
                 Forgot <br /><span className="text-teal-500">Password?</span>
              </h1>
           </div>
           <Link to="/login" className="h-11 w-11 bg-gray-50 rounded-xl flex items-center justify-center text-navy hover:bg-navy hover:text-white transition-all shadow-inner shrink-0">
              <ArrowRight className="h-5 w-5 md:h-6 md:w-6 rotate-180" />
           </Link>
        </div>

        {!sent ? (
          <form onSubmit={handleSubmit} className="space-y-7">
            <p className="text-gray-400 font-dm italic text-base md:text-lg opacity-60">
              No problem. Enter your email or phone number and we will send a reset code to your device.
            </p>
            
            <Input 
              label="Email or Phone Number" 
              icon={contact.includes('@') ? Mail : Phone} 
              placeholder="user@example.com or 94432 XXXXX" 
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              required
            />

            <Button 
              loading={loading}
              className="w-full py-6 text-base font-syne font-black uppercase tracking-widest italic shadow-4xl"
              icon={<ArrowRight size={20}/>}
            >
              Send Reset Code
            </Button>
          </form>
        ) : (
          <div className="space-y-7 text-center">
             <div className="h-24 w-24 bg-emerald-50 rounded-[2rem] flex items-center justify-center text-emerald-500 mx-auto shadow-inner">
                <ShieldCheck size={48} className="animate-float-up" />
             </div>
             <div className="space-y-4">
                <h3 className="font-syne font-black text-2xl md:text-3xl text-[#0a1628] uppercase italic">Reset Code Sent</h3>
                <p className="text-gray-400 font-dm italic text-lg opacity-60">
                   Check your email or phone for the reset code.
                </p>
                {import.meta.env.DEV && (
                  <p className="inline-flex px-4 py-2 rounded-xl bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-widest">
                    Development code: 123456
                  </p>
                )}
             </div>
             <Button 
               onClick={() => navigate('/reset-password', { state: { contact } })}
               className="w-full py-6 text-base font-syne font-black uppercase tracking-widest italic shadow-4xl"
               icon={<ArrowRight size={20}/>}
             >
                Continue
             </Button>
          </div>
        )}

        <div className="pt-6 border-t border-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-[10px] font-black uppercase italic tracking-widest text-gray-300">
           <div className="flex items-center gap-6">
              <Link to="/login" className="hover:text-brand-teal transition-colors">Back to Login</Link>
              <Link to="/" className="hover:text-brand-teal transition-colors">Go Home</Link>
           </div>
           <div className="flex items-center gap-2"><Sparkles size={14} className="text-brand-teal animate-pulse"/> SECURE MODE</div>
        </div>
      </div>
    </div>
  );
}
