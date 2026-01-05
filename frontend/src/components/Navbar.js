import React, { useEffect, useState, useRef } from "react";
import "../Css/Navbar.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { apiFetch } from "../api/apiClient";

function Navbar() {
  /* ==============================
     STATE
  ============================== */
  const [user, setUser] = useState(null);
  const [showMenu, setShowMenu] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  /* ==============================
     LOAD USER FROM SESSION
  ============================== */
  useEffect(() => {
    const loadProfile = async () => {
      // Don't set loading(true) here to prevent navbar flash on navigation
      try {
        const res = await apiFetch("/api/user/get-profile", {
          credentials: "include",
          cache: "no-store",
        });

        if (!res.ok) {
          setUser(null);
          return;
        }

        const data = await res.json();

        if (data?.status === "error" || !data?.fullName) {
          setUser(null);
        } else {
          setUser(data);
        }
      } catch (err) {
        console.error("Navbar profile error:", err);
        setUser(null);
      } finally {
        // loading state removed
      }
    };

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
     LOGOUT
  ============================== */
  const handleLogout = async () => {
    try {
      await apiFetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch { }

    setUser(null);
    setShowMenu(false);
    window.location.replace("/login");
  };



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
      {user ? (
        <div className="profile-dropdown-container" ref={dropdownRef}>
          <div
            className="profile-mini"
            onClick={() => setShowMenu((prev) => !prev)}
          >
            <div className="profile-circle">
              <i className="fa-regular fa-user"></i>
            </div>
            <span className="profile-text">{user.fullName}</span>
            <i className={`fa-solid fa-chevron-down profile-arrow ${showMenu ? 'open' : ''}`}></i>
          </div>

          {showMenu && (
            <div className="profile-dropdown">
              {/* Profile Header */}
              <div className="profile-header">
                <p className="user-name">{user.fullName}</p>
                <p className="user-email">{user.email || "No email"}</p>
                <span className="role-badge">{user.role || "USER"}</span>
              </div>

              <div className="dropdown-divider"></div>

              {/* Menu Items */}
              <div className="dropdown-item" onClick={() => navigate("/dashboard")}>
                <i className="fa-solid fa-table-columns"></i>
                <span>Dashboard</span>
              </div>

              <div className="dropdown-item" onClick={() => navigate("/profile")}>
                <i className="fa-regular fa-user"></i>
                <span>Profile</span>
              </div>

              <div className="dropdown-item" onClick={() => navigate("/orders")}>
                <i className="fa-solid fa-box-open"></i>
                <span>My Orders</span>
              </div>

              {user.systemRole === "ADMIN" && (
                <div className="dropdown-item" onClick={() => navigate("/admin")}>
                  <i className="fa-solid fa-lock"></i>
                  <span>Admin Panel</span>
                </div>
              )}

              <div className="dropdown-divider"></div>

              <div className="dropdown-item logout" onClick={handleLogout}>
                <i className="fa-solid fa-arrow-right-from-bracket"></i>
                <span>Logout</span>
              </div>
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
