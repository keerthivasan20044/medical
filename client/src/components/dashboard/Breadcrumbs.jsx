import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export default function Breadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  return (
    <nav className="flex items-center gap-3 mb-8 overflow-x-auto no-scrollbar pb-2">
      <Link 
        to="/" 
        className="h-8 w-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-navy/20 hover:text-brand-teal hover:border-brand-teal/20 transition-all shrink-0 shadow-sm"
      >
        <Home size={14} />
      </Link>
      
      {pathnames.map((value, index) => {
        const last = index === pathnames.length - 1;
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;

        return (
          <div key={to} className="flex items-center gap-3 shrink-0">
            <ChevronRight size={14} className="text-navy/10" />
            <Link
              to={to}
              className={`text-[10px] font-black uppercase tracking-widest italic transition-all ${
                last 
                ? 'text-brand-teal' 
                : 'text-navy/30 hover:text-navy'
              }`}
            >
              {value.replace(/-/g, ' ')}
            </Link>
          </div>
        );
      })}
    </nav>
  );
}
