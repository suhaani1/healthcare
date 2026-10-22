import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../register/register.css";
import BackgroundImage from "../../assets/welcome page/MediCare1.png";
import RegisterImage from "../../assets/welcome page/register.png";

function Register() {
  const navigate = useNavigate();

  const [userType, setUserType] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    specialization: "",
    license: "",
    age: "",
    gender: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      userType,
      fullName: formData.fullName,
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
      specialization:
        userType === "doctor" ? formData.specialization : undefined,
      license: userType === "doctor" ? formData.license : undefined,
      age: userType === "patient" ? Number(formData.age) : undefined,
      gender: formData.gender.toLowerCase(), // always include gender
    };

    try {
      const response = await axios.post(
        "http://127.0.0.1:3010/admin/register",
        payload
      );
      alert("Registration successful");
      navigate("/");
    } catch (err) {
      console.error("Registration error:", err);
      if (err.response?.data?.message) {
        alert(err.response.data.message);
      } else {
        alert("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="container-fluid bgColor">
      <div className="container layout">
        <div className="card col-auto">
          <div className="row pt-1">
            <div className="col-lg-6 d-none d-lg-flex align-items-center">
              <img
                src={RegisterImage}
                className="img-fluid register-image logo-slide-float"
                alt="register"
              />
            </div>

            <div className="col-lg-6 col-12">
              <div className="text-center mb-4">
                <img src={BackgroundImage} alt="logo" height="100" />
                <h4 className="heading mt-3">Welcome to MediCare</h4>
              </div>

              <form
                id="signupForm"
                onSubmit={handleSubmit}
                className="row justify-content-center"
              >
                <div className="col-lg-8 col-11 mb-3">
                  <label htmlFor="userType" className="form-label">
                    Register as
                  </label>
                  <select
                    id="userType"
                    name="userType"
                    className="form-select"
                    value={userType}
                    onChange={(e) => setUserType(e.target.value)}
                    required
                  >
                    <option value="" disabled>
                      Choose user type
                    </option>
                    <option value="doctor">Doctor</option>
                    <option value="patient">Patient</option>
                  </select>
                </div>

                <div className="col-lg-8 col-11 mb-3">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    className="form-control"
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-lg-8 col-11 mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-lg-8 col-11 mb-3">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    name="password"
                    className="form-control"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-lg-8 col-11 mb-3">
                  <label className="form-label">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    className="form-control"
                    placeholder="+91-XXXXXXXXXX"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>

                {userType === "doctor" && (
                  <>
                    <div className="col-lg-8 col-11 mb-3">
                      <label className="form-label">Specialization</label>
                      <input
                        type="text"
                        name="specialization"
                        className="form-control"
                        placeholder="Cardiologist, Pediatrician..."
                        value={formData.specialization}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-lg-8 col-11 mb-3">
                      <label className="form-label">License Number</label>
                      <input
                        type="text"
                        name="license"
                        className="form-control"
                        placeholder="e.g., MCI123456"
                        value={formData.license}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </>
                )}

                {userType === "patient" && (
                  <div className="col-lg-8 col-11 mb-3">
                    <label className="form-label">Age</label>
                    <input
                      type="number"
                      name="age"
                      className="form-control"
                      placeholder="Your Age"
                      value={formData.age}
                      onChange={handleChange}
                      required
                    />
                  </div>
                )}

                <div className="col-lg-8 col-11 mb-3">
                  <label className="form-label">Gender</label>
                  <select
                    name="gender"
                    className="form-select"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                  >
                    <option value="" disabled>
                      Select gender
                    </option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="col-lg-8 col-11 d-flex justify-content-center">
                  <button type="submit" className="btn btn-primary w-100 mb-4">
                    Submit
                  </button>
                </div>
              </form>

              <div className="text-center mt-3">
                <small>
                  Already have an account? <a href="/Login">Log in</a>
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
