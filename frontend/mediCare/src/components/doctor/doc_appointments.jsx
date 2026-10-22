import { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  Table,
  InputGroup,
  FormControl,
  Button,
  Badge,
  Modal,
  Form,
  ListGroup,
  Spinner,
  Alert,
} from "react-bootstrap";
import DoctorNavbar from "./nav";
import DoctorFooter from "./footerdoc/docFooter";
import { io } from "socket.io-client";

const API_URL = "http://localhost:3010/api";
const SOCKET_SERVER_URL = "http://localhost:3010";

export default function DoctorAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Patient profile modal
  const [showModal, setShowModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  // Chat modal
  const [showChat, setShowChat] = useState(false);
  const [chatWith, setChatWith] = useState(null);

  const doctorId = localStorage.getItem("doctorId");
  const doctorName = localStorage.getItem("doctorName") || "Doctor";

  // =========================================================
  // FETCH DOCTOR APPOINTMENTS
  // =========================================================
  useEffect(() => {
    const fetchAppointments = async () => {
      if (!doctorId) {
        setError("Doctor ID not found. Please login again.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const res = await axios.get(
          `${API_URL}/appointment/doctor/${doctorId}`
        );

        setAppointments(res.data?.appointments || []);
      } catch (err) {
        console.error("Error fetching doctor appointments:", err);

        setError(
          err.response?.data?.message ||
            "Unable to load appointments. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [doctorId]);

  // =========================================================
  // UPDATE APPOINTMENT STATUS
  // =========================================================
  const updateStatus = async (id, status) => {
    try {
      const res = await axios.put(
        `${API_URL}/appointment/status/${id}`,
        { status }
      );

      const updatedAppointment = res.data?.appointment;

      setAppointments((prev) =>
        prev.map((appointment) =>
          appointment._id === id
            ? updatedAppointment || {
                ...appointment,
                status,
              }
            : appointment
        )
      );
    } catch (err) {
      console.error("Error updating appointment status:", err);

      alert(
        err.response?.data?.message ||
          "Failed to update appointment status."
      );
    }
  };

  // =========================================================
  // SEARCH
  // =========================================================
  const filteredAppointments = appointments.filter((appointment) => {
    const patientName =
      appointment.patientId?.fullName?.toLowerCase() || "";

    const reason =
      appointment.reason?.toLowerCase() || "";

    const date = appointment.date
      ? new Date(appointment.date)
          .toLocaleDateString()
          .toLowerCase()
      : "";

    const search = searchTerm.toLowerCase();

    return (
      patientName.includes(search) ||
      reason.includes(search) ||
      date.includes(search)
    );
  });

  // =========================================================
  // STATUS BADGE
  // =========================================================
  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "warning";

      case "accepted":
        return "success";

      case "rejected":
        return "danger";

      case "completed":
        return "secondary";

      default:
        return "dark";
    }
  };

  // =========================================================
  // VIEW PATIENT PROFILE
  // =========================================================
  const handleViewProfile = (patient) => {
    if (!patient) {
      return;
    }

    setSelectedPatient(patient);
    setShowModal(true);
  };

  // =========================================================
  // OPEN CHAT
  // =========================================================
  const handleOpenChat = (patient) => {
    if (!patient?._id) {
      alert("Patient information is not available.");
      return;
    }

    const roomId = `chat:${doctorId}:${patient._id}`;

    setChatWith({
      patientId: patient._id,
      patientName: patient.fullName || "Patient",
      roomId,
    });

    setShowChat(true);
  };

  // =========================================================
  // FORMAT DATE
  // =========================================================
  const formatDate = (date) => {
    if (!date) {
      return "N/A";
    }

    const parsedDate = new Date(date);

    if (isNaN(parsedDate.getTime())) {
      return "N/A";
    }

    return parsedDate.toLocaleDateString();
  };

  return (
    <>
      <DoctorNavbar />

      <div className="container mt-4 mb-5">
        <Card className="p-4 shadow-sm">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="mb-0">Appointment Requests</h4>

            <Badge bg="primary">
              {appointments.length} Appointment
              {appointments.length !== 1 ? "s" : ""}
            </Badge>
          </div>

          {/* =================================================
              ERROR
          ================================================= */}
          {error && (
            <Alert
              variant="danger"
              dismissible
              onClose={() => setError("")}
            >
              {error}
            </Alert>
          )}

          {/* =================================================
              SEARCH
          ================================================= */}
          <InputGroup className="mb-4">
            <FormControl
              placeholder="Search by patient name, date or reason"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            {searchTerm && (
              <Button
                variant="outline-secondary"
                onClick={() => setSearchTerm("")}
              >
                Clear
              </Button>
            )}
          </InputGroup>

          {/* =================================================
              LOADING
          ================================================= */}
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />

              <p className="mt-3 text-muted">
                Loading appointments...
              </p>
            </div>
          ) : filteredAppointments.length === 0 ? (
            /* =================================================
               EMPTY
            ================================================= */
            <div className="text-center py-5">
              <h5>No appointments found</h5>

              <p className="text-muted">
                {searchTerm
                  ? "No appointments match your search."
                  : "You currently have no appointment requests."}
              </p>
            </div>
          ) : (
            /* =================================================
               APPOINTMENTS TABLE
            ================================================= */
            <Table striped bordered hover responsive>
              <thead className="table-light">
                <tr>
                  <th>Patient</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredAppointments.map((appointment) => {
                  const patient = appointment.patientId;

                  return (
                    <tr key={appointment._id}>
                      {/* PATIENT */}
                      <td>
                        <strong>
                          {patient?.fullName || "Unknown Patient"}
                        </strong>

                        {patient?.age !== undefined && (
                          <div className="text-muted small">
                            {patient.age} yrs
                          </div>
                        )}
                      </td>

                      {/* DATE */}
                      <td>
                        {formatDate(appointment.date)}
                      </td>

                      {/* TIME */}
                      <td>
                        {appointment.time || "N/A"}
                      </td>

                      {/* REASON */}
                      <td>
                        {appointment.reason || "N/A"}
                      </td>

                      {/* STATUS */}
                      <td>
                        <Badge
                          bg={getStatusColor(
                            appointment.status
                          )}
                        >
                          {appointment.status
                            ? appointment.status
                                .charAt(0)
                                .toUpperCase() +
                              appointment.status.slice(1)
                            : "Unknown"}
                        </Badge>
                      </td>

                      {/* ACTIONS */}
                      <td>
                        {/* Pending */}
                        {appointment.status === "pending" && (
                          <>
                            <Button
                              size="sm"
                              variant="success"
                              className="me-2 mb-1"
                              onClick={() =>
                                updateStatus(
                                  appointment._id,
                                  "accepted"
                                )
                              }
                            >
                              Accept
                            </Button>

                            <Button
                              size="sm"
                              variant="danger"
                              className="me-2 mb-1"
                              onClick={() =>
                                updateStatus(
                                  appointment._id,
                                  "rejected"
                                )
                              }
                            >
                              Reject
                            </Button>
                          </>
                        )}

                        {/* Accepted */}
                        {appointment.status === "accepted" && (
                          <Button
                            size="sm"
                            variant="secondary"
                            className="me-2 mb-1"
                            onClick={() =>
                              updateStatus(
                                appointment._id,
                                "completed"
                              )
                            }
                          >
                            Mark Completed
                          </Button>
                        )}

                        {/* View Profile */}
                        {patient && (
                          <Button
                            size="sm"
                            variant="info"
                            className="me-2 mb-1"
                            onClick={() =>
                              handleViewProfile(patient)
                            }
                          >
                            View Profile
                          </Button>
                        )}

                        {/* Chat */}
                        {patient && (
                          <Button
                            size="sm"
                            variant="primary"
                            className="mb-1"
                            onClick={() =>
                              handleOpenChat(patient)
                            }
                          >
                            Chat
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          )}
        </Card>
      </div>

      {/* =====================================================
          PATIENT PROFILE MODAL
      ===================================================== */}
      <Modal
        show={showModal}
        onHide={() => {
          setShowModal(false);
          setSelectedPatient(null);
        }}
        centered
      >
        <Modal.Header
          closeButton
          style={{
            background: "#d8e2ed",
            borderBottom: "1px solid #d0e7ff",
          }}
        >
          <Modal.Title>Patient Profile</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {selectedPatient ? (
            <div>
              <p>
                <strong>Name:</strong>{" "}
                {selectedPatient.fullName || "N/A"}
              </p>

              <p>
                <strong>Age:</strong>{" "}
                {selectedPatient.age ?? "N/A"}
              </p>

              <p>
                <strong>Gender:</strong>{" "}
                {selectedPatient.gender || "N/A"}
              </p>

              <p>
                <strong>Email:</strong>{" "}
                {selectedPatient.email || "N/A"}
              </p>

              <p>
                <strong>Phone:</strong>{" "}
                {selectedPatient.phone || "N/A"}
              </p>

              <p>
                <strong>Blood Group:</strong>{" "}
                {selectedPatient.bloodGroup || "N/A"}
              </p>
            </div>
          ) : (
            <p className="text-muted">
              No patient data available.
            </p>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setShowModal(false);
              setSelectedPatient(null);
            }}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* =====================================================
          CHAT MODAL
      ===================================================== */}
      {showChat && chatWith && (
        <ChatModal
          show={showChat}
          onHide={() => {
            setShowChat(false);
            setChatWith(null);
          }}
          roomId={chatWith.roomId}
          doctorId={doctorId}
          doctorName={doctorName}
          patientId={chatWith.patientId}
          patientName={chatWith.patientName}
        />
      )}

      <DoctorFooter />
    </>
  );
}

/* ===========================================================
   CHAT MODAL
=========================================================== */

function ChatModal({
  show,
  onHide,
  roomId,
  doctorId,
  doctorName,
  patientId,
  patientName,
}) {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [chatLoading, setChatLoading] = useState(true);
  const [sending, setSending] = useState(false);

  // =========================================================
  // CONNECT SOCKET
  // =========================================================
  useEffect(() => {
    if (!show || !roomId || !doctorId) {
      return;
    }

    const newSocket = io(SOCKET_SERVER_URL, {
      transports: ["websocket"],
    });

    setSocket(newSocket);

    // =======================================================
    // CONNECT
    // =======================================================
    newSocket.on("connect", () => {
      console.log("Socket connected:", newSocket.id);

      newSocket.emit("joinRoom", {
        roomId,
        userId: doctorId,
        userName: doctorName,
      });
    });

    // =======================================================
    // RECEIVE MESSAGE
    // =======================================================
    newSocket.on("chat:message", (message) => {
      if (message.roomId !== roomId) {
        return;
      }

      setMessages((prev) => {
        // Prevent duplicate messages
        const alreadyExists = prev.some(
          (m) =>
            m.ts === message.ts &&
            m.fromId === message.fromId &&
            m.text === message.text
        );

        if (alreadyExists) {
          return prev;
        }

        return [...prev, message];
      });
    });

    // =======================================================
    // LOAD CHAT HISTORY
    // =======================================================
    const loadHistory = async () => {
      try {
        setChatLoading(true);

        const res = await axios.get(
          `${SOCKET_SERVER_URL}/api/chats/room/${encodeURIComponent(
            roomId
          )}`
        );

        if (res.data?.messages) {
          setMessages(res.data.messages);
        }
      } catch (err) {
        console.log(
          "Chat history endpoint not available:",
          err.message
        );

        // Chat can still work through Socket.IO
        setMessages([]);
      } finally {
        setChatLoading(false);
      }
    };

    loadHistory();

    // =======================================================
    // CLEANUP
    // =======================================================
    return () => {
      if (newSocket.connected) {
        newSocket.emit("leaveRoom", {
          roomId,
          userId: doctorId,
        });
      }

      newSocket.disconnect();
      setSocket(null);
    };
  }, [show, roomId, doctorId, doctorName]);

  // =========================================================
  // SEND MESSAGE
  // =========================================================
  const sendMessage = async () => {
    const trimmedText = text.trim();

    if (!trimmedText || !socket) {
      return;
    }

    const message = {
      roomId,
      fromId: doctorId,
      fromName: doctorName,
      toId: patientId,
      text: trimmedText,
      ts: new Date().toISOString(),
    };

    try {
      setSending(true);

      // Optimistic UI
      setMessages((prev) => [...prev, message]);
      setText("");

      // Send through socket
      socket.emit("chat:message", message);

      // Optional persistence
      try {
        await axios.post(
          `${SOCKET_SERVER_URL}/api/chats`,
          message
        );
      } catch (err) {
        console.log(
          "Chat persistence endpoint not available."
        );
      }
    } catch (err) {
      console.error("Error sending message:", err);
    } finally {
      setSending(false);
    }
  };

  // =========================================================
  // ENTER TO SEND
  // =========================================================
  const handleEnter = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      size="lg"
    >
      <Modal.Header closeButton>
        <Modal.Title>
          Chat with {patientName}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div
          style={{
            height: "55vh",
            overflowY: "auto",
            backgroundColor: "#f8f9fa",
            padding: "10px",
            borderRadius: "8px",
          }}
        >
          {chatLoading ? (
            <div className="text-center py-5">
              <Spinner
                animation="border"
                size="sm"
              />

              <p className="text-muted mt-2">
                Loading messages...
              </p>
            </div>
          ) : (
            <ListGroup variant="flush">
              {messages.map((message, index) => {
                const isDoctor =
                  message.fromId === doctorId;

                return (
                  <ListGroup.Item
                    key={`${message.ts}-${index}`}
                    className="bg-transparent border-0"
                  >
                    <div
                      className={
                        isDoctor
                          ? "text-end"
                          : "text-start"
                      }
                    >
                      <div
                        style={{
                          fontSize: "12px",
                          color: "#666",
                        }}
                      >
                        <strong>
                          {message.fromName}
                        </strong>{" "}
                        ·{" "}
                        {message.ts
                          ? new Date(
                              message.ts
                            ).toLocaleString()
                          : ""}
                      </div>

                      <div
                        style={{
                          display: "inline-block",
                          padding: "8px 12px",
                          borderRadius: "12px",
                          marginTop: "5px",
                          backgroundColor: isDoctor
                            ? "#0d6efd"
                            : "#6c757d",
                          color: "#fff",
                          maxWidth: "75%",
                          wordBreak: "break-word",
                          textAlign: "left",
                        }}
                      >
                        {message.text}
                      </div>
                    </div>
                  </ListGroup.Item>
                );
              })}

              {messages.length === 0 && (
                <div className="text-center py-5 text-muted">
                  No messages yet. Start the conversation.
                </div>
              )}
            </ListGroup>
          )}
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Form.Control
          as="textarea"
          rows={2}
          placeholder="Type a message and press Enter"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleEnter}
          disabled={!socket || sending}
        />

        <Button
          variant="primary"
          onClick={sendMessage}
          disabled={!socket || !text.trim() || sending}
        >
          {sending ? "Sending..." : "Send"}
        </Button>

        <Button
          variant="secondary"
          onClick={onHide}
        >
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}