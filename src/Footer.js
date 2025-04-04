import React from 'react';
import './css/Footer.css';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-logo">
          <span className="logo-icon">🌿</span>
          <span className="logo-text">PlantHealth</span>
        </div>
        
        <div className="footer-content">
          <div className="footer-section map-section">
            <h4>Our Location</h4>
            <div className="map-container">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3889.5877919503305!2d80.21585467483959!3d12.869879387436185!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a525bbb618d3ea9%3A0x90b3767be093efaa!2sSt.Joseph&#39;s%20Institute%20of%20Technology!5e0!3m2!1sen!2sin!4v1742122684482!5m2!1sen!2sin" 
                width="100%" 
                height="250" 
                style={{border: 0}} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="St. Joseph's Institute of Technology Map"
              />
            </div>
          </div>
          
          <div className="footer-section">
            <h4>Connect With Us</h4>
            <div className="social-links">
              <a href="#" className="social-icon">
                <span>📱</span>
              </a>
              <a href="#" className="social-icon">
                <span>📘</span>
              </a>
              <a href="#" className="social-icon">
                <span>📸</span>
              </a>
              <a href="#" className="social-icon">
                <span>🐦</span>
              </a>
            </div>
            <div className="contact-info">
              <p><strong>Address:</strong> St. Joseph's Institute of Technology</p>
              <p><strong>Email:</strong> info@planthealth.com</p>
              <p><strong>Phone:</strong> +91 1234567890</p>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {currentYear} PlantHealth Disease Prediction App. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;