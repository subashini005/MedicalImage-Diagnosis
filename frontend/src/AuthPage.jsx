import { useEffect } from "react";
import "./styles.css";
import axios from "axios";

const API = "http://localhost:5000";

const AuthPage = () => {
  useEffect(() => {
    const forms = document.querySelectorAll(".form-box");
    const container = document.querySelector(".container");
    let otpPurpose = "";
    let currentUserId = "";

    function showForm(className) {
      forms.forEach((f) => (f.style.display = "none"));
      document.querySelector("." + className).style.display = "flex";
      const toggleBox = document.querySelector(".toggle-box");
      if (className === "otp" || className === "forgot-email") {
        toggleBox.style.display = "none";
      } else {
        toggleBox.style.display = "block";
      }
    }

    showForm("login");

    document.getElementById("showRegister").onclick = () => {
      container.classList.add("active");
      showForm("register");
    };

    document.getElementById("showLogin").onclick = () => {
      container.classList.remove("active");
      showForm("login");
    };

    document.getElementById("signupBtn").onclick = async () => {
      try {
        const username = document.getElementById("su-username").value.trim();
        const email = document.getElementById("su-email").value.trim();
        const password = document.getElementById("su-password").value;

        if (!username || !email || !password) {
          alert("Please fill in all fields");
          return;
        }

        const res = await axios.post(`${API}/signup`, {
          username,
          email,
          password,
        });

        alert(res.data.message);
        currentUserId = res.data.userId;
        otpPurpose = "signup";
        
        document.getElementById("su-username").value = "";
        document.getElementById("su-email").value = "";
        document.getElementById("su-password").value = "";
        document.getElementById("otp-input").value = "";
        document.getElementById("new-password-input").value = "";
        
        document.getElementById("new-password-box").style.display = "none";

        container.classList.remove("active");
        showForm("otp");
      } catch (error) {
        alert(error.response?.data?.message || "Signup failed. Please try again.");
      }
    };

    document.getElementById("verifyOtpBtn").onclick = async () => {
      try {
        const otp = document.getElementById("otp-input").value.trim();

        if (!otp) {
          alert("Please enter OTP");
          return;
        }

        if (otpPurpose === "signup") {
          await axios.post(`${API}/verify-otp`, {
            userId: currentUserId,
            otp,
          });
          alert("Email verified successfully");
          document.getElementById("otp-input").value = "";
          showForm("login");
        }

        if (otpPurpose === "forgot") {
          const newPassword = document.getElementById("new-password-input").value;
          if (!newPassword) {
            alert("Please enter new password");
            return;
          }
          await axios.post(`${API}/reset-password`, {
            userId: currentUserId,
            otp,
            newPassword,
          });
          alert("Password reset successful");
          document.getElementById("otp-input").value = "";
          document.getElementById("new-password-input").value = "";
          showForm("login");
        }
      } catch (error) {
        alert(error.response?.data?.message || "Verification failed. Please try again.");
      }
    };

    document.getElementById("loginBtn").onclick = async () => {
      try {
        const email = document.getElementById("li-email").value.trim();
        const password = document.getElementById("li-password").value;
        if (!email || !password) {
          alert("Please enter email and password");
          return;
        }
        const res = await axios.post(`${API}/login`, { email, password });
        alert(res.data.message);
        document.getElementById("li-email").value = "";
        document.getElementById("li-password").value = "";
      } catch (error) {
        alert(error.response?.data?.message || "Login failed. Please try again.");
      }
    };

    document.getElementById("forgotLink").onclick = () => {
      otpPurpose = "forgot";
      showForm("forgot-email");
    };

    document.getElementById("sendOtpBtn").onclick = async () => {
      try {
        const email = document.getElementById("fp-email").value.trim();
        if (!email) {
          alert("Please enter email");
          return;
        }

        const res = await axios.post(`${API}/forgot-password`, { email });
        alert(res.data.message);
        currentUserId = res.data.userId;
        otpPurpose = "forgot";
        document.getElementById("fp-email").value = "";
        document.getElementById("otp-input").value = "";
        document.getElementById("new-password-input").value = "";
        document.getElementById("new-password-box").style.display = "block";
        showForm("otp");
      } catch (error) {
        const errorMessage = error.response?.data?.message || "Failed to send OTP. Please try again.";
        alert(errorMessage);
        if (errorMessage === "OTP already sent. Please verify existing OTP.") {
          currentUserId = error.response?.data?.userId;
          otpPurpose = "forgot";
          document.getElementById("fp-email").value = "";
          document.getElementById("otp-input").value = "";
          document.getElementById("new-password-input").value = "";
          document.getElementById("new-password-box").style.display = "block";
          showForm("otp");
        }
      }
    };
  }, []);

  return (
    <div className="container">
      <div className="form-box login">
        <form>
          <h1>Login</h1>
          <div className="input-box">
            <input id="li-email" type="email" placeholder="Email" />
          </div>
          <div className="input-box">
            <input id="li-password" type="password" placeholder="Password" />
            <i className="bx bxs-lock-alt"></i>
          </div>
          <div className="forgot-link">
            <a href="#" id="forgotLink">Forgot Password?</a>
          </div>
          <button type="button" className="btn" id="loginBtn">Login</button>
        </form>
      </div>
      <div className="form-box register">
        <form>
          <h1>Register</h1>
          <div className="input-box">
            <input id="su-username" placeholder="Username" />
          </div>
          <div className="input-box">
            <input id="su-email" type="email" placeholder="Email" />
          </div>
          <div className="input-box">
            <input id="su-password" type="password" placeholder="Password" />
          </div>
          <button type="button" className="btn" id="signupBtn">Sign Up</button>
        </form>
      </div>
      <div className="form-box otp">
        <form>
          <h1>Verify OTP</h1>
          <div className="input-box">
            <input id="otp-input" placeholder="Enter OTP" />
          </div>
          <div className="input-box" id="new-password-box" style={{display: "none"}}>
            <input id="new-password-input" type="password" placeholder="New Password" />
          </div>
          <button type="button" className="btn" id="verifyOtpBtn">Verify</button>
        </form>
      </div>
      <div className="form-box forgot-email">
        <form>
          <h1>Forgot Password</h1>
          <div className="input-box">
            <input id="fp-email" type="email" placeholder="Enter Email" />
          </div>
          <button type="button" className="btn" id="sendOtpBtn">Send OTP</button>
        </form>
      </div>
      <div className="form-box new-password">
        <form>
          <h1>New Password</h1>
          <div className="input-box">
            <input id="new-password" type="password" placeholder="New Password" />
          </div>
        </form>
      </div>
      <div className="toggle-box">
        <div className="toggle-panel toggle-left">
          <h1>Hello, Welcome!</h1>
          <p>Don't have an account?</p>
          <button className="btn" id="showRegister">Register</button>
        </div>
        <div className="toggle-panel toggle-right">
          <h1>Welcome Back!</h1>
          <p>Already have an account?</p>
          <button className="btn" id="showLogin">Login</button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;