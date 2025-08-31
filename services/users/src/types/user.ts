// Public user data (no sensitive data)
export interface User {
  id: string;
  email: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  isEmailVerified: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// MongoDB user document (include password hash)
export interface MongoUser {
  email: string;
  username?: string;
  passwordHash: string;
  firstName?: string;
  lastName?: string;
  isEmailVerified: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// User registration ddata (include )
export interface UserRegistrationData {
  email: string;
  password: string;
  username?: string | undefined;
  firstName?: string | undefined;
  lastName?: string | undefined;
}

// User login data (include password)
export interface UserLoginData {
  email: string;
  password: string;
}

// JWT payload
export interface JwtPayLoad {
  userId: string;
  email: string;
  username?: string;
}

// Auth token
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

// User profile update data
export interface UserProfileUpdateData {
  firstName?: string;
  lastName?: string;
  username?: string;
}
