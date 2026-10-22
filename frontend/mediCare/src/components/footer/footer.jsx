import React from 'react';
import "./footer.css"
import ChatBot from '../ChatBot/Chatbot'

const Footer = () => {
  return (
    <footer className="footer text-white mt-2">
      <div className="py-4">
        <div className="row">
          {/* Left Column */}
          <div className="col-md-4 mb-3">
            <h5>MediCare</h5>
            <p>Your all-in-one health monitoring and consultation platform.</p>
          </div>

          {/* Quick Links */}
          <div className="col-md-4 mb-3">
            <h6>Quick Links</h6>
            <ul className="list-unstyled">
              <li><a href="/dashboard" className="text-white text-decoration-none">Dashboard</a></li>
              <li><a href="/doctor/appointments" className="text-white text-decoration-none">Appointments</a></li>
              <li><a href="/doctor/patients" className="text-white text-decoration-none">Patients</a></li>
              <li><a href="/doctor/blogs" className="text-white text-decoration-none">Blogs</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-md-4 mb-3">
            <h6>Contact</h6>
            <p>Email: support@smartdoc.com</p>
            <p>Phone: +91-98765-43210</p>
            <p>Location: New Delhi, India</p>
          </div>
        </div>

        <hr className="border-light" />

        <div className="text-center">
          <small>© {new Date().getFullYear()} MediCare. All rights reserved.</small>
        </div>

   <ChatBot />

      </div>
  
    </footer>
  );
};

export default Footer;
