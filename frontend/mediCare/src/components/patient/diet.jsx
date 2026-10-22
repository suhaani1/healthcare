


// // import React, { useState } from 'react';
// // // import axios from 'axios';
// // import PatientNavbar from './navbar';
// // import Footer from '../footer/footer';
// // import '../patientStyle/diet.css';

// // const dietPlansByGoal = {
// //   Lose: {
// //     Underweight: [],
// //     Normal: [
// //       { meal: "Breakfast", items: ["Oats", "Egg whites", "Green tea"], calories: 300 },
// //       { meal: "Lunch", items: ["Grilled chicken", "Salad", "Brown rice"], calories: 500 },
// //       { meal: "Dinner", items: ["Vegetable soup", "Tofu", "Steamed veggies"], calories: 400 },
// //     ],
// //     Overweight: [
// //       { meal: "Breakfast", items: ["Smoothie with spinach", "Almonds"], calories: 250 },
// //       { meal: "Lunch", items: ["Quinoa", "Grilled vegetables", "Lentils"], calories: 450 },
// //       { meal: "Dinner", items: ["Soup", "Salad"], calories: 350 },
// //     ],
// //     Obese: [
// //       { meal: "Breakfast", items: ["Boiled eggs", "Cucumber slices"], calories: 200 },
// //       { meal: "Lunch", items: ["Mixed greens", "Chicken breast", "1 apple"], calories: 400 },
// //       { meal: "Dinner", items: ["Broccoli soup", "Grilled paneer"], calories: 300 },
// //     ],
// //   },
// //   Maintain: {
// //     Underweight: [
// //       { meal: "Breakfast", items: ["Banana shake", "Boiled eggs"], calories: 400 },
// //       { meal: "Lunch", items: ["Rice", "Lentils", "Paneer curry"], calories: 600 },
// //       { meal: "Dinner", items: ["Vegetable pulao", "Yogurt"], calories: 500 },
// //     ],
// //     Normal: [
// //       { meal: "Breakfast", items: ["Oats", "Milk", "Fruits"], calories: 350 },
// //       { meal: "Lunch", items: ["Chapati", "Sabzi", "Dal", "Salad"], calories: 600 },
// //       { meal: "Dinner", items: ["Rice", "Paneer curry", "Veggies"], calories: 500 },
// //     ],
// //     Overweight: [
// //       { meal: "Breakfast", items: ["Poha", "Buttermilk"], calories: 300 },
// //       { meal: "Lunch", items: ["Brown rice", "Dal", "Salad"], calories: 500 },
// //       { meal: "Dinner", items: ["Vegetable soup", "Whole wheat toast"], calories: 400 },
// //     ],
// //     Obese: [
// //       { meal: "Breakfast", items: ["Fruit bowl", "Green tea"], calories: 200 },
// //       { meal: "Lunch", items: ["Grilled tofu", "Salad"], calories: 400 },
// //       { meal: "Dinner", items: ["Soup", "Steamed vegetables"], calories: 300 },
// //     ],
// //   },
// //   Gain: {
// //     Underweight: [
// //       { meal: "Breakfast", items: ["Peanut butter toast", "Milkshake"], calories: 500 },
// //       { meal: "Lunch", items: ["Rice", "Paneer curry", "Banana"], calories: 700 },
// //       { meal: "Dinner", items: ["Chapati", "Egg curry", "Veggies"], calories: 600 },
// //     ],
// //     Normal: [
// //       { meal: "Breakfast", items: ["Egg sandwich", "Fruit juice"], calories: 450 },
// //       { meal: "Lunch", items: ["Chicken curry", "Rice", "Curd"], calories: 650 },
// //       { meal: "Dinner", items: ["Paneer bhurji", "Chapati", "Milk"], calories: 550 },
// //     ],
// //     Overweight: [],
// //     Obese: [],
// //   }
// // };

// // function getBMICategory(bmi) {
// //   if (bmi < 18.5) return 'Underweight';
// //   if (bmi < 25) return 'Normal';
// //   if (bmi < 30) return 'Overweight';
// //   return 'Obese';
// // }

