import { NextRequest, NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { getAuthenticatedUser } from '@/lib/currentUser'

const CHECK_IN_REWARD = 5

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
    const updatedCoins = await prisma.$transaction(async (tx) => {
      await tx.checkIn.create({
        data: {
          userId: user.id,
          date: today,
        },
      })
      const updatedUser = await tx.user.update({
        where: { id: user.id },
        data: { coins: { increment: CHECK_IN_REWARD } },
        select: { coins: true },
      })
      return updatedUser.coins
    })
    return NextResponse.json({ success: true, date: today, reward: CHECK_IN_REWARD, coins: updatedCoins })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return NextResponse.json({ success: false, message: '今天已簽到' })
    }
    console.error('Check-in failed', error)
    return NextResponse.json({ success: false, message: '簽到失敗' }, { status: 500 })
  }
}
