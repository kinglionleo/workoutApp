import React, { useContext } from 'react';
import { Route, Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, ...rest }) => {
  const { isLoggedIn } = useContext(AuthContext);

  return (
    isLoggedIn ? children : <Navigate to="/login" replace />
  );
};

export default ProtectedRoute;
