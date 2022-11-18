import React from "react";
import { Routes, Route } from "react-router-dom"
import './App.css';

import { Game, Start } from './pages';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Start />} />
        <Route path="game" element={<Game />} />
        <Route path="*" element={<Game />} />
      </Routes>
    </div>
  );
}

export default App;
