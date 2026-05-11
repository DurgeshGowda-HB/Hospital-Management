const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  specialization: { type: String, required: true },
  qualification: [{ type: String }],
  experience: { type: Number, default: 0 },
  licenseNumber: { type: String, unique: true },
  department: { type: String },
  consultationFee: { type: Number, default: 500 },
  availableDays: [{ type: String, enum: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'] }],
  availableTimeStart: { type: String, default: '09:00' },
  availableTimeEnd: { type: String, default: '17:00' },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  totalReviews: { type: Number, default: 0 },
  isAvailable: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Doctor', doctorSchema);
