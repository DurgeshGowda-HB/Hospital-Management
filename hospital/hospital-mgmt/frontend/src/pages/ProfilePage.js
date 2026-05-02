import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { profileAPI } from '../utils/api';
import { FiUser, FiLock, FiSave } from 'react-icons/fi';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [tab, setTab] = useState('profile');
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '', address: user?.address || '' });
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await profileAPI.update(form);
      updateUser(data);
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirmPassword) return toast.error('New passwords do not match');
    if (pwForm.newPassword.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      await profileAPI.changePassword({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword });
      toast.success('Password changed successfully!');
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Password change failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-title">My Profile</div>
      <p className="page-subtitle">Manage your account information and security settings</p>

      {/* Profile Header */}
      <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 24 }}>
        <div style={{ width: 80, height: 80, background: 'linear-gradient(135deg, var(--teal-dark), var(--teal))', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 800, color: 'var(--navy)', fontFamily: 'Syne, sans-serif' }}>
          {user?.name?.charAt(0)?.toUpperCase()}
        </div>
        <div>
          <div style={{ fontSize: '1.3rem', fontWeight: 700, fontFamily: 'Syne, sans-serif' }}>{user?.name}</div>
          <div style={{ color: 'var(--gray)', fontSize: '0.88rem' }}>{user?.email}</div>
          <span className="badge" style={{ marginTop: 8, background: 'rgba(0,180,216,0.1)', color: 'var(--teal)' }}>
            {user?.role?.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: 'var(--navy-mid)', borderRadius: 10, padding: 4, width: 'fit-content' }}>
        {[
          { id: 'profile', icon: <FiUser />, label: 'Profile Info' },
          { id: 'password', icon: <FiLock />, label: 'Change Password' },
        ].map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '8px 20px', borderRadius: 8,
            background: tab === t.id ? 'rgba(0,180,216,0.15)' : 'none',
            color: tab === t.id ? 'var(--teal)' : 'var(--gray)',
            fontWeight: 500, fontSize: '0.88rem', transition: 'all 0.2s',
            border: tab === t.id ? '1px solid rgba(0,180,216,0.2)' : '1px solid transparent',
          }}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {tab === 'profile' && (
        <div className="card" style={{ maxWidth: 560 }}>
          <h3 style={{ fontFamily: 'Syne, sans-serif', marginBottom: 24 }}>Personal Information</h3>
          <form onSubmit={handleProfileUpdate}>
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" className="form-control" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" className="form-control" value={user?.email} disabled style={{ opacity: 0.5 }} />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input type="tel" className="form-control" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+91 98765 43210" />
            </div>
            <div className="form-group">
              <label>Address</label>
              <textarea className="form-control" rows={3} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Your address" />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              <FiSave /> {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      )}

      {tab === 'password' && (
        <div className="card" style={{ maxWidth: 480 }}>
          <h3 style={{ fontFamily: 'Syne, sans-serif', marginBottom: 24 }}>Change Password</h3>
          <form onSubmit={handlePasswordChange}>
            {['currentPassword', 'newPassword', 'confirmPassword'].map((field) => (
              <div key={field} className="form-group">
                <label>{field === 'currentPassword' ? 'Current Password' : field === 'newPassword' ? 'New Password' : 'Confirm New Password'}</label>
                <input
                  type="password" className="form-control"
                  value={pwForm[field]}
                  onChange={(e) => setPwForm({ ...pwForm, [field]: e.target.value })}
                  placeholder="••••••••"
                />
              </div>
            ))}
            <button type="submit" className="btn btn-primary" disabled={loading}>
              <FiLock /> {loading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
