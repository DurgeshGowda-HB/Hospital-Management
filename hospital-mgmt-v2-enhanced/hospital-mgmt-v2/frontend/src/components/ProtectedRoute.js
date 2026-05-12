import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#0f172a' }}>
        <div style={{ color: '#60a5fa', fontSize: '18px', fontFamily: 'sans-serif' }}>Loading...</div>
      </div>
    );
  }

  if (!user) {
    if (role === 'admin') return <Navigate to="/admin/login" replace />;
    if (role === 'doctor') return <Navigate to="/doctor/login" replace />;
    return <Navigate to="/patient/login" replace />;
  }

  if (user.role !== role) {
    if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    if (user.role === 'doctor') return <Navigate to="/doctor/dashboard" replace />;
    return <Navigate to="/patient/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
