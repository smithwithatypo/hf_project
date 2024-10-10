import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Home, Lessons, LessonDetail, Quizzes, QuizDetail, Progress } from './pages';
// import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      {/* <Navbar /> */}
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/lessons" element={<Lessons />} />
        <Route path="/lessons/:id" element={<LessonDetail />} />
        <Route path="/quizzes" element={<Quizzes />} />
        <Route path="/quizzes/:id" element={<QuizDetail />} />
        <Route path="/progress" element={<Progress />} /> */}
      </Routes>
    </Router>
  );
}

export default App;