const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Doctor = require("../models/doctor_tab");
const Patient = require("../models/patient_tab");

require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET || "someSuperSecretKey";


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
          _id: user._id,
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