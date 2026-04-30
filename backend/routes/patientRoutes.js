import express from "express";
import Patient from "../models/Patient.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const patient = await Patient.create(req.body);
    res.json(patient);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const patients = await Patient.find().populate("userId");
    res.json(patients);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;