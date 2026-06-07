import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, MoreVertical, Search, Filter, X } from 'lucide-react';

export default function DataTable({ 
  title, 
  columns, 
  data, 
  actions, 
  onSearch, 
  pagination = true,
  isLoading = false,
  currentPage = 1,
  totalPages = 1,
  totalRecords = 0,
  onPageChange,
  onEdit,
  onDelete,
  onView
}) {
  const getCellValue = (row, key) => key.split('.').reduce((value, part) => value?.[part], row);

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col max-w-full">
      {/* Table Header */}
      <div className="p-5 md:p-7 border-b border-gray-50 flex flex-col xl:flex-row xl:items-center justify-between gap-5">
        <div className="min-w-0">
          <h2 className="font-syne font-black text-xl md:text-2xl text-navy uppercase leading-tight break-words">{title}</h2>
          <p className="text-[10px] font-dm font-bold text-navy/30 uppercase tracking-[0.16em] mt-2">{totalRecords || data.length} records</p>
        </div>
        
        <div className="flex items-center gap-3 w-full xl:w-auto">
          <div className="flex bg-gray-50 p-2 rounded-2xl items-center gap-2 border border-gray-100 focus-within:border-brand-teal transition-all flex-1 xl:w-80">
            <Search size={16} className="text-navy/20 ml-2" />
            <input 
              type="text" 
              placeholder="Filter records..." 
              onChange={(e) => onSearch?.(e.target.value)}
              className="bg-transparent border-none outline-none font-dm text-xs px-2 w-full min-w-0" 
            />
          </div>
          <button className="h-10 w-10 bg-gray-50 rounded-xl flex items-center justify-center text-navy/40 hover:text-navy hover:shadow-lg transition-all">
            <Filter size={18} />
          </button>
        </div>
      </div>

      {/* Table Body */}
      <div className="md:hidden p-3 space-y-3">
        {isLoading ? (
          [...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse rounded-2xl border border-gray-100 p-4 space-y-4">
              <div className="h-4 w-2/3 rounded bg-gray-100" />
              <div className="h-3 w-full rounded bg-gray-100" />
              <div className="h-3 w-3/4 rounded bg-gray-100" />
            </div>
          ))
        ) : data.length === 0 ? (
          <div className="px-5 py-10 text-center text-navy/40 font-dm italic">
            No records found
          </div>
        ) : (
          data.map((row, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
              key={row._id || row.id || idx}
              className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm space-y-4"
            >
              <div className="space-y-4">
                {columns.map((col, colIndex) => (
                  <div key={col.key} className={colIndex === 0 ? '' : 'grid grid-cols-[6.5rem_minmax(0,1fr)] items-center gap-3'}>
                    {colIndex > 0 && (
                      <div className="text-[9px] font-black text-navy/35 uppercase tracking-widest">
                        {col.label}
                      </div>
                    )}
                    <div className="min-w-0 overflow-hidden">
                      {col.render ? col.render(getCellValue(row, col.key), row) : (
                        <span className="font-dm font-bold text-navy text-sm break-words">{getCellValue(row, col.key)}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {actions && (
                <div className="flex items-center justify-end gap-2 border-t border-gray-50 pt-3">
                  {onView && (
                    <button
                      onClick={(e) => { e.stopPropagation(); onView(row); }}
                      className="h-10 w-10 bg-gray-50 text-navy/40 rounded-xl flex items-center justify-center hover:bg-navy hover:text-white transition-all"
                    >
                      <ChevronRight size={16} />
                    </button>
                  )}
                  {onEdit && (
                    <button
                      onClick={(e) => { e.stopPropagation(); onEdit(row); }}
                      className="h-10 w-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all"
                    >
                      <MoreVertical size={16} />
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={(e) => { e.stopPropagation(); onDelete(row._id || row.id); }}
                      className="h-10 w-10 bg-red-50 text-red-600 rounded-xl flex items-center justify-center hover:bg-red-600 hover:text-white transition-all"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              )}
            </motion.div>
          ))
        )}
      </div>

      <div className="hidden md:block overflow-x-auto max-w-full">
        <table className="w-full text-left min-w-[760px]">
          <thead>
            <tr className="bg-gray-50/50">
              {columns.map((col) => (
                <th 
                  key={col.key}
                  className="px-5 py-4 text-[10px] font-black text-navy/40 uppercase tracking-widest whitespace-nowrap"
                >
                  {col.label}
                </th>
              ))}
              {actions && <th className="px-5 py-4 text-[10px] font-black text-navy/40 uppercase tracking-widest text-center whitespace-nowrap">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  {columns.map((col) => (
                    <td key={col.key} className="px-5 py-5">
                      <div className="h-4 bg-gray-100 rounded-md w-full" />
                    </td>
                  ))}
                  {actions && <td className="px-5 py-5"><div className="h-8 w-8 bg-gray-100 rounded-full mx-auto" /></td>}
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (actions ? 1 : 0)} className="px-8 py-12 text-center text-navy/40 font-dm italic">
                  No records found
                </td>
              </tr>
            ) : (
              data.map((row, idx) => (
                <motion.tr 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  key={row._id || row.id || idx} 
                  className="hover:bg-gray-50/50 transition-colors group cursor-pointer"
                >
                  {columns.map((col) => (
                    <td key={col.key} className="px-5 py-5 align-middle">
                      {col.render ? col.render(getCellValue(row, col.key), row) : (
                        <span className="font-dm font-bold text-navy text-sm">{getCellValue(row, col.key)}</span>
                      )}
                    </td>
                  ))}
                  {actions && (
                    <td className="px-5 py-5 align-middle">
                      <div className="flex items-center justify-center gap-2">
                        {onView && (
                          <button 
                            onClick={(e) => { e.stopPropagation(); onView(row); }}
                            className="h-9 w-9 bg-gray-50 text-navy/40 rounded-lg flex items-center justify-center hover:bg-navy hover:text-white transition-all"
                          >
                             <ChevronRight size={16} />
                          </button>
                        )}
                        {onEdit && (
                          <button 
                            onClick={(e) => { e.stopPropagation(); onEdit(row); }}
                            className="h-9 w-9 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all"
                          >
                             <MoreVertical size={16} />
                          </button>
                        )}
                        {onDelete && (
                          <button 
                            onClick={(e) => { e.stopPropagation(); onDelete(row._id || row.id); }}
                            className="h-9 w-9 bg-red-50 text-red-600 rounded-lg flex items-center justify-center hover:bg-red-600 hover:text-white transition-all"
                          >
                             <X size={16} />
                          </button>
                        )}
                        {!onEdit && !onDelete && !onView && (
                           <button className="h-10 w-10 border border-gray-100 rounded-xl flex items-center justify-center text-navy/20 hover:text-navy hover:bg-white hover:shadow-lg transition-all mx-auto">
                             <MoreVertical size={18} />
                           </button>
                        )}
                      </div>
                    </td>
                  )}
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && totalPages > 1 && (
        <div className="p-5 md:p-6 border-t border-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="text-[10px] font-black text-navy/40 uppercase tracking-widest">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex items-center gap-2">
            <button 
              className="h-10 w-10 border border-gray-100 rounded-xl flex items-center justify-center text-navy/20 hover:text-navy transition-all disabled:opacity-30" 
              onClick={() => onPageChange?.(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft size={18} />
            </button>
            
            {[...Array(Math.min(5, totalPages))].map((_, i) => {
              let pageNum;
              if (totalPages <= 5) pageNum = i + 1;
              else {
                if (currentPage <= 3) pageNum = i + 1;
                else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                else pageNum = currentPage - 2 + i;
              }
              
              return (
                <button 
                  key={pageNum}
                  onClick={() => onPageChange?.(pageNum)}
                  className={`h-10 w-10 rounded-xl flex items-center justify-center transition-all ${
                    currentPage === pageNum 
                      ? 'bg-navy text-white shadow-lg shadow-navy/20 scale-105' 
                      : 'border border-gray-100 text-navy/20 hover:text-navy'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button 
              className="h-10 w-10 border border-gray-100 rounded-xl flex items-center justify-center text-navy/20 hover:text-navy transition-all disabled:opacity-30" 
              onClick={() => onPageChange?.(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
