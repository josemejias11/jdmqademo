import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface LoginRequestBody {
  username: string;
  password: string;
}

interface MockUser {
  username: string;
  password: string;
}

// Mock user (in a real app, this would come from a database)
// Using environment variables with fallbacks for local development
const mockUser: MockUser = {
  username: process.env.MOCK_USER || 'admin',
  password: process.env.MOCK_PASSWORD || 'changeme'
};

// Login user
const login = (req: Request<Record<string, never>, unknown, LoginRequestBody>, res: Response, next: NextFunction) => {
  try {
    const { username, password } = req.body;

    // Check credentials
    if (username === mockUser.username && password === mockUser.password) {
      // Check if JWT_SECRET is configured
      if (!process.env.JWT_SECRET) {
        const error = new Error('JWT secret not configured');
        (error as any).statusCode = 500;
        return next(error);
      }

      // Create JWT token
      const token = jwt.sign({ username }, process.env.JWT_SECRET, {
        expiresIn: '1h'
      });

      return res.json({ success: true, token });
    }

    // Invalid credentials
    const error = new Error('Invalid username or password');
    (error as any).statusCode = 401;
    return next(error);
  } catch (err) {
    next(err);
  }
};

export default {
  login
};