import React, { useState } from 'react';
import Footer from '../footer/footer';
import PatientNavbar from './navbar';
 import './medication.css';

const Medications = () => {
  const [medications, setMedications] = useState([]);
  const [form, setForm] = useState({
    name: '',
    dose: '',
    time: '',
    frequency: '',
  });

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.dose || !form.time || !form.frequency) return;

    const newMed = {
      id: Date.now(),
      ...form,
      startedOn: new Date().toLocaleDateString(),
    };

    setMedications([newMed, ...medications]);
    setForm({ name: '', dose: '', time: '', frequency: '' });
  };

  return (
   <>
   <PatientNavbar/>
    <div className="container-fluid medication-container mt-5 pt-4">
      <div className="row">
        {/* Add Medication */}
        <div className="col-lg-5 mb-4">
          <div className="card shadow p-4">
            <h4 className="text-primary mb-3">Add Medication</h4>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Medicine Name</label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g., Paracetamol"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Dosage (mg/ml)</label>
                <input
                  type="text"
                  name="dose"
                  className="form-control"
                  value={form.dose}
                  onChange={handleChange}
                  placeholder="e.g., 500mg"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Time to Take</label>
                <input
                  type="time"
                  name="time"
                  className="form-control"
                  value={form.time}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Frequency</label>
                <select
                  name="frequency"
                  className="form-select"
                  value={form.frequency}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select frequency</option>
                  <option value="Once a day">Once a day</option>
                  <option value="Twice a day">Twice a day</option>
                  <option value="After meals">After meals</option>
                  <option value="Before sleep">Before sleep</option>
                </select>
              </div>

              <button type="submit" className="btn btn-primary w-100">Add Medication</button>
            </form>
          </div>
        </div>

        {/* Ongoing Medications */}
        <div className="col-lg-7 mb-4">
          <div className="card shadow p-4">
            <h4 className="text-success mb-3">Ongoing Medications</h4>
            {medications.length === 0 ? (
              <p className="text-muted">No medications added yet.</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-bordered table-hover">
                  <thead className="table-light">
                    <tr>
                      <th>Name</th>
                      <th>Dose</th>
                      <th>Time</th>
                      <th>Frequency</th>
                      <th>Started On</th>
                    </tr>
                  </thead>
                  <tbody>
                    {medications.map((med) => (
                      <tr key={med.id}>
                        <td>{med.name}</td>
                        <td>{med.dose}</td>
                        <td>{med.time}</td>
                        <td>{med.frequency}</td>
                        <td>{med.startedOn}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default Medications;
