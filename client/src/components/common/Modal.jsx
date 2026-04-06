import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

export default function Modal({ open, title, children, onClose, actions, size = 'md' }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;
  const sizeClass = size === 'lg' ? 'max-w-3xl' : size === 'sm' ? 'max-w-md' : 'max-w-xl';

  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className={`relative w-[92%] ${sizeClass} bg-white rounded-3xl shadow-xl border border-brand-border p-6 modal-animate`}>
        <div className="flex items-center justify-between">
          <div className="font-heading text-lg text-brand-navy">{title}</div>
          <button
            type="button"
            onClick={onClose}
            className="h-9 w-9 rounded-full border border-brand-border flex items-center justify-center"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>
        <div className="mt-4">{children}</div>
        {actions && <div className="mt-6 flex items-center justify-end gap-3">{actions}</div>}
      </div>
    </div>,
    document.body
  );
}
