import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
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
    <div className="h-full flex flex-col p-2">
      <div className="flex items-center justify-between">
        <h3 className="font-syne font-black text-xl text-navy uppercase italic">Filters</h3>
        {isMobile && (
          <button
            aria-label="Close filters"
            className="h-10 w-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={18} />
          </button>
        )}
      </div>
      <div className="mt-8 space-y-8 flex-1 overflow-auto no-scrollbar">
        <div className="space-y-4">
          <div className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Category Enclave</div>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  category === cat ? 'bg-navy text-white shadow-lg' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                }`}
                onClick={() => setCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
          <div className="space-y-1">
            <div className="text-[10px] font-black text-navy uppercase tracking-widest">Live Inventory</div>
            <div className="text-[9px] text-gray-400 font-bold uppercase italic">In Stock Only</div>
          </div>
          <button
            className={`w-12 h-6 rounded-full flex items-center p-1 transition-all ${
              inStockOnly ? 'bg-teal-500' : 'bg-gray-200'
            }`}
            onClick={() => setInStockOnly((v) => !v)}
            type="button"
            aria-pressed={inStockOnly}
          >
            <span className={`h-4 w-4 bg-white rounded-full shadow-sm transition-transform ${inStockOnly ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
        </div>
      </div>
      <button
        className="mt-8 w-full h-14 rounded-xl bg-navy text-teal-400 font-syne font-black text-[10px] uppercase tracking-widest shadow-xl active:scale-95 transition-all italic"
        onClick={() => setSidebarOpen(false)}
        type="button"
      >
        Apply Selection
      </button>
    </div>
  );

  return (
    <div className="bg-white">
      <section className="bg-teal-50">
        <div className="mx-auto max-w-7xl px-4 md:px-6 py-6 md:py-10">
          <div className="text-center space-y-2">
            <h1 className="font-syne font-black text-3xl md:text-5xl text-navy uppercase italic">Search</h1>
            <p className="text-gray-400 font-dm italic text-sm md:text-base">Find medicines, pharmacies, and doctors.</p>
          </div>
          <div className="mt-6 flex items-center justify-center">
            <div className="w-full max-w-2xl flex items-center gap-3 bg-white border border-gray-100 rounded-2xl md:rounded-full px-4 py-2 md:py-3 shadow-sm focus-within:shadow-xl transition-all">
              <SearchIcon size={18} className="text-gray-300 shrink-0" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-transparent outline-none text-sm md:text-base font-dm italic"
                placeholder="Medicine, pharmacy, or doctor..."
                aria-label="Search"
              />
              <button
                aria-label="Open filters"
                className="h-10 w-10 md:h-12 md:w-12 rounded-xl md:rounded-full border border-gray-100 flex items-center justify-center text-teal-600 hover:bg-navy hover:text-white transition-all shrink-0"
                onClick={() => setSidebarOpen(true)}
                type="button"
              >
                <SlidersHorizontal size={18} />
              </button>
            </div>
          </div>
          <div className="mt-6 flex items-center justify-center gap-2 flex-wrap">
            {TABS.map((tab) => (
              <button
                key={tab}
                className={`px-5 py-2 rounded-xl md:rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest transition-all ${
                  activeTab === tab ? 'bg-navy text-white shadow-lg' : 'bg-white border border-gray-100 text-gray-400 hover:border-teal-500'
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
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="font-syne font-black text-2xl text-navy uppercase italic">Pharmacies</h2>
                  <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">{filteredPharmacies.length} results</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  {filteredPharmacies.map((p) => (
                    <div key={p._id || p.id} className="bg-white border border-gray-100 rounded-2xl md:rounded-[2.5rem] p-5 md:p-8 shadow-sm hover:shadow-xl transition-all duration-500">
                      <div className="flex items-center gap-4 md:gap-6">
                        <div className="h-12 w-12 md:h-16 md:w-16 rounded-xl md:rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                          <Building2 size={20} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-syne font-black text-base md:text-lg text-navy uppercase italic truncate">{p.name}</div>
                          <div className="text-[9px] md:text-[10px] text-gray-400 font-bold italic mt-1 uppercase tracking-widest truncate">{p.address?.city || 'Karaikal'}</div>
                        </div>
                      </div>
                      <div className="mt-4 md:mt-6 flex items-center gap-2 text-[9px] md:text-[10px] font-black text-teal-600 uppercase tracking-widest italic">
                        <CheckCircle size={14} className="text-emerald-500" /> {p.isVerified ? 'VERIFIED NODE' : 'STANDARD NODE'} 
                      </div>
                      <Link to={`/pharmacies/${p._id || p.id}`}>
                        <button className="mt-6 md:mt-8 w-full h-11 md:h-12 rounded-xl bg-navy text-teal-400 font-syne font-bold text-[10px] uppercase tracking-widest hover:bg-teal-500 hover:text-white transition-all italic">VIEW_NODE</button>
                      </Link>
                    </div>
                  ))}
                  {filteredPharmacies.length === 0 && (
                    <div className="text-sm text-gray-400 italic">No pharmacies found.</div>
                  )}
                </div>
              </div>
            )}

            {(activeTab === 'All' || activeTab === 'Doctors') && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="font-syne font-black text-2xl text-navy uppercase italic">Doctors</h2>
                  <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">{filteredDoctors.length} results</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  {filteredDoctors.map((d) => (
                    <div key={d._id || d.id} className="bg-white border border-gray-100 rounded-2xl md:rounded-[2.5rem] p-5 md:p-8 shadow-sm hover:shadow-xl transition-all duration-500">
                      <div className="flex items-center gap-4 md:gap-6">
                         <div className="h-16 w-14 md:h-20 md:w-16 bg-gray-50 rounded-xl overflow-hidden border border-gray-100 flex items-center justify-center shrink-0">
                            {d.avatar?.url ? (
                               <img src={d.avatar.url} alt={d.name} className="h-full w-full object-cover" />
                            ) : (
                               <Stethoscope size={24} className="text-teal-600 opacity-20" />
                            )}
                         </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-syne font-black text-base md:text-lg text-navy uppercase italic truncate">{d.name}</div>
                          <div className="text-[9px] md:text-[10px] text-teal-600 font-bold italic mt-1 uppercase tracking-widest truncate">{d.doctorProfile?.specialization || 'General Physician'}</div>
                        </div>
                      </div>
                      <div className="mt-4 md:mt-6 flex items-center gap-2 text-[9px] md:text-[10px] font-black text-gray-300 uppercase tracking-widest italic">
                        <MapPin size={12} /> {d.address?.city || 'Karaikal'} SYNCED
                      </div>
                      <Link to={`/doctors/${d._id || d.id}`}>
                        <button className="mt-6 md:mt-8 w-full h-11 md:h-12 rounded-xl bg-navy text-white font-syne font-bold text-[10px] uppercase tracking-widest hover:bg-teal-500 transition-all italic">CONSULT_NODE</button>
                      </Link>
                    </div>
                  ))}
                  {filteredDoctors.length === 0 && (
                    <div className="text-sm text-gray-400 italic">No doctors found.</div>
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
