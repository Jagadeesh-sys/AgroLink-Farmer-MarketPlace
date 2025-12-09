import React, { useState } from "react";
import "../Css/Support.css";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import ChatWidget from "../components/ChatWidget";   // ⭐ ADD CHAT WIDGET

function Support() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const submitSupport = () => {
    if (!form.name || !form.email || !form.message) {
      alert("Please fill out all fields");
      return;
    }

    alert("Your message has been sent! Our team will contact you shortly.");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <>
      <Navbar />

      <div className="layout">
        <Sidebar cartCount={0} />

        <div className="content-area">
          <main className="support-page">

            <h2>🆘 Support Center</h2>
            <p className="subtitle">We're here to help you with anything</p>

            <div className="support-grid">

              {/* CONTACT CARD */}
              <div className="support-card">
                <h3>Contact Details</h3>

                <p><i className="fa-solid fa-envelope"></i> support@agrolink.com</p>
                <p><i className="fa-solid fa-phone"></i> +91 98765 43210</p>
                <p><i className="fa-solid fa-location-dot"></i> Hyderabad, India</p>

                <div className="social-icons">
                  <i className="fa-brands fa-facebook"></i>
                  <i className="fa-brands fa-twitter"></i>
                  <i className="fa-brands fa-instagram"></i>
                </div>
              </div>

              {/* FAQ CARD */}
              <div className="support-card">
                <h3>FAQ</h3>

                <ul className="faq-list">
                  <li>How do I upload a crop listing?</li>
                  <li>How can I track my order?</li>
                  <li>What payment methods are available?</li>
                  <li>How do I contact customer support?</li>
                </ul>
              </div>

              {/* FORM CARD */}
              <div className="support-card">
                <h3>Send Us a Message</h3>

                <label>Your Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />

                <label>Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />

                <label>Your Message</label>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                ></textarea>

                <button className="send-btn" onClick={submitSupport}>
                  <i className="fa-solid fa-paper-plane"></i> Send Message
                </button>
              </div>

            </div>
          </main>

          {/* Floating Chat Widget */}
          <ChatWidget />

          <Footer />
        </div>
      </div>
    </>
  );
}

export default Support;
