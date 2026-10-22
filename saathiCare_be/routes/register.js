// const express = require("express");
// const router = express.Router();
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const User = require("../models/login_tab");
// require("dotenv").config();

// const JWT_SECRET = process.env.JWT_SECRET || "someSuperSecretKey";

// // @route    POST /api/register
// // @desc     Register doctor or patient
// router.post("/register", async (req, res) => {
//   const {
//     userType,
//     fullName,
//     email,
//     password,
//     phone,
//     specialization,
//     license,
//     age,
//     gender,
//   } = req.body;

//   // Basic common field validation
//   if (!userType || !fullName || !email || !password || !phone) {
//     return res.status(400).json({ message: "Missing required fields." });
//   }

//   // Validate conditional fields
//   if (userType === "doctor") {
//     if (!specialization || !license) {
//       return res
//         .status(400)
//         .json({ message: "Doctor must provide specialization and license." });
//     }
//   } else if (userType === "patient") {
//     if (age === undefined || gender === undefined) {
//       return res
//         .status(400)
//         .json({ message: "Patient must provide age and gender." });
//     }
//   } else {
//     return res.status(400).json({ message: "Invalid userType." });
//   }

//   try {
//     // Check if user already exists
//     const existing = await User.findOne({ email });
//     if (existing) {
//       return res.status(409).json({ message: "Email already registered." });
//     }

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Prepare user payload
//     const userPayload = {
//       userType,
//       fullName,
//       email,
//       password: hashedPassword,
//       phone,
//     };

//     if (userType === "doctor") {
//       userPayload.specialization = specialization;
//       userPayload.license = license;
//     }

//     if (userType === "patient") {
//       userPayload.age = Number(age); // Ensure it's a number
//       userPayload.gender = gender.toLowerCase(); // Must match enum
//     }

//     // Save new user
//     const newUser = new User(userPayload);
//     await newUser.save();

//     // Generate token
//     const token = jwt.sign(
//       { id: newUser._id, userType: newUser.userType },
//       JWT_SECRET,
//       { expiresIn: "7d" }
//     );

//     res.status(201).json({
//       message: "User registered successfully",
//       token,
//     });
//   } catch (err) {
//     console.error("Registration error:", err);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });

// //login

// router.post("/login", async (req, res) => {
//   const { email, password } = req.body;

//   // Basic validation
//   if (!email || !password) {
//     return res.status(400).json({ message: "Email and password are required" });
//   }

//   try {
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(401).json({ message: "Invalid credentials" });
//     }

//     // Generate JWT token
//     const token = jwt.sign(
//       { id: user._id, userType: user.userType },
//       JWT_SECRET,
//       { expiresIn: "7d" }
//     );

//     res.status(200).json({
//       message: "Login successful",
//       token,
//       user: {
//         id: user._id,
//         fullName: user.fullName,
//         email: user.email,
//         userType: user.userType,
//       },
//     });
//   } catch (err) {
//     console.error("Login error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// module.exports = router;



const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Doctor = require("../models/doctor_tab");
const Patient = require("../models/patient_tab");

require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET || "someSuperSecretKey";

// @route    POST /api/register
// @desc     Register doctor or patient
router.post("/register", async (req, res) => {
  const {
    userType,
    fullName,
    email,
    password,
    phone,
    specialization,
    license,
    age,
    gender,
  } = req.body;

  if (!userType || !fullName || !email || !password || !phone) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  try {
    // Check if email already exists in either collection
    const existingDoctor = await Doctor.findOne({ email });
    const existingPatient = await Patient.findOne({ email });

    if (existingDoctor || existingPatient) {
      return res.status(409).json({ message: "Email already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    let newUser;

    if (userType === "doctor") {
      if (!specialization || !license) {
        return res
          .status(400)
          .json({ message: "Doctor must provide specialization and license." });
      }
      newUser = new Doctor({
        fullName,
        email,
        password: hashedPassword,
        phone,
        specialization,
        license,
      });
    } else if (userType === "patient") {
      if (age === undefined || gender === undefined) {
        return res
          .status(400)
          .json({ message: "Patient must provide age and gender." });
      }
      newUser = new Patient({
        fullName,
        email,
        password: hashedPassword,
        phone,
        age: Number(age),
        gender: gender.toLowerCase(),
      });
    } else {
      return res.status(400).json({ message: "Invalid userType." });
    }

    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id, userType: userType },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "User registered successfully",
      token,
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});


//login
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }
  
    try {
      let user = await Doctor.findOne({ email });
      let userType = 'doctor';
  
      if (!user) {
        user = await Patient.findOne({ email });
        userType = 'patient';
      }
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
  
      const token = jwt.sign(
        { id: user._id, userType: userType },
        JWT_SECRET,
        { expiresIn: "7d" }
      );
  
      res.status(200).json({
        message: "Login successful",
        token,
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          userType: userType,
        },
      });
    } catch (err) {
      console.error("Login error:", err);
      res.status(500).json({ message: "Server error" });
    }
  });


module.exports = router;