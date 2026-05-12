import React, { useState, useEffect } from 'react';
import { getDoctorAllAppointments } from '../../services/api';
import { DoctorSidebar } from './DoctorDashboard';
import './Doctor.css';

const Prescriptions = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    getDoctorAllAppointments()
      .then((res) => setAppointments(res.data.filter((a) => a.prescription)))
      .finally(() => setLoading(false));
  }, []);

  const filtered = appointments.filter((a) =>
    !search || a.patient?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="dashboard-layout">
      <DoctorSidebar active="Prescriptions" />
      <div className="main-content">
        <div className="page-header">
          <h1>Prescriptions</h1>
          <p>All prescriptions you have issued to patients</p>
        </div>
        <div className="section-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div className="section-title" style={{ margin: 0 }}>Issued Prescriptions ({filtered.length})</div>
            <input placeholder="Search by patient name..." value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ padding: '8px 14px', background: '#0f172a', border: '1px solid #334155', borderRadius: 8, color: '#e2e8f0', fontSize: 13 }} />
          </div>
          {loading ? <div className="empty-state">Loading...</div> : (
            <table className="data-table">
              <thead>
                <tr><th>Patient</th><th>Date</th><th>Time</th><th>Prescription</th><th>Notes</th><th>Status</th></tr>
              </thead>
              <tbody>
                {filtered.map((apt) => (
                  <tr key={apt._id}>
                    <td>{apt.patient?.name || 'N/A'}</td>
                    <td>{new Date(apt.appointmentDate).toLocaleDateString()}</td>
                    <td>{apt.timeSlot}</td>
                    <td style={{ maxWidth: 200, fontSize: 12, whiteSpace: 'pre-wrap', color: '#93c5fd' }}>{apt.prescription}</td>
                    <td style={{ fontSize: 12, color: '#94a3b8', maxWidth: 150 }}>{apt.notes || '—'}</td>
                    <td><span className={`badge badge-${apt.status}`}>{apt.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {!loading && filtered.length === 0 && (
            <div className="empty-state"><div className="empty-icon">💊</div>No prescriptions issued yet</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Prescriptions;
