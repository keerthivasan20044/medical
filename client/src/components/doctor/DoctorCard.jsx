import { Link } from 'react-router-dom';

export default function DoctorCard({ item }) {
  return (
    <div className="bg-white border border-brand-border rounded-2xl p-5 shadow-soft">
      <div className="flex items-center justify-between">
        <div className="font-heading">{item.name}</div>
        <span className={`text-xs px-2 py-1 rounded-full ${item.status === 'online' ? 'text-green-600 bg-green-50' : item.status === 'busy' ? 'text-orange-600 bg-orange-50' : 'text-brand-muted bg-brand-off'}`}>
          {item.status || 'online'}
        </span>
      </div>
      <div className="text-xs text-brand-muted">{item.spec || item.specialization || 'General Physician'}</div>
      <div className="text-xs text-brand-teal mt-2">&#8377;{item.fee || 200} / visit</div>
      <div className="mt-3 flex gap-2">
        <Link to={`/doctors/${item.id || item._id}`} className="flex-1 text-xs border border-brand-border px-3 py-2 rounded-lg text-center">Profile</Link>
        <button className="flex-1 text-xs bg-brand-teal text-white px-3 py-2 rounded-lg">Book</button>
      </div>
    </div>
  );
}

