import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Lock, Phone, Mail, 
  Bell, Shield, Globe, MapPin, 
  Trash2, ChevronRight, CheckCircle,
  Smartphone, Share2, Eye, EyeOff,
  Clock, CreditCard, HelpCircle
} from 'lucide-react';
import { Button, Input } from '../../components/common/Core';
import { useLanguage } from '../../context/LanguageContext';

export default function Settings() {
  const { t, lang, setLang } = useLanguage();
  const [activeTab, setActiveTab] = useState('account');
  const [notifications, setNotifications] = useState({
    orders: true,
    tracking: true,
    prescription: true,
    reminders: true,
    offers: true,
    newsletter: false
  });

  const TABS = [
    { id: 'account', label: t('accountProtocol'), icon: User },
    { id: 'notifications', label: t('alertStreams'), icon: Bell },
    { id: 'privacy', label: t('enclavePrivacy'), icon: Shield },
    { id: 'region', label: t('regionSync'), icon: Globe }
  ];

  return (
    <div className="min-h-screen bg-white">
       <div className="max-w-7xl mx-auto px-6 py-24 md:py-32">
          <div className="flex flex-col md:flex-row gap-20">
             
             {/* Settings Sidebar */}
             <aside className="md:w-80 space-y-12">
                <div className="space-y-4">
                   <h1 className="font-syne font-black text-5xl text-[#0a1628]">{t('settingsTitle')}</h1>
                   <p className="text-gray-300 font-dm italic text-lg uppercase tracking-widest">{t('commandProtocolEnclave')}</p>
                </div>

                <nav className="space-y-4">
                   {TABS.map(tab => (
                     <button
                       key={tab.id}
                       onClick={() => setActiveTab(tab.id)}
                       className={`w-full flex items-center gap-6 p-6 rounded-2xl transition-all duration-500 group relative overflow-hidden ${activeTab === tab.id ? 'bg-[#0a1628] text-white shadow-3xl' : 'bg-gray-50 text-gray-400 hover:bg-white hover:border-gray-100 border border-transparent'}`}
                     >
                        <tab.icon size={20} className={activeTab === tab.id ? 'text-[#02C39A]' : 'group-hover:text-[#028090]'} />
                        <span className="font-syne font-black text-[10px] uppercase tracking-widest leading-none">{tab.label}</span>
                        <ChevronRight className={`ml-auto transition duration-500 ${activeTab === tab.id ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`} size={16} />
                     </button>
                   ))}
                </nav>

                <div className="pt-20 border-t border-gray-50 space-y-8">
                   <div className="flex items-center gap-6">
                      <div className="h-12 w-12 bg-gray-50 rounded-2xl flex items-center justify-center text-[#028090] shadow-sm"><HelpCircle size={20}/></div>
                      <div className="space-y-1">
                         <div className="font-syne font-black text-xs text-[#0a1628] uppercase tracking-tighter">{t('architectureHelp')}</div>
                         <p className="text-[8px] text-gray-300 font-bold uppercase tracking-widest">{t('districtSupportDesc')}</p>
                      </div>
                   </div>
                </div>
             </aside>

             {/* Settings Content */}
             <main className="flex-1 max-w-3xl">
                <AnimatePresence mode="wait">
                   {activeTab === 'account' && (
                     <motion.div key="account" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-16">
                        <section className="space-y-10">
                           <div className="flex items-center gap-6 border-b border-gray-50 pb-8">
                              <div className="h-10 w-1 bg-[#028090] rounded-full" />
                              <h2 className="font-syne font-black text-2xl text-[#0a1628] uppercase tracking-tighter">{t('identityCredentials')}</h2>
                           </div>
                           <div className="grid md:grid-cols-2 gap-8">
                              <Input label={t('currentProtocolPass')} type="password" placeholder="••••••••" />
                              <Input label={t('newNodeSecret')} type="password" placeholder="••••••••" />
                              <div className="md:col-span-2">
                                 <Button className="w-full md:w-auto">{t('updateAccessProtocol')}</Button>
                              </div>
                           </div>
                        </section>

                        <section className="space-y-10">
                           <div className="flex items-center gap-6 border-b border-gray-50 pb-8">
                              <div className="h-10 w-1 bg-[#02C39A] rounded-full" />
                              <h2 className="font-syne font-black text-2xl text-[#0a1628] uppercase tracking-tighter">{t('verificationStreams')}</h2>
                           </div>
                           <div className="space-y-8">
                              <div className="flex items-center justify-between p-8 bg-gray-50 rounded-3xl group hover:bg-white border border-transparent hover:border-gray-100 transition duration-500">
                                 <div className="flex items-center gap-6">
                                    <div className="h-12 w-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-[#028090]"><Smartphone size={20}/></div>
                                    <div className="space-y-1">
                                       <div className="text-[8px] text-gray-300 font-black uppercase tracking-widest">{t('mobileEnclave')}</div>
                                       <div className="font-syne font-black text-sm text-[#0a1628]">+91 94432 11111</div>
                                    </div>
                                 </div>
                                 <button className="text-[10px] font-black text-[#028090] uppercase tracking-widest hover:underline decoration-2 underline-offset-4 decoration-[#02C39A]">{t('reVerifyNode')}</button>
                              </div>
                              <div className="flex items-center justify-between p-8 bg-gray-50 rounded-3xl group hover:bg-white border border-transparent hover:border-gray-100 transition duration-500">
                                 <div className="flex items-center gap-6">
                                    <div className="h-12 w-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-[#028090]"><Mail size={20}/></div>
                                    <div className="space-y-1">
                                       <div className="text-[8px] text-gray-300 font-black uppercase tracking-widest">{t('emailStream')}</div>
                                       <div className="font-syne font-black text-sm text-[#0a1628]">priya.raman@enclave.in</div>
                                    </div>
                                 </div>
                                 <button className="text-[10px] font-black text-[#028090] uppercase tracking-widest hover:underline decoration-2 underline-offset-4 decoration-[#02C39A]">{t('syncProtocol')}</button>
                              </div>
                           </div>
                        </section>

                        <section className="pt-10 border-t border-red-50 space-y-6">
                           <h2 className="font-syne font-black text-xl text-red-600 uppercase tracking-tighter flex items-center gap-4"><Trash2 size={24}/> {t('purgeEnclaveNode')}</h2>
                           <p className="text-gray-400 font-dm text-sm italic italic leading-relaxed">{t('purgeDesc')}</p>
                           <Button variant="danger" className="w-full md:w-auto">{t('initiatePurge')}</Button>
                        </section>
                     </motion.div>
                   )}

                   {activeTab === 'notifications' && (
                     <motion.div key="notifications" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-12">
                        <section className="space-y-10">
                           <div className="flex items-center gap-6 border-b border-gray-50 pb-8">
                              <div className="h-10 w-1 bg-[#028090] rounded-full" />
                              <h2 className="font-syne font-black text-2xl text-[#0a1628] uppercase tracking-tighter">{t('alertSyncProtocol')}</h2>
                           </div>
                           <div className="space-y-4">
                              {[
                                { id: 'orders', label: t('orderUpdateStreams'), sub: t('pushSmsEnclave') },
                                { id: 'tracking', label: t('deliveryTrackingNode'), sub: t('liveGpsProtocol') },
                                { id: 'prescription', label: t('verificationAlerts'), sub: t('criticalPharmaSync') },
                                { id: 'reminders', label: t('healthSynchronizers'), sub: t('medicineIntakePings') },
                                { id: 'offers', label: t('promoEnclaveNodes'), sub: t('karaikalDistrictDeals') },
                                { id: 'newsletter', label: t('architectureDigest'), sub: t('weeklyHealthcareStream') }
                              ].map(item => (
                                <div key={item.id} className="p-8 bg-gray-50 rounded-[2.5rem] border border-transparent hover:border-gray-100 hover:bg-white transition duration-500 flex items-center justify-between group">
                                   <div className="space-y-1">
                                      <div className="font-syne font-black text-sm text-[#0a1628] uppercase tracking-tighter">{item.label}</div>
                                      <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest italic">{item.sub}</div>
                                   </div>
                                   <button 
                                     onClick={() => setNotifications({...notifications, [item.id]: !notifications[item.id]})}
                                     className={`h-8 w-14 rounded-full p-1 transition duration-500 relative ${notifications[item.id] ? 'bg-[#02C39A]' : 'bg-gray-200'}`}
                                   >
                                      <motion.div 
                                        animate={{ x: notifications[item.id] ? 24 : 0 }}
                                        className="h-6 w-6 bg-white rounded-full shadow-lg"
                                      />
                                   </button>
                                </div>
                              ))}
                           </div>
                        </section>
                     </motion.div>
                   )}

                   {activeTab === 'privacy' && (
                     <motion.div key="privacy" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-12">
                        <section className="space-y-10">
                           <div className="flex items-center gap-6 border-b border-gray-50 pb-8">
                              <div className="h-10 w-1 bg-[#028090] rounded-full" />
                              <h2 className="font-syne font-black text-2xl text-[#0a1628] uppercase tracking-tighter">{t('enclaveVisibility')}</h2>
                           </div>
                           <div className="space-y-6">
                              {[
                                { l: t('profileNodeVisibility'), s: t('publicMedicalAuth') },
                                { l: t('dataSharingProtocol'), s: t('syncMedicalHistoryDoc') },
                                { l: t('gpsTrackingStream'), s: t('continuousLocationSync') }
                              ].map(item => (
                                <div key={item.l} className="flex items-center justify-between p-8 bg-gray-50 rounded-3xl">
                                   <div className="space-y-1">
                                      <div className="font-syne font-black text-sm text-[#0a1628]">{item.l}</div>
                                      <div className="text-[10px] text-gray-400 font-bold italic tracking-widest uppercase">{item.s}</div>
                                   </div>
                                   <div className="h-6 w-6 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-[#02C39A] shadow-inner"><CheckCircle size={16}/></div>
                                </div>
                              ))}
                           </div>
                        </section>
                     </motion.div>
                   )}

                   {activeTab === 'region' && (
                     <motion.div key="region" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-12">
                        <section className="space-y-10">
                           <div className="flex items-center gap-6 border-b border-gray-50 pb-8">
                              <div className="h-10 w-1 bg-[#028090] rounded-full" />
                              <h2 className="font-syne font-black text-2xl text-[#0a1628] uppercase tracking-tighter">{t('localizedArchitecture')}</h2>
                           </div>
                           <div className="grid md:grid-cols-2 gap-8">
                              <div className="p-8 bg-gray-50 rounded-3xl space-y-4">
                                 <div className="text-[10px] text-gray-300 font-black uppercase tracking-widest">{t('languageEnclave')}</div>
                                 <div className="flex gap-4">
                                    <button 
                                      onClick={() => setLang('en')}
                                      className={`flex-1 py-4 rounded-2xl font-syne font-black text-[10px] uppercase tracking-widest transition-all duration-300 ${lang === 'en' ? 'bg-[#0a1628] text-white shadow-lg' : 'bg-white border border-gray-100 text-gray-400 hover:bg-gray-50'}`}
                                    >
                                      {t('englishProtocol')}
                                    </button>
                                    <button 
                                      onClick={() => setLang('ta')}
                                      className={`flex-1 py-4 rounded-2xl font-syne font-black text-[10px] uppercase tracking-widest transition-all duration-300 ${lang === 'ta' ? 'bg-[#0a1628] text-white shadow-lg' : 'bg-white border border-gray-100 text-gray-400 hover:bg-gray-50'}`}
                                    >
                                      {t('tamilStream')}
                                    </button>
                                 </div>
                              </div>
                              <div className="p-8 bg-gray-50 rounded-3xl space-y-4">
                                 <div className="text-[10px] text-gray-300 font-black uppercase tracking-widest">{t('timezoneAuth')}</div>
                                 <div className="font-syne font-black text-sm text-[#0a1628] flex items-center gap-3"><Clock size={16}/> IST (UTC+5:30) Protocol</div>
                              </div>
                              <div className="p-8 bg-gray-50 rounded-3xl space-y-4 md:col-span-2">
                                 <div className="text-[10px] text-gray-300 font-black uppercase tracking-widest">{t('geographicalNode')}</div>
                                 <div className="flex items-center justify-between">
                                    <div className="font-syne font-black text-lg text-[#0a1628] flex items-center gap-4"><MapPin size={20}/> Karaikal, Tamil Nadu Enclave</div>
                                    <div className="h-12 w-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-[#02C39A] animate-pulse-ring"><Shield size={18}/></div>
                                 </div>
                              </div>
                           </div>
                        </section>
                     </motion.div>
                   )}
                </AnimatePresence>
             </main>
          </div>
       </div>
    </div>
  );
}
