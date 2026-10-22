var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var symptomSchema = new mongoose.Schema({
Patient: {
   type: mongoose.Schema.Types.ObjectId, ref : 'login_tab'
},
entry :String,
date:{
   type: Date,
   required: true,
},
symptoms: [{ 
   type: String,
    required: true 
   }], // e.g., ["headache", "nausea"]
  severity: { 
   type: String, 
   enum: ["mild", "moderate", "severe"],
    required: true
    },
  notes: { type: String }
}, {
  timestamps: true
});

module.exports = mongoose.model("symptom", symptomSchema);