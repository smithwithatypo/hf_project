import React, { useState } from "react";
import quizData from "../data/quizData.json";
import Flashcard from "./Flashcard";

const HomeScreen = () => {
  const [selectedFlashcard, setSelectedFlashcard] = useState(null);

  const handleTitleClick = (index) => {
    setSelectedFlashcard(quizData[index]);
  };

  return (
    <div>
      {!selectedFlashcard ? (
        <div style={styles.list}>
          {quizData.map((item, index) => (
            <p
              key={index}
              onClick={() => handleTitleClick(index)}
              style={styles.title}
            >
              {item.title}
            </p>
          ))}
        </div>
      ) : (
        <Flashcard flashcardData={selectedFlashcard} />
      )}
    </div>
  );
};

const styles = {
  list: {
    textAlign: "center",
    padding: "50px",
  },
  title: {
    cursor: "pointer",
    color: "blue",
    textDecoration: "underline",
    margin: "20px 0",
  },
};

export default HomeScreen;
