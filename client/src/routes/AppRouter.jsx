import { Route, Routes, Navigate } from 'react-router-dom';
import PublicLayout from '../components/layout/PublicLayout.jsx';
import AppLayout from '../components/layout/AppLayout.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';
import RoleRoute from './RoleRoute.jsx';

// PUBLIC PAGES
import HomePage from '../pages/public/Landing.jsx';
import AboutPage from '../pages/public/About.jsx';
import ContactPage from '../pages/public/Contact.jsx';
import BlogListPage from '../pages/public/Blog.jsx';
import BlogDetailPage from '../pages/public/BlogDetail.jsx';
import FAQPage from '../pages/public/FAQ.jsx';
import PharmaciesListPage from '../pages/public/Pharmacies.jsx';
import PharmacyDetailPage from '../pages/public/PharmacyDetail.jsx';
import PharmacyReviewsPage from '../pages/public/PharmacyReviews.jsx';
import MedicinesListPage from '../pages/public/Medicines.jsx';
import MedicineDetailPage from '../pages/public/MedicineDetail.jsx';
import MedicineComparePage from '../pages/public/MedicineCompare.jsx';
import DoctorsListPage from '../pages/public/Doctors.jsx';
import DoctorProfilePage from '../pages/public/DoctorProfile.jsx';
import HospitalsPage from '../pages/public/Hospitals.jsx';
import VaccinesPage from '../pages/public/Vaccines.jsx';
import EmergencyPage from '../pages/public/Emergency.jsx';
import ComparePharmaciesPage from '../pages/public/ComparePharmacies.jsx';
import SearchResultsPage from '../pages/public/SearchResults.jsx';
import OffersPage from '../pages/public/Offers.jsx';
import LoginPage from '../pages/public/Login.jsx';
import RegisterPage from '../pages/public/Register.jsx';
import OTPVerificationPage from '../pages/public/OtpVerification.jsx';
import ForgotPasswordPage from '../pages/public/ForgotPassword.jsx';
import ResetPasswordPage from '../pages/public/ResetPassword.jsx';
import TermsPage from '../pages/public/Terms.jsx';
import PrivacyPage from '../pages/public/Privacy.jsx';
import RefundPolicyPage from '../pages/public/Refund.jsx';

// CUSTOMER PAGES
import CustomerDashboard from '../pages/customer/Home.jsx';
import ProfilePage from '../pages/customer/Profile.jsx';
import EditProfilePage from '../pages/customer/EditProfile.jsx';
import HealthRecordsPage from '../pages/customer/HealthRecords.jsx';
import MyOrdersPage from '../pages/customer/Orders.jsx';
import OrderDetailPage from '../pages/customer/OrderDetail.jsx';
import LiveTrackingPage from '../pages/customer/OrderTrack.jsx';
import InvoicePage from '../pages/customer/Invoice.jsx';
import CartPage from '../pages/customer/Cart.jsx';
import CheckoutPage from '../pages/customer/Checkout.jsx';
import OrderSuccessPage from '../pages/customer/OrderSuccess.jsx';
import PrescriptionsPage from '../pages/customer/Prescriptions.jsx';
import UploadPrescriptionPage from '../pages/customer/UploadPrescription.jsx';
import PrescriptionDetailPage from '../pages/customer/PrescriptionDetail.jsx';
import AppointmentsPage from '../pages/customer/Appointments.jsx';
import BookAppointmentPage from '../pages/customer/BookAppointment.jsx';
import AppointmentDetailPage from '../pages/customer/AppointmentDetail.jsx';
import NotificationsPage from '../pages/customer/Notifications.jsx';
import WalletPage from '../pages/customer/Wallet.jsx';
import AddMoneyPage from '../pages/customer/AddMoney.jsx';
import WishlistPage from '../pages/customer/Wishlist.jsx';
import AddressesPage from '../pages/customer/Addresses.jsx';
import SettingsPage from '../pages/customer/Settings.jsx';
import HelpCenterPage from '../pages/customer/HelpCenter.jsx';
import ChatPage from '../pages/customer/Chat.jsx';
import PrescriptionUploadFlow from '../pages/customer/PrescriptionUploadFlow.jsx';

// PHARMACIST PAGES
import PharmacistDashboard from '../pages/pharmacist/Dashboard.jsx';
import InventoryPage from '../pages/pharmacist/Inventory.jsx';
import AddMedicinePage from '../pages/pharmacist/AddMedicine.jsx';
import IncomingOrdersPage from '../pages/pharmacist/Orders.jsx';
import OrderManagePage from '../pages/pharmacist/OrderManage.jsx';
import PrescriptionVerifyPage from '../pages/pharmacist/PrescriptionVerify.jsx';
import CustomersListPage from '../pages/pharmacist/Customers.jsx';
import PharmacistAnalyticsPage from '../pages/pharmacist/Analytics.jsx';
import PharmacySettingsPage from '../pages/pharmacist/Settings.jsx';

// DOCTOR PAGES
import DoctorDashboard from '../pages/doctor/Dashboard.jsx';
import DoctorAppointmentsPage from '../pages/doctor/Appointments.jsx';
import PatientsListPage from '../pages/doctor/Patients.jsx';
import PatientDetailPage from '../pages/doctor/PatientDetail.jsx';
import WritePrescriptionPage from '../pages/doctor/Prescriptions.jsx';
import SchedulePage from '../pages/doctor/Schedule.jsx';

// DELIVERY PAGES
import DeliveryDashboard from '../pages/delivery/Dashboard.jsx';
import ActiveDeliveryPage from '../pages/delivery/Active.jsx';
import DeliveryHistoryPage from '../pages/delivery/History.jsx';
import EarningsPage from '../pages/delivery/Earnings.jsx';

// ADMIN PAGES
import AdminDashboard from '../pages/admin/Dashboard.jsx';
import UsersManagePage from '../pages/admin/Users.jsx';
import PharmaciesManagePage from '../pages/admin/Pharmacies.jsx';
import MedicinesManagePage from '../pages/admin/Medicines.jsx';
import AllOrdersPage from '../pages/admin/Orders.jsx';
import DoctorsManagePage from '../pages/admin/Doctors.jsx';
import AnalyticsPage from '../pages/admin/Analytics.jsx';
import ReportsPage from '../pages/admin/Reports.jsx';
import AdminSettingsPage from '../pages/admin/Settings.jsx';

// UTILITY / ERROR PAGES
import { NotFound as NotFoundPage, Offline as OfflinePage, Maintenance as MaintenancePage, ServerError as ServerErrorPage } from '../pages/utility/UtilityPages.jsx';

export default function AppRouter() {
  return (
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

      {/* CUSTOMER ROUTES */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
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

          {/* ADMIN ENCLAVE */}
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

      {/* CATCH-ALL REDIRECT TO 404 */}
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}
