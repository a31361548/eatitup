import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthenticatedUser } from '@/lib/currentUser'

export async function GET(_req: NextRequest) {
  const user = await getAuthenticatedUser()
  if (!user) return new NextResponse('Unauthorized', { status: 401 })

  const checkIns = await prisma.checkIn.findMany({
    where: { userId: user.id },
    select: { date: true },
  })

  return NextResponse.json({ dates: checkIns.map((c) => c.date) })
}

export async function POST(_req: NextRequest) {
  const user = await getAuthenticatedUser()
  if (!user) return new NextResponse('Unauthorized', { status: 401 })

  const today = new Date().toISOString().split('T')[0]

  try {
    await prisma.checkIn.create({
      data: {
        userId: user.id,
        date: today,
      },
    })
    return NextResponse.json({ success: true, date: today })
  } catch (error) {
    // Unique constraint violation means already checked in
    return NextResponse.json({ success: false, message: 'Already checked in' })
  }
}
