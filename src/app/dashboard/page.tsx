import { getAuthenticatedUser } from '@/lib/currentUser'
import { CheckInCalendar } from '@/components/CheckInCalendar'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const user = await getAuthenticatedUser()
  if (!user) redirect('/login')

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-6 rounded-3xl border border-white/10 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 p-8">
        <div className="h-24 w-24 overflow-hidden rounded-full border-4 border-white/20 bg-white/10">
          {user.avatar ? (
            <img src={user.avatar} alt={user.name || 'User'} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-4xl">
              👤
            </div>
          )}
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">
            早安，{user.name || '美食家'}！
          </h1>
          <p className="mt-2 text-white/60">
            今天想吃點什麼呢？
          </p>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <CheckInCalendar />
        
        <div className="space-y-4">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="mb-4 text-xl font-semibold text-white">快速開始</h2>
            <div className="grid gap-4">
              <a href="/modes/wheel" className="block rounded-xl bg-white/5 p-4 text-center text-white transition-colors hover:bg-white/10">
                🎡 轉盤模式
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
