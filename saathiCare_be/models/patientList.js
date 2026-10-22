// models/Patient.js
const mongoose = require('mongoose');

const PatientSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  phone: String,
  age: Number,
  gender: String,
  profileImage: String,
  medicalRecords: [
    {
      date: Date,
      symptoms: String,
      diagnosis: String,
      prescription: String,
    }
  ]
});

module.exports = mongoose.model('PatientList', PatientSchema);
