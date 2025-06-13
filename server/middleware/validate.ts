import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

interface ValidationError extends Error {
  statusCode?: number;
  data?: Array<{
    msg: string;
    param: string;
    location: string;
  }>;
}

const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed') as ValidationError;
    error.statusCode = 400;
    error.data = errors.array();
    return next(error);
  }
  next();
};

export default validate; 