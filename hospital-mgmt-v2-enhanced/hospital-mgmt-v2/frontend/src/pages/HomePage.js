import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

/* ─── Data ──────────────────────────────────────── */
const FEATURES = [
  {
    icon: '📅',
    title: 'Easy Appointment Booking',
    desc: 'Book your doctor appointments online in just a few clicks. Choose from available time slots that work best for your schedule.',
  },
  {
    icon: '✅',
    title: 'Verified Doctors',
    desc: 'All our doctors are board-certified and thoroughly verified. Trust qualified healthcare professionals for your medical needs.',
  },
  {
    icon: '💬',
    title: 'Online Consultation',
    desc: 'Connect with doctors from the comfort of your home. Virtual consultations available for non-emergency medical concerns.',
  },
  {
    icon: '�️',
    title: 'Schedule Management',
    desc: 'View doctor availability in real-time and manage your appointments easily. Get reminders before your scheduled visits.',
  },
  {
    icon: '🏥',
    title: 'Multiple Departments',
    desc: 'Access specialized care across various medical departments including cardiology, neurology, orthopedics, and more.',
  },
  {
    icon: '�',
    title: 'Patient Support',
    desc: 'Our dedicated support team is here to help you with appointment booking, rescheduling, and any healthcare inquiries.',
  },
];

const SERVICES = [
  {
    icon: '🫀',
    name: 'Cardiology',
    desc: 'Advanced cardiac care including preventive screenings, diagnostic ECG, and comprehensive heart disease management by certified specialists.',
    tag: 'Available',
  },
  {
    icon: '🧠',
    name: 'Neurology',
    desc: 'Expert diagnosis and treatment for neurological conditions with state-of-the-art imaging and personalized care plans for brain health.',
    tag: 'Available',
  },
  {
    icon: '🦴',
    name: 'Orthopedics',
    desc: 'Specialized musculoskeletal care covering sports injuries, joint replacement, and rehabilitation with experienced orthopedic surgeons.',
    tag: 'Available',
  },
  {
    icon: '👁️',
    name: 'Ophthalmology',
    desc: 'Comprehensive eye care services including vision correction, cataract surgery, and routine eye examinations with modern diagnostic technology.',
    tag: 'Available',
  },
  {
    icon: '🦷',
    name: 'Dental Care',
    desc: 'Complete oral health services from preventive care and cosmetic dentistry to advanced restorative procedures by qualified dental professionals.',
    tag: 'Available',
  },
  {
    icon: '🩺',
    name: 'Internal Medicine',
    desc: 'Primary care and specialized treatment for adult health conditions with focus on preventive medicine and chronic disease management.',
    tag: 'Available',
  },
];

