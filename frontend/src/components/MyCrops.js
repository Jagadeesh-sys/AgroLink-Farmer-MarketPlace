import React, { useEffect, useState } from "react";
import "../Css/MyCrops.css";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

function MyCrops() {
  const [crops, setCrops] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userData"));
    if (!user) return;

    fetch(`http://localhost:9090/backend/api/crop/farmer?farmerId=${user.farmerId}`)
      .then((res) => res.json())
      .then((data) => setCrops(data))
      .catch(() => console.error("My crops load error"));
  }, []);

  return (
    <>
      <Navbar />
      <div className="layout">
        <Sidebar cartCount={0} />

        <div className="content-area">
          <main className="page-crops">
            <h2>🌱 My Crops</h2>
            <p className="subtitle">Manage and monitor your crop listings</p>

            <div className="crops-list">
              {crops.length === 0 ? (
                <p>No crops added yet.</p>
              ) : (
                crops.map((crop) => (
                  <div key={crop.cropId} className="crop-card">
                    <img
                      src={`http://localhost:9090/backend/uploads/${crop.images?.split(",")[0]}`}
                      className="crop-img"
                      alt=""
                    />

                    <h3>{crop.cropName}</h3>
                    <p>Category: {crop.category}</p>
                    <p>Quantity: {crop.quantity} Kg</p>
                    <p>Price: ₹{crop.price}</p>
                  </div>
                ))
              )}
            </div>
          </main>

          <Footer />
        </div>
      </div>
    </>
  );
}

export default MyCrops;
