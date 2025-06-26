import { Request } from 'express';
import { ValidationError } from 'express-validator';

export interface CustomError extends Error {
  statusCode?: number;
  data?: ValidationError[];
}

export interface JwtPayload {
  username: string;
}

export interface AuthenticatedUser {
  username: string;
}

export type AuthenticatedRequest<
  P = Record<string, never>,
  ResBody = unknown,
  ReqBody = unknown
> = Request<P, ResBody, ReqBody> & {
  user: AuthenticatedUser;
};
