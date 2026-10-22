import React, { useState, useEffect } from "react";
import {
  Form,
  Button,
  Card,
  Row,
  Col,
  Alert,
  Spinner,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DoctorNavbar from "./nav";
import DoctorFooter from "./footerdoc/docFooter";
import "./profile.css";
import avatar from "../../assets/welcome page/docAvatar.png";

function DoctorProfile() {
  const [profile, setProfile] = useState({
    _id: "",
    fullName: "",
    specialization: "",
    experience: "",
    email: "",
    phone: "",
    bio: "",
    profilePhoto: "",
    qualifications: "",
    gender: "",
    license: "",
  });

  const [showAlert, setShowAlert] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const navigate = useNavigate();

  // =========================================================
  // LOAD DOCTOR PROFILE
  // =========================================================
  useEffect(() => {
    const email = localStorage.getItem("email");

    if (!email) {
      console.error("Doctor email not found.");
      setLoading(false);
      return;
    }

    axios
      .get(
        `http://localhost:3010/api/doctor/getDoctor/${encodeURIComponent(
          email
        )}`
      )
      .then((res) => {
        console.log("Doctor profile:", res.data);

        setProfile(res.data);

        // IMPORTANT:
        // Save doctor ID for appointments/patients/chat
        if (res.data._id) {
          localStorage.setItem(
            "doctorId",
            res.data._id
          );
        }

        if (res.data.fullName) {
          localStorage.setItem(
            "doctorName",
            res.data.fullName
          );
        }
      })
      .catch((err) => {
        console.error(
          "Error loading profile:",
          err.response?.data || err.message
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // =========================================================
  // INPUT CHANGE
  // =========================================================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================================================
  // IMAGE UPLOAD
  // =========================================================
  const handleImageUpload = (e) => {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      setProfile((prev) => ({
        ...prev,
        profilePhoto: reader.result,
      }));
    };

    reader.readAsDataURL(file);
  };

  // =========================================================
  // SAVE PROFILE
  // =========================================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const res = await axios.put(
        "http://localhost:3010/api/doctor/updateDoctor",
        profile
      );

      const updatedDoctor =
        res.data?.doctor || res.data;

      setProfile((prev) => ({
        ...prev,
        ...updatedDoctor,
      }));

      if (updatedDoctor?._id) {
        localStorage.setItem(
          "doctorId",
          updatedDoctor._id
        );
      }

      if (updatedDoctor?.fullName) {
        localStorage.setItem(
          "doctorName",
          updatedDoctor.fullName
        );
      }

      setShowAlert(true);

      setTimeout(() => {
        setShowAlert(false);

        navigate("/doc/dash", {
          state: {
            refresh: true,
          },
        });
      }, 1500);
    } catch (err) {
      console.error(
        "Update failed:",
        err.response?.data || err.message
      );

      alert(
        err.response?.data?.message ||
          "Profile update failed"
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // LOADING
  // =========================================================
  if (loading) {
    return (
      <>
        <DoctorNavbar />

        <div className="container text-center py-5">
          <Spinner animation="border" />

          <p className="mt-3">
            Loading doctor profile...
          </p>
        </div>

        <DoctorFooter />
      </>
    );
  }

  return (
    <>
      <DoctorNavbar />

      <div className="container my-5">
        <Card className="p-4 shadow doctor-profile-card">
          <h3 className="gradient-text mb-4 text-center">
            Doctor Profile
          </h3>

          {showAlert && (
            <Alert variant="success">
              Profile saved successfully!
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <Row>
              {/* =================================================
                  PROFILE IMAGE
              ================================================= */}
              <Col
                md={4}
                className="text-center mb-3"
              >
                <img
                  src={
                    profile.profilePhoto || avatar
                  }
                  className="rounded-circle border border-3 shadow-sm"
                  alt="Profile"
                  style={{
                    width: "160px",
                    height: "160px",
                    objectFit: "cover",
                  }}
                />

                <Form.Group
                  controlId="formFile"
                  className="mt-3"
                >
                  <Form.Label>
                    Profile Photo
                  </Form.Label>

                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </Form.Group>
              </Col>

              {/* =================================================
                  PROFILE INFORMATION
              ================================================= */}
              <Col md={8}>
                <Row>
                  {/* Full Name */}
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        Full Name
                      </Form.Label>

                      <Form.Control
                        type="text"
                        name="fullName"
                        value={profile.fullName}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>

                  {/* Specialization */}
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        Specialization
                      </Form.Label>

                      <Form.Control
                        type="text"
                        name="specialization"
                        value={
                          profile.specialization
                        }
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>

                  {/* Experience */}
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        Experience (Years)
                      </Form.Label>

                      <Form.Control
                        type="number"
                        name="experience"
                        value={
                          profile.experience
                        }
                        onChange={handleChange}
                        min="0"
                      />
                    </Form.Group>
                  </Col>

                  {/* Phone */}
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        Phone
                      </Form.Label>

                      <Form.Control
                        type="tel"
                        name="phone"
                        value={profile.phone}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>

                  {/* Email */}
                  <Col md={12}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        Email
                      </Form.Label>

                      <Form.Control
                        type="email"
                        value={profile.email}
                        disabled
                      />
                    </Form.Group>
                  </Col>

                  {/* License */}
                  <Col md={12}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        License
                      </Form.Label>

                      <Form.Control
                        type="text"
                        name="license"
                        value={profile.license}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>

                  {/* Qualifications */}
                  <Col md={12}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        Qualifications
                      </Form.Label>

                      <Form.Control
                        type="text"
                        name="qualifications"
                        value={
                          profile.qualifications
                        }
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>

                  {/* Gender */}
                  <Col md={12}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        Gender
                      </Form.Label>

                      <Form.Select
                        name="gender"
                        value={profile.gender}
                        onChange={handleChange}
                      >
                        <option value="">
                          Select Gender
                        </option>

                        <option value="Male">
                          Male
                        </option>

                        <option value="Female">
                          Female
                        </option>

                        <option value="Other">
                          Other
                        </option>
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  {/* Bio */}
                  <Col md={12}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        Bio
                      </Form.Label>

                      <Form.Control
                        as="textarea"
                        rows={3}
                        name="bio"
                        value={profile.bio}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                {/* Save */}
                <div className="text-end">
                  <Button
                    type="submit"
                    className="gradient-btn px-4"
                    disabled={saving}
                  >
                    {saving
                      ? "Saving..."
                      : "Save Profile"}
                  </Button>
                </div>
              </Col>
            </Row>
          </Form>
        </Card>
      </div>

      <DoctorFooter />
    </>
  );
}

export default DoctorProfile;