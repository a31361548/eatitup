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
      {/* Background Effects */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-aether-cyan/5 via-transparent to-aether-cyan/5 opacity-50" />
      <div className="pointer-events-none absolute inset-0 bg-tech-grid-overlay opacity-20" />
      
      <header className="relative z-10 rounded-lg border border-aether-cyan/30 bg-[#041C1C]/80 p-8 shadow-[0_0_30px_rgba(103,232,249,0.15)] backdrop-blur-md">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <p className="font-tech text-sm uppercase tracking-[0.5em] text-aether-cyan/80 animate-pulse">
              System Database
            </p>
            <h1 className="text-4xl font-header text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
              命運演算法
            </h1>
            <p className="max-w-3xl text-aether-mint/80 font-tech tracking-wide">
              {user.name ?? session.user.email}，這些是您的決策協定模組。每個模組都包含加權參數，可隨時載入至主核心進行隨機運算。
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              className="clip-path-slant border border-aether-cyan/30 px-6 py-3 font-tech text-sm uppercase tracking-widest text-aether-cyan transition hover:bg-aether-cyan/10 hover:border-aether-cyan hover:shadow-[0_0_15px_rgba(103,232,249,0.3)]"
              href="/dashboard"
            >
              返回控制台
            </Link>
            <Link
              className="clip-path-slant bg-aether-cyan px-6 py-3 font-tech text-sm uppercase tracking-widest text-aether-dark font-bold shadow-[0_0_15px_rgba(103,232,249,0.4)] transition hover:bg-white hover:shadow-[0_0_25px_rgba(103,232,249,0.6)]"
              href="/dashboard/lists/new"
            >
              編譯新模組
            </Link>
          </div>
        </div>
      </header>

      <section className="relative z-10">
        {lists.length === 0 ? (
          <div className="rounded-lg border border-dashed border-aether-cyan/30 bg-[#041C1C]/60 p-12 text-center text-aether-cyan/50 shadow-inner">
            <div className="w-16 h-16 mx-auto border-2 border-dashed border-aether-cyan/30 rounded-full animate-spin-slow mb-4" />
            <p className="text-2xl font-tech tracking-widest text-aether-cyan">NO ALGORITHMS FOUND</p>
            <p className="mt-3 text-aether-mint/60 font-pixel">請點擊右上角「編譯新模組」以建立您的第一個決策協定。</p>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-2 2xl:grid-cols-3">
            {lists.map((list) => {
              const expanded = list.items.flatMap((item) => Array.from({ length: item.weight }, () => item.label))
              const qs = encodeURIComponent(expanded.join(','))
              return (
                <article
                  key={list.id}
                  className="group relative overflow-hidden rounded-lg border border-aether-cyan/20 bg-[#041C1C]/80 p-6 shadow-[0_0_15px_rgba(0,0,0,0.5)] transition-all duration-300 hover:border-aether-cyan/60 hover:shadow-[0_0_25px_rgba(103,232,249,0.15)] hover:-translate-y-1"
                >
                  {/* Holographic Scanline */}
                  <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(103,232,249,0.02)_50%)] bg-[length:100%_4px] pointer-events-none" />
                  <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-aether-cyan/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="relative z-10 flex flex-col gap-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-tech text-xs uppercase tracking-[0.4em] text-aether-cyan/60 group-hover:text-aether-cyan transition-colors">ALGORITHM_ID: {list.id.slice(0,4)}</p>
                        <h2 className="text-2xl font-header text-white mt-1 group-hover:text-aether-cyan transition-colors">{list.title}</h2>
                        <p className="text-sm text-aether-mint/60 font-tech tracking-wide mt-1">NODES: {list.items.length}</p>
                      </div>
                      <span className="rounded border border-aether-cyan/20 px-2 py-1 text-[10px] font-tech uppercase tracking-widest text-aether-cyan/70 bg-aether-cyan/5">
                        UPDATED: {new Intl.DateTimeFormat('zh-TW', { month: '2-digit', day: '2-digit' }).format(list.updatedAt)}
                      </span>
                    </div>
                    
                    {list.items.length > 0 ? (
                      <div className="flex flex-wrap gap-2 text-xs text-white/80">
                        {list.items.slice(0, 6).map((item) => (
                          <span key={item.id} className="rounded border border-aether-cyan/10 bg-aether-cyan/5 px-3 py-1 font-sans">
                            {item.label} <span className="text-aether-cyan/60 text-[10px]">x{item.weight}</span>
                          </span>
                        ))}
                        {list.items.length > 6 && <span className="text-aether-cyan/40 self-center">...</span>}
                      </div>
                    ) : (
                      <p className="text-sm text-aether-mint/40 italic">空模組 - 等待參數輸入</p>
                    )}
                    
                    <div className="flex flex-wrap gap-3 pt-2 border-t border-aether-cyan/10">
                      <Link
                        className="flex-1 text-center border border-aether-cyan/30 px-4 py-2 font-tech text-xs uppercase tracking-[0.2em] text-aether-cyan transition hover:bg-aether-cyan/10 hover:border-aether-cyan"
                        href={`/dashboard/lists/${list.id}`}
                      >
                        編輯參數
                      </Link>
                      <Link
                        className="flex-1 text-center bg-aether-cyan/10 border border-aether-cyan/30 px-4 py-2 font-tech text-xs uppercase tracking-[0.2em] text-aether-cyan transition hover:bg-aether-cyan hover:text-aether-dark hover:font-bold hover:shadow-[0_0_15px_rgba(103,232,249,0.4)]"
                        href={`/modes/wheel?items=${qs}`}
                      >
                        執行運算
                      </Link>
                      <div className="flex-none">
                         <DeleteListButton listId={list.id} />
                      </div>
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
