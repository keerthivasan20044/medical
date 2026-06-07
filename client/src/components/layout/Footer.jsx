import { Link } from 'react-router-dom';
import { Pill, Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, Send, Apple, PlayCircle, ShieldCheck, Heart, Store, Activity, Globe, Zap, Cpu, ChevronRight } from 'lucide-react';
import { useSocket } from '../../context/SocketContext';
import { useLanguage } from '../../context/LanguageContext';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { isConnected, socket } = useSocket();
  const { t, lang } = useLanguage();

  return (
    <footer className="bg-[#0a1628] text-white pt-20 pb-24 lg:pb-16 relative overflow-hidden border-t border-white/5">
      {/* HUD Background elements */}
      <div className="absolute top-0 right-0 h-[1000px] w-[1000px] bg-brand-teal opacity-[0.03] rounded-full blur-[200px] translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 h-[800px] w-[800px] bg-brand-teal opacity-[0.02] rounded-full blur-[150px] -translate-x-1/2 translate-y-1/2" />
      
      {/* Soft wave at top */}
      <div className="absolute top-0 left-0 right-0 h-16 transform rotate-180 translate-y-[-1px] text-white z-20">
         <svg className="w-full h-full drop-shadow-[0_0_30px_rgba(255,255,255,0.05)]" viewBox="0 0 1440 100" fill="#f8fafc" preserveAspectRatio="none">
            <path d="M0,40 C240,100 480,0 720,40 C960,80 1200,40 1440,80 L1440,100 L0,100 Z" />
         </svg>
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.4fr_0.8fr_0.8fr_1.25fr] gap-10 lg:gap-14 relative z-10 pt-8">
        <div className="space-y-7">
           <Link to="/" className="flex items-center gap-4 group">
              <div className="h-12 w-12 bg-white/5 border border-brand-teal/20 rounded-2xl flex items-center justify-center -rotate-6 group-hover:rotate-0 transition-all duration-500 shadow-xl group-hover:bg-brand-teal group-hover:text-[#0a1628]">
                 <Pill className="text-brand-teal w-7 h-7 rotate-[25deg] group-hover:text-[#0a1628] transition-colors" />
              </div>
              <div className="flex min-w-0 flex-col">
                 <div className="flex items-baseline leading-none">
                    <span className="font-syne font-black text-2xl md:text-3xl text-white tracking-tighter">Medi</span>
                    <span className="font-syne font-black text-2xl md:text-3xl text-brand-teal tracking-tighter drop-shadow-[0_0_20px_rgba(2,195,154,0.4)]">Pharm</span>
                 </div>
                 <div className="flex items-center gap-2 mt-2 bg-white/5 px-3 py-1 rounded-full border border-white/5 w-fit">
                    <div className={`h-2 w-2 rounded-full ${isConnected ? 'bg-brand-teal animate-pulse shadow-[0_0_10px_#02C39A]' : 'bg-red-500 shadow-[0_0_10px_#ef4444]'}`} />
                    <span className="text-[9px] font-black font-syne uppercase tracking-[0.16em] text-white/50">{isConnected ? 'Live' : 'Offline'}</span>
                 </div>
              </div>
           </Link>
           <p className="text-white/45 font-dm text-base font-semibold leading-7 max-w-xs transition-colors hover:text-white/60 duration-500">
              {t('districtLargestNetwork')}
           </p>
           <div className="flex gap-4">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <div key={i} className="h-11 w-11 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/30 hover:bg-brand-teal hover:text-[#0a1628] hover:-translate-y-1 transition-all duration-300 cursor-pointer shadow-xl">
                   <Icon size={19} />
                </div>
              ))}
           </div>
        </div>

        <div className="space-y-6">
           <div className="flex items-center gap-4">
              <div className="h-1 w-8 bg-brand-teal rounded-full" />
              <h3 className="font-syne font-black text-sm uppercase tracking-[0.18em] text-brand-teal">Services</h3>
           </div>
           <ul className="space-y-4 text-white/45 font-dm text-base font-semibold">
              {[
                { label: t('medicines'), path: '/medicines' },
                { label: t('pharmacies'), path: '/pharmacies' },
                { label: t('teleconsultation'), path: '/doctors' },
                { label: t('vaccines'), path: '/vaccines' }
              ].map(l => (
                  <li key={l.label}>
                    <Link to={l.path} className="hover:text-brand-teal hover:translate-x-2 transition-all duration-300 inline-flex items-center gap-2 group">
                      <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                      {l.label}
                    </Link>
                  </li>
              ))}
           </ul>
        </div>

        <div className="space-y-6">
           <div className="flex items-center gap-4">
              <div className="h-1 w-8 bg-brand-teal rounded-full" />
              <h3 className="font-syne font-black text-sm uppercase tracking-[0.18em] text-brand-teal">Company</h3>
           </div>
           <ul className="space-y-4 text-white/45 font-dm text-base font-semibold">
              {[
                { label: t('aboutUs'), path: '/about' },
                { label: t('contact'), path: '/contact' },
                { label: t('offers'), path: '/offers' },
                { label: t('blog'), path: '/blog' }
              ].map(l => (
                  <li key={l.label}>
                    <Link to={l.path} className="hover:text-brand-teal hover:translate-x-2 transition-all duration-300 inline-flex items-center gap-2 group">
                      <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                      {l.label}
                    </Link>
                  </li>
              ))}
           </ul>
        </div>

        <div className="space-y-6">
           <div className="flex items-center gap-4">
              <div className="h-1 w-8 bg-brand-teal rounded-full" />
              <h3 className="font-syne font-black text-sm uppercase tracking-[0.18em] text-brand-teal">Support</h3>
           </div>
           <ul className="space-y-5 text-white/45 font-dm text-base font-semibold">
              <li className="flex gap-4 group cursor-pointer hover:text-white transition-colors">
                <div className="h-11 w-11 shrink-0 bg-white/5 rounded-xl flex items-center justify-center text-brand-teal group-hover:bg-brand-teal group-hover:text-[#0a1628] transition-all duration-300"><MapPin size={20} /></div>
                <span>Karaikal, Puducherry <br/><span className="text-[10px] text-white/20 uppercase tracking-widest">{t('districtHub')}</span></span>
              </li>
              <li className="flex gap-4 group cursor-pointer hover:text-white transition-colors">
                <div className="h-11 w-11 shrink-0 bg-white/5 rounded-xl flex items-center justify-center text-brand-teal group-hover:bg-brand-teal group-hover:text-[#0a1628] transition-all duration-300"><Phone size={20} /></div>
                <span>+91 94432 XXXXX <br/><span className="text-[10px] text-white/20 uppercase tracking-widest">Call us</span></span>
              </li>
              <li className="flex gap-4 group cursor-pointer hover:text-white transition-colors">
                <div className="h-11 w-11 shrink-0 bg-white/5 rounded-xl flex items-center justify-center text-brand-teal group-hover:bg-brand-teal group-hover:text-[#0a1628] transition-all duration-300"><Mail size={20} /></div>
                <span className="break-all">support@medipharm.com <br/><span className="text-[10px] text-white/20 uppercase tracking-widest">Email us</span></span>
              </li>
           </ul>
        </div>

        <div className="space-y-6 sm:col-span-2 lg:col-span-4 rounded-3xl border border-white/10 bg-white/[0.03] p-5 md:p-6">
           <div className="flex items-center gap-4">
              <div className="h-1 w-8 bg-brand-teal rounded-full" />
              <h3 className="font-syne font-black text-sm uppercase tracking-[0.18em] text-brand-teal">{t('stayHealthy')}</h3>
           </div>
           <div className="grid gap-4 md:grid-cols-[1fr_420px] md:items-center">
           <p className="text-white/45 font-dm text-base font-semibold leading-7">{t('newsletterDesc')}</p>
           <div className="flex p-2 bg-white/5 border border-white/10 rounded-2xl group focus-within:border-brand-teal transition-all duration-300 shadow-xl">
              <input type="email" placeholder={t('emailAddressPlaceholder')} className="bg-transparent flex-1 min-w-0 px-4 py-3 text-sm font-semibold outline-none text-white placeholder:text-white/20" />
              <button className="bg-brand-teal text-[#0a1628] h-11 w-11 rounded-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xl"><Send size={20} /></button>
           </div>
           </div>
           <div className="flex items-center gap-3 pt-2 text-[10px] font-black font-syne uppercase tracking-[0.18em] text-white/30">
              <Zap size={14} className="text-amber-500" /> {t('fastestUpdateGuarantee')}
           </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 mt-12 pt-8 border-t border-white/5 flex flex-col lg:flex-row items-center justify-between gap-6 text-xs text-white/30 relative z-10">
         <div className="flex flex-wrap items-center justify-center gap-3 md:gap-5 font-black font-syne uppercase tracking-[0.12em]">
            <span className="flex items-center gap-2 hover:text-brand-teal transition-colors"><ShieldCheck size={16} className="text-brand-teal" /> {t('securePayments')}</span>
            <span className="flex items-center gap-2 hover:text-brand-teal transition-colors"><Heart size={16} className="text-red-500" /> {t('madeForKaraikal')}</span>
            <span className="flex items-center gap-2 hover:text-brand-teal transition-colors"><Globe size={16} className="text-brand-teal" /> {t('districtWideUpdate')}</span>
            <span className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-2xl border border-white/5 hover:bg-white/10 transition-all">
               <Cpu size={16} className="text-brand-teal" /> 
               ID: <span className="text-white/50">{socket?.id?.slice(0, 10).toUpperCase() || 'LOADING'}</span>
            </span>
         </div>
         <div className="flex flex-col items-center lg:items-end gap-2">
            <div className="font-syne font-black text-sm uppercase tracking-[0.2em] text-white/40 group transition-colors">
               &copy; {currentYear} <span className="text-brand-teal opacity-50 group-hover:opacity-100 transition-opacity">MediPharm</span>
            </div>
            <div className="text-[10px] font-black uppercase tracking-[0.16em] text-brand-teal animate-pulse">{t('districtAuthorityAuthorized')}</div>
         </div>
      </div>
    </footer>
  );
}

