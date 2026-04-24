import React from 'react';
import { MapPin, CheckCircle, Globe, Edit, Trash2 } from 'lucide-react';

const AddressCard = ({ address, onEdit, onDelete }) => {
  return (
    <div className="w-full bg-slate-900 p-4 rounded-xl border border-slate-800 flex flex-col gap-4 hover:border-teal-500/30 transition-all duration-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-slate-800 text-teal-400 rounded-lg flex items-center justify-center border border-white/5">
            <MapPin size={18} />
          </div>
          <div className="min-w-0">
            <div className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Logistics Node</div>
            <h3 className="text-sm font-semibold text-white flex items-center gap-2 truncate">
              {address.label || 'Home'} {address.isDefault && <CheckCircle size={12} className="text-teal-500" />}
            </h3>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xs text-slate-400 leading-relaxed italic">
          {address.street}, <span className="text-slate-300">{address.area}</span>. [{address.pincode}]
        </p>
        <div className="flex items-center gap-2 text-teal-500/60 text-[10px]">
          <Globe size={12} /> GPS Verified
        </div>
      </div>

      <div className="flex gap-4 pt-3 border-t border-white/5">
        <button 
          onClick={() => onEdit(address)}
          className="flex-1 flex items-center justify-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest hover:text-teal-400 transition-colors h-8 bg-slate-800 rounded-md"
        >
          <Edit size={12} /> Edit
        </button>
        <button 
          onClick={() => onDelete(address.id)}
          className="flex-1 flex items-center justify-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest hover:text-red-400 transition-colors h-8 bg-slate-800 rounded-md"
        >
          <Trash2 size={12} /> Delete
        </button>
      </div>
    </div>
  );
};

export default AddressCard;
