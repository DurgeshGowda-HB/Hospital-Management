import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { doctorAPI, appointmentAPI } from '../utils/api';
import { FiCalendar } from 'react-icons/fi';

const TIME_SLOTS = ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM'];

const AppointmentBooking = () => {
  const [doctors, setDoctors] = useState([]);
  const [form, setForm] = useState({ doctor: '', appointmentDate: '', timeSlot: '', reason: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    doctorAPI.getAll().then(({ data }) => {
      setDoctors(data);
      const doctorId = searchParams.get('doctor');
      if (doctorId) setForm((f) => ({ ...f, doctor: doctorId }));
    });
  }, [searchParams]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.doctor || !form.appointmentDate || !form.timeSlot || !form.reason)
      return toast.error('Please fill all required fields');

    const selected = new Date(form.appointmentDate);
    if (selected < new Date()) return toast.error('Please select a future date');

    setLoading(true);
    try {
      await appointmentAPI.book(form);
      toast.success('Appointment booked successfully!');
      navigate('/appointments');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  const selectedDoc = doctors.find((d) => d._id === form.doctor);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
        <FiCalendar style={{ color: 'var(--teal)', fontSize: '1.5rem' }} />
        <div className="page-title" style={{ marginBottom: 0 }}>Book Appointment</div>
      </div>
      <p className="page-subtitle">Schedule a consultation with one of our specialist doctors</p>

      <div className="grid-2" style={{ gap: 24, alignItems: 'start' }}>
        <div className="card">
          <h3 style={{ fontFamily: 'Syne, sans-serif', marginBottom: 24 }}>Appointment Details</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Select Doctor *</label>
              <select name="doctor" className="form-control" value={form.doctor} onChange={handleChange}>
                <option value="">-- Choose a doctor --</option>
                {doctors.map((d) => (
                  <option key={d._id} value={d._id}>
                    Dr. {d.user?.name} — {d.specialization} (₹{d.consultationFee})
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Appointment Date *</label>
              <input
                type="date" name="appointmentDate" className="form-control"
                value={form.appointmentDate} onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className="form-group">
              <label>Time Slot *</label>
              <select name="timeSlot" className="form-control" value={form.timeSlot} onChange={handleChange}>
                <option value="">-- Select time --</option>
                {TIME_SLOTS.map((slot) => (
                  <option key={slot} value={slot}>{slot}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Reason for Visit *</label>
              <textarea name="reason" className="form-control" rows={4}
                placeholder="Describe your symptoms or reason for consultation..."
                value={form.reason} onChange={handleChange} />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center', padding: '13px' }}>
              <FiCalendar /> {loading ? 'Booking...' : 'Confirm Appointment'}
            </button>
          </form>
        </div>

        {/* Doctor Preview */}
        <div>
          {selectedDoc ? (
            <div className="card">
              <h3 style={{ fontFamily: 'Syne, sans-serif', marginBottom: 20 }}>Selected Doctor</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
                <div style={{ width: 60, height: 60, background: 'linear-gradient(135deg,var(--teal-dark),var(--teal))', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 800, color: 'var(--navy)', fontFamily: 'Syne, sans-serif' }}>
                  {selectedDoc.user?.name?.charAt(0)}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontFamily: 'Syne, sans-serif' }}>Dr. {selectedDoc.user?.name}</div>
                  <div style={{ color: 'var(--teal)', fontSize: '0.85rem' }}>{selectedDoc.specialization}</div>
                </div>
              </div>
              {[
                ['Department', selectedDoc.department],
                ['Experience', selectedDoc.experience ? `${selectedDoc.experience} years` : null],
                ['Qualifications', selectedDoc.qualification?.join(', ')],
                ['Available Days', selectedDoc.availableDays?.join(', ')],
                ['Hours', `${selectedDoc.availableTimeStart} – ${selectedDoc.availableTimeEnd}`],
                ['Consultation Fee', `₹${selectedDoc.consultationFee}`],
              ].filter(([, v]) => v).map(([label, value]) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--gray)' }}>{label}</span>
                  <span style={{ color: 'var(--gray-light)', textAlign: 'right', maxWidth: '60%' }}>{value}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="card empty-state">
              <FiCalendar style={{ fontSize: '2.5rem', marginBottom: 12 }} />
              <p>Select a doctor to see their details</p>
            </div>
          )}

          <div className="card" style={{ marginTop: 16, background: 'rgba(0,180,216,0.06)', border: '1px solid rgba(0,180,216,0.15)' }}>
            <h4 style={{ color: 'var(--teal)', marginBottom: 10, fontFamily: 'Syne, sans-serif' }}>📋 Booking Notes</h4>
            <ul style={{ color: 'var(--gray)', fontSize: '0.85rem', lineHeight: 1.8, paddingLeft: 18 }}>
              <li>Appointments are subject to doctor availability</li>
              <li>Please arrive 10 minutes before your scheduled time</li>
              <li>Bring any previous medical records</li>
              <li>You can cancel up to 24 hours in advance</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentBooking;
