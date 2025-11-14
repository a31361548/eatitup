import type { MemberStatus, Role } from '@prisma/client'
import type { DefaultSession, DefaultUser } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user?: DefaultSession['user'] & {
      role?: Role
      status?: MemberStatus
    }
  }

  interface User extends DefaultUser {
    role?: Role
    status?: MemberStatus
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: Role
    status?: MemberStatus
  }
}
