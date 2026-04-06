import { Search, Filter, Mic } from 'lucide-react';

export default function SearchBar({ value, onChange, placeholder = 'Search...', onFilter }) {
  return (
    <div className="flex items-center gap-2 bg-brand-off border border-brand-border rounded-xl px-3 py-2 w-full">
      <Search size={16} className="text-brand-muted" />
      <input
        className="bg-transparent outline-none text-sm w-full"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
      />
      <button className="text-brand-muted" type="button">
        <Mic size={16} />
      </button>
      <button className="text-brand-muted" type="button" onClick={onFilter}>
        <Filter size={16} />
      </button>
    </div>
  );
}
