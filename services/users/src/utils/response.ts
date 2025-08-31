import type { Response } from 'express';
import type { SuccessResponse, ErrorResponse } from '../types/api';

// Success response helper
export function success<T>(res: Response, data: T, message = 'Success', status = 200) {
  const response: SuccessResponse<T> = {
    success: true,
    message,
    data,
  };

  return res.status(status).json(response);
}

// Error response helper
export function error(
  res: Response,
  message: string,
  status = 400,
  errors?: Record<string, string | string[]>
) {
  const response: ErrorResponse = {
    success: false,
    message,
    error: message,
    ...(errors && { errors }),
  };

  return res.status(status).json(response);
}

// Created response helper
export function created<T>(res: Response, data: T, message = 'Created successfully', status = 201) {
  return success(res, data, message, status);
}

// Not found response helper
export function notFound(res: Response, message = 'Not found', status = 404) {
  return error(res, message, status);
}

// Unauthorized response helper
export function unauthorized(res: Response, message = 'Unauthorized access', status = 401) {
  return error(res, message, status);
}

// Forbidden response helper
export function forbidden(res: Response, message = 'Forbidden access', status = 403) {
  return error(res, message, status);
}

// Internal server error response helper
export function serverError(res: Response, message = 'Internal server error', status = 500) {
  return error(res, message, status);
}
