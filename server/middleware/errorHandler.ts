import { Request, Response } from 'express';
import { CustomError } from '../types/index.js';

const errorHandler = (err: CustomError, _req: Request, res: Response) => {
  console.error(err.stack);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      ...(err.data && { validationErrors: err.data }),
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
};

export default errorHandler;
