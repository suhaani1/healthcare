import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import Logo from "../../assets/logo1.jpg";
import "./nav.css";

const API_URL = "http://localhost:3010/api";

const DoctorNavbar = () => {
  const navigate = useNavigate();

  const [doctorName, setDoctorName] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] =
    useState(false);
  const [loading, setLoading] = useState(true);

  const email = localStorage.getItem("email");

  // =====================================================
  // GET DOCTOR DETAILS
  // =====================================================

  const fetchDoctor = async () => {
    if (!email) {
      setDoctorName("Doctor");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get(
        `${API_URL}/doctor/getDoctor/${email}`
      );

      setDoctorName(
        res.data?.fullName || "Doctor"
      );

      if (res.data?._id) {
        localStorage.setItem(
          "doctorId",
          res.data._id
        );
      }
    } catch (error) {
      console.error(
        "Error fetching doctor:",
        error
      );

      setDoctorName("Doctor");
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // GET NOTIFICATIONS
  // =====================================================

  const fetchNotifications = async () => {
    const currentDoctorId =
      localStorage.getItem("doctorId");

    if (!currentDoctorId) return;

    try {
      const res = await axios.get(
        `${API_URL}/notification/doctor/${currentDoctorId}`
      );

      /*
       * Support both:
       * 1. Array response
       * 2. { notifications: [] }
       */

      const data = Array.isArray(res.data)
        ? res.data
        : res.data?.notifications || [];

      setNotifications(data);

      setUnreadCount(
        data.filter(
          (item) => !item.read
        ).length
      );
    } catch (error) {
      console.error(
        "Error fetching notifications:",
        error
      );
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    const loadData = async () => {
      await fetchDoctor();
      await fetchNotifications();
    };

    loadData();

    /*
     * Refresh notification count every 10 seconds.
     */

    const interval = setInterval(() => {
      fetchNotifications();
    }, 10000);

    return () =>
      clearInterval(interval);
  }, []);

  // =====================================================
  // MARK SINGLE NOTIFICATION READ
  // =====================================================

  const markAsRead = async (notification) => {
    try {
      if (!notification.read) {
        await axios.put(
          `${API_URL}/notification/${notification._id}/read`
        );
      }

      setNotifications((prev) =>
        prev.map((item) =>
          item._id === notification._id
            ? {
                ...item,
                read: true,
              }
            : item
        )
      );

      if (!notification.read) {
        setUnreadCount((prev) =>
          Math.max(prev - 1, 0)
        );
      }
    } catch (error) {
      console.error(
        "Error marking notification:",
        error
      );
    }
  };

  // =====================================================
  // OPEN CHAT FOR SPECIFIC PATIENT
  // =====================================================

  const openChat = async (notification) => {
    try {
      const patientId =
        typeof notification.patientId ===
        "object"
          ? notification.patientId?._id
          : notification.patientId;

      const patientName =
        typeof notification.patientId ===
        "object"
          ? notification.patientId?.fullName
          : "";

      if (!patientId) {
        console.error(
          "Patient ID not found."
        );
        return;
      }

      /*
       * Mark notification as read.
       */

      if (!notification.read) {
        await axios.put(
          `${API_URL}/notification/${notification._id}/read`
        );

        setNotifications((prev) =>
          prev.map((item) =>
            item._id === notification._id
              ? {
                  ...item,
                  read: true,
                }
              : item
          )
        );

        setUnreadCount((prev) =>
          Math.max(prev - 1, 0)
        );
      }

      /*
       * Store patient for DoctorChat.jsx.
       */

      localStorage.setItem(
        "selectedPatientId",
        patientId
      );

      localStorage.setItem(
        "selectedPatientName",
        patientName || ""
      );

      /*
       * Close popup.
       */

      setShowNotifications(false);

      /*
       * Open actual Chat page.
       */

      navigate("/doc/chat");
    } catch (error) {
      console.error(
        "Error opening chat:",
        error
      );
    }
  };

  // =====================================================
  // OPEN MESSAGES PAGE
  // =====================================================

  const openMessages = () => {
    setShowNotifications(false);
    navigate("/doc/notifications");
  };

  // =====================================================
  // MARK ALL READ
  // =====================================================

  const markAllAsRead = async () => {
    const currentDoctorId =
      localStorage.getItem("doctorId");

    if (!currentDoctorId) return;

    try {
      await axios.put(
        `${API_URL}/notification/doctor/${currentDoctorId}/read-all`
      );

      setNotifications((prev) =>
        prev.map((item) => ({
          ...item,
          read: true,
        }))
      );

      setUnreadCount(0);
    } catch (error) {
      console.error(
        "Error marking all notifications:",
        error
      );
    }
  };

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    localStorage.removeItem("doctorId");
    localStorage.removeItem("email");
    localStorage.removeItem("token");

    localStorage.removeItem(
      "selectedPatientId"
    );

    localStorage.removeItem(
      "selectedPatientName"
    );

    navigate("/logout");
  };

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {
    if (!date) return "";

    const parsedDate = new Date(date);

    if (
      Number.isNaN(parsedDate.getTime())
    ) {
      return "";
    }

    return parsedDate.toLocaleString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <nav className="doctor-navbar">

      {/* =================================================
          LOGO
      ================================================= */}

      <div
        className="navbar-logo"
        onClick={() =>
          navigate("/doc/dash")
        }
      >
        <img
          src={Logo}
          alt="MediCare"
        />
      </div>

      {/* =================================================
          NAVIGATION
      ================================================= */}

      <div className="navbar-links">

        {/* DASHBOARD */}

        <NavLink
          to="/doc/dash"
          className={({ isActive }) =>
            `nav-link ${
              isActive ? "active" : ""
            }`
          }
        >
          Dashboard
        </NavLink>

        {/* PATIENTS */}

        <NavLink
          to="/patientview"
          className={({ isActive }) =>
            `nav-link ${
              isActive ? "active" : ""
            }`
          }
        >
          Patients
        </NavLink>

        {/* PRESCRIPTION */}

        <NavLink
          to="/prescription"
          className={({ isActive }) =>
            `nav-link ${
              isActive ? "active" : ""
            }`
          }
        >
          Prescriptions
        </NavLink>

        {/* APPOINTMENTS */}

        <NavLink
          to="/doc/appointment"
          className={({ isActive }) =>
            `nav-link ${
              isActive ? "active" : ""
            }`
          }
        >
          Appointments
        </NavLink>

        {/* =================================================
            MESSAGES
            Separate from Chat
        ================================================= */}

        {/* <NavLink
          to="/doc/notifications"
          className={({ isActive }) =>
            `nav-link ${
              isActive ? "active" : ""
            }`
          }
        >
          Messages

          {unreadCount > 0 && (
            <span className="nav-message-count">
              {unreadCount > 99
                ? "99+"
                : unreadCount}
            </span>
          )}
        </NavLink> */}

        {/* =================================================
            CHAT
            Separate page
        ================================================= */}

        <NavLink
          to="/doc/chat"
          className={({ isActive }) =>
            `nav-link ${
              isActive ? "active" : ""
            }`
          }
        >
          Chat
        </NavLink>

      </div>

      {/* =================================================
          RIGHT SIDE
      ================================================= */}

      <div className="navbar-right">

        {/* =================================================
            NOTIFICATION BELL
        ================================================= */}

        <div className="notification-wrapper">

          <button
            className="notification-bell"
            onClick={() =>
              setShowNotifications(
                !showNotifications
              )
            }
            type="button"
            aria-label="Notifications"
          >
            <span className="bell-icon">
              &#128276;
            </span>

            {unreadCount > 0 && (
              <span className="notification-count">
                {unreadCount > 99
                  ? "99+"
                  : unreadCount}
              </span>
            )}
          </button>

          {/* =================================================
              NOTIFICATION POPUP
          ================================================= */}

          {showNotifications && (
            <div className="notification-popup">

              {/* POPUP HEADER */}

              <div className="notification-header">

                <div>
                  <h4>
                    Notifications
                  </h4>

                  <span>
                    {unreadCount} unread
                  </span>
                </div>

                {unreadCount > 0 && (
                  <button
                    type="button"
                    className="mark-all-btn"
                    onClick={
                      markAllAsRead
                    }
                  >
                    Mark all read
                  </button>
                )}

              </div>

              {/* =================================================
                  NOTIFICATION LIST
              ================================================= */}

              <div className="notification-list">

                {notifications.length ===
                0 ? (

                  <div className="no-notifications">

                    <div className="empty-icon">
                      &#128276;
                    </div>

                    <p>
                      No notifications
                    </p>

                  </div>

                ) : (

                  notifications
                    .slice(0, 5)
                    .map(
                      (notification) => (

                        <div
                          key={
                            notification._id
                          }
                          className={`notification-item ${
                            !notification.read
                              ? "unread"
                              : ""
                          }`}
                        >

                          {/* ICON */}

                          <div className="notification-icon">

                            {notification.type ===
                            "request"
                              ? "A"
                              : notification.type ===
                                "message"
                              ? "M"
                              : "N"}

                          </div>

                          {/* CONTENT */}

                          <div className="notification-content">

                            <h5>
                              {notification.title ||
                                "Notification"}
                            </h5>

                            <p>
                              {notification.message ||
                                ""}
                            </p>

                            <small>
                              {formatDate(
                                notification.createdAt
                              )}
                            </small>

                            {/* =================================================
                                MESSAGE NOTIFICATION
                                OPEN CHAT
                            ================================================= */}

                            {notification.type ===
                              "message" &&
                              notification.patientId && (
                                <button
                                  type="button"
                                  className="open-chat-btn"
                                  onClick={() =>
                                    openChat(
                                      notification
                                    )
                                  }
                                >
                                  Chat
                                </button>
                              )}

                          </div>

                          {/* UNREAD DOT */}

                          {!notification.read && (
                            <span className="unread-dot"></span>
                          )}

                        </div>

                      )
                    )

                )}

              </div>

              {/* =================================================
                  VIEW ALL MESSAGES
              ================================================= */}

              {notifications.length > 0 && (
                <button
                  type="button"
                  className="view-all-btn"
                  onClick={
                    openMessages
                  }
                >
                  View all messages
                </button>
              )}

            </div>
          )}

        </div>

        {/* =================================================
            DOCTOR NAME
        ================================================= */}

        <button
          type="button"
          className="logout-btn"
          onClick={handleLogout}
        >
          <div className="doctor-name">
            {loading
              ? "Loading..."
              : doctorName}
          </div>
        </button>

      </div>

    </nav>
  );
};

export default DoctorNavbar;