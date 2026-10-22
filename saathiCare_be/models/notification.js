const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "doctor_tab",
      required: true,
    },

    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "patient_tab",
      default: null,
    },

    type: {
      type: String,
      enum: [
        "appointment",
        "message",
        "prescription",
        "lab",
        "request",
        "system",
      ],
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    message: {
      type: String,
      required: true,
    },

    read: {
      type: Boolean,
      default: false,
    },

    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "appointment_tab",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Notification",
  notificationSchema
);