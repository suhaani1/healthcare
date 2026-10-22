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
app.use("/api/medical-record", medicalRecordRoutes);
app.use("/api/prescriptions", prescriptionRoutes);

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



module.exports = app;