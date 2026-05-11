import React, { useState, useEffect } from 'react';
import { getDoctorAppointments } from '../../services/api';
import { DoctorSidebar } from './DoctorDashboard';
import './Doctor.css';

const Prescriptions = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDoctorAppointments()
      .then((res) => setAppointments(res.data.filter((a) => a.prescription)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="dashboard-layout">
      <DoctorSidebar active="Prescriptions" />
      <div className="main-content">
        <div className="page-header">
          <h1>Prescriptions</h1>
          <p>View all prescriptions you have issued</p>
        </div>
        <div className="section-card">
          <div className="section-title">Issued Prescriptions ({appointments.length})</div>
          {loading ? <div className="empty-state">Loading...</div> : (
            <table className="data-table">
              <thead><tr><th>Patient</th><th>Date</th><th>Prescription</th><th>Notes</th><th>Status</th></tr></thead>
              <tbody>
                {appointments.map((apt) => (
                  <tr key={apt._id}>
                    <td>{apt.patient?.name || 'N/A'}</td>
                    <td>{new Date(apt.appointmentDate).toLocaleDateString()}</td>
                    <td style={{ maxWidth: 200, whiteSpace: 'pre-wrap', fontSize: 12 }}>{apt.prescription}</td>
                    <td style={{ fontSize: 12, color: '#94a3b8' }}>{apt.notes || '-'}</td>
                    <td><span className={`badge badge-${apt.status}`}>{apt.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {!loading && appointments.length === 0 && <div className="empty-state"><div className="empty-icon">💊</div>No prescriptions issued yet</div>}
        </div>
      </div>
    </div>
  );
};

export default Prescriptions;
