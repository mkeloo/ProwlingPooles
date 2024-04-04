import React from 'react';
import { Routes, Route } from 'react-router-dom';

import About from './pages/About.jsx';
import Home from './pages/Home.jsx';
import Navbar from './components/Navbar';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </>
  );
}

export default App;
