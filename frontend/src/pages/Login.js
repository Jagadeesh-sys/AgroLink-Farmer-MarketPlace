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
      const user = data.user;

      // ⭐ SAVE FULL USER DATA INCLUDING FARMER ID
      localStorage.setItem("userData", JSON.stringify(user));
      localStorage.setItem("userName", user.fullName);
      localStorage.setItem("userMobile", user.mobile);

      setShowPopup(true);

      setTimeout(() => {
        window.location.href = "/home";
      }, 1500);

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

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-card">
            <div className="popup-icon">✓</div>
            <h2>Login Successful</h2>
            <p>Welcome Back!</p>
            <button className="popup-btn" onClick={handleOk}>OK</button>
          </div>
        </div>
      )}

      <div className="auth-box">
        <h2>Login</h2>

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
