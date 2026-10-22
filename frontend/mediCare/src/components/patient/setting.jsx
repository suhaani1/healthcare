import React, { useState } from "react";
import PatientNavbar from "./navbar";
import Footer from "../footer/footer";
import "../patientStyle/settings.css"

const PatientSettings = () => {
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    phone: "",
    dob: "",
    gender: "",
    height: "",
    weight: "",
    bloodGroup: "",
    allergies: "",
    receiveTips: true,
    shareData: false,
    avatar: null,
  });

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "checkbox") {
      setProfile({ ...profile, [name]: checked });
    } else if (files) {
      setProfile({ ...profile, avatar: URL.createObjectURL(files[0]) });
    } else {
      setProfile({ ...profile, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Update logic or API call
    alert("Profile updated successfully!");
  };

  return (
    <>
      <PatientNavbar />
      <div className="profile-container py-5">
        <div className="card p-4 shadow">
          <h3 className="text text-center mb-4 ">Patient Profile Settings</h3>
          <form onSubmit={handleSubmit} className="row g-3">

            <div className="col-md-6">
              <label className="form-label">Full Name</label>
              <input type="text" name="fullName" value={profile.fullName} onChange={handleChange} className="form-control" />
            </div>

            <div className="col-md-6">
              <label className="form-label">Email</label>
              <input type="email" name="email" value={profile.email} onChange={handleChange} className="form-control" />
            </div>

            <div className="col-md-6">
              <label className="form-label">Phone</label>
              <input type="text" name="phone" value={profile.phone} onChange={handleChange} className="form-control" />
            </div>

            <div className="col-md-6">
              <label className="form-label">Date of Birth</label>
              <input type="date" name="dob" value={profile.dob} onChange={handleChange} className="form-control" />
            </div>

            <div className="col-md-6">
              <label className="form-label">Gender</label>
              <select name="gender" value={profile.gender} onChange={handleChange} className="form-select">
                <option value="">Select</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>

            <div className="col-md-3">
              <label className="form-label">Height (cm)</label>
              <input type="number" name="height" value={profile.height} onChange={handleChange} className="form-control" />
            </div>

            <div className="col-md-3">
              <label className="form-label">Weight (kg)</label>
              <input type="number" name="weight" value={profile.weight} onChange={handleChange} className="form-control" />
            </div>

            <div className="col-md-3">
              <label className="form-label">Blood Group</label>
              <input type="text" name="bloodGroup" value={profile.bloodGroup} onChange={handleChange} className="form-control" />
            </div>

            <div className="col-md-3">
              <label className="form-label">Allergies</label>
              <input type="text" name="allergies" value={profile.allergies} onChange={handleChange} className="form-control" />
            </div>

            <div className="col-md-12">
              <label className="form-label">Profile Picture</label>
              <input type="file" name="avatar" onChange={handleChange} className="form-control" accept="image/*" />
              {profile.avatar && <img src={profile.avatar} alt="avatar" className="img-thumbnail mt-2" width="100" />}
            </div>

            <div className="col-md-6 form-check">
              <input type="checkbox" className="form-check-input" name="receiveTips" checked={profile.receiveTips} onChange={handleChange} />
              <label className="form-check-label">Receive Health Tips</label>
            </div>

            <div className="col-md-6 form-check">
              <input type="checkbox" className="form-check-input" name="shareData" checked={profile.shareData} onChange={handleChange} />
              <label className="form-check-label">Allow data sharing with doctors</label>
            </div>

            <div className="col-12 text-end">
              <button type="submit" className="btn btn-primary">Update Profile</button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PatientSettings;
