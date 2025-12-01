import { getAuthenticatedUser } from '@/lib/currentUser'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { CommandAtrium } from '@/components/dashboard/CommandAtrium'
import { type Todo } from '@/types/todo'

// Force dynamic rendering to ensure fresh data on every request
export const dynamic = 'force-dynamic'

const serializeTodos = (todos: Awaited<ReturnType<typeof prisma.todo.findMany>>): Todo[] =>
  todos.map((todo) => ({
    id: todo.id,
    title: todo.title,
    description: todo.description,
    status: todo.status,
    startAt: todo.startAt.toISOString(),
    endAt: todo.endAt.toISOString(),
    createdAt: todo.createdAt.toISOString(),
    updatedAt: todo.updatedAt.toISOString(),
  }))

export default async function DashboardPage() {
  const user = await getAuthenticatedUser()
  if (!user) redirect('/login')

  const latestTodos = await prisma.todo.findMany({
    where: { userId: user.id, status: { not: 'COMPLETED' } },
    orderBy: [{ startAt: 'asc' }, { createdAt: 'desc' }],
    take: 5,
  })
  const serializedTodos = serializeTodos(latestTodos)

  return (
    <CommandAtrium user={user} todos={serializedTodos} variant="command" />
  )
}
