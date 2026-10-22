var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var blogSchema = new Schema({
   title: String,
   content: String
   
});

module.exports = mongoose.model("blog", blogSchema);