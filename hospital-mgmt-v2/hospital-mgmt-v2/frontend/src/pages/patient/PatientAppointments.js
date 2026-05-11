import React, { useState, useEffect } from 'react';
import { getPatientAppointments, cancelAppointment } from '../../services/api';
import { PatientSidebar } from './PatientDashboard';
import './Patient.css';

const PatientAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPatientAppointments().then((res) => setAppointments(res.data)).finally(() => setLoading(false));
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this appointment?')) return;
    await cancelAppointment(id);
    setAppointments(appointments.map((a) => a._id === id ? { ...a, status: 'cancelled' } : a));
  };

  return (
    <div className="dashboard-layout">
      <PatientSidebar active="My Appointments" />
      <div className="main-content">
        <div className="page-header">
          <h1>My Appointments</h1>
          <p>Track all your medical appointments</p>
        </div>
        <div className="section-card">
          <div className="section-title">Appointment History ({appointments.length})</div>
          {loading ? <div className="empty-state">Loading...</div> : (
            <table className="data-table">
              <thead>
                <tr><th>Doctor</th><th>Date</th><th>Time</th><th>Reason</th><th>Status</th><th>Prescription</th><th>Action</th></tr>
              </thead>
              <tbody>
                {appointments.map((apt) => (
                  <tr key={apt._id}>
                    <td>Dr. {apt.doctor?.name || 'N/A'}</td>
                    <td>{new Date(apt.appointmentDate).toLocaleDateString()}</td>
                    <td>{apt.timeSlot}</td>
                    <td style={{ maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{apt.reason}</td>
                    <td><span className={`badge badge-${apt.status}`}>{apt.status}</span></td>
                    <td style={{ fontSize: 12 }}>{apt.prescription || <span style={{ color: '#475569' }}>—</span>}</td>
                    <td>
                      {apt.status === 'pending' && (
                        <button className="btn btn-danger" onClick={() => handleCancel(apt._id)}>Cancel</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {!loading && appointments.length === 0 && <div className="empty-state"><div className="empty-icon">📅</div>No appointments found</div>}
        </div>
      </div>
    </div>
  );
};

export default PatientAppointments;
