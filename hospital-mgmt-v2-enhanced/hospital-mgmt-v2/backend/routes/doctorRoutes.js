const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const User = require('../models/User');
const { protect, doctorOnly } = require('../middleware/auth');

// GET /api/doctor/appointments - Doctor's approved appointments only
router.get('/appointments', protect, doctorOnly, async (req, res) => {
  try {
    const appointments = await Appointment.find({
      doctor: req.user._id,
      status: { $in: ['approved', 'completed'] },
    })
      .populate('patient', 'name email phone')
      .sort({ appointmentDate: -1 });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/doctor/appointments/all - All appointments for doctor (including pending)
router.get('/appointments/all', protect, doctorOnly, async (req, res) => {
  try {
    const appointments = await Appointment.find({ doctor: req.user._id })
      .populate('patient', 'name email phone')
      .sort({ appointmentDate: -1 });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/doctor/appointments/today - Today's approved appointments
router.get('/appointments/today', protect, doctorOnly, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const appointments = await Appointment.find({
      doctor: req.user._id,
      appointmentDate: { $gte: today, $lt: tomorrow },
      status: { $in: ['approved', 'completed'] },
    }).populate('patient', 'name email phone');
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/doctor/appointments/:id - Update status (only complete) & prescription
router.put('/appointments/:id', protect, doctorOnly, async (req, res) => {
  try {
    const apt = await Appointment.findOne({ _id: req.params.id, doctor: req.user._id });
    if (!apt) return res.status(404).json({ message: 'Appointment not found' });

    const { status, prescription, notes } = req.body;
    // Doctor can only mark as completed (not approve/reject - that's admin)
    if (status && status === 'completed') apt.status = status;
    if (prescription !== undefined) apt.prescription = prescription;
    if (notes !== undefined) apt.notes = notes;
    await apt.save();
    res.json(apt);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/doctor/profile
router.get('/profile', protect, doctorOnly, async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user._id }).populate('user', '-password');
    res.json({ user: req.user, doctorProfile: doctor });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/doctor/profile - Update own profile and schedule
router.put('/profile', protect, doctorOnly, async (req, res) => {
  try {
    const {
      specialization, department, qualification, experience,
      consultationFee, bio, availableDays, startTime, endTime,
      slotDuration, isAvailable, licenseNumber,
    } = req.body;

    const updateFields = {};
    if (specialization !== undefined) updateFields.specialization = specialization;
    if (department !== undefined) updateFields.department = department;
    if (qualification !== undefined) updateFields.qualification = Array.isArray(qualification) ? qualification : [qualification];
    if (experience !== undefined) updateFields.experience = experience;
    if (consultationFee !== undefined) updateFields.consultationFee = consultationFee;
    if (bio !== undefined) updateFields.bio = bio;
    if (availableDays !== undefined) updateFields.availableDays = availableDays;
    if (startTime !== undefined) updateFields.startTime = startTime;
    if (endTime !== undefined) updateFields.endTime = endTime;
    if (slotDuration !== undefined) updateFields.slotDuration = slotDuration;
    if (isAvailable !== undefined) updateFields.isAvailable = isAvailable;
    if (licenseNumber !== undefined) updateFields.licenseNumber = licenseNumber;

    const doctor = await Doctor.findOneAndUpdate(
      { user: req.user._id },
      updateFields,
      { new: true, runValidators: true }
    ).populate('user', '-password');

    if (!doctor) return res.status(404).json({ message: 'Doctor profile not found' });

    // Also update user name/phone if provided
    const { name, phone } = req.body;
    if (name || phone) {
      const userUpdate = {};
      if (name) userUpdate.name = name;
      if (phone) userUpdate.phone = phone;
      await User.findByIdAndUpdate(req.user._id, userUpdate);
    }

    res.json(doctor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/doctor/leave - Add leave dates
router.post('/leave', protect, doctorOnly, async (req, res) => {
  try {
    const { dates } = req.body; // array of 'YYYY-MM-DD' strings
    if (!dates || !Array.isArray(dates) || dates.length === 0) {
      return res.status(400).json({ message: 'dates array is required' });
    }

    const doctor = await Doctor.findOneAndUpdate(
      { user: req.user._id },
      { $addToSet: { leaveDates: { $each: dates } } },
      { new: true }
    );
    if (!doctor) return res.status(404).json({ message: 'Doctor profile not found' });
    res.json({ message: 'Leave dates added', leaveDates: doctor.leaveDates });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/doctor/leave - Remove a leave date
router.delete('/leave', protect, doctorOnly, async (req, res) => {
  try {
    const { date } = req.body;
    if (!date) return res.status(400).json({ message: 'date is required' });

    const doctor = await Doctor.findOneAndUpdate(
      { user: req.user._id },
      { $pull: { leaveDates: date } },
      { new: true }
    );
    if (!doctor) return res.status(404).json({ message: 'Doctor profile not found' });
    res.json({ message: 'Leave date removed', leaveDates: doctor.leaveDates });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/doctor/stats
router.get('/stats', protect, doctorOnly, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [totalAppointments, todayCount, approvedCount, completedCount] = await Promise.all([
      Appointment.countDocuments({ doctor: req.user._id }),
      Appointment.countDocuments({
        doctor: req.user._id,
        appointmentDate: { $gte: today, $lt: tomorrow },
        status: { $in: ['approved', 'completed'] },
      }),
      Appointment.countDocuments({ doctor: req.user._id, status: 'approved' }),
      Appointment.countDocuments({ doctor: req.user._id, status: 'completed' }),
    ]);

    res.json({ totalAppointments, todayCount, approvedCount, completedCount });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
