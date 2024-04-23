// pages/api/login.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import clientPromise from '../../../utils/mongodb'; // Import the MongoDB client connection

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }

  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({ message: 'Username and password are required' });
      return;
    }

    const client = await clientPromise;
    const db = client.db();
    const user = await db.collection('users').findOne({ username });

    if (!user) {
      res.status(401).json({ message: 'Invalid username or password' });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password); // Ensure your DB field is named 'password'

    if (!isPasswordValid) {
      res.status(401).json({ message: 'Invalid username or password' });
      return;
    }

    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined');
    }
    
    const token = jwt.sign(
      { userId: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export default handler;
