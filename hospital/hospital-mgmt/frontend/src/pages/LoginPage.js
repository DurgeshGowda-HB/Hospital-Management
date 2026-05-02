import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import './AuthPages.css';

const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return toast.error('Please fill in all fields');
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-branding">
          <div className="auth-logo">
            <span>+</span> MediCare HMS
          </div>
          <h2>Your Health, Our Priority</h2>
          <p>Access your hospital management system with complete security and ease.</p>
          <div className="auth-features">
            {['Patient Records Management', 'Appointment Booking', 'Doctor Directory', 'Admin Control Panel'].map((f) => (
              <div key={f} className="auth-feature-item">
                <span className="check">✓</span> {f}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card">
          <h1>Welcome Back</h1>
          <p className="auth-sub">Sign in to your account</p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email" name="email" className="form-control"
                placeholder="doctor@hospital.com"
                value={form.email} onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password" name="password" className="form-control"
                placeholder="Enter your password"
                value={form.password} onChange={handleChange}
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px', marginTop: '8px' }} disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="auth-divider">Demo Accounts</div>
          <div className="demo-accounts">
            <div className="demo-badge" onClick={() => setForm({ email: 'admin@hospital.com', password: 'admin123' })}>
              Admin
            </div>
            <div className="demo-badge" onClick={() => setForm({ email: 'doctor@hospital.com', password: 'doctor123' })}>
              Doctor
            </div>
            <div className="demo-badge" onClick={() => setForm({ email: 'patient@hospital.com', password: 'patient123' })}>
              Patient
            </div>
          </div>

          <p className="auth-switch">
            Don't have an account? <Link to="/register">Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
