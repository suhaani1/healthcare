import React, { useEffect, useState } from "react";
import Navbar from "./navbar";
import Footer from "../footer/footer";
import api from "../../api";
import "../patientStyle/consultation.css";

const Consultation = () => {
  const patientId = localStorage.getItem("patientId");

  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);

  const [loading, setLoading] = useState(true);
  const [prescriptionLoading, setPrescriptionLoading] =
    useState(true);

  const [error, setError] = useState("");

  /* =====================================================
     FETCH CONSULTATIONS
  ===================================================== */

  useEffect(() => {
    const fetchConsultations = async () => {
      try {
        if (!patientId) {
          setError("Patient ID not found. Please login again.");
          return;
        }

        const response = await api.get(
          `/appointment/patient/${patientId}`
        );

        console.log(
          "Patient appointments:",
          response.data
        );

        const list = Array.isArray(response.data)
          ? response.data
          : response.data?.appointments || [];

        const consultationList = list.filter(
          (appointment) =>
            appointment.status === "accepted" ||
            appointment.status === "completed"
        );

        setAppointments(consultationList);
      } catch (error) {
        console.error(
          "Consultation error:",
          error.response?.data || error.message
        );

        setError(
          error.response?.data?.message ||
            "Failed to load consultations."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchConsultations();
  }, [patientId]);

  /* =====================================================
     FETCH PRESCRIPTIONS
  ===================================================== */

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        if (!patientId) {
          return;
        }

        const response = await api.get(
          `/prescriptions/patient/${patientId}`
        );

        console.log(
          "PATIENT PRESCRIPTIONS:",
          response.data
        );

        const list = Array.isArray(response.data)
          ? response.data
          : response.data?.prescriptions || [];

        setPrescriptions(list);
      } catch (error) {
        console.error(
          "Prescription fetch error:",
          error.response?.data || error.message
        );
      } finally {
        setPrescriptionLoading(false);
      }
    };

    fetchPrescriptions();
  }, [patientId]);

  /* =====================================================
     FORMAT DATE
  ===================================================== */

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  /* =====================================================
     DOCTOR NAME
  ===================================================== */

  const getDoctorName = (appointment) => {
    if (
      appointment.doctorId &&
      typeof appointment.doctorId === "object"
    ) {
      return (
        appointment.doctorId.fullName ||
        "Doctor"
      );
    }

    return (
      appointment.doctorName ||
      "Doctor"
    );
  };

  /* =====================================================
     DOCTOR SPECIALIZATION
  ===================================================== */

  const getSpecialization = (appointment) => {
    if (
      appointment.doctorId &&
      typeof appointment.doctorId === "object"
    ) {
      return (
        appointment.doctorId.specialization ||
        "Medical Specialist"
      );
    }

    return (
      appointment.specialization ||
      "Medical Specialist"
    );
  };

  /* =====================================================
     DOCTOR ID
  ===================================================== */

  const getDoctorId = (appointment) => {
    if (!appointment.doctorId) {
      return null;
    }

    if (
      typeof appointment.doctorId === "object"
    ) {
      return appointment.doctorId._id;
    }

    return appointment.doctorId;
  };

  /* =====================================================
     DOCTOR PHOTO
  ===================================================== */

  const getDoctorPhoto = (appointment) => {
    let photo = "";

    if (
      appointment.doctorId &&
      typeof appointment.doctorId === "object"
    ) {
      photo =
        appointment.doctorId.profilePhoto || "";
    }

    if (!photo) {
      photo =
        appointment.doctorPhoto || "";
    }

    if (!photo) {
      return "";
    }

    if (photo.startsWith("http")) {
      return photo;
    }

    return `http://localhost:3010${
      photo.startsWith("/")
        ? photo
        : `/${photo}`
    }`;
  };

  /* =====================================================
     GET PRESCRIPTION FILE URL
  ===================================================== */

  const getFileUrl = (prescription) => {
    if (!prescription?.fileUrl) {
      return "";
    }

    if (
      prescription.fileUrl.startsWith("http")
    ) {
      return prescription.fileUrl;
    }

    return `http://localhost:3010${
      prescription.fileUrl.startsWith("/")
        ? prescription.fileUrl
        : `/${prescription.fileUrl}`
    }`;
  };

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <>
        <Navbar />

        <main className="consultation-page">
          <div className="consultation-loading">
            <div className="consultation-spinner"></div>

            <p>
              Loading consultations...
            </p>
          </div>
        </main>

        <Footer />
      </>
    );
  }

  /* =====================================================
     PAGE
  ===================================================== */

  return (
    <>
      <Navbar />

      <main className="consultation-page">

        {/* HEADER */}

        <div className="consultation-header">

          <div>
            <h1>
              My Consultations
            </h1>

            <p>
              View your consultations and
              prescriptions from your doctors.
            </p>
          </div>

          <div className="consultation-count">
            <strong>
              {appointments.length}
            </strong>

            <span>
              Consultation
              {appointments.length !== 1
                ? "s"
                : ""}
            </span>
          </div>

        </div>

        {/* ERROR */}

        {error && (
          <div className="consultation-error">
            {error}
          </div>
        )}

        {/* EMPTY CONSULTATION */}

        {appointments.length === 0 ? (
          <div className="consultation-empty">

            <div className="consultation-empty-icon">
              C
            </div>

            <h2>
              No consultations yet
            </h2>

            <p>
              Your consultation will appear
              here after a doctor accepts
              your appointment.
            </p>

          </div>
        ) : (
          <div className="consultation-list">

            {appointments.map(
              (appointment) => {

                const doctorId =
                  getDoctorId(
                    appointment
                  );

                const doctorPhoto =
                  getDoctorPhoto(
                    appointment
                  );

                /*
                 * Find prescription for this doctor.
                 * If only one prescription exists,
                 * display it as well.
                 */

                let doctorPrescription =
                  prescriptions.find(
                    (prescription) => {

                      const prescriptionDoctor =
                        prescription.doctorId;

                      if (
                        !prescriptionDoctor
                      ) {
                        return false;
                      }

                      if (
                        typeof prescriptionDoctor ===
                        "object"
                      ) {
                        return (
                          prescriptionDoctor._id ===
                          doctorId
                        );
                      }

                      return (
                        prescriptionDoctor ===
                        doctorId
                      );
                    }
                  );

                if (
                  !doctorPrescription &&
                  prescriptions.length === 1
                ) {
                  doctorPrescription =
                    prescriptions[0];
                }

                return (
                  <div
                    className="consultation-card"
                    key={appointment._id}
                  >

                    {/* DOCTOR */}

                    <div className="consultation-card-header">

                      <div className="consultation-doctor">

                        <div className="consultation-doctor-avatar">

                          {doctorPhoto ? (
                            <img
                              src={doctorPhoto}
                              alt={getDoctorName(
                                appointment
                              )}
                            />
                          ) : (
                            getDoctorName(
                              appointment
                            )
                              .charAt(0)
                              .toUpperCase()
                          )}

                        </div>

                        <div>
                          <h2>
                            {getDoctorName(
                              appointment
                            )}
                          </h2>

                          <p>
                            {getSpecialization(
                              appointment
                            )}
                          </p>
                        </div>

                      </div>

                      <span
                        className={`consultation-status ${
                          appointment.status ===
                          "completed"
                            ? "status-completed"
                            : "status-accepted"
                        }`}
                      >
                        {appointment.status}
                      </span>

                    </div>

                    {/* DETAILS */}

                    <div className="consultation-details">

                      <div className="consultation-detail">
                        <span>
                          Date
                        </span>

                        <strong>
                          {formatDate(
                            appointment.date
                          )}
                        </strong>
                      </div>

                      <div className="consultation-detail">
                        <span>
                          Time
                        </span>

                        <strong>
                          {appointment.time ||
                            "N/A"}
                        </strong>
                      </div>

                      <div className="consultation-detail">
                        <span>
                          Reason
                        </span>

                        <strong>
                          {appointment.reason ||
                            "General Consultation"}
                        </strong>
                      </div>

                    </div>

                    {/* PRESCRIPTION */}

                    <div className="consultation-prescription">

                      <div className="prescription-icon">
                        RX
                      </div>

                      <div className="prescription-content">

                        <h3>
                          Prescription
                        </h3>

                        {prescriptionLoading ? (
                          <p>
                            Loading prescription...
                          </p>
                        ) : doctorPrescription ? (
                          <>

                            {doctorPrescription.text && (
                              <div className="prescription-text">
                                {doctorPrescription.text}
                              </div>
                            )}

                            {doctorPrescription.fileUrl && (
                              <div className="prescription-file">

                                <span>
                                  {doctorPrescription.fileName ||
                                    "Prescription document"}
                                </span>

                                <a
                                  href={getFileUrl(
                                    doctorPrescription
                                  )}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="prescription-view-btn"
                                >
                                  View Prescription
                                </a>

                              </div>
                            )}

                            {!doctorPrescription.text &&
                              !doctorPrescription.fileUrl && (
                                <p>
                                  Prescription is
                                  available but
                                  contains no
                                  document or text.
                                </p>
                              )}

                          </>
                        ) : (
                          <p>
                            Your doctor has not
                            provided a prescription
                            yet.
                          </p>
                        )}

                      </div>

                    </div>

                  </div>
                );
              }
            )}

          </div>
        )}

      </main>

      <Footer />
    </>
  );
};

export default Consultation;