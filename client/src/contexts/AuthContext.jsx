import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    console.log('Checking local storage for authentication info');
    const token = localStorage.getItem('userToken');
    const username = localStorage.getItem('username');
    console.log(`Token: ${token}, Username: ${username}`);
    if (token && username) {
      setIsLoggedIn(true);
      setUser({ username, token });
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('username');
    setIsLoggedIn(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
