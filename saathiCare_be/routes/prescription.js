const express = require("express");
const router = express.Router();
const Prescription = require("../models/prescription");

const multer = require("multer");
const path = require("path");
const fs = require("fs");

/* =========================================================
   UPLOAD DIRECTORY
========================================================= */

const uploadDir = path.join(
  __dirname,
  "../public/uploads/prescriptions"
);

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, {
    recursive: true,
  });
}

/* =========================================================
   MULTER STORAGE
========================================================= */

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const extension = path
      .extname(file.originalname)
      .toLowerCase();

    const filename =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1000000000) +
      extension;

    cb(null, filename);
  },
});

/* =========================================================
   MULTER CONFIG
========================================================= */

const upload = multer({
  storage,

  limits: {
    fileSize: 10 * 1024 * 1024,
  },

  fileFilter: (req, file, cb) => {
    const allowedExtensions = [
      ".pdf",
      ".jpg",
      ".jpeg",
      ".png",
      ".doc",
      ".docx",
    ];

    const extension = path
      .extname(file.originalname)
      .toLowerCase();

    if (allowedExtensions.includes(extension)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Only PDF, JPG, JPEG, PNG, DOC and DOCX files are allowed."
        )
      );
    }
  },
});

/* =========================================================
   CREATE PRESCRIPTION
========================================================= */

router.post(
  "/create",
  upload.single("file"),
  async (req, res) => {
    try {
      console.log(
        "======================================"
      );

      console.log(
        "PRESCRIPTION REQUEST"
      );

      console.log(
        "BODY:",
        req.body
      );

      console.log(
        "FILE:",
        req.file
      );

      console.log(
        "======================================"
      );

      const {
        patientId,
        doctorId,
        text,
      } = req.body;

      /* -----------------------------------------
         VALIDATE PATIENT + DOCTOR
      ----------------------------------------- */

      if (!patientId) {
        return res.status(400).json({
          success: false,
          message: "Patient is required.",
        });
      }

      if (!doctorId) {
        return res.status(400).json({
          success: false,
          message: "Doctor is required.",
        });
      }

      /* -----------------------------------------
         VALIDATE TEXT OR FILE
      ----------------------------------------- */

      if (
        (!text || !text.trim()) &&
        !req.file
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Please write a prescription or upload a file.",
        });
      }

      /* -----------------------------------------
         FILE INFORMATION
      ----------------------------------------- */

      let fileName = "";
      let fileUrl = "";
      let fileType = "";
      let fileSize = 0;

      if (req.file) {
        fileName =
          req.file.originalname;

        fileUrl =
          `/uploads/prescriptions/${req.file.filename}`;

        fileType =
          req.file.mimetype;

        fileSize =
          req.file.size;
      }

      /* -----------------------------------------
         CREATE DATABASE RECORD
      ----------------------------------------- */

      const prescription =
        new Prescription({
          patientId: patientId,
          doctorId: doctorId,

          text: text
            ? text.trim()
            : "",

          fileName: fileName,

          fileUrl: fileUrl,

          fileType: fileType,

          fileSize: fileSize,
        });

      await prescription.save();

      console.log(
        "Prescription saved:",
        prescription
      );

      /* -----------------------------------------
         RESPONSE
      ----------------------------------------- */

      return res.status(201).json({
        success: true,
        message:
          "Prescription saved successfully.",

        prescription: {
          _id:
            prescription._id,

          patientId:
            prescription.patientId,

          doctorId:
            prescription.doctorId,

          text:
            prescription.text,

          fileName:
            prescription.fileName,

          fileUrl:
            prescription.fileUrl,

          fileType:
            prescription.fileType,

          fileSize:
            prescription.fileSize,

          createdAt:
            prescription.createdAt,
        },
      });
    } catch (error) {
      console.error(
        "PRESCRIPTION CREATE ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          error.message ||
          "Failed to save prescription.",
      });
    }
  }
);

/* =========================================================
   GET DOCTOR PRESCRIPTIONS
========================================================= */

router.get(
  "/doctor/:doctorId",
  async (req, res) => {
    try {
      const prescriptions =
        await Prescription.find({
          doctorId:
            req.params.doctorId,
        })
          .populate(
            "patientId",
            "fullName age gender email phone"
          )
          .sort({
            createdAt: -1,
          });

      return res.json({
        success: true,
        prescriptions,
      });
    } catch (error) {
      console.error(
        "GET DOCTOR PRESCRIPTIONS ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

/* =========================================================
   GET PATIENT PRESCRIPTIONS
========================================================= */

router.get(
  "/patient/:patientId",
  async (req, res) => {
    try {
      const prescriptions =
        await Prescription.find({
          patientId:
            req.params.patientId,
        })
          .populate(
            "doctorId",
            "fullName specialization profilePhoto"
          )
          .sort({
            createdAt: -1,
          });

      const result =
        prescriptions.map(
          (item) => {
            const prescription =
              item.toObject();

            if (
              prescription.fileUrl
            ) {
              prescription.fileUrl =
                `${req.protocol}://${req.get(
                  "host"
                )}${prescription.fileUrl}`;
            }

            return prescription;
          }
        );

      console.log(
        "Patient:",
        req.params.patientId
      );

      console.log(
        "Prescriptions found:",
        result.length
      );

      return res.json({
        success: true,
        prescriptions: result,
      });
    } catch (error) {
      console.error(
        "GET PATIENT PRESCRIPTIONS ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

module.exports = router;