import React, { useState, useEffect } from 'react';
import { getAllDoctors, deleteDoctor } from '../../services/api';
import { AdminSidebar } from './AdminDashboard';
import './Admin.css';

const ManageDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllDoctors().then((res) => setDoctors(res.data)).finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this doctor?')) return;
    await deleteDoctor(id);
    setDoctors(doctors.filter((d) => d._id !== id));
  };

  return (
    <div className="dashboard-layout">
      <AdminSidebar active="Manage Doctors" />
      <div className="main-content">
        <div className="page-header">
          <h1>Manage Doctors</h1>
          <p>View and manage all registered doctors</p>
        </div>

        <div className="section-card">
          <div className="section-title">All Doctors ({doctors.length})</div>
          {loading ? <div className="empty-state">Loading...</div> : (
            <table className="data-table">
              <thead>
                <tr><th>Name</th><th>Email</th><th>Specialization</th><th>Department</th><th>Experience</th><th>Fee</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {doctors.map((doc) => (
                  <tr key={doc._id}>
                    <td>{doc.user?.name || 'N/A'}</td>
                    <td>{doc.user?.email || 'N/A'}</td>
                    <td>{doc.specialization}</td>
                    <td>{doc.department || '-'}</td>
                    <td>{doc.experience} yrs</td>
                    <td>₹{doc.consultationFee}</td>
                    <td>
                      <button className="btn btn-danger" onClick={() => handleDelete(doc._id)}>Remove</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {!loading && doctors.length === 0 && <div className="empty-state"><div className="empty-icon">👨‍⚕️</div>No doctors registered yet</div>}
        </div>
      </div>
    </div>
  );
};

export default ManageDoctors;
