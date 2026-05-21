import React, { useState, useEffect } from 'react';
import { getAllAppointments, updateAppointmentStatus } from '../../services/api';
import { AdminSidebar } from './AdminDashboard';
import './Admin.css';

const ManageAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [msg, setMsg] = useState({ text: '', type: '' });
  const [rejecting, setRejecting] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  const loadAppointments = () => {
    setLoading(true);
    getAllAppointments().then((res) => setAppointments(res.data)).finally(() => setLoading(false));
  };

  useEffect(() => { loadAppointments(); }, []);

  const handleStatus = async (id, status, reason) => {
    try {
      const data = { status };
      if (reason) data.rejectedReason = reason;
      const res = await updateAppointmentStatus(id, data);
      setAppointments(appointments.map((a) => a._id === id ? { ...a, ...res.data } : a));
      setMsg({ text: `Appointment ${status} successfully!`, type: 'success' });
      setTimeout(() => setMsg({ text: '', type: '' }), 3000);
      setRejecting(null);
      setRejectReason('');
    } catch (err) {
      setMsg({ text: err.response?.data?.message || 'Action failed', type: 'error' });
    }
  };

  const filtered = filter === 'all' ? appointments : appointments.filter((a) => a.status === filter);

  return (
    <div className="dashboard-layout">
      <AdminSidebar active="Appointments" />
      <div className="main-content">
        <div className="page-header">
          <h1>All Appointments</h1>
          <p>Approve, reject and manage appointment requests</p>
        </div>

        {msg.text && (
          <div style={{ padding: '12px 16px', borderRadius: 8, marginBottom: 16, fontSize: 13,
            background: msg.type === 'success' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
            color: msg.type === 'success' ? '#34d399' : '#f87171',
            border: `1px solid ${msg.type === 'success' ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}` }}>
            {msg.text}
          </div>
        )}

        {/* Reject reason modal */}
        {rejecting && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div style={{ background: '#1e293b', borderRadius: 14, padding: 24, width: 400, border: '1px solid #334155' }}>
              <h3 style={{ color: '#f8fafc', marginBottom: 16 }}>Reject Appointment</h3>
              <div className="form-field">
                <label>Reason for rejection</label>
                <textarea rows={3} value={rejectReason} onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Enter reason..." style={{ resize: 'vertical' }} />
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
                <button className="btn btn-danger" onClick={() => handleStatus(rejecting, 'rejected', rejectReason)}>Confirm Reject</button>
                <button className="btn btn-primary" onClick={() => { setRejecting(null); setRejectReason(''); }}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        <div className="section-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div className="section-title" style={{ margin: 0 }}>Appointments ({filtered.length})</div>
            <select value={filter} onChange={(e) => setFilter(e.target.value)}
              style={{ padding: '8px 14px', background: '#0f172a', border: '1px solid #334155', borderRadius: 8, color: '#e2e8f0', fontSize: 13 }}>
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {loading ? <div className="empty-state">Loading...</div> : (
            <table className="data-table">
              <thead>
                <tr><th>Patient</th><th>Doctor</th><th>Date</th><th>Time</th><th>Reason</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {filtered.map((apt) => (
                  <tr key={apt._id}>
                    <td>{apt.patient?.name || 'N/A'}</td>
                    <td>{apt.doctor?.name || 'N/A'}</td>
                    <td>{new Date(apt.appointmentDate).toLocaleDateString()}</td>
                    <td>{apt.timeSlot}</td>
                    <td style={{ maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{apt.reason}</td>
                    <td><span className={`badge badge-${apt.status}`}>{apt.status}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        {apt.status === 'pending' && (
                          <>
                            <button className="btn btn-primary" style={{ fontSize: 11, padding: '5px 10px' }}
                              onClick={() => handleStatus(apt._id, 'approved')}>✅ Approve</button>
                            <button className="btn btn-danger" style={{ fontSize: 11, padding: '5px 10px' }}
                              onClick={() => { setRejecting(apt._id); setRejectReason(''); }}>❌ Reject</button>
                          </>
                        )}
                        {apt.status === 'approved' && (
                          <button className="btn btn-danger" style={{ fontSize: 11, padding: '5px 10px' }}
                            onClick={() => { setRejecting(apt._id); setRejectReason(''); }}>Cancel</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {!loading && filtered.length === 0 && <div className="empty-state">No appointments found</div>}
        </div>
      </div>
    </div>
  );
};

export default ManageAppointments;
