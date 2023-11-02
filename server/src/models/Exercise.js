const mongoose = require('mongoose');

const ExerciseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    type: {
        type: String,
        required: true,
    },
    target: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model('Exercise', ExerciseSchema);
