const express = require("express");
const router = express.Router();

const Doctor = require("../models/doctor_tab");
const Appointment = require("../models/appointment_tab");
const Prescription = require("../models/prescription");


// =====================================================
// GET DOCTOR PROFILE BY EMAIL
// GET /api/doctor/getDoctor/:email
// =====================================================
router.get("/getDoctor/:email", async (req, res) => {
  try {
    const email = req.params.email.toLowerCase().trim();

    const doctor = await Doctor.findOne({ email }).select("-password");

    if (!doctor) {
      return res.status(404).json({
        message: "Doctor not found",
      });
    }

    res.json(doctor);

  } catch (error) {
    console.error("Error fetching doctor:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});


// =====================================================
// GET ALL DOCTORS
// GET /api/doctor/doctors
// =====================================================
router.get("/doctors", async (req, res) => {
  try {
    const doctors = await Doctor.find().select("-password");

    res.json({
      doctors,
    });

  } catch (error) {
    console.error("Error fetching doctors:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});


// =====================================================
// UPDATE DOCTOR PROFILE
// PUT /api/doctor/updateDoctor
// =====================================================
router.put("/updateDoctor", async (req, res) => {
  try {

    const {
      email,
      fullName,
      specialization,
      experience,
      phone,
      bio,
      profilePhoto,
      qualifications,
      gender,
      license,
    } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const updatedDoctor = await Doctor.findOneAndUpdate(
      { email: email.toLowerCase().trim() },

      {
        fullName,
        specialization,
        experience,
        phone,
        bio,
        profilePhoto,
        qualifications,
        gender,
        license,
      },

      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

    if (!updatedDoctor) {
      return res.status(404).json({
        message: "Doctor not found",
      });
    }

    res.json({
      message: "Profile updated successfully",
      doctor: updatedDoctor,
    });

  } catch (error) {
    console.error("Error updating doctor:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});


// =====================================================
// GET ALL PATIENTS OF A DOCTOR
// GET /api/doctor/:doctorId/patients
// =====================================================
router.get("/:doctorId/patients", async (req, res) => {

  try {

    const { doctorId } = req.params;

    // Find all appointments of this doctor
    const appointments = await Appointment.find({
      doctorId: doctorId,
    })
      .populate(
        "patientId",
        "fullName email phone age gender bloodGroup height weight profileImage"
      )
      .sort({ date: -1 })
      .lean();


    // ---------------------------------------------
    // Create unique patient map
    // ---------------------------------------------

    const patientsMap = {};


    for (const appointment of appointments) {

      const patient = appointment.patientId;

      if (!patient) {
        continue;
      }

      const patientId = patient._id.toString();


      if (!patientsMap[patientId]) {

        patientsMap[patientId] = {

          id: patient._id,

          _id: patient._id,

          name: patient.fullName,

          fullName: patient.fullName,

          email: patient.email,

          phone: patient.phone,

          age: patient.age,

          gender: patient.gender,

          bloodGroup: patient.bloodGroup,

          height: patient.height,

          weight: patient.weight,

          profileImage: patient.profileImage,

          appointments: [],

          prescriptions: [],
        };
      }


      // ---------------------------------------------
      // Add appointment
      // ---------------------------------------------

      patientsMap[patientId].appointments.push({

        _id: appointment._id,

        date: appointment.date,

        time: appointment.time,

        reason: appointment.reason,

        status: appointment.status,
      });
    }


    // ---------------------------------------------
    // Get prescriptions
    // ---------------------------------------------

    const patientIds = Object.keys(patientsMap);

    if (patientIds.length > 0) {

      const prescriptions = await Prescription.find({
        doctorId: doctorId,
        patientId: { $in: patientIds },
      })
        .sort({ date: -1 })
        .lean();


      prescriptions.forEach((prescription) => {

        const patientId = prescription.patientId.toString();

        if (patientsMap[patientId]) {

          patientsMap[patientId].prescriptions.push({

            _id: prescription._id,

            text: prescription.text,

            file: prescription.file,

            date: prescription.date,
          });
        }

      });
    }


    // ---------------------------------------------
    // Send response
    // ---------------------------------------------

    res.json(
      Object.values(patientsMap)
    );


  } catch (error) {

    console.error(
      "Error fetching doctor patients:",
      error
    );

    res.status(500).json({

      message: "Server error",

      error: error.message,
    });
  }
});


module.exports = router;