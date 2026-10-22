const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");

const MedicalRecord = require("../models/medicalRecord");
const Patient = require("../models/patient_tab");
const Appointment = require("../models/appointment_tab");

// =========================================================
// UPLOAD DIRECTORY
// =========================================================

const uploadDirectory = path.join(
  __dirname,
  "../public/uploads/medical-records"
);

if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, {
    recursive: true,
  });
}

// =========================================================
// MULTER STORAGE
// =========================================================

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDirectory);
  },

  filename: function (req, file, cb) {
    const extension = path.extname(file.originalname);

    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      extension;

    cb(null, uniqueName);
  },
});

// =========================================================
// FILE FILTER
// =========================================================

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "image/webp",
    "application/pdf",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Only JPG, PNG, WEBP images and PDF files are allowed."
      ),
      false
    );
  }
};

// =========================================================
// MULTER
// =========================================================

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

// =========================================================
// UPLOAD MEDICAL RECORD
// POST /api/medical-record/upload
// =========================================================

router.post(
  "/upload",
  upload.single("file"),
  async (req, res) => {
    try {
      const { patientId, cardType } = req.body;

      // -----------------------------------------------
      // Validate patient ID
      // -----------------------------------------------

      if (!patientId) {
        return res.status(400).json({
          success: false,
          message: "Patient ID is required.",
        });
      }

      if (!mongoose.Types.ObjectId.isValid(patientId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid patient ID.",
        });
      }

      // -----------------------------------------------
      // Validate card type
      // -----------------------------------------------

      if (!cardType || !cardType.trim()) {
        return res.status(400).json({
          success: false,
          message: "Card type is required.",
        });
      }

      // -----------------------------------------------
      // Validate file
      // -----------------------------------------------

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Please upload a file.",
        });
      }

      // -----------------------------------------------
      // Check patient
      // -----------------------------------------------

      const patient = await Patient.findById(patientId);

      if (!patient) {
        if (fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }

        return res.status(404).json({
          success: false,
          message: "Patient not found.",
        });
      }

      // -----------------------------------------------
      // Create database record
      // -----------------------------------------------

      const medicalRecord = await MedicalRecord.create({
        patientId: patientId,
        cardType: cardType.trim(),
        fileName: req.file.originalname,
        fileUrl: `/uploads/medical-records/${req.file.filename}`,
        fileType: req.file.mimetype,
        fileSize: req.file.size,
      });

      return res.status(201).json({
        success: true,
        message: "Medical record uploaded successfully.",
        record: medicalRecord,
      });
    } catch (error) {
      console.error(
        "Medical record upload error:",
        error
      );

      // Remove uploaded file if database operation fails
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }

      return res.status(500).json({
        success: false,
        message:
          error.message ||
          "Failed to upload medical record.",
      });
    }
  }
);

// =========================================================
// GET PATIENT MEDICAL RECORDS
// GET /api/medical-record/patient/:patientId
// =========================================================

router.get(
  "/patient/:patientId",
  async (req, res) => {
    try {
      const { patientId } = req.params;

      if (!mongoose.Types.ObjectId.isValid(patientId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid patient ID.",
        });
      }

      // Check that patient exists
      const patient = await Patient.findById(patientId);

      if (!patient) {
        return res.status(404).json({
          success: false,
          message: "Patient not found.",
        });
      }

      const records = await MedicalRecord.find({
        patientId,
      })
        .sort({
          createdAt: -1,
        })
        .lean();

      const recordsWithUrls = records.map(
        (record) => ({
          ...record,

          fileUrl: `${req.protocol}://${req.get(
            "host"
          )}${record.fileUrl}`,
        })
      );

      return res.status(200).json({
        success: true,
        records: recordsWithUrls,
      });
    } catch (error) {
      console.error(
        "Get medical records error:",
        error
      );

      return res.status(500).json({
        success: false,
        message: "Failed to fetch medical records.",
      });
    }
  }
);

// =========================================================
// GET PATIENT MEDICAL RECORDS FOR DOCTOR
//
// GET /api/medical-record/doctor/:doctorId/patient/:patientId
//
// Doctor must have an appointment with the patient.
// =========================================================

router.get(
  "/doctor/:doctorId/patient/:patientId",
  async (req, res) => {
    try {
      const {
        doctorId,
        patientId,
      } = req.params;

      // -----------------------------------------------
      // Validate doctor ID
      // -----------------------------------------------

      if (!mongoose.Types.ObjectId.isValid(doctorId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid doctor ID.",
        });
      }

      // -----------------------------------------------
      // Validate patient ID
      // -----------------------------------------------

      if (!mongoose.Types.ObjectId.isValid(patientId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid patient ID.",
        });
      }

      // -----------------------------------------------
      // Check doctor-patient relationship
      // -----------------------------------------------

      const appointment =
        await Appointment.findOne({
          doctorId,
          patientId,
        });

      if (!appointment) {
        return res.status(403).json({
          success: false,
          message:
            "You are not authorized to view this patient's medical records.",
        });
      }

      // -----------------------------------------------
      // Check patient
      // -----------------------------------------------

      const patient = await Patient.findById(
        patientId
      ).select(
        "fullName email phone age gender bloodGroup profileImage"
      );

      if (!patient) {
        return res.status(404).json({
          success: false,
          message: "Patient not found.",
        });
      }

      // -----------------------------------------------
      // Get medical records
      // -----------------------------------------------

      const records = await MedicalRecord.find({
        patientId,
      })
        .sort({
          createdAt: -1,
        })
        .lean();

      // -----------------------------------------------
      // Add complete file URLs
      // -----------------------------------------------

      const recordsWithUrls = records.map(
        (record) => ({
          ...record,

          fileUrl: `${req.protocol}://${req.get(
            "host"
          )}${record.fileUrl}`,
        })
      );

      return res.status(200).json({
        success: true,

        patient: patient,

        records: recordsWithUrls,
      });
    } catch (error) {
      console.error(
        "Doctor medical records error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to fetch patient's medical records.",
      });
    }
  }
);

// =========================================================
// DELETE MEDICAL RECORD
// DELETE /api/medical-record/:id
// =========================================================

router.delete(
  "/:id",
  async (req, res) => {
    try {
      const { id } = req.params;

      // -----------------------------------------------
      // Validate ID
      // -----------------------------------------------

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid medical record ID.",
        });
      }

      // -----------------------------------------------
      // Find record
      // -----------------------------------------------

      const record =
        await MedicalRecord.findById(id);

      if (!record) {
        return res.status(404).json({
          success: false,
          message: "Medical record not found.",
        });
      }

      // -----------------------------------------------
      // Delete physical file
      // -----------------------------------------------

      if (record.fileUrl) {
        const relativePath =
          record.fileUrl.startsWith("/")
            ? record.fileUrl.substring(1)
            : record.fileUrl;

        const filePath = path.join(
          __dirname,
          "../public",
          relativePath
        );

        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }

      // -----------------------------------------------
      // Delete database record
      // -----------------------------------------------

      await MedicalRecord.findByIdAndDelete(id);

      return res.status(200).json({
        success: true,
        message:
          "Medical record deleted successfully.",
      });
    } catch (error) {
      console.error(
        "Delete medical record error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to delete medical record.",
      });
    }
  }
);

// =========================================================
// MULTER / FILE ERROR HANDLER
// =========================================================

router.use((error, req, res, next) => {
  console.error(
    "Medical record route error:",
    error
  );

  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "File size cannot exceed 10 MB.",
      });
    }

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }

  next();
});

// =========================================================
// EXPORT ROUTER
// =========================================================

module.exports = router;