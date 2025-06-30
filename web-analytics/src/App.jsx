// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import Login from './components/auth/login';
import Signup from './components/auth/signup'; // make sure this file exists

function App() {
  return (
    <div className="font-sans">
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </div>
  );
}

export default App;
