const mongoose = require('mongoose');

const DietSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'login_tab',
    required: true
  },
  protein: { type: Number, default: 0 },
  fats: { type: Number, default: 0 },
  carbs: { type: Number, default: 0 },
  notes: String,
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Diet', DietSchema);