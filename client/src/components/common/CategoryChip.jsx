import React from 'react';

const CategoryChip = ({ label, active, onClick, count }) => {
  return (
    <button
      onClick={onClick}
      className={`
        h-10 px-5 rounded-full font-bold text-[10px] uppercase tracking-widest 
        transition-all flex items-center gap-2 shrink-0 border
        ${active 
          ? 'bg-teal-500 text-slate-900 border-teal-500 shadow-lg shadow-teal-500/20' 
          : 'bg-slate-800 text-slate-400 border-white/5 hover:border-teal-500/30'
        }
      `}
    >
      <span className="whitespace-nowrap">{label}</span>
      {count !== undefined && (
        <span className={`text-[8px] px-1.5 py-0.5 rounded-md ${active ? 'bg-slate-900/10' : 'bg-white/5'}`}>
          {count}
        </span>
      )}
    </button>
  );
};

export default CategoryChip;
