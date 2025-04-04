import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './NavBar';
import Footer from './Footer';
import Home from './Home';
import Blog from './Blog';
import AdminBlog from './AdminBlog';
import DiseaseIdentification from './DiseaseIdentification';
import DiseasePrediction from './DiseasePrediction';
import './css/App.css';

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/admin/blog" element={<AdminBlog />} />
        <Route path="/disease-identification" element={<DiseaseIdentification />} />
        <Route path="/disease-prediction" element={<DiseasePrediction />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
