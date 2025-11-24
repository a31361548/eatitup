import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/authOptions'
import { prisma } from '@/lib/prisma'
import { PageShell } from '@/components/ui/PageShell'
import { DeleteListButton } from '@/components/DeleteListButton'

export default async function ListsPage(): Promise<React.ReactElement> {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) redirect('/login')
  const user = await prisma.user.findUnique({ where: { email: session.user.email }, select: { id: true, name: true } })
  if (!user) redirect('/login')
  const lists = await prisma.list.findMany({
    where: { ownerId: user.id },
    include: { items: true },
    orderBy: { updatedAt: 'desc' }
  })
  return (
    <PageShell className="relative space-y-12 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-cyan-500/5 via-transparent to-gold-500/5 opacity-80" />
      <div className="pointer-events-none absolute inset-0 bg-tech-grid-overlay opacity-20" />
      <header className="relative z-10 rounded-3xl border border-cyan-500/30 bg-void-900/70 p-8 shadow-glow-blue">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <p className="font-tech text-sm uppercase tracking-[0.5em] text-cyan-300/80">
              List Archives
            </p>
            <h1 className="text-4xl font-heading text-white drop-shadow">
              命運料理卷軸
            </h1>
            <p className="max-w-2xl text-white/70">
              {user.name ?? session.user.email}，在這裡集中管理你的日常選項。每份卷軸都可以設定權重，隨時呼叫命運之輪進行挑選。
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              className="clip-path-slant border border-white/20 px-6 py-3 font-tech text-sm uppercase tracking-widest text-white transition hover:border-cyan-400/50"
              href="/dashboard"
            >
              返回主控室
            </Link>
            <Link
              className="clip-path-slant bg-gradient-to-r from-gold-400 to-gold-600 px-6 py-3 font-tech text-sm uppercase tracking-widest text-void-900 shadow-glow-gold transition hover:shadow-[0_0_25px_rgba(251,191,36,0.5)]"
              href="/dashboard/lists/new"
            >
              新增卷軸
            </Link>
          </div>
        </div>
      </header>
      <section className="relative z-10">
        {lists.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-white/20 bg-void-900/60 p-12 text-center text-white/70 shadow-inner">
            <p className="text-2xl font-heading text-gold-400">尚無卷軸</p>
            <p className="mt-3 text-white/60">點擊右上角「新增卷軸」建立你的第一份命運清單。</p>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-2">
            {lists.map((list) => {
              const expanded = list.items.flatMap((item) => Array.from({ length: item.weight }, () => item.label))
              const qs = encodeURIComponent(expanded.join(','))
              return (
                <article
                  key={list.id}
                  className="group relative overflow-hidden rounded-[32px] border border-gold-500/20 bg-void-900/60 p-6 shadow-glow-gold"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-gold-500/10 via-transparent to-cyan-500/10 opacity-0 transition group-hover:opacity-100" />
                  <div className="relative z-10 flex flex-col gap-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-tech text-xs uppercase tracking-[0.4em] text-cyan-400/70">命運卷軸</p>
                        <h2 className="text-2xl font-heading text-white">{list.title}</h2>
                        <p className="text-sm text-white/60">共 {list.items.length} 個項目</p>
                      </div>
                      <span className="rounded-full border border-cyan-500/40 px-3 py-1 text-xs font-tech uppercase tracking-[0.3em] text-cyan-200">
                        更新於 {new Intl.DateTimeFormat('zh-TW', { month: 'short', day: 'numeric' }).format(list.updatedAt)}
                      </span>
                    </div>
                    {list.items.length > 0 ? (
                      <div className="flex flex-wrap gap-2 text-xs text-white/60">
                        {list.items.slice(0, 6).map((item) => (
                          <span key={item.id} className="rounded-full border border-white/10 px-3 py-1">
                            {item.label} × {item.weight}
                          </span>
                        ))}
                        {list.items.length > 6 && <span className="text-white/40">…</span>}
                      </div>
                    ) : (
                      <p className="text-sm text-white/50">尚未加入項目，建議先前往管理區新增。</p>
                    )}
                    <div className="flex flex-wrap gap-3">
                      <Link
                        className="clip-path-slant border border-white/20 px-4 py-2 font-tech text-xs uppercase tracking-[0.3em] text-white transition hover:border-gold-400"
                        href={`/dashboard/lists/${list.id}`}
                      >
                        管理卷軸
                      </Link>
                      <Link
                        className="clip-path-slant bg-cyan-500/20 px-4 py-2 font-tech text-xs uppercase tracking-[0.3em] text-cyan-300 transition hover:bg-cyan-500/40"
                        href={`/modes/wheel?items=${qs}`}
                      >
                        投入命運之輪
                      </Link>
                      <DeleteListButton listId={list.id} />
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </section>
    </PageShell>
  )
}
