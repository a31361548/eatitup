import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthenticatedUser } from '@/lib/currentUser'
import { z } from 'zod'

const AvatarSchema = z.object({
  avatar: z.string().min(1),
})

export async function PATCH(req: NextRequest) {
  const user = await getAuthenticatedUser()
  if (!user) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const json = await req.json()
  const parsed = AvatarSchema.safeParse(json)
  if (!parsed.success) {
    return new NextResponse('Invalid data', { status: 400 })
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { avatar: parsed.data.avatar },
  })

  return new NextResponse(null, { status: 204 })
}
