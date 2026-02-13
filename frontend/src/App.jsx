import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import FarmDetails from "./pages/UserForm";
import DiseaseDetection from "./pages/Disease-Detection";
import YieldPrediction from "./pages/YieldPrediction";
import "./App.css";
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/farm-details" element={<FarmDetails />} />
        <Route path="/disease-detection" element={<DiseaseDetection />} />
        <Route path="/yield-prediction" element={<YieldPrediction />} />
      </Routes>
    </BrowserRouter>
  );
}