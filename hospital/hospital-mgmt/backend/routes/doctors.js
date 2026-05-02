const express = require('express');
const router = express.Router();
const Doctor = require('../models/Doctor');
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');

// GET /api/doctors - Get all doctors (public)
router.get('/', async (req, res) => {
  try {
    const { specialization, department } = req.query;
    const filter = { isAvailable: true };
    if (specialization) filter.specialization = new RegExp(specialization, 'i');
    if (department) filter.department = new RegExp(department, 'i');

    const doctors = await Doctor.find(filter).populate('user', '-password');
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/doctors/:id
router.get('/:id', async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate('user', '-password');
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
    res.json(doctor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/doctors - Create doctor profile (admin)
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { userId, specialization, qualification, experience, licenseNumber, department, consultationFee, availableDays, availableTimeStart, availableTimeEnd } = req.body;

    // Update user role to doctor
    await User.findByIdAndUpdate(userId, { role: 'doctor' });

    const doctor = await Doctor.create({
      user: userId, specialization, qualification, experience, licenseNumber, department, consultationFee, availableDays, availableTimeStart, availableTimeEnd
    });

    res.status(201).json(doctor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/doctors/:id - Update doctor
router.put('/:id', protect, async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
    res.json(doctor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/doctors/:id - Delete doctor (admin)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Doctor.findByIdAndDelete(req.params.id);
    res.json({ message: 'Doctor deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
