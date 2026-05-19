import { useState } from 'react';
import DataTable from '../../components/dashboard/DataTable';
import { Activity, Clock, Shield, User, Globe, AlertCircle } from 'lucide-react';

export default function AdminLogs() {
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState([
    { id: '1', event: 'New Doctor Verification', user: 'Admin User', timestamp: '2024-05-11 10:45:22', severity: 'Info', module: 'Personnel' },
    { id: '2', event: 'Global Stock Update', user: 'System Task', timestamp: '2024-05-11 10:30:00', severity: 'Info', module: 'Inventory' },
    { id: '3', event: 'Failed Login Attempt', user: 'Unknown IP: 192.168.1.1', timestamp: '2024-05-11 09:12:45', severity: 'Warning', module: 'Security' },
    { id: '4', event: 'Medicine Record Deleted', user: 'Admin User', timestamp: '2024-05-11 08:45:10', severity: 'Critical', module: 'Catalog' },
    { id: '5', event: 'Payment Node Sync', user: 'System Task', timestamp: '2024-05-11 08:00:00', severity: 'Info', module: 'Payments' },
  ]);

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="font-syne font-black text-4xl text-navy italic tracking-tighter uppercase">Audit Logs</h1>
          <p className="text-xs font-dm font-bold text-navy/40 uppercase tracking-widest mt-1 italic">Real-time Platform Activity Stream</p>
        </div>
        <div className="bg-white px-6 py-3 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3 text-navy/60">
           <Globe size={18} className="text-brand-teal" />
           <span className="text-[10px] font-black uppercase tracking-widest italic">Live Security Feed</span>
        </div>
      </div>

      <DataTable 
        title="System Events"
        isLoading={loading}
        columns={[
          { 
            key: 'event', 
            label: 'Event Identity',
            render: (val, row) => (
              <div className="flex items-center gap-3">
                <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                  row.severity === 'Critical' ? 'bg-red-50 text-red-500' : 
                  row.severity === 'Warning' ? 'bg-amber-50 text-amber-500' : 
                  'bg-navy/5 text-navy/40'
                }`}>
                   {row.severity === 'Critical' ? <Shield size={16} /> : <Activity size={16} />}
                </div>
                <div className="font-dm font-black text-navy text-sm italic">{val}</div>
              </div>
            )
          },
          { 
            key: 'user', 
            label: 'Actor',
            render: (val) => (
              <div className="flex items-center gap-2">
                <User size={12} className="text-navy/20" />
                <span className="text-[10px] font-black text-navy/60 uppercase tracking-widest italic">{val}</span>
              </div>
            )
          },
          { 
            key: 'module', 
            label: 'System Node',
            render: (val) => (
               <div className="px-3 py-1 bg-gray-50 rounded-lg text-[9px] font-black text-navy/40 uppercase tracking-[0.2em] w-fit">
                  {val}
               </div>
            )
          },
          { 
            key: 'timestamp', 
            label: 'Temporal Sync',
            render: (val) => (
              <div className="flex items-center gap-2 text-navy/30">
                <Clock size={12} />
                <span className="text-[10px] font-bold uppercase tracking-widest">{val}</span>
              </div>
            )
          },
          { 
            key: 'severity', 
            label: 'Severity',
            render: (val) => (
              <div className={`flex items-center gap-2 px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest w-fit ${
                val === 'Critical' ? 'bg-red-500 text-white shadow-lg' : 
                val === 'Warning' ? 'bg-amber-100 text-amber-700' : 
                'bg-emerald-50 text-emerald-600'
              }`}>
                {val}
              </div>
            )
          }
        ]}
        data={logs}
        actions={true}
      />
    </div>
  );
}
