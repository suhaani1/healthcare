const express = require("express");
const router = express.Router();
const multer = require("multer");
const Patient = require("../models/patient_tab");
const { calculateBMI, calculateBMR } = require("../utils/metrics");

// ---------- Multer Storage ----------
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// ---------- Create / Update Patient Profile ----------
router.post("/profile", upload.single("profileImage"), async (req, res) => {
  try {
    const { email, fullName, phone, age, gender, height, weight } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const bmi = height && weight ? (weight / ((height / 100) ** 2)).toFixed(2) : null;

    const updateData = {
      fullName,
      phone,
      age,
      gender,
      height,
      weight,
      bmi,
    };

    if (req.file) updateData.profileImage = req.file.path; // keep path consistent

    const patient = await Patient.findOneAndUpdate(
      { email },
      { $set: updateData },
      { new: true, upsert: true } // create if not exists
    );

    res.json({ success: true, patient });
  } catch (err) {
    console.error("Profile update error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ---------- Get Patient by Email ----------
router.get("/getPatient", async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const patient = await Patient.findOne({ email });
    if (!patient) return res.status(404).json({ message: "Patient not found" });

    res.json({ success: true, patient });
  } catch (err) {
    console.error("Get patient error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ---------- Calculate BMI & BMR ----------
router.post("/calculateMetrics", (req, res) => {
  const { weight, height, age, gender } = req.body;

  if (!weight || !height || !age || !gender) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const h = height / 100; // cm → meters
  const bmi = parseFloat((weight / (h * h)).toFixed(1));

  let bmr;
  if (gender.toLowerCase() === "male") {
    bmr = Math.round(10 * weight + 6.25 * height - 5 * age + 5);
  } else {
    bmr = Math.round(10 * weight + 6.25 * height - 5 * age - 161);
  }

  let category = "N/A";
  if (bmi < 18.5) category = "Underweight";
  else if (bmi < 25) category = "Normal";
  else if (bmi < 30) category = "Overweight";
  else category = "Obese";

  res.json({ bmi, category, bmr });
});

// ---------- Get Patient Dashboard ----------
router.get("/dashboard", async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ error: "Email required" });

    const patient = await Patient.findOne({ email });
    if (!patient) return res.status(404).json({ error: "Patient not found" });

    // Calculate metrics
    const bmiData = calculateBMI(patient.weight, patient.height);
    const bmrValue = calculateBMR(patient.weight, patient.height, patient.age, patient.gender);

    // Get next appointment
    let nextAppointment = null;
    if (patient.appointments && patient.appointments.length > 0) {
      const upcoming = patient.appointments
        .filter(a => new Date(a.date) >= new Date())
        .sort((a, b) => new Date(a.date) - new Date(b.date));
      nextAppointment = upcoming.length > 0 ? upcoming[0] : null;
    }

    res.json({
      profile: patient,
      diet: patient.diet || {},
      symptoms: patient.symptoms || {},
      appointments: { next: nextAppointment },
      medications: patient.medications || [],
      wellnessTips: patient.wellnessTips || [],
      metrics: {
        bmi: bmiData.bmi,
        category: bmiData.category,
        bmr: bmrValue,
      },
    });
  } catch (err) {
    console.error("Error fetching dashboard:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
