// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import DoctorNavbar from "../nav";
// import DoctorFooter from "../footerdoc/docFooter";
// import "./prescribe.css";

// const API_URL = "http://localhost:3010/api";

// const UploadPrescribe = () => {
//   const [patients, setPatients] = useState([]);
//   const [selectedPatient, setSelectedPatient] = useState("");
//   const [textPrescription, setTextPrescription] = useState("");
//   const [filePrescription, setFilePrescription] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [fetchingPatients, setFetchingPatients] = useState(true);

//   /* =========================================
//      FETCH DOCTOR'S PATIENTS
//      ========================================= */

//   useEffect(() => {
//     const fetchPatients = async () => {
//       try {
//         const doctorId = localStorage.getItem("doctorId");

//         if (!doctorId) {
//           console.error("Doctor ID not found in localStorage");
//           setFetchingPatients(false);
//           return;
//         }

//         const res = await axios.get(
//           `${API_URL}/doctor/${doctorId}/patients`
//         );

//         console.log("Patients:", res.data);

//         const patientList = Array.isArray(res.data)
//           ? res.data
//           : res.data?.patients || [];

//         setPatients(patientList);

//         if (patientList.length > 0) {
//           setSelectedPatient(patientList[0]._id);
//         }
//       } catch (error) {
//         console.error(
//           "Failed to fetch patients:",
//           error.response?.data || error.message
//         );
//       } finally {
//         setFetchingPatients(false);
//       }
//     };

//     fetchPatients();
//   }, []);

//   /* =========================================
//      FILE HANDLER
//      ========================================= */

//   const handleFileChange = (e) => {
//     const file = e.target.files?.[0];

//     if (!file) {
//       setFilePrescription(null);
//       return;
//     }

//     // 10 MB limit
//     const maxSize = 10 * 1024 * 1024;

//     if (file.size > maxSize) {
//       alert("File size must be less than 10 MB.");
//       e.target.value = "";
//       setFilePrescription(null);
//       return;
//     }

//     setFilePrescription(file);
//   };

//   /* =========================================
//      SUBMIT PRESCRIPTION
//      ========================================= */

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!selectedPatient) {
//       alert("Please select a patient.");
//       return;
//     }

//     if (!textPrescription.trim() && !filePrescription) {
//       alert("Please write a prescription or upload a file.");
//       return;
//     }

//     const doctorId = localStorage.getItem("doctorId");

//     if (!doctorId) {
//       alert("Doctor ID not found. Please login again.");
//       return;
//     }

//     const formData = new FormData();

//     formData.append("patientId", selectedPatient);
//     formData.append("doctorId", doctorId);
//     formData.append("text", textPrescription.trim());

//     if (filePrescription) {
//       formData.append("file", filePrescription);
//     }

//     try {
//       setLoading(true);

//       const res = await axios.post(
//         `${API_URL}/prescriptions/create`,
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );

//       console.log("Prescription response:", res.data);

//       alert("Prescription saved successfully.");

//       // Reset form
//       setTextPrescription("");
//       setFilePrescription(null);

//       const fileInput = document.getElementById(
//         "prescriptionFile"
//       );

//       if (fileInput) {
//         fileInput.value = "";
//       }
//     } catch (error) {
//       console.error(
//         "Error saving prescription:",
//         error.response?.data || error.message
//       );

//       alert(
//         error.response?.data?.message ||
//           "Failed to save prescription."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* =========================================
//      RESET FORM
//      ========================================= */

//   const handleReset = () => {
//     setTextPrescription("");
//     setFilePrescription(null);

//     const fileInput = document.getElementById(
//       "prescriptionFile"
//     );

//     if (fileInput) {
//       fileInput.value = "";
//     }
//   };

//   return (
//     <>
//       <DoctorNavbar />

//       <main className="upload-prescription-page">
//         <div className="prescription-card">
//           <div className="prescription-card-body">

