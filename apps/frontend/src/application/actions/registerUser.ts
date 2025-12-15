'use server'

import { obscured } from 'obscured'

/**
 * @deprecated Use registerUserApi from @/infrastructure/api/registerUserApi.ts with React Query instead
 * This server action is kept for backward compatibility only
 */

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
    const apiUrl = process.env.BACKEND_AI_CALLBACK_URL

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
