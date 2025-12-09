import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../Css/Dashboard.css";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [crops, setCrops] = useState([]);
  const [editingCrop, setEditingCrop] = useState(null);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("userData"));
    if (stored) {
      setUser(stored);

      fetch(`http://localhost:9090/backend/api/crop/farmer?farmerId=${stored.farmerId}`)
        .then((res) => res.json())
        .then((data) => setCrops(data))
        .catch(() => console.error("Failed to load crops"));
    }

    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartCount(cart.length);
  }, []);

  const getFirstImage = (images) => {
    if (!images) return "/Images/noimg.png";
    return `http://localhost:9090/backend/uploads/${images.split(",")[0].trim()}`;
  };

  const deleteCrop = (cropId, images) => {
    if (!window.confirm("Are you sure you want to delete this crop?")) return;

    fetch("http://localhost:9090/backend/api/crop/delete", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `cropId=${cropId}&images=${encodeURIComponent(images)}`,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "SUCCESS") {
          alert("Crop deleted!");
          setCrops((prev) => prev.filter((c) => c.cropId !== cropId));
        }
      })
      .catch(() => alert("Delete failed"));
  };

  const saveEdit = () => {
    const formData = new FormData();
    formData.append("cropId", editingCrop.cropId);
    formData.append("cropName", editingCrop.cropName);
    formData.append("category", editingCrop.category);
    formData.append("quantity", editingCrop.quantity);
    formData.append("price", editingCrop.price);
    formData.append("description", editingCrop.description);

    fetch("http://localhost:9090/backend/api/crop/update", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "SUCCESS") {
          alert("Crop updated!");
          setCrops((prev) =>
            prev.map((c) => (c.cropId === editingCrop.cropId ? editingCrop : c))
          );
          setEditingCrop(null);
        }
      })
      .catch(() => alert("Update failed"));
  };

  return (
    <>
      {/* NAVBAR */}
      <Navbar />

      {/* MAIN LAYOUT */}
      <div className="layout">
        <Sidebar cartCount={cartCount} />

        {/* RIGHT CONTENT */}
        <div className="content-area">
          <main className="page-content" role="main" aria-labelledby="dashboard-title">
            {/* HEADER: Page title and quick user peek */}
            <header className="top-header">
              <div>
                <h2 id="dashboard-title">Welcome, {user?.fullName} 👋</h2>
                <p>Your farming insights and performance summary</p>
              </div>
              <div className="profile-box" aria-hidden="true">
                <i className="fa-solid fa-user"></i>
              </div>
            </header>

            {/* STATS: Key performance indicators */}
            <section className="stats-container" aria-label="Key performance indicators">
              <div className="stat-card">
                <i className="fa-solid fa-wheat-awn"></i>
                <h3>{crops.length}</h3>
                <p>Total Crops Listed</p>
              </div>

              <div className="stat-card">
                <i className="fa-solid fa-wallet"></i>
                <h3>₹0</h3>
                <p>Total Earnings (Coming Soon)</p>
              </div>

              <div className="stat-card">
                <i className="fa-solid fa-chart-line"></i>
                <h3>Growing</h3>
                <p>Market Trends</p>
              </div>
            </section>

            {/* GRAPH: Simple bar visualization of quantities */}
            <section className="graph-section" aria-label="Market activity overview">
              <h3>Market Activity Overview</h3>

              <div className="graph-container">
                {crops.length > 0 ? (() => {
                  const maxQty = Math.max(...crops.map((c) => Number(c.quantity) || 0));
                  const step = Math.ceil(maxQty / 5);
                  const yValues = Array.from({ length: 6 }, (_, i) => (5 - i) * step);

                  return (
                    <div className="graph-wrapper">
                      <div className="y-axis">
                        {yValues.map((v, i) => (
                          <span key={i}>{v}</span>
                        ))}
                      </div>

                      <div className="graph-area">
                        {crops.map((c, i) => {
                          const height = (Number(c.quantity) / (step * 5)) * 200;
                          return (
                            <div key={i} className="graph-col">
                              <div className="bar" style={{ height: `${height}px` }}></div>
                              <span className="x-label">{c.cropName}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })() : (
                  <p className="no-graph">No data available</p>
                )}

                <div className="highest-list">
                  <h4>Highest Available Crops</h4>
                  {crops
                    .slice()
                    .sort((a, b) => Number(b.quantity) - Number(a.quantity))
                    .map((c, i) => (
                      <div className="list-item" key={i}>
                        <span>{i + 1}. {c.cropName}</span>
                        <strong>{c.quantity} Kg</strong>
                      </div>
                    ))}
                </div>
              </div>
            </section>

            {/* CROP TABLE: Manage your crops with quick actions */}
            <section className="crop-table-section" aria-label="Your crop listings">
              <h3>Your Crop Listings</h3>

              <table className="crop-table" role="table" aria-label="Your Crop Listings">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Crop ID</th>
                    <th>Crop</th>
                    <th>Category</th>
                    <th>Qty</th>
                    <th>Price</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {crops.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="no-data">
                        {/* EMPTY STATE: Encourage first action */}
                        No crops posted yet.
                        <br />
                        <small>Start by adding your first crop listing in Marketplace.</small>
                        <div style={{ marginTop: "10px" }}>
                          <Link className="empty-state-link" to="/marketplace/sell">Go to Sell</Link>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    crops.map((c) => (
                      <tr key={c.cropId}>
                        <td>
                          <img src={getFirstImage(c.images)} className="crop-img" alt="crop" />
                        </td>
                        <td>{c.cropId}</td>
                        <td>{c.cropName}</td>
                        <td>{c.category}</td>
                        <td>{c.quantity} kg</td>
                        <td>₹{c.price}</td>

                        <td className="action-btns">
                          
                          {/* EDIT BUTTON */}
                          <button className="edit-btn" title="Edit Crop" onClick={() => setEditingCrop(c)}>
                            <i className="fa-solid fa-pen-to-square"></i>
                          </button>

                          {/* DELETE BUTTON */}
                          <button className="delete-btn" title="Delete Crop" onClick={() => deleteCrop(c.cropId, c.images)}>
                            <i className="fa-solid fa-trash"></i>
                          </button>

                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </section>
          </main>

          {/* FOOTER */}
          <Footer />
        </div>
      </div>

      {/* EDIT POPUP */}
      {editingCrop && (
        <div className="edit-popup">
          <div className="edit-box">

            <h2>Edit Crop</h2>

            <input
              type="text"
              value={editingCrop.cropName}
              onChange={(e) => setEditingCrop({ ...editingCrop, cropName: e.target.value })}
            />

            <input
              type="text"
              value={editingCrop.category}
              onChange={(e) => setEditingCrop({ ...editingCrop, category: e.target.value })}
            />

            <input
              type="number"
              value={editingCrop.quantity}
              onChange={(e) => setEditingCrop({ ...editingCrop, quantity: e.target.value })}
            />

            <input
              type="number"
              value={editingCrop.price}
              onChange={(e) => setEditingCrop({ ...editingCrop, price: e.target.value })}
            />

            <textarea
              value={editingCrop.description}
              onChange={(e) => setEditingCrop({ ...editingCrop, description: e.target.value })}
            ></textarea>

            <div className="edit-actions">
              
              <button className="save-btn" onClick={saveEdit}>
                <i className="fa-solid fa-check"></i> Save
              </button>

              <button className="cancel-btn" onClick={() => setEditingCrop(null)}>
                <i className="fa-solid fa-xmark"></i> Cancel
              </button>

            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Dashboard;
