const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const connectToMongoDB = require('../config/db');

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  try {
    const client = await connectToMongoDB();
    const db = client.db('wheels'); // Use the specific database name
    const user = await db.collection('users').findOne({ username });

    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid username or password.' });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined in your environment variables.');
    }

    const accessToken = jwt.sign(
      { id: user._id, username: user.username, role: user.role }, // Make sure the user has a 'role' field, or remove it if not used
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ accessToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

module.exports = router;