// // const Diet = () => {
// //   const [weight, setWeight] = useState('');
// //   const [height, setHeight] = useState('');
// //   const [goal, setGoal] = useState('Maintain');
// //   const [bmi, setBMI] = useState(null);
// //   const [category, setCategory] = useState('');
// //   const [dietPlan, setDietPlan] = useState([]);

// //   const calculateBMI = (e) => {
// //     e.preventDefault();

// //     const h = parseFloat(height) / 100;
// //     const w = parseFloat(weight);
// //     if (!h || !w) return;

// //     const bmiValue = w / (h * h);
// //     const cat = getBMICategory(bmiValue);

// //     setBMI(bmiValue.toFixed(1));
// //     setCategory(cat);
// //     setDietPlan(dietPlansByGoal[goal][cat] || []);
// //   };

// //   return (
// //     <>
// //       <PatientNavbar />
// //       <div className="diet-container mt-5 pt-4">
// //         <div className="card p-4 shadow diet-card">
// //           <h3 className="text-center text-gradient mb-4">Diet Plan Based on BMI & Goal</h3>

// //           <form onSubmit={calculateBMI}>
// //             <div className="row mb-3 text-center">
// //               <div className="col-md-4 mb-2">
// //                 <label className="form-label fw-bold">Weight (kg)</label>
// //                 <input
// //                   type="number"
// //                   className="form-control"
// //                   value={weight}
// //                   onChange={(e) => setWeight(e.target.value)}
// //                   required
// //                 />
// //               </div>
             
// //               <div className="col-md-4 mb-2">
// //                 <label className="form-label fw-bold">Height (cm)</label>
// //                 <input
// //                   type="number"
// //                   className="form-control"
// //                   value={height}
// //                   onChange={(e) => setHeight(e.target.value)}
// //                   required
// //                 />
// //               </div>
// //               <br />
// //               <div className="col-md-4 mb-2">
// //                 <label className="form-label fw-bold">Dietary Goal</label>
// //                 <select className="form-select" value={goal} onChange={(e) => setGoal(e.target.value)}>
// //                   <option value="Lose">Lose Weight</option>
// //                   <option value="Maintain">Maintain Weight</option>
// //                   <option value="Gain">Gain Weight</option>
// //                 </select>
// //               </div>
// //             </div>
// //             <div className="text-center">
// //               <button className="btn gradient-btn" type="submit">Get Plan</button>
// //             </div>
// //           </form>

// //           {bmi && (
// //             <div className="text-center mt-4">
// //               <p><strong>BMI:</strong> {bmi}</p>
// //               <p><strong>Category:</strong> {category}</p>
// //             </div>
// //           )}

// //           {category && (
// //             <div className="alert alert-info mt-3">
// //               <h5>Smart Suggestions:</h5>
// //               <ul className="mb-0 text-start">
// //                 {category === 'Underweight' && <li>Include calorie-dense foods like nuts, dairy, and whole grains.</li>}
// //                 {category === 'Normal' && goal === 'Lose' && <li>Maintain calorie intake with slight deficit and daily walks.</li>}
// //                 {category === 'Overweight' && <li>Cut sugar and carbs. Drink 2-3L water daily. Add light exercise.</li>}
// //                 {category === 'Obese' && <li>Consult a dietitian. Avoid processed food. Increase protein intake.</li>}
// //                 {goal === 'Gain' && <li>Increase intake of healthy carbs and proteins. Do resistance training.</li>}
// //               </ul>
// //             </div>
// //           )}

// //           {dietPlan.length > 0 && (
// //             <div className="table-responsive mt-4">
// //               <table className="table table-bordered text-center align-middle">
// //                 <thead className="gradient-table-header text-dark-custom">
// //                   <tr>
// //                     <th>Meal</th>
// //                     <th>Items</th>
// //                     <th>Calories (kcal)</th>
// //                   </tr>
// //                 </thead>
// //                 <tbody>
// //                   {dietPlan.map((entry, idx) => (
// //                     <tr key={idx}>
// //                       <td><strong>{entry.meal}</strong></td>
// //                       <td>{entry.items.join(', ')}</td>
// //                       <td>{entry.calories}</td>
// //                     </tr>
// //                   ))}
// //                 </tbody>
// //               </table>
// //             </div>
// //           )}
// //         </div>
// //       </div>
// //       <Footer />
// //     </>
// //   );
// // };

// // export default Diet;



