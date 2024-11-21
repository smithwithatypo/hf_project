import React, { useState, useEffect, useCallback, memo } from "react";
import { useParams } from "react-router-dom";
import { Navbar } from "../index.js";
import problemsData from "../../data/problems.json"; // Adjust the path as necessary
import api from "../../api";
import "./Flashcard.css";


// Child components wrapped with React.memo
const ShortAnswerQuestion = memo(({ question, answers, handleAnswerChange, gradedResponse }) => {
  const [localAnswer, setLocalAnswer] = useState(answers[question._id] || '');

  const handleInputChange = (e) => {
    setLocalAnswer(e.target.value);
  };

  useEffect(() => {
    handleAnswerChange(question._id, localAnswer);
  }, [localAnswer, question._id, handleAnswerChange]);

  const feedback = gradedResponse?.find(f => f.questionId === question._id.toString());

  return (
    <div className={`question-format ${feedback ? (feedback.correct ? 'correct' : 'incorrect') : ''}`}>
      <p>{question.text}</p>
      <input
        type="text"
        placeholder="Type your answer here"
        value={localAnswer}
        onChange={handleInputChange}
        // disabled={!!gradedResponse}
      />
      {feedback && feedback.correct && (
        <p className="correct-message">Correct</p>
      )}
      {feedback && !feedback.correct && (
        <>
          <p className="incorrect-message">Incorrect</p>
          <p className="correct-answer">Correct Answer: {feedback.correctAnswer}</p>
        </>
      )}
    </div>
  );
});

const MultipleChoiceQuestion = memo(({ question, answers, handleAnswerChange, gradedResponse }) => {

  const feedback = gradedResponse?.find(f => f.questionId === question._id.toString());
  console.log('Feedback:', feedback);
  return (
    <div className="question-format">
      <p>{question.text}</p>
      {question.options.map((option, index) => (
        <label key={index} className={`option ${feedback ? (feedback.correctAnswer === index ? 'correct' : (feedback.correctAnswer !== undefined && answers[question._id] === index ? 'incorrect' : '')) : ''}`}>
          <input
            type="radio"
            name={`question-${question._id}`}
            value={index}
            checked={answers[question._id] === index}
            onChange={() => handleAnswerChange(question._id, index)}
          />
          {option}
          </label>
      ))}
      {feedback && feedback.correct && (
        <p className="correct-message">Correct</p>
      )}
      {feedback && !feedback.correct && (
        <p className="incorrect-message">Incorrect</p>
      )}
    </div>
  );
});

const TrueFalseQuestion = React.memo(({ question, answers, handleAnswerChange, gradedResponse }) => {

  const feedback = gradedResponse?.find(f => f.questionId === question._id.toString());

  return (
    <div className="question-format">
      <p>{question.text}</p>
      <div className={`option ${feedback ? (feedback.correctAnswer === 'true' ? 'correct' : (feedback.correctAnswer !== undefined && answers[question._id] === 'true' ? 'incorrect' : '')) : ''}`}>
        <input
          type="radio"
          id={`true-${question._id}`}
          name={`trueFalse-${question._id}`}
          checked={answers[question._id] === 'true'}
          value="true"
          onChange={(e) => handleAnswerChange(question._id, e.target.value)}
        />
        <label htmlFor={`true-${question._id}`}>True</label>
      </div>
      <div className={`option ${feedback ? (feedback.correctAnswer === 'false' ? 'correct' : (feedback.correctAnswer !== undefined && answers[question._id] === 'false' ? 'incorrect' : '')) : ''}`}>
        <input
          type="radio"
          id={`false-${question._id}`}
          name={`trueFalse-${question._id}`}
          checked={answers[question._id] === 'false'}
          value="false"
          onChange={(e) => handleAnswerChange(question._id, e.target.value)}
        />
        <label htmlFor={`false-${question._id}`}>False</label>
      </div>
      {feedback && feedback.correct && (
        <p className="correct-message">Correct</p>
      )}
      {feedback && !feedback.correct && (
        <p className="incorrect-message">Incorrect</p>
      )}
    </div>
  );
});

const MultipleSelectQuestion = memo(({ question, answers, handleAnswerChange, gradedResponse }) =>{
  const handleOptionChange = (index, checked) => {
    const selectedOptions = answers[question._id] || [];
    if (checked) {
      handleAnswerChange(question._id, [...selectedOptions, index]);
    } else {
      handleAnswerChange(question._id, selectedOptions.filter((i) => i !== index));
    }
  };

  const feedback = gradedResponse?.find(f => f.questionId === question._id.toString());
  console.log(`Multiple select feedback:`, feedback);
  return (
    <div className="question-format">
      <p>{question.text}</p>
      {question.options.map((option, index) => (
        <label key={index} className={`option ${feedback && feedback.correctAnswer ? (feedback.correctAnswer.includes(index) ? 'correct' : (answers[question._id]?.includes(index) ? 'incorrect' : '')) : ''}`}>
          <input 
            type="checkbox" 
            id={`option${index}`} 
            name={`question-${question._id}`}
            value={index}
            checked={answers[question._id]?.includes(index) || false} 
            onChange={(e) => {handleOptionChange(index, e.target.checked)}}
          />
          {option}
        </label>
      ))}
      {feedback && feedback.correct && (
        <p className="correct-message">Correct</p>
      )}
      {feedback && !feedback.correct && (
        <p className="incorrect-message">Incorrect</p>
      )}
    </div>
  );
});

