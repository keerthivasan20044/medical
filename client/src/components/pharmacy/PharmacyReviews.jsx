import { useState, useEffect } from 'react';
import { Star, MessageSquare, ThumbsUp, Filter, User } from 'lucide-react';
import api from '../../services/api';
import ReviewForm from './ReviewForm';

export default function PharmacyReviews({ pharmacyId }) {
  const [showForm, setShowForm] = useState(false);
  const [reviews, setReviews] = useState([
    { id: 1, user: 'Rahul V.', rating: 5, date: '2 days ago', text: 'Excellent node service. Fast fulfillment and authentic medicines.', helpful: 12 },
    { id: 2, user: 'Sonia S.', rating: 4, date: '1 week ago', text: 'Reliable stock levels. Good communication from the pharmacist.', helpful: 8 },
  ]);

  return (
    <div className="space-y-16">
      {/* Summary Header */}
      <div className="grid md:grid-cols-12 gap-12 items-center">
         <div className="md:col-span-4 bg-navy p-12 rounded-[3.5rem] text-white text-center space-y-4 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 h-24 w-24 bg-brand-teal/20 rounded-full blur-[40px] -mr-8 -mt-8" />
            <div className="text-6xl font-syne font-black italic tracking-tighter text-brand-teal">4.8</div>
            <div className="flex justify-center gap-1 text-amber-400">
               {[1, 2, 3, 4, 5].map(i => <Star key={i} size={20} fill={i <= 4 ? "currentColor" : "none"} />)}
            </div>
            <div className="text-[10px] font-black uppercase tracking-widest italic opacity-40">120 Total Validations</div>
         </div>

         <div className="md:col-span-8 space-y-4 px-4">
            {[5, 4, 3, 2, 1].map(r => (
              <div key={r} className="flex items-center gap-4">
                 <span className="text-[10px] font-black text-navy uppercase italic w-12">{r} Stars</span>
                 <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-teal rounded-full" style={{ width: `${r === 5 ? 80 : r === 4 ? 15 : 5}%` }} />
                 </div>
                 <span className="text-[10px] font-bold text-navy/20 uppercase italic w-8">{r === 5 ? '80%' : r === 4 ? '15%' : '5%'}</span>
              </div>
            ))}
         </div>
      </div>

      {/* Review List */}
      <div className="space-y-8">
         <div className="flex items-center justify-between border-b border-gray-100 pb-8">
            <h3 className="font-syne font-black text-xl text-navy uppercase italic flex items-center gap-3">
               <MessageSquare size={24} className="text-brand-teal" /> Community Validation
            </h3>
            <button className="text-[10px] font-black text-navy/40 uppercase tracking-widest italic flex items-center gap-2 hover:text-navy transition-all">
               <Filter size={16} /> Latest First
            </button>
         </div>

         <div className="space-y-10">
            {reviews.map((rev) => (
              <div key={rev.id} className="space-y-6">
                 <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                       <div className="h-12 w-12 bg-gray-50 rounded-2xl flex items-center justify-center text-navy/20 overflow-hidden border border-gray-100">
                          <User size={24} />
                       </div>
                       <div>
                          <div className="font-dm font-black text-navy text-sm italic">{rev.user}</div>
                          <div className="flex gap-0.5 text-amber-500">
                             {[1, 2, 3, 4, 5].map(i => <Star key={i} size={10} fill={i <= rev.rating ? "currentColor" : "none"} />)}
                          </div>
                       </div>
                    </div>
                    <span className="text-[10px] font-bold text-navy/20 uppercase tracking-widest italic">{rev.date}</span>
                 </div>
                 <p className="text-sm font-dm font-bold text-navy/60 italic leading-relaxed pl-16">
                    "{rev.text}"
                 </p>
                 <div className="flex items-center gap-6 pl-16">
                    <button className="flex items-center gap-2 text-[9px] font-black text-navy/40 uppercase tracking-widest italic hover:text-brand-teal transition-all">
                       <ThumbsUp size={14} /> Helpful ({rev.helpful})
                    </button>
                    <button className="text-[9px] font-black text-navy/20 uppercase tracking-widest italic hover:underline">Report Violation</button>
                 </div>
              </div>
            ))}
         </div>
         
         <div className="pt-12 text-center">
            <button 
              onClick={() => setShowForm(true)}
              className="h-14 px-10 bg-white border border-navy/10 text-navy rounded-2xl font-syne font-black text-xs uppercase tracking-widest hover:bg-navy hover:text-white transition-all shadow-sm"
            >
               Write Your Validation
            </button>
         </div>
      </div>

      <ReviewForm 
        pharmacyId={pharmacyId} 
        isOpen={showForm} 
        onClose={() => setShowForm(false)}
        onSuccess={() => {/* Refetch reviews */}}
      />
    </div>
  );
}
