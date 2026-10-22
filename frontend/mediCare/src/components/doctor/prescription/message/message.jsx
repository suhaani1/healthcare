import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DoctorNavbar from "../../nav";
import "./message.css";

const API = "http://localhost:3010/api";

const MessagesNotifications = () => {
  const navigate = useNavigate();

  const [doctorId, setDoctorId] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // GET DOCTOR ID
  // =====================================================
  useEffect(() => {
    const id = localStorage.getItem("doctorId");

    if (!id) {
      setError("Doctor information not found.");
      setLoading(false);
      return;
    }

    setDoctorId(id);
  }, []);

  // =====================================================
  // FETCH NOTIFICATIONS
  // =====================================================
  useEffect(() => {
    if (!doctorId) return;

    fetchNotifications();
  }, [doctorId]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `${API}/notification/doctor/${doctorId}`
      );

      const data = response.data;

      if (Array.isArray(data)) {
        setNotifications(data);
      } else {
        setNotifications(
          data?.notifications || []
        );
      }
    } catch (error) {
      console.error(
        "Fetch notifications error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to load notifications."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // MARK ONE NOTIFICATION AS READ
  // =====================================================
  const markAsRead = async (notification) => {
    if (!notification?._id) return;

    if (notification.read) return;

    try {
      await axios.put(
        `${API}/notification/${notification._id}/read`
      );

      setNotifications((previous) =>
        previous.map((item) =>
          item._id === notification._id
            ? { ...item, read: true }
            : item
        )
      );
    } catch (error) {
      console.error(
        "Mark notification read error:",
        error
      );
    }
  };

  // =====================================================
  // OPEN CHAT
  // =====================================================
  const openChat = async (notification) => {
    try {
      let patientId = "";
      let patientName = "";

      // patientId may be populated object
      if (
        notification.patientId &&
        typeof notification.patientId === "object"
      ) {
        patientId = notification.patientId._id;

        patientName =
          notification.patientId.fullName || "";
      } else {
        // patientId may only be ObjectId/string
        patientId = notification.patientId;
      }

      if (!patientId) {
        alert(
          "Patient information is not available."
        );
        return;
      }

      await markAsRead(notification);

      // Save as fallback
      localStorage.setItem(
        "selectedPatientId",
        String(patientId)
      );

      if (patientName) {
        localStorage.setItem(
          "selectedPatientName",
          patientName
        );
      }

      // IMPORTANT:
      // Actual doctor chat route
      navigate("/doc/chat", {
        state: {
          patientId: String(patientId),
          patientName: patientName,
        },
      });
    } catch (error) {
      console.error(
        "Open chat error:",
        error
      );
    }
  };

  // =====================================================
  // NOTIFICATION TYPE
  // =====================================================
  const getNotificationType = (notification) => {
    return (
      notification.type ||
      "system"
    ).toLowerCase();
  };

  // =====================================================
  // CHECK MESSAGE
  // =====================================================
  const isMessage = (notification) => {
    return (
      getNotificationType(notification) ===
      "message"
    );
  };

  // =====================================================
  // FORMAT DATE
  // =====================================================
  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  // =====================================================
  // NOTIFICATION ICON
  // =====================================================
  const getIcon = (notification) => {
    const type =
      getNotificationType(notification);

    switch (type) {
      case "message":
        return "M";

      case "appointment":
        return "A";

      case "prescription":
        return "P";

      case "lab":
        return "L";

      case "request":
        return "R";

      default:
        return "N";
    }
  };

  return (
    <div className="doctor-notification-page">

      <DoctorNavbar />

      <div className="doctor-notification-container">

        {/* =================================================
            HEADER
        ================================================== */}

        <div className="doctor-notification-header">

          <div>
            <h1>Messages & Notifications</h1>

            <p>
              View patient messages and other
              important notifications.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchNotifications}
            className="notification-refresh-btn"
          >
            Refresh
          </button>

        </div>

        {/* =================================================
            ERROR
        ================================================== */}

        {error && (
          <div className="notification-error">
            {error}
          </div>
        )}

        {/* =================================================
            LOADING
        ================================================== */}

        {loading ? (
          <div className="notification-loading">
            Loading notifications...
          </div>
        ) : notifications.length === 0 ? (
          <div className="notification-empty">

            <div className="notification-empty-icon">
              N
            </div>

            <h3>No notifications</h3>

            <p>
              You don't have any notifications
              right now.
            </p>

          </div>
        ) : (
          <div className="notification-list">

            {notifications.map(
              (notification) => {

                let patientName = "";

                if (
                  notification.patientId &&
                  typeof notification.patientId ===
                    "object"
                ) {
                  patientName =
                    notification.patientId
                      .fullName || "";
                }

                return (
                  <div
                    key={notification._id}
                    className={`notification-card ${
                      notification.read
                        ? "read"
                        : "unread"
                    }`}
                  >

                    {/* ICON */}

                    <div className="notification-icon">
                      {getIcon(notification)}
                    </div>

                    {/* CONTENT */}

                    <div className="notification-content">

                      <div className="notification-title-row">

                        <h3>
                          {notification.title ||
                            "Notification"}
                        </h3>

                        {!notification.read && (
                          <span className="notification-new">
                            New
                          </span>
                        )}

                      </div>

                      <p className="notification-message">
                        {notification.message ||
                          "You have a new notification."}
                      </p>

                      {patientName && (
                        <p className="notification-patient">
                          Patient:{" "}
                          <strong>
                            {patientName}
                          </strong>
                        </p>
                      )}

                      <div className="notification-footer">

                        <span className="notification-date">
                          {formatDate(
                            notification.createdAt
                          )}
                        </span>

                        <div className="notification-actions">

                          {!notification.read && (
                            <button
                              type="button"
                              className="notification-read-btn"
                              onClick={() =>
                                markAsRead(
                                  notification
                                )
                              }
                            >
                              Mark as read
                            </button>
                          )}

                          {isMessage(
                            notification
                          ) &&
                            notification.patientId && (
                              <button
                                type="button"
                                className="notification-chat-btn"
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

                      </div>

                    </div>

                  </div>
                );
              }
            )}

          </div>
        )}

      </div>
    </div>
  );
};

export default MessagesNotifications;