import React, { useEffect, useState, useRef } from "react";
import "../Css/Navbar.css";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const [userName, setUserName] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  const dropdownRef = useRef(null);

  // Load user from localStorage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userData"));
    if (user) {
      setUserName(user.fullName);
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userData");
    navigate("/login");
  };

  return (
    <nav className="nav">
      {/* LEFT SIDE - LOGO */}
      <div className="nav-left" onClick={() => navigate("/home")} style={{ cursor: "pointer" }}>
        <img src="/Images/Logo1.png" alt="AgroLink Logo" className="logo" />
      </div>

      {/* CENTER MENU */}
      <ul className="nav-menu">
        <li onClick={() => navigate("/home")}>Home</li>
        <li onClick={() => navigate("/marketplace")}>Marketplace</li>
        <li>Inputs</li>
        <li>Loans</li>
        <li>Insurance</li>
        <li>Impact</li>
        <li>Contact</li>
      </ul>

      {/* RIGHT SIDE – USER PROFILE OR LOGIN BUTTONS */}
      {userName ? (
        <div className="profile-dropdown-container" ref={dropdownRef}>
          <div
            className="profile-mini"
            onClick={() => setShowMenu((prev) => !prev)}
          >
            <div className="profile-circle">{userName.charAt(0)}</div>
            <span className="profile-text">{userName}</span>
          </div>

          {showMenu && (
            <div className="profile-dropdown">
              <p onClick={() => { navigate("/profile"); setShowMenu(false); }}>
                <i className="fa-solid fa-user"></i> My Profile
              </p>

              <p onClick={() => { navigate("/dashboard"); setShowMenu(false); }}>
                <i className="fa-solid fa-gauge-high"></i> Dashboard
              </p>

              <p onClick={() => { navigate("/settings"); setShowMenu(false); }}>
                <i className="fa-solid fa-gear"></i> Settings
              </p>

              <p className="logout" onClick={handleLogout}>
                <i className="fa-solid fa-right-from-bracket"></i> Logout
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="nav-btns">
          <Link to="/signup"><button className="signup">Sign Up</button></Link>
          <Link to="/login"><button className="login">Log In</button></Link>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
