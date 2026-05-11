import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getAdminStats } from '../../services/api';
import './Admin.css';

const AdminSidebar = ({ active }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/admin/login'); };

  const navItems = [
    { path: '/admin/dashboard', icon: '📊', label: 'Dashboard' },
    { path: '/admin/users', icon: '👥', label: 'Manage Users' },
    { path: '/admin/doctors', icon: '👨‍⚕️', label: 'Manage Doctors' },
    { path: '/admin/appointments', icon: '📅', label: 'Appointments' },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="logo">🏥 MedAdmin</div>
        <span className="role-badge admin-badge">ADMIN</span>
      </div>
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <Link key={item.path} to={item.path}
            className={`nav-item ${active === item.label ? 'active' : ''}`}>
            <span className="nav-icon">{item.icon}</span>
            {item.label}
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

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminStats()
      .then((res) => setStats(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const statCards = stats ? [
    { icon: '👥', value: stats.totalUsers, label: 'Total Users' },
    { icon: '👨‍⚕️', value: stats.totalDoctors, label: 'Total Doctors' },
    { icon: '🤒', value: stats.totalPatients, label: 'Total Patients' },
    { icon: '📅', value: stats.totalAppointments, label: 'Total Appointments' },
    { icon: '⏳', value: stats.pendingAppointments, label: 'Pending' },
    { icon: '✅', value: stats.completedAppointments, label: 'Completed' },
  ] : [];

  return (
    <div className="dashboard-layout">
      <AdminSidebar active="Dashboard" />
      <div className="main-content">
        <div className="page-header">
          <h1>Admin Dashboard</h1>
          <p>Overview of the hospital management system</p>
        </div>

        {loading ? (
          <div className="empty-state"><div className="empty-icon">⏳</div>Loading stats...</div>
        ) : (
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
              <div className="section-title">Recent Appointments</div>
              {stats?.recentAppointments?.length > 0 ? (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Patient</th><th>Doctor</th><th>Date</th><th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentAppointments.map((apt) => (
                      <tr key={apt._id}>
                        <td>{apt.patient?.name || 'N/A'}</td>
                        <td>{apt.doctor?.name || 'N/A'}</td>
                        <td>{apt.appointmentDate ? new Date(apt.appointmentDate).toLocaleDateString() : 'N/A'}</td>
                        <td><span className={`badge badge-${apt.status}`}>{apt.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="empty-state">No recent appointments</div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export { AdminSidebar };
export default AdminDashboard;
