import type { Request, Response, NextFunction } from 'express';
import { verifyToken, extractTokenFromHeader } from '../utils/jwt';
import { findUserById } from '../services/user.service';
import { unauthorized } from '../utils/response';

// Extend Request type to include user
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    username?: string;
  };
}

// Authentication middleware
export async function authenticateToken(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    // Extract token from Authorization header
    const token = extractTokenFromHeader(req.headers.authorization);

    if (!token) {
      return unauthorized(res, 'Access token is required');
    }

    // Verify token
    const payload = verifyToken(token);

    // Check if user still exists and is active
    const user = await findUserById(payload.userId);

    if (!user) {
      return unauthorized(res, 'User not found');
    }

    if (!user.isActive) {
      return unauthorized(res, 'Account is deactivated');
    }

    // Attach user info to request
    req.user = {
      id: user.id,
      email: user.email,
      ...(user.username && { username: user.username }),
    };

    return next();
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Token verification failed';
    return unauthorized(res, message);
  }
}

// Optional authentication middleware (doesn't fail if no token)
export async function optionalAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);

    if (token) {
      const payload = verifyToken(token);
      const user = await findUserById(payload.userId);

      if (user && user.isActive) {
        req.user = {
          id: user.id,
          email: user.email,
          ...(user.username && { username: user.username }),
        };
      }
    }

    next();
  } catch (_error) {
    // Ignore token errors for optional auth
    next();
  }
}

// Role-based authorization middleware (for future use)
export function requireRole(_roles: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return unauthorized(res, 'Authentication required');
    }

    // TODO: Implement role checking when user roles are added
    // For now, all authenticated users have access
    return next();
  };
}
