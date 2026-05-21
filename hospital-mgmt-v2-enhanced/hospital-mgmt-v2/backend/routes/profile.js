const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// GET /api/profile - Get own profile
router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/profile - Update own profile
router.put('/', protect, async (req, res) => {
  try {
    const { name, phone, address, profilePic } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone, address, profilePic },
      { new: true, runValidators: true }
    ).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/profile/password - Change password
router.put('/password', protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);
    if (!(await user.matchPassword(currentPassword)))
      return res.status(400).json({ message: 'Current password is incorrect' });

    user.password = newPassword;
    await user.save();
    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
