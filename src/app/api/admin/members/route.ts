import { prisma } from '@/lib/prisma'
import { getAuthenticatedUser } from '@/lib/currentUser'
import { hashPassword } from '@/lib/password'
import { MemberStatus } from '@prisma/client'
import type { Prisma } from '@prisma/client'
import { z } from 'zod'

const CreateSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).optional(),
  password: z.string().min(6),
  note: z.string().max(500).optional(),
  status: z.nativeEnum(MemberStatus).optional()
})

export async function GET(req: Request): Promise<Response> {
  const admin = await getAuthenticatedUser({ requireAdmin: true })
  if (!admin) return new Response('未授權', { status: 401 })
  const url = new URL(req.url)
  const search = url.searchParams.get('search')?.trim() ?? ''
  const page = Math.max(1, Number(url.searchParams.get('page')) || 1)
  const pageSize = Math.min(50, Number(url.searchParams.get('pageSize')) || 10)
  const where: Prisma.UserWhereInput | undefined = search
    ? {
        OR: [
          { email: { contains: search, mode: 'insensitive' } },
          { name: { contains: search, mode: 'insensitive' } }
        ]
      }
    : undefined
  const [members, total] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: {
        id: true,
        email: true,
        name: true,
        status: true,
        note: true,
        role: true,
        createdAt: true
      }
    }),
    prisma.user.count({ where })
  ])
  return new Response(JSON.stringify({ members, total, page, pageSize }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  })
}

export async function POST(req: Request): Promise<Response> {
  const admin = await getAuthenticatedUser({ requireAdmin: true })
  if (!admin) return new Response('未授權', { status: 401 })
  const json = await req.json().catch(() => null)
  const parsed = CreateSchema.safeParse(json)
  if (!parsed.success) {
    return new Response(JSON.stringify(parsed.error.flatten()), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    })
  }
  const { email, name, password, note, status } = parsed.data
  const hashed = hashPassword(password)
  try {
    const member = await prisma.user.create({
      data: {
        email,
        name,
        password: hashed,
        note,
        status: status ?? MemberStatus.ACTIVE,
        role: 'MEMBER'
      },
      select: {
        id: true,
        email: true,
        name: true,
        status: true,
        note: true,
        role: true,
        createdAt: true
      }
    })
    return new Response(JSON.stringify(member), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return new Response(JSON.stringify({ error: 'Email 已存在' }), { status: 409, headers: { 'Content-Type': 'application/json' } })
    }
    return new Response(JSON.stringify({ error: '建立失敗' }), { status: 500, headers: { 'Content-Type': 'application/json' } })
  }
}
