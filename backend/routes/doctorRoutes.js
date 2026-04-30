const router = require("express").Router();
const Doctor = require("../models/Doctor");

router.get("/", async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.json(doctors);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    res.json(doctor);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
