import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CourseList from './components/CourseList';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CourseList />} />
      </Routes>
    </Router>
  );
}

export default App;
