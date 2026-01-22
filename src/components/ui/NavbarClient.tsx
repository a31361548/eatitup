'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LogoutButton } from '@/components/LogoutButton'
import { Session } from 'next-auth'
import { useSession } from 'next-auth/react'

interface NavbarClientProps {
  user: Session['user'] | undefined
}

export function NavbarClient({ user }: NavbarClientProps): React.ReactElement | null {
  const pathname = usePathname()
  const { data: session } = useSession()
  
  if (pathname === '/' || pathname.startsWith('/dashboard') || pathname.startsWith('/admin')) return null

  
  const currentUser = session?.user ?? user
  const isAdmin = currentUser?.role === 'ADMIN'
  const playerName = currentUser?.name || 'USER'
  const coins = String(currentUser?.coins ?? 0).padStart(4, '0')

  return (
    <header className="sticky top-0 z-50 depth-hud border-b-0 border-b-samurai-blue/20">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-3 font-tech text-sm uppercase tracking-wider text-samurai-text/70">

        <div className="flex flex-wrap items-center justify-between gap-3 text-samurai-blue">
          <Link href={currentUser ? '/dashboard' : '/'} className="flex items-center gap-3 text-lg tracking-widest group">

            <span className="h-2.5 w-2.5 bg-samurai-red shadow-[0_0_12px_rgba(244,63,94,0.8)] animate-pulse group-hover:bg-white transition-colors" />
            <span className="text-white group-hover:text-samurai-red transition-colors">
              AETHER<span className="text-samurai-red">.SYS</span>
            </span>
          </Link>
          <div className="flex items-center gap-2 text-[10px] tracking-[0.35em] text-samurai-text/50">
            <span className="flex items-center gap-2 text-samurai-blue">
              <span className="h-2 w-2 rounded-full bg-samurai-blue shadow-[0_0_12px_rgba(59,130,246,0.8)] animate-ping" aria-hidden />
              SYSTEM ONLINE
            </span>
            <span className="hidden sm:inline-flex h-px w-16 bg-gradient-to-r from-transparent via-samurai-blue/50 to-transparent" aria-hidden />
            <span className="hidden sm:inline-flex text-samurai-blue/70">SCAN READY</span>
          </div>
        </div>

        <div className="flex flex-col gap-2 text-white sm:flex-row sm:items-center sm:justify-between">
          {currentUser ? (
            <>
              <div className="flex flex-1 items-center gap-3 rounded-xl border border-samurai-blue/30 bg-samurai-dim/70 px-3 py-2 transition-colors hover:border-samurai-blue/60">

                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-samurai-blue/60 bg-black/40">
                  {currentUser.avatar ? (
                    <img src={currentUser.avatar} alt="avatar" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-lg text-samurai-blue">👤</div>
                  )}
                  <span className="absolute -bottom-1 -right-1 h-2.5 w-2.5 rounded-full border border-samurai-dark bg-samurai-red shadow-[0_0_10px_rgba(244,63,94,0.9)] animate-blink" />
                </div>
                <div className="flex flex-1 flex-wrap items-center gap-3 text-[11px] tracking-[0.3em] text-samurai-text/80">
                  <span className="text-xs text-samurai-text/50">PLAYER</span>
                  <span className="rounded border border-white/10 px-2 py-0.5 text-white/90 bg-white/5">{playerName}</span>
                  <span className="hidden h-3 w-px bg-samurai-blue/40 sm:block" aria-hidden />
                  <span className="text-xs text-samurai-text/50">COINS</span>
                  <span className="text-xl tracking-tight text-samurai-yellow font-bold drop-shadow-[0_0_5px_rgba(250,204,21,0.5)]">{coins}</span>
                </div>
              </div>
              <div className="flex flex-1 items-center justify-end gap-2 text-sm">
                {isAdmin && (
                  <Link
                    href="/admin/members"
                    className="inline-flex min-w-[96px] justify-center border border-samurai-red px-3 py-2 text-center tracking-wider text-samurai-red transition hover:bg-samurai-red hover:text-white"
                  >
                    ADMIN
                  </Link>
                )}
                <LogoutButton />
              </div>
            </>
          ) : (
            <div className="flex w-full items-center justify-end">
              <Link
                href="/"
                className="border border-samurai-red px-5 py-2 text-samurai-red transition hover:bg-samurai-red hover:text-white hover:shadow-[0_0_20px_rgba(244,63,94,0.4)]"
              >
                LOGIN
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
