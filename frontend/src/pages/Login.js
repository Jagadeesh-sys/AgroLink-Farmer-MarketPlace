import React, { useState } from "react";
import "../Css/Auth.css";
import { loginUser } from "../api/authApi";

function Login() {
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const handleLogin = async () => {
    const data = await loginUser(mobile, password);

    if (data.status === "success") {

      // ⭐ Save both full name and mobile number
      localStorage.setItem("userName", data.fullName);
      localStorage.setItem("userMobile", mobile);

      setShowPopup(true);

      // Redirect after 2 seconds
      setTimeout(() => {
        window.location.href = "/home";
      }, 2000);

    } else {
      alert(data.message);
    }
  };

  const handleOk = () => {
    setShowPopup(false);
    window.location.href = "/home";
  };

  return (
    <div className="auth-container">

      {/* SUCCESS POPUP */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-card">
            <div className="popup-icon">✓</div>

            <h2>Congrats!</h2>
            <p>You have successfully logged in!</p>

            <button className="popup-btn" onClick={handleOk}>
              OK
            </button>
          </div>
        </div>
      )}

      <div className="auth-box">
        <h2>Welcome Back!</h2>

        <input
          type="tel"
          placeholder="Mobile Number"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="auth-btn" onClick={handleLogin}>
          Log In
        </button>

        <p className="auth-switch">
          Don't have an account? <a href="/signup">Create Account</a>
        </p>
      </div>
    </div>
  );
}

export default Login;
