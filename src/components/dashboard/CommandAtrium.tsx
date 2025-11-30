import Link from 'next/link'
import clsx from 'clsx'
import type { Todo } from '@/types/todo'
import { TODO_STATUS_LABEL, TODO_STATUS_TONE } from '@/types/todo'
import { PageShell } from '@/components/ui/PageShell'
import { TechButton } from '@/components/ui/TechButton'
import { CheckInCalendar } from '@/components/CheckInCalendar'

type CommandUser = {
  name: string | null
  email: string | null
  avatar: string | null
  coins: number | null
  updatedAt: Date
}

type CommandAtriumProps = {
  user: CommandUser
  todos: Todo[]
  variant?: 'command' | 'home'
}

const quickTiles = [
  { label: '任務控制', sub: 'Task Forge', href: '/dashboard/todos', icon: '⚔', tone: 'from-cyan-400/20 to-cyan-700/40' },
  { label: '資料卷軸', sub: 'Notes', href: '/dashboard/notes', icon: '✎', tone: 'from-emerald-300/20 to-emerald-600/30' },
  { label: '命運輪盤', sub: 'Wheel', href: '/modes/wheel', icon: '◎', tone: 'from-amber-300/20 to-amber-500/30' },
  { label: '隨機清單', sub: 'Lists', href: '/dashboard/lists', icon: '▤', tone: 'from-violet-300/15 to-blue-500/20' },
]

const variantCopy = {
  command: {
    badge: 'Temple Command',
    headline: '像素聖殿主控台',
    description: '整備任務、同步儀式與資源，在此統御整個 Aether 基地。',
  },
  home: {
    badge: 'Home Portal',
    headline: '個人聖殿儀式',
    description: '這裡是你的專屬儀式之地，所有進度、簽到與靈感都在此流動。',
  },
} as const

