import React from 'react';

const DoctorPatientView = ({ patientData }) => {
  return (
    <div className="container mt-5 pt-4">
      <h3 className="mb-4 text-primary">Patient Overview -Doctor View</h3>

      {/* Basic Info */}
      <div className="card mb-4 p-3 shadow">
        <h5>Patient Information</h5>
        <p><strong>Name:</strong> {patientData.name}</p>
        <p><strong>Age:</strong> {patientData.age}</p>
        <p><strong>Gender:</strong> {patientData.gender}</p>
        <p><strong>Phone:</strong> {patientData.phone}</p>
        <p><strong>Blood Group:</strong> {patientData.bloodGroup}</p>
      </div>

      {/* Symptoms */}
      <div className="card mb-4 p-3 shadow">
        <h5>Recent Symptoms</h5>
        <ul>
          {patientData.symptoms.map((s, i) => (
            <li key={i}>{s.date} – {s.symptom}</li>
          ))}
        </ul>
      </div>

      {/* Medications */}
      <div className="card mb-4 p-3 shadow">
        <h5>Ongoing Medications</h5>
        <ul>
          {patientData.medications.map((m, i) => (
            <li key={i}>{m.name} – {m.dose} – {m.frequency}</li>
          ))}
        </ul>
      </div>

      {/* Appointments with This Doctor */}
      <div className="card mb-4 p-3 shadow">
        <h5>Appointments with You</h5>
        <ul>
          {patientData.appointments.map((a, i) => (
            <li key={i}>{a.date} at {a.time} – Status: {a.status}</li>
          ))}
        </ul>
      </div>

      {/* Records */}
      <div className="card mb-4 p-3 shadow">
        <h5>Medical Records</h5>
        <ul>
          {patientData.records.map((r, i) => (
            <li key={i}>
              📄 {r.name} (<a href={r.url} target="_blank" rel="noopener noreferrer">View</a>)
            </li>
          ))}
        </ul>
      </div>

      {/* Diagnosis/Doctor Notes */}
      <div className="card mb-4 p-3 shadow">
        <h5>Your Diagnosis & Notes</h5>
        <textarea className="form-control" rows="4" placeholder="Write diagnosis or plan..."></textarea>
        <button className="btn btn-success mt-3">Save Notes</button>
      </div>
    </div>
  );
};

export default DoctorPatientView
