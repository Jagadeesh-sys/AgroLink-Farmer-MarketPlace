import React from "react";
import "../Css/Sidebar.css";
import { useNavigate, useLocation } from "react-router-dom";

function Sidebar({ cartCount }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Helper: Check if route is active
  const isActive = (path) => location.pathname === path;

  return (
    <aside className="sidebar">
      <h2 className="logo">AgroLink</h2>

      <ul className="menu">

        {/* Dashboard */}
        <li
          className={isActive("/dashboard") ? "active" : ""}
          onClick={() => navigate("/dashboard")}
        >
          <i className="fa-solid fa-gauge"></i> Dashboard
        </li>

        {/* My Crops */}
        <li
          className={isActive("/dashboard/mycrops") ? "active" : ""}
          onClick={() => navigate("/dashboard")}
        >
          <i className="fa-solid fa-leaf"></i> My Crops
        </li>

        {/* Cart */}
        <li
          className={isActive("/cart") ? "active" : ""}
          onClick={() => navigate("/cart")}
        >
          <i className="fa-solid fa-cart-shopping"></i> Cart
          <span className="cart-badge">{cartCount}</span>
        </li>

        {/* Analytics */}
        <li>
          <i className="fa-solid fa-chart-line"></i> Analytics
        </li>

        {/* Settings */}
        <li>
          <i className="fa-solid fa-gear"></i> Settings
        </li>

        {/* Support */}
        <li>
          <i className="fa-solid fa-headset"></i> Support
        </li>

      </ul>
    </aside>
  );
}

export default Sidebar;
