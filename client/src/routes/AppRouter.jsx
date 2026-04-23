import { lazy, Suspense } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import PublicLayout from '../components/layout/PublicLayout';
import AppLayout from '../components/layout/AppLayout';
import ProtectedRoute from './ProtectedRoute';
import RoleRoute from './RoleRoute';

// Loading Component
const PageLoader = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-white">
    <Loader2 className="animate-spin text-brand-teal" size={48} />
    <p className="mt-4 font-syne font-black text-[#0a1628] uppercase tracking-widest text-xs italic">Loading Module...</p>
  </div>
);

// PUBLIC PAGES
const HomePage = lazy(() => import('../pages/public/Landing'));
const AboutPage = lazy(() => import('../pages/public/About'));
const ContactPage = lazy(() => import('../pages/public/Contact'));
const BlogListPage = lazy(() => import('../pages/public/Blog'));
const BlogDetailPage = lazy(() => import('../pages/public/BlogDetail'));
const FAQPage = lazy(() => import('../pages/public/FAQ'));
const PharmaciesListPage = lazy(() => import('../pages/public/Pharmacies'));
const PharmacyDetailPage = lazy(() => import('../pages/public/PharmacyDetail'));
const PharmacyReviewsPage = lazy(() => import('../pages/public/PharmacyReviews'));
const MedicinesListPage = lazy(() => import('../pages/public/Medicines'));
const MedicineDetailPage = lazy(() => import('../pages/public/MedicineDetail'));
const MedicineComparePage = lazy(() => import('../pages/public/MedicineCompare'));
const DoctorsListPage = lazy(() => import('../pages/public/Doctors'));
const DoctorProfilePage = lazy(() => import('../pages/public/DoctorProfile'));
const HospitalsPage = lazy(() => import('../pages/public/Hospitals'));
const VaccinesPage = lazy(() => import('../pages/public/Vaccines'));
const EmergencyPage = lazy(() => import('../pages/public/Emergency'));
const ComparePharmaciesPage = lazy(() => import('../pages/public/ComparePharmacies'));
const SearchResultsPage = lazy(() => import('../pages/public/SearchResults'));
const OffersPage = lazy(() => import('../pages/public/Offers'));
const LoginPage = lazy(() => import('../pages/public/Login'));
const RegisterPage = lazy(() => import('../pages/public/Register'));
const OTPVerificationPage = lazy(() => import('../pages/public/OtpVerification'));
const ForgotPasswordPage = lazy(() => import('../pages/public/ForgotPassword'));
const ResetPasswordPage = lazy(() => import('../pages/public/ResetPassword'));
const TermsPage = lazy(() => import('../pages/public/Terms'));
const PrivacyPage = lazy(() => import('../pages/public/Privacy'));
const RefundPolicyPage = lazy(() => import('../pages/public/Refund'));

// CUSTOMER PAGES
const CustomerDashboard = lazy(() => import('../pages/customer/Home'));
const ProfilePage = lazy(() => import('../pages/customer/Profile'));
const EditProfilePage = lazy(() => import('../pages/customer/EditProfile'));
const HealthRecordsPage = lazy(() => import('../pages/customer/HealthRecords'));
const MyOrdersPage = lazy(() => import('../pages/customer/Orders'));
const OrderDetailPage = lazy(() => import('../pages/customer/OrderDetail'));
const LiveTrackingPage = lazy(() => import('../pages/customer/OrderTrack'));
const InvoicePage = lazy(() => import('../pages/customer/Invoice'));
const CartPage = lazy(() => import('../pages/customer/Cart'));
const CheckoutPage = lazy(() => import('../pages/customer/Checkout'));
const OrderSuccessPage = lazy(() => import('../pages/customer/OrderSuccess'));
const PrescriptionsPage = lazy(() => import('../pages/customer/Prescriptions'));
const UploadPrescriptionPage = lazy(() => import('../pages/customer/UploadPrescription'));
const PrescriptionDetailPage = lazy(() => import('../pages/customer/PrescriptionDetail'));
const AppointmentsPage = lazy(() => import('../pages/customer/Appointments'));
const BookAppointmentPage = lazy(() => import('../pages/customer/BookAppointment'));
const AppointmentDetailPage = lazy(() => import('../pages/customer/AppointmentDetail'));
const NotificationsPage = lazy(() => import('../pages/customer/Notifications'));
const WalletPage = lazy(() => import('../pages/customer/Wallet'));
const AddMoneyPage = lazy(() => import('../pages/customer/AddMoney'));
const WishlistPage = lazy(() => import('../pages/customer/Wishlist'));
const AddressesPage = lazy(() => import('../pages/customer/Addresses'));
const SettingsPage = lazy(() => import('../pages/customer/Settings'));
const HelpCenterPage = lazy(() => import('../pages/customer/HelpCenter'));
const ChatPage = lazy(() => import('../pages/customer/Chat'));
const PrescriptionUploadFlow = lazy(() => import('../pages/customer/PrescriptionUploadFlow'));

