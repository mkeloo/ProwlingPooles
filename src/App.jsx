import React from 'react';
import { Routes, Route } from 'react-router-dom';

import About from './pages/About.jsx';
import Home from './pages/Home.jsx';
import Navbar from './components/Navbar';
import Feature1 from './pages/Feature1';
import Feature2 from './pages/Feature2';
import Feature3 from './pages/Feature3';
import Feature4 from './pages/Feature4';
import Feature5 from './pages/Feature5';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/feature1" element={<Feature1 />} />
        <Route path="/feature2" element={<Feature2 />} />
        <Route path="/feature3" element={<Feature3 />} />
        <Route path="/feature4" element={<Feature4 />} />
        <Route path="/feature5" element={<Feature5 />} />
      </Routes>
    </>
  );
}

export default App;
