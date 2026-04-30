import dotenv from "dotenv";
import connectDB from "./config/db.js";
import Appointment from "./models/Appointment.js";

import "./models/User.js";
import "./models/Doctor.js";
import "./models/Patient.js";

dotenv.config();
await connectDB();

const getAppointments = async () => {
  try {
    const appointments = await Appointment.find()
      .populate({
        path: "patientId",
        populate: {
          path: "userId",
        },
      })
      .populate("doctorId");

    console.log(JSON.stringify(appointments, null, 2));
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

getAppointments();