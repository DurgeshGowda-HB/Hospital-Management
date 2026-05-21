import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getPatientStats, getPatientAppointments } from '../../services/api';
import './Patient.css';

export const PatientSidebar = ({ active }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => { logout(); navigate('/patient/login'); };
  const navItems = [
    { path: '/patient/dashboard', icon: '📊', label: 'Dashboard' },
    { path: '/patient/book', icon: '📋', label: 'Book Appointment' },
    { path: '/patient/appointments', icon: '📅', label: 'My Appointments' },
    { path: '/patient/profile', icon: '👤', label: 'My Profile' },
  ];
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="logo">🏥 MedPatient</div>
        <span className="role-badge patient-badge">PATIENT</span>
      </div>
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <Link key={item.path} to={item.path}
            className={`nav-item ${active === item.label ? 'patient-active' : ''}`}>
            <span className="nav-icon">{item.icon}</span>{item.label}
          </Link>
        ))}
      </nav>
      <div className="sidebar-footer">
        <div className="user-info">
          <div className="user-name">{user?.name}</div>
          <div className="user-email">{user?.email}</div>
        </div>
        <button className="logout-btn" onClick={handleLogout}>🚪 Logout</button>
      </div>
    </div>
  );
};

const PatientDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentApts, setRecentApts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getPatientStats(), getPatientAppointments()])
      .then(([statsRes, aptsRes]) => {
        setStats(statsRes.data);
        setRecentApts(aptsRes.data.slice(0, 5));
      })
      .finally(() => setLoading(false));
  }, []);

  const statCards = stats ? [
    { icon: '📅', value: stats.total, label: 'Total Appointments' },
    { icon: '⏳', value: stats.pending, label: 'Pending' },
    { icon: '✅', value: stats.approved, label: 'Approved' },
    { icon: '🎉', value: stats.completed, label: 'Completed' },
  ] : [];

  return (
    <div className="dashboard-layout">
      <PatientSidebar active="Dashboard" />
      <div className="main-content">
        <div className="page-header">
          <h1>Welcome, {user?.name} 👋</h1>
          <p>Your health management portal</p>
        </div>

        {loading ? <div className="empty-state">Loading...</div> : (
          <>
            <div className="stats-grid">
              {statCards.map((card, i) => (
                <div key={i} className="stat-card">
                  <div className="stat-icon">{card.icon}</div>
                  <div>
                    <div className="stat-value">{card.value}</div>
                    <div className="stat-label">{card.label}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
              <Link to="/patient/book" style={{ flex: 1, display: 'block', padding: '20px', background: 'linear-gradient(135deg,#1e3a8a,#2563eb)', borderRadius: 14, color: '#fff', textDecoration: 'none', textAlign: 'center', fontWeight: 600 }}>
                📋 Book New Appointment
              </Link>
              <Link to="/patient/appointments" style={{ flex: 1, display: 'block', padding: '20px', background: 'linear-gradient(135deg,#0f4c35,#065f46)', borderRadius: 14, color: '#fff', textDecoration: 'none', textAlign: 'center', fontWeight: 600 }}>
                📅 View All Appointments
              </Link>
            </div>

            <div className="section-card">
              <div className="section-title">Recent Appointments</div>
              {recentApts.length > 0 ? (
                <table className="data-table">
                  <thead><tr><th>Doctor</th><th>Date</th><th>Time</th><th>Status</th><th>Notes</th></tr></thead>
                  <tbody>
                    {recentApts.map((apt) => (
                      <tr key={apt._id}>
                        <td>{apt.doctor?.name || 'N/A'}</td>
                        <td>{new Date(apt.appointmentDate).toLocaleDateString()}</td>
                        <td>{apt.timeSlot}</td>
                        <td><span className={`badge badge-${apt.status}`}>{apt.status}</span></td>
                        <td style={{ fontSize: 12, color: '#94a3b8' }}>
                          {apt.status === 'rejected' && apt.rejectedReason ? `❌ ${apt.rejectedReason}` : apt.prescription ? '💊 Issued' : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : <div className="empty-state"><div className="empty-icon">📅</div>No appointments yet. <Link to="/patient/book" style={{ color: '#60a5fa' }}>Book one now!</Link></div>}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PatientDashboard;
