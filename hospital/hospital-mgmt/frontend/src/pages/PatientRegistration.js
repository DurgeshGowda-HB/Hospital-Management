import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { patientAPI } from '../utils/api';
import { FiSave, FiActivity } from 'react-icons/fi';

const PatientRegistration = () => {
  const [form, setForm] = useState({
    dateOfBirth: '', gender: '', bloodGroup: '',
    allergies: '', emergencyContactName: '', emergencyContactPhone: '',
    emergencyContactRelation: '', insuranceProvider: '', insurancePolicyNumber: '',
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setLoading(true);
    patientAPI.getMe()
      .then(({ data }) => {
        setForm({
          dateOfBirth: data.dateOfBirth ? data.dateOfBirth.split('T')[0] : '',
          gender: data.gender || '',
          bloodGroup: data.bloodGroup || '',
          allergies: data.allergies?.join(', ') || '',
          emergencyContactName: data.emergencyContact?.name || '',
          emergencyContactPhone: data.emergencyContact?.phone || '',
          emergencyContactRelation: data.emergencyContact?.relation || '',
          insuranceProvider: data.insurance?.provider || '',
          insurancePolicyNumber: data.insurance?.policyNumber || '',
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await patientAPI.register({
        dateOfBirth: form.dateOfBirth,
        gender: form.gender,
        bloodGroup: form.bloodGroup,
        allergies: form.allergies ? form.allergies.split(',').map((a) => a.trim()) : [],
        emergencyContact: { name: form.emergencyContactName, phone: form.emergencyContactPhone, relation: form.emergencyContactRelation },
        insurance: { provider: form.insuranceProvider, policyNumber: form.insurancePolicyNumber },
      });
      toast.success('Health record saved successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save record');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ color: 'var(--gray)', padding: '60px 0', textAlign: 'center' }}>Loading health record...</div>;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
        <FiActivity style={{ color: 'var(--teal)', fontSize: '1.5rem' }} />
        <div className="page-title" style={{ marginBottom: 0 }}>My Health Record</div>
      </div>
      <p className="page-subtitle">Keep your health information up to date for better care</p>

      <form onSubmit={handleSubmit}>
        <div className="grid-2" style={{ gap: 24 }}>
          {/* Personal Health */}
          <div className="card">
            <h3 style={{ fontFamily: 'Syne, sans-serif', marginBottom: 20 }}>Personal Health Info</h3>
            <div className="form-group">
              <label>Date of Birth</label>
              <input type="date" name="dateOfBirth" className="form-control" value={form.dateOfBirth} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Gender</label>
              <select name="gender" className="form-control" value={form.gender} onChange={handleChange}>
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>Blood Group</label>
              <select name="bloodGroup" className="form-control" value={form.bloodGroup} onChange={handleChange}>
                <option value="">Select blood group</option>
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Allergies <span style={{ color: 'var(--gray)', fontWeight: 400 }}>(comma-separated)</span></label>
              <input type="text" name="allergies" className="form-control" placeholder="e.g. Penicillin, Pollen, Dust" value={form.allergies} onChange={handleChange} />
            </div>
          </div>

          {/* Emergency + Insurance */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div className="card">
              <h3 style={{ fontFamily: 'Syne, sans-serif', marginBottom: 20 }}>Emergency Contact</h3>
              <div className="form-group">
                <label>Contact Name</label>
                <input type="text" name="emergencyContactName" className="form-control" placeholder="Full name" value={form.emergencyContactName} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input type="tel" name="emergencyContactPhone" className="form-control" placeholder="+91 98765 43210" value={form.emergencyContactPhone} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Relation</label>
                <input type="text" name="emergencyContactRelation" className="form-control" placeholder="e.g. Spouse, Parent" value={form.emergencyContactRelation} onChange={handleChange} />
              </div>
            </div>

            <div className="card">
              <h3 style={{ fontFamily: 'Syne, sans-serif', marginBottom: 20 }}>Insurance Details</h3>
              <div className="form-group">
                <label>Insurance Provider</label>
                <input type="text" name="insuranceProvider" className="form-control" placeholder="e.g. Star Health" value={form.insuranceProvider} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Policy Number</label>
                <input type="text" name="insurancePolicyNumber" className="form-control" placeholder="Policy ID" value={form.insurancePolicyNumber} onChange={handleChange} />
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 24 }}>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            <FiSave /> {saving ? 'Saving...' : 'Save Health Record'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PatientRegistration;
