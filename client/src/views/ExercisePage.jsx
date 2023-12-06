import React, { useState, useEffect, useContext } from 'react';
import { Grid, TextField, Button, MenuItem, Typography, Container, Paper } from '@mui/material';
import { AuthContext } from '../contexts/AuthContext';
import axios from 'axios';

const ExercisePage = () => {
  const { user } = useContext(AuthContext);
  const [exercises, setExercises] = useState([]);
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [target, setTarget] = useState('');

  const exerciseTypes = ["Barbell", "Dumbbell", "Machine", "Cable", "Cardio", "Bodyweight", "Misc"];
  const exerciseTargets = ["Arms", "Shoulders", "Chest", "Legs", "Back", "Abs"];

  const handleSubmit = async () => {
    console.log("exercise create")
    try {
      const response = await axios.post('http://localhost:5000/exercise/exerciseCreation', {
        username: user.username,
        name,
        type,
        target
      },
      {
        headers: {
          Authorization: `Bearer ${user.token}` // Set the Authorization header
        }
      });
      console.log(response.data);
      
        // Clear the form fields if needed
      setName('');
      setType('');
      setTarget('');

      // Fetch the updated list of exercises
      fetchExercises();
    } catch (error) {
      console.error('There was an error creating the exercise:', error);
      // Handle error (e.g., show an error message)
    }
  };

  // Function to fetch exercises
  const fetchExercises = async () => {
    if (!user || !user.token) {
      console.log("User not logged in or token not available");
      return;
    }
    try {
      const response = await axios.get('http://localhost:5000/exercise/fetchExercises', {
        headers: {
          Authorization: `Bearer ${user.token}`,
          'username': user.username
        }
      });
      setExercises(response.data);
    } catch (error) {
      console.error('Error fetching exercises:', error);
    }
  };

  // Fetch exercises on component mount
  useEffect(() => {
    fetchExercises();
  }, [user]); // Empty dependency array to run only once on mount
  

  return (
    <Container component="main" maxWidth="lg">
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6">Your Exercises</Typography>
          {/* Display exercises here */}
          {exercises.map((exercise, index) => (
            <Paper key={index} style={{ margin: '10px', padding: '10px' }}>
              <Typography variant="subtitle1">{exercise.name}</Typography>
              <Typography variant="body2">Type: {exercise.type}</Typography>
              <Typography variant="body2">Target: {exercise.target}</Typography>
            </Paper>
          ))}
        </Grid>
        <Grid item xs={12} md={6}>
          {/* Exercise creation form */}
          <Paper elevation={3} style={{ padding: '20px' }}>
            <Typography component="h1" variant="h5">
              Create Exercise
            </Typography>
            <form onSubmit={handleSubmit}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              label="Exercise Name"
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              select
              variant="outlined"
              margin="normal"
              required
              fullWidth
              label="Type"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              {exerciseTypes.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              variant="outlined"
              margin="normal"
              required
              fullWidth
              label="Target"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
            >
              {exerciseTargets.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              style={{ marginTop: '10px' }}
              onClick={handleSubmit}
            >
              Create Exercise
            </Button>
          </form>
          </Paper>
        </Grid>
      </Grid>
    </Container>

  );
};

export default ExercisePage;
