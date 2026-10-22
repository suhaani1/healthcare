import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

import "../patientStyle/PatientChat.css";
// import { Navbar } from "react-bootstrap";
import PatientNavbar from "./navbar";
import Footer from "../footer/footer";

const API_URL = "http://localhost:3010/api";

const PatientChat = () => {
  const patientId = localStorage.getItem("patientId");

  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);

  const [error, setError] = useState("");

  const bottomRef = useRef(null);

  // ==========================================
  // FETCH PATIENT'S DOCTORS
  // ==========================================
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoadingDoctors(true);
        setError("");

        if (!patientId) {
          setError("Patient ID not found. Please login again.");
          return;
        }

        const response = await axios.get(
          `${API_URL}/appointment/patient/${patientId}`
        );

        const appointments =
          response.data?.appointments || [];

        const uniqueDoctors = [];
        const doctorIds = new Set();

        appointments.forEach((appointment) => {
          const doctor = appointment.doctorId;

          if (
            doctor &&
            typeof doctor === "object" &&
            doctor._id
          ) {
            if (!doctorIds.has(doctor._id)) {
              doctorIds.add(doctor._id);

              uniqueDoctors.push({
                _id: doctor._id,
                fullName:
                  doctor.fullName || "Doctor",
                specialization:
                  doctor.specialization ||
                  "General Physician",
                profilePhoto:
                  doctor.profilePhoto || "",
              });
            }
          }
        });

        setDoctors(uniqueDoctors);

        if (uniqueDoctors.length > 0) {
          setSelectedDoctor(uniqueDoctors[0]);
        }
      } catch (error) {
        console.error(
          "Fetch doctors error:",
          error.response?.data || error.message
        );

        setError(
          error.response?.data?.message ||
            "Failed to load your doctors."
        );
      } finally {
        setLoadingDoctors(false);
      }
    };

    fetchDoctors();
  }, [patientId]);

  // ==========================================
  // FETCH MESSAGES
  // ==========================================
  useEffect(() => {
    if (!selectedDoctor || !patientId) {
      setMessages([]);
      return;
    }

    const fetchMessages = async () => {
      try {
        setLoadingMessages(true);
        setError("");

        const response = await axios.get(
          `${API_URL}/message/${selectedDoctor._id}/${patientId}`
        );

        setMessages(
          response.data?.messages || []
        );

        // Mark messages as read
        await axios.put(
          `${API_URL}/message/${selectedDoctor._id}/${patientId}/read`
        );
      } catch (error) {
        console.error(
          "Fetch messages error:",
          error.response?.data || error.message
        );

        setError(
          error.response?.data?.message ||
            "Failed to load messages."
        );
      } finally {
        setLoadingMessages(false);
      }
    };

    fetchMessages();
  }, [selectedDoctor, patientId]);

  // ==========================================
  // AUTO SCROLL
  // ==========================================
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  // ==========================================
  // SEND MESSAGE
  // ==========================================
  const sendMessage = async () => {
    const messageText = text.trim();

    if (!messageText || !selectedDoctor || sending) {
      return;
    }

    try {
      setSending(true);
      setError("");

      const response = await axios.post(
        `${API_URL}/message/send`,
        {
          doctorId: selectedDoctor._id,
          patientId,
          sender: "patient",
          text: messageText,
        }
      );

      if (response.data?.message) {
        setMessages((previous) => [
          ...previous,
          response.data.message,
        ]);
      }

      setText("");
    } catch (error) {
      console.error(
        "Send message error:",
        error.response?.data || error.message
      );

      setError(
        error.response?.data?.message ||
          "Failed to send message."
      );
    } finally {
      setSending(false);
    }
  };

  // ==========================================
  // ENTER KEY
  // ==========================================
  const handleKeyDown = (event) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();
      sendMessage();
    }
  };

  // ==========================================
  // LOADING
  // ==========================================
  if (loadingDoctors) {
    return (
      <div className="patient-chat-page">
        <div className="patient-chat-loading">
          Loading your doctors...
        </div>
      </div>
    );
  }

  // ==========================================
  // MAIN PAGE
  // ==========================================
  return (
    <>
    <PatientNavbar/>
    <div className="patient-chat-page">

      {/* HEADER */}
      <div className="patient-chat-header">
        <div>
          <h2>Chat</h2>
          <p>
            Communicate with your healthcare providers.
          </p>
        </div>
      </div>

      {error && (
        <div className="patient-chat-error">
          {error}
        </div>
      )}

      <div className="patient-chat-container">

        {/* ======================================
            DOCTOR LIST
        ====================================== */}
        <div className="chat-doctor-list">

          <div className="doctor-list-header">
            <h3>Doctors</h3>
          </div>

          {doctors.length === 0 ? (
            <div className="no-doctors">
              <div className="no-doctors-icon">
                D
              </div>

              <h4>No doctors available</h4>

              <p>
                Book an appointment with a doctor
                to start a conversation.
              </p>
            </div>
          ) : (
            doctors.map((doctor) => (
              <button
                key={doctor._id}
                type="button"
                className={`doctor-chat-item ${
                  selectedDoctor?._id === doctor._id
                    ? "selected"
                    : ""
                }`}
                onClick={() =>
                  setSelectedDoctor(doctor)
                }
              >
                <div className="doctor-chat-avatar">
                  {doctor.profilePhoto ? (
                    <img
                      src={doctor.profilePhoto}
                      alt={doctor.fullName}
                    />
                  ) : (
                    doctor.fullName
                      ?.charAt(0)
                      .toUpperCase() || "D"
                  )}
                </div>

                <div className="doctor-chat-info">
                  <strong>
                    {doctor.fullName}
                  </strong>

                  <span>
                    {doctor.specialization}
                  </span>
                </div>
              </button>
            ))
          )}
        </div>

        {/* ======================================
            CHAT AREA
        ====================================== */}
        <div className="chat-main">

          {!selectedDoctor ? (
            <div className="chat-empty">
              <div className="chat-empty-icon">
                M
              </div>

              <h3>Select a doctor</h3>

              <p>
                Select a doctor from the left to
                start chatting.
              </p>
            </div>
          ) : (
            <>
              {/* CHAT HEADER */}
              <div className="chat-main-header">

                <div className="chat-doctor-avatar">
                  {selectedDoctor.profilePhoto ? (
                    <img
                      src={selectedDoctor.profilePhoto}
                      alt={selectedDoctor.fullName}
                    />
                  ) : (
                    selectedDoctor.fullName
                      ?.charAt(0)
                      .toUpperCase() || "D"
                  )}
                </div>

                <div>
                  <h3>
                    {selectedDoctor.fullName}
                  </h3>

                  <span>
                    {selectedDoctor.specialization}
                  </span>
                </div>

              </div>

              {/* MESSAGES */}
              <div className="chat-messages">

                {loadingMessages ? (
                  <div className="chat-loading">
                    Loading messages...
                  </div>
                ) : messages.length === 0 ? (
                  <div className="chat-empty-messages">
                    <div className="chat-empty-icon">
                      M
                    </div>

                    <h4>
                      Start a conversation
                    </h4>

                    <p>
                      Send a message to{" "}
                      {selectedDoctor.fullName}.
                    </p>
                  </div>
                ) : (
                  messages.map((message) => {
                    const isPatient =
                      message.sender === "patient";

                    return (
                      <div
                        key={message._id}
                        className={`message-row ${
                          isPatient
                            ? "patient-message"
                            : "doctor-message"
                        }`}
                      >
                        <div className="message-bubble">
                          <p>{message.text}</p>

                          <span>
                            {new Date(
                              message.createdAt
                            ).toLocaleTimeString(
                              "en-IN",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}

                <div ref={bottomRef}></div>
              </div>

              {/* MESSAGE INPUT */}
              <div className="chat-input-area">

                <textarea
                  value={text}
                  onChange={(event) =>
                    setText(event.target.value)
                  }
                  onKeyDown={handleKeyDown}
                  placeholder={`Message ${selectedDoctor.fullName}...`}
                  rows="1"
                  disabled={sending}
                />

                <button
                  type="button"
                  onClick={sendMessage}
                  disabled={
                    sending || !text.trim()
                  }
                >
                  {sending ? "Sending..." : "Send"}
                </button>

              </div>
            </>
          )}

        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default PatientChat;