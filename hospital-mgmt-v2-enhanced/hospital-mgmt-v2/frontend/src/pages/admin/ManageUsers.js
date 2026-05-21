import React, { useState, useEffect } from 'react';
import { getAdminUsers, updateAdminUser, deleteAdminUser } from '../../services/api';
import { AdminSidebar } from './AdminDashboard';
import './Admin.css';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [msg, setMsg] = useState({ text: '', type: '' });

  useEffect(() => {
    getAdminUsers().then((res) => setUsers(res.data)).finally(() => setLoading(false));
  }, []);

  const showMsg = (text, type = 'success') => {
    setMsg({ text, type });
    setTimeout(() => setMsg({ text: '', type: '' }), 3000);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Permanently delete this user?')) return;
    try {
      await deleteAdminUser(id);
      setUsers(users.filter((u) => u._id !== id));
      showMsg('User deleted successfully');
    } catch {
      showMsg('Delete failed', 'error');
    }
  };

  const handleToggleActive = async (user) => {
    try {
      const updated = await updateAdminUser(user._id, { isActive: !user.isActive });
      setUsers(users.map((u) => (u._id === user._id ? updated.data : u)));
      showMsg(`User ${!user.isActive ? 'activated' : 'deactivated'} successfully`);
    } catch {
      showMsg('Update failed', 'error');
    }
  };

  const filtered = users.filter((u) => {
    const matchSearch = !search ||
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  return (
    <div className="dashboard-layout">
      <AdminSidebar active="Manage Users" />
      <div className="main-content">
        <div className="page-header">
          <h1>Manage Users</h1>
          <p>View and manage all system users</p>
        </div>

        {msg.text && (
          <div style={{ padding: '12px 16px', borderRadius: 8, marginBottom: 16, fontSize: 13,
            background: msg.type === 'success' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
            color: msg.type === 'success' ? '#34d399' : '#f87171',
            border: `1px solid ${msg.type === 'success' ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}` }}>
            {msg.text}
          </div>
        )}

        <div className="section-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
            <div className="section-title" style={{ margin: 0 }}>All Users ({filtered.length})</div>
            <div style={{ display: 'flex', gap: 10 }}>
              <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}
                style={{ padding: '8px 14px', background: '#0f172a', border: '1px solid #334155', borderRadius: 8, color: '#e2e8f0', fontSize: 13 }}>
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="doctor">Doctor</option>
                <option value="patient">Patient</option>
              </select>
              <input placeholder="Search users..." value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ padding: '8px 14px', background: '#0f172a', border: '1px solid #334155', borderRadius: 8, color: '#e2e8f0', fontSize: 13, width: 180 }} />
            </div>
          </div>

          {loading ? <div className="empty-state">Loading...</div> : (
            <table className="data-table">
              <thead>
                <tr><th>Name</th><th>Email</th><th>Role</th><th>Phone</th><th>Status</th><th>Joined</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {filtered.map((user) => (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td><span className={`badge badge-${user.role}`}>{user.role}</span></td>
                    <td style={{ color: '#94a3b8', fontSize: 13 }}>{user.phone || '—'}</td>
                    <td>
                      <span className={`badge ${user.isActive ? 'badge-completed' : 'badge-cancelled'}`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td style={{ fontSize: 12, color: '#64748b' }}>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ display: 'flex', gap: 8 }}>
                      <button className="btn btn-warning" style={{ fontSize: 12, padding: '5px 10px' }}
                        onClick={() => handleToggleActive(user)}>
                        {user.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button className="btn btn-danger" style={{ fontSize: 12, padding: '5px 10px' }}
                        onClick={() => handleDelete(user._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {!loading && filtered.length === 0 && (
            <div className="empty-state"><div className="empty-icon">👥</div>No users found</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;
