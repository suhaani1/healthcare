const express = require("express");
const router = express.Router();
const multer = require("multer");
const Patient = require("../models/login_tab");

// Storage for Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });


// GET /api/patient/dashboard
router.get("/dashboard", async (req, res) => {
  try {
    const { email } = req.query;
    const patient = await Patient.findOne({ email });

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // Example static data (replace with DB data if available)
    const diet = { protein: 60, fats: 45, carbs: 200 };
    const symptoms = { lastEntry: "Fatigue", date: "2025-06-18" };
    const appointments = { next: "2025-06-22 with Dr. Smith" };
    const medications = [
      { name: "Paracetamol 500mg", dosage: "2/day" },
      { name: "Vitamin D", dosage: "1/day" },
    ];
    const wellnessTips = [
      "Drink at least 8 glasses of water",
      "Sleep for 7–8 hours today",
    ];

    res.json({
      profile: patient,
      diet,
      symptoms,
      appointments,
      medications,
      wellnessTips,
    });
  } catch (error) {
    console.error("Dashboard fetch error:", error);
    res.status(500).json({ message: "Server error" });
  }
});


// Create or Update Patient
router.post("/profile", upload.single("profileImage"), async (req, res) => {
  try {
    const { name, age, gender, email, height, weight } = req.body;

    const bmi =
      height && weight ? (weight / ((height / 100) * (height / 100))).toFixed(2) : null;

    const patientData = {
      name,
      age,
      gender,
      email,
      height,
      weight,
      bmi,
      profileImage: req.file ? req.file.path : null,
    };

    // Upsert: update if exists else create
    const patient = await Patient.findOneAndUpdate({ email }, patientData, {
      new: true,
      upsert: true,
    });

    res.json({ success: true, patient });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Get Patient by Email
router.get("/getPatient", async (req, res) => {
  try {
    const { email } = req.query;
    const patient = await Patient.findOne({ email });
    if (!patient) return res.status(404).json({ message: "Patient not found" });
    res.json(patient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
