import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { registerPatient } from '../../services/api';
import './Patient.css';

const PatientLogin = () => {
  const { loginAs, user } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (user && user.role === 'patient') navigate('/patient/dashboard');
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') {
        await loginAs('patient', form.email, form.password);
        navigate('/patient/dashboard');
      } else {
        await registerPatient(form);
        await loginAs('patient', form.email, form.password);
        navigate('/patient/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container patient-theme">
      <div className="auth-card">
        <div className="auth-icon"></div>
        <h1>Patient Portal</h1>
        <p className="auth-subtitle">Hospital Management System</p>

        <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
          <button onClick={() => { setMode('login'); setError(''); }}
            style={{ flex: 1, padding: '10px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600,
              background: mode === 'login' ? '#3b82f6' : 'rgba(255,255,255,0.08)',
              color: mode === 'login' ? '#fff' : 'rgba(255,255,255,0.5)' }}>
            Sign In
          </button>
          <button onClick={() => { setMode('register'); setError(''); }}
            style={{ flex: 1, padding: '10px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600,
              background: mode === 'register' ? '#3b82f6' : 'rgba(255,255,255,0.08)',
              color: mode === 'register' ? '#fff' : 'rgba(255,255,255,0.5)' }}>
            Register
          </button>
        </div>

        {error && <div className="auth-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          {mode === 'register' && (
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" placeholder="John Doe" required
                value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
          )}
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" placeholder="patient@email.com" required
              value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          {mode === 'register' && (
            <div className="form-group">
              <label>Phone Number</label>
              <input type="tel" placeholder="+91 9876543210"
                value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
          )}
          <div className="form-group">
            <label>Password</label>
            <input type="password" placeholder="Enter your password" required
              value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </div>
          <button type="submit" className="auth-btn patient-btn" disabled={loading}>
            {loading ? 'Please wait...' : mode === 'login' ? 'Sign In as Patient' : 'Create Account'}
          </button>
        </form>
        <div className="auth-links">
          <Link to="/">← Back to Home</Link>
        </div>
      </div>
    </div>
  );
};

export default PatientLogin;
