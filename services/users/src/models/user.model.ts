import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';
import type { MongoUser } from '../types/user.js';
import { USER_DOCUMENT_NAME } from '../types/enums.js';

// Extend MongoUser interface with Mongoose Document
export interface UserDocument extends MongoUser, Document {
  _id: mongoose.Types.ObjectId;
  comparePassword(candidatePassword: string): Promise<boolean>;
  toPublicJSON(): object;
}

// Interface for static methods
export interface UserModelStatic extends Model<UserDocument> {
  findByEmail(email: string): Promise<UserDocument | null>;
  findByUsername(username: string): Promise<UserDocument | null>;
  findActiveUsers(): Promise<UserDocument[]>;
}

// User schema definition
const userSchema = new Schema<UserDocument>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email address'],
    },
    username: {
      type: String,
      required: false,
      unique: true,
      sparse: true, // Allow multiple null values
      lowercase: true,
      trim: true,
      minlength: [3, 'Username must be at least 3 characters long'],
      maxlength: [30, 'Username cannot exceed 30 characters'],
      match: [
        /^[a-zA-Z0-9_-]+$/,
        'Username can only contain letters, numbers, hyphens and underscores',
      ],
    },
    passwordHash: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [60, 'Invalid password hash'], // bcrypt hash length
    },
    firstName: {
      type: String,
      required: false,
      trim: true,
      maxlength: [50, 'First name cannot exceed 50 characters'],
    },
    lastName: {
      type: String,
      required: false,
      trim: true,
      maxlength: [50, 'Last name cannot exceed 50 characters'],
    },
    isEmailVerified: {
      type: Boolean,
      required: true,
      default: false,
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      immutable: true, // Cannot be changed after creation
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    // Schema options
    timestamps: false, // We handle timestamps manually
    versionKey: false, // Remove __v field
    toJSON: {
      virtuals: true,
      transform(doc, ret: any) {
        // Remove sensitive fields from JSON output
        delete ret.passwordHash;
        return ret;
      },
    },
  }
);

// Indexes for better performance
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ username: 1 }, { unique: true, sparse: true });
userSchema.index({ createdAt: 1 });
userSchema.index({ isActive: 1 });

// Virtual for id (converts _id to id)
userSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

// Pre-save middleware to update updatedAt
userSchema.pre('save', function (next) {
  if (this.isModified() && !this.isNew) {
    this.updatedAt = new Date();
  }
  next();
});

// Instance method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.passwordHash);
  } catch (_error) {
    throw new Error('Error comparing passwords');
  }
};

// Instance method to return public user data
userSchema.methods.toPublicJSON = function () {
  return {
    id: this.id,
    email: this.email,
    username: this.username,
    firstName: this.firstName,
    lastName: this.lastName,
    isEmailVerified: this.isEmailVerified,
    isActive: this.isActive,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

userSchema.statics.findByEmail = function (email: string) {
  return this.findOne({ email: email.toLowerCase() });
};

userSchema.statics.findByUsername = function (username: string) {
  return this.findOne({ username: username.toLowerCase() });
};

userSchema.statics.findActiveUsers = function () {
  return this.find({ isActive: true });
};

// Create and export model
const UserModel = mongoose.model<UserDocument, UserModelStatic>(USER_DOCUMENT_NAME, userSchema);

export default UserModel;
