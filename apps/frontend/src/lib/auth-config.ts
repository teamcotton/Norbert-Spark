import { type NextAuthOptions, type User } from 'next-auth'
// eslint-disable-next-line @typescript-eslint/no-require-imports
const CredentialsProvider = require('next-auth/providers/credentials').default

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://localhost:3001'

interface BackendLoginResponse {
  success: boolean
  data?: {
    userId: string
    email: string
    access_token: string
    roles: string[]
  }
  error?: string
}

interface CredentialsInput {
  email: string
  password: string
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'user@example.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials: CredentialsInput | undefined): Promise<User | null> {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Missing credentials')
        }

        try {
          // Call backend login endpoint
          const response = await fetch(`${backendUrl}/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          })

          const result = (await response.json()) as BackendLoginResponse

          if (!response.ok) {
            throw new Error(result.error || 'Authentication failed')
          }

          const data = result.data

          // Backend should return: { userId, email, access_token, roles }
          if (data?.access_token) {
            return {
              id: data.userId,
              email: data.email,
              accessToken: data.access_token,
              roles: data.roles || [],
            } as User
          }

          return null
        } catch (error) {
          console.error('Authentication error:', error)
          throw error
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Initial sign in
      if (user) {
        token.accessToken = user.accessToken
        token.id = user.id
        token.roles = user.roles
      }
      return token
    },
    async session({ session, token }) {
      // Send properties to the client
      if (session.user) {
        session.user.id = token.id as string
        session.user.roles = token.roles as string[]
      }
      session.accessToken = token.accessToken as string
      return session
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
}
