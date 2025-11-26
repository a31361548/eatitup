import { prisma } from '@/lib/prisma'
import { getAuthenticatedUser } from '@/lib/currentUser'
import { TodoStatus } from '@prisma/client'
import { z } from 'zod'

const MIN_END_OFFSET_MS = 5 * 60 * 1000

const TodoUpdateSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  startAt: z.string().datetime().optional(),
  endAt: z.string().datetime().optional(),
  status: z.nativeEnum(TodoStatus).optional(),
})

type RouteContext = { params: { id: string } }

const toDateOrNull = (value?: string): Date | null => {
  if (!value) return null
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return null
  return parsed
}

const buildUpdatedTimeRange = (
  existingStart: Date,
  existingEnd: Date,
  start?: string,
  end?: string
): { startAt: Date; endAt: Date } | null => {
  const now = new Date()
  const startAt = start ? toDateOrNull(start) : existingStart
  const endAt = end ? toDateOrNull(end) : existingEnd
  if (!startAt || !endAt) return null
  if (start && startAt.getTime() < now.getTime()) return null
  if (endAt.getTime() - startAt.getTime() < MIN_END_OFFSET_MS) return null
  return { startAt, endAt }
}

const getTodoOrThrow = async (userId: string, id: string) => {
  const todo = await prisma.todo.findFirst({ where: { id, userId } })
  if (!todo) throw new Response('找不到待辦', { status: 404 })
  return todo
}

export async function GET(_: Request, context: RouteContext): Promise<Response> {
  const user = await getAuthenticatedUser()
  if (!user) return new Response('未授權', { status: 401 })
  try {
    const todo = await getTodoOrThrow(user.id, context.params.id)
    return new Response(JSON.stringify({ todo }), { status: 200, headers: { 'Content-Type': 'application/json' } })
  } catch (error) {
    if (error instanceof Response) return error
    return new Response('系統錯誤', { status: 500 })
  }
}

export async function PATCH(request: Request, context: RouteContext): Promise<Response> {
  const user = await getAuthenticatedUser()
  if (!user) return new Response('未授權', { status: 401 })
  const json = await request.json().catch(() => null)
  const parsed = TodoUpdateSchema.safeParse(json)
  if (!parsed.success) return new Response('資料格式錯誤', { status: 400 })
  try {
    const existing = await getTodoOrThrow(user.id, context.params.id)
    const timeRange = buildUpdatedTimeRange(existing.startAt, existing.endAt, parsed.data.startAt, parsed.data.endAt)
    if (!timeRange) return new Response('時間設定不正確', { status: 400 })
    const todo = await prisma.todo.update({
      where: { id: existing.id },
      data: {
        title: parsed.data.title ?? existing.title,
        description: parsed.data.description ?? existing.description,
        status: parsed.data.status ?? existing.status,
        startAt: timeRange.startAt,
        endAt: timeRange.endAt,
      },
    })
    return new Response(JSON.stringify({ todo }), { status: 200, headers: { 'Content-Type': 'application/json' } })
  } catch (error) {
    if (error instanceof Response) return error
    return new Response('系統錯誤', { status: 500 })
  }
}

export async function DELETE(_: Request, context: RouteContext): Promise<Response> {
  const user = await getAuthenticatedUser()
  if (!user) return new Response('未授權', { status: 401 })
  try {
    const todo = await getTodoOrThrow(user.id, context.params.id)
    await prisma.todo.delete({ where: { id: todo.id } })
    return new Response(null, { status: 204 })
  } catch (error) {
    if (error instanceof Response) return error
    return new Response('系統錯誤', { status: 500 })
  }
}
