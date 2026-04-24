import { useState } from 'react';
import { Settings, Shield, Bell, CreditCard, Database, Globe, Save, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminSettings() {
  const [activeSection, setActiveSection] = useState('Gateway');

  const SECTIONS = [
    { label: 'Gateway', icon: CreditCard },
    { label: 'Security', icon: Shield },
    { label: 'Notifications', icon: Bell },
    { label: 'System', icon: Database },
    { label: 'Regional', icon: Globe },
  ];

  const handleSave = () => {
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 1500)),
      {
        loading: 'Synchronizing system protocols...',
        success: 'Settings updated across all nodes!',
        error: 'Synchronization failed.',
      }
    );
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="font-syne font-black text-4xl text-navy italic tracking-tighter uppercase">System Configuration</h1>
          <p className="text-xs font-dm font-bold text-navy/40 uppercase tracking-widest mt-1 italic">Core Protocol Management</p>
        </div>
        <button 
          onClick={handleSave}
          className="h-14 px-8 bg-brand-teal text-navy rounded-[2rem] font-syne font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:scale-105 transition-all shadow-xl shadow-brand-teal/20"
        >
          <Save size={18} /> Deploy Changes
        </button>
      </div>

      <div className="grid lg:grid-cols-12 gap-10">
        {/* Sidebar Nav */}
        <div className="lg:col-span-3 space-y-2">
          {SECTIONS.map((section) => (
            <button
              key={section.label}
              onClick={() => setActiveSection(section.label)}
              className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-all duration-300 group ${
                activeSection === section.label 
                ? 'bg-navy text-white shadow-lg shadow-navy/20' 
                : 'bg-white text-navy/60 border border-gray-100 hover:bg-navy/5 hover:text-navy'
              }`}
            >
              <div className="flex items-center gap-4">
                <section.icon size={20} className={activeSection === section.label ? 'text-brand-teal' : 'group-hover:text-brand-teal transition-colors'} />
                <span className="font-syne font-bold text-sm tracking-tight uppercase italic">{section.label}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-9 bg-white p-10 rounded-[3.5rem] border border-gray-100 shadow-sm space-y-10">
           {activeSection === 'Gateway' && (
             <div className="space-y-8">
                <div className="pb-6 border-b border-gray-50">
                   <h3 className="font-syne font-black text-xl text-navy uppercase italic">Razorpay Protocol</h3>
                   <p className="text-[10px] font-black text-navy/40 uppercase tracking-widest italic mt-1">Payment gateway synchronization keys</p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-navy/40 uppercase tracking-widest italic ml-1">Key ID</label>
                      <input 
                        type="text" 
                        defaultValue="rzp_test_KKL_KEY_ARCH"
                        className="w-full h-14 bg-gray-50 border border-gray-100 rounded-2xl px-6 font-dm font-bold text-navy outline-none focus:border-brand-teal transition-all"
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-navy/40 uppercase tracking-widest italic ml-1">Key Secret</label>
                      <input 
                        type="password" 
                        defaultValue="••••••••••••••••"
                        className="w-full h-14 bg-gray-50 border border-gray-100 rounded-2xl px-6 font-dm font-bold text-navy outline-none focus:border-brand-teal transition-all"
                      />
                   </div>
                </div>

                <div className="p-6 bg-amber-50 border border-amber-100 rounded-2xl flex gap-4">
                   <RefreshCw size={24} className="text-amber-500 mt-1" />
                   <div>
                      <h4 className="font-syne font-black text-sm text-amber-600 uppercase italic">Key Rotation Required</h4>
                      <p className="text-xs font-dm font-medium text-amber-600/80 mt-1">For security, it is recommended to rotate your synchronization keys every 90 days. Last rotated 42 days ago.</p>
                   </div>
                </div>
             </div>
           )}

           {activeSection !== 'Gateway' && (
             <div className="h-60 flex flex-col items-center justify-center text-center space-y-4">
                <div className="h-20 w-20 bg-navy/5 rounded-[2rem] flex items-center justify-center text-navy/20">
                   <Settings size={32} />
                </div>
                <div className="space-y-1">
                   <h3 className="font-syne font-black text-lg text-navy uppercase italic">{activeSection} Module Pending</h3>
                   <p className="text-xs font-dm font-medium text-navy/40 uppercase tracking-widest italic">Core logic for this node is in the next deployment cycle.</p>
                </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
