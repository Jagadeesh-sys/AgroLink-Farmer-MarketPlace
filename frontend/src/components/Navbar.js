// src/components/Navbar.js
import React, { useEffect, useState } from "react";
import "../Css/Navbar.css";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const [userName, setUserName] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const name = localStorage.getItem("userName");
    if (name) setUserName(name);
  }, []);

  const goToProfile = () => {
    navigate("/profile");
  };

  const goHome = () => {
    navigate("/home");
  };

  return (
    <nav className="nav">
      <div className="nav-left">
        <img src="/Images/Logo1.png" alt="AgroLink Logo" className="logo" />
      </div>

      {/* NAV MENU */}
      <ul className="nav-menu">
        <li onClick={goHome} className="home-item">Home</li>
        <li>Marketplace</li>
        <li>Inputs</li>
        <li>Loans</li>
        <li>Insurance</li>
        <li>Impact</li>
        <li>Contact</li>
      </ul>

      {userName ? (
        <div className="profile-mini" onClick={goToProfile}>
          <div className="profile-circle">{userName.charAt(0)}</div>
          <span className="profile-text">{userName}</span>
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
