import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Mail, Phone, ArrowRight, ShieldCheck, Globe, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { requestPasswordReset } from '../../store/authSlice.js';
import StatusBanner from '../../components/common/StatusBanner';
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
      const res = await dispatch(requestPasswordReset(payload));
      if (res.meta.requestStatus === 'fulfilled') {
        setSent(true);
        toast.success('Reset code sent.');
      }
    } catch (err) {
      toast.error('Failed to send reset code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a1628] flex items-center justify-center p-6 md:p-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-5" />
      <div className="absolute top-0 right-0 h-96 w-96 bg-[#028090] rounded-full blur-[150px] opacity-10 animate-pulse" />
      
      <div className="w-full max-w-2xl bg-white rounded-2xl md:rounded-[5rem] shadow-2xl overflow-hidden relative z-10 p-6 md:p-12 lg:p-20 space-y-10 md:space-y-12">
        <div className="flex items-center justify-between border-b border-gray-50 pb-8 md:pb-10">
           <div className="space-y-3 md:space-y-4">
              <div className="px-4 md:px-5 py-1.5 md:py-2 bg-navy rounded-xl w-fit flex items-center gap-2 md:gap-3 text-[9px] md:text-[10px] font-black text-teal-400 uppercase tracking-[0.3em] md:tracking-[0.4em] italic">
                 <ShieldCheck size={14} className="animate-pulse" /> Security Access
              </div>
              <h1 className="font-syne font-black text-3xl md:text-5xl lg:text-6xl text-navy leading-[0.85] tracking-tighter uppercase italic">
                 Forgot <br /><span className="text-teal-500">Password?</span>
              </h1>
           </div>
           <Link to="/login" className="h-12 w-12 md:h-14 md:w-14 bg-gray-50 rounded-xl md:rounded-2xl flex items-center justify-center text-navy hover:bg-navy hover:text-white transition-all shadow-inner">
              <ArrowRight className="rotate-180" size={20} md:size={24} />
           </Link>
        </div>

        {!sent ? (
          <form onSubmit={handleSubmit} className="space-y-10">
            <p className="text-gray-400 font-dm italic text-base md:text-lg opacity-60">
              No problem. Enter your email or phone node and we will transmit a security reset code to your enclave.
            </p>
            
            <Input 
              label="Contact Identification" 
              icon={contact.includes('@') ? Mail : Phone} 
              placeholder="user@example.com or 94432 XXXXX" 
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              required
            />

            <Button 
              loading={loading}
              className="w-full py-8 text-xl font-syne font-black uppercase tracking-[0.2em] italic shadow-4xl"
              icon={<ArrowRight size={20}/>}
            >
              Transmit Code
            </Button>
          </form>
        ) : (
          <div className="space-y-12 text-center">
             <div className="h-32 w-32 bg-emerald-50 rounded-[2.5rem] flex items-center justify-center text-emerald-500 mx-auto shadow-inner">
                <ShieldCheck size={64} className="animate-float-up" />
             </div>
             <div className="space-y-4">
                <h3 className="font-syne font-black text-3xl text-[#0a1628] uppercase italic">Code Transmitted</h3>
                <p className="text-gray-400 font-dm italic text-lg opacity-60">
                   Check your identification node for the security code.
                </p>
             </div>
             <Button 
               onClick={() => navigate('/otp', { state: { contact } })}
               className="w-full py-8 text-xl font-syne font-black uppercase tracking-[0.2em] italic shadow-4xl"
               icon={<ArrowRight size={20}/>}
             >
                Continue to Verify
             </Button>
          </div>
        )}

        <div className="pt-10 border-t border-gray-50 flex items-center justify-between gap-6 text-[10px] font-black uppercase italic tracking-widest text-gray-300">
           <div className="flex items-center gap-6">
              <Link to="/login" className="hover:text-brand-teal transition-colors">Back to Login</Link>
              <Link to="/" className="hover:text-brand-teal transition-colors">Go Home</Link>
           </div>
           <div className="flex items-center gap-2"><Sparkles size={14} className="text-brand-teal animate-pulse"/> SECURE Section</div>
        </div>
      </div>
    </div>
  );
}
