import { useNavigate } from "react-router-dom";
import "../App.css";
export default function Dashboard() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");

  return (
    <div className="dashboard-container">
      <h1>Welcome, {username} 👋</h1>
      <p className="subtitle">Smart Farming System Overview</p>

      <div className="dashboard-grid">

        <div
          className="dashboard-card"
          onClick={() => navigate("/farm-details")}
        >
          <h2>🌾 Farm Analysis</h2>
          <p>
            Analyze soil nutrients, rainfall, and humidity to check
            crop suitability and fertilizer needs.
          </p>
        </div>

        <div
          className="dashboard-card"
          onClick={() => navigate("/disease-detection")}
        >
          <h2>🌿 Disease Detection</h2>
          <p>
            Detect plant diseases from leaf images and get
            treatment solutions instantly.
          </p>
        </div>

        <div
          className="dashboard-card"
          onClick={() => navigate("/yield-prediction")}
        >
          <h2>🌱 Yield Prediction</h2>
          <p>
            Predict expected crop yield based on nitrogen,
            rainfall, and cultivation area.
          </p>
        </div>

      </div>
    </div>
  );
}