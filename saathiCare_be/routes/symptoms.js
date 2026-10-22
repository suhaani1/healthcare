// var express = require("express");
// var router = express.Router();

// var Symptom = require("../models/symptom");


// //POST /sysptoms/add
// router.post("/add", async(req,res) => {
//    var { userId, date, symptoms, severity, notes } =req.body;
//    if(!userId || !date || !symptoms || !severity) {
//       return res.statusMessage(400).json({error:"Required fields are missing"})
      
//    }
//    try {
//       const record = new Symptom({ userId, date, symptoms, severity, notes });
//       await record.save();
//       res.statusMessage(201).json({ message:"symptoms logged", date: record });
//    }
//    catch(error) {
//       res.status(500).json({ error:"server error while adding symptoms"});
//    }
// });


// // GET /api/symptoms/all
// router.get("/all", async (req, res) => {
//   try {
//     const logs = await Symptom.find().sort({ date: -1 });
//     res.status(200).json(logs);
//   } catch (err) {
//     res.status(500).json({ error: "Error fetching symptoms" });
//   }
// });

// // PUT /api/symptoms/:id
// router.put("/update/:id", async (req, res) => {
//   try {
//     const updated = await Symptom.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     if (!updated) return res.status(404).json({ error: "Record not found" });
//     res.json({ message: "Updated", data: updated });
//   } catch (err) {
//     res.status(500).json({ error: "Update error" });
//   }
// });

// // DELETE /api/symptoms/:id
// router.delete("/delete/:id", async (req, res) => {
//   try {
//     const deleted = await Symptom.findByIdAndDelete(req.params.id);
//     if (!deleted) return res.status(404).json({ error: "Not found" });
//     res.json({ message: "Deleted successfully" });
//   } catch (err) {
//     res.status(500).json({ error: "Delete error" });
//   }
// });
// router.post("/predict-disease", async (req, res) => {
//   try {
//     const { symptoms } = req.body;

//     // Call Flask API
//     const response = await axios.post("http://127.0.0.1:5000/predict", {
//       symptoms,
//     });

//     // Return prediction to frontend
//     res.json({ predicted_disease: response.data.predicted_disease });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Prediction failed" });
//   }
// });

// module.exports = router;






var express = require("express");
var router = express.Router();
const axios = require("axios"); // ✅ FIXED

var Symptom = require("../models/symptom");


// ✅ POST /symptoms/add
router.post("/add", async (req, res) => {
  const { userId, date, symptoms, severity, notes } = req.body;

  if (!userId || !date || !symptoms || !severity) {
    return res.status(400).json({ error: "Required fields are missing" }); // ✅ FIXED
  }

  try {
    const record = new Symptom({ userId, date, symptoms, severity, notes });
    await record.save();

    res.status(201).json({
      message: "Symptoms logged",
      data: record
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error while adding symptoms" });
  }
});


// ✅ GET all symptoms
router.get("/all", async (req, res) => {
  try {
    const logs = await Symptom.find().sort({ date: -1 });
    res.status(200).json(logs);
  } catch (err) {
    res.status(500).json({ error: "Error fetching symptoms" });
  }
});


// ✅ UPDATE
router.put("/update/:id", async (req, res) => {
  try {
    const updated = await Symptom.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: "Record not found" });

    res.json({ message: "Updated", data: updated });
  } catch (err) {
    res.status(500).json({ error: "Update error" });
  }
});


// ✅ DELETE
router.delete("/delete/:id", async (req, res) => {
  try {
    const deleted = await Symptom.findByIdAndDelete(req.params.id);

    if (!deleted) return res.status(404).json({ error: "Not found" });

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Delete error" });
  }
});


// ✅ CALL FLASK API
router.post("/predict", async (req, res) => {
  try {
    const { symptoms } = req.body;

    if (!symptoms) {
      return res.status(400).json({ error: "Symptoms required" });
    }

    const response = await axios.post("http://127.0.0.1:5000/predict", {
      symptoms
    });

    res.json({
      predicted_disease: response.data.predicted_disease
    });

  } catch (error) {
    console.error("FULL ERROR:", error.response?.data || error.message);
  if (error.code === "ECONNREFUSED") {
      return res.status(500).json({ error: "Flask server not running" });
    }

    res.status(500).json({ error: "Prediction failed" });
  }
});

module.exports = router;