import { Link } from 'react-router-dom';

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
  onAction
}) {
  return (
    <div className="bg-white border border-black/[0.03] rounded-[3.5rem] p-12 md:p-20 text-center shadow-4xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 h-64 w-64 bg-brand-teal opacity-[0.02] rounded-full blur-[80px]" />
      {Icon && (
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-[2rem] bg-gray-50 text-brand-teal shadow-inner group-hover:bg-[#0a1628] group-hover:text-white transition-all duration-700">
          <Icon size={40} className="animate-float-up" strokeWidth={1.5} />
        </div>
      )}
      <h2 className="font-syne font-black text-3xl md:text-5xl text-[#0a1628] mt-8 uppercase italic tracking-tighter leading-none">{title}</h2>
      {description && <p className="text-gray-400 font-dm italic font-bold text-lg mt-4 opacity-60">{description}</p>}
      
      <div className="mt-12 flex justify-center">
        {actionLabel && actionHref && (
          <Link
            to={actionHref}
            className="h-16 px-10 bg-[#0a1628] text-brand-teal rounded-2xl font-syne font-black text-[10px] uppercase italic tracking-[0.2em] hover:bg-brand-teal hover:text-white transition-all duration-700 shadow-2xl active:scale-95 flex items-center justify-center"
          >
            {actionLabel} &rarr;
          </Link>
        )}
        {actionLabel && !actionHref && onAction && (
          <button
            type="button"
            onClick={onAction}
            className="h-16 px-10 bg-[#0a1628] text-brand-teal rounded-2xl font-syne font-black text-[10px] uppercase italic tracking-[0.2em] hover:bg-brand-teal hover:text-white transition-all duration-700 shadow-2xl active:scale-95"
          >
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
}
