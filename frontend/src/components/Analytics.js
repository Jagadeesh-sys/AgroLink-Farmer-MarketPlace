import React, { useEffect, useState } from "react";
import "../Css/Analytics.css";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import { apiFetch } from "../api/apiClient";

function Analytics() {
  const [crops, setCrops] = useState([]);

  /* =========================
     LOAD USER (SESSION) + CROPS
  ========================= */
  useEffect(() => {
    apiFetch("/api/user/get-profile", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((user) => {
        if (!user || user.status === "error") {
          window.location.href = "/login";
          return;
        }

        return apiFetch(
          `/api/crop/farmer?farmerId=${user.farmerId}`,
          { credentials: "include" }
        );
      })
      .then((res) => res?.json())
      .then((data) => setCrops(data || []))
      .catch(() => console.error("Analytics load error"));
  }, []);

  /* =========================
     CALCULATIONS
  ========================= */
  const totalCrops = crops.length;

  const avgPrice =
    totalCrops === 0
      ? 0
      : Math.round(
          crops.reduce((sum, c) => sum + Number(c.price || 0), 0) / totalCrops
        );

  const totalQty = crops.reduce(
    (sum, c) => sum + Number(c.quantity || 0),
    0
  );

  return (
    <>
      <Navbar />

      <div className="layout">
        <Sidebar cartCount={0} />

        <div className="content-area">
          <main className="analytics-container">
            <h2>📊 Analytics Overview</h2>
            <p className="subtitle">
              Track your performance and crop insights
            </p>

            <div className="analytics-grid">
              <div className="a-card">
                <h3>Total Crops</h3>
                <p className="big">{totalCrops}</p>
              </div>

              <div className="a-card">
                <h3>Avg Price</h3>
                <p className="big">₹{avgPrice}</p>
              </div>

              <div className="a-card">
                <h3>Total Quantity</h3>
                <p className="big">{totalQty} Kg</p>
              </div>
            </div>

            <div className="analytics-chart">
              <h3>Crop Availability Chart</h3>

              {crops.length === 0 ? (
                <p>No data available</p>
              ) : (
                <div className="bar-chart">
                  {crops.map((c, i) => (
                    <div key={c.cropId || i} className="bar-item">
                      <div
                        className="bar"
                        style={{
                          height: `${Math.max(
                            Number(c.quantity || 0) * 2,
                            10
                          )}px`,
                        }}
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