function Flashcard() {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [shortAnswers, setShortAnswers] = useState({});
  const [gradedResponse, setGradedResponse] = useState(null);

  const fetchQuestions = useCallback(async () => {
    try {
      const problemRes = await api.get(`/problems/${id}`);
      setProblem(problemRes.data);
      console.log(`Fetched problem title: ${problemRes.data.title}`);
      console.log('Fetching questions for problem:', id);
      const res = await api.get(`/problems/${id}/questions`);
      console.log('Fetched questions:', res.data);
      setQuestions(res.data);
    } catch (err) {
      console.error('Failed to fetch questions:', err);
    }
  }, [id]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const handleAnswerChange = useCallback((questionId, answer) => {
    // setAnswers((prevAnswers) => ({ ...prevAnswers, [questionId]: answer }));
    setAnswers((prevAnswers) => {
      if (answer === '' || Array.isArray(answer) && answer.length === 0) {
        const { [questionId]: _, ...rest } = prevAnswers;
        return rest;
      }
      return { ...prevAnswers, [questionId]: answer };
    });
  }, []);

  const handleSubmit = async () => {
    try {
      const responses = Object.entries(answers).map(([questionId, userResponse]) => ({
        questionId,
        userResponse,
      }));
      const res = await api.post(`/problems/${id}/submit`, { responses });
      setGradedResponse(res.data.feedback);
      console.log('Submission result:', res.data);
    } catch (err) {
      console.error('Failed to submit answers:', err);
    }
  };

  const handleReset = () => {
    setAnswers({});
    setGradedResponse([]);
    setQuestionIndex(0);
    fetchQuestions(); // Trigger fetching questions again
  };

  if (!problem || questions.length === 0) {
    return <div>Loading problem details and questions...</div>;
  }
  const currentQuestion = questions[questionIndex];

  return (
    <>
      <Navbar />
      <div className="flashcard-page">
        <div className="static-section">
         { /* Display the problem description */}
          <div className="problem-description">
            <h2>{problem.title}</h2>
            <p>{problem.description}</p>
            <h3>Examples:</h3>
            {problem.examples && problem.examples.length > 0 ? (
              problem.examples.map((example, index) => (
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

          {/* Display the code template */}
          <div className="code-base">
            <h2>Problem Code Base</h2>
            <pre>{problem.starterCode.python}</pre>
          </div>

        </div>
        <div className='question-section'>
          {/* Render question options based on question type */}
          {currentQuestion.type === 'multiple_choice' && <MultipleChoiceQuestion question={currentQuestion} answers={answers} handleAnswerChange={handleAnswerChange} gradedResponse={gradedResponse}/>}
          {/* {currentQuestion.type === 'short_answer' && <ShortAnswerQuestion question={currentQuestion} />} */}
          {currentQuestion.type === 'short_answer' && <ShortAnswerQuestion question={currentQuestion} answers={answers} handleAnswerChange={handleAnswerChange} gradedResponse={gradedResponse}/>}
          {currentQuestion.type === 'true_false' && <TrueFalseQuestion question={currentQuestion} answers={answers} handleAnswerChange={handleAnswerChange} gradedResponse={gradedResponse}/>}
          {currentQuestion.type === 'multiple_select' && <MultipleSelectQuestion question={currentQuestion} answers={answers} handleAnswerChange={handleAnswerChange} gradedResponse={gradedResponse}/>}
        </div>
        {/* Navigation for questions */}
        <div className="question-navigation">
          <button className="nav-button" onClick={() => setQuestionIndex((prev) => Math.max(prev - 1, 0))} disabled={questionIndex === 0}>Previous</button>
          <button className="nav-button" onClick={() => setQuestionIndex((prev) => Math.min(prev + 1, questions.length - 1))} disabled={questionIndex === questions.length - 1}>Next</button>
        </div>

        <div className="submit-section">
          <button className="submit-button" onClick={handleSubmit}>Submit</button>
          <button className="startover-button" onClick={handleReset}>Start Over</button>
        </div>

       {/* Debugging info remove before deployment */}
        <div className='user-responses'>
          <h3>User Responses (Debug)</h3>
          <pre>{JSON.stringify(answers, null, 2)}</pre>
        </div>

        {gradedResponse && (
          <div className="graded-response">
            <h3>Graded Results</h3>
            {gradedResponse.map((feedback, index) => (
              <div key={index} className={`feedback ${feedback.correct ? 'correct' : 'incorrect'}`}>
                <p>Question: {feedback.questionId}</p>
                <p>Correct: {feedback.correct ? 'Yes' : 'No'}</p>
                {!feedback.correct && <p>Correct Answer: {feedback.correctAnswer}</p>}
              </div>
            ))}
          </div>
        )}

      </div>
    </>
  );
  
  function MatchingQuestion({ question }) {
    return (
      <div className="question-format">
        <p>{question.text}</p>
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
}

export default Flashcard;

