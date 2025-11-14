import { prisma } from '@/lib/prisma'
import { getAuthenticatedUser } from '@/lib/currentUser'
import { z } from 'zod'

const CreateSchema = z.object({ listId: z.string().min(1), label: z.string().min(1), weight: z.number().int().min(1) })

export async function POST(req: Request): Promise<Response> {
  const user = await getAuthenticatedUser()
  if (!user) return new Response('未授權', { status: 401 })
  const json = await req.json()
  const parsed = CreateSchema.safeParse(json)
  if (!parsed.success) return new Response('資料錯誤', { status: 400 })
  const list = await prisma.list.findUnique({ where: { id: parsed.data.listId }, select: { ownerId: true } })
  if (!list || list.ownerId !== user.id) return new Response('清單不存在', { status: 404 })
  const item = await prisma.item.create({ data: parsed.data })
  return new Response(JSON.stringify({ id: item.id }), { status: 201 })
}
