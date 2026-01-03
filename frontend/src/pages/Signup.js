import React, { useState } from "react";
import "../Css/Auth.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { apiFetch } from "../api/apiClient";

function Signup() {
  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (!fullName || !mobile || !password || !confirm) {
      alert("All fields are required");
      return;
    }

    if (mobile.length !== 10) {
      alert("Mobile number must be 10 digits");
      return;
    }

    if (password !== confirm) {
      alert("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const res = await apiFetch("/api/auth/signup", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          fullName: fullName.trim(),
          mobile: mobile.trim(),
          password,
        }),
      });

      const data = await res.json();

      if (data.status === "success") {
        setShowPopup(true);
      } else {
        alert(data.message || "Signup failed");
        setLoading(false);
      }

    } catch (error) {
      console.error("Signup error:", error);
      alert("Server error");
      setLoading(false);
    }
  };

  const handleOk = () => {
    setShowPopup(false);
    window.location.href = "/login";
  };

  return (
    <>
      {/* NAVBAR */}
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

        <form className="auth-box" onSubmit={handleSignup}>
          <h2>Create Your Account</h2>

          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />

          <input
            type="tel"
            placeholder="Mobile Number"
            value={mobile}
            maxLength="10"
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

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />

          <button className="auth-btn" type="submit" disabled={loading}>
            {loading ? "Creating..." : "Sign Up"}
          </button>

          <p className="auth-switch">
            Already have an account? <a href="/login">Log In</a>
          </p>
        </form>
      </div>

      {/* FOOTER */}
      <Footer />
    </>
  );
}

export default Signup;
