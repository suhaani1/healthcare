const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    min: 0,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  height: {
    type: Number,
    min: 0,
  },
  weight: {
    type: Number,
    min: 0,
  },
   profileImage: {
    type: String,
  },
  bloodGroup: {
  type: String,
  trim: true,
},
  diet: { type: Object, default: {} },
  symptoms: { type: Object, default: {} },
  medications: { type: Array, default: [] },
  wellnessTips: { type: Array, default: [] },
  appointments: {
    type: [
      {
        date: Date,
        doctor: String,
        reason: String,
      },
    ],
    default: [],
  },
});

module.exports = mongoose.model("patient_tab", patientSchema);