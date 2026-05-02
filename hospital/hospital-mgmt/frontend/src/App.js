import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import ProfilePage from './pages/ProfilePage';
import AdminPanel from './pages/AdminPanel';
import DoctorList from './pages/DoctorList';
import PatientRegistration from './pages/PatientRegistration';
import AppointmentBooking from './pages/AppointmentBooking';
import AppointmentsPage from './pages/AppointmentsPage';

// Layout
import Layout from './components/Layout';

const PrivateRoute = ({ children, adminRequired = false }) => {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ display:'flex',alignItems:'center',justifyContent:'center',height:'100vh' }}>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (adminRequired && user.role !== 'admin') return <Navigate to="/dashboard" />;
  return children;
};

const PublicRoute = ({ children }) => {
  const { user } = useAuth();
  if (user) return <Navigate to="/dashboard" />;
  return children;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />

      <Route path="/dashboard" element={<PrivateRoute><Layout><Dashboard /></Layout></PrivateRoute>} />
      <Route path="/profile" element={<PrivateRoute><Layout><ProfilePage /></Layout></PrivateRoute>} />
      <Route path="/doctors" element={<PrivateRoute><Layout><DoctorList /></Layout></PrivateRoute>} />
      <Route path="/patient-registration" element={<PrivateRoute><Layout><PatientRegistration /></Layout></PrivateRoute>} />
      <Route path="/book-appointment" element={<PrivateRoute><Layout><AppointmentBooking /></Layout></PrivateRoute>} />
      <Route path="/appointments" element={<PrivateRoute><Layout><AppointmentsPage /></Layout></PrivateRoute>} />
      <Route path="/admin" element={<PrivateRoute adminRequired><Layout><AdminPanel /></Layout></PrivateRoute>} />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
        <ToastContainer position="top-right" autoClose={3000} theme="dark" />
      </Router>
    </AuthProvider>
  );
}

export default App;
