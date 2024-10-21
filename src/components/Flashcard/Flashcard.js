import React from "react";
import { useParams } from "react-router-dom";
import { Navbar } from "../index.js";

function Flashcard() {
  const { id } = useParams();

  return (
    <>
      <Navbar />
      <div>
        <h1>Flashcard Topic ID: {id}</h1>
        {/* Render flashcards based on the topic ID */}
      </div>
    </>
  );
}

export default Flashcard;
