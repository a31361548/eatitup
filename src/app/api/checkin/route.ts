// src/app/api/checkin/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { getAuthenticatedUser } from '@/lib/currentUser'

const CHECK_IN_REWARD = 5

// 取得使用者已簽到的日期列表
export async function GET(_req: NextRequest) {
  const user = await getAuthenticatedUser()
  if (!user) return new NextResponse('Unauthorized', { status: 401 })

  const checkIns = await prisma.checkIn.findMany({
    where: { userId: user.id },
    select: { date: true },
  })

  return NextResponse.json({ dates: checkIns.map((c) => c.date) })
}

// 簽到 API
export async function POST(_req: NextRequest) {
  const user = await getAuthenticatedUser()
  if (!user) return new NextResponse('Unauthorized', { status: 401 })

  // 使用本地時區（台灣 UTC+8）計算今天的日期
  const now = new Date()
  const localDate = new Date(now.getTime() + 8 * 60 * 60 * 1000) // UTC+8
  const today = localDate.toISOString().split('T')[0]

  try {
    const updatedCoins = await prisma.$transaction(async (tx) => {
      // 建立簽到紀錄
      await tx.checkIn.create({
        data: {
          userId: user.id,
          date: today,
        },
      })

      // 取得使用者目前的 coin 數量
      const dbUser = await tx.user.findUnique({
        where: { id: user.id },
        select: { coins: true },
      })
      const currentCoins = dbUser?.coins ?? 0
      const newCoins = currentCoins + CHECK_IN_REWARD

      // 更新 coin 數量
      const updatedUser = await tx.user.update({
        where: { id: user.id },
        data: { coins: newCoins },
        select: { coins: true },
      })
      return updatedUser.coins
    })

    return NextResponse.json({ success: true, date: today, reward: CHECK_IN_REWARD, coins: updatedCoins })
  } catch (error) {
    // 若已經簽到過（唯一索引衝突）
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return NextResponse.json({ success: false, message: '今天已簽到' })
    }
    console.error('Check-in failed', error)
    return NextResponse.json({ success: false, message: '簽到失敗' }, { status: 500 })
  }
}
