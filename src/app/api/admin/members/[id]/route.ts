import { prisma } from '@/lib/prisma'
import { getAuthenticatedUser } from '@/lib/currentUser'
import { MemberStatus } from '@prisma/client'
import { z } from 'zod'

const UpdateSchema = z.object({
  email: z.string().email().optional(),
  name: z.string().min(1).optional(),
  note: z.string().max(500).nullable().optional(),
  status: z.nativeEnum(MemberStatus).optional()
})

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }): Promise<Response> {
  const admin = await getAuthenticatedUser({ requireAdmin: true })
  if (!admin) return new Response('未授權', { status: 401 })
  
  // Await params for Next.js 15+
  const { id } = await params
  
  const json = await req.json().catch(() => null)
  const parsed = UpdateSchema.safeParse(json)
  if (!parsed.success) {
    return new Response(JSON.stringify(parsed.error.flatten()), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    })
  }
  try {
    const member = await prisma.user.update({
      where: { id },
      data: {
        email: parsed.data.email,
        name: parsed.data.name,
        note: parsed.data.note ?? undefined,
        status: parsed.data.status
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
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch {
    return new Response(JSON.stringify({ error: '更新失敗' }), { status: 500, headers: { 'Content-Type': 'application/json' } })
  }
}
