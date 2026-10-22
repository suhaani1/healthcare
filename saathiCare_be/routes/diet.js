// const express = require('express');
// const router = express.Router();
// const Diet = require('../models/diet');

// // Create a new diet entry
// router.post('/', async (req, res) => {
//   try {
//     const diet = new Diet(req.body);
//     await diet.save();
//     res.status(201).json(diet);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

// // Get all diet entries for a patient
// router.get('/:patientId', async (req, res) => {
//   try {
//     const diets = await Diet.find({ patient: req.params.patientId });
//     res.json(diets);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Update a diet entry
// router.put('/:id', async (req, res) => {
//   try {
//     const diet = await Diet.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     if (!diet) return res.status(404).json({ message: 'Diet entry not found' });
//     res.json(diet);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

// // Delete a diet entry
// router.delete('/:id', async (req, res) => {
//   try {
//     const diet = await Diet.findByIdAndDelete(req.params.id);
//     if (!diet) return res.status(404).json({ message: 'Diet entry not found' });
//     res.json({ message: 'Diet entry deleted successfully' });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// module.exports = router;






const express = require('express');
const router = express.Router();
const Diet = require('../models/diet');


// ✅ CREATE diet
router.post('/', async (req, res) => {
  try {
    const { patient, protein, fats, carbs, notes } = req.body;

    const diet = new Diet({
      patient,
      protein,
      fats,
      carbs,
      notes
    });

    await diet.save();
    res.status(201).json(diet);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


// ✅ GET diet by patient ID (latest one)
router.get('/patient/:patientId', async (req, res) => {
  try {
    const diet = await Diet.findOne({ patient: req.params.patientId })
      .sort({ date: -1 });

    if (!diet) return res.status(404).json({ message: "No diet found" });

    res.json(diet);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ✅ UPDATE diet by ID
router.put('/:id', async (req, res) => {
  try {
    let diet;

    // ✅ If no diet exists → create new
    if (req.params.id === "new") {
      diet = new Diet(req.body);
      await diet.save();
    } else {
      // ✅ Update existing
      diet = await Diet.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );

      if (!diet) {
        return res.status(404).json({ message: "Diet not found" });
      }
    }

    res.json(diet);
  } catch (err) {
    console.error("Update error:", err);
    res.status(400).json({ error: err.message });
  }
});


// ✅ DELETE diet
router.delete('/:id', async (req, res) => {
  try {
    const diet = await Diet.findByIdAndDelete(req.params.id);

    if (!diet) {
      return res.status(404).json({ message: 'Diet not found' });
    }

    res.json({ message: 'Diet deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;