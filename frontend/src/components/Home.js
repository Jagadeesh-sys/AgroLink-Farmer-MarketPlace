import React, { useEffect } from "react";
import "../Css/Home.css";
import Navbar from "./Navbar";
import Contact from "../pages/Contact";
import { apiFetch } from "../api/apiClient";
import { Link } from "react-router-dom";
import {
  Leaf,
  ShoppingCart,
  TrendingUp,
  Shield,
  Truck,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

function Home() {

  useEffect(() => {
    apiFetch("/api/user/get-profile", {
      credentials: "include",
    }).catch(() => { });
  }, []);

  const stats = [
    { value: "10,000+", label: "Active Farmers" },
    { value: "50,000+", label: "Happy Buyers" },
    { value: "₹50Cr+", label: "Transactions" },
    { value: "500+", label: "Districts Covered" },
  ];

  const features = [
    {
      icon: Leaf,
      title: "Fresh Produce",
      description: "Direct from farms to your doorstep.",
    },
    {
      icon: TrendingUp,
      title: "Fair Prices",
      description: "Better margins for farmers & buyers.",
    },
    {
      icon: Shield,
      title: "Quality Assured",
      description: "Verified & quality-checked products.",
    },
    {
      icon: Truck,
      title: "Fast Delivery",
      description: "Reliable logistics across regions.",
    },
  ];

  return (
    <>
      <Navbar />

      <div className="home-wrapper">

        {/* HERO */}
        <section className="hero-section">
          <div className="hero-bg">
            <img
              src="/Images/hero-farm.jpg"
              alt="Farm"
              className="hero-img"
            />
            <div className="hero-overlay"></div>
          </div>

          <div className="hero-content-wrapper container">
            <div className="hero-badge">
              <Leaf size={16} />
              <span>India's #1 Farmer Marketplace</span>
            </div>

            <h1 className="hero-title">
              Farm Fresh, <span className="text-highlight">Direct to You</span>
            </h1>

            <p className="hero-subtitle">
              Connect directly with farmers and buy fresh produce at fair prices.
            </p>

            <div className="hero-buttons">
              <Link to="/marketplace">
                <button className="btn btn-primary">
                  <ShoppingCart size={18} /> Shop Now
                </button>
              </Link>
              <Link to="/signup">
                <button className="btn btn-outline">
                  Become a Seller <ArrowRight size={18} />
                </button>
              </Link>
            </div>

            <div className="hero-trust">
              {["Verified Farmers", "Secure Payments", "Quality Checked"].map(
                (item) => (
                  <div key={item} className="trust-item">
                    <CheckCircle size={16} />
                    <span>{item}</span>
                  </div>
                )
              )}
            </div>
          </div>
        </section>

        {/* ===== STATS (IMAGE MATCH) ===== */}
        <section className="stats-section">
          <div className="stats-grid">
            {stats.map((stat) => (
              <div key={stat.label} className="stat-card">
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* FEATURES */}
        <section className="features-section">
          <div className="container">
            <div className="section-header">
              <h2>
                Why Choose <span className="text-gradient">AgroLink</span>?
              </h2>
              <p>We're revolutionizing Indian agriculture.</p>
            </div>

            <div className="features-grid">
              {features.map((f) => (
                <div key={f.title} className="feature-card">
                  <div className="feature-icon-wrapper">
                    <f.icon size={28} />
                  </div>
                  <h3>{f.title}</h3>
                  <p>{f.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Contact />
      </div>
    </>
  );
}

export default Home;
