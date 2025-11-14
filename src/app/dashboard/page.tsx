import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/authOptions'
import { PageShell } from '@/components/ui/PageShell'
import { GlowCard } from '@/components/ui/GlowCard'

const actions = [
  {
    title: '轉盤模式',
    description: '帶著動態轉盤一起開會或聚餐，讓選擇更有儀式感。',
    icon: '🎡',
    href: '/modes/wheel'
  },
  {
    title: '抽籤模式',
    description: '快速抽一個結果，適合手機上快速決定午餐與點心。',
    icon: '🎟️',
    href: '/modes/draw'
  },
  {
    title: '管理清單',
    description: '建立多組候選、維護權重與排序，全部雲端同步。',
    icon: '🗂️',
    href: '/lists'
  }
]

export default async function Dashboard(): Promise<React.ReactElement> {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')
  return (
    <PageShell className="space-y-10">
      <header className="space-y-3 text-white">
        <p className="text-sm uppercase tracking-[0.3em] text-white/50">Dashboard</p>
        <h1 className="text-3xl font-semibold">選擇你想要的抽選方式</h1>
        <p className="text-white/70">Wheel 與 Draw 兩個模式可以自由切換，所有資料都會沿用同一份清單。</p>
      </header>
      <div className="grid gap-6 md:grid-cols-3">
        {actions.map((action) => (
          <GlowCard
            key={action.title}
            title={action.title}
            description={action.description}
            icon={action.icon}
            actions={
              <Link
                className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-lg shadow-white/40"
                href={action.href}
              >
                前往
              </Link>
            }
          />
        ))}
      </div>
    </PageShell>
  )
}
