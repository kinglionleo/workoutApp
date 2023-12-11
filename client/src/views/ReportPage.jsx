import React, { useState, useContext, useEffect } from 'react';
import { Box, Button, TextField, Dialog, List, ListItem, Container, MenuItem, InputLabel, FormControl, Select, Typography } from '@mui/material';
import { AuthContext } from '../contexts/AuthContext';
import axios from 'axios';

const ReportPage = () => {
  const { user } = useContext(AuthContext);
  const [exercises, setExercises] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sets, setSets] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchExercises();
  }, [user]);

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

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    if (!selectedExercise || !startDate || !endDate) {
      // Optionally handle the case where one or more fields are empty
      console.error('Please select an exercise and specify both start and end dates.');
      return;
    }
  
    try {
      const response = await axios.get(`http://localhost:5000/set/fetchSetsByExercise/${selectedExercise}`, {
        params: {
          startDate: startDate,
          endDate: endDate
        },
        headers: {
          Authorization: `Bearer ${user.token}`,
          'username': user.username
        }
      });
  
      setSets(response.data);
      setIsModalOpen(true); // Open the modal to display the fetched sets
    } catch (error) {
      console.error('Error fetching sets:', error);
      // Optionally handle the error in the UI, such as displaying an error message
    }
  };
  

  return (
    <Container maxWidth="md">
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4 }}>
        <FormControl fullWidth margin="normal">
          <InputLabel id="exercise-select-label" shrink>Exercise</InputLabel>
          <Select
            labelId="exercise-select-label"
            value={selectedExercise}
            label="Exercise"
            onChange={(e) => setSelectedExercise(e.target.value)}
            displayEmpty
          >
            <MenuItem value="" disabled>Select an exercise</MenuItem>
            {exercises.map((exercise) => (
              <MenuItem key={exercise._id} value={exercise._id}>
                {exercise.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="Start Date"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="End Date"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />
        <Button type="submit" variant="contained" color="primary">
          Generate Report
        </Button>
      </Box>

      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {sets.length === 0 ? (
          <ListItem>
            <Typography variant="subtitle1" style={{ padding: '20px' }}>
              No sets found for the selected criteria.
            </Typography>
          </ListItem>
        ) : (
          <List>
            {sets.map((set, index) => (
              <ListItem key={index}>
                {/* Display set details */}
                <Typography variant="body1">
                  {/* Example: */}
                  Weight: {set.weight}, Reps: {set.reps}, Date: {new Date(set.timeCompleted).toLocaleDateString()}
                </Typography>
              </ListItem>
            ))}
          </List>
        )}
    </Dialog>

    </Container>
  );
};

export default ReportPage;
