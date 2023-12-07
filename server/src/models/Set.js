const mongoose = require('mongoose');

const SetSchema = new mongoose.Schema({
    exerciseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exercise',
        required: true
    },
    username: {
        type: String,
        required: true
    },
    weight: {
        type: Number,
        required: true
    },
    reps: {
        type: Number,
        required: true
    },
    timeCompleted: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Set', SetSchema);
