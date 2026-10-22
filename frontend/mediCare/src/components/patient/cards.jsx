import React, { useEffect, useState } from "react";
import PatientNavbar from "./navbar";
import Footer from "../footer/footer";
import api from "../../api";
import "../patientStyle/cards.css";

const HealthCards = () => {
  const [cards, setCards] = useState([]);

  const [selectedFile, setSelectedFile] = useState(null);
  const [cardType, setCardType] = useState("");

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const patientId = localStorage.getItem("patientId");

  // =====================================================
  // FETCH MEDICAL RECORDS
  // =====================================================

  const fetchCards = async () => {
    if (!patientId) {
      setError("Patient information not found. Please login again.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        `/medical-record/patient/${patientId}`
      );

      if (response.data.success) {
        setCards(response.data.records || []);
      } else {
        setError(
          response.data.message || "Failed to load medical records."
        );
      }
    } catch (err) {
      console.error("Fetch medical records error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load your medical records."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOAD RECORDS WHEN PAGE OPENS
  // =====================================================

  useEffect(() => {
    fetchCards();
  }, []);

  // =====================================================
  // FILE CHANGE
  // =====================================================

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];

    setError("");
    setSuccess("");

    if (!file) {
      setSelectedFile(null);
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/jpg",
      "image/webp",
      "application/pdf",
    ];

    const maxSize = 10 * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
      setError(
        "Only JPG, PNG, WEBP images and PDF files are allowed."
      );

      e.target.value = "";
      setSelectedFile(null);
      return;
    }

    if (file.size > maxSize) {
      setError("File size cannot exceed 10 MB.");

      e.target.value = "";
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  };

  // =====================================================
  // UPLOAD
  // =====================================================

  const handleUpload = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!patientId) {
      setError("Patient information not found. Please login again.");
      return;
    }

    if (!cardType) {
      setError("Please select a card type.");
      return;
    }

    if (!selectedFile) {
      setError("Please select a file.");
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();

      formData.append("patientId", patientId);
      formData.append("cardType", cardType);
      formData.append("file", selectedFile);

      const response = await api.post(
        "/medical-record/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        setSuccess("Medical record uploaded successfully.");

        setCardType("");
        setSelectedFile(null);

        // Reset file input
        const fileInput = document.getElementById(
          "medicalRecordFile"
        );

        if (fileInput) {
          fileInput.value = "";
        }

        // Refresh records from database
        await fetchCards();
      } else {
        setError(
          response.data.message ||
            "Failed to upload medical record."
        );
      }
    } catch (err) {
      console.error("Upload medical record error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to upload medical record."
      );
    } finally {
      setUploading(false);
    }
  };

  // =====================================================
  // DELETE
  // =====================================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this medical record?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);
      setError("");
      setSuccess("");

      const response = await api.delete(
        `/medical-record/${id}`
      );

      if (response.data.success) {
        setCards((prevCards) =>
          prevCards.filter((card) => card._id !== id)
        );

        setSuccess("Medical record deleted successfully.");
      } else {
        setError(
          response.data.message ||
            "Failed to delete medical record."
        );
      }
    } catch (err) {
      console.error("Delete medical record error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to delete medical record."
      );
    } finally {
      setDeletingId(null);
    }
  };

  // =====================================================
  // OPEN FILE
  // =====================================================

  const handleView = (url) => {
    if (!url) {
      return;
    }

    window.open(url, "_blank", "noopener,noreferrer");
  };

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {
    if (!date) {
      return "N/A";
    }

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // =====================================================
  // FORMAT FILE SIZE
  // =====================================================

  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) {
      return "0 KB";
    }

    const mb = bytes / (1024 * 1024);

    if (mb >= 1) {
      return `${mb.toFixed(2)} MB`;
    }

    return `${(bytes / 1024).toFixed(1)} KB`;
  };

  // =====================================================
  // CHECK PDF
  // =====================================================

  const isPdf = (fileType) => {
    return fileType === "application/pdf";
  };

  // =====================================================
  // RENDER FILE PREVIEW
  // =====================================================

  const renderPreview = (card) => {
    if (isPdf(card.fileType)) {
      return (
        <div className="medical-file-preview pdf-preview">
          <div className="pdf-icon">
            <i className="fas fa-file-pdf"></i>
          </div>

          <span>PDF DOCUMENT</span>
        </div>
      );
    }

    return (
      <div className="medical-file-preview">
        <img
          src={card.fileUrl}
          alt={card.fileName}
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      </div>
    );
  };

  return (
    <>
      <PatientNavbar />

      <main className="upload-cards">
        <div className="container">

          {/* =================================================
              PAGE HEADER
          ================================================= */}

          <div className="records-header">
            <div>
              <span className="records-label">
                MEDICAL RECORDS
              </span>

              <h1>Health Cards</h1>

              <p>
                Store and manage your important health-related
                cards and documents securely.
              </p>
            </div>

            <div className="records-count">
              <div className="count-number">
                {cards.length}
              </div>

              <div className="count-text">
                Saved Records
              </div>
            </div>
          </div>

          {/* =================================================
              ALERTS
          ================================================= */}

          {success && (
            <div className="record-alert success-alert">
              <i className="fas fa-check-circle"></i>
              <span>{success}</span>

              <button
                type="button"
                onClick={() => setSuccess("")}
              >
                ×
              </button>
            </div>
          )}

          {error && (
            <div className="record-alert error-alert">
              <i className="fas fa-exclamation-circle"></i>
              <span>{error}</span>

              <button
                type="button"
                onClick={() => setError("")}
              >
                ×
              </button>
            </div>
          )}

          {/* =================================================
              UPLOAD CARD
          ================================================= */}

          <section className="upload-card">

            <div className="upload-card-header">
              <div className="upload-icon">
                <i className="fas fa-cloud-upload-alt"></i>
              </div>

              <div>
                <h3>Upload Health Document</h3>

                <p>
                  Add your Ayushman Bharat card, insurance card,
                  COVID certificate or other health documents.
                </p>
              </div>
            </div>

            <form onSubmit={handleUpload}>

              <div className="row g-4">

                {/* CARD TYPE */}

                <div className="col-md-5">
                  <label
                    htmlFor="cardType"
                    className="form-label"
                  >
                    Card Type
                  </label>

                  <select
                    id="cardType"
                    className="form-select"
                    value={cardType}
                    onChange={(e) =>
                      setCardType(e.target.value)
                    }
                    disabled={uploading}
                    required
                  >
                    <option value="">
                      Select card type
                    </option>

                    <option value="Ayushman Bharat Card">
                      Ayushman Bharat Card
                    </option>

                    <option value="Health Insurance Card">
                      Health Insurance Card
                    </option>

                    <option value="COVID Certificate">
                      COVID Certificate
                    </option>

                    <option value="Other">
                      Other
                    </option>
                  </select>
                </div>

                {/* FILE */}

                <div className="col-md-7">
                  <label
                    htmlFor="medicalRecordFile"
                    className="form-label"
                  >
                    Upload File
                  </label>

                  <input
                    id="medicalRecordFile"
                    type="file"
                    accept="image/jpeg,image/png,image/jpg,image/webp,application/pdf"
                    className="form-control"
                    onChange={handleFileChange}
                    disabled={uploading}
                    required
                  />

                  <small className="file-help">
                    JPG, PNG, WEBP or PDF — maximum 10 MB
                  </small>

                  {selectedFile && (
                    <div className="selected-file">
                      <i
                        className={
                          selectedFile.type ===
                          "application/pdf"
                            ? "fas fa-file-pdf"
                            : "fas fa-image"
                        }
                      ></i>

                      <span>
                        {selectedFile.name}
                      </span>

                      <small>
                        {formatFileSize(
                          selectedFile.size
                        )}
                      </small>
                    </div>
                  )}
                </div>

                {/* BUTTON */}

                <div className="col-12 upload-button-wrapper">
                  <button
                    type="submit"
                    className="upload-button"
                    disabled={uploading}
                  >
                    {uploading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>

                        Uploading...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-upload"></i>
                        Upload Document
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </section>

          {/* =================================================
              SAVED RECORDS
          ================================================= */}

          <section className="saved-records">

            <div className="saved-records-header">
              <div>
                <span className="records-label">
                  YOUR DOCUMENTS
                </span>

                <h2>Uploaded Health Cards</h2>
              </div>

              {!loading && cards.length > 0 && (
                <span className="records-total">
                  {cards.length}{" "}
                  {cards.length === 1
                    ? "record"
                    : "records"}
                </span>
              )}
            </div>

            {/* LOADING */}

            {loading && (
              <div className="records-loading">
                <div
                  className="spinner-border text-primary"
                  role="status"
                ></div>

                <p>
                  Loading your medical records...
                </p>
              </div>
            )}

            {/* EMPTY */}

            {!loading && cards.length === 0 && (
              <div className="empty-records">
                <div className="empty-icon">
                  <i className="fas fa-folder-open"></i>
                </div>

                <h3>No Medical Records Yet</h3>

                <p>
                  You have not uploaded any health cards or
                  medical documents yet.
                </p>

                <span>
                  Upload your first document using the form above.
                </span>
              </div>
            )}

            {/* RECORDS */}

            {!loading && cards.length > 0 && (
              <div className="row g-4">

                {cards.map((card) => (
                  <div
                    className="col-md-6 col-lg-4"
                    key={card._id}
                  >
                    <article className="medical-record-card">

                      {/* PREVIEW */}

                      {renderPreview(card)}

                      {/* CONTENT */}

                      <div className="medical-record-body">

                        <div className="record-type">
                          {card.cardType}
                        </div>

                        <h5
                          className="record-file-name"
                          title={card.fileName}
                        >
                          {card.fileName}
                        </h5>

                        <div className="record-details">

                          <div>
                            <i className="far fa-calendar"></i>
                            <span>
                              {formatDate(
                                card.createdAt
                              )}
                            </span>
                          </div>

                          <div>
                            <i className="far fa-file"></i>
                            <span>
                              {formatFileSize(
                                card.fileSize
                              )}
                            </span>
                          </div>
                        </div>

                        {/* ACTIONS */}

                        <div className="record-actions">

                          <button
                            type="button"
                            className="view-record-button"
                            onClick={() =>
                              handleView(card.fileUrl)
                            }
                          >
                            <i className="fas fa-eye"></i>
                            View
                          </button>

                          <button
                            type="button"
                            className="delete-record-button"
                            onClick={() =>
                              handleDelete(card._id)
                            }
                            disabled={
                              deletingId === card._id
                            }
                          >
                            {deletingId === card._id ? (
                              <span
                                className="spinner-border spinner-border-sm"
                                role="status"
                              ></span>
                            ) : (
                              <i className="fas fa-trash-alt"></i>
                            )}

                            Delete
                          </button>

                        </div>
                      </div>
                    </article>
                  </div>
                ))}
              </div>
            )}
          </section>

        </div>
      </main>

      <Footer />
    </>
  );
};

export default HealthCards;