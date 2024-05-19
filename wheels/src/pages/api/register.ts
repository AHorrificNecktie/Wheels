// pages/api/register.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import { connectToDatabase } from '../../../utils/mongodb'; // Update the import path as necessary

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    const { db } = await connectToDatabase(); // Use connectToDatabase to get the db instance
    const existingUser = await db.collection('users').findOne({ username });

    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' }); // 409 Conflict
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.collection('users').insertOne({ username, password: hashedPassword });

    // Optionally return a JWT here if you want to log the user in immediately after registration
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export default handler;
