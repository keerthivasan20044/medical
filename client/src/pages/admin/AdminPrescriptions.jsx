import { useEffect, useMemo, useState } from 'react';
import DataTable from '../../components/dashboard/DataTable';
import { prescriptionService } from '../../services/apiServices';
import { CheckCircle, FileText, Search, ShieldAlert, Trash2, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const STATUS_OPTIONS = ['all', 'pending', 'approved', 'rejected', 'dispensed'];

export default function AdminPrescriptions() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [status, setStatus] = useState('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);

  const fetchPrescriptions = async (pageNum = 1, searchQuery = search, statusFilter = status) => {
    try {
      setLoading(true);
      const data = await prescriptionService.getAll({
        page: pageNum,
        limit: 10,
        search: searchQuery,
        status: statusFilter
      });
      setItems(data.items || []);
      setPage(data.page || 1);
      setTotalPages(data.pages || 1);
      setTotalRecords(data.total || 0);
    } catch (err) {
      toast.error('Failed to load prescriptions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => fetchPrescriptions(1, search, status), 400);
    return () => clearTimeout(timer);
  }, [search, status]);

  const statusCounts = useMemo(() => {
    return items.reduce((acc, item) => {
      acc[item.status] = (acc[item.status] || 0) + 1;
      return acc;
    }, {});
  }, [items]);

  const approve = async (row) => {
    try {
      await prescriptionService.verify(row._id);
      toast.success('Prescription approved');
      fetchPrescriptions(page);
    } catch (err) {
      toast.error('Approval failed');
    }
  };

  const reject = async (row) => {
    const reason = window.prompt('Reason for rejection');
    if (!reason) return;
    try {
      await prescriptionService.reject(row._id, reason);
      toast.success('Prescription rejected');
      fetchPrescriptions(page);
    } catch (err) {
      toast.error('Rejection failed');
    }
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this prescription record?')) return;
    try {
      await prescriptionService.delete(id);
      toast.success('Prescription deleted');
      fetchPrescriptions(page);
      setSelected(null);
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div>
          <h1 className="font-syne font-black text-4xl text-navy uppercase tracking-tight">Prescription Control</h1>
          <p className="text-xs font-dm font-bold text-navy/40 uppercase tracking-widest mt-1">Review uploads, approve requests, and handle rejected files</p>
        </div>
        <div className="grid grid-cols-3 gap-3 md:flex">
          {['pending', 'approved', 'rejected'].map((key) => (
            <div key={key} className="rounded-2xl border border-gray-100 bg-white px-5 py-3">
              <div className="text-[9px] font-black uppercase tracking-widest text-navy/30">{key}</div>
              <div className="font-syne font-black text-xl text-navy">{statusCounts[key] || 0}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        {STATUS_OPTIONS.map((option) => (
          <button
            key={option}
            onClick={() => setStatus(option)}
            className={`h-11 px-5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
              status === option ? 'bg-navy text-white shadow-lg shadow-navy/15' : 'bg-white border border-gray-100 text-navy/45 hover:text-navy'
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      <DataTable
        title="Uploaded Prescriptions"
        isLoading={loading}
        onSearch={setSearch}
        currentPage={page}
        totalPages={totalPages}
        totalRecords={totalRecords}
        onPageChange={(newPage) => fetchPrescriptions(newPage)}
        columns={[
          {
            key: 'customerId',
            label: 'Patient',
            render: (val) => (
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-navy/5 text-navy/40 flex items-center justify-center">
                  <FileText size={18} />
                </div>
                <div>
                  <div className="font-dm font-black text-navy text-sm">{val?.name || 'Unknown patient'}</div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-navy/35">{val?.phone || val?.email || 'No contact'}</div>
                </div>
              </div>
            )
          },
          { key: 'doctorName', label: 'Doctor', render: (val) => val || 'Manual upload' },
          { key: 'pharmacyId', label: 'Pharmacy', render: (val) => val?.name || 'Any pharmacy' },
          {
            key: 'status',
            label: 'Status',
            render: (val) => (
              <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                val === 'approved' ? 'bg-emerald-50 text-emerald-600' :
                val === 'rejected' ? 'bg-red-50 text-red-600' :
                val === 'dispensed' ? 'bg-blue-50 text-blue-600' :
                'bg-amber-50 text-amber-600'
              }`}>
                {val}
              </span>
            )
          },
          { key: 'createdAt', label: 'Uploaded', render: (val) => new Date(val).toLocaleDateString() }
        ]}
        data={items}
        actions
        onView={setSelected}
        onEdit={approve}
        onDelete={remove}
      />

      {selected && (
        <div className="fixed inset-0 z-[1000] bg-navy/60 backdrop-blur-md p-6 flex items-center justify-center">
          <div className="bg-white w-full max-w-4xl rounded-3xl p-8 shadow-4xl grid lg:grid-cols-[1.1fr_0.9fr] gap-8">
            <div className="rounded-2xl bg-gray-50 border border-gray-100 overflow-hidden min-h-80 flex items-center justify-center">
              {selected.imageUrl?.startsWith('data:application/pdf') || selected.imageUrl?.toLowerCase().includes('.pdf') ? (
                <a href={selected.imageUrl} target="_blank" rel="noreferrer" className="text-brand-teal font-syne font-black uppercase tracking-widest text-xs flex items-center gap-3">
                  <Search size={18} /> Open PDF
                </a>
              ) : (
                <img src={selected.imageUrl} alt="Prescription" className="max-h-[70vh] w-full object-contain" />
              )}
            </div>
            <div className="space-y-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-syne font-black text-2xl text-navy uppercase">Review Prescription</h2>
                  <p className="text-xs text-navy/45 font-bold mt-1">{selected.customerId?.name || 'Unknown patient'}</p>
                </div>
                <button onClick={() => setSelected(null)} className="h-10 w-10 rounded-xl bg-gray-50 text-navy/45 hover:text-navy">x</button>
              </div>
              <div className="space-y-3 text-sm font-dm font-bold text-navy/65">
                <p><span className="text-navy">Pharmacy:</span> {selected.pharmacyId?.name || 'Any pharmacy'}</p>
                <p><span className="text-navy">Doctor:</span> {selected.doctorName || 'Manual upload'}</p>
                <p><span className="text-navy">Notes:</span> {selected.notes || 'None'}</p>
                {selected.rejectionReason && <p className="text-red-600"><span className="text-navy">Rejected:</span> {selected.rejectionReason}</p>}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button onClick={() => approve(selected)} className="h-12 rounded-2xl bg-emerald-600 text-white font-syne font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2">
                  <CheckCircle size={16} /> Approve
                </button>
                <button onClick={() => reject(selected)} className="h-12 rounded-2xl bg-red-600 text-white font-syne font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2">
                  <XCircle size={16} /> Reject
                </button>
                <button onClick={() => remove(selected._id)} className="h-12 rounded-2xl bg-gray-100 text-navy font-syne font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2">
                  <Trash2 size={16} /> Delete
                </button>
              </div>
              <div className="rounded-2xl bg-amber-50 border border-amber-100 p-5 text-xs font-bold text-amber-700 flex gap-3">
                <ShieldAlert size={18} className="shrink-0" />
                Approvals notify the patient and allow the linked order to continue through pharmacy verification.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
