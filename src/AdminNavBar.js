import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './css/NavBar.css'; // Assuming you have a CSS file for styling

const AdminNavBar = () => {
  const [isOpen, setIsOpen] = useState(false); // State for dropdown

  return (
    <nav className="admin-navbar">
      <button onClick={() => setIsOpen(!isOpen)} className="admin-navbar-toggle">
        {isOpen ? 'Close' : 'Menu'}
      </button>
      {isOpen && (
        <ul className="admin-navbar-list">
          <li><Link to="/admin/dashboard" onClick={() => setIsOpen(false)}>Dashboard</Link></li>
          <li><Link to="/admin/manage-posts" onClick={() => setIsOpen(false)}>Manage Posts</Link></li>
          <li><Link to="/admin/user-management" onClick={() => setIsOpen(false)}>User Management</Link></li>
          <li><Link to="/admin/settings" onClick={() => setIsOpen(false)}>Settings</Link></li>
          <li><Link to="/logout" onClick={() => setIsOpen(false)}>Logout</Link></li>
        </ul>
      )}
    </nav>
  );
};

export default AdminNavBar;
