import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Welcome from "./components/welcome/welcome";
import { Routes, Route, Navigate } from "react-router-dom";
import Register from "./components/register/register";
import Login from "./components/login/login";
import Dashboard from "./components/patient/dashboard";
// import DoctorNavbar from './components/doctor/nav'
import Footer from "./components/footer/footer";
import DoctorDashboard from "./components/doctor/doc_dashboard";
import PatientProfile from "./components/patient/profile";
import HealthCalculator from "./components/patient/calculation.jsx";
import SymptomLogger from "./components/patient/symptomsLog.jsx";
import AppointmentPage from "./components/patient/appointment.jsx";
import MedicationsPage from "./components/patient/medications.jsx";
import MedicalRecords from "./components/patient/records.jsx";
import DoctorPatientView from "./components/patient/viewProfilee.jsx";
import PatientLogout from "./components/patient/logout.jsx";
import DoctorProfile from "./components/doctor/prfile.jsx";
// import AppointmentSchedule from "./components/doctor/appointment.jsx";
import HealthCards from "./components/patient/cards.jsx";
import DoctorAppointments from "./components/doctor/doc_appointments";
import Medications from "./components/patient/medications.jsx";
import Diet from "./components/patient/diet.jsx";
import DoctorPatientsPage from "./components/doctor/patientList.jsx";
import PatientSettings from "./components/patient/setting.jsx";
import DoctorFooter from "./components/doctor/footerdoc/docFooter.jsx";
import PatientViewer from "./components/doctor/patientViewer.jsx";
import UploadPrescribe from "./components/doctor/prescription/prescription.jsx";
import MessagesNotifications from "./components/doctor/prescription/message/message.jsx";
import Tracker from "./components/patient/symptomsLog.jsx";
import Chatbot from "./components/patient/disease.jsx";
import Consultation from "./components/patient/Consulation.jsx";
import DoctorChat from "./components/doctor/doctorChat.jsx";
import PatientChat from "./components/patient/PatientChat.jsx";
function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      {/* <Footer/> */}
      <Routes>
        <Route path='/' element={<Welcome />} />
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='patient/dashboard' element={<Dashboard />} />
        <Route path='/doctor/footer' element={<DoctorFooter/>}/>
        <Route path='/footer' element={<Footer />} />
        <Route path='/patient/profile' element={<PatientProfile />} />
        <Route path='/patient/monitor' element={<HealthCalculator />} />
        <Route path='/patient/symptoms' element={<SymptomLogger />} />
        <Route path='/patient/appointment' element={<AppointmentPage />} />
        <Route path='/patient/tracker' element={<Tracker/>}/>
        {/* <Route path='/patient/medication' element={<MedicationsPage />} /> */}
        <Route path='/patient/records' element={<MedicalRecords />} />
        <Route path='/view' element={<DoctorPatientView />} />
        <Route path='/logout' element={<PatientLogout />} />
        <Route path="/patient/diet" element={<Diet/>}/>
        <Route path='/doc/dash' element={<DoctorDashboard />} />
        <Route path='/doc/profile' element={<DoctorProfile />} />
        {/* <Route path='/doc/appointment' element={<AppointmentSchedule />} /> */}
        <Route path="/doc/patientlist" element={<DoctorPatientsPage/>}/>
        <Route path='/patient/cards' element={<HealthCards />} />
        <Route path='/patient/medication' element={<Medications />} />
        <Route path="/patient/settings" element={<PatientSettings/>}/>
        <Route path='/patientview' element={<PatientViewer/>}/>
        <Route path="/prescription" element={<UploadPrescribe/>}/>
        <Route path="/doc/notifications" element={<MessagesNotifications/>}/>
        {/* <Route path="/patientview" element={<PatientView />}/> */}
        <Route path='/doc/appointment' element={<DoctorAppointments />} />
        <Route path="/patient/disease" element={<Chatbot/>} />
        <Route
  path="/patient/consultation"
  element={<Consultation />}
/>


<Route
  path="/doc/chat"
  element={<DoctorChat />}
/>
<Route
  path="/patient/chat"
  element={<PatientChat/>}
/>
      </Routes>
     
    </>
  );
}

export default App;
