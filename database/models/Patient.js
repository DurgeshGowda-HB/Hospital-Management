import mongoose from "mongoose";

const patientSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId, //connecting Patient collection with User collection
      ref: "User", //cause every patient is also a user
      required: true,
    },

    age: {
      type: Number,
      required: true,
      min: 0,
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: true,
    },

    bloodGroup: {
      type: String,
      required: true,
    },

    address: {
      type: String,
      required: true,
      trim: true,
    },

    emergencyContact: {
      type: String,
      required: true,
    },

    medicalHistory: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Patient = mongoose.model("Patient", patientSchema);

export default Patient;