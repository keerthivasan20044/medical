import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

export default function RoleRoute({ allow }) {
  const { role } = useSelector((s) => s.auth);
  if (!allow.includes(role)) return <Navigate to="/home" replace />;
  return <Outlet />;
}
