import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { adminAPI } from '../utils/api';
import { FiUsers, FiCalendar, FiActivity, FiUserCheck, FiTrash2, FiToggleLeft, FiToggleRight } from 'react-icons/fi';

const AdminPanel = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [tab, setTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const [statsRes, usersRes] = await Promise.all([adminAPI.getStats(), adminAPI.getUsers()]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const toggleUserStatus = async (id, current) => {
    try {
      await adminAPI.updateUser(id, { isActive: !current });
      setUsers((prev) => prev.map((u) => u._id === id ? { ...u, isActive: !current } : u));
      toast.success('User status updated');
    } catch {
      toast.error('Failed to update user');
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Delete this user permanently?')) return;
    try {
      await adminAPI.deleteUser(id);
      setUsers((prev) => prev.filter((u) => u._id !== id));
      toast.success('User deleted');
    } catch {
      toast.error('Failed to delete user');
    }
  };

  if (loading) return <div style={{ color: 'var(--gray)', padding: '60px 0', textAlign: 'center' }}>Loading...</div>;

  return (
    <div>
      <div className="page-title">Admin Panel</div>
      <p className="page-subtitle">System management and hospital statistics</p>

      {/* Stats Row */}
      {stats && (
        <div className="grid-4" style={{ marginBottom: 28 }}>
          {[
            { icon: <FiUsers />, label: 'Total Users', value: stats.totalUsers, color: '#00b4d8' },
            { icon: <FiActivity />, label: 'Patients', value: stats.totalPatients, color: '#22c55e' },
            { icon: <FiUserCheck />, label: 'Doctors', value: stats.totalDoctors, color: '#f59e0b' },
            { icon: <FiCalendar />, label: 'Appointments', value: stats.totalAppointments, color: '#ef233c' },
          ].map((s) => (
            <div key={s.label} className="card" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 48, height: 48, background: `${s.color}20`, color: s.color, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>
                {s.icon}
              </div>
              <div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, fontFamily: 'Syne,sans-serif', color: s.color }}>{s.value}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--gray)' }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 20, background: 'var(--navy-mid)', borderRadius: 10, padding: 4, width: 'fit-content' }}>
        {['overview', 'users'].map((t) => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: '8px 20px', borderRadius: 8, textTransform: 'capitalize',
            background: tab === t ? 'rgba(0,180,216,0.15)' : 'none',
            color: tab === t ? 'var(--teal)' : 'var(--gray)',
            fontWeight: 500, fontSize: '0.88rem',
            border: tab === t ? '1px solid rgba(0,180,216,0.2)' : '1px solid transparent',
          }}>
            {t === 'overview' ? 'Recent Appointments' : 'Manage Users'}
          </button>
        ))}
      </div>

      {tab === 'overview' && stats && (
        <div className="card">
          <h3 style={{ fontFamily: 'Syne,sans-serif', marginBottom: 20 }}>Recent Appointments</h3>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Patient</th><th>Doctor</th><th>Date</th><th>Status</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentAppointments.map((a) => (
                  <tr key={a._id}>
                    <td>{a.patient?.name || '—'}</td>
                    <td>Dr. {a.doctor?.name || '—'}</td>
                    <td>{a.appointmentDate ? new Date(a.appointmentDate).toLocaleDateString() : '—'}</td>
                    <td><span className={`badge badge-${a.status}`}>{a.status}</span></td>
                  </tr>
                ))}
                {stats.recentAppointments.length === 0 && (
                  <tr><td colSpan={4} style={{ textAlign: 'center', color: 'var(--gray)' }}>No appointments</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'users' && (
        <div className="card">
          <h3 style={{ fontFamily: 'Syne,sans-serif', marginBottom: 20 }}>All Users ({users.length})</h3>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Joined</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id}>
                    <td style={{ fontWeight: 500 }}>{u.name}</td>
                    <td style={{ color: 'var(--gray)' }}>{u.email}</td>
                    <td><span className="badge" style={{ background: 'rgba(0,180,216,0.1)', color: 'var(--teal)' }}>{u.role}</span></td>
                    <td>
                      <span className={`badge ${u.isActive ? 'badge-completed' : 'badge-cancelled'}`}>
                        {u.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td style={{ color: 'var(--gray)', fontSize: '0.82rem' }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={() => toggleUserStatus(u._id, u.isActive)} title={u.isActive ? 'Deactivate' : 'Activate'}
                          style={{ background: 'none', color: u.isActive ? 'var(--success)' : 'var(--gray)', fontSize: '1.2rem', padding: 4 }}>
                          {u.isActive ? <FiToggleRight /> : <FiToggleLeft />}
                        </button>
                        <button onClick={() => deleteUser(u._id)} title="Delete"
                          style={{ background: 'none', color: 'var(--danger)', fontSize: '1rem', padding: 4 }}>
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
