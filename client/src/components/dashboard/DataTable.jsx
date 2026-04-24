import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, MoreVertical, Search, Filter } from 'lucide-react';

export default function DataTable({ 
  title, 
  columns, 
  data, 
  actions, 
  onSearch, 
  pagination = true,
  isLoading = false 
}) {
  return (
    <div className="bg-white rounded-[3.5rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col">
      {/* Table Header */}
      <div className="p-8 md:p-10 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="font-syne font-black text-2xl text-navy uppercase italic">{title}</h2>
          <p className="text-xs font-dm font-bold text-navy/40 uppercase tracking-widest mt-1">Found {data.length} records</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex bg-gray-50 p-2 rounded-2xl items-center gap-2 border border-gray-100 focus-within:border-brand-teal transition-all">
            <Search size={16} className="text-navy/20 ml-2" />
            <input 
              type="text" 
              placeholder="Filter records..." 
              onChange={(e) => onSearch?.(e.target.value)}
              className="bg-transparent border-none outline-none font-dm text-xs px-2 w-40 md:w-60" 
            />
          </div>
          <button className="h-10 w-10 bg-gray-50 rounded-xl flex items-center justify-center text-navy/40 hover:text-navy hover:shadow-lg transition-all">
            <Filter size={18} />
          </button>
        </div>
      </div>

      {/* Table Body */}
      <div className="overflow-x-auto">
        <table className="w-full text-left min-w-[800px]">
          <thead>
            <tr className="bg-gray-50/50">
              {columns.map((col) => (
                <th 
                  key={col.key}
                  className="px-8 py-6 text-[10px] font-black text-navy/40 uppercase tracking-widest"
                >
                  {col.label}
                </th>
              ))}
              {actions && <th className="px-8 py-6 text-[10px] font-black text-navy/40 uppercase tracking-widest text-center">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  {columns.map((col) => (
                    <td key={col.key} className="px-8 py-6">
                      <div className="h-4 bg-gray-100 rounded-md w-full" />
                    </td>
                  ))}
                  {actions && <td className="px-8 py-6"><div className="h-8 w-8 bg-gray-100 rounded-full mx-auto" /></td>}
                </tr>
              ))
            ) : (
              data.map((row, idx) => (
                <motion.tr 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  key={row.id || idx} 
                  className="hover:bg-gray-50/50 transition-colors group cursor-pointer"
                >
                  {columns.map((col) => (
                    <td key={col.key} className="px-8 py-6">
                      {col.render ? col.render(row[col.key], row) : (
                        <span className="font-dm font-bold text-navy text-sm">{row[col.key]}</span>
                      )}
                    </td>
                  ))}
                  {actions && (
                    <td className="px-8 py-6 text-center">
                      <button className="h-10 w-10 border border-gray-100 rounded-xl flex items-center justify-center text-navy/20 hover:text-navy hover:bg-white hover:shadow-lg transition-all mx-auto">
                        <MoreVertical size={18} />
                      </button>
                    </td>
                  )}
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="p-8 border-t border-gray-50 flex items-center justify-between">
          <div className="text-[10px] font-black text-navy/40 uppercase tracking-widest">
            Showing 1-10 of {data.length}
          </div>
          <div className="flex items-center gap-2">
            <button className="h-10 w-10 border border-gray-100 rounded-xl flex items-center justify-center text-navy/20 hover:text-navy transition-all disabled:opacity-30" disabled>
              <ChevronLeft size={18} />
            </button>
            <button className="h-10 w-10 bg-navy text-white rounded-xl flex items-center justify-center shadow-lg shadow-navy/20 hover:scale-105 transition-all">
              1
            </button>
            <button className="h-10 w-10 border border-gray-100 rounded-xl flex items-center justify-center text-navy/20 hover:text-navy transition-all">
              2
            </button>
            <button className="h-10 w-10 border border-gray-100 rounded-xl flex items-center justify-center text-navy/20 hover:text-navy transition-all">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
