const mongoose = require("mongoose");

const loginSchema = new mongoose.Schema({
  userType: {
    type: String,
    enum: ["doctor", "patient"],
    required: true,
  },
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  specialization: {
    type: String,
    required: function () {
      return this.userType === "doctor";
    },
  },
  license: {
    type: String,
    required: function () {
      return this.userType === "doctor";
    },
  },
  age: {
    type: Number,
    min: 0,
  },
  gender: {
  type: String,

}
,
  height: {
    type: Number,
    min: 0,
  },
  weight: {
    type: Number,
    min: 0,
  },
});

module.exports = mongoose.model("login_tab", loginSchema);
