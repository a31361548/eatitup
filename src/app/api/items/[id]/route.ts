import { prisma } from '@/lib/prisma'
import { getAuthenticatedUser } from '@/lib/currentUser'
import type { Prisma } from '@prisma/client'
import { z } from 'zod'

type ItemWithOwner = Prisma.ItemGetPayload<{ include: { list: { select: { ownerId: true } } } }>

async function getOwnedItem(id: string, ownerId: string): Promise<ItemWithOwner | null> {
  const item = await prisma.item.findUnique({
    where: { id },
    include: { list: { select: { ownerId: true } } }
  })
  if (!item || item.list.ownerId !== ownerId) return null
  return item
}

export async function POST(req: Request, { params }: { params: { id: string } }): Promise<Response> {
  const user = await getAuthenticatedUser()
  if (!user) return new Response('未授權', { status: 401 })
  const form = await req.formData()
  const method = form.get('_method')?.toString() ?? ''
  if (method !== 'DELETE') return new Response('不支援', { status: 405 })
  const item = await getOwnedItem(params.id, user.id)
  if (!item) return new Response('項目不存在', { status: 404 })
  await prisma.item.delete({ where: { id: params.id } })
  return new Response(null, { status: 204 })
}

const PatchSchema = z.object({ label: z.string().min(1), weight: z.number().int().min(1) })

export async function PATCH(req: Request, { params }: { params: { id: string } }): Promise<Response> {
  const user = await getAuthenticatedUser()
  if (!user) return new Response('未授權', { status: 401 })
  const json = await req.json()
  const parsed = PatchSchema.safeParse(json)
  if (!parsed.success) return new Response('資料錯誤', { status: 400 })
  const item = await getOwnedItem(params.id, user.id)
  if (!item) return new Response('項目不存在', { status: 404 })
  await prisma.item.update({ where: { id: params.id }, data: parsed.data })
  return new Response(null, { status: 204 })
}
