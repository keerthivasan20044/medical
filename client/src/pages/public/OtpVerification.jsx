
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, ArrowRight, Smartphone, 
  Mail, Clock, AlertCircle, CheckCircle2,
  Cpu, Zap, Lock, Globe, Sparkles
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import OTPInput from '../../components/common/OTPInput.jsx';
import { useOtpConfirm } from '../../hooks/useOtpConfirm.js';
import { useOtpTimer } from '../../hooks/useOtpTimer.js';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { Button } from '../../components/common/Core';

const EMPTY_DIGITS = ['', '', '', '', '', ''];

export default function OtpVerification() {
  const { t } = useLanguage();
  const location = useLocation();
  const [digits, setDigits] = useState(EMPTY_DIGITS);
  const [contact, setContact] = useState(location.state?.contact || '');
  const { timeLeft, reset: resetTimer } = useOtpTimer({ duration: 60, autoStart: true });
  const { confirmAccount, status, error, verified, resend, resendStatus, reset } = useOtpConfirm();

  const resendOtp = async () => {
    if (!contact) return;
    resetTimer();
    setDigits(EMPTY_DIGITS);
    reset();
    await resend(contact.includes('@') ? { email: contact } : { phone: contact });
  };

  const submit = async () => {
    const code = digits.join('');
    if (code.length < 6 || !contact) return;
    const payload = contact.includes('@') ? { email: contact, code } : { phone: contact, code };
    await confirmAccount(payload);
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen relative overflow-hidden flex items-center justify-center py-24 px-6 font-syne">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-[600px] bg-[#0a1628] skew-y-[-6deg] origin-top-left -translate-y-48" />
      <div className="absolute bottom-0 right-0 h-96 w-96 bg-brand-teal opacity-5 rounded-full blur-[100px] -mr-48 -mb-48" />
      <div className="absolute top-1/4 left-10 h-64 w-64 bg-brand-teal opacity-[0.03] rounded-full blur-[120px] animate-pulse" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-2xl"
      >
        <div className="bg-white rounded-[5rem] p-16 md:p-24 shadow-4xl border border-gray-100 relative overflow-hidden group">
          <div className="absolute top-0 right-0 h-64 w-64 bg-brand-teal opacity-[0.02] rounded-full blur-[80px]" />
          
          <div className="space-y-16 relative z-10">
             {/* Header */}
             <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 border-b border-gray-50 pb-12">
                <div className="space-y-6">
                   <div className="px-6 py-2.5 bg-[#0a1628] rounded-2xl w-fit flex items-center gap-3 text-[10px] font-black text-brand-teal uppercase tracking-[0.4em] italic leading-none">
                      <Lock size={16} className="text-brand-teal animate-pulse" /> Identity Protocol Sync
                   </div>
                   <h1 className="font-black text-6xl lg:text-7xl text-[#0a1628] leading-[0.85] tracking-tighter uppercase italic">
                      Verify <br /><span className="text-brand-teal">Node Access.</span>
                   </h1>
                </div>
                <div className="h-24 w-24 bg-gray-50 rounded-[2.5rem] flex items-center justify-center text-[#0a1628] shadow-inner shrink-0"><ShieldCheck size={48} className="animate-float-up" /></div>
             </div>

             <div className="space-y-12">
                <div className="p-10 bg-gray-50 rounded-[3.5rem] border border-gray-100 shadow-inner group/input hover:bg-white transition-all duration-1000 relative">
                   <div className="absolute top-4 right-4 text-[10px] text-brand-teal font-black uppercase tracking-widest opacity-20 group-focus-within/input:opacity-100 transition-opacity">Identification_Registry</div>
                   <div className="flex items-center gap-6">
                      <div className="h-16 w-16 bg-white rounded-2xl flex items-center justify-center text-brand-teal shadow-soft group-focus-within/input:bg-[#0a1628] group-focus-within/input:text-white transition-all">
                        {contact.includes('@') ? <Mail size={32}/> : <Smartphone size={32}/>}
                      </div>
                      <div className="flex-1 space-y-1">
                         <div className="text-[10px] text-gray-300 font-black uppercase tracking-widest leading-none">Verification Target</div>
                         <input
                            className="bg-transparent border-none outline-none font-syne font-black text-2xl text-[#0a1628] w-full p-0"
                            placeholder="Email or phone node..."
                            value={contact}
                            onChange={(e) => setContact(e.target.value)}
                         />
                      </div>
                   </div>
                </div>

                <div className="space-y-8 py-4">
                  <div className="flex items-center justify-between px-6">
                     <h3 className="text-[10px] font-black text-gray-300 uppercase tracking-[0.4em] italic">Enter Enclave Key</h3>
                     <div className="flex items-center gap-3 text-brand-teal animate-pulse">
                        <Clock size={14} />
                        <span className="text-[10px] font-black tracking-widest">{timeLeft > 0 ? `00:${timeLeft.toString().padStart(2, '0')}` : 'Key Expired'}</span>
                     </div>
                  </div>
                  <div className="flex justify-center p-12 bg-[#0a1628] rounded-[4rem] border-t-8 border-brand-teal shadow-4xl group/otp">
                     <OTPInput 
                        length={6} 
                        value={digits} 
                        onChange={setDigits} 
                        onComplete={submit} 
                        autoFocus 
                     />
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="p-8 bg-red-500/10 border border-red-500/20 rounded-[2.5rem] flex items-center gap-6 text-red-600"
                    >
                      <div className="h-14 w-14 bg-red-500 text-white rounded-2xl flex items-center justify-center shadow-lg"><AlertCircle size={24}/></div>
                      <div className="space-y-1 font-syne">
                         <div className="text-[10px] font-black uppercase tracking-widest leading-none">Protocol Resilience Failed</div>
                         <p className="text-sm font-bold italic">{error}</p>
                      </div>
                    </motion.div>
                  )}
                  {verified && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="p-8 bg-brand-teal/10 border border-brand-teal/20 rounded-[2.5rem] flex items-center gap-6 text-brand-teal"
                    >
                      <div className="h-14 w-14 bg-brand-teal text-[#0a1628] rounded-2xl flex items-center justify-center shadow-lg"><CheckCircle2 size={24}/></div>
                      <div className="space-y-1 font-syne">
                         <div className="text-[10px] font-black uppercase tracking-widest leading-none">Authorization Synchronization Complete</div>
                         <p className="text-sm font-bold italic">Node verified. Identity protocol active.</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="grid md:grid-cols-2 gap-8 pt-8">
                   <button 
                     onClick={resendOtp} 
                     disabled={timeLeft > 0 || resendStatus === 'loading'}
                     className={`h-24 rounded-[3rem] border-4 font-black uppercase tracking-[0.2em] italic text-xs flex items-center justify-center gap-4 transition-all duration-700
                       ${timeLeft > 0 ? 'bg-gray-50 border-gray-100 text-gray-200 cursor-not-allowed opacity-50' : 'bg-white border-[#0a1628] text-[#0a1628] hover:bg-[#0a1628] hover:text-white shadow-soft'}
                     `}
                   >
                     {resendStatus === 'loading' ? 'Resending...' : 'Resend Key'} <Zap size={18} />
                   </button>
                   <button 
                      onClick={submit} 
                      disabled={status === 'loading'}
                      className="h-24 bg-[#0a1628] text-white rounded-[3rem] font-black uppercase tracking-[0.2em] italic text-xs flex items-center justify-center gap-4 shadow-4xl hover:bg-brand-teal hover:scale-105 active:scale-95 transition-all duration-700 group/submit"
                   >
                      {status === 'loading' ? 'Synchronizing...' : 'Authorize Node'} <ArrowRight className="group-hover/submit:translate-x-3 transition-transform" size={18} />
                   </button>
                </div>
             </div>

             <div className="pt-12 flex flex-col md:flex-row items-center justify-between gap-6 text-[11px] font-black uppercase italic tracking-widest text-gray-300">
                <div className="flex items-center gap-8">
                   <Link to="/login" className="flex items-center gap-3 hover:text-brand-teal transition-colors"><Globe size={16}/> Back to Login</Link>
                   <Link to="/" className="flex items-center gap-3 hover:text-brand-teal transition-colors">Go Home</Link>
                </div>
                <div className="flex items-center gap-3"><Sparkles size={16} className="text-brand-teal animate-pulse"/> DISTRICT NETWORK 2.4</div>
             </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

