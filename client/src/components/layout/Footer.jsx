import { Link } from 'react-router-dom';
import { Pill, Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, Send, Apple, PlayCircle, ShieldCheck, Heart, Store, Activity, Globe, Zap, Cpu, ChevronRight } from 'lucide-react';
import { useSocket } from '../../context/SocketContext.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { isConnected, socket } = useSocket();
  const { t, language } = useLanguage();

  return (
    <footer className="bg-[#0a1628] text-white pt-48 pb-20 relative overflow-hidden border-t border-white/5">
      {/* HUD Background elements */}
      <div className="absolute top-0 right-0 h-[1000px] w-[1000px] bg-brand-teal opacity-[0.03] rounded-full blur-[200px] translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 h-[800px] w-[800px] bg-brand-teal opacity-[0.02] rounded-full blur-[150px] -translate-x-1/2 translate-y-1/2" />
      
      {/* SVG Wave at top of footer with technical glow */}
      <div className="absolute top-0 left-0 right-0 h-32 transform rotate-180 translate-y-[-1px] text-white z-20">
         <svg className="w-full h-full drop-shadow-[0_0_30px_rgba(255,255,255,0.05)]" viewBox="0 0 1440 100" fill="#f8fafc" preserveAspectRatio="none">
            <path d="M0,40 C240,100 480,0 720,40 C960,80 1200,40 1440,80 L1440,100 L0,100 Z" />
         </svg>
      </div>

      <div className="max-w-7xl mx-auto px-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-24 relative z-10 pt-20">
        <div className="space-y-12">
           <Link to="/" className="flex items-center gap-6 group">
              <div className="h-16 w-16 bg-white/5 border-2 border-brand-teal/20 rounded-2xl flex items-center justify-center -rotate-6 group-hover:rotate-0 transition-all duration-700 shadow-4xl group-hover:bg-brand-teal group-hover:text-[#0a1628]">
                 <Pill className="text-brand-teal w-10 h-10 rotate-[25deg] group-hover:text-[#0a1628] transition-colors" />
              </div>
              <div className="flex flex-col -gap-2">
                 <div className="flex items-baseline leading-none">
                    <span className="font-syne font-black text-4xl text-white tracking-tighter uppercase italic">Medi</span>
                    <span className="font-syne font-black text-4xl text-brand-teal tracking-tighter uppercase italic drop-shadow-[0_0_20px_rgba(2,195,154,0.4)]">Reach</span>
                 </div>
                 <div className="flex items-center gap-3 mt-2 bg-white/5 px-3 py-1 rounded-full border border-white/5">
                    <div className={`h-2 w-2 rounded-full ${isConnected ? 'bg-brand-teal animate-pulse shadow-[0_0_10px_#02C39A]' : 'bg-red-500 shadow-[0_0_10px_#ef4444]'}`} />
                    <span className="text-[9px] font-black font-syne uppercase tracking-[0.3em] text-white/40">{isConnected ? t('systemPulseActive') : t('nodeOffline')}</span>
                 </div>
              </div>
           </Link>
           <p className="text-white/30 font-dm text-lg italic font-bold leading-relaxed max-w-xs transition-colors hover:text-white/50 duration-500">
              {t('districtLargestNetwork')}
           </p>
           <div className="flex gap-4">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <div key={i} className="h-14 w-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/20 hover:bg-brand-teal hover:text-[#0a1628] hover:-translate-y-2 transition-all duration-500 cursor-pointer shadow-2xl">
                   <Icon size={24} />
                </div>
              ))}
           </div>
        </div>

        <div className="space-y-12">
           <div className="flex items-center gap-4">
              <div className="h-1 w-12 bg-brand-teal rounded-full" />
              <h3 className="font-syne font-black text-xl uppercase tracking-[0.4em] text-brand-teal italic">{t('serviceClusters')}</h3>
           </div>
           <ul className="space-y-6 text-white/40 font-dm text-lg italic font-bold">
              {[
                { label: t('medicines'), path: '/medicines' },
                { label: t('pharmacies'), path: '/pharmacies' },
                { label: t('teleconsultation'), path: '/doctors' },
                { label: t('vaccines'), path: '/vaccines' }
              ].map(l => (
                  <li key={l.label}>
                    <Link to={l.path} className="hover:text-brand-teal hover:translate-x-4 transition-all duration-500 inline-flex items-center gap-3 group">
                      <ChevronRight size={18} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                      {l.label}
                    </Link>
                  </li>
              ))}
           </ul>
        </div>

        <div className="space-y-12">
           <div className="flex items-center gap-4">
              <div className="h-1 w-12 bg-brand-teal rounded-full" />
              <h3 className="font-syne font-black text-xl uppercase tracking-[0.4em] text-brand-teal italic">{t('registryNodes')}</h3>
           </div>
           <ul className="space-y-6 text-white/40 font-dm text-lg italic font-bold">
              {[
                { label: t('aboutUs'), path: '/about' },
                { label: t('contact'), path: '/contact' },
                { label: t('offers'), path: '/offers' },
                { label: t('blog'), path: '/blog' }
              ].map(l => (
                  <li key={l.label}>
                    <Link to={l.path} className="hover:text-brand-teal hover:translate-x-4 transition-all duration-500 inline-flex items-center gap-3 group">
                      <ChevronRight size={18} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                      {l.label}
                    </Link>
                  </li>
              ))}
           </ul>
        </div>

        <div className="space-y-12">
           <div className="flex items-center gap-4">
              <div className="h-1 w-12 bg-brand-teal rounded-full" />
              <h3 className="font-syne font-black text-xl uppercase tracking-[0.4em] text-brand-teal italic">{t('supportEnclave')}</h3>
           </div>
           <ul className="space-y-8 text-white/30 font-dm text-lg italic font-bold">
              <li className="flex gap-6 group cursor-pointer hover:text-white transition-colors">
                <div className="h-12 w-12 bg-white/5 rounded-xl flex items-center justify-center text-brand-teal group-hover:bg-brand-teal group-hover:text-[#0a1628] transition-all duration-500"><MapPin size={22} /></div>
                <span>Karaikal, Puducherry <br/><span className="text-[11px] text-white/10 uppercase tracking-widest">{t('districtHub')}</span></span>
              </li>
              <li className="flex gap-6 group cursor-pointer hover:text-white transition-colors">
                <div className="h-12 w-12 bg-white/5 rounded-xl flex items-center justify-center text-brand-teal group-hover:bg-brand-teal group-hover:text-[#0a1628] transition-all duration-500"><Phone size={22} /></div>
                <span>+91 94432 XXXXX <br/><span className="text-[11px] text-white/10 uppercase tracking-widest">{t('voiceSync')}</span></span>
              </li>
              <li className="flex gap-6 group cursor-pointer hover:text-white transition-colors">
                <div className="h-12 w-12 bg-white/5 rounded-xl flex items-center justify-center text-brand-teal group-hover:bg-brand-teal group-hover:text-[#0a1628] transition-all duration-500"><Mail size={22} /></div>
                <span>support@medireach.com <br/><span className="text-[11px] text-white/10 uppercase tracking-widest">{t('emailSync')}</span></span>
              </li>
           </ul>
        </div>

        <div className="space-y-12">
           <div className="flex items-center gap-4">
              <div className="h-1 w-12 bg-brand-teal rounded-full" />
              <h3 className="font-syne font-black text-xl uppercase tracking-[0.4em] text-brand-teal italic">{t('stayHealthy')}</h3>
           </div>
           <p className="text-white/30 font-dm text-lg italic font-bold leading-relaxed">{t('newsletterDesc')}</p>
           <div className="flex p-2 bg-white/5 border-2 border-white/10 rounded-[2rem] group focus-within:border-brand-teal transition-all duration-700 shadow-4xl">
              <input type="email" placeholder={t('emailAddressPlaceholder')} className="bg-transparent flex-1 px-8 py-4 text-lg italic font-bold outline-none text-white placeholder:text-white/10" />
              <button className="bg-brand-teal text-[#0a1628] h-14 w-14 rounded-[1.5rem] flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-4xl group-hover:rotate-12 group-hover:shadow-brand-teal/20"><Send size={24} /></button>
           </div>
           <div className="flex items-center gap-4 pt-4 text-[10px] font-black font-syne uppercase tracking-[0.4em] text-white/10 italic">
              <Zap size={14} className="text-amber-500" /> {t('fastestSyncGuarantee')}
           </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-10 mt-32 pt-16 border-t border-white/5 flex flex-col lg:flex-row items-center justify-between gap-12 text-xs text-white/10 relative z-10">
         <div className="flex flex-wrap items-center justify-center gap-12 font-black font-syne uppercase tracking-[0.3em] italic">
            <span className="flex items-center gap-4 hover:text-brand-teal transition-colors"><ShieldCheck size={18} className="text-brand-teal" /> {t('securePayments')}</span>
            <span className="flex items-center gap-4 hover:text-brand-teal transition-colors"><Heart size={18} className="text-red-500" /> {t('madeForKaraikal')}</span>
            <span className="flex items-center gap-4 hover:text-brand-teal transition-colors"><Globe size={18} className="text-brand-teal" /> {t('districtWideSync')}</span>
            <span className="flex items-center gap-4 bg-white/5 px-6 py-3 rounded-2xl border border-white/5 hover:bg-white/10 transition-all">
               <Cpu size={18} className="text-brand-teal" /> 
               {t('meshId')}: <span className="text-white/40">{socket?.id?.slice(0, 12).toUpperCase() || 'SYNCHRONIZING...'}</span>
            </span>
         </div>
         <div className="flex flex-col items-center lg:items-end gap-2">
            <div className="font-syne font-black text-xl uppercase tracking-[0.5em] text-white/20 italic group transition-colors">
               &copy; {currentYear} <span className="text-brand-teal opacity-50 group-hover:opacity-100 transition-opacity">MediReach</span>
            </div>
            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-teal animate-pulse italic">{t('districtAuthorityAuthorized')}</div>
         </div>
      </div>
    </footer>
  );
}

