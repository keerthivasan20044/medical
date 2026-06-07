import { useState } from 'react';
import DataTable from '../../components/dashboard/DataTable';
import { ShieldCheck, FileText, CheckCircle, XCircle, Clock, Search, Filter } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminCompliance() {
  const [loading, setLoading] = useState(false);
  const [records, setRecords] = useState([
    { id: '1', entity: 'Dr. Sarah Wilson', type: 'Medical License', date: '2024-05-10', status: 'Pending Review' },
    { id: '2', entity: 'City Care Pharmacy', type: 'Trade License', date: '2024-05-09', status: 'Verified' },
    { id: '3', entity: 'Dr. John Doe', type: 'Specialization Certificate', date: '2024-05-08', status: 'Rejected' },
    { id: '4', entity: 'MediLife Pharma', type: 'GST Registration', date: '2024-05-07', status: 'Verified' },
  ]);

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="font-syne font-black text-4xl text-navy italic tracking-tighter uppercase">Compliance Hub</h1>
          <p className="text-xs font-dm font-bold text-navy/40 uppercase tracking-widest mt-1 italic">Verify Entity Credentials & Legal Documents</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="bg-white px-6 py-3 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
              <ShieldCheck className="text-brand-teal" size={20} />
              <span className="text-[10px] font-black text-navy/60 uppercase tracking-widest italic">8 Items Need Review</span>
           </div>
        </div>
      </div>

      <DataTable 
        title="Verification Queue"
        isLoading={loading}
        columns={[
          { 
            key: 'entity', 
            label: 'Entity / Professional',
            render: (val) => (
              <div className="font-dm font-black text-navy text-sm italic">{val}</div>
            )
          },
          { 
            key: 'type', 
            label: 'Document Service',
            render: (val) => (
              <div className="flex items-center gap-2 text-[10px] font-black text-navy/40 uppercase tracking-widest italic">
                <FileText size={14} className="text-brand-teal" />
                {val}
              </div>
            )
          },
          { 
            key: 'date', 
            label: 'Submission',
            render: (val) => (
              <span className="text-[10px] font-bold text-navy/40 uppercase tracking-widest">{val}</span>
            )
          },
          { 
            key: 'status', 
            label: 'Verdict',
            render: (val) => (
              <div className={`flex items-center gap-2 px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest w-fit border ${
                val === 'Verified' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                val === 'Pending Review' ? 'bg-amber-50 text-amber-600 border-amber-100' : 
                'bg-red-50 text-red-600 border-red-100'
              }`}>
                {val === 'Verified' ? <CheckCircle size={10} /> : val === 'Pending Review' ? <Clock size={10} /> : <XCircle size={10} />}
                {val}
              </div>
            )
          }
        ]}
        data={records}
        actions={true}
      />

      {/* Compliance Stats */}
      <div className="grid md:grid-cols-3 gap-8">
         <div className="bg-navy p-8 rounded-[2.5rem] text-white space-y-4">
            <div className="text-[10px] font-black text-brand-teal uppercase tracking-widest italic">Legal Verification</div>
            <div className="text-4xl font-syne font-black italic">94.2%</div>
            <div className="text-[9px] font-bold text-white/40 uppercase tracking-widest italic">Across all accounts</div>
         </div>
         <div className="bg-white border border-gray-100 p-8 rounded-[2.5rem] space-y-4">
            <div className="text-[10px] font-black text-brand-teal uppercase tracking-widest italic">Pending Audits</div>
            <div className="text-4xl font-syne font-black italic text-navy">12</div>
            <div className="text-[9px] font-bold text-navy/20 uppercase tracking-widest italic">Awaiting administrative verdict</div>
         </div>
         <div className="bg-brand-teal p-8 rounded-[2.5rem] text-navy space-y-4">
            <div className="text-[10px] font-black text-navy/40 uppercase tracking-widest italic">System Integrity</div>
            <div className="text-4xl font-syne font-black italic">Optimal</div>
            <div className="text-[9px] font-bold text-navy/40 uppercase tracking-widest italic">Security version 4.2</div>
         </div>
      </div>
    </div>
  );
}
