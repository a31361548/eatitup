import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getAuthenticatedUser } from '@/lib/currentUser'
import { PageShell } from '@/components/ui/PageShell'
import { TodosClient } from '@/components/todos/TodosClient'
import type { Todo } from '@/types/todo'

const MIN_OFFSET_MINUTES = 5

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

export default async function TodosPage(): Promise<React.ReactElement> {
  const user = await getAuthenticatedUser()
  if (!user) redirect('/login')
  const todos = await prisma.todo.findMany({
    where: { userId: user.id },
    orderBy: [{ startAt: 'asc' }, { createdAt: 'desc' }],
  })
  return (
    <PageShell className="space-y-8">
      <section className="border-4 border-aether-teal bg-[#031f1f]/95 p-6 text-aether-mint shadow-pixel-card">
        <p className="font-pixel text-pixel-xs uppercase tracking-pixel-wider text-aether-cyan">Task Console</p>
        <h1 className="mt-2 font-header text-3xl text-white tracking-pixel-wide">待辦任務控制室</h1>
        <p className="mt-3 font-pixel text-pixel-sm text-aether-mint/70">
          系統會確保開始時間不得早於現在，結束時間需至少延後 {MIN_OFFSET_MINUTES} 分鐘。
        </p>
      </section>

      <div>
        <TodosClient initialTodos={serializeTodos(todos)} />
      </div>
    </PageShell>
  )
}