// import { useState, useEffect } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// function DietUpdate() {
//   const navigate = useNavigate();
//   const email = localStorage.getItem("email") || "";

//   const [diet, setDiet] = useState({ protein: 0, fats: 0, carbs: 0 });
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (!email) return;
//     axios
//       .get(`http://localhost:3010/patient/dashboard?email=${email}`)
//       .then((res) => {
//         if (res.data.diet) setDiet(res.data.diet);
//       })
//       .catch(console.error);
//   }, [email]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setDiet((prev) => ({ ...prev, [name]: Number(value) }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       await axios.post("http://localhost:3010/patient/diet/update", { email, ...diet });
//       localStorage.setItem("profileUpdatedAt", Date.now());
//       alert("Diet updated successfully");
//       navigate("/dashboard");
//     } catch (err) {
//       console.error(err);
//       alert("Failed to update diet");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="container mt-5">
//       <h3>Update Diet</h3>
//       <form onSubmit={handleSubmit}>
//         <div className="mb-2">
//           <label>Protein (g)</label>
//           <input type="number" name="protein" className="form-control" value={diet.protein} onChange={handleChange} />
//         </div>
//         <div className="mb-2">
//           <label>Fats (g)</label>
//           <input type="number" name="fats" className="form-control" value={diet.fats} onChange={handleChange} />
//         </div>
//         <div className="mb-2">
//           <label>Carbs (g)</label>
//           <input type="number" name="carbs" className="form-control" value={diet.carbs} onChange={handleChange} />
//         </div>
//         <button type="submit" className="btn btn-success" disabled={loading}>
//           {loading ? "Updating..." : "Update Diet"}
//         </button>
//       </form>
//     </div>
//   );
// }

// export default DietUpdate;



import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function DietUpdate() {
  const navigate = useNavigate();

  const patientId = localStorage.getItem("patientId"); // ✅ use ID instead of email

  const [diet, setDiet] = useState({
    _id: "",
    protein: 0,
    fats: 0,
    carbs: 0
  });

  const [loading, setLoading] = useState(false);

  // ✅ FETCH existing diet
  useEffect(() => {
  if (!patientId) return;

  axios
    .get(`http://localhost:3010/patient/diet/patient/${patientId}`)
    .then((res) => {
      setDiet(res.data);
    })
    .catch((err) => {
      if (err.response && err.response.status === 404) {
        console.log("No diet found → creating new");

        // ✅ Set empty diet (this is correct behavior)
        setDiet({
          _id: "",
          protein: 0,
          fats: 0,
          carbs: 0
        });

      } else {
        console.error("Other error:", err);
      }
    });
}, [patientId]);

  // ✅ HANDLE INPUT
  const handleChange = (e) => {
    const { name, value } = e.target;
    setDiet((prev) => ({
      ...prev,
      [name]: Number(value)
    }));
  };

  // ✅ SUBMIT UPDATE
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
    console.log("Sending diet:", diet);

    const id = diet._id ? diet._id : "new";

    await axios.put(
      `http://localhost:3010/patient/diet/${id}`,
      {
        protein: diet.protein,
        fats: diet.fats,
        carbs: diet.carbs,
        patient: patientId   // ✅ MUST
      }
    );

    alert("Diet updated successfully");
    navigate("/patient/dashboard");

  } catch (err) {
    console.error("ERROR:", err.response?.data || err.message);
    alert("Failed to update diet");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="container mt-5">
      <h3>Update Diet</h3>

      <form onSubmit={handleSubmit}>
        <div className="mb-2">
          <label>Protein (g)</label>
          <input
            type="number"
            name="protein"
            className="form-control"
            value={diet.protein}
            onChange={handleChange}
          />
        </div>

        <div className="mb-2">
          <label>Fats (g)</label>
          <input
            type="number"
            name="fats"
            className="form-control"
            value={diet.fats}
            onChange={handleChange}
          />
        </div>

        <div className="mb-2">
          <label>Carbs (g)</label>
          <input
            type="number"
            name="carbs"
            className="form-control"
            value={diet.carbs}
            onChange={handleChange}
          />
        </div>

        <button
          type="submit"
          className="btn btn-success"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Diet"}
        </button>
      </form>
    </div>
  );
}

export default DietUpdate;