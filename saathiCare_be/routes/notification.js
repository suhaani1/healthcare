const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

const Notification = require("../models/notification");
const Patient = require("../models/patient_tab");
const Doctor = require("../models/doctor_tab");

// =====================================================
// GET ALL NOTIFICATIONS FOR DOCTOR
// =====================================================

router.get("/doctor/:doctorId", async (req, res) => {
  try {
    const { doctorId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(doctorId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid doctor ID",
      });
    }

    const notifications = await Notification.find({
      doctorId,
    })
      .populate("patientId", "fullName email profileImage")
      .populate("appointmentId")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      notifications,
    });
  } catch (error) {
    console.error("Get doctor notifications error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch notifications",
      error: error.message,
    });
  }
});

// =====================================================
// GET UNREAD NOTIFICATION COUNT
// =====================================================

router.get("/doctor/:doctorId/unread-count", async (req, res) => {
  try {
    const { doctorId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(doctorId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid doctor ID",
      });
    }

    const count = await Notification.countDocuments({
      doctorId,
      read: false,
    });

    res.json({
      success: true,
      count,
    });
  } catch (error) {
    console.error("Unread notification error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get unread count",
    });
  }
});

// =====================================================
// MARK ONE NOTIFICATION AS READ
// =====================================================

router.put("/:id/read", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid notification ID",
      });
    }

    const notification = await Notification.findByIdAndUpdate(
      id,
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    res.json({
      success: true,
      notification,
    });
  } catch (error) {
    console.error("Mark notification read error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to mark notification as read",
    });
  }
});

// =====================================================
// MARK ALL NOTIFICATIONS AS READ
// =====================================================

router.put("/doctor/:doctorId/read-all", async (req, res) => {
  try {
    const { doctorId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(doctorId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid doctor ID",
      });
    }

    await Notification.updateMany(
      {
        doctorId,
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
      message: "All notifications marked as read",
    });
  } catch (error) {
    console.error("Mark all read error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to mark notifications as read",
    });
  }
});

// =====================================================
// CREATE NOTIFICATION
// =====================================================

router.post("/create", async (req, res) => {
  try {
    const {
      doctorId,
      patientId,
      type,
      title,
      message,
      appointmentId,
    } = req.body;

    if (!doctorId || !type || !title || !message) {
      return res.status(400).json({
        success: false,
        message: "doctorId, type, title and message are required",
      });
    }

    const notification = await Notification.create({
      doctorId,
      patientId: patientId || null,
      type,
      title,
      message,
      appointmentId: appointmentId || null,
    });

    res.status(201).json({
      success: true,
      notification,
    });
  } catch (error) {
    console.error("Create notification error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create notification",
      error: error.message,
    });
  }
});

module.exports = router;