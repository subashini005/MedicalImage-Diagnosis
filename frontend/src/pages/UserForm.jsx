import { useState } from "react";
import axios from "axios";

const API = "http://localhost:5001";

export default function FarmDetails() {
  const [form, setForm] = useState({});
  const [result, setResult] = useState(null);

  const analyze = async () => {
    const res = await axios.post(`${API}/farm-details`, form);
    setResult(res.data);
  };

  return (
    <>
      <div className="page-container">
        <div className="card">
          <h2>Farm Analysis</h2>

          <div className="form-grid">
            <input placeholder="Soil Type"
              onChange={e=>setForm({...form, soil_type:e.target.value})} />

            <input placeholder="Nitrogen"
              onChange={e=>setForm({...form, nitrogen:+e.target.value})} />

            <input placeholder="Phosphorus"
              onChange={e=>setForm({...form, phosphorus:+e.target.value})} />

            <input placeholder="Potassium"
              onChange={e=>setForm({...form, potassium:+e.target.value})} />

            <input placeholder="pH"
              onChange={e=>setForm({...form, ph:+e.target.value})} />

            <input placeholder="Rainfall"
              onChange={e=>setForm({...form, rainfall:+e.target.value})} />

            <input placeholder="Humidity"
              onChange={e=>setForm({...form, humidity:+e.target.value})} />
          </div>

          <button className="primary-btn" onClick={analyze}>
            Analyze Farm
          </button>
        </div>

        {result && (
          <div className={`card ${result.crop_suitability === "Yes" ? "success" : "error"}`}>
            <h3>{result.crop_suitability}</h3>
            <p>{result.explanation}</p>

            {result.crop_suitability === "Yes" && (
              <>
                <p>💧 Water Required: {result.water_and_fertilizer.water_mm} mm</p>
                <p>🌾 Fertilizer: {result.water_and_fertilizer.fertilizer_type}</p>
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
}