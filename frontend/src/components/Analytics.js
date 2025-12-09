import React, { useEffect, useState } from "react";
import "../Css/Analytics.css";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

function Analytics() {
  const [crops, setCrops] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userData"));
    if (!user) return;

    fetch(`http://localhost:9090/backend/api/crop/farmer?farmerId=${user.farmerId}`)
      .then((res) => res.json())
      .then((data) => setCrops(data))
      .catch(() => console.error("Analytics load error"));
  }, []);

  return (
    <>
      <Navbar />
      <div className="layout">
        <Sidebar cartCount={0} />

        <div className="content-area">
          <main className="analytics-container">
            <h2>📊 Analytics Overview</h2>
            <p className="subtitle">Track your performance and crop insights</p>

            <div className="analytics-grid">

              <div className="a-card">
                <h3>Total Crops</h3>
                <p className="big">{crops.length}</p>
              </div>

              <div className="a-card">
                <h3>Avg Price</h3>
                <p className="big">
                  ₹{Math.round(crops.reduce((a, b) => a + Number(b.price), 0) / (crops.length || 1))}
                </p>
              </div>

              <div className="a-card">
                <h3>Total Quantity</h3>
                <p className="big">
                  {crops.reduce((a, b) => a + Number(b.quantity || 0), 0)} Kg
                </p>
              </div>
            </div>

            <div className="analytics-chart">
              <h3>Crop Availability Chart</h3>

              {crops.length === 0 ? (
                <p>No data available</p>
              ) : (
                <div className="bar-chart">
                  {crops.map((c, i) => (
                    <div key={i} className="bar-item">
                      <div
                        className="bar"
                        style={{ height: `${Number(c.quantity) * 2}px` }}
                      ></div>
                      <span>{c.cropName}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </main>

          <Footer />
        </div>
      </div>
    </>
  );
}

export default Analytics;
