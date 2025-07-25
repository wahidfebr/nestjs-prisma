import { z } from 'zod/v4';

export const RegisterSchema = z.object({
  email: z.email(),
  password: z.string().trim().min(8),
  name: z.string().trim().optional(),
  phone: z.string().trim().optional(),
});

export const LoginSchema = z.object({
  email: z.email(),
  password: z.string().trim().min(8),
});
