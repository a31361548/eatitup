import { prisma } from '@/lib/prisma'
import { verifyPassword } from '@/lib/password'
import type { NextAuthOptions } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import type { MemberStatus, Role } from '@prisma/client'

export const authOptions: NextAuthOptions = {
  session: { strategy: 'jwt', maxAge: 7 * 24 * 60 * 60 },
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        const user = await prisma.user.findUnique({ where: { email: credentials.email } })
        if (!user) return null
        if (user.status !== 'ACTIVE') return null
        const ok = verifyPassword(credentials.password, user.password)
        if (!ok) return null
        return { 
          id: user.id, 
          email: user.email, 
          name: user.name ?? undefined, 
          role: user.role, 
          status: user.status,
          avatar: user.avatar 
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.role = (user as { role: Role }).role ?? 'MEMBER'
        token.status = (user as { status: MemberStatus }).status ?? 'ACTIVE'
        token.avatar = (user as { avatar?: string | null }).avatar
      }
      if (trigger === 'update' && session?.avatar) {
        token.avatar = session.avatar
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = (token.role as Role | undefined) ?? 'MEMBER'
        session.user.status = (token.status as MemberStatus | undefined) ?? 'ACTIVE'
        session.user.avatar = (token.avatar as string | null | undefined)
      }
      return session
    }
  }
}
