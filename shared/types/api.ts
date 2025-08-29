export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string | null;
  errors?: Record<string, string | string[]>;
  code?: number;
}

export interface SuccessResponse<T = unknown> extends ApiResponse<T> {
  success: true;
  data: T;
  error?: never;
  errors?: never;
}

export interface ErrorResponse extends ApiResponse {
  success: false;
  data?: never;
  error?: string;
  errors?: Record<string, string | string[]>;
}

export interface PaginatedResponse<T = unknown> extends SuccessResponse<T> {
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
