const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/doctors", require("./routes/doctorRoutes"));
app.use("/api/appointments", require("./routes/appointmentRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/patients", require("./routes/patientRoutes"));

app.listen(5000, () => console.log("Server running on port 5000"));
