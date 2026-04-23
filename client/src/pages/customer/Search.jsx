import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  AlertCircle,
  Building2,
  CheckCircle,
  MapPin,
  Search as SearchIcon,
  SlidersHorizontal,
  X,
  Stethoscope
} from 'lucide-react';
import { fetchMedicines } from '../../store/medicinesSlice.js';
import { pharmacyService, doctorService } from '../../services/apiServices.js';
import MedicineCard from '../../components/medicine/MedicineCard';
import { SkeletonBox } from '../../components/common/Skeleton';

const TABS = ['All', 'Medicines', 'Pharmacies', 'Doctors'];

export default function Search() {
  const dispatch = useDispatch();
  const { items: medicines, status: medStatus, error: medError } = useSelector((s) => s.medicines);
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [category, setCategory] = useState('All');
  const [inStockOnly, setInStockOnly] = useState(false);

  const [pharmacies, setPharmacies] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loadingExtras, setLoadingExtras] = useState(false);

  useEffect(() => {
    if (medStatus === 'idle') dispatch(fetchMedicines());
    
    const fetchExtras = async () => {
      setLoadingExtras(true);
      try {
        const [pData, dData] = await Promise.all([
          pharmacyService.getAll(),
          doctorService.getAll()
        ]);
        setPharmacies(pData.items || pData || []);
        setDoctors(dData.items || dData.users || dData || []);
      } catch (err) {
        console.error('Failed to fetch extras:', err);
      } finally {
        setLoadingExtras(false);
      }
    };
    fetchExtras();
  }, [medStatus, dispatch]);

  const categories = useMemo(() => {
    const set = new Set(medicines.map((m) => m.category || m.type || 'Other'));
    return ['All', ...Array.from(set)];
  }, [medicines]);

  const filteredMeds = useMemo(() => {
    return medicines.filter((m) => {
      const hay = `${m.name || ''} ${m.brand || ''} ${m.generic || ''}`.toLowerCase();
      if (query && !hay.includes(query.toLowerCase())) return false;
      if (category !== 'All' && (m.category || m.type) !== category) return false;
      const stock = m.stock || m.stockStatus || (m.inStock ? 'available' : 'out');
      if (inStockOnly && stock === 'out') return false;
      return true;
    });
  }, [medicines, query, category, inStockOnly]);

  const filteredPharmacies = useMemo(() => {
    return pharmacies.filter((p) => {
      if (!query) return true;
      return p.name.toLowerCase().includes(query.toLowerCase());
    });
  }, [pharmacies, query]);

  const filteredDoctors = useMemo(() => {
    return doctors.filter((d) => {
      if (!query) return true;
      return `${d.name} ${d.doctorProfile?.specialization || ''}`.toLowerCase().includes(query.toLowerCase());
    });
  }, [doctors, query]);

  const renderFilterPanel = (isMobile) => (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-lg text-brand-navy">Filters</h3>
        {isMobile && (
          <button
            aria-label="Close filters"
            className="h-8 w-8 rounded-full border border-brand-border flex items-center justify-center"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={16} />
          </button>
        )}
      </div>
      <div className="mt-6 space-y-6 flex-1 overflow-auto no-scrollbar pr-1">
        <div>
          <div className="text-sm font-heading text-brand-navy">Category</div>
          <div className="mt-3 flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`px-3 py-1.5 rounded-full text-xs border ${
                  category === cat ? 'bg-brand-teal text-white border-brand-teal' : 'border-brand-border text-brand-muted'
                }`}
                onClick={() => setCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-heading text-brand-navy">Availability</div>
            <div className="text-xs text-brand-muted">In Stock Only</div>
          </div>
          <button
            className={`w-12 h-6 rounded-full flex items-center p-1 transition ${
              inStockOnly ? 'bg-brand-teal' : 'bg-brand-border'
            }`}
            onClick={() => setInStockOnly((v) => !v)}
            type="button"
            aria-pressed={inStockOnly}
          >
            <span className={`h-4 w-4 bg-white rounded-full transition ${inStockOnly ? 'translate-x-6' : ''}`} />
          </button>
        </div>
      </div>
      <button
        className="mt-6 w-full rounded-2xl bg-gradient-to-r from-brand-mint to-brand-teal text-brand-navy font-semibold py-3 btn-hover"
        onClick={() => setSidebarOpen(false)}
        type="button"
      >
        Apply Filters
      </button>
    </div>
  );

  return (
    <div className="bg-white">
      <section className="bg-teal-50">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <div className="text-center">
            <h1 className="font-heading text-3xl text-brand-navy">Search</h1>
            <p className="text-brand-muted mt-2">Find medicines, pharmacies, and doctors in one place.</p>
          </div>
          <div className="mt-6 flex items-center justify-center">
            <div className="w-full max-w-2xl flex items-center gap-3 bg-white border border-brand-border rounded-full px-4 py-2 shadow-sm">
              <SearchIcon size={16} className="text-brand-muted" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-transparent outline-none text-sm"
                placeholder="Search medicine, pharmacy, or doctor"
                aria-label="Search"
              />
              <button
                aria-label="Open filters"
                className="h-9 w-9 rounded-full border border-brand-border flex items-center justify-center text-brand-teal btn-hover"
                onClick={() => setSidebarOpen(true)}
                type="button"
              >
                <SlidersHorizontal size={16} />
              </button>
            </div>
          </div>
          <div className="mt-6 flex items-center justify-center gap-3 flex-wrap">
            {TABS.map((tab) => (
              <button
                key={tab}
                className={`px-4 py-2 rounded-full text-xs border ${
                  activeTab === tab ? 'bg-brand-teal text-white border-brand-teal' : 'border-brand-border text-brand-muted'
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid lg:grid-cols-[260px_1fr] gap-6">
          <aside className="hidden lg:block border border-brand-border rounded-3xl p-5 bg-white shadow-sm h-fit sticky top-24">
            {renderFilterPanel(false)}
          </aside>

          <div className="space-y-10">
            {(activeTab === 'All' || activeTab === 'Medicines') && (
              <div>
                <div className="flex items-center justify-between">
                  <h2 className="font-heading text-xl text-brand-navy">Medicines</h2>
                  <span className="text-sm text-brand-muted">{filteredMeds.length} results</span>
                </div>
                {medStatus === 'loading' && (
                  <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {Array.from({ length: 6 }).map((_, idx) => (
                      <div key={idx} className="bg-white border border-brand-border rounded-2xl p-4">
                        <SkeletonBox className="h-36 rounded-2xl" />
                        <SkeletonBox className="mt-4 h-3 w-3/4 rounded-full" />
                        <SkeletonBox className="mt-2 h-3 w-1/2 rounded-full" />
                        <SkeletonBox className="mt-4 h-8 rounded-xl" />
                      </div>
                    ))}
                  </div>
                )}
                {medStatus === 'failed' && (
                  <div className="mt-4 text-sm text-red-500 flex items-center gap-2">
                    <AlertCircle size={16} /> {medError || 'Failed to load medicines.'}
                  </div>
                )}
                {medStatus !== 'loading' && medStatus !== 'failed' && (
                  <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filteredMeds.map((m) => (
                      <MedicineCard key={m.id} item={m} onAdd={() => {}} onView={() => {}} />
                    ))}
                    {filteredMeds.length === 0 && (
                      <div className="sm:col-span-2 lg:col-span-3 text-sm text-brand-muted">No medicines found.</div>
                    )}
                  </div>
                )}
              </div>
            )}

            {(activeTab === 'All' || activeTab === 'Pharmacies') && (
              <div>
                <div className="flex items-center justify-between">
                  <h2 className="font-heading text-xl text-brand-navy">Pharmacies</h2>
                  <span className="text-sm text-brand-muted">{filteredPharmacies.length} results</span>
                </div>
                <div className="mt-4 grid sm:grid-cols-2 gap-5">
                  {filteredPharmacies.map((p) => (
                    <div key={p._id || p.id} className="bg-white border border-black/[0.03] rounded-[2.5rem] p-8 shadow-soft hover:shadow-4xl transition-all duration-700">
                      <div className="flex items-center gap-6">
                        <div className="h-16 w-16 rounded-2xl bg-brand-teal/10 text-brand-teal flex items-center justify-center shrink-0 border border-brand-teal/5">
                          <Building2 size={24} />
                        </div>
                        <div className="flex-1">
                          <div className="font-syne font-black text-lg text-[#0a1628] uppercase italic leading-none">{p.name}</div>
                          <div className="text-[10px] text-gray-400 font-bold italic mt-2 uppercase tracking-widest">{p.address?.city || 'Karaikal'}</div>
                        </div>
                      </div>
                      <div className="mt-6 flex items-center gap-2 text-[10px] font-black text-brand-teal uppercase tracking-widest italic">
                        <CheckCircle size={14} className="text-emerald-500" /> {p.isVerified ? 'VERIFIED NODE' : 'STANDARD NODE'} 
                      </div>
                      <Link to={`/pharmacies/${p._id || p.id}`}>
                        <button className="mt-8 w-full h-12 rounded-xl bg-[#0a1628] text-brand-teal font-syne font-bold text-[10px] uppercase tracking-widest hover:bg-brand-teal hover:text-white transition-all italic">VIEW_NODE</button>
                      </Link>
                    </div>
                  ))}
                  {filteredPharmacies.length === 0 && (
                    <div className="sm:col-span-2 text-sm text-brand-muted">No pharmacies found.</div>
                  )}
                </div>
              </div>
            )}

            {(activeTab === 'All' || activeTab === 'Doctors') && (
              <div>
                <div className="flex items-center justify-between">
                  <h2 className="font-heading text-xl text-brand-navy">Doctors</h2>
                  <span className="text-sm text-brand-muted">{filteredDoctors.length} results</span>
                </div>
                <div className="mt-4 grid sm:grid-cols-2 gap-5">
                  {filteredDoctors.map((d) => (
                    <div key={d._id || d.id} className="bg-white border border-black/[0.03] rounded-[2.5rem] p-8 shadow-soft hover:shadow-4xl transition-all duration-700">
                      <div className="flex items-center gap-6">
                         <div className="h-20 w-16 bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 flex items-center justify-center">
                            {d.avatar?.url ? (
                               <img src={d.avatar.url} alt={d.name} className="h-full w-full object-cover" />
                            ) : (
                               <Stethoscope size={32} className="text-brand-teal opacity-20" />
                            )}
                         </div>
                        <div className="flex-1">
                          <div className="font-syne font-black text-lg text-[#0a1628] uppercase italic leading-none">{d.name}</div>
                          <div className="text-[10px] text-brand-teal font-bold italic mt-2 uppercase tracking-widest">{d.doctorProfile?.specialization || 'General Physician'}</div>
                        </div>
                      </div>
                      <div className="mt-6 flex items-center gap-2 text-[10px] font-black text-gray-300 uppercase tracking-widest italic">
                        <MapPin size={14} /> {d.address?.city || 'Karaikal'} SYNCED
                      </div>
                      <Link to={`/doctors/${d._id || d.id}`}>
                        <button className="mt-8 w-full h-12 rounded-xl bg-[#0a1628] text-white font-syne font-bold text-[10px] uppercase tracking-widest hover:bg-brand-teal transition-all italic">CONSULT_NODE</button>
                      </Link>
                    </div>
                  ))}
                  {filteredDoctors.length === 0 && (
                    <div className="sm:col-span-2 text-sm text-brand-muted">No doctors found.</div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={`lg:hidden fixed inset-0 z-50 transition ${sidebarOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        <div className={`absolute inset-0 bg-black/30 ${sidebarOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setSidebarOpen(false)} />
        <div
          className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-5 border-t border-brand-border transition-transform ${
            sidebarOpen ? 'translate-y-0' : 'translate-y-full'
          }`}
        >
          {renderFilterPanel(true)}
        </div>
      </div>
    </div>
  );
}
