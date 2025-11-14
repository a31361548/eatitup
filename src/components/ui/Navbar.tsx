import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'

export async function Navbar(): Promise<React.ReactElement> {
  const session = await getServerSession(authOptions)
  return (
    <header className="fixed inset-x-0 top-0 z-20 border-b border-white/5 bg-slate-950/60 backdrop-blur-xl">
      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4 text-sm">
        <Link href="/" className="font-semibold tracking-tight text-white">
          吃什麼選擇器
        </Link>
        <div className="flex items-center gap-3">
          <Link className="rounded-full border border-white/10 px-4 py-1.5 text-white/80 transition hover:border-white/30 hover:text-white" href="/modes/wheel">
            先試玩
          </Link>
          {session ? (
            <>
              {session.user?.role === 'ADMIN' && (
                <Link className="rounded-full border border-emerald-300/40 px-4 py-1.5 text-sm font-semibold text-emerald-200 hover:border-emerald-300 hover:text-white" href="/admin/members">
                  管理成員
                </Link>
              )}
              <Link className="rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 px-5 py-2 text-sm font-semibold text-slate-900 shadow-lg shadow-emerald-500/30" href="/dashboard">
                開啟儀表板
              </Link>
            </>
          ) : (
            <Link className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-slate-900 shadow-lg shadow-white/30" href="/login">
              登入
            </Link>
          )}
        </div>
      </nav>
    </header>
  )
}
