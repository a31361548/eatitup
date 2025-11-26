import { getAuthenticatedUser } from '@/lib/currentUser'
import { CheckInCalendar } from '@/components/CheckInCalendar'
import { PageShell } from '@/components/ui/PageShell'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const user = await getAuthenticatedUser()
  if (!user) redirect('/login')

  return (
    <PageShell className="space-y-8">
      <div className="pixel-panel relative flex flex-col gap-6 border-4 border-aether-teal bg-aether-dark/90 p-6 text-aether-cyan shadow-pixel-card lg:flex-row lg:items-center">
        <div className="pixel-border h-28 w-28 border-4 border-aether-teal bg-aether-dim/50">
          {user.avatar ? (
            <img src={user.avatar} alt={user.name || 'User'} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-4xl">👤</div>
          )}
        </div>
        <div className="space-y-3 font-pixel">
          <p className="text-pixel-xs uppercase tracking-pixel-wider text-aether-mint/70">NEO-RETRO CONTROL NODE</p>
          <h1 className="font-heading text-3xl text-white tracking-pixel-wide">
            早安，{user.name || '冒險者'}！
          </h1>
          <p className="text-pixel-sm uppercase tracking-pixel-wider text-aether-cyan/80">
            系統狀態：正常運作中 | 今天想探索什麼？
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <div className="pixel-panel border-4 border-aether-cyan bg-[#031f1f]/95 p-6 shadow-pixel-card">
          <h2 className="font-heading text-2xl text-white">任務中心</h2>
          <p className="mt-2 font-pixel text-pixel-sm uppercase tracking-pixel-wide text-aether-mint/60">
            快速檢視今日任務與傳送點
          </p>
          <div className="mt-6 grid gap-3 font-pixel text-pixel-sm uppercase tracking-pixel-wide">
            <a
              href="/modes/wheel"
              className="border-2 border-aether-teal px-4 py-3 text-center text-aether-teal transition hover:bg-aether-teal hover:text-aether-dark"
            >
              🎡 命運轉盤 (Wheel Mode)
            </a>
            <a
              href="/dashboard/todos"
              className="border-2 border-aether-cyan px-4 py-3 text-center text-aether-cyan transition hover:bg-aether-cyan hover:text-aether-dark"
            >
              控制室
            </a>
          </div>
        </div>

        <CheckInCalendar />
      </div>
    </PageShell>
  )
}
