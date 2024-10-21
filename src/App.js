import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home, Flashcard, Login, Profile } from "./components";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/flashcards/:id" element={<Flashcard />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;
