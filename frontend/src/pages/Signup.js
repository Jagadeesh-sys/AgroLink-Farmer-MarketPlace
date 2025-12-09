import React, { useState } from "react";
import "../Css/Auth.css";
import Navbar from "../components/Navbar";   // ⭐ add navbar
import Footer from "../components/Footer";   // ⭐ add footer

function Signup() {
  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const handleSignup = async () => {
    if (password !== confirm) {
      alert("Passwords do not match");
      return;
    }

    try {
      const res = await fetch("http://localhost:9090/backend/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          fullName,
          mobile,
          password
        })
      });

      const data = await res.json();

      if (data.status === "success") {
        setShowPopup(true);
      } else {
        alert(data.message);
      }

    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  const handleOk = () => {
    setShowPopup(false);
    window.location.href = "/login";
  };

  return (
    <>
      {/* ⭐ NAVBAR */}
      <Navbar />

      <div className="auth-container">

        {/* SUCCESS POPUP */}
        {showPopup && (
          <div className="popup-overlay">
            <div className="popup-card">
              <div className="popup-icon">✓</div>
              <h2>Congrats!</h2>
              <p>Your account is created!</p>

              <button className="popup-btn" onClick={handleOk}>
                OK
              </button>
            </div>
          </div>
        )}

        <div className="auth-box">
          <h2>Create Your Account</h2>

          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />

          <input
            type="tel"
            placeholder="Mobile Number"
            value={mobile}
            maxLength="10"
            onChange={(e) => setMobile(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />

          <button className="auth-btn" onClick={handleSignup}>
            Sign Up
          </button>

          <p className="auth-switch">
            Already have an account? <a href="/login">Log In</a>
          </p>
        </div>
      </div>

      {/* ⭐ FOOTER */}
      <Footer />
    </>
  );
}

export default Signup;
