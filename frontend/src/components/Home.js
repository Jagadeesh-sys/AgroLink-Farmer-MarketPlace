import React, { useEffect } from "react";
import "../Css/Home.css";
import Navbar from "./Navbar";
import Contact from "../pages/Contact"; // Keep Contact section at bottom
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

  // Optional: verify session silently
  useEffect(() => {
    apiFetch("/api/user/get-profile", {
      credentials: "include"
    }).catch(() => {
      // ignore error
    });
  }, []);

  const features = [
    {
      icon: Leaf,
      title: "Fresh Produce",
      description: "Direct from farms to your doorstep. No middlemen, maximum freshness.",
    },
    {
      icon: TrendingUp,
      title: "Fair Prices",
      description: "Farmers get better margins, buyers get competitive prices.",
    },
    {
      icon: Shield,
      title: "Quality Assured",
      description: "Every product is verified for quality and authenticity.",
    },
    {
      icon: Truck,
      title: "Fast Delivery",
      description: "Efficient logistics ensuring timely delivery across regions.",
    },
  ];

  const stats = [
    { value: "10,000+", label: "Active Farmers" },
    { value: "50,000+", label: "Happy Buyers" },
    { value: "₹50Cr+", label: "Transactions" },
    { value: "500+", label: "Districts Covered" },
  ];

  return (
    <>
      <Navbar />

      <div className="home-wrapper">

        {/* HERO SECTION */}
        <section className="hero-section">
          <div className="hero-bg">
            <img src="/Images/hero-farm.jpg" alt="Agricultural fields" className="hero-img" />
            <div className="hero-overlay"></div>
          </div>

          <div className="container hero-content-wrapper">
            <div className="hero-badge">
              <Leaf size={16} className="text-secondary" />
              <span>India's #1 Farmer Marketplace</span>
            </div>

            <h1 className="hero-title">
              Farm Fresh, <span className="text-highlight">Direct to You</span>
            </h1>

            <p className="hero-subtitle">
              Connect directly with farmers. Buy fresh produce at fair prices.
              Support sustainable agriculture.
            </p>

            <div className="hero-buttons">
              <Link to="/marketplace">
                <button className="btn btn-primary">
                  <ShoppingCart size={20} />
                  Shop Now
                </button>
              </Link>
              <Link to="/signup">
                <button className="btn btn-outline">
                  Become a Seller
                  <ArrowRight size={20} />
                </button>
              </Link>
            </div>

            <div className="hero-trust">
              {["Verified Farmers", "Secure Payments", "Quality Checked"].map((badge) => (
                <div key={badge} className="trust-item">
                  <CheckCircle size={16} className="text-secondary" />
                  <span>{badge}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* STATS SECTION */}
        <section className="stats-section">
          <div className="container stats-grid">
            {stats.map((stat, index) => (
              <div key={stat.label} className="stat-card">
                <p className="stat-value">{stat.value}</p>
                <p className="stat-label">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section className="features-section">
          <div className="container">
            <div className="section-header">
              <h2>
                Why Choose <span className="text-gradient">AgroLink</span>?
              </h2>
              <p>We're revolutionizing how India buys and sells agricultural produce.</p>
            </div>

            <div className="features-grid">
              {features.map((feature) => (
                <div key={feature.title} className="feature-card">
                  <div className="feature-icon-wrapper">
                    <feature.icon size={28} className="feature-icon" />
                  </div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="cta-section">
          <div className="container">
            <h2>Ready to Get Started?</h2>
            <p>Join thousands of farmers and buyers already using AgroLink.</p>
            <div className="cta-buttons">
              <Link to="/signup">
                <button className="btn btn-primary">Create Free Account</button>
              </Link>
              <Link to="/marketplace">
                <button className="btn btn-outline-light">Browse Marketplace</button>
              </Link>
            </div>
          </div>
        </section>

        {/* CONTACT SECTION */}
        <Contact />

      </div>
    </>
  );
}

export default Home;
