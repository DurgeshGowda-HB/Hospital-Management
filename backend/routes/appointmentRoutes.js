import express from "express";
import Appointment from "../models/Appointment.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const {
      doctorId,
      patientId,
      appointmentDate,
      appointmentTime,
      reason,
    } = req.body;

    if (!doctorId || !patientId) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    const appointment = await Appointment.create({
      doctorId,
      patientId,
      appointmentDate,
      appointmentTime,
      reason,
    });

    res.status(201).json(appointment);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("doctorId")
      .populate({
        path: "patientId",
        populate: {
          path: "userId",
        },
      });

    res.json(appointments);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

export default router;