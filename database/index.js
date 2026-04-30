import dotenv from "dotenv";
import connectDB from "./config/db.js";

import "./models/User.js";
import "./models/Doctor.js";
import "./models/Patient.js";
import "./models/Appointment.js";
import "./models/MedicalRecord.js";

dotenv.config();

connectDB();