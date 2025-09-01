// Common API response interface
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string | null;
  errors?: Record<string, string | string[]>;
  code?: number;
}

// Successful API response interface
export interface SuccessResponse<T = unknown> extends ApiResponse<T> {
  success: true;
  data: T;
  error?: never;
  errors?: never;
}

// Errored API response interface
export interface ErrorResponse extends ApiResponse {
  success: false;
  data?: never;
  error?: string;
  errors?: Record<string, string | string[]>;
}

// Paginated API response interface
export interface PaginatedResponse<T = unknown> extends SuccessResponse<T> {
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

import type { Request } from 'express';

// Request with user type (for authentication requests)
export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    username?: string;
  };
}
