import "./models/User.js";
import "./models/Doctor.js";
import "./models/Patient.js";
import "./models/Appointment.js";
import "./models/MedicalRecord.js";


import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

import "./models/User.js";
import "./models/Doctor.js";
import "./models/Patient.js";
import "./models/Appointment.js";
import "./models/MedicalRecord.js";

import doctorRoutes from "./routes/doctorRoutes.js";
import patientRoutes from "./routes/patientRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hospital Backend Running...");
});

app.use("/api/doctors", doctorRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/appointments", appointmentRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});