import React, { useState, useEffect } from 'react';
import { getAllAppointments } from '../../services/api';
import { AdminSidebar } from './AdminDashboard';
import './Admin.css';

const ManageAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    getAllAppointments().then((res) => setAppointments(res.data)).finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'all' ? appointments : appointments.filter((a) => a.status === filter);

  return (
    <div className="dashboard-layout">
      <AdminSidebar active="Appointments" />
      <div className="main-content">
        <div className="page-header">
          <h1>All Appointments</h1>
          <p>Monitor all appointment activity</p>
        </div>

        <div className="section-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div className="section-title" style={{ margin: 0 }}>Appointments ({filtered.length})</div>
            <select value={filter} onChange={(e) => setFilter(e.target.value)}
              style={{ padding: '8px 14px', background: '#0f172a', border: '1px solid #334155', borderRadius: 8, color: '#e2e8f0', fontSize: 13 }}>
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {loading ? <div className="empty-state">Loading...</div> : (
            <table className="data-table">
              <thead>
                <tr><th>Patient</th><th>Doctor</th><th>Date</th><th>Time</th><th>Reason</th><th>Status</th></tr>
              </thead>
              <tbody>
                {filtered.map((apt) => (
                  <tr key={apt._id}>
                    <td>{apt.patient?.name || 'N/A'}</td>
                    <td>{apt.doctor?.name || 'N/A'}</td>
                    <td>{new Date(apt.appointmentDate).toLocaleDateString()}</td>
                    <td>{apt.timeSlot}</td>
                    <td>{apt.reason?.substring(0, 30)}...</td>
                    <td><span className={`badge badge-${apt.status}`}>{apt.status}</span></td>
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
