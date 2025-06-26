import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { CustomError } from '../types/index.js';

const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed') as CustomError;
    error.statusCode = 400;
    error.data = errors.array();
    return next(error);
  }
  next();
};

export default validate;
