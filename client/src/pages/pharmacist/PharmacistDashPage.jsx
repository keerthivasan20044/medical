import { 
  LayoutDashboard, ShoppingBag, Package, 
  FileText, IndianRupee, BarChart2, User,
  Settings
} from 'lucide-react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from '../../components/dashboard/DashboardLayout';

// Lazy load pharmacist pages
import PharmacistOverview from './PharmacistOverview';
import PharmacistOrders from './PharmacistOrders';
import PharmacistInventory from './PharmacistInventory';
import PharmacistPrescriptions from './PharmacistPrescriptions';
import PharmacistEarnings from './PharmacistEarnings';
import PharmacistAnalytics from './PharmacistAnalytics';
import PharmacistProfile from './PharmacistProfile';

const PHARMACIST_MENU = [
  { label: 'Dashboard', path: '/pharmacist/dashboard', icon: LayoutDashboard },
  { label: 'Orders', path: '/pharmacist/orders', icon: ShoppingBag },
  { label: 'Inventory', path: '/pharmacist/inventory', icon: Package },
  { label: 'Prescriptions', path: '/pharmacist/prescriptions', icon: FileText },
  { label: 'Earnings', path: '/pharmacist/earnings', icon: IndianRupee },
  { label: 'Analytics', path: '/pharmacist/analytics', icon: BarChart2 },
  { label: 'Profile', path: '/pharmacist/profile', icon: User },
];

export default function PharmacistDashPage() {
  return (
    <DashboardLayout role="Pharmacist" menuItems={PHARMACIST_MENU}>
      <Routes>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<PharmacistOverview />} />
        <Route path="orders" element={<PharmacistOrders />} />
        <Route path="inventory" element={<PharmacistInventory />} />
        <Route path="prescriptions" element={<PharmacistPrescriptions />} />
        <Route path="earnings" element={<PharmacistEarnings />} />
        <Route path="analytics" element={<PharmacistAnalytics />} />
        <Route path="profile" element={<PharmacistProfile />} />
        <Route path="*" element={<Navigate to="/pharmacist/dashboard" replace />} />
      </Routes>
    </DashboardLayout>
  );
}
