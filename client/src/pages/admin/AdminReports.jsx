import { useState } from 'react';
import { FileText, Download, Activity, TrendingUp, Users, ShoppingBag, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminReports() {
  const [generating, setGenerating] = useState(null);

  const reports = [
    { id: 'revenue', title: 'Financial Analytics', desc: 'Monthly revenue, tax, and profit margins.', icon: TrendingUp, color: 'text-emerald-500 bg-emerald-50' },
    { id: 'users', title: 'User Growth', desc: 'New registrations and retention metrics.', icon: Users, color: 'text-blue-500 bg-blue-50' },
    { id: 'orders', title: 'Fulfillment Report', desc: 'Order success rate and delivery times.', icon: ShoppingBag, color: 'text-orange-500 bg-orange-50' },
    { id: 'appointments', title: 'Doctor Visits', desc: 'Doctor-patient consultation volume.', icon: Calendar, color: 'text-brand-teal bg-brand-teal/10' },
    { id: 'inventory', title: 'Inventory Matrix', desc: 'Medicine stock levels and expiration logs.', icon: Activity, color: 'text-purple-500 bg-purple-50' },
    { id: 'system', title: 'System Service', desc: 'Audit logs and security events.', icon: FileText, color: 'text-navy/40 bg-navy/5' },
  ];

  const handleDownload = (id) => {
    setGenerating(id);
    setTimeout(() => {
      setGenerating(null);
      toast.success('Report generated successfully');
    }, 2000);
  };

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="font-syne font-black text-4xl text-navy italic tracking-tighter uppercase">Data Repository</h1>
          <p className="text-xs font-dm font-bold text-navy/40 uppercase tracking-widest mt-1 italic">Generate and Export System Insights</p>
        </div>
        <div className="flex items-center gap-4 bg-white px-6 py-3 rounded-2xl border border-gray-100 shadow-sm">
           <div className="h-2 w-2 rounded-full bg-brand-teal animate-pulse" />
           <span className="text-[10px] font-black text-navy/60 uppercase tracking-widest italic">Secure v2.4</span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {reports.map((r) => (
          <div key={r.id} className="bg-white p-10 rounded-[3.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-700 group relative overflow-hidden">
            <div className="absolute top-0 right-0 h-40 w-40 bg-navy opacity-0 group-hover:opacity-[0.02] rounded-full blur-[60px] transition-opacity" />
            
            <div className="space-y-8 relative z-10">
               <div className={`h-16 w-16 rounded-2xl flex items-center justify-center transition-all duration-700 group-hover:scale-110 group-hover:rotate-6 ${r.color}`}>
                  <r.icon size={28} />
               </div>
               
               <div className="space-y-2">
                  <h3 className="font-syne font-black text-xl text-navy uppercase italic tracking-tighter">{r.title}</h3>
                  <p className="text-xs font-dm font-bold text-navy/40 leading-relaxed uppercase tracking-tight italic">{r.desc}</p>
               </div>

               <button 
                  onClick={() => handleDownload(r.id)}
                  disabled={generating === r.id}
                  className={`w-full h-14 rounded-2xl font-syne font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${
                    generating === r.id ? 'bg-gray-50 text-gray-400' : 'bg-navy text-brand-teal hover:scale-[1.02] active:scale-95 shadow-xl shadow-navy/20'
                  }`}
               >
                  {generating === r.id ? (
                    <div className="h-4 w-4 border-2 border-brand-teal border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Download size={16} />
                  )}
                  {generating === r.id ? 'SYNCHRONIZING...' : 'GENERATE PDF'}
               </button>
            </div>
          </div>
        ))}
      </div>

      {/* Global Export Item */}
      <div className="bg-navy rounded-[4rem] p-12 text-white relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-10">
         <div className="absolute top-0 right-0 h-96 w-96 bg-brand-teal opacity-5 rounded-full blur-[100px]" />
         <div className="space-y-3 relative z-10 text-center md:text-left">
            <h2 className="font-syne font-black text-3xl uppercase italic tracking-tighter leading-none">Full System Audit</h2>
            <p className="text-white/40 font-dm text-sm italic uppercase tracking-widest">Comprehensive data export for the entire Karaikal Mesh.</p>
         </div>
         <button className="h-16 px-12 bg-brand-teal text-navy rounded-2xl font-syne font-black text-xs uppercase tracking-widest hover:bg-white transition-all shadow-4xl relative z-10 whitespace-nowrap">
            Launch Global Export
         </button>
      </div>
    </div>
  );
}
