// const express = require("express");
// const router = express.Router();
// var mongoose = require('mongoose');
// const Bmi = require("../models/calculate_data");


// //post /api/bmi/calculate
// router.post("/calculate", async (req, res) => {
//   const { weight, height } = req.body;
//   if (!weight || !height) {
//     return res.status(400).send({ error: "Weight and height are required" });
//   }

//   const heightInMeters = height / 100; // Convert height from cm to meters
//   const bmi = weight / (heightInMeters * heightInMeters); // Calculate BMI
//   let category = "";
//   if (bmi < 18.5) {
//     category = "Underweight";
//   } else if (bmi >= 18.5 && bmi < 24.9) {
//     category = "Normal weight";
//   } else if (bmi >= 25 && bmi < 29.9) {
//     category = "Overweight";
//   } else {
//     category = "Obesity";
//   }
//   try {
//     const bmiRecord = new Bmi({
//       weight,
//       height,
//       bmi: parseFloat(bmi.toFixed(2)), // Round to 2 decimal places
//       category,
//     });
//     await bmiRecord.save();
//     res.status(201).send({
//       message: "BMI calculated successfully",
//       bmi: bmiRecord.bmi,
//       category: bmiRecord.category,
//       date: bmiRecord.date,
//     });
//   } catch (error) {
//     res.status(500).send({ error: "An error occurred while calculating BMI" });
//   }
// });


// // GET /api/bmi/history
// router.get("/history", async (req, res) => {
//   try {
//     const bmiRecords = await Bmi.find().sort({ date: -1 }); // Sort by date in descending order
//     res.status(200).send(bmiRecords);
//   } catch (error) {
//     res.status(500).send({ error: "An error occurred while fetching BMI history" });
//   }
// });

// //update /api/bmi/:id
// router.put("/update/:id", async (req, res) => {
//   const { weight, height } = req.body;
//   if (!weight || !height) {
//     return res.status(400).send({ error: "Weight and height are required" });
//   }

//   const heightInMeters = height / 100; // Convert height from cm to meters
//   const bmi = weight / (heightInMeters * heightInMeters); // Calculate BMI
//   let category = "";
//   if (bmi < 18.5) {
//     category = "Underweight";
//   } else if (bmi >= 18.5 && bmi < 24.9) {
//     category = "Normal weight";
//   } else if (bmi >= 25 && bmi < 29.9) {
//     category = "Overweight";
//   } else {
//     category = "Obesity";
//   }

//   try {
//     const updatedBmiRecord = await Bmi.findByIdAndUpdate(
//       req.params.id,
//       { weight, height, bmi: parseFloat(bmi.toFixed(2)), category },
//       { new: true }
//     );
//     if (!updatedBmiRecord) {
//       return res.status(404).send({ error: "BMI record not found" });
//     }
//     res.status(200).send({
//       message: "BMI updated successfully",
//       bmi: updatedBmiRecord.bmi,
//       category: updatedBmiRecord.category,
//       date: updatedBmiRecord.date,
//     });
//   } catch (error) {
//     res.status(500).send({ error: "An error occurred while updating BMI" });
//   }
// });


// // DELETE /api/bmi/:id
// router.delete("/delete/:id", async (req, res) => {
//   try {
//     const deletedBmiRecord = await Bmi.findByIdAndDelete(req.params.id);
//     if (!deletedBmiRecord) {
//       return res.status(404).send({ error: "BMI record not found" });
//     }
//     res.status(200).send({ message: "BMI record deleted successfully" });
//   } catch (error) {
//     res.status(500).send({ error: "An error occurred while deleting BMI record" });
//   }
// });

// // post /api/calories
// router.post("/calories", async (req, res) => {
//   const { weight, height, age,gender, activity, goal} = req.body;
//   if (!weight || !height || !age || !gender || !activity || !goal) {
//     return res.status(400).send({ error: "All fields are required" });
//   }
//   let bmr;
//   if(gender === "male") {
//     bmr = 66 + (13.7 * weight) + (5 * height) - (6.8 * age);
//   }
//   else if(gender === "female") {
//     bmr = 655 + (9.6 * weight) + (1.8 * height) - (4.7 * age);
//   } else {
//     return res.status(400).send({ error: "Invalid gender" });
//   }

