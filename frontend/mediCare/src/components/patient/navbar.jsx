import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import Logo from "../../assets/welcome page/MediCare.png";
import "./navbar.css";

const API_URL = "http://localhost:3010";

const PatientNavbar = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("Patient");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // ==========================================
  // FETCH PATIENT DETAILS
  // ==========================================
  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const email = localStorage.getItem("email");
        const userType = localStorage.getItem("userType");

        console.log("Email:", email);
        console.log("User Type:", userType);

        // Check logged-in user type
        if (userType !== "patient") {
          console.error("Logged-in user is not a patient");
          return;
        }

        // Check email
        if (!email) {
          console.error("Patient email not found");
          setUsername("Patient");
          return;
        }

        // Get patient details
        const response = await axios.get(
          `${API_URL}/patient/dashboard?email=${encodeURIComponent(
            email
          )}`
        );

        console.log(
          "Patient dashboard response:",
          response.data
        );

        // Backend returns patient inside profile
        const patient = response.data?.profile;

        if (patient) {
          // Set patient name
          if (patient.fullName) {
            setUsername(patient.fullName);
          } else {
            setUsername("Patient");
          }

          // Save patient ID
          if (patient._id) {
            localStorage.setItem(
              "patientId",
              patient._id
            );
          }
        } else {
          console.error("Patient profile not found");
          setUsername("Patient");
        }
      } catch (error) {
        console.error(
          "Error fetching patient:",
          error.response?.data || error.message
        );

        setUsername("Patient");
      }
    };

    fetchPatient();
  }, []);

  // ==========================================
  // LOGOUT
  // ==========================================
  const handleLogout = () => {
    // Remove login information
    localStorage.removeItem("token");
    localStorage.removeItem("userType");
    localStorage.removeItem("email");
    localStorage.removeItem("patientId");
    localStorage.removeItem("patientName");

    // Remove selected doctor information
    localStorage.removeItem("selectedDoctorId");
    localStorage.removeItem("selectedDoctorName");

    // Close sidebar
    setIsSidebarOpen(false);

    // Redirect to login page
    navigate("/", { replace: true });
  };

  // ==========================================
  // CLOSE SIDEBAR
  // ==========================================
  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  // ==========================================
  // TOGGLE SIDEBAR
  // ==========================================
  const toggleSidebar = () => {
    setIsSidebarOpen((previous) => !previous);
  };

  // ==========================================
  // GET USER INITIAL
  // ==========================================
  const getUserInitial = () => {
    if (
      username &&
      username !== "Patient" &&
      username.trim().length > 0
    ) {
      return username
        .trim()
        .charAt(0)
        .toUpperCase();
    }

    return "P";
  };

  return (
    <>
      {/* ==========================================
          TOP NAVBAR
      ========================================== */}
      <nav className="patient-navbar">
        {/* LEFT SIDE */}
        <div className="patient-navbar-left">
          {/* SIDEBAR TOGGLE */}
          <button
            className="sidebar-toggle"
            type="button"
            onClick={toggleSidebar}
            aria-label="Open menu"
            aria-expanded={isSidebarOpen}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          {/* LOGO */}
          <Link
            to="/patient/dashboard"
            className="patient-brand"
            onClick={closeSidebar}
          >
            <img
              src={Logo}
              alt="MediCare Logo"
            />

            <span>MediCare</span>
          </Link>
        </div>

        {/* RIGHT SIDE */}
        <div className="patient-navbar-right">
          {/* PATIENT NAME */}
          <span className="patient-welcome">
            {username}
          </span>

          {/* PROFILE BUTTON */}
          <button
            className="patient-profile-btn"
            type="button"
            onClick={() => {
              closeSidebar();
              navigate("/patient/profile");
            }}
            title="Profile"
            aria-label="Open profile"
          >
            {getUserInitial()}
          </button>
        </div>
      </nav>

      {/* ==========================================
          SIDEBAR OVERLAY
      ========================================== */}
      {isSidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={closeSidebar}
        ></div>
      )}

      {/* ==========================================
          SIDEBAR
      ========================================== */}
      <aside
        className={`patient-sidebar ${
          isSidebarOpen ? "sidebar-open" : ""
        }`}
      >
        {/* ==========================================
            SIDEBAR HEADER
        ========================================== */}
        <div className="sidebar-header">
          <div>
            <h4>MediCare</h4>
            <span>Patient Portal</span>
          </div>

          <button
            className="sidebar-close"
            type="button"
            onClick={closeSidebar}
            aria-label="Close menu"
          >
            ×
          </button>
        </div>

        {/* ==========================================
            SIDEBAR MENU
        ========================================== */}
        <div className="sidebar-menu">
          {/* DASHBOARD */}
          <NavLink
            to="/patient/dashboard"
            onClick={closeSidebar}
            className={({ isActive }) =>
              `patient-nav-link ${
                isActive ? "active" : ""
              }`
            }
          >
            <span className="nav-icon">⌂</span>
            <span>Dashboard</span>
          </NavLink>

          {/* BMI */}
          <NavLink
            to="/patient/monitor"
            onClick={closeSidebar}
            className={({ isActive }) =>
              `patient-nav-link ${
                isActive ? "active" : ""
              }`
            }
          >
            <span className="nav-icon">BMI</span>
            <span>BMI Calculator</span>
          </NavLink>

         

          {/* HEALTH TRACKER
          <NavLink
            to="/patient/tracker"
            onClick={closeSidebar}
            className={({ isActive }) =>
              `patient-nav-link ${
                isActive ? "active" : ""
              }`
            }
          >
            <span className="nav-icon">T</span>
            <span>Health Tracker</span>
          </NavLink> */}

          {/* CONSULTATION */}
          <NavLink
            to="/patient/consultation"
            onClick={closeSidebar}
            className={({ isActive }) =>
              `patient-nav-link ${
                isActive ? "active" : ""
              }`
            }
          >
            <span className="nav-icon">C</span>
            <span>Consultation</span>
          </NavLink>

          {/* APPOINTMENTS */}
          <NavLink
            to="/patient/appointment"
            onClick={closeSidebar}
            className={({ isActive }) =>
              `patient-nav-link ${
                isActive ? "active" : ""
              }`
            }
          >
            <span className="nav-icon">A</span>
            <span>Appointments</span>
          </NavLink>

          {/* CHAT */}
          <NavLink
            to="/patient/chat"
            onClick={closeSidebar}
            className={({ isActive }) =>
              `patient-nav-link ${
                isActive ? "active" : ""
              }`
            }
          >
            <span className="nav-icon">M</span>
            <span>Chat</span>
          </NavLink>

          {/* MEDICAL RECORDS */}
          <NavLink
            to="/patient/cards"
            onClick={closeSidebar}
            className={({ isActive }) =>
              `patient-nav-link ${
                isActive ? "active" : ""
              }`
            }
          >
            <span className="nav-icon">M</span>
            <span>Medical Records</span>
          </NavLink>

          {/* PROFILE */}
          <NavLink
            to="/patient/profile"
            onClick={closeSidebar}
            className={({ isActive }) =>
              `patient-nav-link ${
                isActive ? "active" : ""
              }`
            }
          >
            <span className="nav-icon">P</span>
            <span>Profile</span>
          </NavLink>

          
        </div>

        {/* ==========================================
            PATIENT INFORMATION
        ========================================== */}
        <div className="sidebar-user">
          {/* AVATAR */}
          <div className="sidebar-user-avatar">
            {getUserInitial()}
          </div>

          {/* USER DETAILS */}
          <div className="sidebar-user-info">
            <strong>{username}</strong>
            <span>Patient</span>
          </div>
        </div>

        {/* ==========================================
            LOGOUT
        ========================================== */}
        <button
          className="patient-logout"
          type="button"
          onClick={handleLogout}
        >
          Logout
        </button>
      </aside>
    </>
  );
};

export default PatientNavbar;