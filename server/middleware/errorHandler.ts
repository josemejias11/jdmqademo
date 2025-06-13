import { Request, Response, NextFunction } from 'express';

interface ValidationError extends Error {
  statusCode?: number;
  data?: Array<{
    msg: string;
    param: string;
    location: string;
  }>;
}

const errorHandler = (
  err: ValidationError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
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