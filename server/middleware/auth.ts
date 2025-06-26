import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JwtPayload, AuthenticatedRequest, CustomError } from '../types/index.js';

// Maximum token length to prevent 431 errors (8KB is a conservative limit)
const MAX_TOKEN_LENGTH = 8192;

const auth = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  // Get token from header
  const authHeader = req.header('Authorization');

  // Check if no token
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    if (process.env.NODE_ENV !== 'production') {
      console.log('Auth Error: No token or not properly formatted');
    }
    const error = new Error('No token, authorization denied') as CustomError;
    error.statusCode = 401;
    return next(error);
  }

  try {
    // Verify token
    const token = authHeader.split(' ')[1];

    // Check if token is too large
    if (token && token.length > MAX_TOKEN_LENGTH) {
      if (process.env.NODE_ENV !== 'production') {
        console.log(
          `Auth Error: Token too large (${token.length} bytes) - Exceeds limit of ${MAX_TOKEN_LENGTH} bytes`
        );
      }
      const error = new Error('Token is too large') as CustomError;
      error.statusCode = 431;
      return next(error);
    }

    if (process.env.NODE_ENV !== 'production') {
      console.log(`Auth: Token received (length: ${token.length} bytes)`);
    }

    // Check if JWT_SECRET is configured
    if (!process.env.JWT_SECRET) {
      if (process.env.NODE_ENV !== 'production') {
        console.log('Auth Error: JWT secret not configured');
      }
      const error = new Error('Server configuration error') as CustomError;
      error.statusCode = 500;
      return next(error);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;
    if (process.env.NODE_ENV !== 'production') {
      console.log(`Auth: Token verified successfully for user: ${decoded.username}`);
    }

    // Add user from payload
    req.user = decoded;
    next();
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`Auth Error: ${(err as Error).message}`);
    }
    const error = new Error('Token is not valid') as CustomError;
    error.statusCode = 401;
    next(error);
  }
};

export default auth;
