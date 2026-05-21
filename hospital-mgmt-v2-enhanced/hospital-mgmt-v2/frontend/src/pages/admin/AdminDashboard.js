import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getAdminStats, getPendingDoctors, verifyDoctor } from '../../services/api';
import './Admin.css';

export const AdminSidebar = ({ active }) => {
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

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [pendingDoctors, setPendingDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [verifyMsg, setVerifyMsg] = useState('');

  const loadData = () => {
    Promise.all([getAdminStats(), getPendingDoctors()])
      .then(([statsRes, pendingRes]) => {
        setStats(statsRes.data);
        setPendingDoctors(pendingRes.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, []);

  const handleVerify = async (doctorId, action) => {
    try {
      await verifyDoctor(doctorId, { action });
      setVerifyMsg(`Doctor ${action}d successfully!`);
      setTimeout(() => setVerifyMsg(''), 3000);
      loadData();
    } catch (err) {
      setVerifyMsg(err.response?.data?.message || 'Action failed');
    }
  };

  const statCards = stats ? [
    { icon: '👥', value: stats.totalUsers, label: 'Total Users' },
    { icon: '👨‍⚕️', value: stats.totalDoctors, label: 'Total Doctors' },
    { icon: '🤒', value: stats.totalPatients, label: 'Total Patients' },
    { icon: '📅', value: stats.totalAppointments, label: 'Total Appointments' },
    { icon: '⏳', value: stats.pendingAppointments, label: 'Pending Apts' },
    { icon: '✅', value: stats.approvedAppointments, label: 'Approved Apts' },
    { icon: '🎉', value: stats.completedAppointments, label: 'Completed' },
    { icon: '🔍', value: stats.pendingDoctors, label: 'Pending Verifications' },
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

            {/* Pending Doctor Verifications */}
            {pendingDoctors.length > 0 && (
              <div className="section-card" style={{ borderColor: 'rgba(251,191,36,0.4)' }}>
                <div className="section-title" style={{ color: '#fbbf24' }}>
                  ⚠️ Pending Doctor Verifications ({pendingDoctors.length})
                </div>
                {verifyMsg && (
                  <div style={{ padding: '10px 14px', borderRadius: 8, marginBottom: 16, fontSize: 13,
                    background: verifyMsg.includes('success') ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
                    color: verifyMsg.includes('success') ? '#34d399' : '#f87171' }}>
                    {verifyMsg}
                  </div>
                )}
                <table className="data-table">
                  <thead>
                    <tr><th>Name</th><th>Email</th><th>Specialization</th><th>Department</th><th>Experience</th><th>Actions</th></tr>
                  </thead>
                  <tbody>
                    {pendingDoctors.map((doc) => (
                      <tr key={doc._id}>
                        <td>{doc.user?.name || 'N/A'}</td>
                        <td>{doc.user?.email || 'N/A'}</td>
                        <td>{doc.specialization}</td>
                        <td>{doc.department || '-'}</td>
                        <td>{doc.experience} yrs</td>
                        <td style={{ display: 'flex', gap: 8 }}>
                          <button className="btn btn-primary" style={{ fontSize: 12, padding: '6px 14px' }}
                            onClick={() => handleVerify(doc._id, 'approve')}>✅ Approve</button>
                          <button className="btn btn-danger" style={{ fontSize: 12, padding: '6px 14px' }}
                            onClick={() => handleVerify(doc._id, 'reject')}>❌ Reject</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="section-card">
              <div className="section-title">Recent Appointments</div>
              {stats?.recentAppointments?.length > 0 ? (
                <table className="data-table">
                  <thead>
                    <tr><th>Patient</th><th>Doctor</th><th>Date</th><th>Status</th></tr>
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


export default AdminDashboard;
