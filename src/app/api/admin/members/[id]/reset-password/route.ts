import { prisma } from '@/lib/prisma'
import { getAuthenticatedUser } from '@/lib/currentUser'
import { hashPassword } from '@/lib/password'
import { z } from 'zod'

const ResetSchema = z.object({ password: z.string().min(6) })

export async function POST(req: Request, { params }: { params: { id: string } }): Promise<Response> {
  const admin = await getAuthenticatedUser({ requireAdmin: true })
  if (!admin) return new Response('未授權', { status: 401 })
  const json = await req.json().catch(() => null)
  const parsed = ResetSchema.safeParse(json)
  if (!parsed.success) {
    return new Response(JSON.stringify(parsed.error.flatten()), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    })
  }
  try {
    await prisma.user.update({
      where: { id: params.id },
      data: { password: hashPassword(parsed.data.password) }
    })
    return new Response(null, { status: 204 })
  } catch {
    return new Response(JSON.stringify({ error: '重設失敗' }), { status: 500, headers: { 'Content-Type': 'application/json' } })
  }
}
