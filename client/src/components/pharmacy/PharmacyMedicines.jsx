import { useState, useEffect } from 'react';
import { Search, ShoppingCart, Filter, Box, AlertCircle, Plus, Minus, Info } from 'lucide-react';
import api from '../../services/api';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../store/cartSlice';
import toast from 'react-hot-toast';

export default function PharmacyMedicines({ pharmacyId }) {
  const dispatch = useDispatch();
  const { items: cartItems } = useSelector(state => state.cart);
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  const CATEGORIES = ['All', 'Fever', 'Pain', 'Antibiotics', 'Vitamins', 'Skin'];

  const fetchMedicines = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/api/pharmacies/${pharmacyId}/medicines`, { 
        params: { search, category: category === 'All' ? '' : category } 
      });
      setMedicines(res.data);
    } catch (err) {
      toast.error('Failed to load inventory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, [search, category]);

  const handleAddToCart = (med) => {
    // Check if cart has items from another pharmacy
    if (cartItems.length > 0 && cartItems[0].pharmacyId !== pharmacyId) {
      toast.error('Cannot mix items from different nodes. Clear cart first.', {
        icon: '⚠️',
        duration: 4000
      });
      return;
    }

    dispatch(addToCart({
      ...med,
      pharmacyId,
      quantity: 1
    }));
    toast.success(`${med.name} added to payload`);
  };

  return (
    <div className="space-y-12">
      {/* Search & Category Filter */}
      <div className="flex flex-col md:flex-row gap-6 items-center">
         <div className="relative flex-1 group">
            <div className="absolute inset-y-0 left-6 flex items-center text-navy/20 group-focus-within:text-brand-teal transition-colors">
               <Search size={24} />
            </div>
            <input 
              type="text" 
              placeholder="Search local inventory..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-16 bg-gray-50 border border-gray-100 rounded-[2rem] pl-16 pr-8 font-dm font-bold text-navy outline-none focus:bg-white focus:border-brand-teal transition-all"
            />
         </div>
         <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto no-scrollbar">
            {CATEGORIES.map(c => (
              <button 
                key={c}
                onClick={() => setCategory(c)}
                className={`px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${
                  (category === c || (!category && c === 'All')) ? 'bg-navy text-brand-teal shadow-xl shadow-navy/20' : 'bg-gray-50 text-navy/40 hover:bg-gray-100'
                }`}
              >
                {c}
              </button>
            ))}
         </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
           {[1, 2, 3, 4].map(i => (
             <div key={i} className="aspect-[3/4] bg-gray-50 rounded-[2.5rem] animate-pulse" />
           ))}
        </div>
      ) : medicines.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
           {medicines.map((med) => (
             <div key={med._id} className="bg-white rounded-[2.5rem] border border-gray-100 p-6 flex flex-col group hover:shadow-2xl hover:shadow-navy/5 transition-all">
                <div className="aspect-square rounded-2xl overflow-hidden mb-4 bg-gray-50 relative">
                   <img src={med.image || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=1000&auto=format&fit=crop'} alt={med.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                   {!med.stock && (
                     <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center">
                        <span className="text-[10px] font-black text-red-500 uppercase tracking-widest italic border-2 border-red-500 px-3 py-1 rounded-lg">Out of Stock</span>
                     </div>
                   )}
                </div>
                <div className="space-y-1">
                   <h4 className="font-syne font-black text-base text-navy uppercase italic truncate">{med.name}</h4>
                   <p className="text-[10px] font-bold text-navy/40 uppercase tracking-widest italic">{med.strength || '500mg'}</p>
                </div>
                <div className="mt-6 flex items-center justify-between">
                   <div className="text-xl font-syne font-black text-navy italic tracking-tighter">₹{med.price}</div>
                   <button 
                     onClick={() => handleAddToCart(med)}
                     disabled={!med.stock}
                     className="h-12 w-12 bg-navy text-brand-teal rounded-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-lg shadow-navy/10 disabled:opacity-20"
                   >
                      <Plus size={20} />
                   </button>
                </div>
             </div>
           ))}
        </div>
      ) : (
        <div className="h-[300px] flex flex-col items-center justify-center text-center space-y-4">
           <Box size={40} className="text-navy/10" />
           <div>
              <h3 className="font-syne font-black text-xl text-navy uppercase italic">Inventory Empty</h3>
              <p className="text-xs font-dm font-bold text-navy/40 uppercase tracking-widest italic mt-1">No matches found in this sector's manifest.</p>
           </div>
        </div>
      )}
    </div>
  );
}
