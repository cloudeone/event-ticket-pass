import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './components/layout/DashboardLayout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import EventListPage from './pages/EventListPage';
import EventFormPage from './pages/EventFormPage';
import EventDetailPage from './pages/EventDetailPage';
import OrderListPage from './pages/OrderListPage';
import ZoneManagementPage from './pages/ZoneManagementPage';
import StaffListPage from './pages/StaffListPage';
import SettingsPage from './pages/SettingsPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="events" element={<EventListPage />} />
          <Route path="events/new" element={<EventFormPage />} />
          <Route path="events/:id" element={<EventDetailPage />} />
          <Route path="events/:id/edit" element={<EventFormPage />} />
          <Route path="zones" element={<ZoneManagementPage />} />
          <Route path="orders" element={<OrderListPage />} />
          <Route path="staff" element={<StaffListPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
