import type { Response } from 'express';
import type { SuccessResponse, ErrorResponse } from '@shared/types/api';

export function success<T>(res: Response, data: T, message = 'Success', status = 200) {
  const response: SuccessResponse = {
    success: true,
    message,
    data,
  };

  return res.status(status).json(response);
}

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
