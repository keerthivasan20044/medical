import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  Download,
  FileText,
  ShieldAlert,
  Store,
  Trash2
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { prescriptionService } from '../../services/apiServices';

const formatDate = (value) => {
  if (!value) return 'Not available';
  return new Date(value).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const statusClasses = {
  approved: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  verified: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  pending: 'bg-amber-50 text-amber-700 border-amber-100',
  rejected: 'bg-red-50 text-red-700 border-red-100',
  dispensed: 'bg-blue-50 text-blue-700 border-blue-100'
};

export default function PrescriptionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [prescription, setPrescription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let mounted = true;
    const loadPrescription = async () => {
      try {
        setLoading(true);
        const data = await prescriptionService.getById(id);
        if (mounted) setPrescription(data.item);
      } catch (err) {
        toast.error(err.response?.data?.message || 'Prescription not found');
        navigate('/prescriptions', { replace: true });
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadPrescription();
    return () => {
      mounted = false;
    };
  }, [id, navigate]);

  const isPdf = useMemo(() => {
    const url = prescription?.imageUrl || '';
    return url.startsWith('data:application/pdf') || url.toLowerCase().includes('.pdf');
  }, [prescription]);

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await prescriptionService.delete(id);
      toast.success('Prescription deleted');
      navigate('/prescriptions', { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Unable to delete prescription');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-10 md:px-10">
        <div className="mx-auto max-w-5xl rounded-3xl bg-white p-10 text-center shadow-sm">
          <Clock className="mx-auto animate-spin text-teal-600" size={36} />
          <p className="mt-4 text-sm font-bold text-slate-400">Loading prescription...</p>
        </div>
      </div>
    );
  }

  if (!prescription) return null;

  const status = prescription.status || 'pending';
  const medicines = prescription.medicines || [];

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 pb-28 md:px-10 md:py-10 md:pb-16">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <button
            onClick={() => navigate('/prescriptions')}
            className="flex w-fit items-center gap-3 rounded-xl bg-white px-4 py-3 text-sm font-black text-slate-700 shadow-sm hover:text-teal-600"
          >
            <ArrowLeft size={18} /> Back to Prescriptions
          </button>

          <div className="flex flex-wrap gap-2">
            <a
              href={prescription.imageUrl}
              download
              className="flex h-11 items-center gap-2 rounded-xl bg-slate-900 px-4 text-xs font-black uppercase tracking-widest text-white"
            >
              <Download size={16} /> Download
            </a>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex h-11 items-center gap-2 rounded-xl bg-red-50 px-4 text-xs font-black uppercase tracking-widest text-red-600 disabled:opacity-50"
            >
              <Trash2 size={16} /> {deleting ? 'Deleting' : 'Delete'}
            </button>
          </div>
        </div>

        <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
            <div className="border-b border-slate-100 p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h1 className="font-syne text-2xl font-black uppercase text-slate-900 md:text-3xl">
                    Prescription Detail
                  </h1>
                  <p className="mt-1 text-sm text-slate-400">Uploaded {formatDate(prescription.createdAt)}</p>
                </div>
                <div className={`rounded-full border px-4 py-2 text-xs font-black uppercase tracking-widest ${statusClasses[status] || statusClasses.pending}`}>
                  {status}
                </div>
              </div>
            </div>

            <div className="bg-slate-100 p-4 md:p-6">
              <div className="flex min-h-[420px] items-center justify-center overflow-hidden rounded-2xl bg-white">
                {isPdf ? (
                  <div className="flex flex-col items-center gap-4 text-center text-slate-600">
                    <FileText className="text-teal-600" size={72} />
                    <div>
                      <div className="font-syne text-xl font-black uppercase text-slate-900">PDF Prescription</div>
                      <a href={prescription.imageUrl} target="_blank" rel="noreferrer" className="mt-2 inline-block text-sm font-bold text-teal-600">
                        Open PDF preview
                      </a>
                    </div>
                  </div>
                ) : (
                  <img src={prescription.imageUrl} alt="Prescription" className="max-h-[720px] w-full object-contain" />
                )}
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                {status === 'approved' || status === 'dispensed' ? (
                  <CheckCircle className="text-emerald-600" size={24} />
                ) : status === 'rejected' ? (
                  <ShieldAlert className="text-red-600" size={24} />
                ) : (
                  <Clock className="text-amber-600" size={24} />
                )}
                <div>
                  <h2 className="font-syne font-black uppercase text-slate-900">Verification</h2>
                  <p className="text-sm text-slate-400">
                    {status === 'pending' ? 'Waiting for pharmacist review.' : `Current status: ${status}.`}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
              <h2 className="font-syne font-black uppercase text-slate-900">Metadata</h2>
              <div className="mt-5 space-y-4 text-sm">
                <div className="flex justify-between gap-4 border-b border-slate-100 pb-3">
                  <span className="text-slate-400">Doctor</span>
                  <span className="max-w-[60%] text-right font-bold text-slate-800">{prescription.doctorName || prescription.doctor?.name || 'Not provided'}</span>
                </div>
                <div className="flex justify-between gap-4 border-b border-slate-100 pb-3">
                  <span className="text-slate-400">Pharmacy</span>
                  <span className="max-w-[60%] text-right font-bold text-slate-800">{prescription.pharmacyId?.name || 'Any verified pharmacy'}</span>
                </div>
                <div className="flex justify-between gap-4 border-b border-slate-100 pb-3">
                  <span className="text-slate-400">Updated</span>
                  <span className="max-w-[60%] text-right font-bold text-slate-800">{formatDate(prescription.updatedAt)}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-slate-400">Record ID</span>
                  <span className="max-w-[60%] break-all text-right font-bold text-slate-800">{prescription._id}</span>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
              <h2 className="font-syne font-black uppercase text-slate-900">Medicines</h2>
              {medicines.length > 0 ? (
                <div className="mt-4 space-y-3">
                  {medicines.map((medicine, index) => (
                    <div key={`${medicine.name}-${index}`} className="rounded-2xl bg-slate-50 p-4">
                      <div className="font-bold text-slate-900">{medicine.name || 'Medicine'}</div>
                      <div className="mt-1 text-xs text-slate-400">
                        {[medicine.dosage, medicine.frequency, medicine.duration].filter(Boolean).join(' | ') || 'Dosage not provided'}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-3 text-sm text-slate-400">No medicines were entered with this upload.</p>
              )}
            </div>

            {prescription.pharmacyId?.name && (
              <Link to="/pharmacies" className="flex items-center justify-between rounded-3xl bg-slate-900 p-5 text-white">
                <div className="flex items-center gap-3">
                  <Store className="text-teal-400" size={22} />
                  <span className="font-syne text-sm font-black uppercase">View Pharmacies</span>
                </div>
                <ArrowLeft className="rotate-180" size={18} />
              </Link>
            )}
          </aside>
        </section>
      </div>
    </div>
  );
}
