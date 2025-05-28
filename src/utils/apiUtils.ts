import { ApiError } from '../types';

/**
 * Convert any error to a standardized ApiError
 * @param err The original error
 * @param defaultMessage The default message to use if the error doesn't have one
 * @returns A standardized ApiError object
 */
export const handleApiError = (err: unknown, defaultMessage: string): ApiError => {
  // Convert unknown error to ApiError
  const apiError: ApiError = {
    name: err instanceof Error ? err.name : 'Error',
    message: err instanceof Error ? err.message : defaultMessage,
    response: undefined
  };

  // Extract response data if available
  if (err && typeof err === 'object' && 'response' in err) {
    const errorObj = err as {
      response?: {
        status?: number;
        data?: {
          message?: string;
          error?: string;
        };
        statusText?: string;
      };
    };
    apiError.response = errorObj.response;
  }

  return apiError;
};
