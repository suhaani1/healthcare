import React, {useState} from 'react';
import { Table, Button, Card,Modal,Form } from 'react-bootstrap';
import DoctorNavbar from './nav';

import DoctorFooter from './footerdoc/docFooter';
// import './DoctorPatientsPage.css';

// const patientsData = [
//   {
//     id: 1,
//     name: 'Ravi Kumar',
//     age: 34,
//     gender: 'Male',
//     contact: '9876543210',
//   },
//   {
//     id: 2,
//     name: 'Simran Patel',
//     age: 28,
//     gender: 'Female',
//     contact: '9123456780',
//   },
//   {
//     id: 3,
//     name: 'Rahul Singh',
//     age: 42,
//     gender: 'Male',
//     contact: '9988776655',
//   },
// ];
// const DoctorPatientsPage = () => {
//   const [showModal, setShowModal] = useState(false);
//   const [selectedPatient, setSelectedPatient] = useState(null);
//   const [message, setMessage] = useState('');

//   const handleMessageClick = (patient) => {
//     setSelectedPatient(patient);
//     setMessage('');
//     setShowModal(true);
//   };

const DoctorPatientsPage = ({ doctorId, onViewPatient }) => {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    axios.get(`/api/doctor/${doctorId}/patients`)
      .then(res => setPatients(res.data))
      .catch(err => console.error(err));
  }, [doctorId]);

  return (
    <>
    <div className="card p-3 shadow-sm">
      <h5 className="mb-3">Patients</h5>
      <ul className="list-group">
        {patients.map((patient) => (
          <li key={patient._id} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <strong>{patient.fullName}</strong>
              <br />
              <small>{patient.email}</small>
            </div>
            <button className="btn btn-outline-primary btn-sm" onClick={() => onViewPatient(patient)}>
              View
            </button>
          </li>
        ))}
      </ul>
    </div>
    <DoctorFooter/>
</>
  );
};
export default DoctorPatientsPage;
