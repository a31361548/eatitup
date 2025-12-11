import { prisma } from '@/lib/prisma'
import { getAuthenticatedUser } from '@/lib/currentUser'
import { z } from 'zod'
import { NextRequest, NextResponse } from 'next/server'

const PatchSchema = z.object({ title: z.string().min(1) })

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }): Promise<Response> {
  const user = await getAuthenticatedUser()
  if (!user) return new Response('未授權', { status: 401 })
  
  // Await params for Next.js 15+
  const { id } = await params
  
  const json = await req.json()
  const parsed = PatchSchema.safeParse(json)
  if (!parsed.success) return new Response('資料錯誤', { status: 400 })
  const list = await prisma.list.findUnique({ where: { id }, select: { ownerId: true } })
  if (!list || list.ownerId !== user.id) return new Response('清單不存在', { status: 404 })
  await prisma.list.update({ where: { id }, data: { title: parsed.data.title } })
  return new Response(null, { status: 204 })
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getAuthenticatedUser()
  if (!user) return new NextResponse('未授權', { status: 401 })

  // Await params for Next.js 15+
  const { id } = await params

  const list = await prisma.list.findUnique({ where: { id }, select: { ownerId: true } })
  if (!list || list.ownerId !== user.id) return new NextResponse('清單不存在', { status: 404 })

  await prisma.item.deleteMany({ where: { listId: id } })
  await prisma.list.delete({ where: { id } })

  return new NextResponse(null, { status: 204 })
}
