
// const mongoose = require("mongoose");
// const Schema = mongoose.Schema;

// const registerSchema = new mongoose.Schema({
//   userType:{
//     type:String,
//     enum:['doctor','patient'],
//     required:true
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//     lowercase: true
//   },
//   password: {
//     type: String,
//     required: true
//   },
//   phone: {
//     type: String,
//     required: true
//   },

//   // Doctor specific
//   specialization: {
//     type: String,
//     required: function () {
//       return this.userType === 'doctor';
//     }
//   },
//   license: {
//     type: String,
//     required: function () {
//       return this.userType === 'doctor';
//     }
//   },

//   // Patient specific
//   age: {
//     type: Number,
//     required: function () {
//       return this.userType === 'Patient';
//     }
//   },
//   gender: {
//     type: String,
//     enum: ['Male', 'Female', 'Other'],
//     required: function () {
//       return this.userType === 'Patient';
//     }
//   },

//   createdAt: {
//     type: Date,
//     default: Date.now
//   }
// });

// module.exports = mongoose.model("register_tab", registerSchema);


const mongoose = require("mongoose");

const registerSchema = new mongoose.Schema({
  userType: {
    type: String,
    enum: ['doctor', 'patient'],
     required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },

  // Doctor specific
  specialization: {
    type: String,
    required: function () {
      return this.userType === 'doctor';
    }
  },
  license: {
    type: String,
    required: function () {
      return this.userType === 'doctor';
    }
  },

  // Patient specific
  age: {
    type: Number,
    required: function () {
      return this.userType === 'patient';
    }
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: function () {
      return this.userType === 'patient';
    }
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("register_tab", registerSchema);
