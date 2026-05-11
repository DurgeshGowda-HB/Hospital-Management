import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="home-page">
      <nav className="home-nav">
        <div className="nav-logo">🏥 MediCare HMS</div>
      </nav>

      <div className="hero-section">
        <h1>Hospital Management System</h1>
        <p>A complete digital solution for modern healthcare — connecting admins, doctors, and patients in one seamless platform.</p>

        <div className="portal-cards">
          <div className="portal-card admin-card">
            <div className="portal-icon">🛡️</div>
            <h3>Admin Portal</h3>
            <p>Manage users, doctors, patients and monitor all hospital activities</p>
            <Link to="/admin/login" className="portal-btn admin-btn">Admin Login</Link>
          </div>

          <div className="portal-card doctor-card">
            <div className="portal-icon">👨‍⚕️</div>
            <h3>Doctor Portal</h3>
            <p>View appointments, manage schedules and issue prescriptions</p>
            <Link to="/doctor/login" className="portal-btn doctor-btn">Doctor Login</Link>
          </div>

          <div className="portal-card patient-card">
            <div className="portal-icon">🤒</div>
            <h3>Patient Portal</h3>
            <p>Book appointments, view history and manage your health records</p>
            <Link to="/patient/login" className="portal-btn patient-btn">Patient Login</Link>
          </div>
        </div>
      </div>

      <div className="features-section">
        <h2>Why Choose MediCare HMS?</h2>
        <div className="features-grid">
          {[
            { icon: '🔐', title: 'Secure Auth', desc: 'JWT-based separate authentication for each role' },
            { icon: '📊', title: 'Real-time Stats', desc: 'Live dashboards with key hospital metrics' },
            { icon: '📅', title: 'Smart Scheduling', desc: 'Conflict-free appointment booking system' },
            { icon: '💊', title: 'Prescriptions', desc: 'Digital prescription management for doctors' },
          ].map((f) => (
            <div key={f.title} className="feature-item">
              <div style={{ fontSize: 32, marginBottom: 10 }}>{f.icon}</div>
              <h4>{f.title}</h4>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
