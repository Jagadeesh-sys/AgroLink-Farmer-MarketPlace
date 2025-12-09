import React, { useState } from "react";
import "../Css/Contact.css";

import Navbar from "../components/Navbar";   // ⭐ ADD THIS
import Footer from "../components/Footer";   // ⭐ ADD THIS

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Message Sent Successfully!");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <>
      {/* ⭐ NAVBAR ON TOP */}
      <Navbar />

      <div className="contact-page">

        {/* PAGE HEADER */}
        <div className="contact-header">
          <h1>Contact Us</h1>
          <p>We’re here to help! Reach out for support, queries, or feedback.</p>
        </div>

        <div className="contact-container">

          {/* LEFT SIDE - CONTACT INFO */}
          <div className="contact-info">
            <h2>Get in Touch</h2>

            <p><i className="fa-solid fa-phone"></i> +91 9347720473</p>
            <p><i className="fa-solid fa-envelope"></i> support@agrolink.com</p>
            <p><i className="fa-solid fa-location-dot"></i> Hyderabad, India</p>

            <h3>Follow Us</h3>
            <div className="contact-social">
              <a href="#"><i className="fab fa-facebook"></i></a>
              <a href="#"><i className="fab fa-instagram"></i></a>
              <a href="#"><i className="fab fa-x-twitter"></i></a>
              <a href="#"><i className="fab fa-youtube"></i></a>
            </div>
          </div>

          {/* RIGHT SIDE - CONTACT FORM */}
          <form className="contact-form" onSubmit={handleSubmit}>
            <h2>Send a Message</h2>

            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={form.name}
              onChange={handleChange}
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={form.email}
              onChange={handleChange}
              required
            />

            <textarea
              name="message"
              placeholder="Your Message"
              rows="5"
              value={form.message}
              onChange={handleChange}
              required
            ></textarea>

            <button type="submit" className="contact-btn">Send Message</button>
          </form>
        </div>

        {/* GOOGLE MAP */}
        <div className="contact-map">
          <iframe
            title="office location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.318574898984!2d78.38924!3d17.440081!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb91f5d8b51dfd%3A0x59b6f584108a52d4!2sHyderabad%2C%20India!5e0!3m2!1sen!2sin!4v1700000000000"
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>

      </div>

      {/* ⭐ FOOTER AT BOTTOM */}
      <Footer />
    </>
  );
}

export default Contact;
