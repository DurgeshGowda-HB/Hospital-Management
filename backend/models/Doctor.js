import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    specialization: {
      type: String,
      required: true,
      trim: true,
    },

    experience: {
      type: Number,
      required: true,
      min: 0,
    },

    fees: {
      type: Number,
      required: true,
      min: 0,
    },

    availability: {
      type: String,
      required: true,
    },

    department: {
      type: String,
      required: true,
    },

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, //records time
  }
);

const Doctor = mongoose.model("Doctor", doctorSchema);

export default Doctor;