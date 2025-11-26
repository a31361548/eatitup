import Link from 'next/link'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getAuthenticatedUser } from '@/lib/currentUser'
import { CheckInCalendar } from '@/components/CheckInCalendar'
import { PageShell } from '@/components/ui/PageShell'
import { TODO_STATUS_LABEL, TODO_STATUS_TONE, type Todo } from '@/types/todo'
import clsx from 'clsx'

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

const formatDateTime = (value: string): string => {
  const date = new Date(value)
  return new Intl.DateTimeFormat('zh-TW', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

export default async function DashboardHomePage(): Promise<React.ReactElement> {
  const user = await getAuthenticatedUser()
  if (!user) redirect('/login')
  const latestTodos = await prisma.todo.findMany({
    where: { userId: user.id },
    orderBy: [{ startAt: 'asc' }, { createdAt: 'desc' }],
    take: 5,
  })
  const serializedTodos = serializeTodos(latestTodos)
  const displayName = user.name || user.email

  return (
    <PageShell className="space-y-8">
      <section className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <div className="border-4 border-aether-teal bg-[#031f1f]/95 p-6 text-aether-mint shadow-pixel-card">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
            <div className="h-28 w-28 border-2 border-aether-cyan">
              {user.avatar ? (
                <img src={user.avatar} alt={displayName ?? 'User'} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-4xl">👤</div>
              )}
            </div>
            <div className="space-y-3 font-pixel">
              <p className="text-pixel-sm uppercase tracking-pixel-wider text-aether-cyan">Aether Command Center</p>
              <h1 className="text-pixel-2xl text-white tracking-pixel-normal">歡迎回來，{displayName}</h1>
              <div className="flex flex-wrap gap-4 text-pixel-sm uppercase tracking-pixel-wider text-aether-mint/70">
                <span>Coins {String(user.coins ?? 0).padStart(4, '0')}</span>
                <span>Last Login {formatDateTime(user.updatedAt.toISOString())}</span>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/dashboard/todos"
                  className="border-2 border-aether-teal px-5 py-3 text-pixel-sm uppercase tracking-pixel-wider text-aether-teal hover:bg-aether-teal hover:text-aether-dark transition"
                >
                  控制室
                </Link>
                <Link
                  href="/dashboard/todos"
                  className="border-2 border-aether-gold px-5 py-3 text-pixel-sm uppercase tracking-pixel-wider text-aether-gold hover:bg-aether-gold hover:text-aether-dark transition"
                >
                  新建待辦
                </Link>
              </div>
            </div>
          </div>
        </div>
        <CheckInCalendar />
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <div className="border-4 border-aether-cyan bg-[#031919] p-6 shadow-pixel-card">
          <p className="font-pixel text-pixel-sm uppercase tracking-[0.4em] text-aether-cyan">Quick Actions</p>
          <div className="mt-5 grid gap-4">
            <Link
              href="/dashboard/todos"
              className="border-2 border-aether-teal px-5 py-4 text-center font-pixel text-pixel-base uppercase tracking-pixel-wide text-aether-teal hover:bg-aether-teal/20 transition"
            >
              管理待辦
            </Link>
            <Link
              href="/dashboard/notes"
              className="border-2 border-aether-cyan px-5 py-4 text-center font-pixel text-pixel-base uppercase tracking-pixel-wide text-aether-cyan hover:bg-aether-cyan/20 transition"
            >
              開啟記事本
            </Link>
            <Link
              href="/modes/wheel"
              className="border-2 border-aether-gold px-5 py-4 text-center font-pixel text-pixel-base uppercase tracking-pixel-wide text-aether-gold hover:bg-aether-gold/20 transition"
            >
              命運輪盤
            </Link>
          </div>
        </div>
        <div className="border-4 border-aether-teal bg-[#031f1f]/95 p-6 shadow-pixel-card">
          <p className="font-pixel text-pixel-sm uppercase tracking-pixel-wider text-aether-cyan">System Status</p>
          <ul className="mt-5 space-y-3 font-pixel text-pixel-sm text-aether-mint/70">
            <li className="flex items-center justify-between border-b border-aether-dim pb-2">
              <span>Server</span>
              <span className="text-aether-teal">ONLINE</span>
            </li>
            <li className="flex items-center justify-between border-b border-aether-dim pb-2">
              <span>Tasks</span>
              <span className="text-aether-gold">{serializedTodos.length}</span>
            </li>
            <li className="flex items-center justify-between">
              <span>Version</span>
              <span>V2.0.4</span>
            </li>
          </ul>
        </div>
      </section>

      <section className="border-4 border-aether-teal bg-[#031f1f]/95 p-6 text-aether-mint shadow-pixel-card">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-2">
            <p className="font-pixel text-pixel-sm uppercase tracking-pixel-wider text-aether-cyan">Recent Tasks</p>
            <h2 className="font-header text-header-xl text-white tracking-pixel-normal">近期五筆待辦</h2>
          </div>
          <Link
            href="/dashboard/todos"
            className="border-2 border-aether-cyan px-5 py-3 font-pixel text-pixel-sm uppercase tracking-pixel-wider text-aether-cyan hover:bg-aether-cyan hover:text-aether-dark transition"
          >
            查看全部
          </Link>
        </div>
        <div className="mt-6 space-y-4">
          {serializedTodos.length > 0 ? (
            serializedTodos.map((todo) => (
              <div key={todo.id} className="border-2 border-aether-dim px-5 py-4 hover:border-aether-cyan transition">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div className="space-y-1">
                    <h3 className="font-header text-header-lg text-white">{todo.title}</h3>
                    <p className="font-pixel text-pixel-sm text-aether-mint/70">開始：{formatDateTime(todo.startAt)}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className={clsx('border-2 px-4 py-2 font-pixel text-pixel-sm uppercase tracking-[0.3em]', TODO_STATUS_TONE[todo.status])}>
                      {TODO_STATUS_LABEL[todo.status]}
                    </span>
                    <Link
                      href={`/dashboard/todos/${todo.id}`}
                      className="border-2 border-aether-cyan px-4 py-2 font-pixel text-pixel-sm uppercase tracking-[0.3em] text-aether-cyan hover:bg-aether-cyan hover:text-aether-dark transition"
                    >
                      編輯
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="border-2 border-dashed border-aether-dim px-5 py-8 text-center font-pixel text-pixel-base text-aether-mint/60">
              尚無待辦，立刻建立你的第一個任務吧！
            </div>
          )}
        </div>
      </section>
    </PageShell>
  )
}