// PHARMACIST PAGES
const PharmacistDashboard = lazy(() => import('../pages/pharmacist/Dashboard'));
const InventoryPage = lazy(() => import('../pages/pharmacist/Inventory'));
const AddMedicinePage = lazy(() => import('../pages/pharmacist/AddMedicine'));
const IncomingOrdersPage = lazy(() => import('../pages/pharmacist/Orders'));
const OrderManagePage = lazy(() => import('../pages/pharmacist/OrderManage'));
const PrescriptionVerifyPage = lazy(() => import('../pages/pharmacist/PrescriptionVerify'));
const CustomersListPage = lazy(() => import('../pages/pharmacist/Customers'));
const PharmacistAnalyticsPage = lazy(() => import('../pages/pharmacist/Analytics'));
const PharmacySettingsPage = lazy(() => import('../pages/pharmacist/Settings'));

// DOCTOR PAGES
const DoctorDashboard = lazy(() => import('../pages/doctor/Dashboard'));
const DoctorAppointmentsPage = lazy(() => import('../pages/doctor/Appointments'));
const PatientsListPage = lazy(() => import('../pages/doctor/Patients'));
const PatientDetailPage = lazy(() => import('../pages/doctor/PatientDetail'));
const WritePrescriptionPage = lazy(() => import('../pages/doctor/Prescriptions'));
const SchedulePage = lazy(() => import('../pages/doctor/Schedule'));

// DELIVERY PAGES
const DeliveryDashboard = lazy(() => import('../pages/delivery/Dashboard'));
const ActiveDeliveryPage = lazy(() => import('../pages/delivery/Active'));
const DeliveryHistoryPage = lazy(() => import('../pages/delivery/History'));
const EarningsPage = lazy(() => import('../pages/delivery/Earnings'));

// ADMIN PAGES
const AdminDashboard = lazy(() => import('../pages/admin/Dashboard'));
const UsersManagePage = lazy(() => import('../pages/admin/Users'));
const PharmaciesManagePage = lazy(() => import('../pages/admin/Pharmacies'));
const MedicinesManagePage = lazy(() => import('../pages/admin/Medicines'));
const AllOrdersPage = lazy(() => import('../pages/admin/Orders'));
const DoctorsManagePage = lazy(() => import('../pages/admin/Doctors'));
const AnalyticsPage = lazy(() => import('../pages/admin/Analytics'));
const ReportsPage = lazy(() => import('../pages/admin/Reports'));
const AdminSettingsPage = lazy(() => import('../pages/admin/Settings'));

// UTILITY / ERROR PAGES
import { NotFound as NotFoundPage, Offline as OfflinePage, Maintenance as MaintenancePage, ServerError as ServerErrorPage } from '../pages/utility/UtilityPages';

