import React, { useState, useEffect, useCallback } from 'react';
import { getPatientDoctors, bookAppointment, getDoctorSlots } from '../../services/api';
import { PatientSidebar } from './PatientDashboard';
import './Patient.css';

const BookAppointment = () => {
  const [doctors, setDoctors] = useState([]);
  const [form, setForm] = useState({ doctor: '', appointmentDate: '', timeSlot: '', reason: '' });
  const [slots, setSlots] = useState([]);
  const [slotsMsg, setSlotsMsg] = useState('');
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ text: '', type: '' });

  useEffect(() => {
    getPatientDoctors().then((res) => setDoctors(res.data)).catch(() => {});
  }, []);

  const fetchSlots = useCallback(async (doctorId, date) => {
    if (!doctorId || !date) { setSlots([]); setSlotsMsg(''); return; }
    setSlotsLoading(true);
    setSlotsMsg('');
    setSlots([]);
    setForm((f) => ({ ...f, timeSlot: '' }));
    try {
      const res = await getDoctorSlots(doctorId, date);
      setSlots(res.data.slots || []);
      setSlotsMsg(res.data.message || '');
    } catch (err) {
      setSlotsMsg(err.response?.data?.message || 'Failed to load slots');
    } finally {
      setSlotsLoading(false);
    }
  }, []);

  const handleDoctorChange = (e) => {
    const doctorId = e.target.value;
    setForm((f) => ({ ...f, doctor: doctorId, timeSlot: '' }));
    fetchSlots(doctorId, form.appointmentDate);
  };

  const handleDateChange = (e) => {
    const date = e.target.value;
    setForm((f) => ({ ...f, appointmentDate: date, timeSlot: '' }));
    fetchSlots(form.doctor, date);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.timeSlot) { setMsg({ text: 'Please select a time slot', type: 'error' }); return; }
    setLoading(true);
    setMsg({ text: '', type: '' });
    try {
      await bookAppointment(form);
      setMsg({ text: '✅ Appointment request submitted! Awaiting admin approval.', type: 'success' });
      setForm({ doctor: '', appointmentDate: '', timeSlot: '', reason: '' });
      setSlots([]);
      setSlotsMsg('');
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
          <p>Schedule a consultation with our verified doctors</p>
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
                <select required value={form.doctor} onChange={handleDoctorChange}>
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
                  value={form.appointmentDate} onChange={handleDateChange} />
              </div>
              <div className="form-field">
                <label>Available Time Slots</label>
                {slotsLoading && <div style={{ color: '#94a3b8', fontSize: 13, padding: '8px 0' }}>⏳ Loading slots...</div>}
                {!slotsLoading && slotsMsg && slots.length === 0 && (
                  <div style={{ color: '#f87171', fontSize: 13, padding: '8px 0' }}>⚠️ {slotsMsg}</div>
                )}
                {!slotsLoading && !form.doctor && !form.appointmentDate && (
                  <div style={{ color: '#64748b', fontSize: 13, padding: '8px 0' }}>Select doctor and date to see available slots</div>
                )}
                {!slotsLoading && slots.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 6 }}>
                    {slots.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setForm((f) => ({ ...f, timeSlot: slot }))}
                        style={{
                          padding: '8px 14px',
                          borderRadius: 8,
                          border: `2px solid ${form.timeSlot === slot ? '#3b82f6' : '#334155'}`,
                          background: form.timeSlot === slot ? 'rgba(59,130,246,0.2)' : '#1e293b',
                          color: form.timeSlot === slot ? '#60a5fa' : '#94a3b8',
                          cursor: 'pointer',
                          fontSize: 13,
                          fontWeight: form.timeSlot === slot ? 700 : 400,
                          transition: 'all 0.15s',
                        }}>
                        {slot}
                      </button>
                    ))}
                  </div>
                )}
                {form.timeSlot && (
                  <div style={{ marginTop: 8, color: '#34d399', fontSize: 13 }}>✓ Selected: {form.timeSlot}</div>
                )}
              </div>
              <div className="form-field">
                <label>Reason for Visit</label>
                <textarea rows={3} required placeholder="Describe your symptoms or reason for visit..."
                  value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })}
                  style={{ resize: 'vertical' }} />
              </div>
              <button type="submit" className="submit-btn blue" disabled={loading || !form.timeSlot}>
                {loading ? 'Submitting...' : '📋 Request Appointment'}
              </button>
            </form>
          </div>

          {selectedDoctor ? (
            <div className="section-card">
              <div className="section-title">Doctor Details</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ fontSize: 24, fontWeight: 700, color: '#f8fafc' }}>Dr. {selectedDoctor.user?.name}</div>
                <div style={{ color: '#60a5fa', fontWeight: 600 }}>{selectedDoctor.specialization}</div>
                {selectedDoctor.bio && (
                  <div style={{ color: '#94a3b8', fontSize: 13, fontStyle: 'italic', borderLeft: '3px solid #334155', paddingLeft: 12 }}>
                    {selectedDoctor.bio}
                  </div>
                )}
                {[
                  ['🏥 Department', selectedDoctor.department || 'General'],
                  ['🎓 Qualification', selectedDoctor.qualification?.join(', ') || '-'],
                  ['📅 Experience', `${selectedDoctor.experience} years`],
                  ['💰 Consultation Fee', `₹${selectedDoctor.consultationFee}`],
                  ['📅 Available Days', selectedDoctor.availableDays?.join(', ') || 'Mon-Fri'],
                  ['🕐 Timings', `${selectedDoctor.startTime || '09:00'} - ${selectedDoctor.endTime || '17:00'}`],
                  ['⏱ Slot Duration', `${selectedDoctor.slotDuration || 30} mins`],
                ].map(([label, value]) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #334155', fontSize: 14 }}>
                    <span style={{ color: '#64748b' }}>{label}</span>
                    <span style={{ color: '#e2e8f0' }}>{value}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="section-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 300 }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>👨‍⚕️</div>
              <div style={{ color: '#64748b', fontSize: 15 }}>Select a doctor to view their details</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;
