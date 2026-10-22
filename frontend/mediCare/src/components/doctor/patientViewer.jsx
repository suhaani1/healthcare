import React, { useEffect, useState } from "react";
import axios from "axios";
import "./DoctorDashboard.css";
import DoctorNavbar from "./nav";
import DoctorFooter from "./footerdoc/docFooter";

const API_URL = "http://localhost:3010/api";
const SERVER_URL = "http://localhost:3010";

const PatientViewer = () => {
  const [patients, setPatients] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [error, setError] = useState("");

  const doctorId = localStorage.getItem("doctorId");

  // =====================================================
  // FETCH PATIENTS OF LOGGED-IN DOCTOR
  // =====================================================

  useEffect(() => {
    const fetchPatients = async () => {
      if (!doctorId) {
        setError("Doctor ID not found. Please login again.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const res = await axios.get(
          `${API_URL}/doctor/${doctorId}/patients`
        );

        const patientList = Array.isArray(res.data)
          ? res.data
          : res.data.patients || [];

        setPatients(patientList);

        if (patientList.length > 0) {
          const firstId =
            patientList[0]._id ||
            patientList[0].id;

          setSelectedId(firstId);
        }
      } catch (err) {
        console.error("Error fetching patients:", err);

        setPatients([]);

        setError(
          err.response?.data?.message ||
            "Failed to load patients."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, [doctorId]);

  // =====================================================
  // FETCH SELECTED PATIENT DETAILS + PRESCRIPTIONS
  // =====================================================

  useEffect(() => {
    const fetchPatientDetails = async () => {
      if (!selectedId) {
        setSelectedPatient(null);
        return;
      }

      try {
        setDetailsLoading(true);

        const patientFromList = patients.find(
          (patient) =>
            String(patient._id || patient.id) ===
            String(selectedId)
        );

        if (!patientFromList) {
          setSelectedPatient(null);
          return;
        }

        let patientData = {
          ...patientFromList,
          appointments:
            patientFromList.appointments || [],
          prescriptions:
            patientFromList.prescriptions || [],
        };

        // =================================================
        // FETCH PRESCRIPTIONS FOR THIS PATIENT
        // =================================================

        try {
          const prescriptionRes = await axios.get(
            `${API_URL}/prescription/patient/${selectedId}`
          );

          const prescriptions =
            prescriptionRes.data?.prescriptions || [];

          patientData.prescriptions = prescriptions;
        } catch (prescriptionError) {
          console.warn(
            "Could not fetch prescriptions:",
            prescriptionError
          );

          patientData.prescriptions =
            patientFromList.prescriptions || [];
        }

        setSelectedPatient(patientData);
      } catch (err) {
        console.error(
          "Error loading patient details:",
          err
        );

        setError("Failed to load patient details.");
      } finally {
        setDetailsLoading(false);
      }
    };

    fetchPatientDetails();
  }, [selectedId, patients]);

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {
    if (!date) return "N/A";

    const d = new Date(date);

    if (isNaN(d.getTime())) {
      return date;
    }

    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // =====================================================
  // GET PATIENT ID
  // =====================================================

  const getPatientId = (patient) => {
    return patient._id || patient.id;
  };

  // =====================================================
  // PRESCRIPTION FILE URL
  // =====================================================

  const getFileUrl = (file) => {
    if (!file) return "#";

    if (
      file.startsWith("http://") ||
      file.startsWith("https://")
    ) {
      return file;
    }

    return `${SERVER_URL}/uploads/${file}`;
  };

  // =====================================================
  // PROFILE IMAGE
  // =====================================================

  const getProfileImage = (patient) => {
    if (!patient?.profileImage) {
      return null;
    }

    if (
      patient.profileImage.startsWith("data:") ||
      patient.profileImage.startsWith("http")
    ) {
      return patient.profileImage;
    }

    return `${SERVER_URL}/${patient.profileImage}`;
  };

  // =====================================================
  // INITIAL
  // =====================================================

  const getInitial = (patient) => {
    return (
      patient?.name ||
      patient?.fullName ||
      "P"
    )
      .charAt(0)
      .toUpperCase();
  };

  return (
    <>
      <DoctorNavbar />

      <div className="container py-5 patient-viewer">

        {/* =================================================
            PAGE TITLE
        ================================================= */}

        <div className="mb-4">
          <h3 className="text-success mb-1">
            Patient Dashboard
          </h3>

          <p className="text-muted mb-0">
            View patients who have appointments with you.
          </p>
        </div>

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}

        <div className="row">

          {/* =================================================
              LEFT SIDEBAR
          ================================================= */}

          <div className="col-md-3 mb-4">

            <div className="card shadow-sm border-0">

              <div className="card-header bg-success text-white">
                <strong>
                  My Patients
                </strong>
              </div>

              <div className="list-group list-group-flush">

                {loading ? (

                  <div className="text-center py-4">

                    <div
                      className="spinner-border text-success"
                      role="status"
                    ></div>

                    <p className="text-muted mt-2 mb-0">
                      Loading patients...
                    </p>

                  </div>

                ) : patients.length === 0 ? (

                  <div className="text-center p-4">

                    <p className="text-muted mb-0">
                      No patients available.
                    </p>

                  </div>

                ) : (

                  patients.map((patient) => {

                    const patientId =
                      getPatientId(patient);

                    const image =
                      getProfileImage(patient);

                    return (
                      <button
                        key={patientId}
                        type="button"
                        className={`list-group-item list-group-item-action ${
                          String(selectedId) ===
                          String(patientId)
                            ? "active"
                            : ""
                        }`}
                        onClick={() =>
                          setSelectedId(patientId)
                        }
                      >

                        <div className="d-flex align-items-center">

                          {image ? (

                            <img
                              src={image}
                              alt={
                                patient.fullName ||
                                patient.name
                              }
                              className="rounded-circle me-2"
                              width="42"
                              height="42"
                              style={{
                                objectFit: "cover",
                              }}
                            />

                          ) : (

                            <div
                              className="rounded-circle bg-light text-success d-flex align-items-center justify-content-center me-2"
                              style={{
                                width: "42px",
                                height: "42px",
                                fontWeight: "bold",
                              }}
                            >
                              {getInitial(patient)}
                            </div>

                          )}

                          <div className="text-start">

                            <div className="fw-semibold">
                              {patient.name ||
                                patient.fullName ||
                                "Unknown Patient"}
                            </div>

                            <small
                              className={
                                String(selectedId) ===
                                String(patientId)
                                  ? "text-white-50"
                                  : "text-muted"
                              }
                            >
                              {patient.email ||
                                "No email"}
                            </small>

                          </div>

                        </div>

                      </button>
                    );
                  })

                )}

              </div>

            </div>

          </div>

          {/* =================================================
              RIGHT SIDE - PATIENT DETAILS
          ================================================= */}

          <div className="col-md-9">

            {detailsLoading ? (

              <div className="card shadow-sm border-0 p-5 text-center">

                <div
                  className="spinner-border text-success"
                  role="status"
                ></div>

                <p className="text-muted mt-3 mb-0">
                  Loading patient details...
                </p>

              </div>

            ) : selectedPatient ? (

              <div className="card shadow-sm border-0 p-4">

                {/* =================================================
                    PATIENT PROFILE HEADER
                ================================================= */}

                <div className="d-flex align-items-center mb-4">

                  {getProfileImage(selectedPatient) ? (

                    <img
                      src={getProfileImage(selectedPatient)}
                      alt={
                        selectedPatient.name ||
                        selectedPatient.fullName
                      }
                      className="rounded-circle me-3"
                      width="100"
                      height="100"
                      style={{
                        objectFit: "cover",
                        border: "4px solid #e8f5e9",
                      }}
                    />

                  ) : (

                    <div
                      className="rounded-circle bg-success text-white d-flex align-items-center justify-content-center me-3"
                      style={{
                        width: "100px",
                        height: "100px",
                        fontSize: "36px",
                        fontWeight: "bold",
                      }}
                    >
                      {getInitial(selectedPatient)}
                    </div>

                  )}

                  <div>

                    <h4 className="text-success mb-1">
                      {selectedPatient.name ||
                        selectedPatient.fullName ||
                        "Unknown Patient"}
                    </h4>

                    <p className="text-muted mb-1">
                      Patient ID:{" "}
                      {selectedPatient._id ||
                        selectedPatient.id}
                    </p>

                    <span className="badge bg-success">
                      Patient
                    </span>

                  </div>

                </div>

                <hr />

                {/* =================================================
                    PERSONAL INFORMATION
                ================================================= */}

                <h5 className="mb-3">
                  Personal Information
                </h5>

                <div className="row g-3">

                  <div className="col-md-6">
                    <div className="border rounded p-3 h-100">
                      <small className="text-muted">
                        Full Name
                      </small>

                      <div className="fw-semibold">
                        {selectedPatient.fullName ||
                          selectedPatient.name ||
                          "N/A"}
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="border rounded p-3 h-100">
                      <small className="text-muted">
                        Email
                      </small>

                      <div className="fw-semibold">
                        {selectedPatient.email ||
                          "N/A"}
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="border rounded p-3 h-100">
                      <small className="text-muted">
                        Phone
                      </small>

                      <div className="fw-semibold">
                        {selectedPatient.phone ||
                          "N/A"}
                      </div>
                    </div>
                  </div>

                  <div className="col-md-3">
                    <div className="border rounded p-3 h-100">
                      <small className="text-muted">
                        Age
                      </small>

                      <div className="fw-semibold">
                        {selectedPatient.age ??
                          "N/A"}
                      </div>
                    </div>
                  </div>

                  <div className="col-md-3">
                    <div className="border rounded p-3 h-100">
                      <small className="text-muted">
                        Gender
                      </small>

                      <div className="fw-semibold">
                        {selectedPatient.gender ||
                          "N/A"}
                      </div>
                    </div>
                  </div>

                </div>

                {/* =================================================
                    HEALTH INFORMATION
                ================================================= */}

                <hr className="my-4" />

                <h5 className="mb-3">
                  Health Information
                </h5>

                <div className="row g-3">

                  <div className="col-md-4">
                    <div className="border rounded p-3 h-100">
                      <small className="text-muted">
                        Blood Group
                      </small>

                      <div className="fw-semibold">
                        {selectedPatient.bloodGroup ||
                          "N/A"}
                      </div>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="border rounded p-3 h-100">
                      <small className="text-muted">
                        Height
                      </small>

                      <div className="fw-semibold">
                        {selectedPatient.height
                          ? `${selectedPatient.height} cm`
                          : "N/A"}
                      </div>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="border rounded p-3 h-100">
                      <small className="text-muted">
                        Weight
                      </small>

                      <div className="fw-semibold">
                        {selectedPatient.weight
                          ? `${selectedPatient.weight} kg`
                          : "N/A"}
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="border rounded p-3 h-100">
                      <small className="text-muted">
                        Symptoms
                      </small>

                      <div className="fw-semibold">
                        {selectedPatient.symptoms ||
                          "No symptoms recorded"}
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="border rounded p-3 h-100">
                      <small className="text-muted">
                        Medications
                      </small>

                      <div className="fw-semibold">
                        {selectedPatient.medications ||
                          "No medications recorded"}
                      </div>
                    </div>
                  </div>

                  <div className="col-md-12">
                    <div className="border rounded p-3 h-100">
                      <small className="text-muted">
                        Diet
                      </small>

                      <div className="fw-semibold">
                        {selectedPatient.diet ||
                          "No diet information recorded"}
                      </div>
                    </div>
                  </div>

                </div>

                {/* =================================================
                    WELLNESS TIPS
                ================================================= */}

                {selectedPatient.wellnessTips && (
                  <>
                    <hr className="my-4" />

                    <h5 className="mb-3">
                      Wellness Information
                    </h5>

                    <div className="alert alert-success">
                      {selectedPatient.wellnessTips}
                    </div>
                  </>
                )}

                {/* =================================================
                    APPOINTMENTS
                ================================================= */}

                <hr className="my-4" />

                <div className="d-flex justify-content-between align-items-center mb-3">

                  <h5 className="mb-0">
                    Appointments
                  </h5>

                  <span className="badge bg-primary">
                    {
                      selectedPatient.appointments
                        ?.length || 0
                    }
                  </span>

                </div>

                {selectedPatient.appointments &&
                selectedPatient.appointments.length > 0 ? (

                  <div className="table-responsive">

                    <table className="table table-bordered align-middle">

                      <thead className="table-light">

                        <tr>
                          <th>#</th>
                          <th>Date</th>
                          <th>Time</th>
                          <th>Reason</th>
                          <th>Status</th>
                        </tr>

                      </thead>

                      <tbody>

                        {selectedPatient.appointments.map(
                          (appt, index) => (

                            <tr
                              key={
                                appt._id || index
                              }
                            >

                              <td>
                                {index + 1}
                              </td>

                              <td>
                                {formatDate(
                                  appt.date
                                )}
                              </td>

                              <td>
                                {appt.time ||
                                  "N/A"}
                              </td>

                              <td>
                                {appt.reason ||
                                  "General Consultation"}
                              </td>

                              <td>

                                <span
                                  className={`badge ${
                                    appt.status ===
                                    "accepted"
                                      ? "bg-success"
                                      : appt.status ===
                                        "rejected"
                                      ? "bg-danger"
                                      : appt.status ===
                                        "completed"
                                      ? "bg-primary"
                                      : "bg-warning text-dark"
                                  }`}
                                >
                                  {appt.status ||
                                    "pending"}
                                </span>

                              </td>

                            </tr>

                          )
                        )}

                      </tbody>

                    </table>

                  </div>

                ) : (

                  <div className="alert alert-light border">
                    No appointments found for this patient.
                  </div>

                )}

                {/* =================================================
                    PRESCRIPTIONS / MEDICAL RECORDS
                ================================================= */}

                <hr className="my-4" />

                <div className="d-flex justify-content-between align-items-center mb-3">

                  <h5 className="mb-0">
                    Prescriptions & Medical Records
                  </h5>

                  <span className="badge bg-success">
                    {
                      selectedPatient.prescriptions
                        ?.length || 0
                    }
                  </span>

                </div>

                {selectedPatient.prescriptions &&
                selectedPatient.prescriptions.length > 0 ? (

                  <div className="table-responsive">

                    <table className="table table-bordered align-middle">

                      <thead className="table-light">

                        <tr>
                          <th>#</th>
                          <th>Date</th>
                          <th>Prescription</th>
                          <th>File</th>
                        </tr>

                      </thead>

                      <tbody>

                        {selectedPatient.prescriptions.map(
                          (prescription, index) => (

                            <tr
                              key={
                                prescription._id ||
                                index
                              }
                            >

                              <td>
                                {index + 1}
                              </td>

                              <td>
                                {formatDate(
                                  prescription.date ||
                                  prescription.createdAt
                                )}
                              </td>

                              <td>
                                {prescription.text ||
                                  "No text prescription"}
                              </td>

                              <td>

                                {prescription.file ? (

                                  <a
                                    href={getFileUrl(
                                      prescription.file
                                    )}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="btn btn-sm btn-outline-success"
                                  >
                                    View File
                                  </a>

                                ) : (

                                  <span className="text-muted">
                                    No file
                                  </span>

                                )}

                              </td>

                            </tr>

                          )
                        )}

                      </tbody>

                    </table>

                  </div>

                ) : (

                  <div className="alert alert-light border">
                    No prescriptions or medical records found.
                  </div>

                )}

              </div>

            ) : (

              <div className="card shadow-sm border-0 p-5 text-center">

                <h5 className="text-muted">
                  No patient selected
                </h5>

                <p className="text-muted mb-0">
                  Select a patient from the list to view
                  their details.
                </p>

              </div>

            )}

          </div>

        </div>

      </div>

      <DoctorFooter />
    </>
  );
};

export default PatientViewer;