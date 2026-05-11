const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const { protect, doctorOnly } = require('../middleware/auth');

// GET /api/doctor/appointments - Doctor's own appointments
router.get('/appointments', protect, doctorOnly, async (req, res) => {
  try {
    const appointments = await Appointment.find({ doctor: req.user._id })
      .populate('patient', 'name email phone')
      .sort({ appointmentDate: -1 });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/doctor/appointments/today - Today's appointments
router.get('/appointments/today', protect, doctorOnly, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const appointments = await Appointment.find({
      doctor: req.user._id,
      appointmentDate: { $gte: today, $lt: tomorrow },
    }).populate('patient', 'name email phone');
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/doctor/appointments/:id - Update status & prescription
router.put('/appointments/:id', protect, doctorOnly, async (req, res) => {
  try {
    const apt = await Appointment.findOne({ _id: req.params.id, doctor: req.user._id });
    if (!apt) return res.status(404).json({ message: 'Appointment not found' });

    const { status, prescription, notes } = req.body;
    if (status) apt.status = status;
    if (prescription) apt.prescription = prescription;
    if (notes) apt.notes = notes;
    await apt.save();
    res.json(apt);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/doctor/profile - Doctor's own profile
router.get('/profile', protect, doctorOnly, async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user._id }).populate('user', '-password');
    res.json({ user: req.user, doctorProfile: doctor });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/doctor/stats - Doctor dashboard stats
router.get('/stats', protect, doctorOnly, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [totalAppointments, todayCount, pendingCount, completedCount] = await Promise.all([
      Appointment.countDocuments({ doctor: req.user._id }),
      Appointment.countDocuments({ doctor: req.user._id, appointmentDate: { $gte: today, $lt: tomorrow } }),
      Appointment.countDocuments({ doctor: req.user._id, status: 'pending' }),
      Appointment.countDocuments({ doctor: req.user._id, status: 'completed' }),
    ]);

    res.json({ totalAppointments, todayCount, pendingCount, completedCount });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
