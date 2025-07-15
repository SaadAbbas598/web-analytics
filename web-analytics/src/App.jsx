// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import Login from './components/auth/login';
import Signup from './components/auth/signup';

function App() {
  return (
    <div className="font-sans">
      <Routes>
        <Route path="/index" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Signup />} />
      </Routes>
    </div>
  );
}

export default App;
