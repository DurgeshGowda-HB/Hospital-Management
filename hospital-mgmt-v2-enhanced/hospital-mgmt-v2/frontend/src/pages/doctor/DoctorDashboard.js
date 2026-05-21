import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getDoctorStats, getDoctorAppointments, getDoctorProfile } from '../../services/api';
import './Doctor.css';

export const DoctorSidebar = ({ active }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => { logout(); navigate('/doctor/login'); };
  const navItems = [
    { path: '/doctor/dashboard', icon: '📊', label: 'Dashboard' },
    { path: '/doctor/appointments', icon: '📅', label: 'Appointments' },
    { path: '/doctor/schedule', icon: '🗓️', label: 'My Schedule' },
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
  const [doctorProfile, setDoctorProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getDoctorStats(), getDoctorAppointments(), getDoctorProfile()])
      .then(([statsRes, aptsRes, profileRes]) => {
        setStats(statsRes.data);
        const today = new Date().toDateString();
        setTodayApts(aptsRes.data.filter((a) => new Date(a.appointmentDate).toDateString() === today));
        setDoctorProfile(profileRes.data.doctorProfile);
      })
      .finally(() => setLoading(false));
  }, []);

  const statCards = stats ? [
    { icon: '📅', value: stats.totalAppointments, label: 'Total Appointments' },
    { icon: '🌅', value: stats.todayCount, label: "Today's Appointments" },
    { icon: '✅', value: stats.approvedCount, label: 'Approved' },
    { icon: '🎉', value: stats.completedCount, label: 'Completed' },
  ] : [];

  const isVerified = doctorProfile?.isVerified;
  const verificationStatus = doctorProfile?.verificationStatus || 'pending';

  return (
    <div className="dashboard-layout">
      <DoctorSidebar active="Dashboard" />
      <div className="main-content">
        <div className="page-header">
          <h1>Welcome, Dr. {user?.name} 👋</h1>
          <p>Here's your practice overview for today</p>
        </div>

        {/* Verification status banner */}
        {!isVerified && (
          <div style={{
            padding: '14px 20px', borderRadius: 10, marginBottom: 20, fontSize: 14,
            background: verificationStatus === 'rejected' ? 'rgba(239,68,68,0.15)' : 'rgba(251,191,36,0.15)',
            color: verificationStatus === 'rejected' ? '#f87171' : '#fbbf24',
            border: `1px solid ${verificationStatus === 'rejected' ? 'rgba(239,68,68,0.3)' : 'rgba(251,191,36,0.3)'}`,
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <span style={{ fontSize: 20 }}>{verificationStatus === 'rejected' ? '❌' : '⏳'}</span>
            <div>
              <strong>{verificationStatus === 'rejected' ? 'Verification Rejected' : 'Verification Pending'}</strong>
              <div style={{ fontSize: 13, marginTop: 4, opacity: 0.8 }}>
                {verificationStatus === 'rejected'
                  ? 'Your profile was rejected. Please contact admin for details.'
                  : 'Your profile is under review. You will be able to receive appointments once verified by admin.'}
              </div>
            </div>
          </div>
        )}
        {isVerified && (
          <div style={{
            padding: '10px 16px', borderRadius: 10, marginBottom: 20, fontSize: 13,
            background: 'rgba(16,185,129,0.12)', color: '#34d399',
            border: '1px solid rgba(16,185,129,0.25)', display: 'flex', alignItems: 'center', gap: 10,
          }}>
            ✅ <span>Your profile is <strong>verified</strong>. Patients can now book appointments with you.</span>
          </div>
        )}

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

            {/* Quick links */}
            <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
              <Link to="/doctor/schedule" style={{ flex: 1, padding: '16px', background: 'linear-gradient(135deg,#1e3a8a,#2563eb)', borderRadius: 12, color: '#fff', textDecoration: 'none', textAlign: 'center', fontWeight: 600 }}>
                🗓️ Manage Schedule & Leave
              </Link>
              <Link to="/doctor/appointments" style={{ flex: 1, padding: '16px', background: 'linear-gradient(135deg,#0f4c35,#065f46)', borderRadius: 12, color: '#fff', textDecoration: 'none', textAlign: 'center', fontWeight: 600 }}>
                📅 View Appointments
              </Link>
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
              ) : <div className="empty-state"><div className="empty-icon">🎉</div>No approved appointments today</div>}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DoctorDashboard;
