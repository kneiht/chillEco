import { generateAccessToken, generateRefreshToken, verifyToken } from '../utils/jwt';
import { createUser, authenticateUser, findUserById } from './user.service';
import type {
  UserRegistrationData,
  UserLoginData,
  AuthTokens,
  JwtPayload,
  User,
} from '../types/user.js';

// Register user and return tokens
export async function registerUserWithTokens(userData: UserRegistrationData): Promise<{
  user: User;
  tokens: AuthTokens;
}> {
  // Create user
  const user = await createUser(userData);

  // Generate tokens
  const jwtPayload: JwtPayload = {
    userId: user.id,
    email: user.email,
    username: user.username ?? '',
  };

  const accessToken = generateAccessToken(jwtPayload);
  const refreshToken = generateRefreshToken(jwtPayload);

  return {
    user,
    tokens: {
      accessToken,
      refreshToken,
    },
  };
}

// Login user and return tokens
export async function loginUserWithTokens(loginData: UserLoginData): Promise<{
  user: User;
  tokens: AuthTokens;
} | null> {
  // Authenticate user
  const user = await authenticateUser(loginData);

  if (!user) {
    return null;
  }

  // Generate tokens
  const jwtPayload: JwtPayload = {
    userId: user.id,
    email: user.email,
    username: user.username ?? '',
  };

  const accessToken = generateAccessToken(jwtPayload);
  const refreshToken = generateRefreshToken(jwtPayload);

  return {
    user,
    tokens: {
      accessToken,
      refreshToken,
    },
  };
}

// Refresh access token
export async function refreshAccessToken(refreshToken: string): Promise<{
  user: User;
  tokens: AuthTokens;
} | null> {
  try {
    // Verify refresh token
    const payload = verifyToken(refreshToken);

    // Check if user still exists
    const user = await findUserById(payload.userId);

    if (!user || !user.isActive) {
      return null;
    }

    // Generate new tokens
    const jwtPayload: JwtPayload = {
      userId: user.id,
      email: user.email,
      username: user.username ?? '',
    };

    const newAccessToken = generateAccessToken(jwtPayload);
    const newRefreshToken = generateRefreshToken(jwtPayload);

    return {
      user,
      tokens: {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      },
    };
  } catch (_error) {
    return null;
  }
}

// Verify token and return user
export async function verifyUserToken(token: string): Promise<User | null> {
  try {
    const payload = verifyToken(token);
    const user = await findUserById(payload.userId);

    if (!user || !user.isActive) {
      return null;
    }

    return user;
  } catch (_error) {
    return null;
  }
}
