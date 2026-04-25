import React from 'react';

export function Pagination({ page, pages, onPageChange }) {
  if (pages <= 1) return null;

  const pageNumbers = [];
  const maxVisiblePages = 5;
  
  let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(pages, startPage + maxVisiblePages - 1);
  
  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-8 mb-4 px-4 flex-wrap">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="min-h-11 min-w-11 px-4 rounded-xl border border-gray-200 bg-white text-[#0a1628] font-bold uppercase text-[10px] tracking-widest disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 transition-all shadow-sm"
      >
        Prev
      </button>

      {startPage > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className="min-h-11 min-w-11 px-3 rounded-xl border border-gray-200 bg-white text-[#0a1628] font-bold text-xs hover:bg-gray-50 transition-all shadow-sm"
          >
            1
          </button>
          {startPage > 2 && <span className="text-gray-400 px-1">...</span>}
        </>
      )}

      {pageNumbers.map((pageNum) => (
        <button
          key={pageNum}
          onClick={() => onPageChange(pageNum)}
          className={`min-h-11 min-w-11 px-3 rounded-xl font-bold text-xs transition-all shadow-sm ${
            pageNum === page 
              ? 'bg-[#0a1628] text-white shadow-lg shadow-[#0a1628]/20' 
              : 'border border-gray-200 bg-white text-[#0a1628] hover:bg-gray-50'
          }`}
        >
          {pageNum}
        </button>
      ))}

      {endPage < pages && (
        <>
          {endPage < pages - 1 && <span className="text-gray-400 px-1">...</span>}
          <button
            onClick={() => onPageChange(pages)}
            className="min-h-11 min-w-11 px-3 rounded-xl border border-gray-200 bg-white text-[#0a1628] font-bold text-xs hover:bg-gray-50 transition-all shadow-sm"
          >
            {pages}
          </button>
        </>
      )}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === pages}
        className="min-h-11 min-w-11 px-4 rounded-xl border border-gray-200 bg-white text-[#0a1628] font-bold uppercase text-[10px] tracking-widest disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 transition-all shadow-sm"
      >
        Next
      </button>
    </div>
  );
}

export default Pagination;
