const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  dateOfBirth: { type: Date },
  gender: { type: String, enum: ['male', 'female', 'other'] },
  bloodGroup: { type: String, enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] },
  allergies: [{ type: String }],
  medicalHistory: [
    {
      condition: String,
      diagnosedDate: Date,
      notes: String,
    },
  ],
  emergencyContact: {
    name: String,
    phone: String,
    relation: String,
  },
  insurance: {
    provider: String,
    policyNumber: String,
  },
}, { timestamps: true });

module.exports = mongoose.model('Patient', patientSchema);
