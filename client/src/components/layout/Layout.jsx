import React from 'react';
import Navbar from './Navbar';
import MobileBottomNav from './MobileBottomNav';
import DistrictCommandBar from './DistrictCommandBar';
import ScrollToTopButton from '../common/ScrollToTopButton';
import EmergencyFAB from './EmergencyFAB';

const Layout = ({ children, hideNavbar = false, hideBottomNav = false, hideExtras = false }) => {
  return (
    <div className="w-full max-w-full overflow-x-hidden min-h-screen flex flex-col bg-white">
      {/* Fixed Navbar */}
      {!hideNavbar && <Navbar />}

      {/* Page content */}
      <main className={`flex-1 w-full max-w-full overflow-x-hidden ${hideNavbar ? 'pt-0' : 'pt-14 md:pt-16'} pb-20 md:pb-6`}>
        {children}
      </main>

      {/* Fixed elements - stacked correctly */}
      {!hideExtras && (
        <>
          <ScrollToTopButton />
          <EmergencyFAB />
        </>
      )}
      {!hideBottomNav && <MobileBottomNav />}
    </div>
  );
};

export default Layout;
