import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "./DoctorDashboard.css";
import DoctorNavbar from "./nav";
import DoctorFooter from "./footerdoc/docFooter";
import Avatar from "../../assets/register/avatar.jpg";
import { Link } from "react-router-dom";

const API_URL = "http://localhost:3010/api";

const DoctorDashboard = () => {
  const [doctorData, setDoctorData] = useState(null);

  const [doctorId, setDoctorId] = useState(
    localStorage.getItem("doctorId") || ""
  );

  const [appointments, setAppointments] = useState([]);
  const [requests, setRequests] = useState([]);

  const [loading, setLoading] = useState(true);
  const [appointmentsLoading, setAppointmentsLoading] = useState(true);
  const [requestsLoading, setRequestsLoading] = useState(true);

  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(null);

  // Logged-in doctor's email
  const email = localStorage.getItem("email");

  // =====================================================
  // FETCH DOCTOR PROFILE
  // =====================================================
  const fetchDoctor = useCallback(async () => {
    if (!email) {
      setError("Doctor email not found. Please login again.");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get(
        `${API_URL}/doctor/getDoctor/${encodeURIComponent(email)}`
      );

      const doctor = res.data;

      setDoctorData(doctor);

      // Save doctor ID for appointment and patient APIs
      if (doctor?._id) {
        localStorage.setItem("doctorId", doctor._id);
        setDoctorId(doctor._id);
      }

      setError("");
    } catch (err) {
      console.error("Doctor fetch error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to fetch doctor data."
      );
    } finally {
      setLoading(false);
    }
  }, [email]);

  // =====================================================
  // FETCH ALL DOCTOR APPOINTMENTS
  // =====================================================
  const fetchAppointments = useCallback(async () => {
    if (!doctorId) {
      setAppointmentsLoading(false);
      return;
    }

    setAppointmentsLoading(true);

    try {
      const res = await axios.get(
        `${API_URL}/appointment/doctor/${doctorId}`
      );

      const data = Array.isArray(res.data)
        ? res.data
        : res.data.appointments || [];

      setAppointments(data);
    } catch (err) {
      console.error("Appointments fetch error:", err);
      setAppointments([]);
    } finally {
      setAppointmentsLoading(false);
    }
  }, [doctorId]);

  // =====================================================
  // FETCH PENDING REQUESTS
  // =====================================================
  const fetchRequests = useCallback(async () => {
    if (!doctorId) {
      setRequestsLoading(false);
      return;
    }

    setRequestsLoading(true);

    try {
      const res = await axios.get(
        `${API_URL}/appointment/doctor/${doctorId}/requests`
      );

      const data = Array.isArray(res.data)
        ? res.data
        : res.data.requests || [];

      setRequests(data);
    } catch (err) {
      console.error("Requests fetch error:", err);
      setRequests([]);
    } finally {
      setRequestsLoading(false);
    }
  }, [doctorId]);

  // =====================================================
  // LOAD DOCTOR
  // =====================================================
  useEffect(() => {
    fetchDoctor();
  }, [fetchDoctor]);

  // =====================================================
  // LOAD APPOINTMENTS AFTER DOCTOR ID IS AVAILABLE
  // =====================================================
  useEffect(() => {
    if (!doctorId) return;

    fetchAppointments();
    fetchRequests();
  }, [doctorId, fetchAppointments, fetchRequests]);

  // =====================================================
  // ACCEPT / REJECT APPOINTMENT
  // =====================================================
  const handleAction = async (id, action) => {
    if (!id) return;

    try {
      setActionLoading(id);

      await axios.put(
        `${API_URL}/appointment/status/${id}`,
        {
          status: action,
        }
      );

      // Refresh data from MongoDB
      await Promise.all([
        fetchAppointments(),
        fetchRequests(),
      ]);
    } catch (err) {
      console.error("Appointment action error:", err);

      alert(
        err.response?.data?.message ||
          `Failed to ${action} appointment.`
      );
    } finally {
      setActionLoading(null);
    }
  };

  // =====================================================
  // FORMAT DATE
  // =====================================================
  const formatDate = (date) => {
    if (!date) return "N/A";

    const d = new Date(date);

    if (isNaN(d.getTime())) return date;

    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // =====================================================
  // FORMAT TIME
  // =====================================================
  const formatTime = (time) => {
    if (!time) return "N/A";

    // Backend already gives something like 10:00 AM
    if (
      typeof time === "string" &&
      (time.includes("AM") || time.includes("PM"))
    ) {
      return time;
    }

    // If backend sends a date/time
    const d = new Date(time);

    if (!isNaN(d.getTime())) {
      return d.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    return time;
  };

  // =====================================================
  // GET PATIENT NAME
  // =====================================================
  const getPatientName = (item) => {
    return (
      item.patientName ||
      item.patientId?.fullName ||
      item.patient?.fullName ||
      item.patient?.name ||
      item.name ||
      "Unknown Patient"
    );
  };

  // =====================================================
  // GET REASON
  // =====================================================
  const getReason = (item) => {
    return (
      item.reason ||
      item.symptoms ||
      item.message ||
      "General Consultation"
    );
  };

  // =====================================================
  // ACCEPTED / UPCOMING APPOINTMENTS
  // =====================================================
  const upcomingAppointments = appointments.filter(
    (appointment) =>
      appointment.status === "accepted" ||
      appointment.status === "confirmed" ||
      appointment.status === "upcoming"
  );

  // =====================================================
  // PENDING REQUESTS
  // =====================================================
  const pendingRequests = requests.filter(
    (request) => request.status === "pending"
  );

  // =====================================================
  // ACCEPTED APPOINTMENTS
  // =====================================================
  const acceptedRequests = appointments.filter(
    (appointment) =>
      appointment.status === "accepted" ||
      appointment.status === "confirmed"
  );

  // =====================================================
  // NO LOGIN
  // =====================================================
  if (!email) {
    return (
      <>
        <DoctorNavbar />

        <div className="container py-5">
          <div className="alert alert-danger text-center">
            Please login as a doctor to access the dashboard.
          </div>
        </div>

        <DoctorFooter />
      </>
    );
  }

  // =====================================================
  // UI
  // =====================================================
  return (
    <>
      <DoctorNavbar />

      <div className="doctor1 container-fluid py-4 bg-light doctor-dashboard">
        <div className="container">

          {/* ================= PAGE HEADER ================= */}

          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="fw-bold mb-1">
                {/* Doctor Dashboard */}
              </h2>

              <p className="text-muted fw-bold mb-1">
                Welcome back, Dr.{" "}
                {doctorData?.fullName || "Doctor"}
              </p>
            </div>

            <Link
              to="/doc/profile"
              className="btn btn-outline-success"
            >
              Edit Profile
            </Link>
          </div>

          {/* ================= ERROR ================= */}

          {error && (
            <div className="alert alert-danger">
              {error}
            </div>
          )}

          <div className="row g-4">

            {/* =================================================
                DOCTOR PROFILE
            ================================================= */}

            <div className="col-lg-4">

              <div className="card shadow-sm border-0 p-4 text-center">

                {loading ? (
                  <div className="py-4">

                    <div
                      className="spinner-border text-success"
                      role="status"
                    ></div>

                    <p className="mt-2 text-muted">
                      Loading profile...
                    </p>

                  </div>
                ) : (
                  <>
                    <img
                      src={
                        doctorData?.profilePhoto || Avatar
                      }
                      alt="Doctor Avatar"
                      className="rounded-circle mx-auto mb-3"
                      width="110"
                      height="110"
                      style={{
                        objectFit: "cover",
                      }}
                    />

                    <h4 className="fw-bold mb-1">
                      Dr. {doctorData?.fullName || "Doctor"}
                    </h4>

                    <p className="text-success fw-semibold">
                      {doctorData?.specialization ||
                        "Specialization not available"}
                    </p>

                    <hr />

                    <div className="text-start">

                      <p className="mb-2">
                        <strong>Email:</strong>{" "}
                        {doctorData?.email || "N/A"}
                      </p>

                      <p className="mb-2">
                        <strong>Phone:</strong>{" "}
                        {doctorData?.phone || "N/A"}
                      </p>

                      <p className="mb-2">
                        <strong>Gender:</strong>{" "}
                        {doctorData?.gender || "N/A"}
                      </p>

                      <p className="mb-2">
                        <strong>Experience:</strong>{" "}
                        {doctorData?.experience
                          ? `${doctorData.experience} years`
                          : "N/A"}
                      </p>

                      <p className="mb-2">
                        <strong>Qualifications:</strong>{" "}
                        {doctorData?.qualifications || "N/A"}
                      </p>

                    </div>

                    <Link
                      to="/doc/profile"
                      className="btn btn-outline-success w-100 mt-3"
                    >
                      View / Edit Profile
                    </Link>
                  </>
                )}

              </div>

              {/* ================= STATISTICS ================= */}

              <div className="row g-3 mt-1">

                <div className="col-4">
                  <div className="card border-0 shadow-sm text-center p-3">

                    <h4 className="fw-bold text-primary">
                      {appointments.length}
                    </h4>

                    <small className="text-muted">
                      Appointments
                    </small>

                  </div>
                </div>

                <div className="col-4">
                  <div className="card border-0 shadow-sm text-center p-3">

                    <h4 className="fw-bold text-warning">
                      {pendingRequests.length}
                    </h4>

                    <small className="text-muted">
                      Pending
                    </small>

                  </div>
                </div>

                <div className="col-4">
                  <div className="card border-0 shadow-sm text-center p-3">

                    <h4 className="fw-bold text-success">
                      {acceptedRequests.length}
                    </h4>

                    <small className="text-muted">
                      Accepted
                    </small>

                  </div>
                </div>

              </div>
            </div>

            {/* =================================================
                RIGHT SIDE
            ================================================= */}

            <div className="col-lg-8">

              {/* =================================================
                  UPCOMING APPOINTMENTS
              ================================================= */}

              <div className="card shadow-sm border-0 p-4 mb-4">

                <div className="d-flex justify-content-between align-items-center mb-3">

                  <h4 className="fw-bold text-primary mb-0">
                    Upcoming Appointments
                  </h4>

                  <span className="badge bg-primary">
                    {upcomingAppointments.length}
                  </span>

                </div>

                {appointmentsLoading ? (

                  <div className="text-center py-4">

                    <div
                      className="spinner-border text-primary"
                      role="status"
                    ></div>

                    <p className="text-muted mt-2">
                      Loading appointments...
                    </p>

                  </div>

                ) : upcomingAppointments.length === 0 ? (

                  <div className="text-center py-4">

                    <p className="text-muted mb-0">
                      No upcoming appointments.
                    </p>

                  </div>

                ) : (

                  <div className="table-responsive">

                    <table className="table table-bordered table-striped align-middle">

                      <thead className="table-light">

                        <tr>
                          <th>#</th>
                          <th>Patient</th>
                          <th>Date</th>
                          <th>Time</th>
                          <th>Reason</th>
                          <th>Status</th>
                        </tr>

                      </thead>

                      <tbody>

                        {upcomingAppointments.map(
                          (appt, index) => (

                            <tr
                              key={
                                appt._id ||
                                appt.id
                              }
                            >

                              <td>
                                {index + 1}
                              </td>

                              <td className="fw-semibold">
                                {getPatientName(appt)}
                              </td>

                              <td>
                                {formatDate(
                                  appt.date ||
                                    appt.appointmentDate
                                )}
                              </td>

                              <td>
                                {formatTime(
                                  appt.time ||
                                    appt.appointmentTime
                                )}
                              </td>

                              <td>
                                {getReason(appt)}
                              </td>

                              <td>

                                <span className="badge bg-success">
                                  {appt.status ||
                                    "Accepted"}
                                </span>

                              </td>

                            </tr>
                          )
                        )}

                      </tbody>

                    </table>

                  </div>
                )}

              </div>

              {/* =================================================
                  PENDING REQUESTS
              ================================================= */}

              <div className="card shadow-sm border-0 p-4 mb-4">

                <div className="d-flex justify-content-between align-items-center mb-3">

                  <h4 className="fw-bold text-primary mb-0">
                    Pending Appointment Requests
                  </h4>

                  <span className="badge bg-warning text-dark">
                    {pendingRequests.length}
                  </span>

                </div>

                {requestsLoading ? (

                  <div className="text-center py-4">

                    <div
                      className="spinner-border text-warning"
                      role="status"
                    ></div>

                    <p className="text-muted mt-2">
                      Loading requests...
                    </p>

                  </div>

                ) : pendingRequests.length === 0 ? (

                  <p className="text-muted text-center py-3">
                    No pending appointment requests.
                  </p>

                ) : (

                  <div className="table-responsive">

                    <table className="table table-bordered align-middle">

                      <thead className="table-light">

                        <tr>
                          <th>Patient</th>
                          <th>Date</th>
                          <th>Time</th>
                          <th>Reason</th>
                          <th>Action</th>
                        </tr>

                      </thead>

                      <tbody>

                        {pendingRequests.map((req) => {

                          const requestId =
                            req._id || req.id;

                          return (

                            <tr key={requestId}>

                              <td className="fw-semibold">
                                {getPatientName(req)}
                              </td>

                              <td>
                                {formatDate(
                                  req.date ||
                                    req.appointmentDate
                                )}
                              </td>

                              <td>
                                {formatTime(
                                  req.time ||
                                    req.appointmentTime
                                )}
                              </td>

                              <td>
                                {getReason(req)}
                              </td>

                              <td>

                                <button
                                  className="btn btn-sm btn-success me-2"
                                  disabled={
                                    actionLoading ===
                                    requestId
                                  }
                                  onClick={() =>
                                    handleAction(
                                      requestId,
                                      "accepted"
                                    )
                                  }
                                >

                                  {actionLoading ===
                                  requestId ? (
                                    <span className="spinner-border spinner-border-sm"></span>
                                  ) : (
                                    "Accept"
                                  )}

                                </button>

                                <button
                                  className="btn btn-sm btn-danger"
                                  disabled={
                                    actionLoading ===
                                    requestId
                                  }
                                  onClick={() =>
                                    handleAction(
                                      requestId,
                                      "rejected"
                                    )
                                  }
                                >
                                  Reject
                                </button>

                              </td>

                            </tr>

                          );
                        })}

                      </tbody>

                    </table>

                  </div>
                )}

              </div>

              {/* =================================================
                  ACCEPTED APPOINTMENTS
              ================================================= */}

              <div className="card shadow-sm border-0 p-4">

                <div className="d-flex justify-content-between align-items-center mb-3">

                  <h4 className="fw-bold text-success mb-0">
                    Accepted Appointments
                  </h4>

                  <span className="badge bg-success">
                    {acceptedRequests.length}
                  </span>

                </div>

                {appointmentsLoading ? (

                  <div className="text-center py-3">

                    <div
                      className="spinner-border text-success"
                      role="status"
                    ></div>

                  </div>

                ) : acceptedRequests.length === 0 ? (

                  <p className="text-muted text-center">
                    No accepted appointments.
                  </p>

                ) : (

                  <div className="list-group">

                    {acceptedRequests.map(
                      (appointment) => (

                        <div
                          className="list-group-item"
                          key={
                            appointment._id ||
                            appointment.id
                          }
                        >

                          <div className="d-flex justify-content-between align-items-center">

                            <div>

                              <h6 className="fw-bold mb-1">
                                {getPatientName(
                                  appointment
                                )}
                              </h6>

                              <small className="text-muted">

                                {formatDate(
                                  appointment.date ||
                                    appointment.appointmentDate
                                )}

                                {" at "}

                                {formatTime(
                                  appointment.time ||
                                    appointment.appointmentTime
                                )}

                                {" • "}

                                {getReason(
                                  appointment
                                )}

                              </small>

                            </div>

                            <span className="badge bg-success">
                              Accepted
                            </span>

                          </div>

                        </div>

                      )
                    )}

                  </div>

                )}

              </div>

            </div>
          </div>
        </div>
      </div>

      <DoctorFooter />
    </>
  );
};

export default DoctorDashboard;