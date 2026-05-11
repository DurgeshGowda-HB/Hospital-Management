const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const User = require('../models/User');
const Patient = require('../models/Patient');
const { protect, patientOnly } = require('../middleware/auth');

// POST /api/patient/appointments - Book appointment
router.post('/appointments', protect, patientOnly, async (req, res) => {
  try {

    const { doctor, appointmentDate, timeSlot, reason } = req.body;

    console.log("Doctor ID:", doctor);

    const doctorProfile = await Doctor.findById(doctor);

    if (!doctorProfile) {
      return res.status(404).json({
        message: 'Doctor not found'
      });
    }

    const appointment = await Appointment.create({
      patient: req.user._id,
      doctor: doctorProfile.user,
      appointmentDate,
      timeSlot,
      reason,
    });

        res.status(201).json(appointment);

      } catch (err) {

        console.log(err);

        res.status(500).json({
          message: err.message
        });
      }
});

// GET /api/patient/appointments - Patient's own appointments
router.get('/appointments', protect, patientOnly, async (req, res) => {
  try {
    const appointments = await Appointment.find({ patient: req.user._id })
      .populate('doctor', 'name email')
      .sort({ appointmentDate: -1 });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/patient/appointments/:id - Cancel appointment
router.delete('/appointments/:id', protect, patientOnly, async (req, res) => {
  try {
    const apt = await Appointment.findOne({ _id: req.params.id, patient: req.user._id });
    if (!apt) return res.status(404).json({ message: 'Appointment not found' });
    apt.status = 'cancelled';
    await apt.save();
    res.json({ message: 'Appointment cancelled' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/patient/doctors - List all available doctors
router.get('/doctors', protect, patientOnly, async (req, res) => {
  try {
    const doctors = await Doctor.find({ isAvailable: true }).populate('user', 'name email phone');
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/patient/profile
router.get('/profile', protect, patientOnly, async (req, res) => {
  try {
    const patient = await Patient.findOne({ user: req.user._id });
    res.json({ user: req.user, patientProfile: patient });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/patient/profile
router.put('/profile', protect, patientOnly, async (req, res) => {
  try {
    const { name, phone, address } = req.body;
    const user = await User.findByIdAndUpdate(req.user._id, { name, phone, address }, { new: true }).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/patient/stats
router.get('/stats', protect, patientOnly, async (req, res) => {
  try {
    const [total, pending, completed, cancelled] = await Promise.all([
      Appointment.countDocuments({ patient: req.user._id }),
      Appointment.countDocuments({ patient: req.user._id, status: 'pending' }),
      Appointment.countDocuments({ patient: req.user._id, status: 'completed' }),
      Appointment.countDocuments({ patient: req.user._id, status: 'cancelled' }),
    ]);
    res.json({ total, pending, completed, cancelled });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
