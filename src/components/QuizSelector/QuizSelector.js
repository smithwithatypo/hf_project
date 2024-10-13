import Quiz from "../Quiz/Quiz";
import React from "react";
import "./QuizSelector.css";
// import data here and pass it to each quiz component

function QuizSelector() {
  return (
    <>
      <h1 className="quiz-selector-title">Quiz Selector</h1>
      <Quiz />
    </>
  );
}

export default QuizSelector;
