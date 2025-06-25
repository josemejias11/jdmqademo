import { Request } from 'express';

export interface CustomError extends Error {
  statusCode?: number;
  data?: Array<{
    msg: string;
    param: string;
    location: string;
  }>;
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
