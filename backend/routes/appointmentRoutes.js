const router = require("express").Router();
const Appointment = require("../models/Appointment");

router.post("/", async (req, res) => {
  try {
    const { doctorId, patientId, appointmentDate, appointmentTime, reason } = req.body;

    if (!doctorId || !patientId) {
      return res.status(400).json({ msg: "Missing fields" });
    }

    const appointment = await Appointment.create({
      doctorId,
      patientId,
      appointmentDate,
      appointmentTime,
      reason,
    });

    res.json(appointment);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/", async (req, res) => {
  try {
    const data = await Appointment.find()
      .populate("doctorId")
      .populate({
        path: "patientId",
        populate: { path: "userId" },
      });

    res.json(data);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
