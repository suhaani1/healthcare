import React, { useEffect, useState } from "react";
import api from "../../api";
import Navbar from "./nav";
import Footer from "./footer";
import "./Prescription.css";

const SERVER_URL = "http://localhost:3010";

const Prescription = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedPrescription, setSelectedPrescription] =
    useState(null);

  const patientId = localStorage.getItem("patientId");

  // =========================================================
  // FETCH PRESCRIPTIONS
  // =========================================================

  useEffect(() => {
    const fetchPrescriptions = async () => {
      if (!patientId) {
        setError(
          "Patient information not found. Please login again."
        );
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          `/prescription/patient/${patientId}`
        );

        console.log(
          "Prescription response:",
          response.data
        );

        const data = Array.isArray(response.data)
          ? response.data
          : response.data?.prescriptions || [];

        setPrescriptions(data);
      } catch (err) {
        console.error(
          "Error fetching prescriptions:",
          err.response?.data || err.message
        );

        setError(
          err.response?.data?.message ||
            "Unable to load prescriptions."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPrescriptions();
  }, [patientId]);

  // =========================================================
  // FORMAT DATE
  // =========================================================

  const formatDate = (date) => {
    if (!date) return "N/A";

    const formatted = new Date(date);

    if (Number.isNaN(formatted.getTime())) {
      return "N/A";
    }

    return formatted.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // =========================================================
  // FORMAT TIME
  // =========================================================

  const formatTime = (date) => {
    if (!date) return "";

    const formatted = new Date(date);

    if (Number.isNaN(formatted.getTime())) {
      return "";
    }

    return formatted.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // =========================================================
  // GET DOCTOR NAME
  // =========================================================

  const getDoctorName = (prescription) => {
    if (
      prescription?.doctorId &&
      typeof prescription.doctorId === "object"
    ) {
      return (
        prescription.doctorId.fullName ||
        prescription.doctorId.name ||
        "Doctor"
      );
    }

    return (
      prescription?.doctorName ||
      prescription?.doctor?.fullName ||
      prescription?.doctor?.name ||
      "Doctor"
    );
  };

  // =========================================================
  // GET SPECIALIZATION
  // =========================================================

  const getSpecialization = (prescription) => {
    if (
      prescription?.doctorId &&
      typeof prescription.doctorId === "object"
    ) {
      return (
        prescription.doctorId.specialization ||
        "Medical Specialist"
      );
    }

    return (
      prescription?.specialization ||
      prescription?.doctor?.specialization ||
      "Medical Specialist"
    );
  };

  // =========================================================
  // GET FILE URL
  // =========================================================

  const getFileUrl = (file) => {
    if (!file) return null;

    if (
      typeof file === "string" &&
      (file.startsWith("http://") ||
        file.startsWith("https://"))
    ) {
      return file;
    }

    if (
      typeof file === "string" &&
      file.startsWith("/")
    ) {
      return `${SERVER_URL}${file}`;
    }

    return `${SERVER_URL}/${file}`;
  };

  // =========================================================
  // GET FILE FROM PRESCRIPTION
  // =========================================================

  const getPrescriptionFile = (prescription) => {
    return (
      prescription?.fileUrl ||
      prescription?.file ||
      prescription?.filePath ||
      prescription?.document ||
      null
    );
  };

  // =========================================================
  // GET FILE NAME
  // =========================================================

  const getFileName = (prescription) => {
    const file =
      getPrescriptionFile(prescription);

    if (!file) return "Prescription document";

    if (prescription?.fileName) {
      return prescription.fileName;
    }

    const cleanPath = file.split("?")[0];

    return (
      cleanPath.split("/").pop() ||
      "Prescription document"
    );
  };

  // =========================================================
  // CHECK PDF
  // =========================================================

  const isPdf = (prescription) => {
    const file =
      getPrescriptionFile(prescription);

    if (!file) return false;

    const fileName =
      prescription?.fileName || file;

    return fileName
      .toLowerCase()
      .endsWith(".pdf");
  };

  // =========================================================
  // CHECK IMAGE
  // =========================================================

  const isImage = (prescription) => {
    const file =
      getPrescriptionFile(prescription);

    if (!file) return false;

    const fileName =
      prescription?.fileName || file;

    return /\.(jpg|jpeg|png|webp)$/i.test(
      fileName
    );
  };

  // =========================================================
  // OPEN PRESCRIPTION
  // =========================================================

  const openPrescription = (prescription) => {
    setSelectedPrescription(prescription);
  };

  // =========================================================
  // CLOSE PRESCRIPTION
  // =========================================================

  const closePrescription = () => {
    setSelectedPrescription(null);
  };

  // =========================================================
  // DOWNLOAD
  // =========================================================

  const handleDownload = (prescription) => {
    const file =
      getPrescriptionFile(prescription);

    if (!file) {
      alert(
        "No prescription file is available."
      );
      return;
    }

    const url = getFileUrl(file);

    const link = document.createElement("a");

    link.href = url;
    link.download = getFileName(
      prescription
    );

    link.target = "_blank";
    link.rel = "noopener noreferrer";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <Navbar />

      <main className="patient-prescription-page">

        {/* =====================================================
            PAGE HEADER
        ===================================================== */}

        <section className="prescription-page-header">

          <div>
            <h1>My Prescriptions</h1>

            <p>
              View prescriptions and treatment
              instructions provided by your doctors.
            </p>
          </div>

          <div className="prescription-count">

            <span>
              {prescriptions.length}
            </span>

            <small>
              Prescription
              {prescriptions.length !== 1
                ? "s"
                : ""}
            </small>

          </div>

        </section>


        {/* =====================================================
            ERROR
        ===================================================== */}

        {error && (
          <div className="prescription-error">
            {error}
          </div>
        )}


        {/* =====================================================
            LOADING
        ===================================================== */}

        {loading ? (

          <div className="prescription-loading">

            <div className="prescription-spinner"></div>

            <p>
              Loading prescriptions...
            </p>

          </div>

        ) : prescriptions.length === 0 ? (

          /* ===================================================
             EMPTY STATE
          =================================================== */

          <div className="prescription-empty">

            <div className="prescription-empty-icon">
              Rx
            </div>

            <h2>
              No Prescriptions Yet
            </h2>

            <p>
              Prescriptions provided by your
              doctors will appear here.
            </p>

          </div>

        ) : (

          /* ===================================================
             PRESCRIPTION LIST
          =================================================== */

          <section className="prescription-list">

            {prescriptions.map(
              (prescription, index) => {

                const file =
                  getPrescriptionFile(
                    prescription
                  );

                const doctorName =
                  getDoctorName(
                    prescription
                  );

                const doctorSpecialization =
                  getSpecialization(
                    prescription
                  );

                return (
                  <article
                    className="prescription-card"
                    key={
                      prescription._id ||
                      index
                    }
                  >

                    {/* CARD HEADER */}

                    <div className="prescription-card-header">

                      <div className="doctor-prescription-info">

                        <div className="doctor-prescription-avatar">
                          {doctorName
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <div>

                          <h2>
                            {doctorName}
                          </h2>

                          <p>
                            {
                              doctorSpecialization
                            }
                          </p>

                        </div>

                      </div>

                      <div className="prescription-date">

                        <span>
                          Date
                        </span>

                        <strong>
                          {formatDate(
                            prescription.createdAt ||
                              prescription.date
                          )}
                        </strong>

                        {formatTime(
                          prescription.createdAt ||
                            prescription.date
                        ) && (
                          <small>
                            {formatTime(
                              prescription.createdAt ||
                                prescription.date
                            )}
                          </small>
                        )}

                      </div>

                    </div>


                    {/* PRESCRIPTION TEXT */}

                    {prescription.text &&
                      prescription.text.trim() && (

                        <div className="prescription-text-section">

                          <div className="prescription-section-title">
                            Prescription Instructions
                          </div>

                          <div className="prescription-text">

                            {prescription.text
                              .split("\n")
                              .map(
                                (line, lineIndex) => (
                                  <p
                                    key={
                                      lineIndex
                                    }
                                  >
                                    {line ||
                                      "\u00A0"}
                                  </p>
                                )
                              )}

                          </div>

                        </div>

                      )}


                    {/* FILE */}

                    {file && (

                      <div className="prescription-file-section">

                        <div className="prescription-file-icon">

                          {isPdf(
                            prescription
                          )
                            ? "PDF"
                            : isImage(
                                prescription
                              )
                            ? "IMG"
                            : "DOC"}

                        </div>

                        <div className="prescription-file-details">

                          <strong>
                            {getFileName(
                              prescription
                            )}
                          </strong>

                          <span>
                            Prescription document
                          </span>

                        </div>

                        <div className="prescription-file-actions">

                          <button
                            type="button"
                            className="prescription-view-btn"
                            onClick={() =>
                              openPrescription(
                                prescription
                              )
                            }
                          >
                            View
                          </button>

                          <button
                            type="button"
                            className="prescription-download-btn"
                            onClick={() =>
                              handleDownload(
                                prescription
                              )
                            }
                          >
                            Download
                          </button>

                        </div>

                      </div>

                    )}


                    {/* FOOTER */}

                    <div className="prescription-card-footer">

                      <span>
                        Prescription #{index + 1}
                      </span>

                      {file && (
                        <button
                          type="button"
                          className="prescription-open-btn"
                          onClick={() =>
                            openPrescription(
                              prescription
                            )
                          }
                        >
                          View Prescription
                        </button>
                      )}

                    </div>

                  </article>
                );
              }
            )}

          </section>

        )}

      </main>


      {/* =========================================================
          PRESCRIPTION VIEW MODAL
      ========================================================= */}

      {selectedPrescription && (
        <div
          className="prescription-view-overlay"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              closePrescription();
            }
          }}
        >

          <div className="prescription-view-modal">

            {/* MODAL HEADER */}

            <div className="prescription-view-header">

              <div>

                <h2>
                  Prescription
                </h2>

                <p>
                  {getDoctorName(
                    selectedPrescription
                  )}
                </p>

              </div>

              <button
                type="button"
                className="prescription-close-btn"
                onClick={
                  closePrescription
                }
              >
                ×
              </button>

            </div>


            {/* MODAL CONTENT */}

            <div className="prescription-view-content">

              {/* TEXT */}

              {selectedPrescription.text &&
                selectedPrescription.text.trim() && (

                  <div className="prescription-modal-text">

                    <h3>
                      Prescription Instructions
                    </h3>

                    <div>
                      {selectedPrescription.text
                        .split("\n")
                        .map(
                          (line, index) => (
                            <p
                              key={index}
                            >
                              {line ||
                                "\u00A0"}
                            </p>
                          )
                        )}
                    </div>

                  </div>

                )}


              {/* FILE */}

              {getPrescriptionFile(
                selectedPrescription
              ) && (

                <div className="prescription-document-preview">

                  <h3>
                    Prescription Document
                  </h3>

                  {isPdf(
                    selectedPrescription
                  ) ? (

                    <iframe
                      src={getFileUrl(
                        getPrescriptionFile(
                          selectedPrescription
                        )
                      )}
                      title="Prescription PDF"
                      className="prescription-pdf-preview"
                    />

                  ) : isImage(
                      selectedPrescription
                    ) ? (

                    <div className="prescription-image-preview">

                      <img
                        src={getFileUrl(
                          getPrescriptionFile(
                            selectedPrescription
                          )
                        )}
                        alt="Prescription"
                      />

                    </div>

                  ) : (

                    <div className="prescription-other-file">

                      <div className="prescription-large-file-icon">
                        DOC
                      </div>

                      <p>
                        This document cannot be
                        previewed here.
                      </p>

                      <button
                        type="button"
                        className="prescription-download-btn"
                        onClick={() =>
                          handleDownload(
                            selectedPrescription
                          )
                        }
                      >
                        Download Document
                      </button>

                    </div>

                  )}

                </div>

              )}

            </div>


            {/* MODAL FOOTER */}

            <div className="prescription-view-footer">

              {getPrescriptionFile(
                selectedPrescription
              ) && (

                <button
                  type="button"
                  className="prescription-download-btn"
                  onClick={() =>
                    handleDownload(
                      selectedPrescription
                    )
                  }
                >
                  Download
                </button>

              )}

              <button
                type="button"
                className="prescription-close-action"
                onClick={
                  closePrescription
                }
              >
                Close
              </button>

            </div>

          </div>

        </div>
      )}

      <Footer />
    </>
  );
};

export default Prescription;