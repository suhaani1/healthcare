var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var bmiSchema = new Schema({
   weight:Number,
   height:Number,
   bmi:Number,
   category:String,
   date: {
      type: Date,
      default: Date.now
   }
});

module.exports = mongoose.model("Bmi", bmiSchema);