import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Doctor.css';

const DoctorLogin = () => {
  const { loginAs, user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (user && user.role === 'doctor') navigate('/doctor/dashboard');
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await loginAs('doctor', form.email, form.password);
      navigate('/doctor/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container doctor-theme">
      <div className="auth-card">
        <div className="auth-icon">👨‍⚕️</div>
        <h1>Doctor Portal</h1>
        <p className="auth-subtitle">Hospital Management System</p>
        {error && <div className="auth-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" placeholder="doctor@hospital.com" required
              value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" placeholder="Enter your password" required
              value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </div>
          <button type="submit" className="auth-btn doctor-btn" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In as Doctor'}
          </button>
        </form>
        <div className="auth-links">
          <Link to="/">← Back to Home</Link>
        </div>
      </div>
    </div>
  );
};

export default DoctorLogin;
