import React, { useEffect, useState } from "react";
import "../Css/Profile.css";

function Profile() {
  const mobile = localStorage.getItem("userMobile");

  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const [user, setUser] = useState({
    fullName: "",
    email: "",
    address: "",
    state: "",
    district: "",
    pincode: "",
    farmSize: "",
    mainCrops: "",
    bankAccount: "",
    ifsc: "",
    gst: "",
    pan: "",
    aadhar: "",
    profilePhoto: "",
    document1: "",
    document2: "",
    verified: 0,
    role: "Farmer",
  });

  const [photoFile, setPhotoFile] = useState(null);
  const [doc1, setDoc1] = useState(null);
  const [doc2, setDoc2] = useState(null);

  // Fetch Profile After Login
  useEffect(() => {
    if (!mobile) return;

    setLoading(true);
    fetch(`http://localhost:9090/backend/api/user/get-profile?mobile=${mobile}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          setUser((prev) => ({ ...prev, ...data.user }));
        }
      })
      .catch((err) => console.error("Profile fetch error:", err))
      .finally(() => setLoading(false));
  }, [mobile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((p) => ({ ...p, [name]: value }));
  };

  // Save Profile
  const handleSave = async () => {
    if (!mobile) {
      alert("Mobile missing. Login again.");
      return;
    }

    const fd = new FormData();

    Object.keys(user).forEach((k) => {
      if (["profilePhoto", "document1", "document2"].includes(k)) return;
      fd.append(k, user[k] ?? "");
    });

    fd.append("mobile", mobile);

    if (photoFile) fd.append("profilePhoto", photoFile);
    if (doc1) fd.append("document1", doc1);
    if (doc2) fd.append("document2", doc2);

    try {
      setLoading(true);
      const res = await fetch(
        "http://localhost:9090/backend/api/user/update-profile",
        {
          method: "POST",
          body: fd,
        }
      );

      const data = await res.json();

      if (data.status === "success") {
        setShowPopup(true); // Show green tick popup

        // refresh updated profile
        const ref = await fetch(
          `http://localhost:9090/backend/api/user/get-profile?mobile=${mobile}`
        );
        const newData = await ref.json();

        if (newData.status === "success") setUser(newData.user);

        setTimeout(() => setShowPopup(false), 2000);
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert("Update failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const profileImg = photoFile
    ? URL.createObjectURL(photoFile)
    : user.profilePhoto
    ? "http://localhost:9090/backend/" + user.profilePhoto
    : "/default-avatar.png";

  return (
    <div className="profile-page-background">
      {/* SUCCESS POPUP */}
      {showPopup && (
        <div className="success-popup">
          <div className="popup-box">
            <div className="popup-check">✔</div>
            <h3>Update Complete</h3>
            <p>Your profile has been successfully updated.</p>
          </div>
        </div>
      )}

      <div className="profile-card">
        <div className="profile-header">
          <h2>User Profile Setup</h2>
          <button className="logout-btn" onClick={logout}>
            Logout
          </button>
        </div>

        {loading && <p>Loading…</p>}

        <div className="profile-form-layout">
          {/* LEFT SIDE */}
          <div>
            <h3 className="section-title">Personal Details</h3>

            <div className="photo-upload-container">
              <img src={profileImg} className="profile-photo" alt="profile" />

              <label className="custom-file-label">
                Choose Photo
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setPhotoFile(e.target.files[0])}
                />
              </label>
            </div>

            <select
              name="role"
              value={user.role}
              onChange={handleChange}
              className="form-input"
            >
              <option value="Farmer">Farmer</option>
              <option value="Buyer">Buyer</option>
            </select>

            <input
              className="form-input"
              name="fullName"
              placeholder="Full Name"
              value={user.fullName}
              onChange={handleChange}
            />

            <input
              className="form-input"
              name="email"
              placeholder="Email"
              value={user.email}
              onChange={handleChange}
            />

            <textarea
              className="form-input textarea"
              name="address"
              placeholder="Address"
              value={user.address}
              onChange={handleChange}
            />

            <div className="input-group-row">
              <input
                className="form-input"
                name="state"
                placeholder="State"
                value={user.state}
                onChange={handleChange}
              />
              <input
                className="form-input"
                name="district"
                placeholder="District"
                value={user.district}
                onChange={handleChange}
              />
            </div>

            <input
              className="form-input"
              name="pincode"
              placeholder="Pincode"
              value={user.pincode}
              onChange={handleChange}
            />

            <div className="aadhar-section">
              <input
                className="form-input"
                name="aadhar"
                placeholder="Aadhar Number"
                value={user.aadhar}
                onChange={handleChange}
              />
              <span className="verify-status">
                {user.verified === 1 ? (
                  <span className="verified">✔ Verified</span>
                ) : (
                  <span className="pending">⏳ Pending</span>
                )}
              </span>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div>
            <h3 className="section-title">Farm & Business</h3>

            <div className="input-group-row">
              <input
                className="form-input"
                name="farmSize"
                placeholder="Farm Size"
                value={user.farmSize}
                onChange={handleChange}
              />
              <input
                className="form-input"
                name="mainCrops"
                placeholder="Main Crops"
                value={user.mainCrops}
                onChange={handleChange}
              />
            </div>

            <div className="input-group-row">
              <input
                className="form-input"
                name="gst"
                placeholder="GST"
                value={user.gst}
                onChange={handleChange}
              />
              <input
                className="form-input"
                name="pan"
                placeholder="PAN"
                value={user.pan}
                onChange={handleChange}
              />
            </div>

            <h3 className="section-title">Bank Information</h3>

            <input
              className="form-input"
              name="bankAccount"
              placeholder="Bank Account Number"
              value={user.bankAccount}
              onChange={handleChange}
            />
            <input
              className="form-input"
              name="ifsc"
              placeholder="IFSC Code"
              value={user.ifsc}
              onChange={handleChange}
            />

            <h3 className="section-title">Upload Documents</h3>

            {/* ---- DOCUMENT 1 ---- */}
            <div className="doc-upload-container">
              <label className="doc-upload-label">Land proof (Doc):</label>

              <label className="circle-upload" title="Upload Land Proof">
                <img
                  src="/Images/cloud-upload.png"
                  alt="upload"
                  className="upload-icon"
                />
                <input
                  name="document1"
                  type="file"
                  className="hidden-file-input"
                  onChange={(e) => setDoc1(e.target.files[0])}
                />
              </label>

              <span className="uploaded-file-name">
                {doc1
                  ? doc1.name
                  : user.document1
                  ? user.document1.split("/").pop()
                  : ""}
              </span>
            </div>

            {/* ---- DOCUMENT 2 ---- */}
            <div className="doc-upload-container">
              <label className="doc-upload-label">Other Document:</label>

              <label className="circle-upload" title="Upload Land Proof">
                <img
                  src="/Images/cloud-upload.png"
                  alt="upload"
                  className="upload-icon"
                />
                <input
                  name="document1"
                  type="file"
                  className="hidden-file-input"
                  onChange={(e) => setDoc1(e.target.files[0])}
                />
              </label>

              <span className="uploaded-file-name">
                {doc1
                  ? doc1.name
                  : user.document1
                  ? user.document1.split("/").pop()
                  : ""}
              </span>
            </div>
          </div>
        </div>

        <button
          className="save-profile-btn"
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Profile"}
        </button>
      </div>
    </div>
  );
}

export default Profile;
