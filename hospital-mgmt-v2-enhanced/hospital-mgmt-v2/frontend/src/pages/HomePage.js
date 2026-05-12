import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

/* ─── Data ──────────────────────────────────────── */
const FEATURES = [
  {
    icon: '📅',
    title: 'Appointment Booking',
    desc: 'Patients can book from doctor-defined available slots. No double-booking — only valid open slots are shown.',
  },
  {
    icon: '🗓️',
    title: 'Doctor Scheduling',
    desc: 'Doctors set weekly schedules and mark leave dates. Slots update automatically for patients.',
  },
  {
    icon: '✅',
    title: 'Doctor Verification',
    desc: 'Every doctor requires admin approval before they appear in the system. Verified badge on approval.',
  },
  {
    icon: '🔐',
    title: 'Secure Role Login',
    desc: 'Separate login portals for Patients, Doctors, and Admins — each with JWT-protected routes.',
  },
  {
    icon: '🏥',
    title: 'Appointment Approval',
    desc: 'Admin reviews and approves patient appointments before they are confirmed in the system.',
  },
  {
    icon: '👥',
    title: 'Patient Management',
    desc: 'Full patient profile management, appointment history, and prescription records in one place.',
  },
];

const SERVICES = [
  {
    icon: '🫀',
    name: 'Cardiology',
    desc: 'Heart disease consultation, ECG analysis, and cardiac care management.',
    tag: 'Available',
  },
  {
    icon: '🧠',
    name: 'Neurology',
    desc: 'Brain and nervous system disorders — diagnosis, scheduling, and follow-ups.',
    tag: 'Available',
  },
  {
    icon: '🦴',
    name: 'Orthopedics',
    desc: 'Bone, joint, and muscle care with specialist consultation and scheduling.',
    tag: 'Available',
  },
  {
    icon: '👁️',
    name: 'Ophthalmology',
    desc: 'Eye exams, vision tests, and eye care appointments managed digitally.',
    tag: 'Available',
  },
  {
    icon: '🦷',
    name: 'Dental',
    desc: 'Dental appointments, routine checkups, and oral health management.',
    tag: 'Available',
  },
  {
    icon: '🩺',
    name: 'General Medicine',
    desc: 'General health checkups, prescriptions, and specialist referrals.',
    tag: 'Available',
  },
];

const STATS = [
  { icon: '👨‍⚕️', number: '50+', label: 'Verified Doctors' },
  { icon: '🧑‍🤝‍🧑', number: '500+', label: 'Registered Patients' },
  { icon: '📋', number: '1200+', label: 'Appointments Managed' },
  { icon: '🏥', number: '10+', label: 'Departments' },
];

