import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="home-container">
      <h1 className="home-title">Welcome to AlgoLearn</h1>
      <p className="home-subtitle">Master algorithms in bite-sized lessons.</p>
      
      <div className="home-links">
        <Link to="/lessons" className="home-link">
          Start Learning
        </Link>
        <Link to="/quizzes" className="home-link">
          Take a Quiz
        </Link>
        <Link to="/progress" className="home-link">
          View Progress
        </Link>
      </div>
    </div>
  );
}

export default Home;