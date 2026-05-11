import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getDoctorStats, getDoctorAppointments } from '../../services/api';
import './Doctor.css';

export const DoctorSidebar = ({ active }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => { logout(); navigate('/doctor/login'); };
  const navItems = [
    { path: '/doctor/dashboard', icon: '📊', label: 'Dashboard' },
    { path: '/doctor/appointments', icon: '📅', label: 'Appointments' },
    { path: '/doctor/prescriptions', icon: '💊', label: 'Prescriptions' },
  ];
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="logo">🏥 MedDoctor</div>
        <span className="role-badge doctor-badge">DOCTOR</span>
      </div>
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <Link key={item.path} to={item.path}
            className={`nav-item ${active === item.label ? 'doctor-active' : ''}`}>
            <span className="nav-icon">{item.icon}</span>{item.label}
          </Link>
        ))}
      </nav>
      <div className="sidebar-footer">
        <div className="user-info">
          <div className="user-name">Dr. {user?.name}</div>
          <div className="user-email">{user?.email}</div>
        </div>
        <button className="logout-btn" onClick={handleLogout}>🚪 Logout</button>
      </div>
    </div>
  );
};

const DoctorDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [todayApts, setTodayApts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getDoctorStats(), getDoctorAppointments()])
      .then(([statsRes, aptsRes]) => {
        setStats(statsRes.data);
        const today = new Date().toDateString();
        setTodayApts(aptsRes.data.filter((a) => new Date(a.appointmentDate).toDateString() === today));
      })
      .finally(() => setLoading(false));
  }, []);

  const statCards = stats ? [
    { icon: '📅', value: stats.totalAppointments, label: 'Total Appointments' },
    { icon: '🌅', value: stats.todayCount, label: "Today's Appointments" },
    { icon: '⏳', value: stats.pendingCount, label: 'Pending' },
    { icon: '✅', value: stats.completedCount, label: 'Completed' },
  ] : [];

  return (
    <div className="dashboard-layout">
      <DoctorSidebar active="Dashboard" />
      <div className="main-content">
        <div className="page-header">
          <h1>Welcome, Dr. {user?.name} 👋</h1>
          <p>Here's your practice overview for today</p>
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

            <div className="section-card">
              <div className="section-title">Today's Appointments</div>
              {todayApts.length > 0 ? (
                <table className="data-table">
                  <thead><tr><th>Patient</th><th>Time</th><th>Reason</th><th>Status</th></tr></thead>
                  <tbody>
                    {todayApts.map((apt) => (
                      <tr key={apt._id}>
                        <td>{apt.patient?.name || 'N/A'}</td>
                        <td>{apt.timeSlot}</td>
                        <td>{apt.reason}</td>
                        <td><span className={`badge badge-${apt.status}`}>{apt.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : <div className="empty-state"><div className="empty-icon">🎉</div>No appointments today</div>}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DoctorDashboard;
