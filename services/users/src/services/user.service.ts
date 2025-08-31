import bcrypt from 'bcryptjs';
import UserModel from '../models/user.model.js';
import { env } from '../config/environment.js';
import type {
  User,
  UserRegistrationData,
  UserLoginData,
  UserProfileUpdateData,
} from '../types/user.js';

// Hash password utility
async function hashPassword(password: string): Promise<string> {
  const saltRounds = parseInt(env.BCRYPT_ROUNDS || '12', 10);
  return await bcrypt.hash(password, saltRounds);
}

// Create new user
export async function createUser(userData: UserRegistrationData): Promise<User> {
  try {
    // Check if user already exists
    const existingUser = await UserModel.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Check username if provided
    if (userData.username) {
      const existingUsername = await UserModel.findByUsername(userData.username);
      if (existingUsername) {
        throw new Error('User with this username already exists');
      }
    }

    // Hash password
    const passwordHash = await hashPassword(userData.password);

    // Create user document
    const userDoc = new UserModel({
      email: userData.email.toLowerCase(),
      username: userData.username?.toLowerCase(),
      passwordHash,
      firstName: userData.firstName,
      lastName: userData.lastName,
    });

    // Save to database
    const savedUser = await userDoc.save();

    // Return public user data
    return savedUser.toPublicJSON() as User;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to create user');
  }
}

// Find user by email
export async function findUserByEmail(email: string): Promise<User | null> {
  try {
    const user = await UserModel.findByEmail(email);
    return user ? (user.toPublicJSON() as User) : null;
  } catch (_error) {
    throw new Error('Failed to find user by email');
  }
}

// Find user by ID
export async function findUserById(id: string): Promise<User | null> {
  try {
    const user = await UserModel.findById(id);
    return user ? (user.toPublicJSON() as User) : null;
  } catch (_error) {
    throw new Error('Failed to find user by ID');
  }
}

// Authenticate user (for login)
export async function authenticateUser(loginData: UserLoginData): Promise<User | null> {
  try {
    // Find user with password hash (for comparison)
    const userDoc = await UserModel.findByEmail(loginData.email);

    if (!userDoc) {
      return null;
    }

    // TODO: This is the workaround to get password hash from findByEmail,
    // because password automatically removed from the document
    // Get password hash for comparison
    const userWithPassword = await UserModel.findById(userDoc._id).select('+passwordHash');

    if (!userWithPassword) {
      return null;
    }

    // Check if account is active
    if (!userDoc.isActive) {
      throw new Error('Account is deactivated');
    }

    // Compare passwords
    const isPasswordValid = await userDoc.comparePassword(loginData.password);

    if (!isPasswordValid) {
      return null;
    }

    // Return public user data
    return userDoc.toPublicJSON() as User;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Authentication failed');
  }
}

// Update user profile
export async function updateUserProfile(
  userId: string,
  updateData: UserProfileUpdateData
): Promise<User | null> {
  try {
    // Check username availability if updating
    if (updateData.username) {
      const existingUser = await UserModel.findByUsername(updateData.username);
      if (existingUser && existingUser.id !== userId) {
        throw new Error('Username is already taken');
      }
    }

    // Update user
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        ...updateData,
        username: updateData.username?.toLowerCase(),
        updatedAt: new Date(),
      },
      {
        new: true, // Return updated document
        runValidators: true, // Run schema validations
      }
    );

    return updatedUser ? (updatedUser.toPublicJSON() as User) : null;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to update user profile');
  }
}

// Deactivate user account
export async function deactivateUser(userId: string): Promise<User | null> {
  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        isActive: false,
        updatedAt: new Date(),
      },
      { new: true }
    );

    return updatedUser ? (updatedUser.toPublicJSON() as User) : null;
  } catch (_error) {
    throw new Error('Failed to deactivate user');
  }
}

// Get user statistics
export async function getUserStats() {
  try {
    const totalUsers = await UserModel.countDocuments();
    const activeUsers = await UserModel.countDocuments({ isActive: true });
    const verifiedUsers = await UserModel.countDocuments({ isEmailVerified: true });

    return {
      total: totalUsers,
      active: activeUsers,
      verified: verifiedUsers,
      inactive: totalUsers - activeUsers,
    };
  } catch (_error) {
    throw new Error('Failed to get user statistics');
  }
}
