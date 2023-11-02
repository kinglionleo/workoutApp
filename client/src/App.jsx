import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './views/LoginPage';
import RegisterPage from './views/RegisterPage';
import ExercisePage from './views/ExercisePage';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/exercise" element={<ExercisePage />} />
        {/* Add other routes here */}
      </Routes>
    </BrowserRouter>
  );
};

export default App;
