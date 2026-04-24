import { 
  LayoutDashboard, MapPin, Navigation, 
  History, IndianRupee, User, Power
} from 'lucide-react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from '../../components/dashboard/DashboardLayout';

// Lazy load delivery pages
import DeliveryOverview from './DeliveryOverview';
import DeliveryAvailable from './DeliveryAvailable';
import DeliveryActive from './DeliveryActive';
import DeliveryHistory from './DeliveryHistory';
import DeliveryEarnings from './DeliveryEarnings';
import DeliveryProfile from './DeliveryProfile';

import { useDelivery } from '../../hooks/useDelivery';

export default function DeliveryDashPage() {
  const { activeTask } = useDelivery();

  const DELIVERY_MENU = [
    { label: 'Dashboard', path: '/delivery/dashboard', icon: LayoutDashboard },
    { label: 'Available', path: '/delivery/available', icon: MapPin },
    { 
      label: 'Active Task', 
      path: '/delivery/active', 
      icon: Navigation,
      badge: activeTask ? 'LIVE' : null,
      badgeColor: 'bg-brand-teal text-navy'
    },
    { label: 'History', path: '/delivery/history', icon: History },
    { label: 'Earnings', path: '/delivery/earnings', icon: IndianRupee },
    { label: 'Profile', path: '/delivery/profile', icon: User },
  ];
  return (
    <DashboardLayout role="Delivery Partner" menuItems={DELIVERY_MENU}>
      <Routes>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<DeliveryOverview />} />
        <Route path="available" element={<DeliveryAvailable />} />
        <Route path="active" element={<DeliveryActive />} />
        <Route path="history" element={<DeliveryHistory />} />
        <Route path="earnings" element={<DeliveryEarnings />} />
        <Route path="profile" element={<DeliveryProfile />} />
        <Route path="*" element={<Navigate to="/delivery/dashboard" replace />} />
      </Routes>
    </DashboardLayout>
  );
}
