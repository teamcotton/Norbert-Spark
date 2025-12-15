'use server'

import { obscured } from 'obscured'
import { EmailSchema, NameSchema, PasswordSchema } from '@/domain/auth'

interface RegisterUserData extends Record<string, string> {
  email: string
  name: string
  password: string
}

interface RegisterUserResponse {
  success: boolean
  data?: {
    userId: string
    email: string
    name: string
  }
  error?: string
}

export async function registerUser(data: RegisterUserData): Promise<RegisterUserResponse> {
  try {
    // Validate input using domain schemas before making API call
    const emailValidation = EmailSchema.safeParse(data.email)
    if (!emailValidation.success) {
      return {
        success: false,
        error: emailValidation.error.issues[0]?.message || 'Invalid email',
      }
    }

    const nameValidation = NameSchema.safeParse(data.name)
    if (!nameValidation.success) {
      return {
        success: false,
        error: nameValidation.error.issues[0]?.message || 'Invalid name',
      }
    }

    const passwordValidation = PasswordSchema.safeParse(data.password)
    if (!passwordValidation.success) {
      return {
        success: false,
        error: passwordValidation.error.issues[0]?.message || 'Invalid password',
      }
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

    // Obscure sensitive data in memory to prevent exposure in logs/debugging
    const obscuredData = obscured.obscureKeys(data, ['password'])

    const response = await fetch(`${apiUrl}/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // Extract the actual password value for API transmission
      body: JSON.stringify({
        ...data,
        password: obscured.value(obscuredData.password),
      }),
    })

    const result = (await response.json()) as RegisterUserResponse

    if (!response.ok) {
      return {
        success: false,
        error: (result as { error?: string }).error || 'Registration failed',
      }
    }

    return result
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    }
  }
}
