// var createError = require('http-errors');
// var express = require('express');
// var path = require('path');
// var cookieParser = require('cookie-parser');
// var logger = require('morgan');

// var mongoose = require("mongoose");
// require("dotenv").config()


// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');
// const healthRoutes = require("./routes/health");
// // var blogRouter = require("./routes/blog");
// // var symptomRouter = require("./routes/symptoms");
// var registerRouter =require("./routes/register");
// var patientRouter =require("./routes/patient");
// var loginRouter=require("./routes/login");
// var patientRouter =require("./routes/patient");
// const dietRoutes = require('./routes/diet');

// var doctorRouter=require("./routes/doctor");
// var appointmentRoutes=require("./routes/appointments");
// var notificationRoutes=require("./routes/notification");
// const messageRoutes = require("./routes/messages");
// const medicalRecordRoutes = require("./routes/medicalRecords");
// const prescriptionRoutes = require("./routes/prescription");
// var cors = require('cors')
// var app = express();



// app.use(cors());



// const dbUrl ="mongodb+srv://suhanimehta0109:shivani6206480042@cluster1.yldaznk.mongodb.net/?appName=Cluster1"

// async function connectToDatabase() {
//   try {
//     await mongoose.connect(dbUrl, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     console.log("Connected to MongoDB successfully");
//   } catch (error) {
//     console.error("Error connecting to MongoDB:", error);
//   }
// }
// connectToDatabase();


// // view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

// app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
// app.use('/users', usersRouter);
// app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// app.use("/admin", registerRouter);
// app.use("/patient", patientRouter);

// app.use('/patient/diet', dietRoutes);


// app.use("/health", healthRoutes);

// app.use("/log", loginRouter)
// app.use("/api/doctor",doctorRouter);
// app.use("/api/appointment",appointmentRoutes);
// app.use("/api/notification", notificationRoutes);
// app.use("/api/message", messageRoutes);

// app.use(
//   "/api/medical-record",
//   medicalRecordRoutes
// );
// app.use(
//   "/api/prescriptions",
//   prescriptionRoutes
// );

// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

// const PORT = process.env.PORT || 3010;

// app.listen(PORT, () => {
//   console.log(`✅ Server is running on http://localhost:${PORT}`);
// });


// module.exports = app;






var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
require("dotenv").config();

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var registerRouter = require("./routes/register");
var patientRouter = require("./routes/patient");
var loginRouter = require("./routes/login");

const healthRoutes = require("./routes/health");
const dietRoutes = require("./routes/diet");
const doctorRouter = require("./routes/doctor");
const appointmentRoutes = require("./routes/appointments");
const notificationRoutes = require("./routes/notification");
const messageRoutes = require("./routes/messages");
const medicalRecordRoutes = require("./routes/medicalRecords");
const prescriptionRoutes = require("./routes/prescription");

var cors = require("cors");

var app = express();

/* =========================
   CORS
========================= */

app.use(cors());

/* =========================
   MongoDB Connection
========================= */

const dbUrl = process.env.MONGO_URI;

if (!dbUrl) {
  console.error("ERROR: MONGO_URI is not defined.");
  process.exit(1);
}

async function connectToDatabase() {
  try {
    await mongoose.connect(dbUrl);
    console.log("Connected to MongoDB successfully");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
}

connectToDatabase();

/* =========================
   View Engine Setup
========================= */

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

/* =========================
   Middleware
========================= */

app.use(logger("dev"));

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());

app.use(express.static(path.join(__dirname, "public")));

/* =========================
   Static Uploads
========================= */

app.use(
  "/uploads",
  express.static(path.join(__dirname, "public/uploads"))
);

/* =========================
   Routes
========================= */

app.use("/", indexRouter);

app.use("/users", usersRouter);

app.use("/admin", registerRouter);

app.use("/patient", patientRouter);

app.use("/patient/diet", dietRoutes);

app.use("/health", healthRoutes);

app.use("/log", loginRouter);

app.use("/api/doctor", doctorRouter);

app.use("/api/appointment", appointmentRoutes);

app.use("/api/notification", notificationRoutes);

app.use("/api/message", messageRoutes);

app.use(
  "/api/medical-record",
  medicalRecordRoutes
);

app.use(
  "/api/prescriptions",
  prescriptionRoutes
);

/* =========================
   404 Handler
========================= */

app.use(function (req, res, next) {
  next(createError(404));
});

/* =========================
   Error Handler
========================= */

app.use(function (err, req, res, next) {
  res.locals.message = err.message;

  res.locals.error =
    req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500);

  res.render("error");
});

/* =========================
   Server
========================= */

const PORT = process.env.PORT || 3010;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;