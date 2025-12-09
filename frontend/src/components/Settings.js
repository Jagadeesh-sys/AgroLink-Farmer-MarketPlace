import React, { useState } from "react";
import "../Css/Settings.css";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

function Settings() {
  const storedUser = JSON.parse(localStorage.getItem("userData")) || {};

  const [form, setForm] = useState({
    fullName: storedUser.fullName || "",
    phone: storedUser.phone || "",
    email: storedUser.email || "",
  });

  const [passwords, setPasswords] = useState({
    oldPass: "",
    newPass: "",
    confirmPass: "",
  });

  const saveProfile = () => {
    localStorage.setItem("userData", JSON.stringify({ ...storedUser, ...form }));
    alert("Profile updated successfully!");
  };

  const updatePassword = () => {
    if (!passwords.oldPass || !passwords.newPass || !passwords.confirmPass) {
      alert("All password fields are required.");
      return;
    }

    if (passwords.newPass !== passwords.confirmPass) {
      alert("New passwords do not match!");
      return;
    }

    alert("Password updated (UI Only Demo)");
    setPasswords({ oldPass: "", newPass: "", confirmPass: "" });
  };

  return (
    <>
      <Navbar />

      <div className="layout">
        <Sidebar cartCount={0} />

        <div className="content-area">
          <main className="settings-page">

            <h2>⚙️ Account Settings</h2>
            <p className="subtitle">Manage profile and security settings</p>

            {/* PROFILE SECTION */}
            <section className="settings-box">
              <h3>Profile Information</h3>

              <div className="profile-row">
                <div className="profile-photo">
                  <i className="fa-solid fa-user"></i>
                </div>

                <div className="profile-fields">

                  <label>Full Name</label>
                  <input
                    type="text"
                    value={form.fullName}
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  />

                  <label>Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />

                  <label>Phone</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />

                  <button className="save-btn" onClick={saveProfile}>
                    <i className="fa-solid fa-check"></i> Save Changes
                  </button>
                </div>
              </div>
            </section>

            {/* PASSWORD SECTION */}
            <section className="settings-box">
              <h3>Change Password</h3>

              <label>Old Password</label>
              <input
                type="password"
                value={passwords.oldPass}
                onChange={(e) => setPasswords({ ...passwords, oldPass: e.target.value })}
              />

              <label>New Password</label>
              <input
                type="password"
                value={passwords.newPass}
                onChange={(e) => setPasswords({ ...passwords, newPass: e.target.value })}
              />

              <label>Confirm New Password</label>
              <input
                type="password"
                value={passwords.confirmPass}
                onChange={(e) => setPasswords({ ...passwords, confirmPass: e.target.value })}
              />

              <button className="save-btn" onClick={updatePassword}>
                <i className="fa-solid fa-lock"></i> Update Password
              </button>
            </section>

          </main>

          <Footer />
        </div>
      </div>
    </>
  );
}

export default Settings;
