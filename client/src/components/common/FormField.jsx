export default function FormField({ label, hint, error, required, children }) {
  return (
    <div className="space-y-1">
      {label && (
        <div className="flex items-center justify-between">
          <label className="text-xs font-ui text-brand-muted">
            {label}
            {required && <span className="text-red-500"> *</span>}
          </label>
          {hint && <span className="text-xs text-brand-muted">{hint}</span>}
        </div>
      )}
      {children}
      {error && <div className="text-xs text-red-600">{error}</div>}
    </div>
  );
}
