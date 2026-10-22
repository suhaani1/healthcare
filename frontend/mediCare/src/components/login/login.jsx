import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../register/register.css";
import BackgroundImage from "../../assets/welcome page/Medicare.png";
import RegisterImage from "../../assets/welcome page/register.png";

function Login() {
  const navigate = useNavigate();

  const [userType, setUserType] = useState("");
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userType || !formData.email || !formData.password) {
      setErrorMsg("Please fill in all fields.");
      setSuccessMsg("");
      return;
    }

    try {
      const response = await axios.post("http://127.0.0.1:3010/log/login", {
        userType,
        ...formData,
      });

      const { token, user } = response.data;

      // Store in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("userType", user.userType);
      localStorage.setItem("email", user.email);
      

      // Correct IDs
if (user.userType === "doctor") {
   localStorage.setItem("doctorId", user._id);
} else {
  localStorage.setItem("patientId", user._id);
}

      setSuccessMsg("Login successful!");
      setErrorMsg("");

      // Redirect based on userType
      setTimeout(() => {
        if (user.userType === "doctor") {
          navigate("/doc/dash");
          //  localStorage.setItem("doctorId", user._id); 
        } else {
          navigate("/patient/dashboard");
          // localStorage.setItem("patientId", user._id);
        }
      }, 1000);
    } catch (err) {
      if (err.response?.data?.message) {
        setErrorMsg(err.response.data.message);
      } else {
        setErrorMsg("Something went wrong. Please try again.");
      }
      setSuccessMsg("");
    }
  };

  return (
    <div className="container-fluid bgColor">
      <div className="container layout">
        <div className="card">
          <div className="row pt-0">
            {/* Left image */}
            <div className="col-lg-6 d-none d-sm-flex align-items-center">
              <img
                src={RegisterImage}
                className="img-fluid logo-slide-float"
                alt="register"
              />
            </div>

            {/* Right form */}
            <div className="col-lg-6 col-12 d-flex align-items-center">
              <div className="signup-box w-100">
                {/* Logo */}
                <div className="d-flex justify-content-center mb-4">
                  <img src={BackgroundImage} alt="logo" height="100" />
                </div>

                <div className="row justify-content-center">
                  <div className="col-lg-11 col-12 heading-container">
                    <h4 className="welcome-heading text-center">
                      Login to MediCare
                    </h4>
                  </div>

                  {/* Alert messages */}
                  {errorMsg && (
                    <div className="alert alert-danger text-center w-75 mx-auto">
                      {errorMsg}
                    </div>
                  )}
                  {successMsg && (
                    <div className="alert alert-success text-center w-75 mx-auto">
                      {successMsg}
                    </div>
                  )}

                  {/* Form */}
                  <form onSubmit={handleSubmit}>
                    <div className="mb-4 col-lg-8 col-11 mx-auto">
                      <label htmlFor="userType" className="form-label">
                        Login as
                      </label>
                      <select
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

                    <div className="mb-4 col-lg-8 col-11 mx-auto">
                      <label htmlFor="email" className="form-label">
                        Email
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        placeholder="name@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="mb-2 col-lg-8 col-11 mx-auto">
                      <label htmlFor="password" className="form-label">
                        Password
                      </label>
                      <input
                        type="password"
                        className="form-control"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    {/* Forgot password link */}
                    <div className="mb-4 col-lg-8 col-11 mx-auto text-end">
                      <a
                        href="/forgot-password"
                        className="text-decoration-none text-primary"
                        style={{ fontSize: "0.9rem" }}
                      >
                        Forgot Password?
                      </a>
                    </div>

                    {/* Login Button */}
                    <div className="col-12 text-center">
                      <button
                        type="submit"
                        className="btn btn-primary px-4 mb-3"
                      >
                        Login
                      </button>
                    </div>
                  </form>

                  <div className="text-center mt-2">
                    <small>
                      Don’t have an account?{" "}
                      <a href="/register" className="text-primary">
                        Register here
                      </a>
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
