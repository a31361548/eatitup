import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'

import { LogoutButton } from '@/components/LogoutButton'

export async function Navbar(): Promise<React.ReactElement> {
  const session = await getServerSession(authOptions)
  return (
    <header className="fixed inset-x-0 top-0 z-20 border-b border-white/5 bg-slate-950/80 px-3 backdrop-blur-xl">
      <nav className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-3 px-3 py-4 text-sm sm:flex-nowrap sm:justify-between sm:px-6">
        <Link href="/" className="text-base font-semibold tracking-tight text-white sm:text-lg">
          吃什麼選擇器
        </Link>
        <div className="flex w-full flex-wrap items-center justify-end gap-2 sm:w-auto sm:flex-nowrap sm:gap-3">
          {session ? (
            <>
              {session.user?.role === 'ADMIN' && (
                <Link className="rounded-full border border-emerald-300/40 px-3 py-1.5 text-sm font-semibold text-emerald-200 hover:border-emerald-300 hover:text-white sm:block sm:px-4" href="/admin/members">
                  管理成員
                </Link>
              )}
              <Link className="rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 px-4 py-2 text-sm font-semibold text-slate-900 shadow-lg shadow-emerald-500/30 sm:px-5" href="/dashboard">
                會員中心
              </Link>
              <LogoutButton />
            </>
          ) : (
            <Link className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-lg shadow-white/30 sm:px-5" href="/login">
              登入
            </Link>
          )}
        </div>
      </nav>
    </header>
  )
}
