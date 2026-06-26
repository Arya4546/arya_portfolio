import dotenv from 'dotenv';

dotenv.config();

interface EnvConfig {
  PORT: number;
  DATABASE_URL: string;
  ACTIVITY_SECRET: string;
  ALLOWED_ORIGIN: string;
  NODE_ENV: string;
}

const requiredVars = ['DATABASE_URL', 'ACTIVITY_SECRET', 'ALLOWED_ORIGIN'] as const;

for (const key of requiredVars) {
  if (!process.env[key]) {
    console.error(`❌ Missing required environment variable: ${key}`);
    process.exit(1);
  }
}

export const env: EnvConfig = {
  PORT: parseInt(process.env.PORT || '4000', 10),
  DATABASE_URL: process.env.DATABASE_URL as string,
  ACTIVITY_SECRET: process.env.ACTIVITY_SECRET as string,
  ALLOWED_ORIGIN: process.env.ALLOWED_ORIGIN as string,
  NODE_ENV: process.env.NODE_ENV || 'development',
};
