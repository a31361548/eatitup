import Link from 'next/link'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getAuthenticatedUser } from '@/lib/currentUser'
import { PageShell } from '@/components/ui/PageShell'
import { TodoDetailClient } from '@/components/todos/TodoDetailClient'
import type { Todo } from '@/types/todo'

type PageProps = {
  params: { id: string }
}

const serializeTodo = (todo: NonNullable<Awaited<ReturnType<typeof prisma.todo.findFirst>>>): Todo => ({
  id: todo.id,
  title: todo.title,
  description: todo.description,
  status: todo.status,
  startAt: todo.startAt.toISOString(),
  endAt: todo.endAt.toISOString(),
  createdAt: todo.createdAt.toISOString(),
  updatedAt: todo.updatedAt.toISOString(),
})

export default async function TodoDetailPage({ params }: PageProps): Promise<React.ReactElement> {
  const user = await getAuthenticatedUser()
  if (!user) redirect('/login')
  const todo = await prisma.todo.findFirst({ where: { id: params.id, userId: user.id } })
  if (!todo) redirect('/dashboard/todos')
  return (
    <PageShell className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-4 border-aether-teal bg-[#031f1f]/95 p-6 text-aether-mint shadow-pixel-card">
        <div className="font-pixel text-pixel-xs uppercase tracking-pixel-wider text-aether-cyan">
          <p>Quick Edit</p>
          <p className="mt-2 text-base tracking-pixel-normal text-white">編輯待辦</p>
          <p className="mt-2 text-pixel-sm text-aether-mint/70">快速調整任務內容與狀態，系統仍會套用時間限制。</p>
        </div>
        <Link
          href="/dashboard/todos"
          className="border-2 border-aether-cyan px-4 py-2 font-pixel text-pixel-xs uppercase tracking-pixel-wider text-aether-cyan hover:bg-aether-cyan hover:text-aether-dark transition"
        >
          返回待辦清單
        </Link>
      </div>

      <TodoDetailClient initialTodo={serializeTodo(todo)} />
    </PageShell>
  )
}
