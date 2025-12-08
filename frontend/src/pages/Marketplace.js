import React from "react";
import "../Css/Marketplace.css";
import { Link, Outlet, useLocation } from "react-router-dom";

function Marketplace() {
  const { pathname } = useLocation();

  return (
    <div className="marketplace-container">

      {/* INTERNAL NAVBAR */}
      <div className="marketplace-nav">

        <Link to="sell" className={`mp-tab ${pathname.endsWith("sell") ? "active" : ""}`}>
          <i className="fa fa-store"></i> Sell
        </Link>

        <Link to="buy" className={`mp-tab ${pathname.endsWith("buy") ? "active" : ""}`}>
          <i className="fa fa-handshake"></i> Buy
        </Link>

        <Link to="seeds" className={`mp-tab ${pathname.endsWith("seeds") ? "active" : ""}`}>
          <i className="fa fa-seedling"></i> Seeds
        </Link>

        <Link to="pesticides" className={`mp-tab ${pathname.endsWith("pesticides") ? "active" : ""}`}>
          <i className="fa fa-vial"></i> Pesticides
        </Link>

        <Link to="fertilizers" className={`mp-tab ${pathname.endsWith("fertilizers") ? "active" : ""}`}>
          <i className="fa fa-leaf"></i> Fertilizers
        </Link>

      </div>

      {/* PAGE WILL LOAD HERE */}
      <div className="marketplace-content">
        <Outlet />
      </div>

    </div>
  );
}

export default Marketplace;
