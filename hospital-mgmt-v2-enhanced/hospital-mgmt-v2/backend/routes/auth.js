const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const { protect } = require('../middleware/auth');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, role, specialization, department, qualification, experience, licenseNumber, consultationFee, bio } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: 'Name, email and password are required' });

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already registered' });

    const allowedRoles = ['patient', 'doctor'];
    const userRole = allowedRoles.includes(role) ? role : 'patient';

    const user = await User.create({ name, email, password, phone, role: userRole });

    if (userRole === 'patient') {
      await Patient.create({ user: user._id });
    }

    if (userRole === 'doctor') {
      await Doctor.create({
        user: user._id,
        specialization: specialization || 'General',
        department: department || '',
        qualification: qualification ? (Array.isArray(qualification) ? qualification : [qualification]) : [],
        experience: experience || 0,
        licenseNumber: licenseNumber || '',
        consultationFee: consultationFee || 500,
        bio: bio || '',
        availableDays: ['Monday','Tuesday','Wednesday','Thursday','Friday'],
        startTime: '09:00',
        endTime: '17:00',
        slotDuration: 30,
        isVerified: false,
        verificationStatus: 'pending',
      });
    }

    res.status(201).json({
      _id: user._id, name: user.name, email: user.email, role: user.role,
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/auth/login (generic)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ message: 'Invalid email or password' });
    if (!user.isActive)
      return res.status(403).json({ message: 'Account is deactivated' });

    res.json({ _id: user._id, name: user.name, email: user.email, role: user.role, token: generateToken(user._id) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/auth/admin/login
router.post('/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ message: 'Invalid email or password' });
    if (user.role !== 'admin')
      return res.status(403).json({ message: 'Access denied. Admin credentials required.' });
    if (!user.isActive)
      return res.status(403).json({ message: 'Account is deactivated' });

    res.json({ _id: user._id, name: user.name, email: user.email, role: user.role, token: generateToken(user._id) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/auth/doctor/login
// POST /api/auth/doctor/login
router.post('/doctor/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({
        message: 'Invalid email or password'
      });

    if (user.role !== 'doctor')
      return res.status(403).json({
        message: 'Access denied. Doctor credentials required.'
      });

    if (!user.isActive)
      return res.status(403).json({
        message: 'Account is deactivated'
      });

    const doctorProfile = await Doctor.findOne({ user: user._id });

    // IMPORTANT APPROVAL CHECK
    if (
      !doctorProfile ||
      doctorProfile.verificationStatus !== 'approved'
    ) {
      return res.status(403).json({
        message:
          'Your account is waiting for admin approval.'
      });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
      isVerified: doctorProfile.isVerified,
      verificationStatus: doctorProfile.verificationStatus,
    });

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});
// POST /api/auth/patient/login
router.post('/patient/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ message: 'Invalid email or password' });
    if (user.role !== 'patient')
      return res.status(403).json({ message: 'Access denied. Patient credentials required.' });
    if (!user.isActive)
      return res.status(403).json({ message: 'Account is deactivated' });

    res.json({ _id: user._id, name: user.name, email: user.email, role: user.role, token: generateToken(user._id) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/auth/me
router.get('/me', protect, (req, res) => {
  res.json(req.user);
});

module.exports = router;