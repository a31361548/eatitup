import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/authOptions'
import { PageShell } from '@/components/ui/PageShell'
import ItemForm from './ui/ItemForm'
import ItemRow from './ui/ItemRow'
import ListTitleEditor from './ui/ListTitleEditor'

export default async function ListDetail({ params }: { params: { id: string } }): Promise<React.ReactElement> {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) notFound()
  const list = await prisma.list.findUnique({ where: { id: params.id }, include: { items: true } })
  if (!list) notFound()
  const expanded = list.items.flatMap((item) => Array.from({ length: item.weight }, () => item.label))
  const hasItems = expanded.length > 0
  const qs = hasItems ? encodeURIComponent(expanded.join(',')) : ''

  return (
    <PageShell className="relative space-y-8 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-cyan-500/10 via-transparent to-gold-500/10" />
      <div className="pointer-events-none absolute inset-0 bg-tech-grid-overlay opacity-10" />
      <section className="relative z-10 flex flex-col gap-6">
        <div className="rounded-[32px] border border-cyan-500/30 bg-void-900/70 p-6 shadow-glow-blue">
          <ListTitleEditor listId={list.id} initialTitle={list.title} />
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <p className="font-tech text-xs uppercase tracking-[0.4em] text-cyan-400/70">卷軸資訊</p>
              <p className="mt-2 text-sm text-white/60">項目數：{list.items.length}</p>
              <p className="text-xs text-white/40">更新：{new Intl.DateTimeFormat('zh-TW', { dateStyle: 'medium', timeStyle: 'short' }).format(list.updatedAt)}</p>
            </div>
            <div className="flex flex-col gap-4 rounded-2xl border border-gold-500/30 bg-black/20 p-4">
              <div>
                <p className="font-tech text-xs uppercase tracking-[0.4em] text-gold-400/70">命運觸發</p>
                <p className="mt-2 text-sm text-white/70">
                  {hasItems ? '準備就緒，立刻送入命運之輪。' : '目前尚無素材，請先新增選項。'}
                </p>
              </div>
              <Link
                className="clip-path-slant bg-gradient-to-r from-cyan-500/40 to-gold-400/40 px-4 py-2 text-center font-tech text-xs uppercase tracking-[0.3em] text-white transition hover:shadow-glow-gold aria-disabled:opacity-40 aria-disabled:cursor-not-allowed"
                href={hasItems ? `/modes/wheel?items=${qs}` : '#'}
                aria-disabled={!hasItems}
              >
                投入命運之輪
              </Link>
            </div>
          </div>
        </div>
        <div className="rounded-[32px] border border-white/15 bg-void-900/60 p-6 shadow-[0_0_25px_rgba(0,0,0,0.45)]">
          <h2 className="text-2xl font-heading text-white mb-4">刻寫素材</h2>
          <ItemForm listId={list.id} />
        </div>
        <div className="rounded-[32px] border border-white/10 bg-black/30 p-6 shadow-inner">
          <h2 className="text-2xl font-heading text-white mb-4">卷軸內容</h2>
          {list.items.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/20 p-10 text-center text-white/70">
              尚無項目，使用上方表單刻入第一個選項吧！
            </div>
          ) : (
            <ul className="space-y-3">
              {list.items.map((item) => (
                <ItemRow key={item.id} item={{ id: item.id, label: item.label, weight: item.weight }} />
              ))}
            </ul>
          )}
        </div>
      </section>
    </PageShell>
  )
}