//   const activityFactor = {
//     "sedentary": 1.2,
//     "lightly active": 1.375,
//     "moderately active": 1.55,
//     "very active": 1.725,
//     "super active": 1.9
//   };

//   if (!activityFactor[activity]) {
//     return res.status(400).send({ error: "Invalid activity level" });
//   }

//   let calories = bmr * activityFactor[activity];
//   if (goal === "lose") {
//     calories -= 500; // Subtract 500 calories for weight loss
//   } else if (goal === "gain") {
//     calories += 500; // Add 500 calories for weight gain
//   } else if (goal !== "maintain") {
//     return res.status(400).send({ error: "Invalid goal" });
//   }
//   calories = Math.round(calories); // Round to nearest whole number
//   res.status(200).send({
//     message: "Calories calculated successfully",
//     calories: calories,
//     bmr: Math.round(bmr), // Round BMR to nearest whole number
//     activity: activity,
//     goal: goal
//   });
// }
// );

// // GET /api/calories/history
// router.get("/calories/history", async (req, res) => {
//   try {
//     const calorieRecords = await Bmi.find().sort({ date: -1 }); // Sort by date in descending order
//     res.status(200).send(calorieRecords);
//   } catch (error) {
//     res.status(500).send({ error: "An error occurred while fetching calorie history" });
//   }
// });

// // Update /api/calories/:id
// router.put("/calories/:id", async (req, res) => {
//   const { weight, height, age, gender, activity, goal } = req.body;
//   if (!weight || !height || !age || !gender || !activity || !goal) {
//     return res.status(400).send({ error: "All fields are required" });
//   } 
//   let bmr;
//   if(gender === "male") {
//     bmr = 66 + (13.7 * weight) + (5 * height) - (6.8 * age);
//   }
//   else if(gender === "female") {
//     bmr = 655 + (9.6 * weight) + (1.8 * height) - (4.7 * age);
//   }

//   else {
//     return res.status(400).send({ error: "Invalid gender" });
//   }
//   const activityFactor = {
//     "sedentary": 1.2,
//     "lightly active": 1.375,
//     "moderately active": 1.55,
//     "very active": 1.725,
//     "super active": 1.9
//   };
//   if (!activityFactor[activity]) {
//     return res.status(400).send({ error: "Invalid activity level" });
//   }

//   let calories = bmr * activityFactor[activity];
//   if (goal === "lose") {
//     calories -= 500; // Subtract 500 calories for weight loss
//   } else if (goal === "gain") {
//     calories += 500; // Add 500 calories for weight gain
//   } else if (goal !== "maintain") {
//     return res.status(400).send({ error: "Invalid goal" });
//   }
//   calories = Math.round(calories); // Round to nearest whole number
//   try {
//     const updatedCalorieRecord = await Bmi.findByIdAndUpdate(
//       req.params.id,
//       { weight, height, age, gender, activity, goal, calories: calories, bmr: Math.round(bmr) },
//       { new: true } // Return the updated document
//     );
//     if (!updatedCalorieRecord) {
//       return res.status(404).send({ error: "Calorie record not found" });
//     }
//     res.status(200).send({
//       message: "Calories updated successfully",
//       calories: updatedCalorieRecord.calories,
//       bmr: updatedCalorieRecord.bmr,
//       activity: updatedCalorieRecord.activity,
//       goal: updatedCalorieRecord.goal,
//       date: updatedCalorieRecord.date
//     });
//   } catch (error) {
//     res.status(500).send({ error: "An error occurred while updating calorie record" });
//   }
// }
// );

// // DELETE /api/calories/:id
// router.delete("/calories/delete/:id", async (req, res) => {
//   try {
//     const deletedCalorieRecord = await Bmi.findByIdAndDelete(req.params.id);
//     if (!deletedCalorieRecord) {
//       return res.status(404).send({ error: "Calorie record not found" });
//     }
//     res.status(200).send({ message: "Calorie record deleted successfully" });
//   } catch (error) {
//     res.status(500).send({ error: "An error occurred while deleting calorie record" });
//   }
// });




// module.exports = router;


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
