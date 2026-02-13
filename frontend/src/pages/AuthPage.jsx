import { useState } from "react";
import axios from "axios";
import "boxicons/css/boxicons.min.css";
import "../Authpage-styles.css";

const API = "http://localhost:5000";

export default function AuthPage() {
  const [activeForm, setActiveForm] = useState("login");
  const [containerActive, setContainerActive] = useState(false);
  const [otpPurpose, setOtpPurpose] = useState("");

  const [userId, setUserId] = useState("");

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [signupData, setSignupData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [forgotEmail, setForgotEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const showForm = (form) => setActiveForm(form);
  const handleSignup = async () => {
    if (!signupData.username || !signupData.email || !signupData.password) {
      alert("Please fill all signup fields");
      return;
    }

    try {
      const res = await axios.post(`${API}/signup`, signupData);

      alert("OTP sent to your email");

      setUserId(res.data.userId);
      setOtpPurpose("signup");
      setContainerActive(false);
      showForm("otp");
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    }
  };
  const handleVerifyOtp = async () => {
    if (!otp) {
      alert("Please enter OTP");
      return;
    }

    try {
      if (otpPurpose === "signup") {
        await axios.post(`${API}/verify-otp`, { userId, otp });
        alert("Email verified successfully");
        showForm("login");
      } else {
        if (!newPassword) {
          alert("Please enter new password");
          return;
        }

        await axios.post(`${API}/reset-password`, {
          userId,
          otp,
          newPassword,
        });

        alert("Password reset successful");
        showForm("login");
      }
    } catch (err) {
      alert(err.response?.data?.message || "OTP verification failed");
    }
  };

  const handleLogin = async () => {
  if (!loginData.email || !loginData.password) {
    alert("Please enter email and password");
    return;
  }

  try {
    const res = await axios.post(`${API}/login`, loginData);
    alert(res.data.message);

    if (res.data.message === "Login successful") {
      if (res.data.username) localStorage.setItem("username", res.data.username);
      window.location.href = "/dashboard";

    }

  } catch (err) {
    alert(err.response?.data?.message || "Login failed");
  }
};

  const handleForgotPassword = async () => {
    if (!forgotEmail) {
      alert("Please enter your email");
      return;
    }

    try {
      const res = await axios.post(`${API}/forgot-password`, {
        email: forgotEmail,
      });

      alert("Reset OTP sent to your email");

      setUserId(res.data.userId);
      setOtpPurpose("forgot");
      showForm("otp");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send OTP");
    }
  };

  return (
    <div className={`auth-container ${containerActive ? "active" : ""}`}>
      {activeForm === "login" && (
        <div className="form-box login">
          <form>
            <h1>Login</h1>

            <div className="input-box">
              <input
                type="email"
                placeholder="Email"
                value={loginData.email}
                onChange={(e) =>
                  setLoginData({ ...loginData, email: e.target.value })
                }
              />
            </div>

            <div className="input-box">
              <input
                type="password"
                placeholder="Password"
                value={loginData.password}
                onChange={(e) =>
                  setLoginData({ ...loginData, password: e.target.value })
                }
              />
              <i className="bx bxs-lock-alt"></i>
            </div>

            <div className="forgot-link">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  showForm("forgot-email");
                }}
              >
                Forgot Password?
              </a>
            </div>

            <button type="button" className="btn" onClick={handleLogin}>
              Login
            </button>
          </form>
        </div>
      )}
      {activeForm === "register" && (
        <div className="form-box register">
          <form>
            <h1>Register</h1>

            <div className="input-box">
              <input
                placeholder="Username"
                value={signupData.username}
                onChange={(e) =>
                  setSignupData({ ...signupData, username: e.target.value })
                }
              />
            </div>

            <div className="input-box">
              <input
                placeholder="Email"
                value={signupData.email}
                onChange={(e) =>
                  setSignupData({ ...signupData, email: e.target.value })
                }
              />
            </div>

            <div className="input-box">
              <input
                type="password"
                placeholder="Password"
                value={signupData.password}
                onChange={(e) =>
                  setSignupData({ ...signupData, password: e.target.value })
                }
              />
            </div>

            <button type="button" className="btn" onClick={handleSignup}>
              Sign Up
            </button>
          </form>
        </div>
      )}
      {activeForm === "otp" && (
        <div className="form-box otp">
          <form>
            <h1>Verify OTP</h1>

            <div className="input-box">
              <input
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>

            {otpPurpose === "forgot" && (
              <div className="input-box">
                <input
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
            )}

            <button type="button" className="btn" onClick={handleVerifyOtp}>
              Verify
            </button>
          </form>
        </div>
      )}
      {activeForm === "forgot-email" && (
        <div className="form-box forgot-email">
          <form>
            <h1>Forgot Password</h1>

            <div className="input-box">
              <input
                placeholder="Enter Email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
              />
            </div>

            <button type="button" className="btn" onClick={handleForgotPassword}>
              Send OTP
            </button>
          </form>
        </div>
      )}
      <div className="toggle-box">
        <div className="toggle-panel toggle-left">
          <h1>Hello, Welcome!</h1>
          <p>Don't have an account?</p>
          <button
            className="btn"
            onClick={() => {
              setContainerActive(true);
              showForm("register");
            }}
          >
            Register
          </button>
        </div>

        <div className="toggle-panel toggle-right">
          <h1>Welcome Back!</h1>
          <p>Already have an account?</p>
          <button
            className="btn"
            onClick={() => {
              setContainerActive(false);
              showForm("login");
            }}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}