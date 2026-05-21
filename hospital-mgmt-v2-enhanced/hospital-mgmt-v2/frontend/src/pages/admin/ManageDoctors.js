import React, { useState, useEffect } from 'react';
import { getAllDoctors, deleteDoctor, verifyDoctor } from '../../services/api';
import { AdminSidebar } from './AdminDashboard';
import './Admin.css';

const ManageDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [msg, setMsg] = useState({ text: '', type: '' });

  const loadDoctors = () => {
    setLoading(true);
    getAllDoctors()
      .then((res) => setDoctors(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadDoctors(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this doctor?')) return;
    try {
      await deleteDoctor(id);
      setDoctors(doctors.filter((d) => d._id !== id));
      setMsg({ text: 'Doctor removed successfully', type: 'success' });
      setTimeout(() => setMsg({ text: '', type: '' }), 3000);
    } catch (err) {
      setMsg({ text: 'Delete failed', type: 'error' });
    }
  };

  const handleVerify = async (id, action) => {
    try {
      await verifyDoctor(id, { action });
      setMsg({ text: `Doctor ${action}d successfully!`, type: 'success' });
      setTimeout(() => setMsg({ text: '', type: '' }), 3000);
      loadDoctors();
    } catch (err) {
      setMsg({ text: err.response?.data?.message || 'Action failed', type: 'error' });
    }
  };

  const filtered = filter === 'all' ? doctors
    : filter === 'verified' ? doctors.filter((d) => d.isVerified)
    : filter === 'pending' ? doctors.filter((d) => d.verificationStatus === 'pending')
    : doctors.filter((d) => d.verificationStatus === 'rejected');

  return (
    <div className="dashboard-layout">
      <AdminSidebar active="Manage Doctors" />
      <div className="main-content">
        <div className="page-header">
          <h1>Manage Doctors</h1>
          <p>View, verify and manage all registered doctors</p>
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div className="section-title" style={{ margin: 0 }}>All Doctors ({filtered.length})</div>
            <select value={filter} onChange={(e) => setFilter(e.target.value)}
              style={{ padding: '8px 14px', background: '#0f172a', border: '1px solid #334155', borderRadius: 8, color: '#e2e8f0', fontSize: 13 }}>
              <option value="all">All Doctors</option>
              <option value="verified">Verified</option>
              <option value="pending">Pending Verification</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {loading ? <div className="empty-state">Loading...</div> : (
            <table className="data-table">
              <thead>
                <tr><th>Name</th><th>Email</th><th>Specialization</th><th>Dept</th><th>Exp</th><th>Fee</th><th>Verification</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {filtered.map((doc) => (
                  <tr key={doc._id}>
                    <td>{doc.user?.name || 'N/A'}</td>
                    <td>{doc.user?.email || 'N/A'}</td>
                    <td>{doc.specialization}</td>
                    <td>{doc.department || '-'}</td>
                    <td>{doc.experience} yrs</td>
                    <td>₹{doc.consultationFee}</td>
                    <td>
                      <span className={`badge badge-${doc.verificationStatus === 'approved' ? 'completed' : doc.verificationStatus === 'rejected' ? 'rejected' : 'pending'}`}>
                        {doc.verificationStatus}
                      </span>
                    </td>
                    <td style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {doc.verificationStatus === 'pending' && (
                        <>
                          <button className="btn btn-primary" style={{ fontSize: 11, padding: '5px 10px' }}
                            onClick={() => handleVerify(doc._id, 'approve')}>✅ Approve</button>
                          <button className="btn btn-danger" style={{ fontSize: 11, padding: '5px 10px' }}
                            onClick={() => handleVerify(doc._id, 'reject')}>❌ Reject</button>
                        </>
                      )}
                      {doc.verificationStatus === 'rejected' && (
                        <button className="btn btn-primary" style={{ fontSize: 11, padding: '5px 10px' }}
                          onClick={() => handleVerify(doc._id, 'approve')}>↩ Re-approve</button>
                      )}
                      {doc.isVerified && (
                        <button className="btn btn-danger" style={{ fontSize: 11, padding: '5px 10px' }}
                          onClick={() => handleVerify(doc._id, 'reject')}>Revoke</button>
                      )}
                      <button className="btn btn-danger" style={{ fontSize: 11, padding: '5px 10px' }}
                        onClick={() => handleDelete(doc._id)}>Remove</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {!loading && filtered.length === 0 && (
            <div className="empty-state"><div className="empty-icon">👨‍⚕️</div>No doctors found</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageDoctors;
