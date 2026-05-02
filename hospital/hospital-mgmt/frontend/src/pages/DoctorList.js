import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { doctorAPI } from '../utils/api';
import { FiSearch, FiStar, FiCalendar } from 'react-icons/fi';

const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    doctorAPI.getAll().then(({ data }) => { setDoctors(data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const filtered = doctors.filter((d) =>
    d.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
    d.specialization?.toLowerCase().includes(search.toLowerCase()) ||
    d.department?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div style={{ color: 'var(--gray)', padding: '60px 0', textAlign: 'center' }}>Loading doctors...</div>;

  return (
    <div>
      <div className="page-title">Our Doctors</div>
      <p className="page-subtitle">Browse our specialist doctors and book an appointment</p>

      <div style={{ position: 'relative', maxWidth: 420, marginBottom: 28 }}>
        <FiSearch style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--gray)' }} />
        <input
          type="text" className="form-control" placeholder="Search by name, specialization..."
          style={{ paddingLeft: 40 }} value={search} onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state card">
          <p>No doctors found{search ? ` for "${search}"` : ''}.</p>
          {search && <button className="btn btn-outline btn-sm" style={{ marginTop: 12 }} onClick={() => setSearch('')}>Clear Search</button>}
        </div>
      ) : (
        <div className="grid-3">
          {filtered.map((doc) => (
            <div key={doc._id} className="card" style={{ position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
                <div style={{ width: 56, height: 56, background: 'linear-gradient(135deg, var(--teal-dark), var(--teal))', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', fontWeight: 800, color: 'var(--navy)', fontFamily: 'Syne, sans-serif' }}>
                  {doc.user?.name?.charAt(0) || 'D'}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontFamily: 'Syne, sans-serif' }}>Dr. {doc.user?.name}</div>
                  <div style={{ color: 'var(--teal)', fontSize: '0.82rem' }}>{doc.specialization}</div>
                </div>
              </div>

              {doc.department && (
                <div style={{ fontSize: '0.8rem', color: 'var(--gray)', marginBottom: 8 }}>🏥 {doc.department}</div>
              )}
              {doc.experience > 0 && (
                <div style={{ fontSize: '0.8rem', color: 'var(--gray)', marginBottom: 8 }}>💼 {doc.experience} years experience</div>
              )}
              {doc.qualification?.length > 0 && (
                <div style={{ fontSize: '0.8rem', color: 'var(--gray)', marginBottom: 12 }}>🎓 {doc.qualification.join(', ')}</div>
              )}

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#ffd60a', fontSize: '0.85rem' }}>
                  <FiStar /> <span style={{ color: 'var(--gray-light)' }}>{doc.rating.toFixed(1)} ({doc.totalReviews})</span>
                </div>
                <div style={{ color: 'var(--teal)', fontWeight: 700, fontFamily: 'Syne, sans-serif' }}>₹{doc.consultationFee}</div>
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                <Link to={`/book-appointment?doctor=${doc._id}`} className="btn btn-primary btn-sm" style={{ flex: 1, justifyContent: 'center' }}>
                  <FiCalendar /> Book
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorList;
