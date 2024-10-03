import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
// import Lessons from './pages/Lessons';
// import LessonDetail from './pages/LessonDetail';
// import Quizzes from './pages/Quizzes';
// import QuizDetail from './pages/QuizDetail';
// import Progress from './pages/Progress';
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