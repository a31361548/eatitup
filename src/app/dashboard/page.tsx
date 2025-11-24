import { getAuthenticatedUser } from '@/lib/currentUser'
import { CheckInCalendar } from '@/components/CheckInCalendar'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const user = await getAuthenticatedUser()
  if (!user) redirect('/login')

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-6 border-b border-gold-500/30 pb-8">
        <div className="h-24 w-24 overflow-hidden rounded-full border-2 border-gold-500 shadow-glow-gold relative group">
          {user.avatar ? (
            <img src={user.avatar} alt={user.name || 'User'} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-4xl bg-void-900 text-gold-500">
              👤
            </div>
          )}
          <div className="absolute inset-0 rounded-full ring-2 ring-cyan-400/50 animate-pulse"></div>
        </div>
        <div>
          <h1 className="text-4xl font-heading font-bold text-transparent bg-clip-text bg-gradient-to-r from-gold-300 to-gold-600 drop-shadow-sm">
            早安，{user.name || '冒險者'}！
          </h1>
          <p className="mt-2 text-cyan-400 font-tech tracking-widest uppercase">
            系統狀態：正常運作中 | 今天想探索什麼？
          </p>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <CheckInCalendar />
        
        <div className="space-y-4">
          <div className="relative bg-void-900/50 border border-cyan-500/30 p-6 shadow-glow-blue">
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-400"></div>
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-400"></div>
            
            <h2 className="mb-4 text-xl font-heading text-cyan-400 tracking-wider">快速傳送</h2>
            <div className="grid gap-4">
              <a href="/modes/wheel" className="block border border-white/10 bg-white/5 p-4 text-center text-mythril-200 transition-all hover:bg-cyan-900/20 hover:border-cyan-400 hover:text-cyan-300 font-tech tracking-widest uppercase clip-path-slant">
                🎡 命運轉盤 (Wheel Mode)
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
