import { useState } from 'react';
import { Star, X, ShieldCheck, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../../services/api';

export default function ReviewForm({ pharmacyId, isOpen, onClose, onSuccess }) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) return toast.error('Please select a star rating');
    if (text.length < 20) return toast.error('Validation text must be at least 20 characters');

    try {
      setLoading(true);
      await api.post(`/api/pharmacies/${pharmacyId}/reviews`, { rating, text });
      toast.success('Validation Recorded! Rating synchronized.');
      onSuccess?.();
      onClose();
    } catch (err) {
      toast.error('Failed to submit validation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-navy/60 backdrop-blur-xl"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-xl bg-white rounded-[3.5rem] shadow-2xl overflow-hidden"
          >
            <div className="absolute top-0 right-0 h-40 w-40 bg-brand-teal/5 rounded-full blur-3xl -mr-20 -mt-20" />
            
            <div className="p-10 md:p-12 space-y-10">
               <div className="flex items-start justify-between">
                  <div className="space-y-2">
                     <div className="flex items-center gap-2">
                        <ShieldCheck size={18} className="text-brand-teal" />
                        <span className="text-[10px] font-black text-brand-teal uppercase tracking-[0.3em]">Validation Protocol</span>
                     </div>
                     <h2 className="font-syne font-black text-3xl text-navy uppercase italic">Submit Review</h2>
                  </div>
                  <button onClick={onClose} className="h-12 w-12 bg-gray-50 text-navy/20 rounded-2xl flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all">
                     <X size={24} />
                  </button>
               </div>

               <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="space-y-4">
                     <label className="text-[10px] font-black text-navy/40 uppercase tracking-widest italic ml-1">Rating Impact</label>
                     <div className="flex gap-3">
                        {[1, 2, 3, 4, 5].map(r => (
                          <button
                            key={r}
                            type="button"
                            onMouseEnter={() => setHoveredRating(r)}
                            onMouseLeave={() => setHoveredRating(0)}
                            onClick={() => setRating(r)}
                            className="transition-all hover:scale-110 active:scale-95"
                          >
                             <Star 
                               size={40} 
                               className={r <= (hoveredRating || rating) ? 'text-amber-500' : 'text-gray-100'}
                               fill={r <= (hoveredRating || rating) ? 'currentColor' : 'none'}
                               strokeWidth={r <= (hoveredRating || rating) ? 0 : 2}
                             />
                          </button>
                        ))}
                     </div>
                  </div>

                  <div className="space-y-4">
                     <label className="text-[10px] font-black text-navy/40 uppercase tracking-widest italic ml-1">Testimonial Data</label>
                     <textarea 
                       placeholder="Describe your experience with this node... (min 20 chars)"
                       value={text}
                       onChange={(e) => setText(e.target.value)}
                       className="w-full h-40 bg-gray-50 border border-gray-100 rounded-[2rem] p-8 font-dm font-bold text-navy outline-none focus:bg-white focus:border-brand-teal transition-all resize-none"
                     />
                  </div>

                  <button 
                    type="submit"
                    disabled={loading}
                    className="w-full h-16 bg-navy text-brand-teal rounded-2xl font-syne font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-navy/20 disabled:opacity-50"
                  >
                     {loading ? (
                        <div className="h-5 w-5 border-2 border-brand-teal border-t-transparent rounded-full animate-spin" />
                     ) : (
                        <>
                           Synchronize Validation <Send size={18} />
                        </>
                     )}
                  </button>
               </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
