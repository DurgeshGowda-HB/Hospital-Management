import React, { useState, useEffect } from 'react';
import { getPatientDoctors, bookAppointment } from '../../services/api';
import { PatientSidebar } from './PatientDashboard';
import './Patient.css';

const TIME_SLOTS = ['09:00','09:30','10:00','10:30','11:00','11:30','14:00','14:30','15:00','15:30','16:00','16:30'];

const BookAppointment = () => {
  const [doctors, setDoctors] = useState([]);
  const [form, setForm] = useState({ doctor: '', appointmentDate: '', timeSlot: '', reason: '' });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ text: '', type: '' });

  useEffect(() => {
    getPatientDoctors().then((res) => setDoctors(res.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg({ text: '', type: '' });
    try {
      await bookAppointment(form);
      setMsg({ text: '✅ Appointment booked successfully!', type: 'success' });
      setForm({ doctor: '', appointmentDate: '', timeSlot: '', reason: '' });
    } catch (err) {
      setMsg({ text: err.response?.data?.message || 'Booking failed', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const selectedDoctor = doctors.find((d) => d._id === form.doctor);

  return (
    <div className="dashboard-layout">
      <PatientSidebar active="Book Appointment" />
      <div className="main-content">
        <div className="page-header">
          <h1>Book Appointment</h1>
          <p>Schedule a consultation with our doctors</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <div className="form-card">
            <h2>Appointment Details</h2>
            {msg.text && (
              <div style={{ padding: '12px', borderRadius: 8, marginBottom: 16, fontSize: 13,
                background: msg.type === 'success' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
                color: msg.type === 'success' ? '#34d399' : '#f87171',
                border: `1px solid ${msg.type === 'success' ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}` }}>
                {msg.text}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="form-field">
                <label>Select Doctor</label>
                <select required value={form.doctor} onChange={(e) => setForm({ ...form, doctor: e.target.value })}>
                  <option value="">-- Choose a doctor --</option>
                  {doctors.map((doc) => (
                    <option key={doc._id} value={doc._id}>
                      Dr. {doc.user?.name} — {doc.specialization} (₹{doc.consultationFee})
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-field">
                <label>Appointment Date</label>
                <input type="date" required min={new Date().toISOString().split('T')[0]}
                  value={form.appointmentDate} onChange={(e) => setForm({ ...form, appointmentDate: e.target.value })} />
              </div>
              <div className="form-field">
                <label>Time Slot</label>
                <select required value={form.timeSlot} onChange={(e) => setForm({ ...form, timeSlot: e.target.value })}>
                  <option value="">-- Select time --</option>
                  {TIME_SLOTS.map((slot) => <option key={slot} value={slot}>{slot}</option>)}
                </select>
              </div>
              <div className="form-field">
                <label>Reason for Visit</label>
                <textarea rows={3} required placeholder="Describe your symptoms or reason for visit..."
                  value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })}
                  style={{ resize: 'vertical' }} />
              </div>
              <button type="submit" className="submit-btn blue" disabled={loading}>
                {loading ? 'Booking...' : '📋 Book Appointment'}
              </button>
            </form>
          </div>

          {selectedDoctor && (
            <div className="section-card">
              <div className="section-title">Doctor Details</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ fontSize: 24, fontWeight: 700, color: '#f8fafc' }}>Dr. {selectedDoctor.user?.name}</div>
                <div style={{ color: '#60a5fa', fontWeight: 600 }}>{selectedDoctor.specialization}</div>
                {[
                  ['🏥 Department', selectedDoctor.department || 'General'],
                  ['🎓 Qualification', selectedDoctor.qualification?.join(', ') || '-'],
                  ['📅 Experience', `${selectedDoctor.experience} years`],
                  ['💰 Consultation Fee', `₹${selectedDoctor.consultationFee}`],
                  ['📅 Available Days', selectedDoctor.availableDays?.join(', ') || 'Mon-Fri'],
                  ['🕐 Timings', `${selectedDoctor.availableTimeStart} - ${selectedDoctor.availableTimeEnd}`],
                ].map(([label, value]) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #334155', fontSize: 14 }}>
                    <span style={{ color: '#64748b' }}>{label}</span>
                    <span style={{ color: '#e2e8f0' }}>{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;
