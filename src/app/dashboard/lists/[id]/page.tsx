import { notFound } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/authOptions'
import { PageShell } from '@/components/ui/PageShell'
import { GlowCard } from '@/components/ui/GlowCard'
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
    <PageShell className="space-y-10">
      <section className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <div className="space-y-6">
          <ListTitleEditor listId={list.id} initialTitle={list.title} />
          <GlowCard
            title="快速抽選"
            description="直接帶入動畫轉盤或抽籤畫面。"
            actions={
              <>
                <a
                  className="rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-slate-900 aria-disabled:cursor-not-allowed aria-disabled:opacity-60"
                  href={hasItems ? `/modes/wheel?items=${qs}` : '#'}
                  aria-disabled={!hasItems}
                >
                  轉盤模式
                </a>
                <a
                  className="rounded-full border border-white/40 px-4 py-1.5 text-sm text-white/80 aria-disabled:cursor-not-allowed aria-disabled:opacity-60"
                  href={hasItems ? `/modes/draw?items=${qs}` : '#'}
                  aria-disabled={!hasItems}
                >
                  抽籤模式
                </a>
              </>
            }
          >
            <p className="text-sm text-white/60">
              {list.items.length > 0 ? `目前共有 ${list.items.length} 個項目，權重會影響抽選機率。` : '尚未新增候選項目，請先建立內容後再抽選。'}
            </p>
          </GlowCard>
          <ItemForm listId={list.id} />
          <ul className="space-y-3">
            {list.items.map((item) => (
              <ItemRow key={item.id} item={{ id: item.id, label: item.label, weight: item.weight }} />
            ))}
          </ul>
        </div>
        <div className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-6 text-white/80">
          <h3 className="text-lg font-semibold text-white">使用建議</h3>
          <p>・將清單依照場景拆分，可快速切換情境。</p>
          <p>・可利用權重為熱門選項多加幾票，提高抽中機率。</p>
          <p>・變更會立即更新，轉盤與抽籤頁面不需重新整理。</p>
        </div>
      </section>
    </PageShell>
  )
}
