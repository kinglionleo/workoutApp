import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { TextField, Button, Typography, Container, Paper, Link } from '@mui/material';
import axios from 'axios';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setIsLoggedIn, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/user/login', {
        username: email,
        password
      });
      const { token } = response.data;
      localStorage.setItem('userToken', token);
      localStorage.setItem('username', email);
      setIsLoggedIn(true);
      setUser({ username: email, token }); // Update user information in context
      navigate('/'); // Redirect to landing page
    } catch (error) {
      console.error('Login failed:', error);
      // Handle login failure
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form onSubmit={handleLogin}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Email Address"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            style={{ marginTop: '10px' }}
          >
            Sign In
          </Button>
          <Typography variant="body2" style={{ marginTop: '10px', textAlign: 'center' }}>
            Don't have an account? 
            <Link href="/register" style={{ marginLeft: '5px' }}>Sign up here</Link>
          </Typography>
        </form>
      </Paper>
    </Container>
  );
};

export default LoginPage;
