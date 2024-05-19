// src/api/reservationRoutes.js
const express = require('express');
const { ObjectId } = require('mongodb');
const router = express.Router();
const connectToMongoDB = require('../config/db');
const authenticateJWT = require('../middleware/auth');

// GET endpoint to read reservations
router.get('/reservations', authenticateJWT, async (req, res) => {
  try {
    const client = await connectToMongoDB();
    const collection = client.db('wheels').collection('reservations');
    const reservations = await collection.find({}).toArray();
    res.json(reservations);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// POST enndpoint for new reservations.
router.post('/reservations', authenticateJWT, async (req, res) => {
    try {
      const client = await connectToMongoDB();
      const collection = client.db('wheels').collection('reservations');
      const reservation = req.body;
  
      console.log('Inserting:', reservation); // Log the data to be inserted
  
      try {
        const result = await collection.insertOne(reservation);
        console.log('Insert Result:', result); // Log the result of the insert operation
        res.status(201).json({ insertedId: result.insertedId });
      } catch (insertError) {
        console.error('Error during insert:', insertError); // Log the detailed error from insert
        throw insertError; // Re-throw the error to be caught by the outer try-catch
      }
    } catch (error) {
      console.error('POST /reservations Error:', error); // Log the full error
      res.status(500).send('Error inserting document');
    }
  });

// PUT endpoint to update a specific car's details
router.put('/reservations/:id', authenticateJWT, async (req, res) => {
    try {
      const client = await connectToMongoDB();
      const reservationId = req.params.id;
      const updateData = req.body;
  
      console.log(`Attempting to update car with ID: ${reservationId}`); // Log the ID being used
  
      const collection = client.db('wheels').collection('reservations');
      const result = await collection.findOneAndUpdate(
        { _id: new ObjectId(reservationId) },
        { $set: updateData },
        { returnDocument: 'after' }
      );
      
      console.log('Update Result:', result); // Log the full result
  
      // Since the result.value holds the updated document
      if (result.value) {
        res.json(result.value); // Send back the updated document
      } else {
        res.status(404).send('Car with the specified ID not found');
      }
    } catch (error) {
      console.error('PUT /reservations Error:', error);
      res.status(500).send(error.message);
    }
  });

// DELETE endpoint to remove a car from the fleet
router.delete('/reservations/:id', authenticateJWT, async (req, res) => {
    try {
      const client = await connectToMongoDB();
      const reservationId = new ObjectId(req.params.id); // Convert string ID to ObjectId
  
      const collection = client.db('wheels').collection('reservations');
      const result = await collection.deleteOne({ _id: reservationId });
  
      if (result.deletedCount === 0) {
        res.status(404).send('Car with the specified ID not found');
      } else {
        res.status(204).send(); // No Content, successful deletion
      }
    } catch (error) {
      res.status(500).send(error.message);
    }
}); 

module.exports = router;
