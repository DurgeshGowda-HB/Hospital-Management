import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FiHome, FiCalendar, FiUsers, FiUser, FiSettings,
  FiLogOut, FiMenu, FiX, FiActivity, FiClipboard
} from 'react-icons/fi';
import './Layout.css';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/dashboard', icon: <FiHome />, label: 'Dashboard' },
    { to: '/doctors', icon: <FiUsers />, label: 'Doctors' },
    { to: '/appointments', icon: <FiCalendar />, label: 'Appointments' },
    { to: '/book-appointment', icon: <FiClipboard />, label: 'Book Appointment' },
    ...(user?.role === 'patient' ? [{ to: '/patient-registration', icon: <FiActivity />, label: 'My Health Record' }] : []),
    { to: '/profile', icon: <FiUser />, label: 'Profile' },
    ...(user?.role === 'admin' ? [{ to: '/admin', icon: <FiSettings />, label: 'Admin Panel' }] : []),
  ];

  return (
    <div className={`layout ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <span className="logo-icon">+</span>
            {sidebarOpen && <span className="logo-text">MediCare</span>}
          </div>
          <button className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <span className="nav-icon">{item.icon}</span>
              {sidebarOpen && <span className="nav-label">{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          {sidebarOpen && (
            <div className="user-info">
              <div className="user-avatar">{user?.name?.charAt(0)}</div>
              <div>
                <div className="user-name">{user?.name}</div>
                <div className="user-role">{user?.role}</div>
              </div>
            </div>
          )}
          <button className="logout-btn" onClick={handleLogout} title="Logout">
            <FiLogOut />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      <main className="main-content">
        <div className="content-wrapper">{children}</div>
      </main>
    </div>
  );
};

export default Layout;
