const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const User = require('../models/User');
const Patient = require('../models/Patient');
const { protect, patientOnly } = require('../middleware/auth');

// Helper: generate time slots
function generateTimeSlots(startTime, endTime, slotDuration) {
  const slots = [];
  const [startH, startM] = startTime.split(':').map(Number);
  const [endH, endM] = endTime.split(':').map(Number);
  let current = startH * 60 + startM;
  const end = endH * 60 + endM;
  while (current + slotDuration <= end) {
    const h = Math.floor(current / 60).toString().padStart(2, '0');
    const m = (current % 60).toString().padStart(2, '0');
    slots.push(`${h}:${m}`);
    current += slotDuration;
  }
  return slots;
}

// GET /api/patient/doctors - Only verified & available doctors
router.get('/doctors', protect, patientOnly, async (req, res) => {
  try {
    const doctors = await Doctor.find({ isVerified: true, isAvailable: true })
      .populate('user', 'name email phone');
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/patient/doctors/:doctorId/slots?date=YYYY-MM-DD
router.get('/doctors/:doctorId/slots', protect, patientOnly, async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) return res.status(400).json({ message: 'Date is required' });

    const doctor = await Doctor.findById(req.params.doctorId);
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
    if (!doctor.isVerified || !doctor.isAvailable) {
      return res.status(400).json({ message: 'Doctor is not available for booking' });
    }

    // Check leave
    if (doctor.leaveDates && doctor.leaveDates.includes(date)) {
      return res.json({ slots: [], message: 'Doctor is on leave on this date' });
    }

    // Check day
    const dayNames = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    const selectedDate = new Date(date);
    const dayName = dayNames[selectedDate.getUTCDay()];

    if (doctor.availableDays && doctor.availableDays.length > 0 && !doctor.availableDays.includes(dayName)) {
      return res.json({ slots: [], message: `Doctor is not available on ${dayName}` });
    }

    const allSlots = generateTimeSlots(
      doctor.startTime || '09:00',
      doctor.endTime || '17:00',
      doctor.slotDuration || 30
    );

    const startOfDay = new Date(date);
    startOfDay.setUTCHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setUTCHours(23, 59, 59, 999);

    const booked = await Appointment.find({
      doctor: doctor.user,
      appointmentDate: { $gte: startOfDay, $lte: endOfDay },
      status: { $nin: ['cancelled', 'rejected'] },
    }).select('timeSlot');

    const bookedSlots = booked.map((a) => a.timeSlot);
    const availableSlots = allSlots.filter((s) => !bookedSlots.includes(s));

    res.json({ slots: availableSlots, dayName, message: availableSlots.length === 0 ? 'No slots available for this date' : '' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/patient/appointments - Book appointment
router.post('/appointments', protect, patientOnly, async (req, res) => {
  try {
    const { doctor: doctorId, appointmentDate, timeSlot, reason } = req.body;

    if (!doctorId || !appointmentDate || !timeSlot || !reason) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const doctorProfile = await Doctor.findById(doctorId);
    if (!doctorProfile) return res.status(404).json({ message: 'Doctor not found' });
    if (!doctorProfile.isVerified || !doctorProfile.isAvailable) {
      return res.status(400).json({ message: 'Doctor is not available for booking' });
    }

    const dateStr = new Date(appointmentDate).toISOString().split('T')[0];

    // Check leave
    if (doctorProfile.leaveDates && doctorProfile.leaveDates.includes(dateStr)) {
      return res.status(400).json({ message: 'Doctor is on leave on this date' });
    }

    // Check available day
    const dayNames = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    const selDate = new Date(appointmentDate);
    const dayName = dayNames[selDate.getUTCDay()];
    if (doctorProfile.availableDays && doctorProfile.availableDays.length > 0 && !doctorProfile.availableDays.includes(dayName)) {
      return res.status(400).json({ message: `Doctor is not available on ${dayName}` });
    }

    // Check slot is valid
    const allSlots = generateTimeSlots(
      doctorProfile.startTime || '09:00',
      doctorProfile.endTime || '17:00',
      doctorProfile.slotDuration || 30
    );
    if (!allSlots.includes(timeSlot)) {
      return res.status(400).json({ message: 'Invalid time slot for this doctor' });
    }

    // Check double booking
    const startOfDay = new Date(appointmentDate);
    startOfDay.setUTCHours(0, 0, 0, 0);
    const endOfDay = new Date(appointmentDate);
    endOfDay.setUTCHours(23, 59, 59, 999);

    const conflict = await Appointment.findOne({
      doctor: doctorProfile.user,
      appointmentDate: { $gte: startOfDay, $lte: endOfDay },
      timeSlot,
      status: { $nin: ['cancelled', 'rejected'] },
    });
    if (conflict) return res.status(400).json({ message: 'This time slot is already booked' });

    const appointment = await Appointment.create({
      patient: req.user._id,
      doctor: doctorProfile.user,
      appointmentDate: new Date(appointmentDate),
      timeSlot,
      reason,
      status: 'pending',
    });

    res.status(201).json(appointment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// GET /api/patient/appointments
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

// DELETE /api/patient/appointments/:id - Cancel
router.delete('/appointments/:id', protect, patientOnly, async (req, res) => {
  try {
    const apt = await Appointment.findOne({ _id: req.params.id, patient: req.user._id });
    if (!apt) return res.status(404).json({ message: 'Appointment not found' });
    if (!['pending', 'approved'].includes(apt.status)) {
      return res.status(400).json({ message: 'Cannot cancel this appointment' });
    }
    apt.status = 'cancelled';
    await apt.save();
    res.json({ message: 'Appointment cancelled' });
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
    const [total, pending, approved, completed, cancelled, rejected] = await Promise.all([
      Appointment.countDocuments({ patient: req.user._id }),
      Appointment.countDocuments({ patient: req.user._id, status: 'pending' }),
      Appointment.countDocuments({ patient: req.user._id, status: 'approved' }),
      Appointment.countDocuments({ patient: req.user._id, status: 'completed' }),
      Appointment.countDocuments({ patient: req.user._id, status: 'cancelled' }),
      Appointment.countDocuments({ patient: req.user._id, status: 'rejected' }),
    ]);
    res.json({ total, pending, approved, completed, cancelled, rejected });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
