import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import Navbar from "./navbar";
import Footer from "../footer/footer";
import Avatar from "../../assets/register/avatar.jpg";
import "./dashboard.css";

const API_URL = "http://localhost:3010";

function Dashboard() {
  const [patient, setPatient] = useState(null);
  const [appointment, setAppointment] = useState(null);
  const [metrics, setMetrics] = useState({
    bmi: null,
    category: "N/A",
    bmr: null,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchHomeData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const email = localStorage.getItem("email");

      if (!email) {
        setError("Patient login information not found.");
        return;
      }

      // ---------------------------------------------
      // PATIENT DASHBOARD
      // ---------------------------------------------

      const response = await axios.get(
        `${API_URL}/patient/dashboard`,
        {
          params: { email },
        }
      );

      const result = response.data;

      if (!result?.profile) {
        setError("Patient profile not found.");
        return;
      }

      const profile = result.profile;

      setPatient(profile);

      // Save patient ID
      if (profile._id) {
        localStorage.setItem("patientId", profile._id);
      }

      // ---------------------------------------------
      // HEALTH METRICS
      // ---------------------------------------------

      if (result.metrics) {
        setMetrics({
          bmi: result.metrics.bmi ?? null,
          category: result.metrics.category || "N/A",
          bmr: result.metrics.bmr ?? null,
        });
      }

      // ---------------------------------------------
      // GET REAL APPOINTMENTS
      // ---------------------------------------------

      if (profile._id) {
        try {
          const appointmentResponse = await axios.get(
            `${API_URL}/api/appointment/patient/${profile._id}`
          );

          const appointmentData =
            appointmentResponse.data;

          const appointments = Array.isArray(
            appointmentData
          )
            ? appointmentData
            : appointmentData?.appointments || [];

          const now = new Date();

          const upcoming = appointments
            .filter((item) => {
              if (!item.date) return false;

              const date = new Date(item.date);

              return (
                date >= now &&
                item.status !== "rejected" &&
                item.status !== "completed"
              );
            })
            .sort(
              (a, b) =>
                new Date(a.date) -
                new Date(b.date)
            );

          setAppointment(upcoming[0] || null);
        } catch (appointmentError) {
          console.log(
            "Appointment fetch:",
            appointmentError.response?.data ||
              appointmentError.message
          );
        }
      }
    } catch (err) {
      console.error(
        "Patient home error:",
        err.response?.data || err.message
      );

      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Unable to load your health information."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // ---------------------------------------------
  // LOAD DATA
  // ---------------------------------------------

  useEffect(() => {
    fetchHomeData();

    const handleStorage = (event) => {
      if (
        event.key === "profileUpdatedAt" ||
        event.key === "patientProfileUpdated"
      ) {
        fetchHomeData();
      }
    };

    window.addEventListener(
      "storage",
      handleStorage
    );

    return () => {
      window.removeEventListener(
        "storage",
        handleStorage
      );
    };
  }, [fetchHomeData]);

  // ---------------------------------------------
  // LOADING
  // ---------------------------------------------

  if (loading) {
    return (
      <>
        <Navbar />

        <div className="home-loading">
          <div className="loading-spinner"></div>
          <h3>Loading your health information...</h3>
        </div>

        <Footer />
      </>
    );
  }

  // ---------------------------------------------
  // ERROR
  // ---------------------------------------------

  if (error && !patient) {
    return (
      <>
        <Navbar />

        <div className="home-error">
          <div className="error-box">
            <h2>Something went wrong</h2>
            <p>{error}</p>

            <button
              onClick={fetchHomeData}
              className="retry-button"
            >
              Try Again
            </button>
          </div>
        </div>

        <Footer />
      </>
    );
  }

  // ---------------------------------------------
  // PROFILE IMAGE
  // ---------------------------------------------

  const profileImage = patient?.profileImage
    ? patient.profileImage.startsWith("http")
      ? patient.profileImage
      : `${API_URL}/${patient.profileImage}`
    : Avatar;

  // ---------------------------------------------
  // APPOINTMENT
  // ---------------------------------------------

  const doctorName =
    appointment?.doctorId?.fullName ||
    appointment?.doctor ||
    "Doctor";

  const appointmentDate = appointment?.date
    ? new Date(appointment.date)
    : null;

  // ---------------------------------------------
  // DATE
  // ---------------------------------------------

  const today = new Date();

  const greeting =
    today.getHours() < 12
      ? "Good morning"
      : today.getHours() < 18
      ? "Good afternoon"
      : "Good evening";

  return (
    <>
      <Navbar />

      <main className="patient-home">

        {/* =========================================
            WELCOME
        ========================================= */}

        <section className="welcome-section">

          <div className="welcome-text">

            <p className="home-label">
              PATIENT HOME
            </p>

            <h1>
              {greeting},{" "}
              <span>
                {patient?.fullName || "Patient"}
              </span>
            </h1>

            <p>
              Here's a quick overview of your
              health and upcoming care.
            </p>

          </div>

          <div className="welcome-actions">

            <Link
              to="/patient/appointment"
              className="primary-button"
            >
              Find a Doctor
            </Link>

            <Link
              to="/patient/appointment"
              className="outline-button"
            >
              Book Appointment
            </Link>

          </div>

        </section>

        {/* =========================================
            PROFILE + HEALTH
        ========================================= */}

        <section className="overview-grid">

          {/* PROFILE */}

          <div className="home-card profile-overview">

            <div className="card-heading">

              <div>
                <h2>My Profile</h2>
                <span>Personal information</span>
              </div>

              <Link to="/patient/profile">
                Edit
              </Link>

            </div>

            <div className="patient-info">

              <img
                src={profileImage}
                alt="Patient"
                onError={(e) => {
                  e.currentTarget.src = Avatar;
                }}
              />

              <div>
                <h3>
                  {patient?.fullName || "Patient"}
                </h3>

                <p>
                  {patient?.email || "N/A"}
                </p>
              </div>

            </div>

            <div className="basic-info">

              <div>
                <span>Age</span>
                <strong>
                  {patient?.age
                    ? `${patient.age} years`
                    : "N/A"}
                </strong>
              </div>

              <div>
                <span>Gender</span>
                <strong>
                  {patient?.gender || "N/A"}
                </strong>
              </div>

              <div>
                <span>Blood Group</span>
                <strong>
                  {patient?.bloodGroup || "N/A"}
                </strong>
              </div>

            </div>

          </div>

          {/* HEALTH */}

          <div className="home-card health-overview">

            <div className="card-heading">

              <div>
                <h2>Health Overview</h2>
                <span>Your current measurements</span>
              </div>

              <Link to="/patient/monitor">
                Details
              </Link>

            </div>

            <div className="health-row">

              <div className="health-box">

                <span>BMI</span>

                <strong>
                  {metrics.bmi ?? "N/A"}
                </strong>

                <small
                  className={
                    metrics.category === "Normal"
                      ? "normal"
                      : "other"
                  }
                >
                  {metrics.category}
                </small>

              </div>

              <div className="health-box">

                <span>Weight</span>

                <strong>
                  {patient?.weight
                    ? patient.weight
                    : "N/A"}
                </strong>

                <small>
                  {patient?.weight ? "kg" : ""}
                </small>

              </div>

              <div className="health-box">

                <span>Height</span>

                <strong>
                  {patient?.height
                    ? patient.height
                    : "N/A"}
                </strong>

                <small>
                  {patient?.height ? "cm" : ""}
                </small>

              </div>

            </div>

          </div>

        </section>

        {/* =========================================
            APPOINTMENT
        ========================================= */}

        <section className="home-card appointment-section">

          <div className="card-heading">

            <div>
              <h2>Upcoming Appointment</h2>
              <span>Your next consultation</span>
            </div>

            <Link to="/patient/appointment">
              All Appointments
            </Link>

          </div>

          {appointment ? (

            <div className="appointment-box">

              <div className="appointment-calendar">

                <strong>
                  {appointmentDate.getDate()}
                </strong>

                <span>
                  {appointmentDate.toLocaleDateString(
                    "en-IN",
                    {
                      month: "short",
                    }
                  )}
                </span>

              </div>

              <div className="appointment-details">

                <h3>
                  {doctorName}
                </h3>

                <p>
                  Doctor consultation
                </p>

                <div className="appointment-meta">

                  <span>
                    {appointmentDate.toLocaleDateString(
                      "en-IN",
                      {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      }
                    )}
                  </span>

                  <span>
                    {appointment.time ||
                      "Time not specified"}
                  </span>

                </div>

              </div>

              <div
                className={`status ${
                  appointment.status ||
                  "pending"
                }`}
              >
                {appointment.status ===
                "accepted"
                  ? "Confirmed"
                  : appointment.status ===
                    "completed"
                  ? "Completed"
                  : appointment.status ===
                    "rejected"
                  ? "Rejected"
                  : "Pending"}
              </div>

            </div>

          ) : (

            <div className="no-appointment">

              <div className="empty-icon">
                +
              </div>

              <div>
                <h3>
                  No upcoming appointment
                </h3>

                <p>
                  Schedule a consultation with
                  a doctor when you need care.
                </p>
              </div>

              <Link
                to="/patient/appointment"
                className="primary-button"
              >
                Book Appointment
              </Link>

            </div>

          )}

        </section>

        {/* =========================================
            QUICK ACCESS
        ========================================= */}

        <section className="quick-section">

          <div className="section-heading">
            <h2>Quick Access</h2>
            <p>
              Manage your healthcare in one place.
            </p>
          </div>

          <div className="quick-grid">

            <QuickLink
              title="Appointments"
              description="Book and manage visits"
              icon="A"
              link="/patient/appointment"
            />

            <QuickLink
              title="Medical Records"
              description="Prescriptions and reports"
              icon="M"
              link="/patient/cards"
            />

            <QuickLink
              title="Health Tracker"
              description="Track your health"
              icon="H"
              link="/patient/tracker"
            />

            <QuickLink
              title="Diet & Wellness"
              description="Monitor your nutrition"
              icon="D"
              link="/patient/diet"
            />

            <QuickLink
              title="Messages"
              description="Talk to your doctor"
              icon="C"
              link="/patient/messages"
            />

            <QuickLink
              title="Profile"
              description="Update your information"
              icon="P"
              link="/patient/profile"
            />

          </div>

        </section>

        {/* =========================================
            HEALTH TIP
        ========================================= */}

        <section className="health-tip">

          <div className="tip-icon">
            +
          </div>

          <div>
            <span>HEALTH TIP</span>

            <h3>
              Take care of your health every day.
            </h3>

            <p>
              Stay hydrated, eat a balanced diet,
              stay active, and get enough sleep.
            </p>
          </div>

        </section>

      </main>

      <Footer />
    </>
  );
}


/* =====================================================
   QUICK LINK COMPONENT
===================================================== */

function QuickLink({
  title,
  description,
  icon,
  link,
}) {
  return (
    <Link
      to={link}
      className="quick-link"
    >

      <div className="quick-icon">
        {icon}
      </div>

      <div>
        <h3>{title}</h3>

        <p>{description}</p>
      </div>

      <span className="arrow">
        →
      </span>

    </Link>
  );
}

export default Dashboard;