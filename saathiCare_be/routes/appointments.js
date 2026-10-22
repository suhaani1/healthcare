const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

const Appointment = require("../models/appointment_tab");
const Doctor = require("../models/doctor_tab");
const Patient = require("../models/patient_tab");
const Notification = require("../models/notification");

/* =========================================================
   CREATE APPOINTMENT
========================================================= */

router.post("/create", async (req, res) => {
  try {
    const {
      doctorId,
      patientName,
      patientId,
      date,
      time,
      reason,
    } = req.body;

    if (
      !doctorId ||
      !patientName ||
      !patientId ||
      !date ||
      !time ||
      !reason
    ) {
      return res.status(400).json({
        success: false,
        message: "All appointment fields are required",
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

    const appointment = await Appointment.create({
      doctorId,
      patientName,
      patientId,
      date,
      time,
      reason,
      status: "pending",
    });

    await Notification.create({
      doctorId,
      patientId,
      type: "appointment",
      title: "New Appointment Request",
      message: `${patient.fullName} has requested an appointment.`,
      appointmentId: appointment._id,
    });

    return res.status(201).json({
      success: true,
      message: "Appointment created successfully",
      appointment,
    });
  } catch (error) {
    console.error("Create appointment error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create appointment",
      error: error.message,
    });
  }
});

/* =========================================================
   GET PATIENT APPOINTMENTS
========================================================= */

router.get("/patient/:patientId", async (req, res) => {
  try {
    const { patientId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(patientId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid patient ID",
      });
    }

    const appointments = await Appointment.find({
      patientId,
    })
      .populate(
        "doctorId",
        "fullName specialization profilePhoto email phone experience qualifications"
      )
      .sort({ date: -1 });

    return res.status(200).json({
      success: true,
      appointments,
    });
  } catch (error) {
    console.error("Get patient appointments error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch patient appointments",
      error: error.message,
    });
  }
});

/* =========================================================
   GET DOCTOR APPOINTMENTS
========================================================= */

router.get("/doctor/:doctorId", async (req, res) => {
  try {
    const { doctorId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(doctorId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid doctor ID",
      });
    }

    const appointments = await Appointment.find({
      doctorId,
    })
      .populate(
        "patientId",
        "fullName age gender email phone profileImage bloodGroup"
      )
      .populate(
        "doctorId",
        "fullName specialization profilePhoto email phone"
      )
      .sort({ date: -1 });

    return res.status(200).json({
      success: true,
      appointments,
    });
  } catch (error) {
    console.error("Get doctor appointments error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch doctor appointments",
      error: error.message,
    });
  }
});

/* =========================================================
   GET DOCTOR APPOINTMENT REQUESTS
========================================================= */

router.get("/doctor/:doctorId/requests", async (req, res) => {
  try {
    const { doctorId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(doctorId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid doctor ID",
      });
    }

    const appointments = await Appointment.find({
      doctorId,
      status: "pending",
    })
      .populate(
        "patientId",
        "fullName age gender email phone profileImage"
      )
      .sort({ date: -1 });

    return res.status(200).json({
      success: true,
      appointments,
    });
  } catch (error) {
    console.error("Get appointment requests error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch appointment requests",
      error: error.message,
    });
  }
});

/* =========================================================
   UPDATE APPOINTMENT STATUS
========================================================= */

router.put("/status/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid appointment ID",
      });
    }

    const allowedStatuses = [
      "pending",
      "accepted",
      "rejected",
      "completed",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid appointment status",
      });
    }

    const appointment = await Appointment.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    await Notification.create({
      doctorId: appointment.doctorId,
      patientId: appointment.patientId,
      type: "appointment",
      title: "Appointment Updated",
      message: `Your appointment status has been changed to ${status}.`,
      appointmentId: appointment._id,
    });

    return res.status(200).json({
      success: true,
      message: "Appointment status updated",
      appointment,
    });
  } catch (error) {
    console.error("Update appointment status error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update appointment status",
      error: error.message,
    });
  }
});

/* =========================================================
   GET ALL PATIENTS CONNECTED TO A DOCTOR
========================================================= */

router.get("/:doctorId/patients", async (req, res) => {
  try {
    const { doctorId } = req.params;

    /* Validate doctor ID */
    if (!mongoose.Types.ObjectId.isValid(doctorId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid doctor ID",
      });
    }

    /* Check doctor exists */
    const doctor = await Doctor.findById(doctorId);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    /*
      Get all appointments of this doctor.
      Populate patient information so Doctor Chat
      can display real patient details.
    */
    const appointments = await Appointment.find({
      doctorId: doctorId,
    })
      .populate(
        "patientId",
        "fullName age gender email phone profileImage bloodGroup"
      )
      .sort({ date: -1 });

    /*
      Remove duplicate patients.
      A patient may have multiple appointments.
    */
    const patientsMap = new Map();

    appointments.forEach((appointment) => {
      const patient = appointment.patientId;

      if (!patient) {
        return;
      }

      const patientId = String(patient._id);

      if (!patientsMap.has(patientId)) {
        patientsMap.set(patientId, {
          _id: patient._id,
          fullName: patient.fullName || "",
          age: patient.age || "",
          gender: patient.gender || "",
          email: patient.email || "",
          phone: patient.phone || "",
          profileImage: patient.profileImage || "",
          bloodGroup: patient.bloodGroup || "",
          appointments: [],
        });
      }

      patientsMap.get(patientId).appointments.push({
        _id: appointment._id,
        date: appointment.date,
        time: appointment.time,
        reason: appointment.reason,
        status: appointment.status,
      });
    });

    const patients = Array.from(patientsMap.values());

    return res.status(200).json({
      success: true,
      count: patients.length,
      patients,
    });
  } catch (error) {
    console.error("Get doctor patients error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch doctor patients",
      error: error.message,
    });
  }
});

/* =========================================================
   GET DOCTOR'S PATIENT APPOINTMENTS
========================================================= */

router.get("/:doctorId/appointments", async (req, res) => {
  try {
    const { doctorId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(doctorId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid doctor ID",
      });
    }

    const appointments = await Appointment.find({
      doctorId,
    })
      .populate(
        "patientId",
        "fullName age gender email phone profileImage bloodGroup"
      )
      .sort({ date: -1 });

    return res.status(200).json({
      success: true,
      appointments,
    });
  } catch (error) {
    console.error("Get doctor patient appointments error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch appointments",
      error: error.message,
    });
  }
});

module.exports = router;