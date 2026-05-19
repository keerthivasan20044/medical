import { useState, useEffect } from 'react';
import DataTable from '../../components/dashboard/DataTable';
import { appointmentService } from '../../services/apiServices';
import { Calendar, User, Activity, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [search, setSearch] = useState('');

  const fetchAppointments = async (pageNum = 1, searchQuery = '') => {
    try {
      setLoading(true);
      const data = await appointmentService.getAll({ 
        page: pageNum, 
        limit: 10, 
        search: searchQuery 
      });
      setAppointments(data.items || []);
      setPage(data.page || 1);
      setTotalPages(data.pages || 1);
      setTotalRecords(data.total || 0);
    } catch (e) {
      toast.error('Failed to sync appointment database');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => fetchAppointments(1, search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  const handlePageChange = (newPage) => {
    fetchAppointments(newPage, search);
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="font-syne font-black text-4xl text-navy italic tracking-tighter uppercase">Clinical Appointments</h1>
          <p className="text-xs font-dm font-bold text-navy/40 uppercase tracking-widest mt-1 italic">Global Synchronization of Doctor-Patient Nodes</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="bg-white px-6 py-3 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-[10px] font-black text-navy/60 uppercase tracking-widest italic">{totalRecords} Pending Syncs</span>
           </div>
        </div>
      </div>

      <DataTable 
        title="Appointment Logs"
        isLoading={loading}
        onSearch={setSearch}
        currentPage={page}
        totalPages={totalPages}
        totalRecords={totalRecords}
        onPageChange={handlePageChange}
        columns={[
          { 
            key: 'patient', 
            label: 'Patient',
            render: (val, row) => (
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-navy/5 rounded-xl flex items-center justify-center text-navy/40 font-black italic">
                   {row.patient?.name?.[0] || 'P'}
                </div>
                <div>
                  <div className="font-dm font-black text-navy text-sm italic">{row.patient?.name || 'Unknown'}</div>
                  <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest italic">{row.patient?.phone || 'N/A'}</div>
                </div>
              </div>
            )
          },
          { 
            key: 'doctor', 
            label: 'Doctor Node',
            render: (val, row) => (
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 bg-brand-teal/10 rounded-lg flex items-center justify-center text-brand-teal">
                   <Activity size={14} />
                </div>
                <div>
                  <div className="font-dm font-black text-navy text-xs italic">{row.doctor?.name || 'Unknown'}</div>
                  <div className="text-[9px] font-bold text-navy/40 uppercase tracking-widest italic">{row.doctor?.doctorProfile?.specialization || 'General'}</div>
                </div>
              </div>
            )
          },
          { 
            key: 'date', 
            label: 'Schedule',
            render: (val, row) => (
              <div className="flex flex-col">
                <span className="text-xs font-bold text-navy">{new Date(row.date).toLocaleDateString()}</span>
                <span className="text-[9px] font-black text-navy/40 uppercase tracking-widest italic">{row.timeSlot || 'TBD'}</span>
              </div>
            )
          },
          { 
            key: 'status', 
            label: 'Protocol Status',
            render: (val) => (
              <div className={`flex items-center gap-2 px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest w-fit border ${
                val === 'confirmed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                val === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-100' : 
                'bg-red-50 text-red-600 border-red-100'
              }`}>
                {val === 'confirmed' ? <CheckCircle size={10} /> : val === 'pending' ? <Clock size={10} /> : <XCircle size={10} />}
                {val}
              </div>
            )
          },
          { 
            key: 'type', 
            label: 'Consultation',
            render: (val) => (
               <div className="text-[10px] font-black text-navy uppercase tracking-widest italic">
                  {val || 'VIDEO'}
               </div>
            )
          }
        ]}
        data={appointments}
        actions={true}
      />
    </div>
  );
}
