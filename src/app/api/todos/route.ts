import { prisma } from '@/lib/prisma'
import { getAuthenticatedUser } from '@/lib/currentUser'
import { TodoStatus } from '@prisma/client'
import { z } from 'zod'

const MIN_END_OFFSET_MS = 5 * 60 * 1000
const DEFAULT_DURATION_MS = 30 * 60 * 1000

const TodoPayloadSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  startAt: z.string().datetime().optional(),
  endAt: z.string().datetime().optional(),
  status: z.nativeEnum(TodoStatus).optional(),
})

const toDateOrNull = (value?: string): Date | null => {
  if (!value) return null
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return null
  return parsed
}

const buildTimeRange = (start?: string, end?: string): { startAt: Date; endAt: Date } | null => {
  const now = new Date()
  const parsedStart = toDateOrNull(start) ?? now
  if (parsedStart.getTime() < now.getTime()) return null
  const parsedEnd = toDateOrNull(end) ?? new Date(parsedStart.getTime() + DEFAULT_DURATION_MS)
  if (parsedEnd.getTime() - parsedStart.getTime() < MIN_END_OFFSET_MS) return null
  return { startAt: parsedStart, endAt: parsedEnd }
}

export async function GET(): Promise<Response> {
  const user = await getAuthenticatedUser()
  if (!user) return new Response('未授權', { status: 401 })
  const todos = await prisma.todo.findMany({
    where: { userId: user.id },
    orderBy: [{ startAt: 'asc' }, { createdAt: 'desc' }],
  })
  return new Response(JSON.stringify({ todos }), { status: 200, headers: { 'Content-Type': 'application/json' } })
}

export async function POST(request: Request): Promise<Response> {
  const user = await getAuthenticatedUser()
  if (!user) return new Response('未授權', { status: 401 })
  const json = await request.json().catch(() => null)
  const parsed = TodoPayloadSchema.safeParse(json)
  if (!parsed.success) return new Response('資料格式錯誤', { status: 400 })
  const timeRange = buildTimeRange(parsed.data.startAt, parsed.data.endAt)
  if (!timeRange) return new Response('時間設定不正確', { status: 400 })
  const todo = await prisma.todo.create({
    data: {
      title: parsed.data.title,
      description: parsed.data.description,
      status: parsed.data.status ?? TodoStatus.NOT_STARTED,
      startAt: timeRange.startAt,
      endAt: timeRange.endAt,
      userId: user.id,
    },
  })
  return new Response(JSON.stringify({ todo }), { status: 201, headers: { 'Content-Type': 'application/json' } })
}
