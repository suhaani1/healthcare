import React, { useState } from 'react';
import PatientNavbar from './navbar';
import Footer from '../footer/footer';
import './calculation.css';

const HealthCalculator = () => {
  const [inputs, setInputs] = useState({
    height: '',
    weight: '',
    age: '',
    gender: '',
    systolic: '',
    diastolic: '',
  });

  const [bmi, setBmi] = useState(null);
  const [bmr, setBmr] = useState(null);
  const [bpStatus, setBpStatus] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  const calculate = () => {
    const h = parseFloat(inputs.height);
    const w = parseFloat(inputs.weight);
    const a = parseFloat(inputs.age);
    const sys = parseInt(inputs.systolic);
    const dia = parseInt(inputs.diastolic);

    // BMI
    const heightM = h / 100;
    const bmiValue = w / (heightM * heightM);
    setBmi(bmiValue.toFixed(1));

    // BMR (Mifflin-St Jeor Formula)
    let bmrCalc = 0;
    if (inputs.gender === 'male') {
      bmrCalc = 10 * w + 6.25 * h - 5 * a + 5;
    } else if (inputs.gender === 'female') {
      bmrCalc = 10 * w + 6.25 * h - 5 * a - 161;
    }
    setBmr(bmrCalc.toFixed(1));

    // BP
    if (sys < 120 && dia < 80) setBpStatus('Normal');
    else if (sys >= 120 && sys < 130 && dia < 80) setBpStatus('Elevated');
    else if ((sys >= 130 && sys < 140) || (dia >= 80 && dia < 90)) setBpStatus('High (Stage 1)');
    else if (sys >= 140 || dia >= 90) setBpStatus('High (Stage 2)');
    else setBpStatus('Consult Doctor');
  };

  return (
    <>
    <PatientNavbar/>

    <div className="container-bg calculator-container mt-5 pt-4">
      <div className="card shadow-lg p-4">
        <h3 className="text-primary text-center mb-4">Health Calculator</h3>

        <div className="row g-3">
          <div className="col-md-4">
            <label>Height (cm)</label>
            <input type="number" name="height" className="form-control" onChange={handleChange} value={inputs.height} />
          </div>
          <div className="col-md-4">
            <label>Weight (kg)</label>
            <input type="number" name="weight" className="form-control" onChange={handleChange} value={inputs.weight} />
          </div>
          <div className="col-md-4">
            <label>Age</label>
            <input type="number" name="age" className="form-control" onChange={handleChange} value={inputs.age} />
          </div>
          <div className="col-md-4">
            <label>Gender</label>
            <select name="gender" className="form-select" onChange={handleChange} value={inputs.gender}>
              <option value="">Choose</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          <div className="col-md-4">
            <label>Systolic (Upper BP)</label>
            <input type="number" name="systolic" className="form-control" onChange={handleChange} value={inputs.systolic} />
          </div>
          <div className="col-md-4">
            <label>Diastolic (Lower BP)</label>
            <input type="number" name="diastolic" className="form-control" onChange={handleChange} value={inputs.diastolic} />
          </div>
        </div>

        <div className="text-center mt-4">
          <button className="btn btn-primary px-4" onClick={calculate}>Calculate</button>
        </div>

        {bmi && (
          <div className="mt-4 alert alert-info">
            <strong>BMI:</strong> {bmi} — {getBmiStatus(bmi)}
          </div>
        )}
        {bmr && (
          <div className="alert alert-secondary">
            <strong>BMR:</strong> {bmr} calories/day
          </div>
        )}
        {bpStatus && (
          <div className="alert alert-warning">
            <strong>Blood Pressure Status:</strong> {bpStatus}
          </div>
        )}
      </div>
    </div>

    <Footer />
    
    </>
  );
};

// BMI Status Helper
function getBmiStatus(bmi) {
  const val = parseFloat(bmi);
  if (val < 18.5) return "Underweight";
  if (val >= 18.5 && val < 24.9) return "Normal";
  if (val >= 25 && val < 29.9) return "Overweight";
  return "Obese";
}

export default HealthCalculator;
