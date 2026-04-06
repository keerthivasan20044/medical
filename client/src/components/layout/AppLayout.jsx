import { Outlet } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import Sidebar from './Sidebar.jsx';
import MobileBottomNav from './MobileBottomNav.jsx';

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-brand-off">
      <Navbar variant="app" />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-4 md:p-8 pb-32 md:pb-8 page-fade-up">
          <Outlet />
        </main>
      </div>
      <MobileBottomNav />
    </div>
  );
}
