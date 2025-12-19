import React, { useEffect } from "react";
import "../Css/Home.css";
import Navbar from "./Navbar";
import Contact from "../pages/Contact";

function Home() {

  // ⭐ Optional: verify session silently (does NOT block UI)
  useEffect(() => {
    fetch("/api/user/get-profile", {
      credentials: "include"
    }).catch(() => {
      // ignore error → home is public page
    });
  }, []);

  return (
    <>
      <Navbar />

      <div className="home">

        {/* HERO SECTION */}
        <section
          className="hero"
          style={{ backgroundImage: "url('/Images/banner.png')" }}
        >
          <div className="hero-content">
            <h1>
              Empowering Farmers. <br /> Direct Connect. <br /> Maximum Profit.
            </h1>

            <p>
              Sell your crops, buy high-quality inputs, and access loans & insurance
              all without the middleman.
            </p>

            <button className="cta-btn">
              Start Selling / Buying Today
            </button>
          </div>
        </section>

        {/* HOW AGROLINK WORKS */}
        <section className="how-section">
          <h2>How AgroLink Works</h2>

          <div className="how-container">

            <div className="how-box">
              <div className="icon-circle">
                <i className="fas fa-search"></i>
              </div>
              <p>Direct Marketplace</p>
            </div>

            <div className="how-box">
              <div className="icon-circle">
                <i className="fas fa-shopping-cart"></i>
              </div>
              <p>Connect & Transact</p>
            </div>

            <div className="how-box">
              <div className="icon-circle">
                <i className="fas fa-piggy-bank"></i>
              </div>
              <p>Loans & Financing</p>
            </div>

            <div className="how-box">
              <div className="icon-circle">
                <i className="fas fa-shield-alt"></i>
              </div>
              <p>Insurance Simplified</p>
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
