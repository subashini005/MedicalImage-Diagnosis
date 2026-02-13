import { useState } from "react";
import axios from "axios";

const API = "http://localhost:5001";

export default function DiseaseDetection() {
  const [imageName, setImageName] = useState("");
  const [result, setResult] = useState(null);

  const analyze = async () => {
    try {
      const res = await axios.post(`${API}/disease-detection`, {
        image_name: imageName,
      });

      setResult(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className="disease-container">
        <div className="disease-card">
          <h2>🌿 Disease Detection</h2>

          <input
            type="text"
            placeholder="Enter Disease Name (ex : Bacterial Wilt)"
            onChange={(e) => setImageName(e.target.value)}
          />

          <button className="primary-btn" onClick={analyze}>
            Analyze
          </button>
        </div>

        <div className="result-section">
          {result && (
            <>
              <div className="disease-result">
                <h3>Disease</h3>
                <p className="danger">{result.disease_detected}</p>
              </div>

              <div className="solution-result">
                <h3>Solution</h3>
                <p className="success">{result.solution}</p>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}