import { useState, useEffect } from 'react';
import DataTable from '../../components/dashboard/DataTable';
import { prescriptionService } from '../../services/apiServices';
import { FileText, Eye, CheckCircle, XCircle, Clock, AlertCircle, Plus, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PharmacistPrescriptions() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const data = await prescriptionService.getPharmacyQueue();
        setPrescriptions(data.items || []);
      } catch (err) {
        console.error('Failed to fetch prescriptions:', err);
        toast.error('Failed to load prescription queue');
      } finally {
        setLoading(false);
      }
    };
    fetchPrescriptions();
  }, []);

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="animate-spin text-brand-teal" size={48} />
        <p className="text-xs font-dm font-black text-navy/20 uppercase tracking-widest italic">Synchronizing Prescription Registry...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="font-syne font-black text-4xl text-navy italic tracking-tighter uppercase">Prescription Vault</h1>
          <p className="text-xs font-dm font-bold text-navy/40 uppercase tracking-widest mt-1 italic">Authorized Verification Node</p>
        </div>
      </div>

      <DataTable 
        title="Verification Backlog"
        columns={[
          { 
            key: '_id', 
            label: 'Manifest ID',
            render: (val) => (
              <span className="font-syne font-black text-xs text-brand-teal italic">{val.slice(-6).toUpperCase()}</span>
            )
          },
          { 
            key: 'userId', 
            label: 'Originator',
            render: (val) => (
              <div className="font-dm font-bold text-navy text-sm italic">{val?.name || 'Customer'}</div>
            )
          },
          { 
            key: 'createdAt', 
            label: 'Timestamp',
            render: (val) => (
              <span className="text-[10px] font-bold text-navy/40 uppercase tracking-widest">{new Date(val).toLocaleString()}</span>
            )
          },
          { 
            key: 'status', 
            label: 'Verification Phase',
            render: (val) => (
              <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest w-fit border flex items-center gap-2 ${
                val === 'verified' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                val === 'processing' ? 'bg-blue-50 text-blue-600 border-blue-100' : 
                'bg-amber-50 text-amber-600 border-amber-100 animate-pulse'
              }`}>
                {val === 'pending' && <AlertCircle size={12} />}
                {val === 'processing' && <Clock size={12} />}
                {val === 'verified' && <CheckCircle size={12} />}
                {val}
              </div>
            )
          },
          { 
            key: 'actions', 
            label: 'Decision Node',
            render: (_, row) => (
              <div className="flex items-center gap-2">
                 <a 
                   href={row.imageUrl} target="_blank" rel="noreferrer"
                   className="h-9 px-4 bg-navy text-white rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2 hover:scale-105 transition-all"
                 >
                    <Eye size={14} /> View
                 </a>
                 {row.status === 'pending' && (
                    <button className="h-9 px-4 bg-brand-teal text-navy rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2 hover:scale-105 transition-all">
                       <Plus size={14} /> Create Order
                    </button>
                 )}
              </div>
            )
          }
        ]}
        data={prescriptions}
        pagination={false}
      />
      
      {/* Policy Reminder */}
      <div className="bg-navy p-10 rounded-[3rem] text-white relative overflow-hidden flex flex-col md:flex-row items-center gap-8 shadow-2xl">
         <div className="absolute top-0 right-0 h-40 w-40 bg-brand-teal/20 rounded-full blur-[80px]" />
         <div className="h-20 w-20 bg-white/10 rounded-3xl flex items-center justify-center shrink-0">
            <FileText size={32} className="text-brand-teal" />
         </div>
         <div>
            <h3 className="font-syne font-black text-xl uppercase italic">Compliance Protocol 4.2</h3>
            <p className="text-sm font-dm font-medium text-white/60 mt-2 max-w-2xl">
               All prescriptions must be verified against regional health standards. Ensure physician registration numbers are visible and the issue date is within the legal 30-day window for scheduled H-class medicines.
            </p>
         </div>
         <button className="h-14 px-8 bg-brand-teal text-navy rounded-2xl font-syne font-black text-xs uppercase tracking-widest hover:scale-105 transition-all md:ml-auto shrink-0 relative z-10">
            Read Policy
         </button>
      </div>
    </div>
  );
}
