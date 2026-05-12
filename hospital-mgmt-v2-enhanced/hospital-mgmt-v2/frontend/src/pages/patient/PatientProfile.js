import React, { useState, useEffect } from 'react';
import { getPatientProfile, updatePatientProfile } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { PatientSidebar } from './PatientDashboard';
import './Patient.css';

const PatientProfile = () => {
  const { updateUser } = useAuth();
  const [form, setForm] = useState({ name: '', phone: '', address: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ text: '', type: '' });

  useEffect(() => {
    getPatientProfile().then((res) => {
      const u = res.data.user;
      setForm({ name: u.name || '', phone: u.phone || '', address: u.address || '' });
    }).finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg({ text: '', type: '' });
    try {
      const res = await updatePatientProfile(form);
      updateUser(res.data);
      setMsg({ text: 'Profile updated successfully!', type: 'success' });
    } catch (err) {
      setMsg({ text: err.response?.data?.message || 'Update failed', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="dashboard-layout">
      <PatientSidebar active="My Profile" />
      <div className="main-content">
        <div className="page-header">
          <h1>My Profile</h1>
          <p>Update your personal information</p>
        </div>
        <div className="form-card" style={{ maxWidth: 520 }}>
          <h2>Personal Details</h2>
          {msg.text && (
            <div style={{ padding: '12px', borderRadius: 8, marginBottom: 16, fontSize: 13,
              background: msg.type === 'success' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
              color: msg.type === 'success' ? '#34d399' : '#f87171',
              border: `1px solid ${msg.type === 'success' ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}` }}>
              {msg.text}
            </div>
          )}
          {loading ? <div className="empty-state">Loading...</div> : (
            <form onSubmit={handleSubmit}>
              <div className="form-field">
                <label>Full Name</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" />
              </div>
              <div className="form-field">
                <label>Phone Number</label>
                <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+91 XXXXXXXXXX" />
              </div>
              <div className="form-field">
                <label>Address</label>
                <textarea rows={3} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })}
                  placeholder="Your address" style={{ resize: 'vertical' }} />
              </div>
              <button type="submit" className="submit-btn blue" disabled={saving}>{saving ? 'Saving...' : '💾 Save Profile'}</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;
