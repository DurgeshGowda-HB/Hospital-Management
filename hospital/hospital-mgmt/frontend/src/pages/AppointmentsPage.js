import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { appointmentAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { FiCalendar, FiX, FiCheckCircle } from 'react-icons/fi';
import { format } from 'date-fns';

const AppointmentsPage = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const load = async () => {
    try {
      const { data } = await appointmentAPI.getAll();
      setAppointments(data);
    } catch (err) {
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const cancelAppointment = async (id) => {
    if (!window.confirm('Cancel this appointment?')) return;
    try {
      await appointmentAPI.cancel(id);
      setAppointments((prev) => prev.map((a) => a._id === id ? { ...a, status: 'cancelled' } : a));
      toast.success('Appointment cancelled');
    } catch {
      toast.error('Failed to cancel');
    }
  };

  const completeAppointment = async (id) => {
    try {
      await appointmentAPI.update(id, { status: 'completed' });
      setAppointments((prev) => prev.map((a) => a._id === id ? { ...a, status: 'completed' } : a));
      toast.success('Appointment marked as completed');
    } catch {
      toast.error('Failed to update');
    }
  };

  const filtered = appointments.filter((a) => filter === 'all' || a.status === filter);

  if (loading) return <div style={{ color: 'var(--gray)', padding: '60px 0', textAlign: 'center' }}>Loading appointments...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <div className="page-title">Appointments</div>
          <p className="page-subtitle">Manage and track all your appointments</p>
        </div>
        <Link to="/book-appointment" className="btn btn-primary">
          <FiCalendar /> Book New
        </Link>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: 'var(--navy-mid)', borderRadius: 10, padding: 4, width: 'fit-content' }}>
        {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((s) => (
          <button key={s} onClick={() => setFilter(s)} style={{
            padding: '7px 16px', borderRadius: 7, textTransform: 'capitalize',
            background: filter === s ? 'rgba(0,180,216,0.15)' : 'none',
            color: filter === s ? 'var(--teal)' : 'var(--gray)',
            fontWeight: 500, fontSize: '0.84rem',
            border: filter === s ? '1px solid rgba(0,180,216,0.2)' : '1px solid transparent',
          }}>
            {s} {s === 'all' ? `(${appointments.length})` : `(${appointments.filter((a) => a.status === s).length})`}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="card empty-state">
          <FiCalendar style={{ fontSize: '2.5rem', marginBottom: 12 }} />
          <p>No {filter !== 'all' ? filter : ''} appointments found</p>
          <Link to="/book-appointment" className="btn btn-outline btn-sm" style={{ marginTop: 12 }}>Book Appointment</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {filtered.map((apt) => (
            <div key={apt._id} className="card" style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
              <div style={{ width: 52, height: 52, background: 'rgba(0,180,216,0.1)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--teal)', fontSize: '1.3rem', flexShrink: 0 }}>
                <FiCalendar />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                  <div>
                    <div style={{ fontWeight: 600, fontFamily: 'Syne, sans-serif', fontSize: '1rem' }}>
                      {user?.role === 'patient' ? `Dr. ${apt.doctor?.name}` : apt.patient?.name}
                    </div>
                    <div style={{ color: 'var(--gray)', fontSize: '0.82rem', marginTop: 2 }}>
                      {apt.appointmentDate ? format(new Date(apt.appointmentDate), 'EEEE, MMMM d, yyyy') : ''} at {apt.timeSlot}
                    </div>
                  </div>
                  <span className={`badge badge-${apt.status}`}>{apt.status}</span>
                </div>
                <div style={{ marginTop: 8, fontSize: '0.85rem', color: 'var(--gray-light)', background: 'rgba(255,255,255,0.03)', padding: '8px 12px', borderRadius: 6 }}>
                  Reason: {apt.reason}
                </div>
                {apt.notes && (
                  <div style={{ marginTop: 6, fontSize: '0.82rem', color: 'var(--gray)', fontStyle: 'italic' }}>Notes: {apt.notes}</div>
                )}
              </div>
              {apt.status === 'pending' || apt.status === 'confirmed' ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {(user?.role === 'doctor' || user?.role === 'admin') && apt.status !== 'completed' && (
                    <button onClick={() => completeAppointment(apt._id)} className="btn btn-sm" style={{ background: 'rgba(34,197,94,0.12)', color: 'var(--success)', whiteSpace: 'nowrap' }}>
                      <FiCheckCircle /> Complete
                    </button>
                  )}
                  <button onClick={() => cancelAppointment(apt._id)} className="btn btn-sm" style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--danger)', whiteSpace: 'nowrap' }}>
                    <FiX /> Cancel
                  </button>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AppointmentsPage;
