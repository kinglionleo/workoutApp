const express = require('express');
const Set = require('../models/Set'); // Assuming you have a Set model
const authenticateToken = require('../middlewares/authenticateToken');

const router = express.Router();

// Create Set
router.post('/createSet', authenticateToken, async (req, res) => {
    try {
        const { exerciseId, username, weight, reps, timeCompleted } = req.body;

        // Create and save the set
        const set = new Set({ exerciseId, username, weight, reps, timeCompleted });
        await set.save();

        res.status(201).json({ set });

    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete Set
router.delete('/deleteSet/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const set = await Set.findByIdAndDelete(id);

        if (!set) {
            return res.status(404).json({ message: 'Set not found' });
        }

        res.status(200).json({ message: 'Set deleted' });

    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Fetch Sets for a Given Exercise
router.get('/fetchSetsByExercise/:exerciseId', authenticateToken, async (req, res) => {
    try {
        const { exerciseId } = req.params;
        const sets = await Set.find({ exerciseId });
        res.json(sets);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Fetch Sets for a Given User
router.get('/fetchSetsByUser/:username', authenticateToken, async (req, res) => {
    try {
        const { username } = req.params;
        const sets = await Set.find({ username });
        res.json(sets);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Fetch Sets for a Given Exercise and User within a Date Range
router.get('/fetchSetsByExercise/:exerciseId', authenticateToken, async (req, res) => {
    try {
        const { exerciseId } = req.params;
        const { startDate, endDate } = req.query; // Get start and end dates from query parameters
        const username = req.headers['username']; // Get username from request headers

        // Convert dates to ISO format if necessary
        const startIsoDate = new Date(startDate).toISOString();
        const endIsoDate = new Date(endDate).toISOString();

        const sets = await Set.find({
            exerciseId,
            username, // Filter by username
            timeCompleted: {
                $gte: startIsoDate,
                $lte: endIsoDate
            }
        });

        res.json(sets);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
