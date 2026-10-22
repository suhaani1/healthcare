// utils/metrics.js

function calculateBMI(weight, height) {
  if (!weight || !height) return { bmi: null, category: "N/A" };

  const hMeters = height / 100;
  const bmiValue = weight / (hMeters * hMeters);

  let category = "N/A";
  if (bmiValue < 18.5) category = "Underweight";
  else if (bmiValue < 24.9) category = "Normal";
  else if (bmiValue < 29.9) category = "Overweight";
  else category = "Obese";

  return { bmi: bmiValue.toFixed(2), category };
}

function calculateBMR(weight, height, age, gender) {
  if (!weight || !height || !age || !gender) return null;

  let bmrValue;
  if (gender.toLowerCase() === "male") {
    bmrValue = 88.36 + 13.4 * weight + 4.8 * height - 5.7 * age;
  } else {
    bmrValue = 447.6 + 9.2 * weight + 3.1 * height - 4.3 * age;
  }

  return bmrValue.toFixed(2);
}

module.exports = { calculateBMI, calculateBMR };
