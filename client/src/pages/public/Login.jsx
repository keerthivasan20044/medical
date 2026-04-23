import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, Lock, LogIn, ChevronRight, 
  ArrowRight, Heart, Star, 
  ShieldCheck, Smartphone, User, 
  Stethoscope, Store, Truck, Globe
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setAuth } from '../../store/authSlice';
import { Button, Input } from '../../components/common/Core';
import { useLanguage } from '../../context/LanguageContext';
import { authService } from '../../services/apiServices';
import { useToast } from '../../hooks/core';

// Role-based destination map — defined at module scope so the useEffect can reference it safely
const ROLE_DASHBOARDS = {
  admin: '/admin/dashboard',
  pharmacist: '/pharmacist/dashboard',
  doctor: '/doctor/dashboard',
  delivery: '/delivery/dashboard',
  customer: '/home',
};

export default function Login() {
  const { t } = useLanguage();
  const [role, setRole] = useState('customer');
  const [method, setMethod] = useState('email'); // 'email' or 'phone'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpStep, setOtpStep] = useState('request'); // 'request' or 'verify'
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toast = useToast();
  const { isAuthenticated, user } = useSelector(state => state.auth);

  useEffect(() => {
    if (isAuthenticated && user) {
      const dest = ROLE_DASHBOARDS[user.role] || '/home';
      navigate(dest, { replace: true });
    }
  }, [isAuthenticated, user, navigate]);


  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      let data;
      if (method === 'email') {
        data = await authService.login({ email, password, role });
      } else {
        data = await authService.verifyLoginOtp({ phone, code: otp, role });
      }
      
      dispatch(setAuth({ user: data.user, role: data.user?.role || role }));
      toast.success(t('accessAuthorized'));
      const dest = ROLE_DASHBOARDS[data.user?.role] || '/home';
      navigate(dest, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.error || err.response?.data?.message || t('authError'));
    } finally {
      setLoading(false);
    }
  };

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    if (phone.length < 10) {
      toast.error('Invalid Mobile Number');
      return;
    }
    setLoading(true);
    
    try {
      if (!phone) throw new Error(t('identityRequired'));
      await authService.requestLoginOtp({ phone, role });
      setOtpStep('verify');
      toast.success(t('authSignalBroadcasted'));
      
      if (import.meta.env.MODE === 'development') {
        setTimeout(() => {
          toast.info(t('systemOverrideOtp'));
        }, 1000);
      }
    } catch (err) {
      toast.error(err.response?.data?.error || err.response?.data?.message || err.message || t('signalSyncFailed'));
      setLoading(false); // Manually clear in case of early catch
    } finally {
      setLoading(false);
    }
  };

  const ROLES = [
    { id: 'customer', label: t('customer') || 'Customer', icon: User },
    { id: 'doctor', label: t('doctor') || 'Doctor', icon: Stethoscope },
    { id: 'pharmacist', label: t('pharmacist') || 'Pharmacist', icon: Store },
    { id: 'delivery', label: t('delivery') || 'Delivery', icon: Truck }
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white overflow-x-hidden">
      {/* Left: Karaikal Themed Image Panel */}
      <section className="hidden md:flex md:w-1/2 bg-[#0a1628] relative overflow-hidden items-center justify-center p-20">
         <div className="absolute inset-0 bg-[url('/assets/hospital_pro.png')] bg-cover bg-center grayscale opacity-20 contrast-125" />
         <div className="absolute inset-0 bg-gradient-to-br from-[#0a1628]/95 via-[#0a1628]/80 to-transparent" />
         <div className="absolute inset-0 bg-grid opacity-10" />
         
         <div className="relative z-10 w-full max-w-xl space-y-16">
            <Link to="/" className="flex items-center gap-4 group">
               <div className="h-14 w-14 bg-gradient-to-br from-[#02C39A] to-[#028090] rounded-2xl flex items-center justify-center -rotate-[5deg] group-hover:rotate-0 transition duration-500 shadow-2xl shadow-[#02C39A]/40 flex-shrink-0">
                  <Heart className="text-white w-8 h-8 rotate-[25deg] group-hover:rotate-0 transition duration-700" />
               </div>
               <div className="flex flex-col">
                  <span className="font-syne font-black text-4xl text-white tracking-tighter leading-none whitespace-nowrap">MediPharm.</span>
                  <span className="text-[10px] text-[#02C39A] font-black uppercase tracking-[0.4em] italic">{t('servingSince')}</span>
               </div>
            </Link>

            <div className="space-y-8">
               <h1 className="font-syne font-black text-6xl text-white leading-tight tracking-tighter">{t('loginHeroTitle')}</h1>
               <p className="text-white/40 font-dm text-xl italic leading-relaxed marker:text-[#02C39A]">/ {t('loginHeroSubtitle')}</p>
            </div>

            <div className="flex flex-wrap gap-4">
               {[
                  { label: t('ratingValue'), icon: Star },
                  { label: t('customerCount'), icon: User },
                  { label: t('pharmacyCount'), icon: Store }
               ].map(card => (
                  <div key={card.label} className="bg-white/5 backdrop-blur-xl border border-white/10 px-8 py-4 rounded-2xl flex items-center gap-4 shadow-2xl group hover:bg-white/10 transition duration-500">
                     <card.icon size={18} className="text-[#02C39A] group-hover:scale-125 transition" />
                     <span className="font-syne font-black text-[10px] text-white uppercase tracking-widest leading-none">{card.label}</span>
                  </div>
               ))}
            </div>

            <div className="pt-12 border-t border-white/5 flex items-center justify-between">
               <div className="space-y-1">
                  <div className="text-[10px] text-white/20 font-black uppercase tracking-widest">SECURE ACCESS</div>
                  <div className="text-xs font-dm font-bold text-white/40 italic flex items-center gap-3"> <ShieldCheck size={14} className="text-emerald-500" /> Authorized Access Only</div>
               </div>
               <button className="h-12 w-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-white/40 hover:text-white transition group">
                  <Globe size={20} className="group-hover:rotate-12 transition" />
               </button>
            </div>
         </div>
      </section>

      {/* Right: Login Form Panel */}
      <section className="flex-1 flex flex-col items-center justify-center p-8 md:p-16 space-y-12">
         <div className="w-full max-w-lg space-y-8 md:space-y-12 px-4 md:px-0">
            {/* Mobile logo — only visible on small screens */}
            <div className="flex md:hidden items-center gap-3 pb-2">
              <div className="h-10 w-10 bg-gradient-to-br from-[#02C39A] to-[#028090] rounded-xl flex items-center justify-center flex-shrink-0">
                <Heart className="text-white w-5 h-5" />
              </div>
              <span className="font-syne font-black text-2xl text-[#0a1628] whitespace-nowrap">MediPharm.</span>
            </div>
            <div className="space-y-4">
               <h2 className="font-syne font-black text-4xl md:text-5xl text-[#0a1628] leading-tight select-none">{t('welcomeBack')}</h2>
               <p className="text-gray-400 font-dm text-sm md:text-lg italic tracking-wide">{t('selectRoleDesc')}</p>
            </div>

            <form onSubmit={method === 'email' ? handleLogin : (otpStep === 'request' ? handleRequestOtp : handleLogin)} className="space-y-10">
               {/* Role Selector */}
               <div className="grid grid-cols-2 gap-3 md:gap-4">
                  {ROLES.map(r => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setRole(r.id)}
                      className={`flex flex-col items-center justify-center gap-2 md:gap-4 p-4 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border-2 transition-all duration-500 group ${role === r.id ? 'bg-[#0a1628] border-[#0a1628] text-white shadow-3xl' : 'bg-gray-50 border-gray-100 text-gray-400 hover:bg-white hover:border-[#028090]/20'}`}
                    >
                       <r.icon size={role === r.id ? 20 : 18} className={role === r.id ? 'text-[#02C39A]' : 'group-hover:text-[#028090]'} />
                       <span className="font-syne font-black text-[9px] md:text-[10px] uppercase tracking-widest text-center">{r.label}</span>
                    </button>
                  ))}
               </div>


               <AnimatePresence mode="wait">
                 {method === 'email' ? (
                   <motion.div 
                     key="email"
                     initial={{ opacity: 0, x: -20 }}
                     animate={{ opacity: 1, x: 0 }}
                     exit={{ opacity: 0, x: 20 }}
                     className="space-y-6"
                   >
                      <Input 
                        label="Email Address" 
                        icon={Mail} 
                        placeholder="user@example.com" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                      <Input 
                        label="Password" 
                        icon={Lock} 
                        type="password" 
                        placeholder="••••••••" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                   </motion.div>
                 ) : (
                   <motion.div 
                     key="phone"
                     initial={{ opacity: 0, x: 20 }}
                     animate={{ opacity: 1, x: 0 }}
                     exit={{ opacity: 0, x: -20 }}
                     className="space-y-6"
                   >
                      {otpStep === 'request' ? (
                        <Input 
                          label="Mobile Number" 
                          icon={Smartphone} 
                          placeholder="94432 XXXXX" 
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          maxLength={10}
                          required
                        />
                      ) : (
                        <div className="space-y-4">
                          <Input 
                            label="Access Code" 
                            icon={ShieldCheck} 
                            placeholder="Enter 6-digit code" 
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            maxLength={6}
                            required
                          />
                          <button 
                            type="button"
                            onClick={() => setOtpStep('request')}
                            className="text-[9px] font-black text-[#028090] uppercase tracking-widest hover:underline"
                          >
                            {t('changeMobile')}
                          </button>
                        </div>
                      )}
                   </motion.div>
                 )}
               </AnimatePresence>

                <div className="flex items-center justify-between">
                   <label className="flex items-center gap-4 cursor-pointer group">
                      <div className={`h-6 w-6 rounded-lg border flex items-center justify-center transition shadow-inner ${rememberMe ? 'bg-[#0a1628] border-brand-teal' : 'bg-gray-50 border-gray-100'}`}>
                         <input 
                           type="checkbox" 
                           className="hidden" 
                           checked={rememberMe}
                           onChange={() => setRememberMe(!rememberMe)}
                         />
                         <div className={`h-2 w-2 bg-[#02C39A] rounded-full transition ${rememberMe ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`} />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-[#0a1628]">Remember Me</span>
                   </label>
                  {method === 'email' && (
                    <Link to="/forgot-password" title="Forgot Password" className="text-[10px] font-black uppercase tracking-widest text-[#028090] hover:underline decoration-2 underline-offset-4 decoration-[#02C39A]">Forgot Password?</Link>
                  )}
               </div>

               <Button 
                 loading={loading}
                 className="w-full py-8 text-xl" 
                 icon={method === 'email' ? <LogIn size={20}/> : (otpStep === 'request' ? <ArrowRight size={20}/> : <ShieldCheck size={20}/>)}
               >
                 {method === 'email' ? t('login') : (otpStep === 'request' ? t('requestCode') : 'Verify')}
               </Button>
            </form>

            <div className="relative">
               <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-50" /></div>
               <div className="relative flex justify-center"><span className="bg-white px-8 text-[10px] font-black text-gray-200 uppercase tracking-widest">OR LOGIN WITH</span></div>
            </div>

            <div className="grid grid-cols-2 gap-6">
               <button 
                type="button"
                onClick={() => setMethod('email')}
                className={`flex items-center justify-center gap-4 py-6 rounded-3xl border transition duration-500 group shadow-sm ${method === 'email' ? 'bg-[#0a1628] border-transparent text-white' : 'bg-gray-50 border-transparent hover:border-gray-100 hover:bg-white text-gray-400'}`}
               >
                  <div className="h-8 w-8 bg-white rounded-lg flex items-center justify-center shadow-sm"><Mail size={18} className="text-blue-500"/></div>
                  <span className="font-syne font-black text-[10px] uppercase tracking-widest">Email</span>
               </button>
               <button 
                type="button"
                onClick={() => setMethod('phone')}
                className={`flex items-center justify-center gap-4 py-6 rounded-3xl border transition duration-500 group shadow-sm ${method === 'phone' ? 'bg-[#0a1628] border-transparent text-white' : 'bg-gray-50 border-transparent hover:border-gray-100 hover:bg-white text-gray-400'}`}
               >
                  <div className="h-8 w-8 bg-white rounded-lg flex items-center justify-center shadow-sm"><Smartphone size={18} className="text-[#028090]"/></div>
                  <span className="font-syne font-black text-[10px] uppercase tracking-widest">Phone OTP</span>
               </button>
            </div>

               <div className="text-center px-4 w-full">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-300 flex flex-wrap items-center justify-center gap-2">
                     <span>New here?</span>
                     <Link to="/register" className="text-[#028090] font-bold hover:underline decoration-2 underline-offset-4 decoration-[#02C39A]">
                        Create Account &rarr;
                     </Link>
                  </p>
                  <Link to="/" className="text-[10px] font-black uppercase tracking-widest text-gray-300 hover:text-brand-teal transition-colors mt-4 block">
                     Continue browsing without an account &rarr;
                  </Link>
               </div>

            <div className="p-8 bg-gray-50/50 rounded-[2.5rem] border border-gray-100 space-y-4">
               <div className="text-[9px] text-gray-300 font-black uppercase tracking-[0.2em] flex items-center gap-4"> 
                  <div className="h-1 w-6 bg-brand-teal rounded-full" /> 
                  Demo Accounts
               </div>
               <div className="grid grid-cols-2 gap-4">
                  {[
                    { r: 'Customer', e: 'kkl@demo.in' },
                    { r: 'Doctor', e: 'doc@demo.in' },
                    { r: 'Pharmacist', e: 'shop@demo.in' },
                    { r: 'Delivery', e: 'ride@demo.in' }
                  ].map(d => (
                    <div key={d.r} className="p-4 bg-white rounded-2xl border border-gray-100 hover:shadow-lg transition duration-500">
                       <div className="text-[8px] font-black uppercase text-brand-teal mb-1">{d.r}</div>
                       <div className="text-[10px] font-dm italic text-gray-400 select-all truncate">{d.e} / 123456</div>
                    </div>
                  ))}
               </div>
            </div>
         </div>
      </section>
    </div>
  );
}
