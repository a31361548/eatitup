import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/authOptions'
import { prisma } from '@/lib/prisma'
import { PageShell } from '@/components/ui/PageShell'
import { GlowCard } from '@/components/ui/GlowCard'

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
    <PageShell className="space-y-10">
      <header className="space-y-2 text-white">
        <p className="text-sm text-white/60">歡迎 {user.name ?? session.user.email}</p>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold">我的餐點清單</h1>
            <p className="text-white/60">建立多個情境，將常用選項與權重一次管理。</p>
          </div>
          <Link className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-white/30" href="/lists/new">
            新增清單
          </Link>
        </div>
      </header>
      {lists.length === 0 ? (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center text-white/70">
          尚未建立任何清單，馬上新增第一份候選列表吧！
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {lists.map((list) => {
            const expanded = list.items.flatMap((item) => Array.from({ length: item.weight }, () => item.label))
            const qs = encodeURIComponent(expanded.join(','))
            return (
              <GlowCard
                key={list.id}
                title={list.title}
                description={`共 ${list.items.length} 個項目`}
                actions={
                  <>
                    <Link className="rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-slate-900" href={`/lists/${list.id}`}>
                      管理
                    </Link>
                    <Link className="rounded-full border border-white/40 px-4 py-1.5 text-sm text-white/80" href={`/modes/wheel?items=${qs}`}>
                      直接轉盤
                    </Link>
                  </>
                }
              >
                <p className="text-sm text-white/60">
                  最近更新：{new Intl.DateTimeFormat('zh-TW', { dateStyle: 'medium', timeStyle: 'short' }).format(list.updatedAt)}
                </p>
              </GlowCard>
            )
          })}
        </div>
      )}
    </PageShell>
  )
}
