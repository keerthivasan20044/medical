import { Outlet } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function AppLayout() {
  const { pathname } = useLocation();
  const hasOwnDashboardShell = ['/admin', '/doctor', '/pharmacist', '/delivery'].some((path) => pathname.startsWith(path));

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] md:min-h-[calc(100vh-4rem)] bg-brand-off overflow-x-hidden">
      {!hasOwnDashboardShell && <Sidebar />}
      <div className="flex-1 min-w-0 w-full">
        <Outlet />
      </div>
    </div>
  );
}
