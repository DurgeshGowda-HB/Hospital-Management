import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { adminAPI, appointmentAPI, doctorAPI } from '../utils/api';
import { FiUsers, FiCalendar, FiActivity, FiUserCheck, FiArrowRight } from 'react-icons/fi';
import { format } from 'date-fns';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        if (user?.role === 'admin') {
          const { data } = await adminAPI.getStats();
          setStats(data);
        }
        const [apts, docs] = await Promise.all([
          appointmentAPI.getAll(),
          doctorAPI.getAll(),
        ]);
        setAppointments(apts.data.slice(0, 5));
        setDoctors(docs.data.slice(0, 4));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  if (loading) return <div style={{ color: 'var(--gray)', padding: '60px 0', textAlign: 'center' }}>Loading dashboard...</div>;

  return (
    <div>
      <div className="page-title">Welcome back, {user?.name?.split(' ')[0]} 👋</div>
      <p className="page-subtitle">
        {user?.role === 'admin' ? 'Hospital overview and system statistics' :
         user?.role === 'doctor' ? "Today's schedule and patient management" :
         'Your appointments and health records'}
      </p>

      {/* Admin Stats */}
      {user?.role === 'admin' && stats && (
        <div className="grid-4" style={{ marginBottom: 32 }}>
          {[
            { icon: <FiUsers />, label: 'Total Users', value: stats.totalUsers, color: '#00b4d8' },
            { icon: <FiActivity />, label: 'Total Patients', value: stats.totalPatients, color: '#22c55e' },
            { icon: <FiUserCheck />, label: 'Doctors', value: stats.totalDoctors, color: '#f59e0b' },
            { icon: <FiCalendar />, label: 'Appointments', value: stats.totalAppointments, color: '#ef233c' },
          ].map((s) => (
            <div key={s.label} className="card" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 52, height: 52, background: `${s.color}20`, color: s.color, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', flexShrink: 0 }}>
                {s.icon}
              </div>
              <div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'Syne, sans-serif', color: s.color }}>{s.value}</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--gray)' }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="grid-2" style={{ gap: 24 }}>
        {/* Appointments */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3 style={{ fontFamily: 'Syne, sans-serif' }}>Recent Appointments</h3>
            <Link to="/appointments" style={{ color: 'var(--teal)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 4 }}>
              View all <FiArrowRight />
            </Link>
          </div>
          {appointments.length === 0 ? (
            <div className="empty-state">
              <FiCalendar style={{ fontSize: '2rem', marginBottom: 8 }} />
              <p>No appointments yet</p>
              <Link to="/book-appointment" className="btn btn-outline btn-sm" style={{ marginTop: 12 }}>Book Now</Link>
            </div>
          ) : (
            <div>
              {appointments.map((apt) => (
                <div key={apt._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <div>
                    <div style={{ fontWeight: 500, fontSize: '0.9rem' }}>
                      {user?.role === 'patient' ? `Dr. ${apt.doctor?.name}` : apt.patient?.name}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--gray)', marginTop: 2 }}>
                      {apt.appointmentDate ? format(new Date(apt.appointmentDate), 'MMM d, yyyy') : ''} • {apt.timeSlot}
                    </div>
                  </div>
                  <span className={`badge badge-${apt.status}`}>{apt.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Doctors */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3 style={{ fontFamily: 'Syne, sans-serif' }}>Available Doctors</h3>
            <Link to="/doctors" style={{ color: 'var(--teal)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 4 }}>
              View all <FiArrowRight />
            </Link>
          </div>
          {doctors.length === 0 ? (
            <div className="empty-state"><p>No doctors found</p></div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {doctors.map((doc) => (
                <div key={doc._id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ width: 40, height: 40, background: 'linear-gradient(135deg, var(--teal-dark), var(--teal))', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--navy)', fontWeight: 700, fontSize: '0.9rem' }}>
                    {doc.user?.name?.charAt(0) || 'D'}
                  </div>
                  <div>
                    <div style={{ fontWeight: 500, fontSize: '0.9rem' }}>Dr. {doc.user?.name}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--teal)' }}>{doc.specialization}</div>
                  </div>
                  <div style={{ marginLeft: 'auto', fontSize: '0.8rem', color: 'var(--gray)' }}>₹{doc.consultationFee}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card" style={{ marginTop: 24 }}>
        <h3 style={{ fontFamily: 'Syne, sans-serif', marginBottom: 16 }}>Quick Actions</h3>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Link to="/book-appointment" className="btn btn-primary">
            <FiCalendar /> Book Appointment
          </Link>
          <Link to="/doctors" className="btn btn-outline">
            <FiUsers /> View Doctors
          </Link>
          {user?.role === 'patient' && (
            <Link to="/patient-registration" className="btn btn-outline">
              <FiActivity /> Update Health Record
            </Link>
          )}
          {user?.role === 'admin' && (
            <Link to="/admin" className="btn btn-outline">
              <FiUserCheck /> Admin Panel
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
