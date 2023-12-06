import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './views/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import RegisterPage from './views/RegisterPage';
import LandingPage from './views/LandingPage';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<LandingPage/>} />
        {/* Add other routes here */}
      </Routes>
    </BrowserRouter>
  );
};

export default App;
