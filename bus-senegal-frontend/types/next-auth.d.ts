import 'next-auth'
import { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    accessToken?: string
    idToken?: string
    refreshToken?: string
    user: {
      id?: string
      roles?: string[]
      companyId?: string
    } & DefaultSession['user']
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken?: string
    idToken?: string
    refreshToken?: string
    roles?: string[]
    companyId?: string
  }
}

