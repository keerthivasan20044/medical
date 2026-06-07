import { 
  LayoutDashboard, Calendar, Users, 
  FileText, Clock, Settings, User
} from 'lucide-react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from '../../components/dashboard/DashboardLayout';

// Lazy load doctor pages
import DoctorOverview from './Dashboard';
import DoctorAppointments from './Appointments';
import DoctorPatients from './Patients';
import PatientDetail from './PatientDetail';
import DoctorPrescriptions from './Prescriptions';
import DoctorSchedule from './Schedule';
import ProfilePage from '../customer/Profile';

const DOCTOR_MENU = [
  { label: 'Overview', path: '/doctor/dashboard', icon: LayoutDashboard },
  { label: 'Appointments', path: '/doctor/appointments', icon: Calendar },
  { label: 'Patients', path: '/doctor/patients', icon: Users },
  { label: 'Prescriptions', path: '/doctor/prescriptions', icon: FileText },
  { label: 'Schedule', path: '/doctor/schedule', icon: Clock },
  { label: 'Profile', path: '/doctor/profile', icon: User },
];

export default function DoctorDashPage() {
  return (
    <DashboardLayout role="Doctor" menuItems={DOCTOR_MENU}>
      <Routes>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<DoctorOverview />} />
        <Route path="appointments" element={<DoctorAppointments />} />
        <Route path="patients" element={<DoctorPatients />} />
        <Route path="patients/:id" element={<PatientDetail />} />
        <Route path="prescriptions" element={<DoctorPrescriptions />} />
        <Route path="schedule" element={<DoctorSchedule />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="*" element={<Navigate to="/doctor/dashboard" replace />} />
      </Routes>
    </DashboardLayout>
  );
}
