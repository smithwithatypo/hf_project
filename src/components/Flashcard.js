import React, { useState } from "react";

const Flashcard = ({ flashcardData }) => {
  const [showAnswer, setShowAnswer] = useState(false);

  const handleClick = () => {
    setShowAnswer(!showAnswer);
  };

  return (
    <div onClick={handleClick} style={styles.card}>
      <h2>{flashcardData.title}</h2>
      <p>{flashcardData.question}</p>
      {!showAnswer ? (
        <ul>
          {flashcardData.choices.map((choice, index) => (
            <li key={index}>{choice}</li>
          ))}
        </ul>
      ) : (
        <p>
          <strong>Answer:</strong> {flashcardData.answer}
        </p>
      )}
    </div>
  );
};

const styles = {
  card: {
    border: "1px solid #ccc",
    borderRadius: "8px",
    padding: "16px",
    margin: "16px",
    cursor: "pointer",
    transition: "transform 0.2s",
    maxWidth: "400px",
  },
};

export default Flashcard;
