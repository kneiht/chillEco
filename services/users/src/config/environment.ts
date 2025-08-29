import dotenv from 'dotenv';

dotenv.config();

const requiredEnvVars = ['NODE_ENV', 'PORT', 'DATABASE_URL'];

const missingVars = requiredEnvVars.filter(key => !process.env[key] || process.env[key] === '');

if (missingVars.length > 0) {
  throw new Error(`Missing required environment variable(s): ${missingVars.join(', ')}`);
}

export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || '3001',
  DATABASE_URL: process.env.DATABASE_URL || '',
};
