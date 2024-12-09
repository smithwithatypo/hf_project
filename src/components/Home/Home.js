import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../index";
import problemsData from "../../data/problems.json";
import "./Home.css";
import quotes from "../../data/quotes.json"; // Import motivational quotes
import api from "../../api"; // Import the API module
import log from "../Logger/logger";

function Home() {
  const navigate = useNavigate();
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [showModal, setShowModal] = useState(false); // Track modal visibility
  const [currentProblemId, setCurrentProblemId] = useState(null); // Store the selected problem ID
  const [quote, setQuote] = useState(""); // Store the random motivational quote

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const res = await api.get('/topics');
        setTopics(res.data);
// log.debug('Topics:', res.data);
      } catch (error) {
        console.error('Error fetching topics:', error);
      }
    };

    fetchTopics();
  }, []);

  // Handle topic selection
  const handleTopicClick = async (topicId) => {
    setSelectedTopic(topicId);
    try {
      const res = await api.get(`/topics/${topicId}/problems`);
      const updatedTopics = topics.map((topic) => 
        topic.topicId === topicId ? { ...topic, problems: res.data } : topic
      );
      setTopics(updatedTopics);
// log.debug('updatedTopics:', updatedTopics);
    } catch (error) {
      console.error('Error fetching problems:', error);
    }
  };

  // Handle problem click to show the motivational quote and then navigate
  const handleProblemClick = (problemId) => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setQuote(quotes[randomIndex]); // Pick a random motivational quote
    setCurrentProblemId(problemId); // Store the clicked problem ID
    setShowModal(true); // Show the modal
  };

  // Function to close the modal and navigate to the selected problem
  const handleCloseModal = () => {
    setShowModal(false);
    navigate(`/flashcards/${currentProblemId}`); // Navigate to the flashcard page
  };

  return (
    <div className="home-page">
      <Navbar />
      <div className="topic-selection">
        <h1>Select a Topic</h1>
        <div className="topics-list">
          {topics.map((topic) => (
            <div key={topic._id} className="topic-item">
            <button
              className={`topic-button ${
                selectedTopic === topic._id ? 'active' : ''
              }`}
              onClick={() => handleTopicClick(topic.topicId)}
            >
              {topic.name}
            </button>
            <div className="progress-container">
              <div
                className="progress-bar"
                style={{ width: `${topic.masteryLevel * 100}%` }}
              ></div>
            </div>
          </div>
          ))}
        </div>
      </div>
      <div className="problems-section">
        {selectedTopic && (
          <>
            <h2>Problems for {topics.find((topic) => topic.topicId === selectedTopic)?.name}</h2>
            <table className="problems-table">
              <thead>
                <tr>
                  <th>Problem</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {topics
                  .find((topic) => topic.topicId === selectedTopic)
                  ?.problems.map((problem) => (
                    <tr key={problem._id} onClick={() => handleProblemClick(problem.problemId)}>
                      <td>
                        {problem.title}
                        <div className="progress-container">
                          <div
                            className="progress-bar"
                            style={{ width: `${problem.masteryLevel * 100}%` }}
                          ></div>
                        </div>
                      </td>
                      <td>{problem.description}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </>
        )}
      </div>

      {/* Modal for the motivational quote */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <p className="motivational-quote">"{quote}"</p>
            <button className="close-button" onClick={handleCloseModal}>
              Proceed
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;