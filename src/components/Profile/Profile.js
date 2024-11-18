import React from "react";
import "./Profile.css";
import { Navbar } from "../index";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../UserContext";

function Profile() {
  const navigate = useNavigate();
  const { setUser } = React.useContext(UserContext);

  const handleLogout = () => {
    localStorage.removeItem('token');
    // Clear user data
    setUser(null);
    // Add logout logic here if needed
    navigate("/");
  };

  // Hardcoded user information
  const userInfo = {
    name: "John Doe",
    email: "john.doe@example.com",
  };

  // Hardcoded list of badges
  const badges = [
    "Beginner Badge",
    "Intermediate Badge",
    "Expert Badge",
    "Challenge Master",
    "Quiz Whiz",
    "Flashcard Pro",
    "Memory Master",
  ];

  return (
    <>
      <Navbar />
      <div className="profile-container">
        <h1>Profile</h1>
        <div className="user-info">
          <p>
            <strong>Name:</strong> {userInfo.name}
          </p>
          <p>
            <strong>Email:</strong> {userInfo.email}
          </p>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
        <h2>Your Badges</h2>
        <div className="badges-grid">
          {badges.map((badge, index) => (
            <div key={index} className="badge">
              {/* Replace with badge images if available */}
              <p>{badge}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Profile;
