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
    <div className="border border-brand-border rounded-3xl p-8 text-center bg-white shadow-soft">
      {Icon && (
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-teal/10 text-brand-teal">
          <Icon size={22} />
        </span>
      )}
      <h2 className="font-heading text-xl text-brand-navy mt-4">{title}</h2>
      {description && <p className="text-sm text-brand-muted mt-2">{description}</p>}
      {actionLabel && actionHref && (
        <Link
          to={actionHref}
          className="mt-4 inline-flex items-center justify-center rounded-xl bg-brand-teal text-white px-5 py-2 text-sm"
        >
          {actionLabel}
        </Link>
      )}
      {actionLabel && !actionHref && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-4 inline-flex items-center justify-center rounded-xl bg-brand-teal text-white px-5 py-2 text-sm"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
