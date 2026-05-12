const express = require('express');
const router = express.Router();
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');

// Helper: generate time slots from startTime to endTime with slotDuration
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

// GET /api/doctors - Only verified & available doctors (for patients)
router.get('/', async (req, res) => {
  try {
    const { specialization, department } = req.query;
    const filter = { isVerified: true, isAvailable: true };
    if (specialization) filter.specialization = new RegExp(specialization, 'i');
    if (department) filter.department = new RegExp(department, 'i');

    const doctors = await Doctor.find(filter).populate('user', '-password');
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/doctors/all - All doctors (admin use)
router.get('/all', protect, adminOnly, async (req, res) => {
  try {
    const doctors = await Doctor.find().populate('user', '-password').sort({ createdAt: -1 });
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/doctors/:id - Get single doctor
router.get('/:id', async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate('user', '-password');
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
    res.json(doctor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/doctors/:id/slots?date=YYYY-MM-DD - Get available slots for a doctor on a date
router.get('/:id/slots', async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) return res.status(400).json({ message: 'Date is required' });

    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
    if (!doctor.isVerified || !doctor.isAvailable) {
      return res.status(400).json({ message: 'Doctor is not available for booking' });
    }

    // Check if the selected date is a leave date
    if (doctor.leaveDates && doctor.leaveDates.includes(date)) {
      return res.json({ slots: [], message: 'Doctor is on leave on this date' });
    }

    // Check if the selected date's day is in availableDays
    const selectedDate = new Date(date);
    const dayNames = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    const dayName = dayNames[selectedDate.getUTCDay()];

    if (doctor.availableDays && doctor.availableDays.length > 0 && !doctor.availableDays.includes(dayName)) {
      return res.json({ slots: [], message: `Doctor is not available on ${dayName}` });
    }

    // Generate all possible slots
    const allSlots = generateTimeSlots(
      doctor.startTime || '09:00',
      doctor.endTime || '17:00',
      doctor.slotDuration || 30
    );

    // Find booked slots for this doctor on this date
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

    res.json({ slots: availableSlots, dayName, bookedSlots });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/doctors - Create doctor profile (admin)
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { userId, specialization, qualification, experience, licenseNumber, department, consultationFee, availableDays, startTime, endTime, slotDuration } = req.body;
    await User.findByIdAndUpdate(userId, { role: 'doctor' });
    const doctor = await Doctor.create({
      user: userId, specialization, qualification, experience, licenseNumber, department,
      consultationFee, availableDays, startTime, endTime, slotDuration,
    });
    res.status(201).json(doctor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/doctors/:id - Update doctor (admin)
router.put('/:id', protect, adminOnly, async (req, res) => {
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
