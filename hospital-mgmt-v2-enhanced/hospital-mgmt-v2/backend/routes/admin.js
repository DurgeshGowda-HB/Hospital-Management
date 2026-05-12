const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const { protect, adminOnly } = require('../middleware/auth');

// GET /api/admin/stats
router.get('/stats', protect, adminOnly, async (req, res) => {
  try {
    const [
      totalUsers, totalPatients, totalDoctors,
      totalAppointments, pendingAppointments, completedAppointments,
      approvedAppointments, rejectedAppointments,
      pendingDoctors, verifiedDoctors,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'patient' }),
      User.countDocuments({ role: 'doctor' }),
      Appointment.countDocuments(),
      Appointment.countDocuments({ status: 'pending' }),
      Appointment.countDocuments({ status: 'completed' }),
      Appointment.countDocuments({ status: 'approved' }),
      Appointment.countDocuments({ status: 'rejected' }),
      Doctor.countDocuments({ verificationStatus: 'pending' }),
      Doctor.countDocuments({ isVerified: true }),
    ]);

    const recentAppointments = await Appointment.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('patient', 'name')
      .populate('doctor', 'name');

    res.json({
      totalUsers, totalPatients, totalDoctors,
      totalAppointments, pendingAppointments, completedAppointments,
      approvedAppointments, rejectedAppointments,
      pendingDoctors, verifiedDoctors,
      recentAppointments,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/admin/users
router.get('/users', protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/admin/users/:id
router.put('/users/:id', protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/admin/users/:id
router.delete('/users/:id', protect, adminOnly, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/admin/doctors/pending - All doctors pending verification
router.get('/doctors/pending', protect, adminOnly, async (req, res) => {
  try {
    const doctors = await Doctor.find({ verificationStatus: 'pending' })
      .populate('user', '-password')
      .sort({ createdAt: -1 });
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/admin/doctors - All doctors for admin
router.get('/doctors', protect, adminOnly, async (req, res) => {
  try {
    const doctors = await Doctor.find()
      .populate('user', '-password')
      .sort({ createdAt: -1 });
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/admin/doctors/:id/verify - Verify or reject doctor
router.put('/doctors/:id/verify', protect, adminOnly, async (req, res) => {
  try {
    const { action, reason } = req.body; // action: 'approve' | 'reject'
    if (!['approve', 'reject'].includes(action)) {
      return res.status(400).json({ message: 'Action must be approve or reject' });
    }

    const update = {
      verificationStatus: action === 'approve' ? 'approved' : 'rejected',
      isVerified: action === 'approve',
      verifiedAt: new Date(),
      verifiedBy: req.user._id,
    };

    const doctor = await Doctor.findByIdAndUpdate(req.params.id, update, { new: true })
      .populate('user', '-password');
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });

    res.json({ message: `Doctor ${action}d successfully`, doctor });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/admin/appointments - All appointments
router.get('/appointments', protect, adminOnly, async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('patient', 'name email phone')
      .populate('doctor', 'name email')
      .sort({ createdAt: -1 });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/admin/appointments/:id/status - Approve, reject, or reschedule
router.put('/appointments/:id/status', protect, adminOnly, async (req, res) => {
  try {
    const { status, rejectedReason, appointmentDate, timeSlot } = req.body;
    const allowed = ['approved', 'rejected', 'completed', 'cancelled'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const update = { status };
    if (rejectedReason) update.rejectedReason = rejectedReason;
    if (appointmentDate) update.appointmentDate = new Date(appointmentDate);
    if (timeSlot) update.timeSlot = timeSlot;

    const apt = await Appointment.findByIdAndUpdate(req.params.id, update, { new: true })
      .populate('patient', 'name email')
      .populate('doctor', 'name email');
    if (!apt) return res.status(404).json({ message: 'Appointment not found' });

    res.json(apt);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
