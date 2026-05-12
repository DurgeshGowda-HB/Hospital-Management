import React, { useState, useEffect } from 'react';
import { getPatientAppointments, cancelAppointment } from '../../services/api';
import { PatientSidebar } from './PatientDashboard';
import './Patient.css';

const PatientAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    getPatientAppointments()
      .then((res) => setAppointments(res.data))
      .finally(() => setLoading(false));
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this appointment?')) return;
    try {
      await cancelAppointment(id);
      setAppointments(appointments.map((a) => a._id === id ? { ...a, status: 'cancelled' } : a));
      setMsg('Appointment cancelled successfully.');
      setTimeout(() => setMsg(''), 3000);
    } catch (err) {
      setMsg(err.response?.data?.message || 'Cancellation failed');
    }
  };

  const filtered = filter === 'all' ? appointments : appointments.filter((a) => a.status === filter);

  return (
    <div className="dashboard-layout">
      <PatientSidebar active="My Appointments" />
      <div className="main-content">
        <div className="page-header">
          <h1>My Appointments</h1>
          <p>Track all your appointment requests and history</p>
        </div>

        {msg && (
          <div style={{ padding: '12px 16px', borderRadius: 8, marginBottom: 16, fontSize: 13,
            background: msg.includes('success') ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
            color: msg.includes('success') ? '#34d399' : '#f87171',
            border: `1px solid ${msg.includes('success') ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}` }}>
            {msg}
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
                <tr><th>Doctor</th><th>Date</th><th>Time</th><th>Reason</th><th>Status</th><th>Prescription</th><th>Action</th></tr>
              </thead>
              <tbody>
                {filtered.map((apt) => (
                  <tr key={apt._id}>
                    <td>{apt.doctor?.name || 'N/A'}</td>
                    <td>{new Date(apt.appointmentDate).toLocaleDateString()}</td>
                    <td>{apt.timeSlot}</td>
                    <td style={{ maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{apt.reason}</td>
                    <td><span className={`badge badge-${apt.status}`}>{apt.status}</span></td>
                    <td style={{ fontSize: 12, color: '#94a3b8' }}>{apt.prescription ? '💊 Issued' : '-'}</td>
                    <td>
                      {['pending', 'approved'].includes(apt.status) && (
                        <button className="btn btn-danger" onClick={() => handleCancel(apt._id)}>Cancel</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {!loading && filtered.length === 0 && (
            <div className="empty-state"><div className="empty-icon">📅</div>No appointments found</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientAppointments;
