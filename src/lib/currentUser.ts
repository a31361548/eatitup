import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import { prisma } from '@/lib/prisma'
import type { Prisma } from '@prisma/client'

type AuthOptions = {
  includeLists?: boolean
  includeItems?: boolean
  requireAdmin?: boolean
}

type BaseUser = Prisma.UserGetPayload<{}>
type UserWithLists = Prisma.UserGetPayload<{ include: { lists: true } }>
type UserWithListsAndItems = Prisma.UserGetPayload<{ include: { lists: { include: { items: true } } } }>

type AuthenticatedUserResult<O extends AuthOptions | undefined> =
  O extends { includeLists: true }
    ? O extends { includeItems: true }
      ? UserWithListsAndItems
      : UserWithLists
    : BaseUser

export async function getAuthenticatedUser<O extends AuthOptions | undefined>(options?: O): Promise<AuthenticatedUserResult<O> | null> {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return null
  if (options?.requireAdmin && session.user.role !== 'ADMIN') return null
  const include: Prisma.UserInclude | undefined = options?.includeLists
    ? options.includeItems
      ? { lists: { include: { items: true } } }
      : { lists: true }
    : undefined
  const user = await prisma.user.findUnique({ where: { email: session.user.email }, include })
  if (!user) return null
  if (user.status !== 'ACTIVE') return null
  if (options?.requireAdmin && user.role !== 'ADMIN') return null
  return user as AuthenticatedUserResult<O>
}
