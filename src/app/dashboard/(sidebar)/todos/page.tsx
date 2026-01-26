import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getAuthenticatedUser } from '@/lib/currentUser'
import { HoloWindow } from '@/components/ui/HoloWindow'
import { TodosClient } from '@/components/todos/TodosClient'
import type { Todo } from '@/types/todo'
import clsx from 'clsx'

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
  const total = todos.length
  const active = todos.filter((todo) => todo.status !== 'COMPLETED').length
  const upcoming = todos.filter((todo) => todo.status === 'NOT_STARTED').length
  const completed = total - active
  const stats = [
    { label: '進行中', sublabel: 'ACTIVE', value: active, accent: 'text-cyan-200', border: 'border-cyan-500/50' },
    { label: '待命', sublabel: 'UPCOMING', value: upcoming, accent: 'text-amber-200', border: 'border-amber-400/40' },
    { label: '已完成', sublabel: 'COMPLETED', value: completed, accent: 'text-emerald-200', border: 'border-emerald-400/40' },
  ]
  return (
    <HoloWindow title="任務鍛造 / RITUAL TASK FORGE" className="h-full">
      <div className="space-y-10">
        <section className="rounded-[40px] border border-white/10 bg-gradient-to-br from-white/10 via-transparent to-black/30 p-6 text-white shadow-[0_30px_90px_rgba(0,0,0,0.45)]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-tech uppercase tracking-[0.45em] text-white/60">任務協調中心 / AETHER MISSION SUITE</p>
              <h1 className="font-pixel text-pixel-2xl uppercase tracking-[0.35em]">待辦儀式控制室</h1>
              <p className="mt-2 text-sm text-white/70">定義新的任務、調整時序並監控所有進行中的儀式。</p>
            </div>
            <a href="#task-form" className="text-xs font-tech uppercase tracking-[0.4em] text-white/60 hover:text-white">
              系統協議：立即啟動 {'>'} 現在 | +{MIN_OFFSET_MINUTES} 分
            </a>
            <p className="text-[10px] font-tech uppercase tracking-[0.3em] text-white/40">點擊可快速建立任務</p>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.label} className={clsx('rounded-2xl border bg-black/30 p-4 text-center', stat.border)}>
                <p className="text-[10px] font-tech uppercase tracking-[0.4em] text-white/60">
                  {stat.label} / {stat.sublabel}
                </p>
                <p className={clsx('mt-2 text-3xl font-mono', stat.accent)}>{stat.value}</p>
              </div>
            ))}
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-center">
              <p className="text-[10px] font-tech uppercase tracking-[0.4em] text-white/60">總計 / TOTAL</p>
              <p className="mt-2 text-3xl font-mono text-white/80">{total}</p>
            </div>
          </div>
        </section>

        <TodosClient initialTodos={serializeTodos(todos)} />
      </div>
    </HoloWindow>
  )
}
