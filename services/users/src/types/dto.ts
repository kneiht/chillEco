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

  // Methods
  comparePassword(password: string): Promise<boolean>;
}
