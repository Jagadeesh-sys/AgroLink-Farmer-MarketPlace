import React from "react";
import "../Css/Sidebar.css";
import { useNavigate, useLocation } from "react-router-dom";

function Sidebar({ cartCount }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Highlight active menu item
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
          <i className="fa-solid fa-gauge"></i>
          <span>Dashboard</span>
        </li>

        {/* My Crops */}
        <li
          className={isActive("/dashboard/mycrops") ? "active" : ""}
          onClick={() => navigate("/dashboard/mycrops")}
        >
          <i className="fa-solid fa-leaf"></i>
          <span>My Crops</span>
        </li>

        {/* My Orders */}
        <li
          className={isActive("/my-orders") ? "active" : ""}
          onClick={() => navigate("/my-orders")}
        >
          <i className="fa-solid fa-box"></i>
          <span>My Orders</span>
        </li>

        {/* Cart */}
        <li
          className={isActive("/cart") ? "active" : ""}
          onClick={() => navigate("/cart")}
        >
          <i className="fa-solid fa-cart-shopping"></i>
          <span>Cart</span>
          {cartCount > 0 && (
            <span className="cart-badge">{cartCount}</span>
          )}
        </li>

        {/* Analytics */}
        <li
          className={isActive("/analytics") ? "active" : ""}
          onClick={() => navigate("/analytics")}
        >
          <i className="fa-solid fa-chart-line"></i>
          <span>Analytics</span>
        </li>

        {/* Settings */}
        <li
          className={isActive("/settings") ? "active" : ""}
          onClick={() => navigate("/settings")}
        >
          <i className="fa-solid fa-gear"></i>
          <span>Settings</span>
        </li>

        {/* Support */}
        <li
          className={isActive("/support") ? "active" : ""}
          onClick={() => navigate("/support")}
        >
          <i className="fa-solid fa-headset"></i>
          <span>Support</span>
        </li>
      </ul>
    </aside>
  );
}

export default Sidebar;
