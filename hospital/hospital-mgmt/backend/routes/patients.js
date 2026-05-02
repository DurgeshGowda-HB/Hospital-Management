const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');

// GET /api/patients - Get all patients (admin)
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const patients = await Patient.find().populate('user', '-password');
    res.json(patients);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/patients/me - Get current patient record
router.get('/me', protect, async (req, res) => {
  try {
    const patient = await Patient.findOne({ user: req.user._id }).populate('user', '-password');
    if (!patient) return res.status(404).json({ message: 'Patient record not found' });
    res.json(patient);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/patients/:id - Get single patient
router.get('/:id', protect, async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id).populate('user', '-password');
    if (!patient) return res.status(404).json({ message: 'Patient not found' });
    res.json(patient);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/patients/register - Register patient details
router.post('/register', protect, async (req, res) => {
  try {
    const { dateOfBirth, gender, bloodGroup, allergies, emergencyContact, insurance, medicalHistory } = req.body;

    let patient = await Patient.findOne({ user: req.user._id });
    if (patient) {
      // Update existing
      patient.dateOfBirth = dateOfBirth || patient.dateOfBirth;
      patient.gender = gender || patient.gender;
      patient.bloodGroup = bloodGroup || patient.bloodGroup;
      patient.allergies = allergies || patient.allergies;
      patient.emergencyContact = emergencyContact || patient.emergencyContact;
      patient.insurance = insurance || patient.insurance;
      patient.medicalHistory = medicalHistory || patient.medicalHistory;
      await patient.save();
    } else {
      patient = await Patient.create({ user: req.user._id, dateOfBirth, gender, bloodGroup, allergies, emergencyContact, insurance, medicalHistory });
    }

    res.json(patient);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/patients/:id - Update patient (admin or self)
router.put('/:id', protect, async (req, res) => {
  try {
    const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!patient) return res.status(404).json({ message: 'Patient not found' });
    res.json(patient);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/patients/:id - Delete patient (admin)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Patient.findByIdAndDelete(req.params.id);
    res.json({ message: 'Patient deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
