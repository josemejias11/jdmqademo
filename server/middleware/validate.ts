import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationError as ExpressValidationError } from 'express-validator';

interface ValidationError extends Error {
  statusCode?: number;
  data?: ExpressValidationError[];
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
