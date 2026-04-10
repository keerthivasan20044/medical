import { Outlet } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';
import MobileBottomNav from './MobileBottomNav.jsx';

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar variant="public" />
      <main className="flex-1 pb-32 lg:pb-0 page-fade-up">
        <Outlet />
      </main>
      <Footer />
      <MobileBottomNav />
    </div>
  );
}
