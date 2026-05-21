const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  specialization: { type: String, required: true },
  qualification: [{ type: String }],
  experience: { type: Number, default: 0 },
  licenseNumber: { type: String },
  department: { type: String },
  consultationFee: { type: Number, default: 500 },
  bio: { type: String, default: '' },

  // Availability / Schedule
  availableDays: [{ type: String, enum: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'] }],
  startTime: { type: String, default: '09:00' },
  endTime: { type: String, default: '17:00' },
  slotDuration: { type: Number, default: 30 },
  isAvailable: { type: Boolean, default: true },
  leaveDates: [{ type: String }],

  // Verification
  isVerified: { type: Boolean, default: false },
  verificationStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  verifiedAt: { type: Date },
  verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

  rating: { type: Number, default: 0, min: 0, max: 5 },
  totalReviews: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Doctor', doctorSchema);
