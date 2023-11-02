import React, { useState } from 'react';
import { TextField, Button, MenuItem, Typography, Container, Paper } from '@mui/material';
import axios from 'axios';

const ExercisePage = () => {
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [target, setTarget] = useState('');

  const exerciseTypes = ["Barbell", "Dumbbell", "Machine", "Cable", "Cardio", "Bodyweight", "Misc"];
  const exerciseTargets = ["Arms", "Shoulders", "Chest", "Legs", "Back", "Abs"];

  const handleSubmit = async () => {
    console.log("exercise create")
    try {
      const response = await axios.post('http://localhost:5000/exercise/exerciseCreation', {
        name,
        type,
        target
      });
      console.log(response.data);
      // Handle success (e.g., show a success message, clear the form, etc.)
    } catch (error) {
      console.error('There was an error creating the exercise:', error);
      // Handle error (e.g., show an error message)
    }
  };
  

  return (
    <Container component="main" maxWidth="sm">
      <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
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
    </Container>
  );
};

export default ExercisePage;
