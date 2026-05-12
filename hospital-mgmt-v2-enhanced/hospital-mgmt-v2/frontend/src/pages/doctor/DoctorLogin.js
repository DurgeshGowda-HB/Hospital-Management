import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { registerDoctor } from '../../services/api';
import './Doctor.css';

const ALL_DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];

const DoctorLogin = () => {
  const { loginAs, user } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ email: '', password: '' });
  const [regForm, setRegForm] = useState({
    name: '', email: '', password: '', phone: '',
    specialization: '', department: '', qualification: '',
    experience: 0, consultationFee: 500, licenseNumber: '', bio: '',
    availableDays: ['Monday','Tuesday','Wednesday','Thursday','Friday'],
    startTime: '09:00', endTime: '17:00', slotDuration: 30,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (user && user.role === 'doctor') navigate('/doctor/dashboard');
  }, [user, navigate]);

  const toggleDay = (day) => {
    setRegForm((f) => ({
      ...f,
      availableDays: f.availableDays.includes(day)
        ? f.availableDays.filter((d) => d !== day)
        : [...f.availableDays, day],
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await loginAs('doctor', form.email, form.password);
      navigate('/doctor/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(''); setSuccess(''); setLoading(true);
    try {
      const payload = {
        ...regForm,
        qualification: regForm.qualification.split(',').map((q) => q.trim()).filter(Boolean),
        experience: Number(regForm.experience),
        consultationFee: Number(regForm.consultationFee),
        slotDuration: Number(regForm.slotDuration),
      };
      await registerDoctor(payload);
      setSuccess('Registration successful! Your profile is pending admin verification. You can now log in.');
      setMode('login');
      setForm({ email: regForm.email, password: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-container doctor-theme">
      <div className="auth-card" style={{ maxWidth: mode === 'register' ? 580 : 420 }}>
        <div className="auth-icon">👨‍⚕️</div>
        <h1>Doctor Portal</h1>
        <p className="auth-subtitle">Hospital Management System</p>

        <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
          <button onClick={() => { setMode('login'); setError(''); setSuccess(''); }}
            style={{ flex: 1, padding: '10px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600,
              background: mode === 'login' ? '#10b981' : 'rgba(255,255,255,0.08)',
              color: mode === 'login' ? '#fff' : 'rgba(255,255,255,0.5)' }}>
            Sign In
          </button>
          <button onClick={() => { setMode('register'); setError(''); setSuccess(''); }}
            style={{ flex: 1, padding: '10px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600,
              background: mode === 'register' ? '#10b981' : 'rgba(255,255,255,0.08)',
              color: mode === 'register' ? '#fff' : 'rgba(255,255,255,0.5)' }}>
            Register
          </button>
        </div>

        {error && <div className="auth-error">{error}</div>}
        {success && <div className="auth-success">{success}</div>}

        {mode === 'login' ? (
          <form onSubmit={handleLogin}>
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
        ) : (
          <form onSubmit={handleRegister} style={{ textAlign: 'left' }}>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, marginBottom: 14, padding: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: 8 }}>
              ℹ️ After registration, your profile will be reviewed by admin before you appear to patients.
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group">
                <label>Full Name *</label>
                <input required placeholder="Dr. John Smith"
                  value={regForm.name} onChange={(e) => setRegForm({ ...regForm, name: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input type="email" required placeholder="doctor@email.com"
                  value={regForm.email} onChange={(e) => setRegForm({ ...regForm, email: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Password *</label>
                <input type="password" required placeholder="Min 6 characters"
                  value={regForm.password} onChange={(e) => setRegForm({ ...regForm, password: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input placeholder="+91 XXXXXXXXXX"
                  value={regForm.phone} onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Specialization *</label>
                <input required placeholder="e.g. Cardiology"
                  value={regForm.specialization} onChange={(e) => setRegForm({ ...regForm, specialization: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Department</label>
                <input placeholder="e.g. Cardiology Dept"
                  value={regForm.department} onChange={(e) => setRegForm({ ...regForm, department: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Qualification (comma separated)</label>
                <input placeholder="MBBS, MD, DM"
                  value={regForm.qualification} onChange={(e) => setRegForm({ ...regForm, qualification: e.target.value })} />
              </div>
              <div className="form-group">
                <label>License Number</label>
                <input placeholder="Medical license #"
                  value={regForm.licenseNumber} onChange={(e) => setRegForm({ ...regForm, licenseNumber: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Experience (years)</label>
                <input type="number" min="0"
                  value={regForm.experience} onChange={(e) => setRegForm({ ...regForm, experience: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Consultation Fee (₹)</label>
                <input type="number" min="0"
                  value={regForm.consultationFee} onChange={(e) => setRegForm({ ...regForm, consultationFee: e.target.value })} />
              </div>
            </div>

            <div className="form-group">
              <label>Bio / About</label>
              <textarea rows={2} placeholder="Brief professional introduction..."
                value={regForm.bio} onChange={(e) => setRegForm({ ...regForm, bio: e.target.value })}
                style={{ resize: 'vertical' }} />
            </div>

            <div className="form-group">
              <label>Available Days</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 6 }}>
                {ALL_DAYS.map((day) => (
                  <button key={day} type="button" onClick={() => toggleDay(day)}
                    style={{
                      padding: '6px 12px', borderRadius: 7, cursor: 'pointer', fontSize: 12,
                      border: `2px solid ${regForm.availableDays.includes(day) ? '#10b981' : 'rgba(255,255,255,0.2)'}`,
                      background: regForm.availableDays.includes(day) ? 'rgba(16,185,129,0.2)' : 'transparent',
                      color: regForm.availableDays.includes(day) ? '#6ee7b7' : 'rgba(255,255,255,0.4)',
                      fontWeight: regForm.availableDays.includes(day) ? 700 : 400,
                    }}>
                    {day.slice(0, 3)}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
              <div className="form-group">
                <label>Start Time</label>
                <input type="time"
                  value={regForm.startTime} onChange={(e) => setRegForm({ ...regForm, startTime: e.target.value })} />
              </div>
              <div className="form-group">
                <label>End Time</label>
                <input type="time"
                  value={regForm.endTime} onChange={(e) => setRegForm({ ...regForm, endTime: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Slot Duration</label>
                <select value={regForm.slotDuration} onChange={(e) => setRegForm({ ...regForm, slotDuration: Number(e.target.value) })}>
                  <option value={15}>15 mins</option>
                  <option value={20}>20 mins</option>
                  <option value={30}>30 mins</option>
                  <option value={45}>45 mins</option>
                  <option value={60}>60 mins</option>
                </select>
              </div>
            </div>

            <button type="submit" className="auth-btn doctor-btn" disabled={loading}>
              {loading ? 'Registering...' : '📋 Register as Doctor'}
            </button>
          </form>
        )}

        <div className="auth-links" style={{ marginTop: 16 }}>
          <Link to="/">← Back to Home</Link>
        </div>
      </div>
    </div>
  );
};

export default DoctorLogin;
