import { prisma } from '@/lib/prisma'
import { getAuthenticatedUser } from '@/lib/currentUser'
import { z } from 'zod'

const CreateSchema = z.object({ title: z.string().min(1) })

export async function GET(): Promise<Response> {
  const user = await getAuthenticatedUser({ includeLists: true, includeItems: true })
  if (!user || !user.lists) return new Response('未授權', { status: 401 })
  return new Response(JSON.stringify({ lists: user.lists }), { status: 200, headers: { 'Content-Type': 'application/json' } })
}

export async function POST(req: Request): Promise<Response> {
  const user = await getAuthenticatedUser()
  if (!user) return new Response('未授權', { status: 401 })
  const json = await req.json()
  const parsed = CreateSchema.safeParse(json)
  if (!parsed.success) return new Response('資料錯誤', { status: 400 })
  const list = await prisma.list.create({ data: { title: parsed.data.title, ownerId: user.id } })
  return new Response(JSON.stringify({ id: list.id }), { status: 201 })
}
