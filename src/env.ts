import { z } from 'zod/v4';

export enum EAPP_ENV {
  LOCAL = 'local',
  PRODUCTION = 'main',
}

const envSchema = z.object({
  APP_NAME: z.string().trim().min(1),
  APP_ENV: z.enum(EAPP_ENV),
  APP_PORT: z.coerce.number().positive(),
  HOSTNAME: z.string().trim().min(1),

  JWT_SECRET: z.string().trim().min(1),
  JWT_EXPIRATION: z.string().trim().min(1),

  DATABASE_URL: z.string().trim().min(1),
});

export const env = envSchema.parse(process.env);
