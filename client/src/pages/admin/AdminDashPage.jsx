import { 
  LayoutDashboard, Users, Store, Pill, 
  ShoppingBag, BarChart2, Gift, Settings,
  Activity
} from 'lucide-react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from '../../components/dashboard/DashboardLayout';

// Lazy load admin pages
import AdminOverview from './AdminOverview';
import AdminUsers from './AdminUsers';
import AdminPharmacies from './AdminPharmacies';
import AdminMedicines from './AdminMedicines';
import AdminOrders from './AdminOrders';
import AdminAnalytics from './AdminAnalytics';
import AdminPromotions from './AdminPromotions';
import AdminSettings from './AdminSettings';

const ADMIN_MENU = [
  { label: 'Overview', path: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Users', path: '/admin/users', icon: Users },
  { label: 'Pharmacies', path: '/admin/pharmacies', icon: Store },
  { label: 'Medicines', path: '/admin/medicines', icon: Pill },
  { label: 'Orders', path: '/admin/orders', icon: ShoppingBag },
  { label: 'Analytics', path: '/admin/analytics', icon: BarChart2 },
  { label: 'Promotions', path: '/admin/promotions', icon: Gift },
  { label: 'System Settings', path: '/admin/settings', icon: Settings },
];

export default function AdminDashPage() {
  return (
    <DashboardLayout role="Administrator" menuItems={ADMIN_MENU}>
      <Routes>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminOverview />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="pharmacies" element={<AdminPharmacies />} />
        <Route path="medicines" element={<AdminMedicines />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="analytics" element={<AdminAnalytics />} />
        <Route path="promotions" element={<AdminPromotions />} />
        <Route path="settings" element={<AdminSettings />} />
        {/* Redirect old dashboard path to new structure if needed, 
            but AppRouter handles the top level /admin/dashboard */}
        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
      </Routes>
    </DashboardLayout>
  );
}
