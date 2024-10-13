import React, { useState } from "react";
import "./Navbar.css";
import { User } from "../index";

function Navbar() {
  const [isUserOpen, setUserOpen] = useState(false);

  const toggleUser = () => {
    setUserOpen(!isUserOpen);
  };

  return (
    <nav className="navbar-container">
      <a href="/" className="logo">
        AlgoLingo
      </a>
      <div className="profile-picture" onClick={toggleUser}>
        <img src="path-to-profile-picture.jpg" alt="User Profile" />
      </div>

      <User isVisible={isUserOpen} onClose={toggleUser}>
        <h2>User Profile</h2>
        <p>Profile information goes here.</p>
      </User>
    </nav>
  );
}

export default Navbar;
