// routes/health.js
const express = require("express");
const router = express.Router();

// BMI Calculation
function calculateBMI(weight, height) {
  if (!weight || !height) return null;
  const h = height / 100;
  return +(weight / (h * h)).toFixed(1);
}

// BMR Calculation
function calculateBMR(weight, height, age, gender) {
  if (!weight || !height || !age || !gender) return null;
  if (gender.toLowerCase() === "male") {
    return +(10 * weight + 6.25 * height - 5 * age + 5).toFixed(0);
  } else {
    return +(10 * weight + 6.25 * height - 5 * age - 161).toFixed(0);
  }
}

// API endpoint
router.post("/calculate", (req, res) => {
  const { weight, height, age, gender } = req.body;

  const bmi = calculateBMI(weight, height);
  const bmr = calculateBMR(weight, height, age, gender);

  let category = "N/A";
  if (bmi) {
    if (bmi < 18.5) category = "Underweight";
    else if (bmi < 25) category = "Normal";
    else if (bmi < 30) category = "Overweight";
    else category = "Obese";
  }

  res.json({
    bmi,
    bmiCategory: category,
    bmr,
  });
});

module.exports = router;
