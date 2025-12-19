import React from "react";
import "../Css/Footer.css";

function Footer() {
  return (
    <footer className="footer">

      {/* Top Section */}
      <div className="footer-container">
        
        {/* ABOUT */}
        <div className="footer-section">
          <h3><i className="fa fa-leaf"></i> AgroLink</h3>
          <p>
            Bridging farmers and buyers through technology. 
            Buy crops, seeds, fertilizers, pesticides — everything in one place.
          </p>
        </div>

        {/* QUICK LINKS */}
        <div className="footer-section">
          <h3><i className="fa fa-link"></i> Quick Links</h3>
          <ul>
            <li><a href="/marketplace"><i className="fa fa-store"></i> Marketplace</a></li>
            <li><a href="/seeds"><i className="fa fa-seedling"></i> Seeds Store</a></li>
            <li><a href="/fertilizers"><i className="fa fa-flask"></i> Fertilizers</a></li>
            <li><a href="/pesticides"><i className="fa fa-bug"></i> Pesticides</a></li>
            <li><a href="/sell"><i className="fa fa-tractor"></i> Sell Your Crop</a></li>
          </ul>
        </div>

        {/* CONTACT */}
        <div className="footer-section">
          <h3><i className="fa fa-phone"></i> Contact Us</h3>
          <ul>
            <li><i className="fa fa-phone-alt"></i> +91 9347720473</li>
            <li><i className="fa fa-envelope"></i> support@agrolink.com</li>
            <li><i className="fa fa-map-marker-alt"></i> Hyderabad, India</li>
          </ul>
        </div>

        {/* SOCIAL MEDIA */}
        <div className="footer-section">
          <h3><i className="fa fa-share-alt"></i> Follow Us</h3>

          <div className="social-icons">
            <a href="#" onClick={(e) => e.preventDefault()}><i className="fab fa-facebook-f"></i></a>
            <a href="#" onClick={(e) => e.preventDefault()}><i className="fab fa-instagram"></i></a>
            <a href="#" onClick={(e) => e.preventDefault()}><i className="fab fa-x-twitter"></i></a>
            <a href="#" onClick={(e) => e.preventDefault()}><i className="fab fa-youtube"></i></a>
            <a href="#" onClick={(e) => e.preventDefault()}><i className="fab fa-whatsapp"></i></a>
          </div>
        </div>

      </div>

      {/* Bottom Section */}
      <div className="footer-bottom">
        <p>
          <i className="fa fa-copyright"></i> 
          &nbsp;2025 AgroLink. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
