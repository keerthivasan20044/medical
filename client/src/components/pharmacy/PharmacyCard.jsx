import { Link } from 'react-router-dom';

export default function PharmacyCard({ item }) {
  return (
    <div className="bg-white border border-brand-border rounded-2xl p-5 shadow-soft">
      <div className="font-heading">{item.name}</div>
      <div className="text-xs text-brand-muted">{item.location || item.address?.street}</div>
      <div className="text-xs text-brand-teal mt-2">? {item.rating || '4.6'} · {item.distance || '1.4 km'}</div>
      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">Open</span>
        <Link to={`/pharmacies/${item.id || item._id}`} className="text-xs text-brand-teal">View Details</Link>
      </div>
    </div>
  );
}
