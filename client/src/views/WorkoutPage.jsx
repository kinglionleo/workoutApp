import React, { useState, useContext } from 'react';
import { Container, Button, Dialog, List, ListItem, TextField, Paper, Typography, Grid, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { AuthContext } from '../contexts/AuthContext';
import axios from 'axios';

const WorkoutPage = () => {
  const { user } = useContext(AuthContext);
  const [exercises, setExercises] = useState([]);
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [sets, setSets] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenExerciseModal = async () => {
    await fetchExercises();
    setIsModalOpen(true);
  };

  const handleCloseExerciseModal = () => {
    setIsModalOpen(false);
  };

  const handleSelectExercises = (selected) => {
    setSelectedExercises(prevExercises => {
      // Check if the exercise is already selected
      if (prevExercises.some(exercise => exercise._id === selected[0]._id)) {
        return prevExercises;
      }
      return [...prevExercises, ...selected];
    });
    handleCloseExerciseModal();
  };

  const handleAddSet = (exerciseId) => {
    const newSet = { weight: '', reps: '', timeCompleted: new Date() };
    setSets(prevSets => ({
      ...prevSets,
      [exerciseId]: [...(prevSets[exerciseId] || []), newSet]
    }));
  };

  const handleSetChange = (exerciseId, setIndex, field, value) => {
    setSets(prevSets => ({
      ...prevSets,
      [exerciseId]: prevSets[exerciseId].map((set, index) => {
        if (index === setIndex) {
          return { ...set, [field]: value };
        }
        return set;
      })
    }));
  };

  const handleFinishWorkout = async () => {
    try {
      // Iterate over each exercise and its sets
      for (const exerciseId of Object.keys(sets)) {
        for (const set of sets[exerciseId]) {
          const setData = {
            exerciseId,
            username: user.username, // Assuming user object has _id
            weight: set.weight,
            reps: set.reps,
            timeCompleted: set.timeCompleted
          };
  
          // POST request to create a set
          await axios.post('http://localhost:5000/set/createSet', setData, {
            headers: {
              Authorization: `Bearer ${user.token}`
            }
          });
        }
      }
  
      console.log('Workout Data Submitted:', { selectedExercises, sets });
      setSelectedExercises([]);
      setSets({});
    } catch (error) {
      console.error('Error submitting workout data:', error);
    }
  };
  

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

  return (
    <Container maxWidth="md">
      <Grid container spacing={2}>
      <Grid container spacing={2} style={{ marginTop: '20px', justifyContent: 'center' }}>
        <Grid item>
          <Button variant="contained" onClick={handleOpenExerciseModal}>Add Exercise</Button>
        </Grid>
        <Grid item>
          <Button variant="contained" color="primary" onClick={handleFinishWorkout}>Finish Workout</Button>
        </Grid>
      </Grid>
        <Grid item xs={12}>
          {selectedExercises.map((exercise, index) => (
            <Paper key={index} style={{ padding: '10px', marginBottom: '10px' }}>
              <Typography variant="h6">{exercise.name}</Typography>
              {sets[exercise._id]?.map((set, setIndex) => (
                <div key={setIndex}>
                  <TextField
                    label="Weight"
                    value={set.weight}
                    onChange={(e) => handleSetChange(exercise._id, setIndex, 'weight', e.target.value)}
                  />
                  <TextField
                    label="Reps"
                    value={set.reps}
                    onChange={(e) => handleSetChange(exercise._id, setIndex, 'reps', e.target.value)}
                  />
                </div>
              ))}
              <Button onClick={() => handleAddSet(exercise._id)}>Add Set</Button>
            </Paper>
          ))}
        </Grid>
      </Grid>

      <Dialog open={isModalOpen} onClose={handleCloseExerciseModal} fullWidth maxWidth="sm">
        <DialogTitle>Select Exercises</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Choose exercises to add to your workout.
          </DialogContentText>
          <List>
            {exercises.map((exercise, index) => (
              <Paper 
                key={index} 
                elevation={2} 
                style={{ margin: '10px 0', padding: '10px' }}
              >
                <ListItem 
                  button
                  onClick={() => {
                    handleSelectExercises([exercise]);
                    handleCloseExerciseModal();
                  }}
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <Typography variant="subtitle1">{exercise.name}</Typography>
                </ListItem>
              </Paper>
            ))}
          </List>
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default WorkoutPage;
