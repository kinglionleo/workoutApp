const express = require('express');
const Exercise = require('../models/Exercise');
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

module.exports = router;
