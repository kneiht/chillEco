import type { Request, Response, NextFunction } from 'express';
import { z, ZodType } from 'zod';
import { error } from '../utils/response.js';
import { registerSchema, loginSchema } from '../validators/auth.validator.js';

// Generic validation middleware factory
export function validateRequest(schema: ZodType) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate request body
      const validatedData = schema.parse(req.body);

      // Replace request body with validated data
      req.body = validatedData;

      return next();
    } catch (err) {
      if (err instanceof z.ZodError) {
        // Format validation errors
        const errors = err.issues.reduce(
          (acc, issue) => {
            const field = issue.path.join('.');
            acc[field] = issue.message;
            return acc;
          },
          {} as Record<string, string>
        );

        return error(res, 'Validation failed', 400, errors);
      }

      // Handle other errors
      return error(res, 'Invalid request data', 400);
    }
  };
}

// Specific validation middlewares
export const validateRegistration = validateRequest(registerSchema);

export const validateLogin = validateRequest(loginSchema);
