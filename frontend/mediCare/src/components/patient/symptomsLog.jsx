import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import PatientNavbar from "./navbar";
import Footer from "../footer/footer";
import "../patientStyle/symptomsLog.css";

const Tracker = () => {
  const [symptomForm, setSymptomForm] = useState({
    title: "",
    description: "",
    severity: "",
    duration: "",
    temperature: "",
    heartRate: "",
    painScale: "",
    timeOfOccurrence: "",
    trigger: "",
    medication: "",
    allergies: "",
    photo: null,
  });

  const [logs, setLogs] = useState([]);
  const [tip, setTip] = useState("");
  const [predictedDisease, setPredictedDisease] = useState(""); // Prediction result
  const listRef = useRef(null);

  // Medication state
  const [medications, setMedications] = useState([]);
  const [medForm, setMedForm] = useState({
    name: "",
    dose: "",
    time: "",
    frequency: "",
  });

  // Load logs from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("symptoms");
    if (saved) setLogs(JSON.parse(saved));
  }, []);

  // Save logs to localStorage
  useEffect(() => {
    localStorage.setItem("symptoms", JSON.stringify(logs));
  }, [logs]);

  // Handle symptom form input
  const handleSymptomChange = (e) => {
    const { name, value, files } = e.target;
    setSymptomForm({ ...symptomForm, [name]: files ? files[0] : value });
  };

  // Submit symptoms to backend for prediction
  const handleSymptomSubmit = async (e) => {
    e.preventDefault();

    const newLog = {
      ...symptomForm,
      photoURL: symptomForm.photo ? URL.createObjectURL(symptomForm.photo) : null,
      date: new Date().toLocaleString(),
    };

    setLogs([newLog, ...logs]);
    generateTip(newLog.description);

    // 🔗 Send to Flask backend
    try {
      const res = await axios.post("http://localhost:5000/predict", {
        symptoms: newLog.description, // you can adjust to send more fields
      });
      setPredictedDisease(res.data.prediction);
    } catch (error) {
      console.error("Prediction API error:", error);
      setPredictedDisease("Error fetching prediction");
    }

    // Reset form
    setSymptomForm({
      title: "",
      description: "",
      severity: "",
      duration: "",
      temperature: "",
      heartRate: "",
      painScale: "",
      timeOfOccurrence: "",
      trigger: "",
      medication: "",
      allergies: "",
      photo: null,
    });

    setTimeout(() => {
      if (listRef.current) listRef.current.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const generateTip = (desc) => {
    const lower = desc.toLowerCase();
    if (lower.includes("cough")) setTip("🫖 Drink warm fluids & try steam inhalation.");
    else if (lower.includes("fever")) setTip("🌡 Stay hydrated, rest, and monitor temperature.");
    else if (lower.includes("headache")) setTip("💆‍♀️ Rest in a quiet room and reduce screen time.");
    else if (lower.includes("fatigue")) setTip("🛌 Prioritize sleep and reduce stress.");
    else if (lower.includes("cold")) setTip("🧣 Stay warm and avoid chilled food.");
    else setTip("💡 Stay hydrated, eat healthy, and get rest.");
  };

  const getEmoji = (text) => {
    const lower = text.toLowerCase();
    if (lower.includes("fever")) return "🌡";
    if (lower.includes("cough")) return "🫁";
    if (lower.includes("fatigue")) return "😴";
    if (lower.includes("headache")) return "🤕";
    if (lower.includes("cold")) return "🤧";
    return "🩺";
  };

  // Handle medication inputs
  const handleMedChange = (e) => {
    const { name, value } = e.target;
    setMedForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleMedSubmit = (e) => {
    e.preventDefault();
    const newMed = {
      id: Date.now(),
      ...medForm,
      startedOn: new Date().toLocaleDateString(),
    };
    setMedications([newMed, ...medications]);
    setMedForm({ name: "", dose: "", time: "", frequency: "" });
  };

  return (
    <>
      <PatientNavbar />
      <div className="container-fluid py-5 symptoms-log">
        <div className="container">
          <div className="row gy-4">

            {/* SYMPTOM LOG */}
            <div className="col-lg-10">
              <div className="card shadow-lg p-4">
                <h3 className="text-success text-center mb-4">Log Your Symptoms</h3>

                <form onSubmit={handleSymptomSubmit} className="row g-3 mb-4">
                  <div className="col-md-6">
                    <label>Symptom</label>
                    <input type="text" name="title" value={symptomForm.title} onChange={handleSymptomChange} className="form-control" required />
                  </div>
                  <div className="col-md-6">
                    <label>Description</label>
                    <input type="text" name="description" value={symptomForm.description} onChange={handleSymptomChange} className="form-control" required />
                  </div>
                  {/* Other fields same as before */}
                  <div className="col-12 text-end">
                    <button type="submit" className="btn btn-primary">Add Symptom</button>
                  </div>
                </form>

                {/* Show AI Prediction */}
                {predictedDisease && (
                  <div className="alert alert-warning">
                    <strong>AI Prediction:</strong> {predictedDisease}
                  </div>
                )}

                {tip && (
                  <div className="alert alert-info">
                    <strong>Tip:</strong> {tip}
                  </div>
                )}

                {logs.length > 0 && (
                  <>
                    <h5>Symptom History</h5>
                    <ul className="list-group" ref={listRef}>
                      {logs.map((log, idx) => (
                        <li className="list-group-item" key={idx}>
                          <strong>{getEmoji(log.title)} {log.title}</strong> – {log.description}
                          <div className="small text-muted">Severity: {log.severity}, Duration: {log.duration}</div>
                          {log.photoURL && <img src={log.photoURL} className="img-thumbnail mt-2" width="100" alt="symptom" />}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </div>

            {/* MEDICATION TRACKER */}
            <div className="col-lg-12">
              <div className="card shadow-lg p-4">
                <h3 className="text-success text-center mb-4">Medication Tracker</h3>

                <form onSubmit={handleMedSubmit}>
                  <div className="mb-3">
                    <label>Medicine Name</label>
                    <input type="text" name="name" className="form-control" value={medForm.name} onChange={handleMedChange} required />
                  </div>
                  <div className="mb-3">
                    <label>Dosage (mg/ml)</label>
                    <input type="text" name="dose" className="form-control" value={medForm.dose} onChange={handleMedChange} required />
                  </div>
                  <div className="mb-3">
                    <label>Time to Take</label>
                    <input type="time" name="time" className="form-control" value={medForm.time} onChange={handleMedChange} required />
                  </div>
                  <div className="mb-3">
                    <label>Frequency</label>
                    <select name="frequency" className="form-select" value={medForm.frequency} onChange={handleMedChange} required>
                      <option value="">Select frequency</option>
                      <option>Once a day</option>
                      <option>Twice a day</option>
                      <option>After meals</option>
                      <option>Before sleep</option>
                    </select>
                  </div>
                  <button type="submit" className="btn btn-primary w-100">Add Medication</button>
                </form>

                <hr />

                <h5 className="text-success">Ongoing Medications</h5>
                {medications.length === 0 ? (
                  <p className="text-muted">No medications added yet.</p>
                ) : (
                  <table className="table table-striped table-bordered mt-3">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Dose</th>
                        <th>Time</th>
                        <th>Frequency</th>
                        <th>Start</th>
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
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Tracker;
