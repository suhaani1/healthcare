const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  age: Number,
  gender: { type: String, enum: ["Male", "Female", "Other"] },
  height: Number,
  weight: Number,
  bloodGroup: String,
  allergies: String,
  profileImage: String, // Base64 URL or image path
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Patient", patientSchema);
