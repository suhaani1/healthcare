import React, { useEffect, useMemo, useState } from "react";
import Navbar from "./navbar";
import Footer from "../footer/footer";
import api from "../../api";
import "./appointment.css";

const Appointment = () => {
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [appointments, setAppointments] = useState([]);
  const [appointmentsLoading, setAppointmentsLoading] = useState(true);

  // Booking modal
  const [showModal, setShowModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  // Doctor profile modal
  const [showDoctorProfile, setShowDoctorProfile] = useState(false);
  const [profileDoctor, setProfileDoctor] = useState(null);

  // Booking form
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [reason, setReason] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);

  const patientId = localStorage.getItem("patientId");

  // =========================================================
  // FETCH DOCTORS
  // =========================================================

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/doctor/doctors");

        const doctorList = Array.isArray(response.data)
          ? response.data
          : response.data?.doctors || [];

        setDoctors(doctorList);
      } catch (err) {
        console.error("Error fetching doctors:", err);

        setError(
          err.response?.data?.message ||
            "Unable to load doctors."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  // =========================================================
  // FETCH PATIENT APPOINTMENTS
  // =========================================================

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!patientId) {
        setAppointmentsLoading(false);
        return;
      }

      try {
        setAppointmentsLoading(true);

        const response = await api.get(
          `/appointment/patient/${patientId}`
        );

        const appointmentList = Array.isArray(response.data)
          ? response.data
          : response.data?.appointments || [];

        setAppointments(appointmentList);
      } catch (err) {
        console.error(
          "Error fetching appointments:",
          err
        );
      } finally {
        setAppointmentsLoading(false);
      }
    };

    fetchAppointments();
  }, [patientId]);

  // =========================================================
  // SPECIALIZATIONS
  // =========================================================

  const specializations = useMemo(() => {
    const values = doctors
      .map((doctor) => doctor.specialization)
      .filter(Boolean);

    return [...new Set(values)].sort();
  }, [doctors]);

  // =========================================================
  // FILTER DOCTORS
  // =========================================================

  const filteredDoctors = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    return doctors.filter((doctor) => {
      const name = (
        doctor.fullName ||
        doctor.name ||
        ""
      ).toLowerCase();

      const doctorSpecialization = (
        doctor.specialization || ""
      ).toLowerCase();

      const qualification = (
        doctor.qualifications || ""
      ).toLowerCase();

      const matchesSearch =
        !searchText ||
        name.includes(searchText) ||
        doctorSpecialization.includes(searchText) ||
        qualification.includes(searchText);

      const matchesSpecialization =
        !specialization ||
        doctor.specialization === specialization;

      return (
        matchesSearch &&
        matchesSpecialization
      );
    });
  }, [doctors, search, specialization]);

  // =========================================================
  // DATE FORMAT
  // =========================================================

  const formatDate = (date) => {
    if (!date) return "N/A";

    const d = new Date(date);

    if (Number.isNaN(d.getTime())) {
      return date;
    }

    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // =========================================================
  // OPEN BOOKING MODAL
  // =========================================================

  const openBookingModal = (doctor) => {
    setSelectedDoctor(doctor);

    setBookingDate(selectedDate || "");
    setBookingTime("");
    setReason("");

    setShowModal(true);
  };

  // =========================================================
  // CLOSE BOOKING MODAL
  // =========================================================

  const closeBookingModal = () => {
    if (bookingLoading) return;

    setShowModal(false);
    setSelectedDoctor(null);

    setBookingDate("");
    setBookingTime("");
    setReason("");
  };

  // =========================================================
  // OPEN DOCTOR PROFILE
  // =========================================================

  const openDoctorProfile = (doctor) => {
    setProfileDoctor(doctor);
    setShowDoctorProfile(true);
  };

  // =========================================================
  // CLOSE DOCTOR PROFILE
  // =========================================================

  const closeDoctorProfile = () => {
    setShowDoctorProfile(false);
    setProfileDoctor(null);
  };

  // =========================================================
  // DOCTOR PROFILE PHOTO
  // =========================================================

  const getProfileDoctorPhoto = (doctor) => {
    if (!doctor?.profilePhoto) {
      return null;
    }

    const photo = doctor.profilePhoto;

    if (
      typeof photo === "string" &&
      (
        photo.startsWith("http://") ||
        photo.startsWith("https://")
      )
    ) {
      return photo;
    }

    if (
      typeof photo === "string" &&
      photo.startsWith("/")
    ) {
      return `http://localhost:3010${photo}`;
    }

    return `http://localhost:3010/uploads/${photo}`;
  };

  // =========================================================
  // BOOK APPOINTMENT
  // =========================================================

  const handleBookAppointment = async (e) => {
    e.preventDefault();

    if (!patientId) {
      alert(
        "Patient ID not found. Please login again."
      );
      return;
    }

    if (!selectedDoctor?._id) {
      alert("Doctor information is missing.");
      return;
    }

    if (!bookingDate) {
      alert("Please select appointment date.");
      return;
    }

    if (!bookingTime) {
      alert("Please select appointment time.");
      return;
    }

    if (!reason.trim()) {
      alert(
        "Please enter the reason for appointment."
      );
      return;
    }

    try {
      setBookingLoading(true);

      const patientName =
        localStorage.getItem("patientName") ||
        localStorage.getItem("name") ||
        "Patient";

      const payload = {
        doctorId: selectedDoctor._id,
        patientId,
        patientName,
        date: bookingDate,
        time: bookingTime,
        reason: reason.trim(),
      };

      const response = await api.post(
        "/appointment/create",
        payload
      );

      console.log(
        "Appointment created:",
        response.data
      );

      alert(
        "Appointment booked successfully."
      );

      setShowModal(false);
      setSelectedDoctor(null);

      setBookingDate("");
      setBookingTime("");
      setReason("");

      // Refresh appointments
      const appointmentResponse =
        await api.get(
          `/appointment/patient/${patientId}`
        );

      const updatedAppointments =
        Array.isArray(
          appointmentResponse.data
        )
          ? appointmentResponse.data
          : appointmentResponse.data?.appointments ||
            [];

      setAppointments(
        updatedAppointments
      );
    } catch (err) {
      console.error(
        "Error booking appointment:",
        err.response?.data ||
          err.message
      );

      alert(
        err.response?.data?.message ||
          "Failed to book appointment."
      );
    } finally {
      setBookingLoading(false);
    }
  };

  // =========================================================
  // CANCEL APPOINTMENT
  // =========================================================

  const handleCancelAppointment = async (
    appointmentId
  ) => {
    if (!appointmentId) return;

    const confirmed = window.confirm(
      "Are you sure you want to cancel this appointment?"
    );

    if (!confirmed) return;

    try {
      await api.put(
        `/appointment/status/${appointmentId}`,
        {
          status: "rejected",
        }
      );

      alert("Appointment cancelled.");

      setAppointments((previous) =>
        previous.map((appointment) =>
          appointment._id === appointmentId
            ? {
                ...appointment,
                status: "rejected",
              }
            : appointment
        )
      );
    } catch (err) {
      console.error(
        "Error cancelling appointment:",
        err.response?.data ||
          err.message
      );

      alert(
        err.response?.data?.message ||
          "Unable to cancel appointment."
      );
    }
  };

  // =========================================================
  // GET DOCTOR INITIAL
  // =========================================================

  const getDoctorInitial = (doctor) => {
    return (
      doctor?.fullName ||
      doctor?.name ||
      "D"
    )
      .charAt(0)
      .toUpperCase();
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <>
      <Navbar />

      <main className="appointment-page">

        {/* =====================================================
            PAGE HEADER
        ===================================================== */}

        <section className="appointment-header">

          <div>
            <h1>Find a Doctor</h1>

            <p>
              Search for a doctor and book an
              appointment that suits your needs.
            </p>
          </div>

        </section>

        {/* =====================================================
            SEARCH / FILTER
        ===================================================== */}

        <section className="appointment-filters">

          <div className="appointment-search">

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search by doctor name, specialization..."
            />

          </div>

          <div className="appointment-filter">

            <select
              value={specialization}
              onChange={(e) =>
                setSpecialization(
                  e.target.value
                )
              }
            >
              <option value="">
                All Specializations
              </option>

              {specializations.map(
                (item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>
                )
              )}
            </select>

          </div>

          <div className="appointment-filter">

            <input
              type="date"
              value={selectedDate}
              onChange={(e) =>
                setSelectedDate(
                  e.target.value
                )
              }
              min={
                new Date()
                  .toISOString()
                  .split("T")[0]
              }
            />

          </div>

        </section>

        {/* =====================================================
            ERROR
        ===================================================== */}

        {error && (
          <div className="appointment-error">
            {error}
          </div>
        )}

        {/* =====================================================
            DOCTOR LIST
        ===================================================== */}

        <section className="doctor-list-section">

          <div className="section-heading">

            <div>
              <h2>
                Available Doctors
              </h2>

              <p>
                {filteredDoctors.length} doctor
                {filteredDoctors.length !== 1
                  ? "s"
                  : ""}{" "}
                found
              </p>
            </div>

          </div>

          {loading ? (

            <div className="appointment-loading">

              <div className="appointment-spinner"></div>

              <p>
                Loading doctors...
              </p>

            </div>

          ) : filteredDoctors.length === 0 ? (

            <div className="no-doctors">

              <h3>
                No doctors found
              </h3>

              <p>
                Try changing your search or
                specialization filter.
              </p>

            </div>

          ) : (

            <div className="doctor-grid">

              {filteredDoctors.map(
                (doctor) => {

                  const photo =
                    getProfileDoctorPhoto(
                      doctor
                    );

                  return (
                    <div
                      className="doctor-card"
                      key={doctor._id}
                    >

                      {/* DOCTOR PHOTO */}

                      <div className="doctor-card-photo">

                        {photo ? (

                          <img
                            src={photo}
                            alt={
                              doctor.fullName ||
                              doctor.name ||
                              "Doctor"
                            }
                          />

                        ) : (

                          <div className="doctor-card-placeholder">
                            {getDoctorInitial(
                              doctor
                            )}
                          </div>

                        )}

                      </div>

                      {/* DOCTOR INFORMATION */}

                      <div className="doctor-card-content">

                        <h3>
                          {doctor.fullName ||
                            doctor.name ||
                            "Doctor"}
                        </h3>

                        <p className="doctor-specialization">
                          {doctor.specialization ||
                            "Medical Specialist"}
                        </p>

                        {doctor.experience !==
                          undefined &&
                          doctor.experience !==
                            null && (
                            <p className="doctor-experience">
                              {doctor.experience}{" "}
                              years experience
                            </p>
                          )}

                        {doctor.qualifications && (
                          <p className="doctor-qualification">
                            {doctor.qualifications}
                          </p>
                        )}

                        {doctor.bio && (
                          <p className="doctor-bio">
                            {doctor.bio}
                          </p>
                        )}

                        {/* BUTTONS */}

                        <div className="doctor-card-actions">

                          <button
                            type="button"
                            className="view-doctor-profile-btn"
                            onClick={() =>
                              openDoctorProfile(
                                doctor
                              )
                            }
                          >
                            View Profile
                          </button>

                          <button
                            type="button"
                            className="book-appointment-btn"
                            onClick={() =>
                              openBookingModal(
                                doctor
                              )
                            }
                          >
                            Book Appointment
                          </button>

                        </div>

                      </div>

                    </div>
                  );
                }
              )}

            </div>

          )}

        </section>

        {/* =====================================================
            MY APPOINTMENTS
        ===================================================== */}

        <section className="my-appointments-section">

          <div className="section-heading">

            <div>
              <h2>
                My Appointments
              </h2>

              <p>
                View your upcoming and previous
                appointments.
              </p>
            </div>

          </div>

          {appointmentsLoading ? (

            <div className="appointment-loading">

              <div className="appointment-spinner"></div>

              <p>
                Loading appointments...
              </p>

            </div>

          ) : appointments.length === 0 ? (

            <div className="no-appointments">

              <h3>
                No appointments yet
              </h3>

              <p>
                Book an appointment with a
                doctor to see it here.
              </p>

            </div>

          ) : (

            <div className="appointments-table-wrapper">

              <table className="appointments-table">

                <thead>
                  <tr>
                    <th>Doctor</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Reason</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>

                  {appointments.map(
                    (appointment) => {

                      const doctor =
                        appointment.doctorId;

                      return (
                        <tr
                          key={
                            appointment._id
                          }
                        >

                          <td>
                            {typeof doctor ===
                            "object"
                              ? doctor.fullName ||
                                doctor.name ||
                                "Doctor"
                              : appointment.doctorName ||
                                "Doctor"}
                          </td>

                          <td>
                            {formatDate(
                              appointment.date
                            )}
                          </td>

                          <td>
                            {appointment.time ||
                              "N/A"}
                          </td>

                          <td>
                            {appointment.reason ||
                              "General Consultation"}
                          </td>

                          <td>

                            <span
                              className={`appointment-status status-${(
                                appointment.status ||
                                "pending"
                              ).toLowerCase()}`}
                            >
                              {appointment.status ||
                                "pending"}
                            </span>

                          </td>

                          <td>

                            {appointment.status !==
                              "rejected" &&
                              appointment.status !==
                                "completed" && (

                                <button
                                  type="button"
                                  className="cancel-appointment-btn"
                                  onClick={() =>
                                    handleCancelAppointment(
                                      appointment._id
                                    )
                                  }
                                >
                                  Cancel
                                </button>

                              )}

                          </td>

                        </tr>
                      );
                    }
                  )}

                </tbody>

              </table>

            </div>

          )}

        </section>

      </main>

      {/* =========================================================
          BOOKING MODAL
      ========================================================= */}

      {showModal &&
        selectedDoctor && (

          <div
            className="appointment-modal-overlay"
            onMouseDown={(event) => {

              if (
                event.target ===
                event.currentTarget
              ) {
                closeBookingModal();
              }

            }}
          >

            <div className="appointment-modal">

              <div className="appointment-modal-header">

                <div>

                  <h2>
                    Book Appointment
                  </h2>

                  <p>
                    with{" "}
                    <strong>
                      {selectedDoctor.fullName ||
                        selectedDoctor.name ||
                        "Doctor"}
                    </strong>
                  </p>

                </div>

                <button
                  type="button"
                  className="appointment-modal-close"
                  onClick={
                    closeBookingModal
                  }
                  disabled={
                    bookingLoading
                  }
                >
                  ×
                </button>

              </div>

              <form
                onSubmit={
                  handleBookAppointment
                }
                className="appointment-form"
              >

                {/* DATE */}

                <div className="appointment-form-group">

                  <label>
                    Appointment Date
                  </label>

                  <input
                    type="date"
                    value={bookingDate}
                    min={
                      new Date()
                        .toISOString()
                        .split("T")[0]
                    }
                    onChange={(e) =>
                      setBookingDate(
                        e.target.value
                      )
                    }
                    required
                  />

                </div>

                {/* TIME */}

                <div className="appointment-form-group">

                  <label>
                    Appointment Time
                  </label>

                  <input
                    type="time"
                    value={bookingTime}
                    onChange={(e) =>
                      setBookingTime(
                        e.target.value
                      )
                    }
                    required
                  />

                </div>

                {/* REASON */}

                <div className="appointment-form-group">

                  <label>
                    Reason for Appointment
                  </label>

                  <textarea
                    rows="4"
                    value={reason}
                    onChange={(e) =>
                      setReason(
                        e.target.value
                      )
                    }
                    placeholder="Describe the reason for your appointment..."
                    required
                  />

                </div>

                {/* ACTIONS */}

                <div className="appointment-modal-actions">

                  <button
                    type="button"
                    className="appointment-cancel-btn"
                    onClick={
                      closeBookingModal
                    }
                    disabled={
                      bookingLoading
                    }
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="appointment-confirm-btn"
                    disabled={
                      bookingLoading
                    }
                  >
                    {bookingLoading
                      ? "Booking..."
                      : "Confirm Appointment"}
                  </button>

                </div>

              </form>

            </div>

          </div>

        )}

      {/* =========================================================
          DOCTOR PROFILE MODAL
      ========================================================= */}

      {showDoctorProfile &&
        profileDoctor && (

          <div
            className="doctor-profile-modal-overlay"
            onMouseDown={(event) => {

              if (
                event.target ===
                event.currentTarget
              ) {
                closeDoctorProfile();
              }

            }}
          >

            <div className="doctor-profile-modal">

              {/* HEADER */}

              <div className="doctor-profile-modal-header">

                <div>

                  <h2>
                    Doctor Profile
                  </h2>

                  <p>
                    Professional information
                  </p>

                </div>

                <button
                  type="button"
                  className="doctor-profile-close-btn"
                  onClick={
                    closeDoctorProfile
                  }
                >
                  ×
                </button>

              </div>

              {/* CONTENT */}

              <div className="doctor-profile-content">

                {/* PROFILE TOP */}

                <div className="doctor-profile-top">

                  <div className="doctor-profile-image">

                    {getProfileDoctorPhoto(
                      profileDoctor
                    ) ? (

                      <img
                        src={getProfileDoctorPhoto(
                          profileDoctor
                        )}
                        alt={
                          profileDoctor.fullName ||
                          profileDoctor.name ||
                          "Doctor"
                        }
                      />

                    ) : (

                      <div className="doctor-profile-placeholder">
                        {getDoctorInitial(
                          profileDoctor
                        )}
                      </div>

                    )}

                  </div>

                  <div className="doctor-profile-main-info">

                    <h2>
                      {profileDoctor.fullName ||
                        profileDoctor.name ||
                        "Doctor"}
                    </h2>

                    <p className="doctor-profile-specialization">
                      {profileDoctor.specialization ||
                        "Medical Specialist"}
                    </p>

                    {profileDoctor.experience !==
                      undefined &&
                      profileDoctor.experience !==
                        null && (
                        <p className="doctor-profile-experience">
                          {profileDoctor.experience}{" "}
                          years of experience
                        </p>
                      )}

                  </div>

                </div>

                {/* PROFESSIONAL INFORMATION */}

                <div className="doctor-profile-information">

                  <h3>
                    Professional Information
                  </h3>

                  <div className="doctor-profile-grid">

                    <div className="doctor-profile-info-card">

                      <span>
                        Specialization
                      </span>

                      <strong>
                        {profileDoctor.specialization ||
                          "N/A"}
                      </strong>

                    </div>

                    <div className="doctor-profile-info-card">

                      <span>
                        Qualification
                      </span>

                      <strong>
                        {profileDoctor.qualifications ||
                          "N/A"}
                      </strong>

                    </div>

                    <div className="doctor-profile-info-card">

                      <span>
                        Experience
                      </span>

                      <strong>
                        {profileDoctor.experience !==
                          undefined &&
                        profileDoctor.experience !==
                          null
                          ? `${profileDoctor.experience} years`
                          : "N/A"}
                      </strong>

                    </div>

                    <div className="doctor-profile-info-card">

                      <span>
                        Medical License
                      </span>

                      <strong>
                        {profileDoctor.license ||
                          "N/A"}
                      </strong>

                    </div>

                    <div className="doctor-profile-info-card">

                      <span>
                        Gender
                      </span>

                      <strong>
                        {profileDoctor.gender ||
                          "N/A"}
                      </strong>

                    </div>

                    <div className="doctor-profile-info-card">

                      <span>
                        Phone
                      </span>

                      <strong>
                        {profileDoctor.phone ||
                          "N/A"}
                      </strong>

                    </div>

                    <div className="doctor-profile-info-card">

                      <span>
                        Email
                      </span>

                      <strong>
                        {profileDoctor.email ||
                          "N/A"}
                      </strong>

                    </div>

                  </div>

                </div>

                {/* BIO */}

                <div className="doctor-profile-bio-section">

                  <h3>
                    About Doctor
                  </h3>

                  <p>
                    {profileDoctor.bio ||
                      "No professional biography has been provided by this doctor."}
                  </p>

                </div>

                {/* ACTIONS */}

                <div className="doctor-profile-actions">

                  <button
                    type="button"
                    className="doctor-profile-close-action"
                    onClick={
                      closeDoctorProfile
                    }
                  >
                    Close
                  </button>

                  <button
                    type="button"
                    className="doctor-profile-book-action"
                    onClick={() => {

                      closeDoctorProfile();

                      openBookingModal(
                        profileDoctor
                      );

                    }}
                  >
                    Book Appointment
                  </button>

                </div>

              </div>

            </div>

          </div>

        )}

      <Footer />
    </>
  );
};

export default Appointment;