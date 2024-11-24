import React from "react";
import "./Profile.css";
import { Navbar } from "../index";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../UserContext";

// Import badge images
import firstLoginBadge from '../../assets/badges/first_login.svg';
import sevenDayStreakBadge from '../../assets/badges/7_day_streak.svg';
import tenDayStreakBadge from '../../assets/badges/10_day_streak.svg';
import quizChampionBadge from '../../assets/badges/quiz_champion.svg';
import problemMasteryBadge from '../../assets/badges/problem_mastery.svg';

// Map badgeIds to images
const badgeImages = {
  'first_login': firstLoginBadge,
  '7_day_streak': sevenDayStreakBadge,
  '10_day_streak': tenDayStreakBadge,
  'quiz_champion': quizChampionBadge,
  'problem_mastery': problemMasteryBadge,
};

function Profile() {
  const navigate = useNavigate();
  const { user, setUser, handleLogout } = React.useContext(UserContext);

  if (!user) return <div>Loading...</div>;

  const logout = () => {
    handleLogout();
    setUser(null);  // Clear user data
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
            <strong>Name:</strong> {user.name}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Points:</strong> {user.points}
          </p>
          <p>
            <strong>Level:</strong> {user.level}
          </p>
          <p>
            <strong>Next Level Points:</strong> {user.next_level_points}
          </p>
          <p>
            <strong>Login Streak:</strong> {user.login_streak} day{user.login_streak > 1 ? `s` : ``}
          </p>
          <button className="logout-button" onClick={logout}>
            Logout
          </button>
        </div>
        <h2>Your Badges</h2>
        <div className="badges-grid">
          {user.badges.map((badge, index) => (
            <div key={index} className="badge">
              {badgeImages[badge.badgeId] ? (
                <img src={badgeImages[badge.badgeId]} alt={badge.name} className='badge-image' />
              ) : (
                <div className="badge-placeholder">No Image</div>
              )}
              <p>{badge.name}</p>
            </div>
          ))}
        </div>

        {/* Debugging info remove before deployment */}
        <div className="user-debug">
          <h3>User Context (Debug)</h3>
          <pre>{JSON.stringify(user, null, 2)}</pre>
        </div>
      </div>
    </>
  );
}

export default Profile;