/* ─── Counter animation hook ───────────────────── */
function useCounter(target, duration = 1500) {
  const [count, setCount] = useState(0);
  const num = parseInt(target);

  useEffect(() => {
    if (!num) return;
    let start = 0;
    const step = Math.ceil(num / (duration / 30));
    const timer = setInterval(() => {
      start += step;
      if (start >= num) {
        setCount(num);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 30);
    return () => clearInterval(timer);
  }, [num, duration]);

  return count;
}

/* ─── Sub-components ────────────────────────────── */
const StatCard = ({ icon, number, label }) => {
  const suffix = number.replace(/[0-9]/g, '');
  const val = useCounter(parseInt(number), 1400);
  return (
    <div className="hp-stat-card">
      <div className="hp-stat-icon">{icon}</div>
      <div className="hp-stat-number">{val}{suffix}</div>
      <div className="hp-stat-label">{label}</div>
    </div>
  );
};

/* ─── Main Component ────────────────────────────── */
const HomePage = () => {

  const [theme, setTheme] = useState(
    localStorage.getItem('theme') || 'light'
  );

  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const [menuOpen, setMenuOpen] = useState(false);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  return (
  <div className={`hp-root ${theme === 'dark' ? 'dark-theme' : ''}`}>

      {/* ── Navbar ───────────────────────────────── */}
      <nav className="hp-navbar">
        <Link to="/" className="hp-nav-logo">
          <div className="hp-nav-logo-icon">🏥</div>
          <span className="hp-nav-logo-text">Medi<span>Care</span></span>
        </Link>

        <ul className="hp-nav-links">
          <li><a href="#home" onClick={e => { e.preventDefault(); scrollTo('home'); }}>Home</a></li>
          <li><a href="#features" onClick={e => { e.preventDefault(); scrollTo('features'); }}>Features</a></li>
          <li><a href="#services" onClick={e => { e.preventDefault(); scrollTo('services'); }}>Services</a></li>
          <li><a href="#about" onClick={e => { e.preventDefault(); scrollTo('about'); }}>About</a></li>
          <li><a href="#contact" onClick={e => { e.preventDefault(); scrollTo('contact'); }}>Contact</a></li>
        </ul>

        <div className="hp-nav-actions">
        <button className="hp-theme-toggle" onClick={toggleTheme}>
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          <Link to="/patient/login" className="hp-btn-outline">Login</Link>
          <Link to="/patient/login" className="hp-btn-solid">Get Started</Link>
        </div>

        <button
          className="hp-hamburger"
          aria-label="Menu"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      {/* Mobile nav dropdown */}
      {menuOpen && (
        <div style={{
          position: 'fixed', top: 68, left: 0, right: 0, zIndex: 99,
          background: '#fff', borderBottom: '1px solid #e2e8f0',
          padding: '16px 5%', display: 'flex', flexDirection: 'column', gap: 8,
          boxShadow: '0 4px 16px rgba(0,0,0,0.08)'
        }}>
          {['home', 'features', 'services', 'about', 'contact'].map(id => (
            <button key={id} onClick={() => scrollTo(id)} style={{
              textAlign: 'left', background: 'none', border: 'none',
              padding: '10px 0', fontSize: 15, fontWeight: 500,
              color: '#0f172a', cursor: 'pointer', textTransform: 'capitalize',
              fontFamily: 'Plus Jakarta Sans, sans-serif'
            }}>
              {id.charAt(0).toUpperCase() + id.slice(1)}
            </button>
          ))}
          <hr style={{ margin: '8px 0', borderColor: '#e2e8f0' }} />
          <Link to="/patient/login" style={{ color: '#1a56db', fontWeight: 600, fontSize: 15, textDecoration: 'none', padding: '8px 0' }} onClick={() => setMenuOpen(false)}>Patient Login</Link>
          <Link to="/doctor/login" style={{ color: '#1a56db', fontWeight: 600, fontSize: 15, textDecoration: 'none', padding: '8px 0' }} onClick={() => setMenuOpen(false)}>Doctor Login</Link>
          <Link to="/admin/login" style={{ color: '#64748b', fontWeight: 600, fontSize: 15, textDecoration: 'none', padding: '8px 0' }} onClick={() => setMenuOpen(false)}>Admin Login</Link>
        </div>
      )}

      {/* ── Hero ─────────────────────────────────── */}
      <section id="home" className="hp-hero">
        <div className="hp-hero-content">
          <div className="hp-hero-tag">
            <span className="hp-hero-tag-dot" />
            Hospital Management System
          </div>

          <h1 className="hp-hero-title">
            Smarter Healthcare,<br />
            <em>Simpler Management</em>
          </h1>

          <p className="hp-hero-subtitle">
            A complete hospital management platform with appointment scheduling,
            doctor verification, dynamic slot booking, and admin approval —
            all in one place.
          </p>

          <div className="hp-hero-buttons">
            <Link to="/patient/login" className="hp-hero-btn patient">
              🧑‍🤝‍🧑 Patient Login
            </Link>
            <Link to="/doctor/login" className="hp-hero-btn doctor">
              👨‍⚕️ Doctor Login
            </Link>
            <Link to="/admin/login" className="hp-hero-btn admin">
              🔑 Admin Login
            </Link>
          </div>
        </div>

        {/* Hero visual card */}
        <div className="hp-hero-visual">
          <div style={{ position: 'relative' }}>
            <div className="hp-float-badge top-left">
              <span className="hp-float-badge-icon">✅</span>
              Doctor Verified
            </div>

            <div className="hp-hero-card-float">
              <div className="hp-hero-card-header">
                <div className="hp-hero-avatar">👨‍⚕️</div>
                <div>
                  <div className="hp-hero-card-name">Dr. Arjun Sharma</div>
                  <div className="hp-hero-card-role">Cardiologist</div>
                </div>
                <span className="hp-hero-badge">Active</span>
              </div>

              {[
                { time: '9:00 AM', label: 'Mon–Wed', status: 'open' },
                { time: '2:00 PM', label: 'Tue–Thu', status: 'open' },
                { time: '11:00 AM', label: 'Friday', status: 'full' },
              ].map((slot, i) => (
                <div className="hp-hero-slot-row" key={i}>
                  <span className="hp-hero-slot-label">{slot.label}</span>
                  <span className="hp-hero-slot-val">{slot.time}</span>
                  <span className={`hp-hero-slot-tag ${slot.status}`}>
                    {slot.status === 'open' ? 'Open' : 'Full'}
                  </span>
                </div>
              ))}
            </div>

            <div className="hp-float-badge bottom-right">
              <span className="hp-float-badge-icon">📅</span>
              Slot Booked!
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ────────────────────────────────── */}
      <div className="hp-stats">
        <div className="hp-stats-grid">
          {STATS.map((s, i) => <StatCard key={i} {...s} />)}
        </div>
      </div>

      {/* ── Features ─────────────────────────────── */}
      <section id="features" className="hp-section">
        <div className="hp-section-inner">
          <div className="hp-section-header center">
            <div className="hp-section-label">What We Offer</div>
            <h2 className="hp-section-title">Built for Modern Healthcare</h2>
            <p className="hp-section-desc">
              Every feature is designed to reduce manual work and bring
              clarity to hospital operations — for patients, doctors, and admins alike.
            </p>
          </div>
          <div className="hp-features-grid">
            {FEATURES.map((f, i) => (
              <div className="hp-feature-card" key={i}>
                <div className="hp-feature-icon-wrap">{f.icon}</div>
                <div className="hp-feature-title">{f.title}</div>
                <div className="hp-feature-desc">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Services ─────────────────────────────── */}
      <section id="services" className="hp-section" style={{ background: '#fff' }}>
        <div className="hp-section-inner">
          <div className="hp-section-header center">
            <div className="hp-section-label">Departments</div>
            <h2 className="hp-section-title">Hospital Departments</h2>
            <p className="hp-section-desc">
              Browse our specialized departments and book appointments with
              verified doctors from any specialty.
            </p>
          </div>
          <div className="hp-services-grid">
            {SERVICES.map((s, i) => (
              <div className="hp-service-card" key={i}>
                <div className="hp-service-icon">{s.icon}</div>
                <div className="hp-service-name">{s.name}</div>
                <div className="hp-service-desc">{s.desc}</div>
                <span className="hp-service-tag">✓ {s.tag}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── About ────────────────────────────────── */}
      <section id="about" className="hp-section hp-about">
        <div className="hp-section-inner">
          <div className="hp-about-grid">
            <div className="hp-about-text">
              <div className="hp-section-label">About the System</div>
              <h2 className="hp-section-title">A Complete Hospital Workflow Solution</h2>
              <p>
                MediCare HMS is a full-stack MERN project built to simulate
                a real hospital management environment. It covers end-to-end
                workflows from patient registration to appointment approval.
              </p>
              <p>
                The system supports three distinct roles — Patient, Doctor,
                and Admin — each with their own protected dashboard and
                dedicated operations. Doctors are onboarded through an
                admin verification step before they can accept appointments.
              </p>
              <div className="hp-about-checks">
                {[
                  'JWT-based authentication for all roles',
                  'Doctor approval workflow via Admin panel',
                  'Dynamic slot booking with conflict prevention',
                  'Admin-controlled appointment approval',
                  'Responsive UI for all screen sizes',
                ].map((item, i) => (
                  <div className="hp-about-check" key={i}>
                    <div className="hp-about-check-icon">✓</div>
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="hp-about-visual">
              {[
                { icon: '🔐', val: '3', label: 'User Roles' },
                { icon: '⚡', val: 'MERN', label: 'Tech Stack' },
                { icon: '📋', val: 'REST', label: 'API Type' },
                { icon: '🛡️', val: 'JWT', label: 'Auth Method' },
              ].map((c, i) => (
                <div className="hp-about-mini-card" key={i}>
                  <div className="hp-about-mini-icon">{c.icon}</div>
                  <div className="hp-about-mini-val">{c.val}</div>
                  <div className="hp-about-mini-label">{c.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA / Contact ────────────────────────── */}
      <section id="contact" className="hp-cta">
        <div className="hp-cta-inner">
          <h2>Ready to Get Started?</h2>
          <p>
            Choose your role and log in to access your dashboard.
            New users can register as a patient or doctor directly from the login page.
          </p>
          <div className="hp-cta-buttons">
            <Link to="/patient/login" className="hp-cta-btn primary">
              🧑‍🤝‍🧑 Patient Portal
            </Link>
            <Link to="/doctor/login" className="hp-cta-btn ghost">
              👨‍⚕️ Doctor Portal
            </Link>
            <Link to="/admin/login" className="hp-cta-btn ghost">
              🔑 Admin Portal
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────── */}
      <footer className="hp-footer">
        <div className="hp-footer-top">
          <div>
            <div className="hp-footer-logo-text">Medi<span>Care</span> HMS</div>
            <p className="hp-footer-brand-desc">
              A student-built MERN stack hospital management system with
              full role-based access, appointment workflows, and doctor verification.
            </p>
          </div>

          <div>
            <div className="hp-footer-col-title">Portals</div>
            <ul className="hp-footer-links">
              <li><Link to="/patient/login">Patient Login</Link></li>
              <li><Link to="/doctor/login">Doctor Login</Link></li>
              <li><Link to="/admin/login">Admin Login</Link></li>
            </ul>
          </div>

          <div>
            <div className="hp-footer-col-title">System</div>
            <ul className="hp-footer-links">
              <li><a href="#features" onClick={e => { e.preventDefault(); scrollTo('features'); }}>Features</a></li>
              <li><a href="#services" onClick={e => { e.preventDefault(); scrollTo('services'); }}>Services</a></li>
              <li><a href="#about" onClick={e => { e.preventDefault(); scrollTo('about'); }}>About</a></li>
            </ul>
          </div>

          <div>
            <div className="hp-footer-col-title">Tech Stack</div>
            <ul className="hp-footer-links">
              <li><a href="#about">MongoDB</a></li>
              <li><a href="#about">Express.js</a></li>
              <li><a href="#about">React.js</a></li>
              <li><a href="#about">Node.js</a></li>
            </ul>
          </div>
        </div>

        <div className="hp-footer-bottom">
          <span>© 2026 MediCare Hospital Management System</span>
          <span>Built with React · Node · MongoDB</span>
        </div>
      </footer>

    </div>
  );
};

export default HomePage;