export default function AppRouter() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route element={<PublicLayout />}>
          {/* PUBLIC ROUTES */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/blog" element={<BlogListPage />} />
          <Route path="/blog/:slug" element={<BlogDetailPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/pharmacies" element={<PharmaciesListPage />} />
          <Route path="/pharmacies/:id" element={<PharmacyDetailPage />} />
          <Route path="/pharmacies/:id/reviews" element={<PharmacyReviewsPage />} />
          <Route path="/medicines" element={<MedicinesListPage />} />
          <Route path="/medicines/:id" element={<MedicineDetailPage />} />
          <Route path="/medicines/compare" element={<MedicineComparePage />} />
          <Route path="/doctors" element={<DoctorsListPage />} />
          <Route path="/doctors/:id" element={<DoctorProfilePage />} />
          <Route path="/hospitals" element={<HospitalsPage />} />
          <Route path="/vaccines" element={<VaccinesPage />} />
          <Route path="/emergency" element={<EmergencyPage />} />
          <Route path="/compare" element={<ComparePharmaciesPage />} />
          <Route path="/search" element={<SearchResultsPage />} />
          <Route path="/offers" element={<OffersPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify-otp" element={<OTPVerificationPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/refund" element={<RefundPolicyPage />} />
          
          {/* ERROR / UTILITY */}
          <Route path="/404" element={<NotFoundPage />} />
          <Route path="/500" element={<ServerErrorPage />} />
          <Route path="/maintenance" element={<MaintenancePage />} />
          <Route path="/offline" element={<OfflinePage />} />
        </Route>

        {/* PROTECTED ROUTES */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            
            {/* CUSTOMER ROUTES */}
            <Route element={<RoleRoute allow={['customer']} />}>
              <Route path="/home" element={<CustomerDashboard />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/profile/edit" element={<EditProfilePage />} />
              <Route path="/profile/health" element={<HealthRecordsPage />} />
              <Route path="/orders" element={<MyOrdersPage />} />
              <Route path="/orders/:id" element={<OrderDetailPage />} />
              <Route path="/orders/:id/track" element={<LiveTrackingPage />} />
              <Route path="/orders/:id/invoice" element={<InvoicePage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/order/:pharmacyId/prescription" element={<PrescriptionUploadFlow />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/checkout/success" element={<OrderSuccessPage />} />
              <Route path="/prescriptions" element={<PrescriptionsPage />} />
              <Route path="/prescriptions/upload" element={<UploadPrescriptionPage />} />
              <Route path="/prescriptions/:id" element={<PrescriptionDetailPage />} />
              <Route path="/appointments" element={<AppointmentsPage />} />
              <Route path="/appointments/book/:id" element={<BookAppointmentPage />} />
              <Route path="/appointments/:id" element={<AppointmentDetailPage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/wallet" element={<WalletPage />} />
              <Route path="/wallet/add-money" element={<AddMoneyPage />} />
              <Route path="/wishlist" element={<WishlistPage />} />
              <Route path="/addresses" element={<AddressesPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/help" element={<HelpCenterPage />} />
              <Route path="/chat" element={<ChatPage />} />
            </Route>

            {/* PHARMACIST ROUTES */}
            <Route element={<RoleRoute allow={['pharmacist']} />}>
              <Route path="/pharmacist/dashboard" element={<PharmacistDashboard />} />
              <Route path="/pharmacist/inventory" element={<InventoryPage />} />
              <Route path="/pharmacist/inventory/add" element={<AddMedicinePage />} />
              <Route path="/pharmacist/orders" element={<IncomingOrdersPage />} />
              <Route path="/pharmacist/orders/:id" element={<OrderManagePage />} />
              <Route path="/pharmacist/prescriptions" element={<PrescriptionVerifyPage />} />
              <Route path="/pharmacist/customers" element={<CustomersListPage />} />
              <Route path="/pharmacist/analytics" element={<PharmacistAnalyticsPage />} />
              <Route path="/pharmacist/settings" element={<PharmacySettingsPage />} />
            </Route>

            {/* DOCTOR ROUTES */}
            <Route element={<RoleRoute allow={['doctor']} />}>
              <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
              <Route path="/doctor/appointments" element={<DoctorAppointmentsPage />} />
              <Route path="/doctor/patients" element={<PatientsListPage />} />
              <Route path="/doctor/patients/:id" element={<PatientDetailPage />} />
              <Route path="/doctor/prescriptions" element={<WritePrescriptionPage />} />
              <Route path="/doctor/schedule" element={<SchedulePage />} />
            </Route>

            {/* DELIVERY ROUTES */}
            <Route element={<RoleRoute allow={['delivery']} />}>
              <Route path="/delivery/dashboard" element={<DeliveryDashboard />} />
              <Route path="/delivery/active" element={<ActiveDeliveryPage />} />
              <Route path="/delivery/history" element={<DeliveryHistoryPage />} />
              <Route path="/delivery/earnings" element={<EarningsPage />} />
            </Route>

            {/* ADMIN ROUTES */}
            <Route element={<RoleRoute allow={['admin']} />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<UsersManagePage />} />
              <Route path="/admin/pharmacies" element={<PharmaciesManagePage />} />
              <Route path="/admin/medicines" element={<MedicinesManagePage />} />
              <Route path="/admin/orders" element={<AllOrdersPage />} />
              <Route path="/admin/doctors" element={<DoctorsManagePage />} />
              <Route path="/admin/analytics" element={<AnalyticsPage />} />
              <Route path="/admin/reports" element={<ReportsPage />} />
              <Route path="/admin/settings" element={<AdminSettingsPage />} />
            </Route>
          </Route>
        </Route>

        {/* CATCH-ALL */}
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </Suspense>
  );
}
