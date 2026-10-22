// models/appointment_tab.js

const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "doctor_tab", // Links to the doctor's profile
    required: true,
  },
  patientName: {
    type: String,
    required: true,
    trim: true,
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "patient_tab", // Links to the patient's profile
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  reason: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected", "completed"],
    default: "pending",
  },
});

module.exports = mongoose.model("appointment_tab", appointmentSchema);