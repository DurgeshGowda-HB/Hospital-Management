const router = require("express").Router();
const Patient = require("../models/Patient");

router.post("/", async (req, res) => {
  try {
    const patient = await Patient.create(req.body);
    res.json(patient);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/", async (req, res) => {
  try {
    const patients = await Patient.find().populate("userId");
    res.json(patients);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
