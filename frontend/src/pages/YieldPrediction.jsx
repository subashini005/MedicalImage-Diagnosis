import { useState } from "react";
import axios from "axios";

const API = "http://localhost:5001";

export default function YieldPrediction() {
  const [form, setForm] = useState({
    nitrogen: "",
    rainfall: "",
    area_hectare: ""
  });

  const [result, setResult] = useState(null);

  const predict = async () => {
    try {
      const res = await axios.post(`${API}/yield-prediction`, form);
      setResult(res.data.expected_yield_tons);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className="yield-container">
        <div className="yield-card">
          <h2>🌾 Yield Prediction</h2>

          <div className="form-grid">
            <input
              type="number"
              placeholder="Soil Nitrogen"
              onChange={(e) =>
                setForm({ ...form, nitrogen: +e.target.value })
              }
            />

            <input
              type="number"
              placeholder="Rainfall (mm)"
              onChange={(e) =>
                setForm({ ...form, rainfall: +e.target.value })
              }
            />

            <input
              type="number"
              placeholder="Area (hectare)"
              onChange={(e) =>
                setForm({ ...form, area_hectare: +e.target.value })
              }
            />
          </div>

          <button className="primary-btn" onClick={predict}>
            Predict Outcome
          </button>
        </div>

        <div className="result-card">
          <h3>Expected Yield</h3>
          {result ? (
            <h1 className="success">{result} tons</h1>
          ) : (
            <p className="placeholder">Prediction will appear here</p>
          )}
        </div>
      </div>
    </>
  );
}