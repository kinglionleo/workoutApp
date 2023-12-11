const express = require('express');
const Exercise = require('../models/Exercise');
const Set = require('../models/Set');
const authenticateToken = require('../middlewares/authenticateToken');

const router = express.Router();

// Create Exercise
router.post('/exerciseCreation', authenticateToken, async (req, res) => {
  try {
    const { username, name, type, target } = req.body;

    // Check if exercise exists
    let exercise = await Exercise.findOne({ name });
    if (exercise) {
      return res.status(400).json({ message: 'Exercise already exists' });
    }

    // Create and save the exercise
    exercise = new Exercise({ username, name, type, target });
    await exercise.save();

    res.status(201).json({ exercise });

  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Fetch Exercises for a Given Username
router.get('/fetchExercises', authenticateToken, async (req, res) => {
  try {
    const username = req.headers['username'];
    const exercises = await Exercise.find({ username });
    res.json(exercises);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});


// Update Exercise
router.put('/updateExercise/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type, target } = req.body;

    const exercise = await Exercise.findByIdAndUpdate(id, { name, type, target }, { new: true });
    if (!exercise) {
      return res.status(404).json({ message: 'Exercise not found' });
    }

    res.json(exercise);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete Exercise and its associated Sets
router.delete('/deleteExercise/:exerciseId', authenticateToken, async (req, res) => {
  try {
    const { exerciseId } = req.params;
    
    const deletedExercise = await Exercise.findByIdAndDelete(exerciseId);
    if (!deletedExercise) {
      return res.status(404).json({ message: 'Exercise not found' });
    }

    // Delete all sets associated with the exercise
    await Set.deleteMany({ exerciseId });

    res.status(200).json({ message: 'Exercise and associated sets deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
