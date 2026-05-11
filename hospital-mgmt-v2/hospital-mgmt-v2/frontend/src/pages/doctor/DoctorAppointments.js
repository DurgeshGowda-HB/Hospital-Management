import React, { useState, useEffect } from 'react';
import { getDoctorAppointments, updateDoctorAppointment } from '../../services/api';
import { DoctorSidebar } from './DoctorDashboard';
import './Doctor.css';

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ status: '', notes: '', prescription: '' });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    getDoctorAppointments().then((res) => setAppointments(res.data)).finally(() => setLoading(false));
  }, []);

  const openUpdate = (apt) => {
    setSelected(apt);
    setForm({ status: apt.status, notes: apt.notes || '', prescription: apt.prescription || '' });
    setMsg('');
  };

  const handleUpdate = async () => {
    setSaving(true);
    try {
      const res = await updateDoctorAppointment(selected._id, form);
      setAppointments(appointments.map((a) => (a._id === selected._id ? { ...a, ...res.data } : a)));
      setMsg('Updated successfully!');
      setTimeout(() => { setSelected(null); setMsg(''); }, 1500);
    } catch (err) {
      setMsg(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="dashboard-layout">
      <DoctorSidebar active="Appointments" />
      <div className="main-content">
        <div className="page-header">
          <h1>My Appointments</h1>
          <p>View and manage your patient appointments</p>
        </div>

        {selected && (
          <div className="form-card" style={{ marginBottom: 24, borderColor: '#10b981' }}>
            <h2>Update Appointment — {selected.patient?.name}</h2>
            {msg && <div className={msg.includes('success') ? 'auth-success' : 'auth-error'} style={{ borderRadius: 8, padding: '10px 14px', marginBottom: 16, fontSize: 13 }}>{msg}</div>}
            <div className="form-row">
              <div className="form-field">
                <label>Status</label>
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div className="form-field">
                <label>Notes</label>
                <input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Appointment notes" />
              </div>
            </div>
            <div className="form-field">
              <label>Prescription</label>
              <textarea rows={3} value={form.prescription} onChange={(e) => setForm({ ...form, prescription: e.target.value })}
                placeholder="Enter prescription details..." style={{ resize: 'vertical' }} />
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button className="submit-btn green" onClick={handleUpdate} disabled={saving}>{saving ? 'Saving...' : 'Save Update'}</button>
              <button className="btn btn-danger" style={{ padding: '10px 20px', fontSize: 13 }} onClick={() => setSelected(null)}>Cancel</button>
            </div>
          </div>
        )}

        <div className="section-card">
          <div className="section-title">All Appointments ({appointments.length})</div>
          {loading ? <div className="empty-state">Loading...</div> : (
            <table className="data-table">
              <thead><tr><th>Patient</th><th>Date</th><th>Time</th><th>Reason</th><th>Status</th><th>Action</th></tr></thead>
              <tbody>
                {appointments.map((apt) => (
                  <tr key={apt._id}>
                    <td>{apt.patient?.name || 'N/A'}</td>
                    <td>{new Date(apt.appointmentDate).toLocaleDateString()}</td>
                    <td>{apt.timeSlot}</td>
                    <td>{apt.reason}</td>
                    <td><span className={`badge badge-${apt.status}`}>{apt.status}</span></td>
                    <td><button className="btn btn-primary" onClick={() => openUpdate(apt)}>Update</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {!loading && appointments.length === 0 && <div className="empty-state"><div className="empty-icon">📅</div>No appointments yet</div>}
        </div>
      </div>
    </div>
  );
};

export default DoctorAppointments;
