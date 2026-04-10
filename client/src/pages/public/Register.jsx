import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Mail, Lock, Phone, 
  MapPin, CheckCircle, Camera, 
  ArrowRight, ArrowLeft, ShieldCheck, 
  Stethoscope, Store, Truck, Navigation,
  Upload, Sparkles, Smartphone
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Input, OTPInput } from '../../components/common/Core';
import { useGeolocation, useToast } from '../../hooks/core';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { authService } from '../../services/apiServices';

export default function Register() {
  const { t } = useLanguage();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    role: 'customer',
    name: '',
    email: '',
    phone: '',
    password: '',
    address: '',
    city: 'Karaikal',
    state: 'Puducherry',
    pincode: '609605',
    otp: '',
    photo: null
  });

  const navigate = useNavigate();
  const toast = useToast();
  const location = useGeolocation();

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => {
    if (loading) return;
    setStep(s => s - 1);
  };

  const autoDetectAddress = () => {
    if (location.lat) {
      setFormData(prev => ({ ...prev, address: `Detected Node: ${location.lat}, ${location.lng}` }));
      toast.success(t('gpsSyncSuccess'));
    } else {
      toast.error(t('locationError'));
    }
  };

  const initiateVerification = async () => {
    setLoading(true);
    try {
      await authService.register(formData);
      toast.success(t('authSignalBroadcasted'));
      setStep(4);
      if (import.meta.env.MODE === 'development') {
        setTimeout(() => toast.info(t('systemOverrideOtp')), 1000);
      }
    } catch (err) {
      toast.error(err.response?.data?.error || err.response?.data?.message || t('registrationError'));
    } finally {
      setLoading(false);
    }
  };

  const verifyRegistration = async (otpCode) => {
    setLoading(true);
    try {
      await authService.verifyOTP({ 
        email: formData.email, 
        phone: formData.phone, 
        code: otpCode 
      });
      toast.success(t('nodeVerified'));
      setStep(5);
    } catch (err) {
      toast.error(err.response?.data?.error || err.response?.data?.message || t('verificationFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, photo: file }));
      toast.success(t('visualHandshakeSync'));
    }
  };

  const handleRegister = async () => {
    setLoading(true);
    try {
      if (formData.photo) {
        const data = new FormData();
        data.append('photo', formData.photo);
        data.append('email', formData.email);
        data.append('phone', formData.phone);
        await authService.uploadAvatar(data);
      }
      toast.success(t('registrationFinalized'));
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.error || err.response?.data?.message || t('finalizationFailed'));
    } finally {
      setLoading(false);
    }
  };

  const ROLES = [
    { id: 'customer', label: t('customer') || 'Customer', icon: User, desc: t('speakWithDoctors') || 'Access medicines & doctors' },
    { id: 'doctor', label: t('doctor') || 'Doctor', icon: Stethoscope, desc: t('manageConsultations') },
    { id: 'pharmacist', label: t('pharmacist') || 'Pharmacist', icon: Store, desc: t('operateEnclave') },
    { id: 'delivery', label: t('delivery') || 'Delivery', icon: Truck, desc: t('logisticsFulfillment') }
  ];

  const variants = {
    enter: (direction) => ({ x: direction > 0 ? 50 : -50, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (direction) => ({ x: direction < 0 ? 50 : -50, opacity: 0 })
  };

  return (
    <div className="min-h-screen bg-[#0a1628] flex items-center justify-center p-6 md:p-12 relative overflow-hidden">
       <div className="absolute inset-0 bg-grid opacity-5" />
       <div className="absolute top-0 right-0 h-96 w-96 bg-[#028090] rounded-full blur-[150px] opacity-10 animate-pulse" />
       
       <div className="w-full max-w-4xl bg-white rounded-3xl md:rounded-[5rem] shadow-4xl overflow-hidden relative z-10 grid md:grid-cols-[1fr_2fr]">
          <aside className="bg-gray-50 p-8 md:p-12 space-y-12 border-r border-gray-100 hidden lg:block">
             <div className="space-y-4">
                <Link to="/" className="flex items-center gap-3">
                   <div className="h-10 w-10 bg-[#0a1628] rounded-xl flex items-center justify-center -rotate-[5deg]"><ShieldCheck className="text-[#02C39A]" size={24} /></div>
                   <span className="font-syne font-black text-2xl text-[#0a1628] tracking-tighter">MediPharm.</span>
                </Link>
             </div>

             <div className="space-y-8">
                {[
                  { s: 1, l: t('step1') },
                  { s: 2, l: t('step2') },
                  { s: 3, l: t('step3') },
                  { s: 4, l: t('step4') },
                  { s: 5, l: t('step5') }
                ].map(item => (
                   <div key={item.s} className="flex items-center gap-6 group">
                      <div className={`h-10 w-10 rounded-xl flex items-center justify-center font-syne font-black text-xs transition duration-500 ${step >= item.s ? 'bg-[#0a1628] text-[#02C39A] shadow-xl' : 'bg-gray-200 text-gray-400'}`}>
                         {step > item.s ? <CheckCircle size={16} /> : item.s}
                      </div>
                      <div className={`text-[10px] font-black uppercase tracking-widest transition duration-500 ${step === item.s ? 'text-[#0a1628]' : 'text-gray-300'}`}>{item.l}</div>
                   </div>
                ))}
             </div>

             <div className="pt-20">
                <div className="p-8 bg-white rounded-3xl border border-gray-100 space-y-4 shadow-sm">
                   <Sparkles size={24} className="text-[#02C39A] animate-pulse" />
                   <p className="text-[10px] text-gray-400 font-bold leading-relaxed italic uppercase">{t('joiningEnclave')}</p>
                </div>
             </div>
          </aside>

          <section className="p-6 md:p-12 lg:p-16 space-y-10 md:space-y-16 relative">
             <div className="flex justify-between items-center lg:hidden border-b border-gray-100 pb-6 mb-6">
                <Link to="/" className="flex items-center gap-2">
                   <div className="h-8 w-8 bg-[#0a1628] rounded-lg flex items-center justify-center -rotate-[5deg] shadow-lg shadow-[#02C39A]/20">
                      <ShieldCheck className="text-[#02C39A]" size={16} />
                   </div>
                   <span className="font-syne font-black text-lg text-[#0a1628] tracking-tighter">MediPharm.</span>
                </Link>
                <div className="px-4 py-1.5 bg-gray-50 border border-gray-200 rounded-full text-[9px] font-black text-[#028090] uppercase tracking-widest">
                   {t('step') || 'Step'} {step}/5
                </div>
             </div>

             <div className="min-h-[400px]">
                <AnimatePresence mode="wait" custom={step}>
                   {step === 1 && (
                     <motion.div key="step1" custom={1} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.5 }} className="space-y-12">
                        <div className="space-y-4 text-center md:text-left">
                           <h2 className="font-syne font-black text-3xl md:text-4xl text-[#0a1628]">{t('chooseNode')}</h2>
                           <p className="text-gray-400 font-dm italic text-base md:text-lg opacity-60">{t('identityFoundation')}</p>
                        </div>
                        <div className="grid grid-cols-1 gap-3 md:gap-4">
                           {ROLES.map(r => (
                             <button
                               key={r.id}
                               onClick={() => { setFormData({ ...formData, role: r.id }); handleNext(); }}
                               className="p-8 bg-gray-50 rounded-[2.5rem] border-2 border-transparent hover:border-[#02C39A] hover:bg-white transition-all duration-500 flex items-center gap-8 group text-left"
                             >
                                <div className="h-16 w-16 bg-white rounded-2xl flex items-center justify-center text-[#0a1628] group-hover:bg-[#0a1628] group-hover:text-[#02C39A] transition duration-500 shadow-sm"><r.icon size={28}/></div>
                                <div>
                                   <div className="font-syne font-black text-lg text-[#0a1628] uppercase tracking-tighter">{r.label} Protocol</div>
                                   <div className="text-xs font-dm text-gray-400 italic">{r.desc}</div>
                                </div>
                                <ArrowRight className="ml-auto opacity-0 group-hover:opacity-100 transition duration-500 text-[#02C39A]" size={24} />
                             </button>
                           ))}
                        </div>
                     </motion.div>
                   )}

                   {step === 2 && (
                     <motion.div key="step2" custom={1} variants={variants} initial="enter" animate="center" exit="exit" className="space-y-12">
                        <div className="space-y-4">
                           <h2 className="font-syne font-black text-4xl text-[#0a1628]">{t('personalProtTitle')}</h2>
                           <p className="text-gray-400 font-dm italic text-lg opacity-60">{t('establishCreds')}</p>
                        </div>
                        <div className="space-y-8">
                           <Input 
                             label={t('fullNameId')} 
                             icon={User} 
                             placeholder="e.g. S. Priya Raman" 
                             value={formData.name}
                             onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                           />
                           <Input 
                             label={t('emailNode')} 
                             icon={Mail} 
                             placeholder="name@enclave.in" 
                             value={formData.email}
                             onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                           />
                           <Input 
                             label={t('secretAccess')} 
                             icon={Lock} 
                             type="password" 
                             placeholder="••••••••" 
                             value={formData.password}
                             onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                           />
                        </div>
                        <div className="flex gap-4 pt-8">
                           <Button variant="ghost" onClick={handleBack} className="flex-1">{t('back') || 'Back'}</Button>
                           <Button onClick={handleNext} className="flex-1">{t('proceedLoc')}</Button>
                        </div>
                     </motion.div>
                   )}

                   {step === 3 && (
                      <motion.div key="step3" custom={1} variants={variants} initial="enter" animate="center" exit="exit" className="space-y-12">
                         <div className="space-y-4">
                            <h2 className="font-syne font-black text-4xl text-[#0a1628]">{t('locEnclaveTitle')}</h2>
                            <p className="text-gray-400 font-dm italic text-lg opacity-60">{t('karaikalSync')}</p>
                         </div>
                         <div className="space-y-8">
                            <div className="relative">
                               <Input 
                                 label={t('physAddr')} 
                                 icon={MapPin} 
                                 placeholder="Market Road, Karaikal" 
                                 value={formData.address}
                                 onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                               />
                               <button onClick={autoDetectAddress} className="absolute bottom-6 right-6 h-10 px-4 bg-[#0a1628] text-[#02C39A] rounded-xl font-syne font-black text-[8px] uppercase tracking-widest flex items-center gap-2 hover:bg-[#028090] hover:text-white transition">
                                  <Navigation size={12}/> {t('autoGps')}
                               </button>
                            </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                 <Input label={t('city') || 'City'} defaultValue={formData.city} readOnly className="opacity-70 bg-gray-50" />
                                 <Input label={t('pincode') || 'Pincode'} defaultValue={formData.pincode} readOnly className="opacity-70 bg-gray-50" />
                              </div>
                             <Input 
                                label={t('districtMobile')} 
                                icon={Smartphone} 
                                placeholder="94432 XXXXX" 
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                maxLength={10}
                                required
                             />
                          </div>
                         <div className="flex gap-4 pt-8">
                            <Button variant="ghost" onClick={handleBack} className="flex-1" disabled={loading}>{t('back') || 'Back'}</Button>
                            <Button onClick={initiateVerification} loading={loading} className="flex-1">{t('initVerify')}</Button>
                         </div>
                      </motion.div>
                    )}

                    {step === 4 && (
                      <motion.div key="step4" custom={1} variants={variants} initial="enter" animate="center" exit="exit" className="space-y-12 text-center">
                         <div className="space-y-4">
                            <h2 className="font-syne font-black text-4xl text-[#0a1628] mx-auto">{t('step4')}.</h2>
                            <p className="text-gray-400 font-dm italic text-lg opacity-60">{t('codeSentStream')}</p>
                         </div>
                         <div className="py-8">
                            <OTPInput length={6} onComplete={verifyRegistration} />
                         </div>
                         {loading && <div className="text-brand-teal font-black animate-pulse text-[10px] uppercase tracking-widest">Verifying Node...</div>}
                         <div className="flex flex-col gap-6 items-center">
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-300">{t('waitForSignal')} 59s</p>
                            <button onClick={initiateVerification} className="text-[10px] font-black text-[#028090] uppercase tracking-widest hover:underline decoration-2 underline-offset-4 decoration-[#02C39A]">{t('resendSignal')}</button>
                         </div>
                         <div className="pt-12">
                            <Button variant="ghost" onClick={handleBack} className="w-full" disabled={loading}>{t('backLoc')}</Button>
                         </div>
                      </motion.div>
                    )}

                    {step === 5 && (
                      <motion.div key="step5" custom={1} variants={variants} initial="enter" animate="center" exit="exit" className="space-y-12">
                         <div className="space-y-4 text-center">
                            <h2 className="font-syne font-black text-4xl text-[#0a1628]">{t('profileIdTitle')}</h2>
                            <p className="text-gray-400 font-dm italic text-lg opacity-60">{t('uploadVisual')}</p>
                         </div>

                         <div className="flex items-center justify-between">
                            <div className="space-y-1">
                               <h2 className="font-syne font-black text-3xl text-[#0a1628] uppercase italic leading-none tracking-tighter">{t('idSync')}</h2>
                               <p className="text-gray-400 font-dm font-bold italic text-[10px] opacity-60">{t('verifiedNodeProtocol')}</p>
                            </div>
                         </div>

                         <div className="flex flex-col items-center gap-10">
                            <label className="h-56 w-56 rounded-[5rem] bg-gray-50 border-4 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 group hover:border-[#02C39A] hover:bg-white transition-all cursor-pointer relative overflow-hidden shadow-soft">
                               <input 
                                 type="file" 
                                 className="hidden" 
                                 accept="image/*"
                                 onChange={handlePhotoChange}
                               />
                               {formData.photo ? (
                                  <img src={URL.createObjectURL(formData.photo)} alt="Preview" className="h-full w-full object-cover group-hover:scale-105 transition duration-1000" />
                               ) : (
                                  <>
                                     <Camera size={48} className="group-hover:scale-110 group-hover:text-[#02C39A] transition duration-500" />
                                     <span className="text-[9px] font-black uppercase tracking-[0.4em] mt-4 opacity-30">{t('idNodePlaceholder')}</span>
                                  </>
                                )}
                            </label>

                            <div className="w-full p-10 bg-[#0a1628] rounded-[3.5rem] border border-gray-100 flex items-center justify-between text-white shadow-2xl relative overflow-hidden group/status">
                               <div className="absolute top-0 right-0 h-32 w-32 bg-brand-teal opacity-5 rounded-full blur-[40px] group-hover/status:opacity-20 transition-all duration-1000" />
                               <div className="flex items-center gap-6 relative z-10">
                                  <div className="h-14 w-14 bg-white/5 rounded-2xl flex items-center justify-center text-[#02C39A] border border-white/5 shadow-inner"><Upload size={24}/></div>
                                  <div className="space-y-1">
                                     <div className="font-syne font-black text-xs text-white uppercase tracking-tighter max-w-[180px] truncate">
                                        {formData.photo ? formData.photo.name : t('pendingLog')}
                                     </div>
                                     <div className="text-[10px] text-white/20 font-black uppercase tracking-widest italic animate-pulse">
                                        {formData.photo ? t('syncedStatus', { size: (formData.photo.size / (1024 * 1024)).toFixed(1) }) : t('awaitingHandshake')}
                                     </div>
                                  </div>
                               </div>
                               <button 
                                 type="button"
                                 onClick={() => setFormData({ ...formData, photo: null })}
                                 className={`h-12 w-12 rounded-xl flex items-center justify-center transition-all duration-500 ${formData.photo ? 'bg-red-500 text-white' : 'bg-white/5 text-white/20'}`}
                               >
                                  <CheckCircle size={24} className={formData.photo ? 'rotate-0' : 'rotate-45'} />
                                </button>
                            </div>
                         </div>
                         <div className="pt-16">
                            <Button 
                              onClick={handleRegister} 
                              loading={loading}
                              className="w-full py-10 text-xl font-syne font-black uppercase tracking-[0.2em] shadow-4xl hover:scale-[1.02] active:scale-95 transition-all duration-1000 italic" 
                              icon={<Sparkles size={20}/>}
                            >
                               {t('initHandshake')}
                            </Button>
                         </div>
                      </motion.div>
                    )}
                 </AnimatePresence>
              </div>

              <div className="text-center">
                 <p className="text-[10px] font-black uppercase tracking-widest text-gray-200">
                    {t('alreadyVerified')} <Link to="/login" className="text-[#028090] ml-2 hover:underline decoration-2 underline-offset-4 decoration-[#02C39A]">{t('termLogin')} &rarr;</Link>
                 </p>
              </div>
           </section>
        </div>
     </div>
  );
}