const formatDateTime = (value: string | Date): string => {
  const date = typeof value === 'string' ? new Date(value) : value
  return new Intl.DateTimeFormat('zh-TW', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

export function CommandAtrium({ user, todos, variant = 'command' }: CommandAtriumProps): React.ReactElement {
  const copy = variantCopy[variant]
  const displayName = user.name ?? user.email ?? 'AETHER PILOT'
  const coinDisplay = String(user.coins ?? 0).padStart(4, '0')
  const activeMissions = todos.filter((todo) => todo.status !== 'COMPLETED').length
  const idleMissions = todos.length - activeMissions
  const now = new Date()

  return (
    <PageShell className="space-y-20">
      <section className="grid gap-10 xl:grid-cols-[1.4fr_0.9fr]">
        <div className="relative overflow-hidden rounded-[44px] border-4 border-white/10 bg-gradient-to-br from-white/10 via-cyan-900/10 to-transparent p-8 text-white shadow-[0_40px_120px_rgba(0,0,0,0.4)]">
          <div className="absolute inset-0 opacity-70" aria-hidden>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(103,232,249,0.3),transparent_55%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_90%_10%,rgba(250,204,21,0.25),transparent_50%)]" />
            <div className="absolute inset-0 mix-blend-screen opacity-30" style={{ backgroundImage: 'linear-gradient(45deg, rgba(255,255,255,0.08) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
          </div>
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center">
            <div className="relative mx-auto flex h-32 w-32 items-center justify-center rounded-[36px] border-4 border-white/20 bg-white/10 p-2 shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
              {user.avatar ? (
                <img src={user.avatar} alt={displayName} className="h-full w-full rounded-[28px] object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center rounded-[28px] bg-black/40 text-4xl">👾</div>
              )}
              <div className="pointer-events-none absolute inset-2 rounded-[28px] border border-white/20" />
              <div className="pointer-events-none absolute -inset-3 rounded-[32px] border border-dashed border-cyan-300/40 animate-spin-slow" />
            </div>
            <div className="space-y-3 text-center lg:text-left">
              <p className="font-tech text-xs uppercase tracking-[0.45em] text-cyan-200/80">{copy.badge}</p>
              <h1 className="font-pixel text-pixel-2xl uppercase tracking-[0.3em]">{copy.headline}</h1>
              <p className="text-sm text-white/70">{copy.description}</p>
              <div className="flex flex-wrap justify-center gap-3 text-xs font-tech uppercase tracking-[0.4em] text-white/60 lg:justify-start">
                <span>司令官：{displayName}</span>
                <span>登入：{formatDateTime(user.updatedAt)}</span>
              </div>
            </div>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/20 bg-white/5 p-4 text-center">
              <p className="text-[10px] font-tech uppercase tracking-[0.4em] text-white/60">Ether Coins</p>
              <p className="mt-2 text-3xl font-mono tracking-widest text-amber-200">{coinDisplay}</p>
            </div>
            <div className="rounded-2xl border border-white/20 bg-white/5 p-4 text-center">
              <p className="text-[10px] font-tech uppercase tracking-[0.4em] text-white/60">Active Missions</p>
              <p className="mt-2 text-3xl font-mono tracking-widest text-cyan-200">{activeMissions}</p>
            </div>
            <div className="rounded-2xl border border-white/20 bg-white/5 p-4 text-center">
              <p className="text-[10px] font-tech uppercase tracking-[0.4em] text-white/60">Standby</p>
              <p className="mt-2 text-3xl font-mono tracking-widest text-white/80">{idleMissions}</p>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-3 lg:justify-start">
            <Link href="/dashboard/todos">
              <TechButton variant="primary" className="!px-6 !py-3">
                啟動任務
              </TechButton>
            </Link>
            <Link href="/dashboard/notes">
              <TechButton variant="secondary" className="!px-6 !py-3">
                開啟日誌
              </TechButton>
            </Link>
            <Link href="/dashboard/settings">
              <TechButton variant="ghost" className="!px-6 !py-3">
                設定儀式
              </TechButton>
            </Link>
          </div>
        </div>
        <div className="grid gap-6">
          <div className="rounded-[32px] border border-white/10 bg-white/5 p-6 text-sm text-white/80 shadow-[0_30px_70px_rgba(0,0,0,0.45)]">
            <div className="flex items-center justify-between text-[10px] font-tech uppercase tracking-[0.4em] text-white/60">
              <span>狀態同步</span>
              <span>{now.toLocaleDateString('zh-TW')}</span>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-xs uppercase text-white/60">神殿時間</p>
                <p className="mt-2 text-2xl font-mono">{now.toLocaleTimeString('en-US', { hour12: false })}</p>
                <p className="text-[11px] text-cyan-200/70">Nominal</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-xs uppercase text-white/60">能量脈衝</p>
                <p className="mt-2 text-2xl font-mono text-emerald-200">84%</p>
                <p className="text-[11px] text-emerald-200/70">Stable</p>
              </div>
            </div>
          </div>
          <div className="rounded-[32px] border border-white/10 bg-black/20 p-2 shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
            <CheckInCalendar />
          </div>
        </div>
      </section>

      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {quickTiles.map((tile) => (
          <Link
            key={tile.href}
            href={tile.href}
            className="group relative overflow-hidden rounded-[30px] border border-white/10 bg-gradient-to-br p-5 text-white shadow-[0_20px_60px_rgba(0,0,0,0.4)]"
            style={{ backgroundImage: `linear-gradient(135deg, rgba(255,255,255,0.05), transparent 65%), linear-gradient(120deg, rgba(6,182,212,0.1), transparent 70%)` }}
          >
            <div className={`absolute inset-0 opacity-0 transition group-hover:opacity-60 ${tile.tone}`} aria-hidden />
            <div className="relative z-10 space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-2xl">{tile.icon}</span>
                <span className="text-[10px] font-tech uppercase tracking-[0.4em] text-white/70">{tile.sub}</span>
              </div>
              <p className="font-pixel text-pixel-base uppercase tracking-[0.4em]">{tile.label}</p>
              <p className="text-xs text-white/70">進入 {tile.label}</p>
            </div>
          </Link>
        ))}
      </section>

      <section className="grid gap-10 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="rounded-[34px] border border-white/10 bg-black/30 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-tech uppercase tracking-[0.4em] text-white/60">最新儀式任務</p>
              <h2 className="font-pixel text-pixel-xl uppercase tracking-[0.35em]">MISSION LOG</h2>
            </div>
            <Link href="/dashboard/todos">
              <TechButton variant="ghost" className="!px-4 !py-2">
                查看全部
              </TechButton>
            </Link>
          </div>
          <div className="mt-6 space-y-4">
            {todos.length > 0 ? (
              todos.map((todo) => (
                <article key={todo.id} className="rounded-3xl border border-white/10 bg-white/5 p-4 transition hover:border-cyan-200/60 hover:bg-white/10">
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="text-sm font-tech uppercase tracking-[0.35em] text-white/60">ID: {todo.id.slice(0, 6)}</p>
                      <h3 className="text-2xl font-heading">{todo.title}</h3>
                      {todo.description && <p className="text-sm text-white/70">{todo.description}</p>}
                      <p className="mt-2 text-xs text-white/50">開始 {formatDateTime(todo.startAt)}</p>
                    </div>
                    <div className="flex flex-col items-end gap-3">
                      <span className={clsx('rounded-full border px-4 py-1 text-xs font-tech uppercase tracking-[0.35em]', TODO_STATUS_TONE[todo.status])}>
                        {TODO_STATUS_LABEL[todo.status]}
                      </span>
                      <Link href={`/dashboard/todos/${todo.id}`}>
                        <TechButton variant="secondary" className="!px-4 !py-2 text-[10px]">
                          編輯
                        </TechButton>
                      </Link>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="rounded-3xl border border-dashed border-white/20 p-12 text-center text-white/60">
                尚無任務，立即在上方啟動第一個儀式。
              </div>
            )}
          </div>
        </div>
        <div className="rounded-[34px] border border-white/10 bg-gradient-to-b from-white/10 to-transparent p-6 text-white shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
          <p className="text-xs font-tech uppercase tracking-[0.45em] text-white/60">Temple Broadcast</p>
          <h2 className="mt-2 font-pixel text-pixel-xl uppercase tracking-[0.3em]">SYSTEM LOG</h2>
          <ul className="mt-6 space-y-4 text-sm text-white/80">
            <li className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <p className="text-xs uppercase tracking-[0.4em] text-white/60">SERVER</p>
              <p className="text-lg text-emerald-200">ONLINE / SECURE</p>
              <p className="text-[11px] text-white/50">AES-256 / 零延遲通道</p>
            </li>
            <li className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <p className="text-xs uppercase tracking-[0.4em] text-white/60">ACTIVE ORDERS</p>
              <p className="text-lg">{activeMissions} / {todos.length}</p>
              <p className="text-[11px] text-white/50">包含進行中的所有任務</p>
            </li>
            <li className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <p className="text-xs uppercase tracking-[0.4em] text-white/60">LAST SYNC</p>
              <p className="text-lg">{formatDateTime(user.updatedAt)}</p>
              <p className="text-[11px] text-white/50">使用者狀態同步完成</p>
            </li>
          </ul>
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-xs uppercase tracking-[0.4em] text-white/70">
            如需新增成員或更改系統設定，請前往設定儀式區或成員管理模組。
          </div>
        </div>
      </section>
    </PageShell>
  )
}
