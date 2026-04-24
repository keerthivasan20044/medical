import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useEffect } from 'react';

export default function RoleBasedRoute({ children, allowedRoles }) {
  const { user, isAuthenticated, loading } = useSelector((state) => state.auth);
  const location = useLocation();

  useEffect(() => {
    if (!loading && isAuthenticated && user && !allowedRoles.includes(user.role)) {
      toast.error('You are not authorized to access this enclave.');
    }
  }, [isAuthenticated, user, allowedRoles, loading]);

  if (loading) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center">
        <div className="h-12 w-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
