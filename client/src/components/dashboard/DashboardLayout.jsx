import { useState } from 'react';
import DashboardSidebar from './DashboardSidebar';
import DashboardHeader from './DashboardHeader';
import Breadcrumbs from './Breadcrumbs';
import { motion } from 'framer-motion';

export default function DashboardLayout({ children, role, menuItems }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f0f2f5] flex overflow-x-hidden">
      {/* Sidebar */}
      <DashboardSidebar 
        role={role} 
        menuItems={menuItems} 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen} 
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader 
          role={role} 
          setIsSidebarOpen={setIsSidebarOpen} 
        />
        <main className="flex-1 p-4 md:p-6 xl:p-8 overflow-y-auto overflow-x-hidden scroll-smooth">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-[1440px] mx-auto"
          >
            <Breadcrumbs />
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
