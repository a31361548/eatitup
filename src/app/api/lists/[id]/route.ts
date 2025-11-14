import { prisma } from '@/lib/prisma'
import { getAuthenticatedUser } from '@/lib/currentUser'
import { z } from 'zod'

const PatchSchema = z.object({ title: z.string().min(1) })

export async function PATCH(req: Request, { params }: { params: { id: string } }): Promise<Response> {
  const user = await getAuthenticatedUser()
  if (!user) return new Response('未授權', { status: 401 })
  const json = await req.json()
  const parsed = PatchSchema.safeParse(json)
  if (!parsed.success) return new Response('資料錯誤', { status: 400 })
  const list = await prisma.list.findUnique({ where: { id: params.id }, select: { ownerId: true } })
  if (!list || list.ownerId !== user.id) return new Response('清單不存在', { status: 404 })
  await prisma.list.update({ where: { id: params.id }, data: { title: parsed.data.title } })
  return new Response(null, { status: 204 })
}
