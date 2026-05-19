import { 
  LayoutDashboard, Users, Store, Pill, 
  ShoppingBag, BarChart2, Gift, Settings,
  Activity, FileText, Calendar, ShieldCheck, Package
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
import AdminDoctors from './Doctors';
import AdminDelivery from './AdminDelivery';
import AdminAppointments from './AdminAppointments';
import AdminReports from './AdminReports';
import AdminCompliance from './AdminCompliance';
import AdminInventory from './AdminInventory';
import AdminLogs from './AdminLogs';

const ADMIN_MENU = [
  { label: 'Overview', path: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Users', path: '/admin/users', icon: Users },
  { label: 'Doctors', path: '/admin/doctors', icon: Activity },
  { label: 'Pharmacies', path: '/admin/pharmacies', icon: Store },
  { label: 'Delivery', path: '/admin/delivery', icon: ShoppingBag },
  { label: 'Appointments', path: '/admin/appointments', icon: Calendar },
  { label: 'Compliance', path: '/admin/compliance', icon: ShieldCheck },
  { label: 'Inventory', path: '/admin/inventory', icon: Package },
  { label: 'Medicines', path: '/admin/medicines', icon: Pill },
  { label: 'Orders', path: '/admin/orders', icon: ShoppingBag },
  { label: 'Analytics', path: '/admin/analytics', icon: BarChart2 },
  { label: 'Promotions', path: '/admin/promotions', icon: Gift },
  { label: 'Reports', path: '/admin/reports', icon: FileText },
  { label: 'System Settings', path: '/admin/settings', icon: Settings },
  { label: 'Activity Logs', path: '/admin/logs', icon: Activity },
];

export default function AdminDashPage() {
  return (
    <DashboardLayout role="Administrator" menuItems={ADMIN_MENU}>
      <Routes>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminOverview />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="doctors" element={<AdminDoctors />} />
        <Route path="pharmacies" element={<AdminPharmacies />} />
        <Route path="delivery" element={<AdminDelivery />} />
        <Route path="appointments" element={<AdminAppointments />} />
        <Route path="compliance" element={<AdminCompliance />} />
        <Route path="inventory" element={<AdminInventory />} />
        <Route path="medicines" element={<AdminMedicines />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="analytics" element={<AdminAnalytics />} />
        <Route path="promotions" element={<AdminPromotions />} />
        <Route path="reports" element={<AdminReports />} />
        <Route path="settings" element={<AdminSettings />} />
        <Route path="logs" element={<AdminLogs />} />
        {/* Redirect old dashboard path to new structure if needed, 
            but AppRouter handles the top level /admin/dashboard */}
        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
      </Routes>
    </DashboardLayout>
  );
}
