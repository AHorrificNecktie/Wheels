// utils/auth.ts
import { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';
import jwt from 'jsonwebtoken';

export function withAuth(handler: NextApiHandler) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) throw new Error('No token found');
      if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined');
      }
      jwt.verify(token, process.env.JWT_SECRET);
      // Token is valid, proceed with the handler
      return handler(req, res);
    } catch (error) {
      // Token verification failed
      res.status(401).json({ message: 'Unauthorized' });
    }
  };
}
