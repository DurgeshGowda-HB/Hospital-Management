import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAdminUsers, updateAdminUser, deleteAdminUser } from '../../services/api';
import { AdminSidebar } from './AdminDashboard';
import './Admin.css';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    getAdminUsers().then((res) => setUsers(res.data)).finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    await deleteAdminUser(id);
    setUsers(users.filter((u) => u._id !== id));
  };

  const handleToggleActive = async (user) => {
    const updated = await updateAdminUser(user._id, { isActive: !user.isActive });
    setUsers(users.map((u) => (u._id === user._id ? updated.data : u)));
  };

  const filtered = users.filter(
    (u) => u.name?.toLowerCase().includes(search.toLowerCase()) ||
           u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="dashboard-layout">
      <AdminSidebar active="Manage Users" />
      <div className="main-content">
        <div className="page-header">
          <h1>Manage Users</h1>
          <p>View and manage all system users</p>
        </div>

        <div className="section-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div className="section-title" style={{ margin: 0 }}>All Users ({filtered.length})</div>
            <input
              placeholder="Search users..." value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ padding: '8px 14px', background: '#0f172a', border: '1px solid #334155', borderRadius: 8, color: '#e2e8f0', fontSize: 13 }}
            />
          </div>

          {loading ? <div className="empty-state">Loading...</div> : (
            <table className="data-table">
              <thead>
                <tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {filtered.map((user) => (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td><span className={`badge badge-${user.role}`}>{user.role}</span></td>
                    <td>
                      <span className={`badge ${user.isActive ? 'badge-completed' : 'badge-cancelled'}`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td style={{ display: 'flex', gap: 8 }}>
                      <button className="btn btn-warning" onClick={() => handleToggleActive(user)}>
                        {user.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button className="btn btn-danger" onClick={() => handleDelete(user._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {!loading && filtered.length === 0 && <div className="empty-state">No users found</div>}
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;
