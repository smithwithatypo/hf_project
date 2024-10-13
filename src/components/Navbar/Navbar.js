import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import { User } from "../index";

function Navbar() {
  return (
    <nav className="navbar-container">
      <Link to="/" className="navbar-logo">
        AlgoLingo
      </Link>
      <User />
    </nav>
  );
}

export default Navbar;
