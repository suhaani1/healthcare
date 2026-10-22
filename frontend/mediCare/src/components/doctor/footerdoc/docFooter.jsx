import React from 'react';
import '../../doctorStyle/docFooter.css';
import { FaEnvelope, FaPhoneAlt, FaLinkedin, FaGithub } from 'react-icons/fa';

const DoctorFooter = () => {
  return (
    <footer className="doctor-footer mt-5">
      <div className="container py-4">
        <div className="row text-light">

          {/* About */}
          <div className="col-md-4 mb-4">
            <h5 className="footer-title">About MediCare</h5>
            <p className="small">
              MediCare Doctor Portal is your digital healthcare partner. Track appointments, view patient info, and manage your workflow securely and efficiently.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-md-4 mb-4">
            <h5 className="footer-title">Quick Links</h5>
            <ul className="list-unstyled small">
              <li><a href="/doc/dashboard">Dashboard</a></li>
              <li><a href="/doc/profile">Profile</a></li>
              <li><a href="/patientview">Patients</a></li>
              <li><a href="/doc/appointment">Appointments</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-md-4 mb-4">
            <h5 className="footer-title">Contact Us</h5>
            <p className="small">
              <FaEnvelope className="me-2" /> support@medicare.com<br />
              <FaPhoneAlt className="me-2" /> +91-9876543210
            </p>
            <div className="social-icons mt-2">
              <a href="#" title="LinkedIn"><FaLinkedin /></a>
              <a href="#" title="GitHub"><FaGithub /></a>
            </div>
          </div>
        </div>

        <hr className="bg-light" />
        <div className="text-center text-light small">
          © {new Date().getFullYear()} <strong>MediCare Doctor Portal</strong>. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default DoctorFooter;
