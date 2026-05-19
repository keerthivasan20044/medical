import { useState, useEffect } from 'react';
import DataTable from '../../components/dashboard/DataTable';
import { adminService } from '../../services/apiServices';
import { User, Activity, ShieldCheck, Clock, Star, Phone, MoreHorizontal, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [search, setSearch] = useState('');

  const fetchDoctors = async (pageNum = 1, searchQuery = '') => {
    try {
      setLoading(true);
      // Reusing getUsers with role doctor
      const data = await adminService.getUsers({ 
        page: pageNum, 
        limit: 10, 
        search: searchQuery,
        role: 'doctor' 
      });
      setDoctors(data.items || []);
      setPage(data.page || 1);
      setTotalPages(data.pages || 1);
      setTotalRecords(data.total || 0);
    } catch (e) {
      toast.error('Failed to sync doctor registry');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => fetchDoctors(1, search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  const handlePageChange = (newPage) => {
    fetchDoctors(newPage, search);
  };

  const toggleVerification = async (id) => {
    try {
      // Logic for verification toggle would go here
      toast.success('Doctor verification status updated');
      fetchDoctors(page, search);
    } catch (err) {
      toast.error('Verification update failed');
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="font-syne font-black text-4xl text-navy italic tracking-tighter uppercase">Doctor Registry</h1>
          <p className="text-xs font-dm font-bold text-navy/40 uppercase tracking-widest mt-1 italic">Verified Professionals across the Mesh</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="bg-white px-6 py-3 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black text-navy/60 uppercase tracking-widest italic">{totalRecords} Nodes Active</span>
           </div>
        </div>
      </div>

      <DataTable 
        title="Verified Doctors"
        isLoading={loading}
        onSearch={setSearch}
        currentPage={page}
        totalPages={totalPages}
        totalRecords={totalRecords}
        onPageChange={handlePageChange}
        columns={[
          { 
            key: 'name', 
            label: 'Practitioner',
            render: (val, row) => (
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-navy text-brand-teal rounded-xl flex items-center justify-center font-black italic">
                   {val[0]}
                </div>
                <div>
                  <div className="font-dm font-black text-navy text-sm italic">{val}</div>
                  <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest italic">{row.doctorProfile?.specialization || 'General Physician'}</div>
                </div>
              </div>
            )
          },
          { 
            key: 'doctorProfile.experience', 
            label: 'Experience',
            render: (val, row) => (
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-navy/20" />
                <span className="text-[10px] font-black text-navy uppercase tracking-widest italic">{row.doctorProfile?.experience || 0} Yrs</span>
              </div>
            )
          },
          { 
            key: 'isVerified', 
            label: 'Verification',
            render: (val) => (
              <div className={`flex items-center gap-2 px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest w-fit ${
                val ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
              }`}>
                {val ? <CheckCircle size={10} /> : <ShieldCheck size={10} />}
                {val ? 'Verified' : 'Pending'}
              </div>
            )
          },
          { 
            key: 'doctorProfile.rating', 
            label: 'Rating',
            render: (val, row) => (
              <div className="flex items-center gap-1 text-amber-500 font-syne font-black text-xs">
                <Star size={14} fill="currentColor" /> {row.doctorProfile?.rating || 0}
              </div>
            )
          },
          { 
            key: 'status', 
            label: 'Live Status',
            render: (val, row) => (
              <div className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${
                row.doctorProfile?.status === 'online' ? 'text-emerald-500' : 'text-gray-300'
              }`}>
                <div className={`h-2 w-2 rounded-full ${row.doctorProfile?.status === 'online' ? 'bg-emerald-500 animate-pulse' : 'bg-gray-200'}`} />
                {row.doctorProfile?.status || 'offline'}
              </div>
            )
          }
        ]}
        data={doctors}
        actions={true}
      />
    </div>
  );
}
