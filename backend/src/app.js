// src/app.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectToMongoDB = require('./config/db');
const app = express();
const authRoutes = require('./api/authRoutes');

// Middlewares
app.use('/api', authRoutes);
app.use(cors());
app.use(express.json()); // Make sure this comes before any routes

// Initialize MongoDB Connection
connectToMongoDB();

// Routes
const fleetRoutes = require('./api/fleetRoutes');
const reservationRoutes = require('./api/reservationRoutes');
app.use('/api', fleetRoutes);
app.use('/api', reservationRoutes);

// A simple test route
app.get('/', (req, res) => res.send('Rent-A-Car API is running!'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
