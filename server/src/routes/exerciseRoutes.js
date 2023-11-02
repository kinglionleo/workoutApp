const express = require('express');
const Exercise = require('../models/Exercise');

const router = express.Router();

// Create Exercise
router.post('/exerciseCreation', async (req, res) => {
    try {
        const { name, type, target } = req.body;

        // Check if exercise exists
        let exercise = await Exercise.findOne({ name });
        if (exercise) {
            return res.status(400).json({ message: 'Exercise already exists' });
        }

        // Create and save the exercise
        exercise = new Exercise({ name, type, target });
        await exercise.save();

        res.status(201).json({ exercise });

    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
