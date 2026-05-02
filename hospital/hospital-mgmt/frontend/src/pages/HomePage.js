import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiActivity, FiCalendar, FiShield, FiUsers } from 'react-icons/fi';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="home">
      {/* Navbar */}
      <nav className="home-nav">
        <div className="home-logo">
          <span className="logo-badge">+</span>
          MediCare HMS
        </div>
        <div className="nav-links">
          <Link to="/login" className="btn btn-outline">Sign In</Link>
          <Link to="/register" className="btn btn-primary">Get Started</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="hero-badge">🏥 Hospital Management System</div>
        <h1 className="hero-title">
          Modern Healthcare,<br />
          <span className="gradient-text">Simplified.</span>
        </h1>
        <p className="hero-desc">
          Streamline patient care, doctor scheduling, and hospital operations with our
          all-in-one MERN stack management platform.
        </p>
        <div className="hero-cta">
          <Link to="/register" className="btn btn-primary btn-lg">
            Start Now <FiArrowRight />
          </Link>
          <Link to="/login" className="btn btn-outline btn-lg">Sign In</Link>
        </div>

        {/* Stats */}
        <div className="hero-stats">
          {[
            { val: '500+', label: 'Patients Managed' },
            { val: '50+', label: 'Specialist Doctors' },
            { val: '99.9%', label: 'System Uptime' },
            { val: '24/7', label: 'Support' },
          ].map((s) => (
            <div key={s.label} className="stat-item">
              <div className="stat-val">{s.val}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="features">
        <h2 className="section-title">Everything you need</h2>
        <p className="section-sub">A complete system for modern hospital management</p>
        <div className="features-grid">
          {[
            { icon: <FiActivity />, title: 'Patient Records', desc: 'Complete digital health records including medical history, allergies, and prescriptions.' },
            { icon: <FiCalendar />, title: 'Appointment Booking', desc: 'Easy online appointment scheduling with real-time availability and conflict detection.' },
            { icon: <FiUsers />, title: 'Doctor Management', desc: 'Manage specialist doctors, their schedules, and consultation fees effortlessly.' },
            { icon: <FiShield />, title: 'Secure & Role-Based', desc: 'JWT authentication with role-based access for patients, doctors, and admins.' },
          ].map((f) => (
            <div key={f.title} className="feature-card">
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <h2>Ready to modernize your hospital?</h2>
        <p>Join thousands of healthcare professionals using MediCare HMS</p>
        <Link to="/register" className="btn btn-primary btn-lg">
          Create Free Account <FiArrowRight />
        </Link>
      </section>

      <footer className="home-footer">
        <p>© 2024 MediCare HMS — Hospital Management System | Built with MERN Stack</p>
      </footer>
    </div>
  );
};

export default HomePage;
