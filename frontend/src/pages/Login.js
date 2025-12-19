import React, { useState } from "react";
import "../Css/Auth.css";
import { loginUser } from "../api/authApi";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Login() {
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (!mobile || !password) {
      alert("Please enter mobile number and password");
      return;
    }

    try {
      setLoading(true);

      const data = await loginUser(mobile.trim(), password);

      if (data.status === "success") {
        setShowSuccess(true);

        // ⭐ IMPORTANT: full reload so session cookie is applied
        setTimeout(() => {
          window.location.href = "/home";
        }, 1200);

      } else {
        alert(data.message || "Login failed");
        setLoading(false);
      }

    } catch (err) {
      console.error("Login error:", err);
      alert("Server error");
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      {/* ✅ SUCCESS POPUP */}
      {showSuccess && (
        <div className="popup-overlay">
          <div className="popup-card">
            <div className="popup-icon">✓</div>
            <h2>Login Successful</h2>
            <p>Welcome back!</p>
          </div>
        </div>
      )}

      <div className="auth-container">
        <form className="auth-box" onSubmit={handleLogin}>
          <h2>Login</h2>

          <input
            type="tel"
            placeholder="Mobile Number"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>
      </div>

      <Footer />
    </>
  );
}

export default Login;
