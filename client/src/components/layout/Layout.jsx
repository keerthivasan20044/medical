import React from 'react';
import Navbar from './Navbar.jsx';
import MobileBottomNav from './MobileBottomNav.jsx';
import DistrictCommandBar from './DistrictCommandBar.jsx';
import ScrollToTopButton from '../common/ScrollToTopButton.jsx';
import EmergencyFAB from './EmergencyFAB.jsx';

const Layout = ({ children, isAuthPage = false }) => {
  return (
    <div className="w-full max-w-full overflow-x-hidden min-h-screen
                    flex flex-col bg-[#0a0f1e]">
      {/* Fixed Navbar */}
      <Navbar />

      {/* Page content */}
      <main className="flex-1 w-full max-w-full overflow-x-hidden
                       pt-[60px] pb-36">
        {children}
      </main>

      {/* Fixed elements - stacked correctly */}
      {!isAuthPage && (
        <>
          <DistrictCommandBar /> {/* bottom-[112px] */}
          <ScrollToTopButton />  {/* bottom-[168px] right-4 */}
          <EmergencyFAB />       {/* bottom-[220px] right-4 */}
          <MobileBottomNav />    {/* bottom-0, h-16 */}
        </>
      )}
    </div>
  );
};

export default Layout;
