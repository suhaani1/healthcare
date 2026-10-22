import React, { useState } from 'react';
// import './MedicalRecordsPage.css';
import PatientNavbar from './navbar';
import Footer from '../footer/footer';

const MedicalRecords = () => {
  const [records, setRecords] = useState([]);
  const [cards, setCards] = useState([]);

  const handleFileUpload = (e, type) => {
    const files = Array.from(e.target.files);
    const fileList = files.map((file) => ({
      id: Date.now() + Math.random(),
      name: file.name,
      type: file.type,
      url: URL.createObjectURL(file),
      uploadedAt: new Date().toLocaleString(),
    }));

    if (type === 'record') setRecords([...fileList, ...records]);
    if (type === 'card') setCards([...fileList, ...cards]);
  };

  return (
   <>
   <PatientNavbar/> 
    <div className="container-fluid medical-page mt-5 pt-4">
      <div className="row g-4">
        {/* Upload Medical Records */}
        <div className="col-lg-6">
          <div className="card shadow p-4">
            <h4 className="text-primary mb-3">Upload Medical Records</h4>
            <input
              type="file"
              multiple
              className="form-control mb-3"
              onChange={(e) => handleFileUpload(e, 'record')}
            />
            {records.length === 0 ? (
              <p className="text-muted">No medical records uploaded yet.</p>
            ) : (
              <ul className="list-group">
                {records.map((file) => (
                  <li key={file.id} className="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                      📄 {file.name}
                      <br />
                      <small className="text-muted">Uploaded on: {file.uploadedAt}</small>
                    </div>
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-sm btn-outline-primary"
                    >
                      View
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Upload Health Cards */}
        <div className="col-lg-6">
          <div className="card shadow p-4">
            <h4 className="text-success mb-3">Upload Health Insurance Cards</h4>
            <input
              type="file"
              multiple
              className="form-control mb-3"
              onChange={(e) => handleFileUpload(e, 'card')}
            />
            {cards.length === 0 ? (
              <p className="text-muted">No health cards uploaded yet.</p>
            ) : (
              <ul className="list-group">
                {cards.map((file) => (
                  <li key={file.id} className="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                      🪪 {file.name}
                      <br />
                      <small className="text-muted">Uploaded on: {file.uploadedAt}</small>
                    </div>
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-sm btn-outline-success"
                    >
                      View
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
            <Footer/>
    </>
  );
};

export default MedicalRecords;
