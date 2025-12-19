import React, { useEffect, useState } from "react";
import "../Css/Profile.css";
import Navbar from "../components/Navbar";

function Profile() {
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
    role: "Farmer", // ✅ DEFAULT ROLE
    farmerId: "",
    mobile: "",
  });

  const [photoFile, setPhotoFile] = useState(null);
  const [doc1, setDoc1] = useState(null);
  const [doc2, setDoc2] = useState(null);

  /* =========================
     LOAD PROFILE
  ========================= */
  const loadProfile = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/user/get-profile", {
        credentials: "include",
      });

      const data = await res.json();

      if (data.status === "error") {
        window.location.href = "/login";
        return;
      }

      // ✅ FORCE ROLE SAFETY
      setUser({
        ...data,
        role: data.role && data.role.trim() ? data.role : "Farmer",
      });
    } catch (err) {
      console.error("Profile fetch error:", err);
      window.location.href = "/login";
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  /* =========================
     FORM HANDLERS
  ========================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  /* =========================
     SAVE PROFILE
  ========================= */
  const handleSave = async () => {
    const fd = new FormData();

    // ❌ Do NOT blindly append role
    Object.keys(user).forEach((key) => {
      if (["profilePhoto", "document1", "document2", "role"].includes(key)) return;
      fd.append(key, user[key] ?? "");
    });

    // ✅ ALWAYS SEND ROLE EXPLICITLY
    fd.append("role", user.role || "Farmer");

    if (photoFile) fd.append("profilePhoto", photoFile);
    if (doc1) fd.append("document1", doc1);
    if (doc2) fd.append("document2", doc2);

    try {
      setLoading(true);
      const res = await fetch("/api/user/update-profile", {
        method: "POST",
        body: fd,
        credentials: "include",
      });

      const data = await res.json();

      if (data.status === "success") {
        setShowPopup(true);
        await loadProfile();
        setTimeout(() => setShowPopup(false), 2000);
      } else {
        alert(data.message || "Update failed");
      }
    } catch (err) {
      alert("Update failed");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     PHOTO HANDLERS
  ========================= */
  const onPhotoChange = (file) => {
    if (file) setPhotoFile(file);
  };

  const removePhoto = () => {
    setPhotoFile(null);
  };

  /* =========================
     LOGOUT
  ========================= */
  const logout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch {}
    window.location.href = "/login";
  };

  const profileImg = photoFile
    ? URL.createObjectURL(photoFile)
    : user.profilePhoto
    ? `/${user.profilePhoto}?t=${Date.now()}`
    : "";

  return (
    <>
      {/* NAVBAR */}
      <Navbar />

      <div className="profile-page-background">

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
            <button className="logout-btn" onClick={logout}>Logout</button>
          </div>

          {loading && <p>Loading…</p>}

          <div className="profile-form-layout">

            {/* LEFT SIDE */}
            <div>
              <h3 className="section-title">Personal Details</h3>

              {/* PHOTO SECTION */}
              <div className="photo-upload-container">
                
                <div className="photo-left">
                  {profileImg ? (
                    <img src={profileImg} className="profile-photo" alt="profile" />
                  ) : (
                    <div className="profile-photo empty">Profile</div>
                  )}

                  {user.farmerId && (
                    <div className="farmer-id-display">
                      <label>Farmer ID:</label>
                      <span>{user.farmerId}</span>
                    </div>
                  )}
                </div>

                <div className="photo-right">
                  <label className="custom-file-label enhanced">
                    <i className="fa fa-camera"></i> Choose Photo
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        onPhotoChange(e.target.files && e.target.files[0])
                      }
                    />
                  </label>

                  <div className="photo-info">
                    {photoFile ? (
                      <>
                        <div className="photo-filename">{photoFile.name}</div>
                        <button className="photo-remove" onClick={removePhoto}>
                          ✖
                        </button>
                      </>
                    ) : user.profilePhoto ? (
                      <div className="photo-filename">
                        {user.profilePhoto.split("/").pop()}
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>

              {/* ROLE */}
			  <div className="role-select-container">
			     <label className="field-label">
			         <i className="fa fa-user-tag"></i> User Role
			     </label>
			        <select
			         name="role"
			         value={user.role}
			         onChange={handleChange}
			         className="role-select"
			         >
			   <option value="Farmer">Farmer</option>
			   <option value="Buyer">Buyer</option>
			     </select>
			  </div>
              {/* FULL NAME */}
              <label className="field-label">
                <i className="fa fa-user"></i> Full Name
              </label>
              <input
                className="form-input"
                name="fullName"
                value={user.fullName}
                onChange={handleChange}
              />

              {/* EMAIL */}
              <label className="field-label">
                <i className="fa fa-envelope"></i> Email
              </label>
              <input
                className="form-input"
                name="email"
                value={user.email}
                onChange={handleChange}
              />

              {/* ADDRESS */}
              <label className="field-label">
                <i className="fa fa-map-marker"></i> Address
              </label>
              <textarea
                className="form-input textarea"
                name="address"
                value={user.address}
                onChange={handleChange}
              />

              {/* STATE + DISTRICT */}
              <div className="input-group-row two-col">
                <div className="col-50">
                  <label className="field-label">
                    <i className="fa fa-flag"></i> State
                  </label>
                  <input
                    className="form-input"
                    name="state"
                    value={user.state}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-50">
                  <label className="field-label">
                    <i className="fa fa-building"></i> District
                  </label>
                  <input
                    className="form-input"
                    name="district"
                    value={user.district}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <label className="field-label">
                <i className="fa fa-location-arrow"></i> Pincode
              </label>
              <input
                className="form-input"
                name="pincode"
                value={user.pincode}
                onChange={handleChange}
              />

              {/* AADHAR */}
              <div className="aadhar-section">
                <div className="col-50">
                  <label className="field-label">
                    <i className="fa fa-id-card"></i> Aadhar Number
                  </label>
                  <input
                    className="form-input"
                    name="aadhar"
                    value={user.aadhar}
                    onChange={handleChange}
                  />
                </div>

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

              <div className="input-group-row two-col">
                <div className="col-50">
                  <label className="field-label">
                    <i className="fa fa-seedling"></i> Farm Size
                  </label>
                  <input
                    className="form-input"
                    name="farmSize"
                    value={user.farmSize}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-50">
                  <label className="field-label">
                    <i className="fa fa-leaf"></i> Main Crops
                  </label>
                  <input
                    className="form-input"
                    name="mainCrops"
                    value={user.mainCrops}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="input-group-row two-col">
                <div className="col-50">
                  <label className="field-label">
                    <i className="fa fa-file-invoice"></i> GST
                  </label>
                  <input
                    className="form-input"
                    name="gst"
                    value={user.gst}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-50">
                  <label className="field-label">
                    <i className="fa fa-id-badge"></i> PAN
                  </label>
                  <input
                    className="form-input"
                    name="pan"
                    value={user.pan}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <h3 className="section-title">Bank Information</h3>

              <label className="field-label">
                <i className="fa fa-university"></i> Bank Account Number
              </label>
              <input
                className="form-input"
                name="bankAccount"
                value={user.bankAccount}
                onChange={handleChange}
              />

              <label className="field-label">
                <i className="fa fa-code"></i> IFSC Code
              </label>
              <input
                className="form-input"
                name="ifsc"
                value={user.ifsc}
                onChange={handleChange}
              />

              <h3 className="section-title">Upload Documents</h3>

              {/* DOC 1 */}
              <div className="doc-upload-container">
                <label className="doc-upload-label">
                  <i className="fa fa-file-alt"></i> Land Proof (Doc)
                </label>

                <label className="circle-upload">
                  <img
                    src="/Images/cloud-upload.png"
                    className="upload-icon"
                    alt="upload"
                  />
                  <input
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

              {/* DOC 2 */}
              <div className="doc-upload-container">
                <label className="doc-upload-label">
                  <i className="fa fa-paperclip"></i> Other Document
                </label>

                <label className="circle-upload">
                  <img
                    src="/Images/cloud-upload.png"
                    className="upload-icon"
                    alt="upload"
                  />
                  <input
                    type="file"
                    className="hidden-file-input"
                    onChange={(e) => setDoc2(e.target.files[0])}
                  />
                </label>

                <span className="uploaded-file-name">
                  {doc2
                    ? doc2.name
                    : user.document2
                    ? user.document2.split("/").pop()
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
    </>
  );
}

export default Profile;
