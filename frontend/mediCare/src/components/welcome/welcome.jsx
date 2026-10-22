import { useState } from "react";
import "./welocme1.css";
import BackgroundImage from "../../assets/welcome page/MediCare1.png";
import AppointmentImage from "../../assets/welcome page/appointment.png";
import CalculationImage from "../../assets/welcome page/calculation.png";
import SupportImage from "../../assets/welcome page/support.png";
import RecordsImage from "../../assets/welcome page/records1.png";
import SymptomsImage from "../../assets/welcome page/symptoms.png";
import RemindersImage from "../../assets/welcome page/reminders.png";
import BlogImage from "../../assets/welcome page/blog.jpg";
import BloggImage from "../../assets/welcome page/blog2.avif";
import BlogggImage from "../../assets/welcome page/blog3.avif";
import Footer from "../footer/footer";
import Register from "../register/register";
import Login from "../login/login";

function Welcome() {
  return (
    <>
      {/* <Welcome_nav /> */}
      <div className='welcome'>
        {/* <!--navigation bar--> */}
        <nav className='welcome-navbar navbar navbar-expand-lg '>
          <div className=' content container-fluid '>
            <a className='navbar-brand' href='#'>
              MediCare
            </a>
            <button
              className='navbar-toggler'
              type='button'
              data-bs-toggle='collapse'
              data-bs-target='#navbarNav'
            >
              <span className='navbar-toggler-icon'></span>
            </button>
            <div
              className='collapse navbar-collapse justify-content-end'
              id='navbarNav'
            >
              <ul className='welcome-link navbar-nav'>
                <li className='navbar-item'>
                  <a className='nav-link' href='#'>
                    Home
                  </a>
                </li>

                <li className='navbar-item'>
                  <a className='nav-link' href='#about'>
                    About
                  </a>
                </li>
                <li className='navbar-item'>
                  <a className='nav-link' href='#features'>
                    Features
                  </a>
                </li>
                <li className='navbar-item'>
                  <a className='nav-link' href='#contact'>
                    Contact
                  </a>
                </li>
                <li className='navbar-item'>
                  <a className='nav-link' href='Register'>
                    Register
                  </a>
                </li>
                <li className='navbar-item'>
                  <a className='nav-link' href='Login' target='_blank'>
                    Login
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        {/* <!--hero section--> */}
        <div className='hero-section text-white text-center d-flex align-items-center'>
          <div className='center wel_container'>
            <img src={BackgroundImage} className='mb-3' alt='Logo' />
            {/* <h5 className='mb-3'>WELCOME</h5> */}
            <h1 className='display-5 fw-bold'>
              Connecting You to <br />
              Better Health
            </h1>
            <p className='lead mb-4'>
              Connect patients with doctors for convenient <br />
              health access & care solutions.
            </p>
            <div className='btn-gap'>
              <a href='Register' className='btn btn-outline-light btn-lg'>
                Register
              </a>
              <a
                href='Login'
                className='btn btn-outline-light btn-lg'
                style={{ marginLeft: "15px" }}
              >
                Login
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className='app-wrapper'>
        <div className='containerMain'>
          {/* <!--About us section--> */}

          <div id='about my-5'>
            <section className='aboutclass py-5  text-center'>
              <div className='conatiner content'>
                <h2 className='mb-4'>About MediCare</h2>
                <p className='lead'>
                  Medicare bridges the gap between patients and doctors seamless
                  digital interaction. Our platform empowers better healthcare
                  outcomes by tracking your health, booking virtual
                  consultations, getingt AI-powered health advice, and managing
                  medical records—all in one place.
                  <br />
                  Simple. Secure. Smarter healthcare.
                </p>
              </div>
            </section>
          </div>

          {/* <!--features--> */}
          <div id='features'>
            <section className='features py-5 text-center'>
              <div className='container'>
                <h2 className='mb=4'>Why Choose Us?</h2>
                <div className='row'>
                  <div className='col-md-4'>
                    <img
                      src={AppointmentImage}
                      className='feature img-fluid mb-3'
                      alt='Appointment'
                    ></img>
                    <h5>Easy Appointments</h5>
                    <p>Book Consultations with just a few clicks.</p>
                  </div>
                  <div className='col-md-4'>
                    <img
                      src={SupportImage}
                      className='feature img-fluid mb-3'
                      alt='support'
                    ></img>
                    <h5>Support</h5>
                    <p>Access healthcare anytime, anywhere.</p>
                  </div>

                  <div className='col-md-4'>
                    <img
                      src={CalculationImage}
                      className='feature img-fluid mb-3'
                      alt='calculator'
                    ></img>
                    <h5>calculate</h5>
                    <p>calculate your BMI, BMR and calories</p>
                  </div>
                  <div className='col-md-4'>
                    <img
                      src={RecordsImage}
                      className='feature img-fluid mb-3'
                      alt='Records'
                    ></img>
                    <h5>Health Records</h5>
                    <p>Securely store and access your medical data</p>
                  </div>
                  <div className='col-md-4'>
                    <img
                      src={SymptomsImage}
                      className='feature img-fluid mb-3'
                      alt='Symptoms Tracker'
                    ></img>
                    <h5>Symptoms Tracker</h5>
                    <p>
                      Monitor the health issues that matter to you all in one
                      place.
                    </p>
                  </div>
                  <div className='col-md-4'>
                    <img
                      src={RemindersImage}
                      className='feature img-fluid mb-3'
                      alt='Reminders'
                    ></img>
                    <h5>Reminders</h5>
                    <p>Never miss a dose or appointment again.</p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* <!--Blog section--> */}
          <section className='py-5 text-center'>
            <div className='container'>
              <h2>Latest from Our Health Blog</h2>
              <div className='row'>
                {/* <!-- Blog Post 1--> */}
                <div className='col-md-4 mb-4'>
                  <div className='card blog-card h-100 shadow-sm'>
                    <img
                      src={BlogImage}
                      className='card-img-top'
                      alt='Blog 1'
                    ></img>
                    <div className='card-body'>
                      <h5 className='card-title'>
                        5 Simple Habits for a Healthier Life
                      </h5>
                      <p className='card-text'>
                        Learn how small daily habits can greatly improve your
                        overall well-being.
                      </p>
                      <a href='#' className='btn btn-outline-primary btn-sm'>
                        Read More
                      </a>
                    </div>
                  </div>
                </div>
                {/* <!-- Blog Post 2--> */}
                <div className='col-md-4 mb-4'>
                  <div className='card blog-card h-100 shadow-sm'>
                    <img
                      src={BloggImage}
                      className='card-img-top'
                      alt='Blog 2'
                    ></img>
                    <div className='card-body'>
                      <h5 className='card-title'>
                        understanding BMI, BMR and what they means
                      </h5>
                      <p className='card-text'>
                        Learn how small daily habits can greatly improve your
                        overall well-being.
                      </p>
                      <a href='#' className='btn btn-outline-primary btn-sm'>
                        Read More
                      </a>
                    </div>
                  </div>
                </div>
                {/* <<!-- Blog Post 3-->> */}
                <div className='col-md-4 mb-4'>
                  <div className='card blog-card h-100 shadow-sm'>
                    <img
                      src={BlogggImage}
                      className='card-img-top'
                      alt='Blog 3'
                    ></img>
                    <div className='card-body'>
                      <h5 className='card-title'>
                        how to prepare for virtual doctor visit
                      </h5>
                      <p className='card-text'>
                        Learn how small daily habits can greatly improve your
                        overall well-being.
                      </p>
                      <a href='#' className='btn btn-outline-primary btn-sm'>
                        Read More
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          {/* contact section */}
          <div id='contact'>
            <section className=' contact py-1 '>
              <div className='contact-container'>
                <h2 className='text-center mb-5  fw-bold'>Contact Us</h2>
                <div className='row g-4 justify-content-center'>
                  {/* Contact Form Box */}
                  <div className='col-lg-6'>
                    <div className='card shadow p-4'>
                      <h4 className='mb-4 text-center'>Send us a message</h4>
                      <form>
                        <div className='mb-3'>
                          <label className='form-label'>Your Name</label>
                          <input
                            type='text'
                            className='form-control'
                            placeholder='Enter your name'
                            required
                          />
                        </div>
                        <div className='mb-3'>
                          <label className='form-label'>Your Email</label>
                          <input
                            type='email'
                            className='form-control'
                            placeholder='Enter your email'
                            required
                          />
                        </div>
                        <div className='mb-3'>
                          <label className='form-label'>Your Message</label>
                          <textarea
                            className='form-control'
                            rows='5'
                            placeholder='Type your message...'
                            required
                          ></textarea>
                        </div>
                        <div className='text-center'>
                          <button
                            type='submit'
                            className='btn btn-primary px-4'
                          >
                            Send Message
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>

                  {/* Location Info or Map */}
                  <div className='col-lg-5'>
                    <div className='card shadow p-4 h-100'>
                      <h4 className='mb-3 text-center'>Our Location</h4>
                      <p>
                        <strong>Address:</strong>
                        <br />
                        MediCare Health Solutions
                        <br />
                        123 Wellness Street,
                        <br />
                        New Delhi, India - 110001
                      </p>
                      <div className='ratio ratio-16x9 mt-3'>
                        <iframe
                          src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d224345.83930156955!2d77.06889935266196!3d28.527554409101586!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce358f5b8e5f1%3A0xf8471c240e169ce9!2sDelhi!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin'
                          width='100%'
                          height='100%'
                          style={{ border: 0 }}
                          allowFullScreen=''
                          loading='lazy'
                          title='Google Map'
                        ></iframe>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Frequently asked question */}
          <section className='faq-section d-flex align-items-center justify-content-center mt-0'>
            <div className='container' style={{ maxWidth: "720px" }}>
              <div className='bg-white rounded shadow p-4'>
                <h2 className='mb-4 text-center fw-bold '>
                  Frequently Asked Questions
                </h2>

                <div className='accordion accordion-flush' id='faqAccordion'>
                  {/* FAQ 1 */}
                  <div className='accordion-item border mb-3 rounded'>
                    <h2 className='question accordion-header'>
                      <button
                        className='accordion-button collapsed fw-semibold'
                        type='button'
                        data-bs-toggle='collapse'
                        data-bs-target='#faq1'
                      >
                        🔐 Is my health data safe?
                      </button>
                    </h2>
                    <div
                      id='faq1'
                      className='accordion-collapse collapse'
                      data-bs-parent='#faqAccordion'
                    >
                      <div className='accordion-body text-start'>
                        Absolutely. We use encrypted storage and secure
                        authentication to protect your health records and
                        personal data.
                      </div>
                    </div>
                  </div>

                  {/* FAQ 2 */}
                  <div className='accordion-item border mb-3 rounded'>
                    <h2 className='accordion-header'>
                      <button
                        className='accordion-button collapsed fw-semibold'
                        type='button'
                        data-bs-toggle='collapse'
                        data-bs-target='#faq2'
                      >
                        🏥 Can I book a physical appointment?
                      </button>
                    </h2>
                    <div
                      id='faq2'
                      className='accordion-collapse collapse'
                      data-bs-parent='#faqAccordion'
                    >
                      <div className='accordion-body text-start'>
                        Yes, if the doctor supports in-clinic visits. Their
                        profile will indicate availability for in-person
                        appointments.
                      </div>
                    </div>
                  </div>

                  {/* FAQ 3 */}
                  <div className='accordion-item border mb-3 rounded'>
                    <h2 className='accordion-header'>
                      <button
                        className='accordion-button collapsed fw-semibold'
                        type='button'
                        data-bs-toggle='collapse'
                        data-bs-target='#faq3'
                      >
                        💊 Can I track my medications?
                      </button>
                    </h2>
                    <div
                      id='faq3'
                      className='accordion-collapse collapse'
                      data-bs-parent='#faqAccordion'
                    >
                      <div className='accordion-body text-start'>
                        Yes. You can add, track, and get reminders for ongoing
                        medications under the "Medications" section of your
                        dashboard.
                      </div>
                    </div>
                  </div>

                  {/* FAQ 4 */}
                  <div className='accordion-item border mb-3 rounded'>
                    <h2 className='accordion-header'>
                      <button
                        className='accordion-button collapsed fw-semibold'
                        type='button'
                        data-bs-toggle='collapse'
                        data-bs-target='#faq4'
                      >
                        📄 How do I upload medical reports?
                      </button>
                    </h2>
                    <div
                      id='faq4'
                      className='accordion-collapse collapse'
                      data-bs-parent='#faqAccordion'
                    >
                      <div className='accordion-body text-start'>
                        Go to the "Medical Records" section and use the upload
                        button to add PDF or image copies of your test reports
                        or prescriptions.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* <Footer /> */}

      <footer className=' foot'>
        <div className='mainFooter'>
          <div className='py-4'>
            <div className='row'>
              {/* Left Column */}
              <div className='col-md-4 mb-3'>
                <h5>MediCare</h5>
                <p>
                  Your all-in-one health monitoring and consultation platform.
                </p>
              </div>

              {/* Quick Links */}
              <div className='col-md-4 mb-3'>
                <h6>Quick Links</h6>
                <ul className='list-unstyled'>
                  <li>
                    <a
                      href='/dashboard'
                      className='text-white text-decoration-none'
                    >
                      Dashboard
                    </a>
                  </li>
                  <li>
                    <a
                      href='/doctor/appointments'
                      className='text-white text-decoration-none'
                    >
                      Appointments
                    </a>
                  </li>
                  <li>
                    <a
                      href='/doctor/patients'
                      className='text-white text-decoration-none'
                    >
                      Patients
                    </a>
                  </li>
                  <li>
                    <a
                      href='/doctor/blogs'
                      className='text-white text-decoration-none'
                    >
                      Blogs
                    </a>
                  </li>
                </ul>
              </div>

              {/* Contact Info */}
              <div className='col-md-4 mb-3'>
                <h6>Contact</h6>
                <p>Email: support@smartdoc.com</p>
                <p>Phone: +91-98765-43210</p>
                <p>Location: New Delhi, India</p>
              </div>
            </div>

            <hr className='border-light' />

            <div className='text-center'>
              <small>
                © {new Date().getFullYear()} MediCare. All rights reserved.
              </small>
            </div>

            {/* <ChatBot /> */}
          </div>
        </div>
      </footer>
    </>
  );
}

export default Welcome;
