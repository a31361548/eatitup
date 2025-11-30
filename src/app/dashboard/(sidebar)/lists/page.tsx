import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/authOptions'
import { prisma } from '@/lib/prisma'
import { HoloWindow } from '@/components/ui/HoloWindow'
import { TechButton } from '@/components/ui/TechButton'
import { DeleteListButton } from '@/components/DeleteListButton'

export default async function ListsPage(): Promise<React.ReactElement> {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) redirect('/login')
  const user = await prisma.user.findUnique({ where: { email: session.user.email }, select: { id: true, name: true } })
  if (!user) redirect('/login')
  const lists = await prisma.list.findMany({
    where: { ownerId: user.id },
    include: { items: true },
    orderBy: { updatedAt: 'desc' },
  })

  const totalItems = lists.reduce((sum, list) => sum + list.items.length, 0)
  const lastUpdate = lists[0]?.updatedAt

  return (
    <HoloWindow
      title="ORACLE ARCHIVE"
      className="h-full"
      controls={
        <div className="flex gap-2">
          <Link href="/dashboard">
            <TechButton variant="ghost" className="!px-4 !py-2 text-[11px]">
              控制台
            </TechButton>
          </Link>
          <Link href="/dashboard/lists/new">
            <TechButton variant="primary" className="!px-4 !py-2 text-[11px]">
              新建卷軸
            </TechButton>
          </Link>
        </div>
      }
    >
      <div className="space-y-10">
        <section className="rounded-[40px] border border-white/10 bg-gradient-to-br from-white/10 via-transparent to-black/20 p-6 text-white shadow-[0_25px_90px_rgba(0,0,0,0.45)]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-tech uppercase tracking-[0.45em] text-white/60">Oracle Protocols</p>
              <h1 className="font-pixel text-pixel-2xl uppercase tracking-[0.35em]">命運卷軸庫</h1>
              <p className="mt-2 text-sm text-white/70">
                收納所有用於輪盤的資料卷軸，管理與啟動都在這裡完成。
              </p>
            </div>
            <div className="text-xs font-tech uppercase tracking-[0.4em] text-white/60">
              {lastUpdate ? `最後更新 ${lastUpdate.toLocaleDateString('zh-TW')}` : '尚未建立卷軸'}
            </div>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/20 bg-black/30 p-4 text-center">
              <p className="text-[10px] font-tech uppercase tracking-[0.4em] text-white/60">卷軸總數</p>
              <p className="mt-2 text-3xl font-mono">{lists.length}</p>
            </div>
            <div className="rounded-2xl border border-white/20 bg-black/30 p-4 text-center">
              <p className="text-[10px] font-tech uppercase tracking-[0.4em] text-white/60">素材總量</p>
              <p className="mt-2 text-3xl font-mono text-cyan-200">{totalItems}</p>
            </div>
            <div className="rounded-2xl border border-white/20 bg-black/30 p-4 text-center">
              <p className="text-[10px] font-tech uppercase tracking-[0.4em] text-white/60">可啟動輪盤</p>
              <p className="mt-2 text-3xl font-mono text-emerald-200">{lists.filter((list) => list.items.length > 0).length}</p>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          {lists.length === 0 ? (
            <div className="rounded-[32px] border border-dashed border-white/20 bg-black/30 p-12 text-center text-white/60">
              尚未建立任何卷軸，點擊右上角「新建卷軸」開始。
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-2 2xl:grid-cols-3">
              {lists.map((list) => {
                const expanded = list.items.flatMap((item) => Array.from({ length: item.weight }, () => item.label))
                const qs = encodeURIComponent(expanded.join(','))
                return (
                  <article
                    key={list.id}
                    className="group relative overflow-hidden rounded-[30px] border border-white/10 bg-black/25 p-5 text-white shadow-[0_20px_60px_rgba(0,0,0,0.45)] transition hover:border-cyan-200/60"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-tech uppercase tracking-[0.4em] text-white/60">ID {list.id.slice(0, 6)}</p>
                        <h2 className="text-2xl font-heading">{list.title}</h2>
                        <p className="text-sm text-white/60">項目 {list.items.length}</p>
                      </div>
                      <span className="rounded-full border border-white/20 px-3 py-1 text-xs text-white/60">
                        {new Intl.DateTimeFormat('zh-TW', { month: '2-digit', day: '2-digit' }).format(list.updatedAt)}
                      </span>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2 text-xs text-white/80">
                      {list.items.slice(0, 6).map((item) => (
                        <span key={item.id} className="rounded-2xl border border-white/10 bg-white/5 px-3 py-1 font-tech text-[11px]">
                          {item.label} <span className="text-white/50">x{item.weight}</span>
                        </span>
                      ))}
                      {list.items.length > 6 && <span className="text-white/40">…</span>}
                    </div>
                    <div className="mt-5 flex flex-wrap gap-3 border-t border-white/10 pt-4">
                      <Link href={`/dashboard/lists/${list.id}`} className="flex-1">
                        <TechButton variant="secondary" className="w-full !px-4 !py-2 text-[11px]">
                          編輯
                        </TechButton>
                      </Link>
                      <Link href={`/modes/wheel?items=${qs}`} className="flex-1">
                        <TechButton variant="primary" className="w-full !px-4 !py-2 text-[11px]">
                          啟動輪盤
                        </TechButton>
                      </Link>
                      <div className="flex-none">
                        <DeleteListButton listId={list.id} />
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </section>
      </div>
    </HoloWindow>
  )
}
