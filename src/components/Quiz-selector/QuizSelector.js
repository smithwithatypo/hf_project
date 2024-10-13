// import Quiz from '../Quiz/Quiz';
import React from "react";
import { Link } from "react-router-dom";
import "./QuizSelector.css";

function QuizSelector() {
  return (
    <div className="quiz-selector-container">
      <h1 className="quiz-selector-title">Quiz Selector</h1>
      <div className="quiz-selector-options">
        <Link to="/quizzes/1" className="quiz-selector-option">
          Quiz 1
        </Link>
        <Link to="/quizzes/2" className="quiz-selector-option">
          Quiz 2
        </Link>
        <Link to="/quizzes/3" className="quiz-selector-option">
          Quiz 3
        </Link>
      </div>
    </div>
  );
}

export default QuizSelector;
