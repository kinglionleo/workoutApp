import React, { useState, useEffect, useContext } from 'react';
import { Grid, TextField, Button, MenuItem, Typography, Container, Paper } from '@mui/material';
import { AuthContext } from '../contexts/AuthContext';
import axios from 'axios';

const ExercisePage = () => {
  const { user } = useContext(AuthContext);
  const [exercises, setExercises] = useState([]);
  const [sets, setSets] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [target, setTarget] = useState('');

  const exerciseTypes = ["Barbell", "Dumbbell", "Machine", "Cable", "Cardio", "Bodyweight", "Misc"];
  const exerciseTargets = ["Arms", "Shoulders", "Chest", "Legs", "Back", "Abs"];

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
  }, [user]);

  const handleSelectExercise = async (exercise) => {
    if (selectedExercise && selectedExercise._id === exercise._id) {
      setSelectedExercise(null);
      // Clear form fields and sets
      setName('');
      setType('');
      setTarget('');
      setSets([]);
    } else {
      setSelectedExercise(exercise);
      // Update form fields
      setName(exercise.name);
      setType(exercise.type);
      setTarget(exercise.target);
  
      // Fetch sets for the selected exercise
      try {
        const response = await axios.get(`http://localhost:5000/set/fetchSetsByExercise/${exercise._id}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
            'username': user.username
          }
        });
        setSets(response.data);
      } catch (error) {
        console.error('Error fetching sets:', error);
        setSets([]);
      }
    }
  };
  

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    const exerciseData = {
      username: user.username,
      name,
      type,
      target
    };

    try {
      if (selectedExercise) {
        // Update existing exercise
        await axios.put(`http://localhost:5000/exercise/updateExercise/${selectedExercise._id}`, exerciseData, {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        });
      } else {
        // Create new exercise
        await axios.post('http://localhost:5000/exercise/exerciseCreation', exerciseData, {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        });
      }

      // Clear form and selected exercise, then fetch updated exercises list
      setName('');
      setType('');
      setTarget('');
      setSelectedExercise(null);
      fetchExercises();
    } catch (error) {
      console.error('There was an error submitting the exercise:', error);
    }
  };

  const handleDeleteExercise = async () => {
    if (!selectedExercise) {
      console.error('No exercise selected');
      return;
    }
  
    try {
      await axios.delete(`http://localhost:5000/exercise/deleteExercise/${selectedExercise._id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });
  
      // Refresh the exercises list after deletion
      fetchExercises();
      // Reset the form
      setSelectedExercise(null);
      setName('');
      setType('');
      setTarget('');
    } catch (error) {
      console.error('There was an error deleting the exercise:', error);
    }
  };
  

  return (
    <Container component="main" maxWidth="lg">
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
            <Typography variant="h6">Your Exercises</Typography>
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {exercises.map((exercise, index) => (
                <Paper 
                key={index} 
                style={{ 
                  margin: '10px', 
                  padding: '10px',
                  backgroundColor: selectedExercise && selectedExercise._id === exercise._id ? '#ADD8E6' : '',
                  cursor: 'pointer'
                }} 
                onClick={() => handleSelectExercise(exercise)}
              >
                  <Typography variant="subtitle1">{exercise.name}</Typography>
                  <Typography variant="body2">Type: {exercise.type}</Typography>
                  <Typography variant="body2">Target: {exercise.target}</Typography>
                </Paper>
              ))}
            </div>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
        <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
            <Typography component="h1" variant="h5">
              {selectedExercise ? "Edit Exercise" : "Create Exercise"}
            </Typography>
            <form onSubmit={handleFormSubmit}>
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
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                style={{ marginTop: '10px' }}
              >
                {selectedExercise ? "Update Exercise" : "Create Exercise"}
              </Button>
            </form>
            {selectedExercise && (
              <Button
                fullWidth
                variant="contained"
                color="secondary"
                style={{ marginTop: '10px' }}
                onClick={handleDeleteExercise}
              >
                Delete Exercise
              </Button>
            )}
            {selectedExercise && (
              <>
                <Typography variant="h6" style={{ marginTop: '20px' }}>Sets</Typography>
                {sets.map((set, index) => (
                  <div key={index} style={{ marginBottom: '10px' }}>
                    <Typography variant="body1">Weight: {set.weight}</Typography>
                    <Typography variant="body1">Reps: {set.reps}</Typography>
                    <Typography variant="body1">Date: {new Date(set.timeCompleted).toLocaleDateString()}</Typography>
                    {/* Add more details as needed */}
                  </div>
                ))}
              </>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ExercisePage;
