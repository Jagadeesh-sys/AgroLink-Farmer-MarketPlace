import React, { useState, useEffect } from "react";
import "../Css/Sell.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Sell() {
  const [cropImages, setCropImages] = useState([]);
  const [user, setUser] = useState(null);
  const [success, setSuccess] = useState(false);

  /* =========================
     LOAD USER FROM SESSION
  ========================= */
  useEffect(() => {
    fetch("/api/user/get-profile", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "error") {
          window.location.href = "/login";
        } else {
          setUser(data);
        }
      })
      .catch(() => window.location.href = "/login");
  }, []);

  /* =========================
     PASTE IMAGE SUPPORT
  ========================= */
  useEffect(() => {
    const handlePaste = (e) => {
      const items = e.clipboardData?.items || [];
      for (let item of items) {
        if (item.type.startsWith("image/")) {
          const file = item.getAsFile();
          const preview = URL.createObjectURL(file);
          setCropImages((prev) => [...prev, { file, preview }]);
        }
      }
    };
    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, []);

  /* =========================
     FORM STATE
  ========================= */
  const [form, setForm] = useState({
    cropName: "",
    category: "Grains",
    quantity: "",
    price: "",
    deliveryTime: "1 Day",
    grade: "A",
    description: "",
  });

  const updateField = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    const previews = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setCropImages((prev) => [...prev, ...previews]);
  };

  const removeImage = (index) =>
    setCropImages((prev) => prev.filter((_, i) => i !== index));

  /* =========================
     SUBMIT CROP
  ========================= */
  const submitCrop = async () => {
    if (!user?.farmerId) {
      alert("Farmer ID missing. Please complete profile.");
      return;
    }

    if (!form.cropName || !form.quantity || !form.price) {
      alert("Please fill all required fields.");
      return;
    }

    const formData = new FormData();
    formData.append("farmerId", user.farmerId);

    Object.keys(form).forEach((key) => {
      formData.append(key, form[key]);
    });

    cropImages.forEach((img) => {
      formData.append("images", img.file);
    });

    try {
      const res = await fetch("/api/crop/sellingcrop", {
        method: "POST",
        body: formData,
        credentials: "include", // ✅ REQUIRED
      });

      const result = await res.json();

      if (result.status === "SUCCESS") {
        setSuccess(true);
        setCropImages([]);
        setForm({
          cropName: "",
          category: "Grains",
          quantity: "",
          price: "",
          deliveryTime: "1 Day",
          grade: "A",
          description: "",
        });
      } else {
        alert(result.message || "Failed to save crop");
      }
    } catch (err) {
      console.error("❌ Sell crop error:", err);
      alert("Server not reachable.");
    }
  };

  /* =========================
     SUCCESS SCREEN
  ========================= */
  if (success) {
    return (
      <>
        <Navbar />

        <div className="success-screen">
          <div className="success-box">
            <img
              src="https://cdn-icons-png.flaticon.com/512/845/845646.png"
              alt="success"
              className="success-icon"
            />

            <h2>Success</h2>
            <p>Your crop has been posted successfully.</p>

            <button className="success-btn" onClick={() => setSuccess(false)}>
              Post Another Crop
            </button>
          </div>
        </div>

        <Footer />
      </>
    );
  }

  return (
    <>
      {/* ⭐ NAVBAR */}
      <Navbar />

      {/* MAIN SELL PAGE */}
      <div className="sell-container" style={{ marginTop: "80px" }}>
        <h2 className="sell-title">
          <i className="fa fa-store"></i> Sell Your Crops
        </h2>

        <div className="sell-layout">
          {/* IMAGE UPLOAD SECTION */}
          <div className="sell-image-box">
            <div className="sell-placeholder">
              <i className="fa fa-image"></i>
              <p>Upload Crop Images</p>
              <p className="paste-hint">Or paste images (Ctrl + V)</p>
            </div>

            <label className="upload-btn">
              <i className="fa fa-upload"></i> Upload Images
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
              />
            </label>

            <div className="preview-section">
              {cropImages.map((img, index) => (
                <div className="preview-item" key={index}>
                  <img src={img.preview} className="preview-img" alt="preview" />
                  <button
                    className="preview-remove"
                    onClick={() => removeImage(index)}
                  >
                    ✖
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* FORM SECTION */}
          <div className="sell-form">
            <label className="sell-label">
              <i className="fa fa-leaf"></i> Crop Name
            </label>
            <input
              name="cropName"
              value={form.cropName}
              onChange={updateField}
              className="sell-input"
            />

            <label className="sell-label">
              <i className="fa fa-list"></i> Category
            </label>
            <select
              name="category"
              value={form.category}
              onChange={updateField}
              className="sell-input"
            >
              <option>Grains</option>
              <option>Vegetables</option>
              <option>Fruits</option>
              <option>Pulses</option>
              <option>Oil Seeds</option>
            </select>

            <div className="sell-row">
              <div>
                <label className="sell-label">
                  <i className="fa fa-weight-hanging"></i> Qty (Kg)
                </label>
                <input
                  name="quantity"
                  type="number"
                  value={form.quantity}
                  onChange={updateField}
                  className="sell-input"
                />
              </div>

              <div>
                <label className="sell-label">
                  <i className="fa fa-rupee-sign"></i> Price/Kg
                </label>
                <input
                  name="price"
                  type="number"
                  value={form.price}
                  onChange={updateField}
                  className="sell-input"
                />
              </div>
            </div>

            <label className="sell-label">
              <i className="fa fa-clock"></i> Delivery Time
            </label>
            <select
              name="deliveryTime"
              value={form.deliveryTime}
              onChange={updateField}
              className="sell-input"
            >
              <option>1 Day</option>
              <option>2–3 Days</option>
              <option>Within a Week</option>
            </select>

            <label className="sell-label">
              <i className="fa fa-star"></i> Grade
            </label>
            <select
              name="grade"
              value={form.grade}
              onChange={updateField}
              className="sell-input"
            >
              <option value="A">A (Premium)</option>
              <option value="B">B (Good)</option>
              <option value="C">C (Average)</option>
            </select>

            <label className="sell-label">
              <i className="fa fa-align-left"></i> Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={updateField}
              className="sell-textarea"
            />

            <button className="sell-submit" onClick={submitCrop}>
              <i className="fa fa-check-circle"></i> Post Crop For Sale
            </button>
          </div>
        </div>
      </div>

      {/* ⭐ FOOTER */}
      <Footer />
    </>
  );
}

export default Sell;
