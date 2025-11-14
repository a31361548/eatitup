import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import { PageShell } from '@/components/ui/PageShell'
import { GlowCard } from '@/components/ui/GlowCard'
import { HeroShowcase } from '@/components/ui/HeroShowcase'

const features = [
  {
    title: '自訂清單',
    description: '午餐、聚餐、團隊下午茶都可以建立獨立清單，隨時增刪候選項目。',
    icon: '🗂️'
  },
  {
    title: '雙模式抽選',
    description: '轉盤與抽籤畫面皆具備動畫效果，可自由切換，也能帶入既有清單。',
    icon: '🎡'
  },
  {
    title: '即時同步',
    description: '雲端儲存於 MongoDB，登入即可看到所有清單與歷史項目，不怕換裝置。',
    icon: '☁️'
  }
]

export default async function Home(): Promise<React.ReactElement> {
  const session = await getServerSession(authOptions)
  return (
    <PageShell className="space-y-16 text-white">
      <section className="grid items-center gap-12 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <div className="space-y-8">
          <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1 text-sm text-emerald-200">
            <span className="text-base">✨</span> 幫你把「吃什麼」變成好玩的儀式
          </p>
          <div className="space-y-6">
            <h1 className="text-4xl font-semibold leading-tight text-white md:text-5xl">
              建立自己的口袋清單，
              <span className="text-emerald-300"> 用動畫轉盤或抽籤 </span>
              秒決今晚的選擇。
            </h1>
            <p className="text-lg text-white/70">
              EatWhat 讓團隊與家人一起參與選擇。建立多個清單、為每個項目設定權重，還有視覺化的抽選過程，讓每一次決定都充滿期待。
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            {session ? (
              <Link className="rounded-full bg-gradient-to-r from-emerald-400 via-cyan-300 to-sky-400 px-6 py-3 text-base font-semibold text-slate-900 shadow-lg shadow-emerald-500/30" href="/dashboard">
                前往儀表板
              </Link>
            ) : (
              <>
                <Link className="rounded-full bg-gradient-to-r from-emerald-400 via-cyan-300 to-sky-400 px-6 py-3 text-base font-semibold text-slate-900 shadow-lg shadow-emerald-500/30" href="/login">
                  由管理員登入
                </Link>
                <span className="rounded-full border border-white/20 px-6 py-3 text-base font-semibold text-white/70">
                  請聯絡管理員開通帳號
                </span>
              </>
            )}
            <Link className="inline-flex items-center gap-2 text-white/70 hover:text-white" href="/modes/wheel">
              先試玩轉盤
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
        <HeroShowcase />
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {features.map((feature) => (
          <GlowCard key={feature.title} title={feature.title} description={feature.description} icon={feature.icon} />
        ))}
      </section>
    </PageShell>
  )
}
