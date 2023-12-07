require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const exerciseRoutes = require('./routes/exerciseRoutes');
const setRoutes = require('./routes/setRoutes');

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Routes
app.use('/user', authRoutes);
app.use('/exercise', exerciseRoutes);
app.use('/set', setRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
