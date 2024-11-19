import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../index";
import problemsData from "../../data/problems.json";
import "./Home.css";
import quotes from "../../data/quotes.json"; // Import motivational quotes

function Home() {
  const navigate = useNavigate();
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [showModal, setShowModal] = useState(false); // Track modal visibility
  const [currentProblemId, setCurrentProblemId] = useState(null); // Store the selected problem ID
  const [quote, setQuote] = useState(""); // Store the random motivational quote

  // Extract topics from the JSON data
  const topics = Object.entries(problemsData.topics).map(([key, value]) => ({
    id: key,
    name: value.name,
    problems: Object.entries(value.problems).map(([problemKey, problemValue]) => ({
      id: problemKey,
      title: problemValue.title,
      badgeLevel: "Beginner", // You can replace this with dynamic logic later
    })),
  }));

  // Handle topic selection
  const handleTopicClick = (topicId) => {
    setSelectedTopic(topicId);
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
            <button
              key={topic.id}
              className={`topic-button ${selectedTopic === topic.id ? "active" : ""}`}
              onClick={() => handleTopicClick(topic.id)}
            >
              {topic.name}
            </button>
          ))}
        </div>
      </div>
      <div className="problems-section">
        {selectedTopic && (
          <>
            <h2>Questions for {topics.find((topic) => topic.id === selectedTopic)?.name}</h2>
            <table className="problems-table">
              <thead>
                <tr>
                  <th>Question</th>
                  <th>Badge Level</th>
                </tr>
              </thead>
              <tbody>
                {topics
                  .find((topic) => topic.id === selectedTopic)
                  ?.problems.map((problem) => (
                    <tr key={problem.id} onClick={() => handleProblemClick(problem.id)}>
                      <td>{problem.title}</td>
                      <td>{problem.badgeLevel}</td>
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





// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Navbar } from "../index";
// import problemsData from "../../data/problems.json"; 
// import "./Home.css";  


// function Home() {
//   const navigate = useNavigate();
//   const [selectedTopic, setSelectedTopic] = useState(null);

//   // Extract topics from the JSON data
//   const topics = Object.entries(problemsData.topics).map(([key, value]) => ({
//     id: key,
//     name: value.name,
//     problems: Object.entries(value.problems).map(([problemKey, problemValue]) => ({
//       id: problemKey,
//       title: problemValue.title,
//       badgeLevel: "Beginner" // You can replace this with dynamic logic later
//     }))
//   }));

//   // Handle topic selection
//   const handleTopicClick = (topicId) => {
//     setSelectedTopic(topicId);
//   };

//   // Handle problem click to navigate to the flashcard page
//   const handleProblemClick = (problemId) => {
//     navigate(`/flashcards/${problemId}`);
//   };

//   return (
//     <div className="home-page">
//       <Navbar />
//       <div className="topic-selection">
//         <h1>Select a Topic</h1>
//         <div className="topics-list">
//           {topics.map((topic) => (
//             <button
//               key={topic.id}
//               className={`topic-button ${selectedTopic === topic.id ? "active" : ""}`}
//               onClick={() => handleTopicClick(topic.id)}
//             >
//               {topic.name}
//             </button>
//           ))}
//         </div>
//       </div>
//       <div className="problems-section">
//         {selectedTopic && (
//           <>
//             <h2>Questions for {topics.find((topic) => topic.id === selectedTopic)?.name}</h2>
//             <table className="problems-table">
//               <thead>
//                 <tr>
//                   <th>Question</th>
//                   <th>Badge Level</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {topics
//                   .find((topic) => topic.id === selectedTopic)
//                   ?.problems.map((problem) => (
//                     <tr key={problem.id} onClick={() => handleProblemClick(problem.id)}>
//                       <td>{problem.title}</td>
//                       <td>{problem.badgeLevel}</td>
//                     </tr>
//                   ))}
//               </tbody>
//             </table>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }

// export default Home;


