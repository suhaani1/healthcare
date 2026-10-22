import React, { useEffect, useState } from "react";
import "./profile.css";
import avatarImg from "../../assets/welcome page/doctor.jpg";
import PatientNavbar from "./navbar";
import Footer from "../footer/footer";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:3010";

function ProfileUpdate() {
  const navigate = useNavigate();

  const email = localStorage.getItem("email");

  const [formData, setFormData] = useState({
    fullName: "",
    email: email || "",
    phone: "",
    age: "",
    gender: "",
    height: "",
    weight: "",
    profileImage: "",
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // =========================================================
  // FETCH PATIENT PROFILE
  // =========================================================

  useEffect(() => {
    const fetchProfile = async () => {
      if (!email) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `${API_URL}/patient/dashboard?email=${encodeURIComponent(email)}`
        );

        console.log("Profile response:", response.data);

        const profile = response.data?.profile;

        if (profile) {
          setFormData({
            fullName: profile.fullName || "",
            email: profile.email || email,
            phone: profile.phone || "",
            age: profile.age || "",
            gender: profile.gender || "",
            height: profile.height || "",
            weight: profile.weight || "",
            profileImage: profile.profileImage || "",
          });

          // Save patient ID
          if (profile._id) {
            localStorage.setItem("patientId", profile._id);
          }

          // Existing profile image
          if (profile.profileImage) {
            let imageUrl = profile.profileImage;

            if (
              typeof imageUrl === "string" &&
              !imageUrl.startsWith("http") &&
              !imageUrl.startsWith("blob:")
            ) {
              if (imageUrl.startsWith("/")) {
                imageUrl = `${API_URL}${imageUrl}`;
              } else {
                imageUrl = `${API_URL}/uploads/${imageUrl}`;
              }
            }

            setPreviewImage(imageUrl);
          }
        }
      } catch (error) {
        console.error(
          "Error fetching profile:",
          error.response?.data || error.message
        );

        alert("Unable to load your profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [email]);

  // =========================================================
  // HANDLE INPUT
  // =========================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =========================================================
  // HANDLE IMAGE
  // =========================================================

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      return;
    }

    // Check file size - 5 MB
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be less than 5 MB.");
      return;
    }

    setSelectedFile(file);

    const imageUrl = URL.createObjectURL(file);
    setPreviewImage(imageUrl);
  };

  // =========================================================
  // SUBMIT PROFILE
  // =========================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.fullName.trim()) {
      alert("Please enter your full name.");
      return;
    }

    if (!formData.phone.trim()) {
      alert("Please enter your phone number.");
      return;
    }

    if (formData.age && Number(formData.age) <= 0) {
      alert("Please enter a valid age.");
      return;
    }

    if (formData.height && Number(formData.height) <= 0) {
      alert("Please enter a valid height.");
      return;
    }

    if (formData.weight && Number(formData.weight) <= 0) {
      alert("Please enter a valid weight.");
      return;
    }

    if (!email) {
      alert("Patient email not found. Please login again.");
      navigate("/login");
      return;
    }

    try {
      setSaving(true);

      const payload = new FormData();

      payload.append("fullName", formData.fullName.trim());
      payload.append("email", formData.email);
      payload.append("phone", formData.phone.trim());
      payload.append("age", formData.age);
      payload.append("gender", formData.gender);
      payload.append("height", formData.height);
      payload.append("weight", formData.weight);

      // Only send actual file
      if (selectedFile) {
        payload.append("profileImage", selectedFile);
      }

      console.log("Updating patient profile...");

      const response = await axios.post(
        `${API_URL}/patient/profile`,
        payload
      );

      console.log(
        "Profile update response:",
        response.data
      );

      // Save updated information
      localStorage.setItem(
        "profileUpdatedAt",
        Date.now().toString()
      );

      alert("Profile updated successfully.");

      navigate("/patient/dashboard");
    } catch (error) {
      console.error(
        "Profile update error:",
        error.response?.data || error.message
      );

      const message =
        error.response?.data?.message ||
        "Failed to update profile. Please try again.";

      alert(message);
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // CANCEL
  // =========================================================

  const handleCancel = () => {
    navigate("/patient/dashboard");
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <>
        <PatientNavbar />

        <main className="profile-page">
          <div className="profile-loading">
            <div className="profile-spinner"></div>

            <p>Loading profile...</p>
          </div>
        </main>

        <Footer />
      </>
    );
  }

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <>
      <PatientNavbar />

      <main className="profile-page">

        {/* PAGE HEADER */}
        <div className="profile-page-header">

          <div>
            <h1>My Profile</h1>

            <p>
              View and update your personal information.
            </p>
          </div>

          <button
            type="button"
            className="profile-back-btn"
            onClick={handleCancel}
          >
            Back to Dashboard
          </button>

        </div>

        {/* PROFILE CONTENT */}
        <div className="profile-layout">

          {/* PROFILE PREVIEW */}
          <section className="profile-preview-card">

            <div className="profile-preview-image-wrapper">

              <img
                src={previewImage || avatarImg}
                alt="Patient profile"
                className="profile-preview-image"
              />

            </div>

            <h2>
              {formData.fullName || "Patient"}
            </h2>

            <p className="profile-role">
              Patient
            </p>

            <div className="profile-email">
              {formData.email}
            </div>

            <div className="profile-divider"></div>

            <div className="profile-basic-info">

              <div>
                <span>Age</span>
                <strong>
                  {formData.age || "Not provided"}
                </strong>
              </div>

              <div>
                <span>Gender</span>
                <strong>
                  {formData.gender
                    ? formData.gender.charAt(0).toUpperCase() +
                      formData.gender.slice(1)
                    : "Not provided"}
                </strong>
              </div>

              <div>
                <span>Height</span>
                <strong>
                  {formData.height
                    ? `${formData.height} cm`
                    : "Not provided"}
                </strong>
              </div>

              <div>
                <span>Weight</span>
                <strong>
                  {formData.weight
                    ? `${formData.weight} kg`
                    : "Not provided"}
                </strong>
              </div>

            </div>

          </section>

          {/* EDIT PROFILE */}
          <section className="profile-form-card">

            <div className="profile-form-header">
              <h2>Personal Information</h2>

              <p>
                Keep your information up to date.
              </p>
            </div>

            <form onSubmit={handleSubmit}>

              {/* PROFILE IMAGE */}
              <div className="profile-image-upload">

                <img
                  src={previewImage || avatarImg}
                  alt="Profile preview"
                  className="profile-upload-preview"
                />

                <div className="profile-upload-content">

                  <h3>Profile Photo</h3>

                  <p>
                    JPG, PNG or WEBP. Maximum size 5 MB.
                  </p>

                  <label
                    htmlFor="profileImage"
                    className="profile-upload-btn"
                  >
                    Choose Photo
                  </label>

                  <input
                    id="profileImage"
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    onChange={handleImageUpload}
                    hidden
                  />

                  {selectedFile && (
                    <span className="selected-file-name">
                      {selectedFile.name}
                    </span>
                  )}

                </div>

              </div>

              {/* FULL NAME */}
              <div className="profile-form-group">

                <label htmlFor="fullName">
                  Full Name
                </label>

                <input
                  id="fullName"
                  type="text"
                  name="fullName"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />

              </div>

              {/* EMAIL */}
              <div className="profile-form-group">

                <label htmlFor="email">
                  Email Address
                </label>

                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  readOnly
                  className="readonly-input"
                />

                <small>
                  Email address cannot be changed here.
                </small>

              </div>

              {/* PHONE */}
              <div className="profile-form-group">

                <label htmlFor="phone">
                  Phone Number
                </label>

                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />

              </div>

              {/* AGE + GENDER */}
              <div className="profile-form-row">

                <div className="profile-form-group">

                  <label htmlFor="age">
                    Age
                  </label>

                  <input
                    id="age"
                    type="number"
                    name="age"
                    min="1"
                    max="120"
                    placeholder="Age"
                    value={formData.age}
                    onChange={handleChange}
                  />

                </div>

                <div className="profile-form-group">

                  <label htmlFor="gender">
                    Gender
                  </label>

                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                  >
                    <option value="">
                      Select Gender
                    </option>

                    <option value="male">
                      Male
                    </option>

                    <option value="female">
                      Female
                    </option>

                    <option value="other">
                      Other
                    </option>
                  </select>

                </div>

              </div>

              {/* HEIGHT + WEIGHT */}
              <div className="profile-form-row">

                <div className="profile-form-group">

                  <label htmlFor="height">
                    Height (cm)
                  </label>

                  <input
                    id="height"
                    type="number"
                    name="height"
                    min="1"
                    placeholder="Height"
                    value={formData.height}
                    onChange={handleChange}
                  />

                </div>

                <div className="profile-form-group">

                  <label htmlFor="weight">
                    Weight (kg)
                  </label>

                  <input
                    id="weight"
                    type="number"
                    name="weight"
                    min="1"
                    placeholder="Weight"
                    value={formData.weight}
                    onChange={handleChange}
                  />

                </div>

              </div>

              {/* BUTTONS */}
              <div className="profile-form-actions">

                <button
                  type="button"
                  className="profile-cancel-btn"
                  onClick={handleCancel}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="profile-save-btn"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : "Save Changes"}
                </button>

              </div>

            </form>

          </section>

        </div>

      </main>

      <Footer />
    </>
  );
}

export default ProfileUpdate;