//             {/* Header */}
//             <div className="prescription-header">
//               <h1 className="prescription-title">
//                 Give Prescription
//               </h1>

//               <p className="prescription-subtitle">
//                 Create and send a prescription for your patient.
//                 You can provide written instructions, upload a
//                 prescription document, or both.
//               </p>
//             </div>

//             {/* Form */}
//             <form
//               className="prescription-form"
//               onSubmit={handleSubmit}
//             >

//               {/* Patient */}
//               <div className="prescription-form-group">
//                 <label
//                   htmlFor="patient"
//                   className="prescription-label"
//                 >
//                   Select Patient
//                 </label>

//                 {fetchingPatients ? (
//                   <select
//                     className="prescription-select"
//                     disabled
//                   >
//                     <option>
//                       Loading patients...
//                     </option>
//                   </select>
//                 ) : (
//                   <select
//                     id="patient"
//                     className="prescription-select"
//                     value={selectedPatient}
//                     onChange={(e) =>
//                       setSelectedPatient(e.target.value)
//                     }
//                     required
//                   >
//                     <option value="">
//                       -- Choose Patient --
//                     </option>

//                     {patients.map((patient) => (
//                       <option
//                         key={patient._id}
//                         value={patient._id}
//                       >
//                         {patient.fullName}
//                         {patient.age
//                           ? ` (${patient.age} yrs)`
//                           : ""}
//                       </option>
//                     ))}
//                   </select>
//                 )}

//                 {patients.length === 0 &&
//                   !fetchingPatients && (
//                     <div className="no-patients-message">
//                       No patients found for this doctor.
//                     </div>
//                   )}
//               </div>

//               {/* Prescription Text */}
//               <div className="prescription-form-group">
//                 <label
//                   htmlFor="prescriptionText"
//                   className="prescription-label"
//                 >
//                   Prescription Text
//                 </label>

//                 <textarea
//                   id="prescriptionText"
//                   className="prescription-textarea"
//                   rows="7"
//                   placeholder="Write prescription instructions here..."
//                   value={textPrescription}
//                   onChange={(e) =>
//                     setTextPrescription(e.target.value)
//                   }
//                 />

//                 <small className="prescription-help-text">
//                   Include medicines, dosage, timing, duration,
//                   precautions, and other instructions if required.
//                 </small>
//               </div>

//               <hr className="prescription-divider" />

//               {/* File Upload */}
//               <div className="prescription-form-group">
//                 <label
//                   htmlFor="prescriptionFile"
//                   className="prescription-label"
//                 >
//                   Upload Prescription File
//                 </label>

//                 <div className="prescription-upload-box">
//                   <input
//                     id="prescriptionFile"
//                     type="file"
//                     className="prescription-file-input"
//                     accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
//                     onChange={handleFileChange}
//                   />

//                   <small className="prescription-help-text">
//                     Supported formats: PDF, JPG, JPEG, PNG,
//                     DOC, DOCX. Maximum size: 10 MB.
//                   </small>

//                   {filePrescription && (
//                     <span className="prescription-file-name">
//                       Selected file:{" "}
//                       <strong>
//                         {filePrescription.name}
//                       </strong>
//                     </span>
//                   )}
//                 </div>
//               </div>

//               {/* Buttons */}
//               <div className="prescription-form-actions">

//                 <button
//                   type="button"
//                   className="prescription-reset-btn"
//                   onClick={handleReset}
//                   disabled={loading}
//                 >
//                   Clear
//                 </button>

//                 <button
//                   type="submit"
//                   className="prescription-submit-btn"
//                   disabled={
//                     loading ||
//                     patients.length === 0 ||
//                     fetchingPatients
//                   }
//                 >
//                   {loading ? (
//                     <span className="prescription-loading">
//                       <span className="prescription-spinner"></span>
//                       Saving...
//                     </span>
//                   ) : (
//                     "Save Prescription"
//                   )}
//                 </button>

