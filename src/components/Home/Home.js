import React from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../index";

const topics = [
  { id: 1, name: "Mathematics" },
  { id: 2, name: "Science" },
  { id: 3, name: "History" },
  // Add more topics here
];

function Home() {
  const navigate = useNavigate();

  const handleTopicClick = (topicId) => {
    // Navigate to the Flashcard page with the specific topic ID
    navigate(`/flashcards/${topicId}`);
  };

  return (
    <div>
      <Navbar />
      <h1>Select a topic</h1>
      {topics.map((topic) => (
        <button key={topic.id} onClick={() => handleTopicClick(topic.id)}>
          {topic.name}
        </button>
      ))}
    </div>
  );
}

export default Home;
