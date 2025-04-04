import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './css/NavBar.css';

function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  
  // Scroll to top when route changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-brand">
          <Link to="/">
            <span className="brand-icon">🌱</span>
            <span className="brand-name">Plantly</span>
          </Link>
        </div>
        
        <div className="nav-toggle" onClick={toggleMenu}>
          <span className={`toggle-icon ${isOpen ? 'open' : ''}`}></span>
        </div>
        
        <div className={`nav-links ${isOpen ? 'active' : ''}`}>
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/blog" className="nav-link">Blog</Link>
          <Link to="/disease-identification" className="nav-link">Disease ID</Link>
          <Link to="/disease-prediction" className="nav-link">Disease Prediction</Link>
          <Link to="/admin/blog" className="nav-link admin-link">Admin</Link>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;