const STATS = [
  { icon: '👨‍⚕️', number: '50+', label: 'Board-Certified Specialists' },
  { icon: '🧑‍🤝‍🧑', number: '500+', label: 'Active Patients' },
  { icon: '📋', number: '1200+', label: 'Successful Consultations' },
  { icon: '🏥', number: '10+', label: 'Medical Departments' },
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
          <Link to="/patient/login" style={{ color: '#1a56db', fontWeight: 600, fontSize: 15, textDecoration: 'none', padding: '8px 0' }} onClick={() => setMenuOpen(false)}>Patient Portal</Link>
          <Link to="/doctor/login" style={{ color: '#1a56db', fontWeight: 600, fontSize: 15, textDecoration: 'none', padding: '8px 0' }} onClick={() => setMenuOpen(false)}>Doctor Portal</Link>
          <Link to="/admin/login" style={{ color: '#64748b', fontWeight: 600, fontSize: 15, textDecoration: 'none', padding: '8px 0' }} onClick={() => setMenuOpen(false)}>Admin Access</Link>
        </div>
      )}

      {/* ── Hero ─────────────────────────────────── */}
      <section id="home" className="hp-hero">
        <div className="hp-hero-content">
          <div className="hp-hero-tag">
            <span className="hp-hero-tag-dot" />
            Trusted Healthcare Services
          </div>

          <h1 className="hp-hero-title">
            Your Health, Our Priority<br />
            <em>Book Appointments Online</em>
          </h1>

          <p className="hp-hero-subtitle">
            Schedule doctor consultations with verified specialists at your convenience.
            Easy online booking, real-time availability, and quality healthcare services —
            all designed for your wellbeing.
          </p>

          <div className="hp-hero-buttons">
            <Link to="/patient/login" className="hp-hero-btn patient">
              Book Appointment
            </Link>
            <Link to="/patient/login" className="hp-hero-btn doctor">
              View Doctors
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
            <div className="hp-section-label">Why Choose Us</div>
            <h2 className="hp-section-title">Quality Healthcare Services</h2>
            <p className="hp-section-desc">
              We make it simple to connect with doctors and manage your health appointments.
              Experience hassle-free healthcare booking with trusted medical professionals.
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
            <div className="hp-section-label">Medical Specialties</div>
            <h2 className="hp-section-title">Comprehensive Care Departments</h2>
            <p className="hp-section-desc">
              Access specialized healthcare services across multiple departments with board-certified physicians
              dedicated to delivering exceptional patient outcomes through evidence-based medicine.
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
              <div className="hp-section-label">About MediCare</div>
              <h2 className="hp-section-title">Your Trusted Healthcare Partner</h2>
              <p>
                MediCare Hospital is dedicated to providing exceptional healthcare services
                with compassion and expertise. Our team of qualified doctors and medical professionals
                are committed to your health and wellbeing.
              </p>
              <p>
                We offer convenient online appointment booking, verified specialist consultations,
                and comprehensive care across multiple medical departments. Your health journey
                is our priority, and we strive to make healthcare accessible and stress-free.
              </p>
              <div className="hp-about-checks">
                {[
                  'Board-certified doctors and specialists',
                  'Easy online appointment scheduling',
                  'Multiple medical departments under one roof',
                  'Patient-centered care approach',
                  '24/7 appointment booking available',
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
                { icon: '�‍⚕️', val: '50+', label: 'Expert Doctors' },
                { icon: '🏥', val: '10+', label: 'Departments' },
                { icon: '🧑‍🤝‍🧑', val: '500+', label: 'Happy Patients' },
                { icon: '⭐', val: '4.8', label: 'Patient Rating' },
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
          <h2>Ready to Book Your Appointment?</h2>
          <p>
            Take the first step towards better health. Schedule your consultation with
            our verified doctors today. New patients can register and book appointments easily.
          </p>
          <div className="hp-cta-buttons">
            <Link to="/patient/login" className="hp-cta-btn primary">
              Book Appointment
            </Link>
            <Link to="/patient/login" className="hp-cta-btn ghost">
              View Doctors
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────── */}
      <footer className="hp-footer">
        <div className="hp-footer-top">
          <div>
            <div className="hp-footer-logo-text">Medi<span>Care</span> Hospital</div>
            <p className="hp-footer-brand-desc">
              Your trusted healthcare partner providing quality medical services
              with verified doctors and convenient online appointment booking.
              Your health is our priority.
            </p>
          </div>

          <div>
            <div className="hp-footer-col-title">Quick Links</div>
            <ul className="hp-footer-links">
              <li><Link to="/patient/login">Book Appointment</Link></li>
              <li><Link to="/patient/login">View Doctors</Link></li>
              <li><Link to="/patient/login">Patient Login</Link></li>
             
            </ul>
          </div>

          <div>
            <div className="hp-footer-col-title">Services</div>
            <ul className="hp-footer-links">
              <li><a href="#services" onClick={e => { e.preventDefault(); scrollTo('services'); }}>Departments</a></li>
              <li><a href="#features" onClick={e => { e.preventDefault(); scrollTo('features'); }}>Features</a></li>
              <li><a href="#about" onClick={e => { e.preventDefault(); scrollTo('about'); }}>About Us</a></li>
            </ul>
          </div>

          <div>
            <div className="hp-footer-col-title">Contact</div>
            <ul className="hp-footer-links">
              <li>📞 +1 (555) 123-4567</li>
              <li>📧 info@medicarehospital.com</li>
              <li>📍 123 Healthcare Ave, Medical City</li>
            </ul>
          </div>
        </div>

        <div className="hp-footer-bottom">
          <span>© 2026 MediCare Hospital. All Rights Reserved.</span>
          <span>Caring for Your Health, Every Day</span>
        </div>
      </footer>

    </div>
  );
};

export default HomePage;
    