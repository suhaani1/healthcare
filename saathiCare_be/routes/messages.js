const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

const Message = require("../models/message");
const Notification = require("../models/notification");
const Doctor = require("../models/doctor_tab");
const Patient = require("../models/patient_tab");

// =====================================================
// GET CHAT BETWEEN DOCTOR AND PATIENT
// =====================================================

router.get("/:doctorId/:patientId", async (req, res) => {
  try {
    const { doctorId, patientId } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(doctorId) ||
      !mongoose.Types.ObjectId.isValid(patientId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid doctor or patient ID",
      });
    }

    const messages = await Message.find({
      doctorId,
      patientId,
    }).sort({ createdAt: 1 });

    res.json({
      success: true,
      messages,
    });
  } catch (error) {
    console.error("Get messages error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch messages",
    });
  }
});

// =====================================================
// SEND MESSAGE
// =====================================================

router.post("/send", async (req, res) => {
  try {
    const {
      doctorId,
      patientId,
      sender,
      text,
    } = req.body;

    if (!doctorId || !patientId || !sender || !text) {
      return res.status(400).json({
        success: false,
        message: "doctorId, patientId, sender and text are required",
      });
    }

    if (!["doctor", "patient"].includes(sender)) {
      return res.status(400).json({
        success: false,
        message: "Invalid sender",
      });
    }

    if (
      !mongoose.Types.ObjectId.isValid(doctorId) ||
      !mongoose.Types.ObjectId.isValid(patientId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid doctor or patient ID",
      });
    }

    const doctor = await Doctor.findById(doctorId);
    const patient = await Patient.findById(patientId);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    // Save message
    const newMessage = await Message.create({
      doctorId,
      patientId,
      sender,
      text: text.trim(),
    });

    // =================================================
    // IF PATIENT SENDS MESSAGE
    // CREATE DOCTOR NOTIFICATION
    // =================================================

    if (sender === "patient") {
      await Notification.create({
        doctorId,
        patientId,
        type: "message",
        title: `New message from ${patient.fullName}`,
        message: text.trim(),
      });
    }

    res.status(201).json({
      success: true,
      message: newMessage,
    });
  } catch (error) {
    console.error("Send message error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to send message",
      error: error.message,
    });
  }
});

// =====================================================
// MARK PATIENT MESSAGES AS READ
// =====================================================

router.put("/:doctorId/:patientId/read", async (req, res) => {
  try {
    const { doctorId, patientId } = req.params;

    await Message.updateMany(
      {
        doctorId,
        patientId,
        sender: "patient",
        read: false,
      },
      {
        $set: {
          read: true,
        },
      }
    );

    res.json({
      success: true,
      message: "Messages marked as read",
    });
  } catch (error) {
    console.error("Mark messages read error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to mark messages as read",
    });
  }
});

module.exports = router;