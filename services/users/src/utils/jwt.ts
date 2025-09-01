import jwt from 'jsonwebtoken';
import { env } from '../config/environment.js';
import type { JwtPayload } from '../types/user.js';

// JWT configuration
const JWT_SECRET = env.JWT_SECRET as string;
const JWT_EXPIRES_IN = env.JWT_EXPIRES_IN as string;

// Generate JWT token
export function generateAccessToken(payload: JwtPayload): string {
  try {
    return jwt.sign(
      {
        userId: payload.userId,
        email: payload.email,
        username: payload.username,
      },
      JWT_SECRET,
      {
        expiresIn: JWT_EXPIRES_IN,
        issuer: 'users-service',
        audience: 'users-service-client',
        subject: payload.userId,
      } as jwt.SignOptions
    );
  } catch (_error) {
    throw new Error('Failed to generate access token');
  }
}

// Generate refresh token (longer expiry)
export function generateRefreshToken(payload: JwtPayload): string {
  try {
    return jwt.sign(
      {
        userId: payload.userId,
        email: payload.email,
        type: 'refresh',
      },
      JWT_SECRET,
      {
        expiresIn: '30d', // 30 days
        issuer: 'users-service',
        audience: 'users-service-client',
        subject: payload.userId,
      } as jwt.SignOptions
    );
  } catch (_error) {
    throw new Error('Failed to generate refresh token');
  }
}

// Verify JWT token
export function verifyToken(token: string): JwtPayload {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      issuer: 'users-service',
      audience: 'users-service-client',
    }) as jwt.JwtPayload;

    // Extract payload
    return {
      userId: decoded.userId,
      email: decoded.email,
      username: decoded.username,
    };
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Token has expired');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Invalid token');
    }
    throw new Error('Token verification failed');
  }
}

// Decode token without verification (for expired token info)
export function decodeToken(token: string): JwtPayload | null {
  try {
    const decoded = jwt.decode(token) as jwt.JwtPayload;

    if (!decoded || typeof decoded !== 'object') {
      return null;
    }

    return {
      userId: decoded.userId,
      email: decoded.email,
      username: decoded.username,
    };
  } catch (_error) {
    return null;
  }
}

// Get token expiry time
export function getTokenExpiry(token: string): Date | null {
  try {
    const decoded = jwt.decode(token) as jwt.JwtPayload;

    if (!decoded || !decoded.exp) {
      return null;
    }

    return new Date(decoded.exp * 1000);
  } catch (_error) {
    return null;
  }
}

// Check if token is expired
export function isTokenExpired(token: string): boolean {
  try {
    const expiry = getTokenExpiry(token);
    if (!expiry) return true;

    return Date.now() >= expiry.getTime();
  } catch (_error) {
    return true;
  }
}

// Extract token from Authorization header
export function extractTokenFromHeader(authHeader: string | undefined): string | null {
  if (!authHeader) {
    return null;
  }

  // Check for Bearer token format
  if (authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  return null;
}
