export default function StockBadge({ status }) {
  const map = {
    available: 'bg-green-50 text-green-600',
    low: 'bg-orange-50 text-orange-600',
    out: 'bg-red-50 text-red-600'
  };
  const label = status === 'available' ? 'In Stock' : status === 'low' ? 'Low Stock' : 'Out of Stock';
  return <span className={`text-xs px-2 py-1 rounded-full ${map[status] || 'bg-brand-off text-brand-muted'}`}>{label}</span>;
}
