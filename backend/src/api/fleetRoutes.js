// src/api/fleetRoutes.js
const express = require('express');
const { ObjectId } = require('mongodb'); // Ensure ObjectId is imported
const router = express.Router();
const connectToMongoDB = require('../config/db');
const authenticateJWT = require('../middleware/auth');

// GET endpoint to just get the cars
router.get('/fleet', authenticateJWT, async (req, res) => {
  try {
    const client = await connectToMongoDB();
    const collection = client.db('wheels').collection('fleet');
    const fleet = await collection.find({}).toArray();
    res.json(fleet);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// POST enndpoint for new cars (this took superhuman effort).
router.post('/fleet', authenticateJWT, async (req, res) => {
    try {
      const client = await connectToMongoDB();
      const collection = client.db('wheels').collection('fleet');
      const car = req.body;
  
      console.log('Inserting:', car); // Log the data to be inserted
  
      try {
        const result = await collection.insertOne(car);
        console.log('Insert Result:', result); // Log the result of the insert operation
        res.status(201).json({ insertedId: result.insertedId });
      } catch (insertError) {
        console.error('Error during insert:', insertError); // Log the detailed error from insert
        throw insertError; // Re-throw the error to be caught by the outer try-catch
      }
    } catch (error) {
      console.error('POST /fleet Error:', error); // Log the full error
      res.status(500).send('Error inserting document');
    }
  });
  
// PUT endpoint to update a specific car's details
router.put('/fleet/:id', authenticateJWT, async (req, res) => {
    try {
      const client = await connectToMongoDB();
      const carId = req.params.id;
      const updateData = req.body;
  
      console.log(`Attempting to update car with ID: ${carId}`); // Log the ID being used
  
      const collection = client.db('wheels').collection('fleet');
      const result = await collection.findOneAndUpdate(
        { _id: new ObjectId(carId) },
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
      console.error('PUT /fleet Error:', error);
      res.status(500).send(error.message);
    }
  });

// DELETE endpoint to remove a car from the fleet
router.delete('/fleet/:id', authenticateJWT, async (req, res) => {
    try {
      const client = await connectToMongoDB();
      const carId = new ObjectId(req.params.id); // Convert string ID to ObjectId
  
      const collection = client.db('wheels').collection('fleet');
      const result = await collection.deleteOne({ _id: carId });
  
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

