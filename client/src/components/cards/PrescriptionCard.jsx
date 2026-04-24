import React from 'react';
import { Eye, CheckCircle, Clock, AlertCircle, ShoppingBag, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

const PrescriptionCard = ({ rx, onDelete, onOrder }) => {
  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col gap-3 hover:border-teal-500/30 transition-all duration-300">
      <div className="flex gap-3">
        {/* Thumbnail */}
        <div className="h-20 w-20 bg-slate-800 rounded-lg overflow-hidden shrink-0 relative border border-white/5">
          <img src={rx.img} alt="Rx" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
            <Eye className="text-white" size={16} />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-white truncate">{rx.doctor}</h3>
              <p className="text-[10px] text-slate-500 truncate">{rx.hospital}</p>
            </div>
            <div className={`shrink-0 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider flex items-center gap-1 ${
              rx.verified || rx.status === 'Verified' ? 'bg-teal-500/10 text-teal-500' :
              rx.status.includes('Pending') ? 'bg-amber-500/10 text-amber-500' : 'bg-slate-700 text-slate-400'
            }`}>
              {rx.verified || rx.status === 'Verified' ? <CheckCircle size={10} /> : <Clock size={10} />}
              {rx.verified || rx.status === 'Verified' ? 'Verified' : 'Pending'}
            </div>
          </div>
          
          <div className="flex items-center justify-between text-[10px]">
             <span className="text-slate-400">{rx.date}</span>
             <span className="text-teal-400 font-bold">{rx.medicines.length} Items</span>
          </div>
        </div>
      </div>

      <div className="flex gap-2 pt-2 border-t border-white/5">
        <button 
          onClick={() => onOrder(rx)}
          className="flex-1 h-9 bg-teal-500 hover:bg-teal-400 text-slate-900 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-all"
        >
          <ShoppingBag size={14} /> Buy Medicines
        </button>
        <button 
          onClick={() => onDelete(rx.id)}
          className="w-9 h-9 bg-slate-800 hover:bg-red-500 hover:text-white text-slate-500 rounded-lg flex items-center justify-center transition-all"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
};

export default PrescriptionCard;
