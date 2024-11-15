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

// const flashcardsData = {
//   "1": {
//     problemDescription: "Describe the algorithm to solve problem X.",
//     codeBase: `function solveProblem(input) {\n  // Write your code here\n}`,
//     questions: [
//       {
//         type: "multipleChoice",
//         question: "What is the time complexity of a binary search?",
//         options: ["O(n)", "O(log n)", "O(n^2)", "O(n log n)"],
//         answer: "O(log n)"
//       },
//       {
//         type: "matching",
//         question: "Match each term with its definition.",
//         pairs: [
//           { term: "Stack", definition: "LIFO data structure" },
//           { term: "Queue", definition: "FIFO data structure" },
//           { term: "Array", definition: "Contiguous memory structure" }
//         ]
//       },
//       {
//         type: "fillInTheBlank",
//         question: "A binary tree is a data structure where each node has at most ____ children.",
//         answer: "two"
//       }
//     ]
//   }
//   // Add more topics as needed
// };

// function Flashcard() {
//   const { id } = useParams();
//   const [questionIndex, setQuestionIndex] = useState(0);

//   // Retrieve data for the specific topic ID
//   const topicData = flashcardsData[id];
//   if (!topicData) {
//     return <div>No flashcards found for this topic.</div>;
//   }

//   // Get the current question
//   const currentQuestion = topicData.questions[questionIndex];

//   return (
//     <>
//       <Navbar />
//       <div className="flashcard-page">
//         <div className="static-section">
//           <div className="problem-description">
//             <h2>LeetCode Problem</h2>
//             <p>{topicData.problemDescription}</p>
//           </div>
//           <div className="code-base">
//             <h2>Problem Code Base</h2>
//             <pre>{topicData.codeBase}</pre>
//           </div>
//         </div>
        
//         <div className="question-section">
//           <h2>Question</h2>
//           {currentQuestion.type === "multipleChoice" && <MultipleChoiceQuestion question={currentQuestion} />}
//           {currentQuestion.type === "matching" && <MatchingQuestion question={currentQuestion} />}
//           {currentQuestion.type === "fillInTheBlank" && <FillInTheBlankQuestion question={currentQuestion} />}
          
//           {/* Navigation for questions */}
//           <div className="question-navigation">
//             <button onClick={() => setQuestionIndex((prev) => Math.max(prev - 1, 0))} disabled={questionIndex === 0}>Previous</button>
//             <button onClick={() => setQuestionIndex((prev) => Math.min(prev + 1, topicData.questions.length - 1))} disabled={questionIndex === topicData.questions.length - 1}>Next</button>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// function MultipleChoiceQuestion({ question }) {
//   return (
//     <div className="question-format">
//       <p>{question.question}</p>
//       {question.options.map((option, index) => (
//         <div key={index} className="option">
//           <input type="radio" id={`option${index}`} name="multipleChoice" />
//           <label htmlFor={`option${index}`}>{option}</label>
//         </div>
//       ))}
//     </div>
//   );
// }

// function MatchingQuestion({ question }) {
//   return (
//     <div className="question-format">
//       <p>{question.question}</p>
//       <div className="matching">
//         {question.pairs.map((pair, index) => (
//           <div key={index} className="term">
//             <span>{pair.term}</span>
//             <select>
//               <option value="">Select match</option>
//               {question.pairs.map((p, i) => (
//                 <option key={i} value={p.definition}>{p.definition}</option>
//               ))}
//             </select>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// function FillInTheBlankQuestion({ question }) {
//   return (
//     <div className="question-format">
//       <p>{question.question}</p>
//       <input type="text" placeholder="type answer here" />
//     </div>
//   );
// }

// export default Flashcard;