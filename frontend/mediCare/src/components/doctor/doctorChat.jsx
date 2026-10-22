import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import DoctorNavbar from "./nav";
import "../doctorStyle/doctorChat.css";

const API = "http://localhost:3010/api";

const DoctorChat = () => {
  const location = useLocation();

  const [doctorId, setDoctorId] = useState("");
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const [search, setSearch] = useState("");

  const [loadingPatients, setLoadingPatients] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);

  const [error, setError] = useState("");

  /* =====================================================
     GET DOCTOR ID
  ===================================================== */

  useEffect(() => {
    const storedDoctorId = localStorage.getItem("doctorId");

    if (storedDoctorId) {
      setDoctorId(storedDoctorId);
    } else {
      setError("Doctor information not found. Please login again.");
    }
  }, []);

  /* =====================================================
     FETCH PATIENTS
  ===================================================== */

  useEffect(() => {
    if (!doctorId) return;

    fetchPatients();
  }, [doctorId]);

  const fetchPatients = async () => {
    try {
      setLoadingPatients(true);
      setError("");

      const response = await axios.get(
        `${API}/appointment/${doctorId}/patients`
      );

      const patientList = response.data?.patients || [];

      setPatients(patientList);

      /*
        If notification opened the chat,
        select that patient automatically.
      */
      const requestedPatientId =
        location.state?.patientId ||
        localStorage.getItem("selectedPatientId");

      if (requestedPatientId && patientList.length > 0) {
        const foundPatient = patientList.find(
          (patient) =>
            String(patient._id) === String(requestedPatientId)
        );

        if (foundPatient) {
          setSelectedPatient(foundPatient);
          localStorage.setItem(
            "selectedPatientId",
            String(foundPatient._id)
          );
          return;
        }
      }

      /*
        Otherwise select first patient.
      */
      if (patientList.length > 0 && !selectedPatient) {
        setSelectedPatient(patientList[0]);

        localStorage.setItem(
          "selectedPatientId",
          String(patientList[0]._id)
        );
      }
    } catch (error) {
      console.error("Fetch patients error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load patients."
      );
    } finally {
      setLoadingPatients(false);
    }
  };

  /* =====================================================
     FILTER PATIENTS
  ===================================================== */

  const filteredPatients = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) {
      return patients;
    }

    return patients.filter((patient) => {
      return (
        patient.fullName?.toLowerCase().includes(value) ||
        patient.email?.toLowerCase().includes(value) ||
        patient.phone?.toLowerCase().includes(value)
      );
    });
  }, [patients, search]);

  /* =====================================================
     SELECT PATIENT
  ===================================================== */

  const selectPatient = (patient) => {
    setSelectedPatient(patient);
    setMessages([]);
    setText("");

    localStorage.setItem(
      "selectedPatientId",
      String(patient._id)
    );
  };

  /* =====================================================
     FETCH MESSAGES
  ===================================================== */

  useEffect(() => {
    if (!doctorId || !selectedPatient?._id) {
      return;
    }

    fetchMessages();
  }, [doctorId, selectedPatient]);

  const fetchMessages = async () => {
    try {
      setLoadingMessages(true);

      const response = await axios.get(
        `${API}/message/${doctorId}/${selectedPatient._id}`
      );

      setMessages(response.data?.messages || []);

      /*
        Mark patient messages as read.
      */
      await axios.put(
        `${API}/message/${doctorId}/${selectedPatient._id}/read`
      );
    } catch (error) {
      console.error("Fetch messages error:", error);

      setMessages([]);
    } finally {
      setLoadingMessages(false);
    }
  };

  /* =====================================================
     SEND MESSAGE
  ===================================================== */

  const sendMessage = async (event) => {
    event.preventDefault();

    if (!text.trim()) {
      return;
    }

    if (!doctorId || !selectedPatient?._id) {
      return;
    }

    try {
      setSending(true);

      const response = await axios.post(`${API}/message/send`, {
        doctorId,
        patientId: selectedPatient._id,
        sender: "doctor",
        text: text.trim(),
      });

      const newMessage = response.data?.message;

      if (newMessage) {
        setMessages((previousMessages) => [
          ...previousMessages,
          newMessage,
        ]);
      }

      setText("");
    } catch (error) {
      console.error("Send message error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to send message."
      );
    } finally {
      setSending(false);
    }
  };

  /* =====================================================
     ENTER KEY
  ===================================================== */

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();

      if (!sending) {
        sendMessage(event);
      }
    }
  };

  /* =====================================================
     FORMAT DATE
  ===================================================== */

  const formatTime = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <div className="doctor-chat-page">
      <DoctorNavbar />

      <div className="doctor-chat-page-header">
        <div>
          <h1>Patient Chat</h1>
          <p>
            Communicate securely with your connected patients.
          </p>
        </div>
      </div>

      {error && (
        <div className="doctor-chat-error">
          {error}
        </div>
      )}

      <div className="doctor-chat-container">
        {/* =================================================
            PATIENT LIST
        ================================================= */}

        <aside className="doctor-patient-list">
          <div className="doctor-patient-header">
            <div>
              <h2>Patients</h2>

              <span>
                {patients.length} patient
                {patients.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>

          <div className="doctor-patient-search">
            <input
              type="text"
              placeholder="Search patients..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />
          </div>

          <div className="doctor-patients">
            {loadingPatients ? (
              <div className="doctor-chat-loading">
                Loading patients...
              </div>
            ) : filteredPatients.length === 0 ? (
              <div className="doctor-no-patients">
                {search
                  ? "No patients found."
                  : "No connected patients yet."}
              </div>
            ) : (
              filteredPatients.map((patient) => (
                <button
                  type="button"
                  key={patient._id}
                  className={`doctor-patient-item ${
                    selectedPatient?._id === patient._id
                      ? "active"
                      : ""
                  }`}
                  onClick={() => selectPatient(patient)}
                >
                  <div className="doctor-patient-avatar">
                    {patient.profileImage ? (
                      <img
                        src={patient.profileImage}
                        alt={patient.fullName}
                      />
                    ) : (
                      <span>
                        {patient.fullName
                          ?.charAt(0)
                          ?.toUpperCase() || "P"}
                      </span>
                    )}
                  </div>

                  <div className="doctor-patient-info">
                    <strong>
                      {patient.fullName || "Patient"}
                    </strong>

                    <small>
                      {patient.email || "No email"}
                    </small>

                    {patient.age && (
                      <small>
                        Age: {patient.age}
                      </small>
                    )}
                  </div>
                </button>
              ))
            )}
          </div>
        </aside>

        {/* =================================================
            CHAT SECTION
        ================================================= */}

        <section className="doctor-chat-section">
          {!selectedPatient ? (
            <div className="doctor-chat-empty">
              <div className="doctor-chat-empty-content">
                <h2>Select a patient</h2>

                <p>
                  Select a patient from the list to start
                  or continue a conversation.
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* CHAT HEADER */}

              <div className="doctor-chat-header">
                <div className="doctor-chat-header-avatar">
                  {selectedPatient.profileImage ? (
                    <img
                      src={selectedPatient.profileImage}
                      alt={selectedPatient.fullName}
                    />
                  ) : (
                    <span>
                      {selectedPatient.fullName
                        ?.charAt(0)
                        ?.toUpperCase() || "P"}
                    </span>
                  )}
                </div>

                <div className="doctor-chat-header-info">
                  <h2>
                    {selectedPatient.fullName ||
                      "Patient"}
                  </h2>

                  <p>
                    {selectedPatient.email ||
                      selectedPatient.phone ||
                      "Patient"}
                  </p>
                </div>
              </div>

              {/* MESSAGES */}

              <div className="doctor-messages">
                {loadingMessages ? (
                  <div className="doctor-chat-loading">
                    Loading conversation...
                  </div>
                ) : messages.length === 0 ? (
                  <div className="doctor-chat-empty">
                    <div className="doctor-chat-empty-content">
                      <h3>No messages yet</h3>

                      <p>
                        Start the conversation with{" "}
                        {selectedPatient.fullName}.
                      </p>
                    </div>
                  </div>
                ) : (
                  messages.map((message) => {
                    const isDoctor =
                      message.sender === "doctor";

                    return (
                      <div
                        key={message._id}
                        className={`doctor-message-row ${
                          isDoctor
                            ? "doctor"
                            : "patient"
                        }`}
                      >
                        <div
                          className={`doctor-message ${
                            isDoctor
                              ? "doctor"
                              : "patient"
                          }`}
                        >
                          <p>{message.text}</p>

                          <span className="doctor-message-time">
                            {formatTime(
                              message.createdAt
                            )}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* MESSAGE INPUT */}

              <form
                className="doctor-message-input"
                onSubmit={sendMessage}
              >
                <textarea
                  value={text}
                  onChange={(event) =>
                    setText(event.target.value)
                  }
                  onKeyDown={handleKeyDown}
                  placeholder={`Message ${selectedPatient.fullName}...`}
                  rows="1"
                  disabled={sending}
                />

                <button
                  type="submit"
                  disabled={
                    sending || !text.trim()
                  }
                >
                  {sending ? "Sending..." : "Send"}
                </button>
              </form>
            </>
          )}
        </section>
      </div>
    </div>
  );
};

export default DoctorChat;