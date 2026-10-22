const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
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
  specialization: {
    type: String,
    required: true,
  },
  license: {
    type: String,
    required: true,
  },
  experience: {
    type: Number, // Changed from String to Number
  },
  qualifications: {
    type: String,
  },
  gender: {
    type: String,
  },
  bio: { // New field for the doctor's biography
    type: String,
  },
  profilePhoto: { // New field to store the profile photo as a Base64 string
    type: String,
  },
});

module.exports = mongoose.model("doctor_tab", doctorSchema);