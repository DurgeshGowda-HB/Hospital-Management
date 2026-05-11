const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const { protect, adminOnly } = require('../middleware/auth');

// GET /api/appointments - Get appointments (role-based)
router.get('/', protect, async (req, res) => {
  try {
    let filter = {};
    if (req.user.role === 'patient') filter.patient = req.user._id;
    else if (req.user.role === 'doctor') filter.doctor = req.user._id;
    // admin sees all

    const appointments = await Appointment.find(filter)
      .populate('patient', 'name email phone')
      .populate('doctor', 'name email')
      .sort({ appointmentDate: -1 });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/appointments/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const apt = await Appointment.findById(req.params.id)
      .populate('patient', 'name email phone')
      .populate('doctor', 'name email');
    if (!apt) return res.status(404).json({ message: 'Appointment not found' });
    res.json(apt);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/appointments - Book appointment
router.post('/', protect, async (req, res) => {
  try {
    const { doctor, appointmentDate, timeSlot, reason } = req.body;

    // Check for conflicts
    const conflict = await Appointment.findOne({
      doctor,
      appointmentDate: new Date(appointmentDate),
      timeSlot,
      status: { $nin: ['cancelled'] },
    });
    if (conflict) return res.status(400).json({ message: 'This time slot is already booked' });

    const appointment = await Appointment.create({
      patient: req.user._id,
      doctor,
      appointmentDate,
      timeSlot,
      reason,
    });

    res.status(201).json(appointment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/appointments/:id - Update appointment
router.put('/:id', protect, async (req, res) => {
  try {
    const apt = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!apt) return res.status(404).json({ message: 'Appointment not found' });
    res.json(apt);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/appointments/:id - Cancel/delete
router.delete('/:id', protect, async (req, res) => {
  try {
    const apt = await Appointment.findById(req.params.id);
    if (!apt) return res.status(404).json({ message: 'Appointment not found' });
    apt.status = 'cancelled';
    await apt.save();
    res.json({ message: 'Appointment cancelled' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