//               </div>
//             </form>
//           </div>
//         </div>
//       </main>

//       <DoctorFooter />
//     </>
//   );
// };

// export default UploadPrescribe;





import React, {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import DoctorNavbar from "../nav";
import DoctorFooter from "../footerdoc/docFooter";

import "./prescribe.css";

const API_URL =
  "http://localhost:3010/api";

const UploadPrescribe = () => {
  const [patients, setPatients] =
    useState([]);

  const [selectedPatient, setSelectedPatient] =
    useState("");

  const [textPrescription, setTextPrescription] =
    useState("");

  const [filePrescription, setFilePrescription] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [fetchingPatients, setFetchingPatients] =
    useState(true);

  /* =====================================================
     FETCH PATIENTS
  ===================================================== */

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setFetchingPatients(true);

      const doctorId =
        localStorage.getItem(
          "doctorId"
        );

      if (!doctorId) {
        alert(
          "Doctor ID not found. Please login again."
        );

        return;
      }

      const response =
        await axios.get(
          `${API_URL}/doctor/${doctorId}/patients`
        );

      console.log(
        "Patients response:",
        response.data
      );

      const patientList =
        Array.isArray(response.data)
          ? response.data
          : response.data?.patients ||
            [];

      setPatients(patientList);

      if (
        patientList.length > 0
      ) {
        setSelectedPatient(
          patientList[0]._id
        );
      }
    } catch (error) {
      console.error(
        "Fetch patients error:",
        error.response?.data ||
          error.message
      );

      alert(
        error.response?.data?.message ||
          "Failed to load patients."
      );
    } finally {
      setFetchingPatients(false);
    }
  };

  /* =====================================================
     FILE SELECT
  ===================================================== */

  const handleFileChange = (
    event
  ) => {
    const file =
      event.target.files[0];

    if (!file) {
      setFilePrescription(null);
      return;
    }

    /* 10 MB */

    if (
      file.size >
      10 * 1024 * 1024
    ) {
      alert(
        "File size must be less than 10 MB."
      );

      event.target.value = "";
      setFilePrescription(null);

      return;
    }

    const allowedExtensions = [
      ".pdf",
      ".jpg",
      ".jpeg",
      ".png",
      ".doc",
      ".docx",
    ];

    const extension =
      "." +
      file.name
        .split(".")
        .pop()
        .toLowerCase();

    if (
      !allowedExtensions.includes(
        extension
      )
    ) {
      alert(
        "Only PDF, JPG, JPEG, PNG, DOC and DOCX files are allowed."
      );

      event.target.value = "";
      setFilePrescription(null);

      return;
    }

    console.log(
      "Selected file:",
      file
    );

    setFilePrescription(file);
  };

  /* =====================================================
     SUBMIT
  ===================================================== */

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    if (!selectedPatient) {
      alert(
        "Please select a patient."
      );

      return;
    }

    if (
      !textPrescription.trim() &&
      !filePrescription
    ) {
      alert(
        "Please write a prescription or upload a file."
      );

      return;
    }

    const doctorId =
      localStorage.getItem(
        "doctorId"
      );

    if (!doctorId) {
      alert(
        "Doctor ID not found. Please login again."
      );

      return;
    }

    try {
      setLoading(true);

      const formData =
        new FormData();

      formData.append(
        "patientId",
        selectedPatient
      );

      formData.append(
        "doctorId",
        doctorId
      );

      formData.append(
        "text",
        textPrescription.trim()
      );

      if (filePrescription) {
        formData.append(
          "file",
          filePrescription
        );
      }

      /* ---------------------------------------
         DEBUG
      --------------------------------------- */

      console.log(
        "Patient:",
        selectedPatient
      );

      console.log(
        "Doctor:",
        doctorId
      );

      console.log(
        "Text:",
        textPrescription
      );

      console.log(
        "File:",
        filePrescription
      );

      for (
        const [
          key,
          value,
        ] of formData.entries()
      ) {
        console.log(
          "FormData:",
          key,
          value instanceof File
            ? {
                name:
                  value.name,

                type:
                  value.type,

                size:
                  value.size,
              }
            : value
        );
      }

      /* ---------------------------------------
         IMPORTANT:
         DO NOT SET CONTENT-TYPE MANUALLY
      --------------------------------------- */

      const response =
        await axios.post(
          `${API_URL}/prescriptions/create`,
          formData
        );

      console.log(
        "Prescription response:",
        response.data
      );

      if (
        response.data.success
      ) {
        alert(
          "Prescription saved successfully."
        );

        setTextPrescription(
          ""
        );

        setFilePrescription(
          null
        );

        const fileInput =
          document.getElementById(
            "prescriptionFile"
          );

        if (fileInput) {
          fileInput.value =
            "";
        }
      }
    } catch (error) {
      console.error(
        "Prescription upload error:",
        error
      );

      console.error(
        "Backend response:",
        error.response?.data
      );

      alert(
        error.response?.data?.message ||
          "Failed to save prescription."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     CLEAR
  ===================================================== */

  const handleClear = () => {
    setTextPrescription("");
    setFilePrescription(null);

    const fileInput =
      document.getElementById(
        "prescriptionFile"
      );

    if (fileInput) {
      fileInput.value = "";
    }
  };

  return (
    <>
      <DoctorNavbar />

      <div className="prescription-page">

        <div className="prescription-container">

          <div className="prescription-header">
            <h1>
              Upload Prescription
            </h1>

            <p>
              Create and upload a prescription
              for your patient.
            </p>
          </div>

          <form
            onSubmit={
              handleSubmit
            }
            className="prescription-form"
          >

            {/* PATIENT */}

            <div className="form-group">

              <label>
                Select Patient
              </label>

              {fetchingPatients ? (
                <p>
                  Loading patients...
                </p>
              ) : patients.length ===
                0 ? (
                <p>
                  No patients found.
                </p>
              ) : (
                <select
                  value={
                    selectedPatient
                  }
                  onChange={(e) =>
                    setSelectedPatient(
                      e.target.value
                    )
                  }
                  required
                >
                  <option value="">
                    Select Patient
                  </option>

                  {patients.map(
                    (patient) => (
                      <option
                        key={
                          patient._id
                        }
                        value={
                          patient._id
                        }
                      >
                        {patient.fullName ||
                          patient.name ||
                          patient.email}
                      </option>
                    )
                  )}
                </select>
              )}

            </div>

            {/* TEXT */}

            <div className="form-group">

              <label>
                Prescription
              </label>

              <textarea
                value={
                  textPrescription
                }
                onChange={(e) =>
                  setTextPrescription(
                    e.target.value
                  )
                }
                placeholder="Write prescription instructions..."
                rows="8"
              />

            </div>

            {/* FILE */}

            <div className="form-group">

              <label>
                Upload Prescription File
              </label>

              <input
                id="prescriptionFile"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                onChange={
                  handleFileChange
                }
              />

              {filePrescription && (
                <p>
                  Selected file:{" "}
                  <strong>
                    {
                      filePrescription.name
                    }
                  </strong>
                </p>
              )}

              <small>
                Maximum size: 10 MB
                <br />
                Allowed: PDF, JPG, JPEG,
                PNG, DOC, DOCX
              </small>

            </div>

            {/* BUTTONS */}

            <div className="prescription-actions">

              <button
                type="button"
                onClick={
                  handleClear
                }
                disabled={loading}
              >
                Clear
              </button>

              <button
                type="submit"
                disabled={
                  loading ||
                  !selectedPatient
                }
              >
                {loading
                  ? "Saving..."
                  : "Save Prescription"}
              </button>

            </div>

          </form>

        </div>

      </div>

      <DoctorFooter />
    </>
  );
};

export default UploadPrescribe;