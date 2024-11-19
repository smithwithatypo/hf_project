import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Navbar } from "../index.js";
import problemsData from "../../data/problems.json"; // Adjust the path as necessary
import "./Flashcard.css";




function Flashcard() {
  const { id } = useParams();
  const [questionIndex, setQuestionIndex] = useState(0);

  // Find the specific problem data based on the id parameter
  const topicData = problemsData.topics.arrays_and_hashing.problems[id];

  if (!topicData) {
    return <div>No flashcards found for this topic.</div>;
  }

  // Get the problem description, code template, and questions
  const { title, description, code_template, questions, examples } = topicData;
  const currentQuestion = questions[questionIndex];

  return (
    <>
      <Navbar />
      <div className="flashcard-page">
        <div className="static-section">
          <div className="problem-description">
            <h2>{title}</h2>
            <p>{description}</p>
            <h3>Examples:</h3>
            {examples && examples.length > 0 ? (
              examples.map((example, index) => (
                <div key={index} className="example">
                  <p><strong>Input:</strong> {example.input}</p>
                  <p><strong>Output:</strong> {example.output}</p>
                  {example.explanation && <p><strong>Explanation:</strong> {example.explanation}</p>}
                </div>
              ))
            ) : (
              <p>No examples available.</p>
            )}

          </div>
          <div className="code-base">
            <h2>Problem Code Base</h2>
            <pre>{code_template.python}</pre>
          </div>
        </div>
        
        <div className="question-section">
          <h2>Question</h2>
          {currentQuestion.type === "multiple_choice" && <MultipleChoiceQuestion question={currentQuestion} />}
          {currentQuestion.type === "matching" && <MatchingQuestion question={currentQuestion} />}
          {currentQuestion.type === "fill_in_the_blank" && <FillInTheBlankQuestion question={currentQuestion} />}
          {currentQuestion.type === "true_false" && <TrueFalseQuestion question={currentQuestion} />}
          
          {/* Navigation for questions */}
          <div className="question-navigation">
            <button onClick={() => setQuestionIndex((prev) => Math.max(prev - 1, 0))} disabled={questionIndex === 0}>Previous</button>
            <button onClick={() => setQuestionIndex((prev) => Math.min(prev + 1, questions.length - 1))} disabled={questionIndex === questions.length - 1}>Next</button>
          </div>
        </div>
      </div>
    </>
  );
}



function MultipleChoiceQuestion({ question }) {
  return (
    <div className="question-format">
      <p>{question.question}</p>
      {question.options.map((option, index) => (
        <div key={index} className="option">
          <input type="radio" id={`option${index}`} name="multipleChoice" />
          <label htmlFor={`option${index}`}>{option}</label>
        </div>
      ))}
    </div>
  );
}

function MatchingQuestion({ question }) {
  return (
    <div className="question-format">
      <p>{question.question}</p>
      <div className="matching">
        {question.pairs.map((pair, index) => (
          <div key={index} className="term">
            <span>{pair.left}</span>
            <select>
              <option value="">Select match</option>
              {pair.options.map((option, i) => (
                <option key={i} value={option}>{option}</option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}

function FillInTheBlankQuestion({ question }) {
  return (
    <div className="question-format">
      <p>{question.question}</p>
      <input type="text" placeholder="type answer here" />
    </div>
  );
}

function TrueFalseQuestion({ question }) {
  return (
    <div className="question-format">
      <p>{question.question}</p>
      <div className="option">
        <input type="radio" id="true" name="trueFalse" value="true" />
        <label htmlFor="true">True</label>
      </div>
      <div className="option">
        <input type="radio" id="false" name="trueFalse" value="false" />
        <label htmlFor="false">False</label>
      </div>
    </div>
  );
}

export default Flashcard;

