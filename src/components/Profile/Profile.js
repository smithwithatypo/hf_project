import React from "react";
import "./Profile.css";

function Profile() {
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
    <div className="profile-container">
      <h1>Profile</h1>
      <div className="user-info">
        <p>
          <strong>Name:</strong> {userInfo.name}
        </p>
        <p>
          <strong>Email:</strong> {userInfo.email}
        </p>
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
  );
}

export default Profile;
