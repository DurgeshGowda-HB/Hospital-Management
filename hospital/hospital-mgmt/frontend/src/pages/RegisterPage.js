import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import './AuthPages.css';

const RegisterPage = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', phone: '', role: 'patient' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) return toast.error('Please fill all required fields');
    if (form.password !== form.confirmPassword) return toast.error('Passwords do not match');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');

    setLoading(true);
    try {
      await register({ name: form.name, email: form.email, password: form.password, phone: form.phone, role: form.role });
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-branding">
          <div className="auth-logo"><span>+</span> MediCare HMS</div>
          <h2>Join Our Healthcare Network</h2>
          <p>Register as a patient or healthcare professional and experience seamless hospital management.</p>
          <div className="auth-features">
            {['Secure JWT Authentication', 'Role-based Access Control', 'Complete Health Records', 'Easy Appointment Booking'].map((f) => (
              <div key={f} className="auth-feature-item">
                <span className="check">✓</span> {f}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card">
          <h1>Create Account</h1>
          <p className="auth-sub">Fill in your details to get started</p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name *</label>
              <input type="text" name="name" className="form-control" placeholder="Dr. John Doe" value={form.name} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Email Address *</label>
              <input type="email" name="email" className="form-control" placeholder="you@example.com" value={form.email} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input type="tel" name="phone" className="form-control" placeholder="+91 98765 43210" value={form.phone} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Register As</label>
              <select name="role" className="form-control" value={form.role} onChange={handleChange}>
                <option value="patient">Patient</option>
                <option value="doctor">Doctor</option>
              </select>
            </div>
            <div className="grid-2">
              <div className="form-group">
                <label>Password *</label>
                <input type="password" name="password" className="form-control" placeholder="Min. 6 characters" value={form.password} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Confirm Password *</label>
                <input type="password" name="confirmPassword" className="form-control" placeholder="Repeat password" value={form.confirmPassword} onChange={handleChange} />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px', marginTop: '4px' }} disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <p className="auth-switch">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
