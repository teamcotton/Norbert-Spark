import { z } from 'zod'

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export const RegisterSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  password: z.string().min(8),
  confirmPassword: z.string().min(8),
})

export const AuthResponseSchema = z.object({
  success: z.boolean(),
  data: z
    .object({
      token: z.string().optional(),
      user: z.any().optional(),
    })
    .optional(),
  error: z.string().optional(),
  status: z.number().optional(),
})
