import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, X, MessageSquare, ShieldCheck, Heart } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../../services/api';

export const RatingModal = ({ isOpen, onClose, orderId, pharmacyName, agentName }) => {
  const [pharmacyRating, setPharmacyRating] = useState(0);
  const [deliveryRating, setDeliveryRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (pharmacyRating === 0 || deliveryRating === 0) {
      return toast.error('Please provide architectural score for both nodes.');
    }
    
    setLoading(true);
    try {
      await api.post(`/api/orders/${orderId}/rate`, { pharmacyRating, deliveryRating, comment });
      toast.success('Architecture Feedback Synchronized! Thank you.');
      onClose();
    } catch (e) {
      toast.error('Failed to sync feedback node.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-6">
       <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-[#0a1628]/80 backdrop-blur-xl" 
       />
       
       <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 50 }} 
          animate={{ opacity: 1, scale: 1, y: 0 }} 
          className="relative z-10 w-full max-w-xl bg-white rounded-[4.5rem] p-12 shadow-4xl space-y-10"
       >
          <div className="flex items-center justify-between">
             <div className="space-y-1">
                <h2 className="font-syne font-black text-3xl text-[#0a1628]">Protocol Feedback</h2>
                <p className="text-gray-400 font-dm text-sm italic">Synchronizing quality nodes for Karaikal enclave.</p>
             </div>
             <button onClick={onClose} className="h-12 w-12 rounded-full border border-gray-100 flex items-center justify-center text-gray-300 hover:text-[#0a1628] transition"><X size={24}/></button>
          </div>

          <div className="space-y-8">
             {/* Pharmacy Rating */}
             <div className="space-y-4 p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100">
                <div className="flex items-center justify-between">
                   <div className="text-[10px] font-black text-[#028090] uppercase tracking-widest">Pharmacy Node: {pharmacyName}</div>
                   <ShieldCheck className="text-[#028090]" size={16} />
                </div>
                <div className="flex gap-3">
                   {[1, 2, 3, 4, 5].map(star => (
                      <button key={star} onClick={() => setPharmacyRating(star)} className={`h-12 w-12 rounded-xl flex items-center justify-center transition ${pharmacyRating >= star ? 'bg-amber-100 text-amber-500 scale-110 shadow-lg' : 'bg-white text-gray-200'}`}>
                         <Star size={24} fill={pharmacyRating >= star ? 'currentColor' : 'none'} />
                      </button>
                   ))}
                </div>
             </div>

             {/* Delivery Rating */}
             <div className="space-y-4 p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100">
                <div className="flex items-center justify-between">
                   <div className="text-[10px] font-black text-[#02C39A] uppercase tracking-widest">Delivery Agent: {agentName}</div>
                   <Heart className="text-[#02C39A]" size={16} />
                </div>
                <div className="flex gap-3">
                   {[1, 2, 3, 4, 5].map(star => (
                      <button key={star} onClick={() => setDeliveryRating(star)} className={`h-12 w-12 rounded-xl flex items-center justify-center transition ${deliveryRating >= star ? 'bg-emerald-100 text-emerald-500 scale-110 shadow-lg' : 'bg-white text-gray-200'}`}>
                         <Star size={24} fill={deliveryRating >= star ? 'currentColor' : 'none'} />
                      </button>
                   ))}
                </div>
             </div>

             {/* Comment */}
             <div className="space-y-4">
                <label className="text-[10px] font-black text-gray-300 uppercase tracking-widest ml-6">Additional Architecture Notes</label>
                <div className="relative">
                   <MessageSquare className="absolute left-6 top-6 text-gray-300" size={18} />
                   <textarea 
                      placeholder="How was your experience with the medicine quality and delivery speed?"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="w-full p-6 pl-16 bg-white border-2 border-gray-50 rounded-[2rem] h-32 outline-none focus:border-[#028090] transition font-dm text-sm"
                   />
                </div>
             </div>
          </div>

          <button 
             onClick={handleSubmit}
             disabled={loading}
             className="w-full py-6 bg-[#0a1628] text-white rounded-[2.2rem] font-syne font-black text-lg uppercase tracking-widest shadow-3xl hover:bg-[#028090] transition active:scale-95"
          >
             {loading ? 'Synchronizing...' : 'Submit Architecture Feedback'}
          </button>
       </motion.div>
    </div>
  );
};
