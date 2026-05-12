const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  appointmentDate: { type: Date, required: true },
  timeSlot: { type: String, required: true },
  reason: { type: String, required: true },
  status: {
    type: String,
    enum: ['pending', 'approved', 'completed', 'cancelled', 'rejected'],
    default: 'pending',
  },
  notes: { type: String },
  prescription: { type: String },
  followUp: { type: Date },
  rejectedReason: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);
