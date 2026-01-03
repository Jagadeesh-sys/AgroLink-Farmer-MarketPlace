import React, { useEffect, useState, useRef } from "react";
import "../Css/Navbar.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { apiFetch } from "../api/apiClient";

function Navbar() {
  const [userName, setUserName] = useState(null);
  const [systemRole, setSystemRole] = useState(null); // ADMIN / USER
  const [showMenu, setShowMenu] = useState(false);
  const [loading, setLoading] = useState(true); // ⭐ NEW

  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  /* ==============================
     LOAD USER FROM SESSION (SAFE)
  ============================== */
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await apiFetch("/api/user/get-profile", {
          credentials: "include",
          cache: "no-store",
        });

        if (!res.ok) {
          setUserName(null);
          setSystemRole(null);
          return;
        }

        const data = await res.json();

        if (data?.status === "error" || !data?.fullName) {
          setUserName(null);
          setSystemRole(null);
        } else {
          setUserName(data.fullName);
          setSystemRole(data.systemRole || null);
        }
      } catch (err) {
        console.error("Navbar profile error:", err);
        setUserName(null);
        setSystemRole(null);
      } finally {
        setLoading(false); // ⭐ IMPORTANT
      }
    };

    setLoading(true);
    loadProfile();
    setShowMenu(false);
  }, [location.pathname]);

  /* ==============================
     CLOSE DROPDOWN ON OUTSIDE CLICK
  ============================== */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ==============================
     LOGOUT (FINAL)
  ============================== */
  const handleLogout = async () => {
    try {
      await apiFetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch {}

    // 🔥 CLEAR STATE
    setUserName(null);
    setSystemRole(null);
    setShowMenu(false);

    // 🔥 HARD RELOAD
    window.location.replace("/login");
  };

  /* ==============================
     PREVENT FLICKER
  ============================== */
  if (loading) return null;

  return (
    <nav className="nav">
      {/* LOGO */}
      <div
        className="nav-left"
        onClick={() => navigate("/home")}
        style={{ cursor: "pointer" }}
      >
        <img src="/Images/Logo1.png" alt="AgroLink Logo" className="logo" />
      </div>

      {/* MENU */}
      <ul className="nav-menu">
        <li onClick={() => navigate("/home")}>Home</li>
        <li onClick={() => navigate("/marketplace")}>Marketplace</li>
        <li onClick={() => navigate("/marketplace/seeds")}>Inputs</li>
        <li onClick={() => navigate("/loans")}>Loans</li>
        <li onClick={() => navigate("/insurance")}>Insurance</li>
        <li onClick={() => navigate("/impact")}>Impact</li>
        <li onClick={() => navigate("/contact")}>Contact</li>
      </ul>

      {/* USER / AUTH */}
      {userName ? (
        <div className="profile-dropdown-container" ref={dropdownRef}>
          <div
            className="profile-mini"
            onClick={() => setShowMenu((prev) => !prev)}
          >
            <div className="profile-circle">
              {userName.charAt(0).toUpperCase()}
            </div>
            <span className="profile-text">{userName}</span>
          </div>

          {showMenu && (
            <div className="profile-dropdown">
              <p onClick={() => navigate("/profile")}>My Profile</p>
              <p onClick={() => navigate("/dashboard")}>Dashboard</p>

              {/* ⭐ ADMIN ONLY */}
              {systemRole === "ADMIN" && (
                <p onClick={() => navigate("/admin")}>Admin Dashboard</p>
              )}

              <p className="logout" onClick={handleLogout}>
                Logout
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="nav-btns">
          <Link to="/signup">
            <button className="signup">Sign Up</button>
          </Link>
          <Link to="/login">
            <button className="login">Log In</button>
          </Link>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
