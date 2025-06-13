import { Request, Response, NextFunction } from 'express';

interface CustomError extends Error {
  statusCode?: number;
}

const notFound = (req: Request, _res: Response, next: NextFunction) => {
  const error = new Error(`Not Found - ${req.originalUrl}`) as CustomError;
  error.statusCode = 404;
  next(error);
};

export default notFound; 