import { DefaultSession, DefaultUser } from "next-auth"
import { Role, MemberStatus } from "@prisma/client"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: Role
      status: MemberStatus
      avatar?: string | null
      coins: number
    } & DefaultSession["user"]
  }

  interface User extends DefaultUser {
    role: Role
    status: MemberStatus
    avatar?: string | null
    coins: number
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: Role
    status: MemberStatus
    avatar?: string | null
    coins: number
  }
}
