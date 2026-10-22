import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import "../patientStyle/logout.css"

const PatientLogout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // ✅ Clear patient session/localStorage/token
    localStorage.removeItem('patientToken');
    localStorage.removeItem('patientData');
    // 👇 Optional delay before redirecting
    const timer = setTimeout(() => {
      navigate('/');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="logout logout-container align-center mt-5 pt-4" >
      <div className="card shadow text-center p-5">
        <h2 className="text-success mb-3">👋 You’ve been logged out.</h2>
        <p className="text-muted">Thank you for using MediCare.</p>
        <p>Redirecting you to welcome page...</p>
        <button
          className="btn btn-outline-primary mt-3"
          onClick={() => navigate('/')}
        >
          Go to welcome Now
        </button>
      </div>
    </div>
  );
};

export default PatientLogout;
