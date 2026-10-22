const mongoose = require('mongoose');

const MedicationSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'login_tab', required: true },
  name: String,
  dosage: String,
  frequency: String,
  notes: String,
  startDate: Date,
  endDate: Date
});

module.exports = mongoose.model('Medication', MedicationSchema);
