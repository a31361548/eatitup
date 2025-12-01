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
  
  if (pathname === '/') return null
  
  const currentUser = session?.user ?? user
  const isAdmin = currentUser?.role === 'ADMIN'
  const playerName = currentUser?.name || 'USER'
  const coins = String(currentUser?.coins ?? 0).padStart(4, '0')

  return (
    <header className="sticky top-0 z-50 border-b border-aether-cyan/30 bg-[#020d0d]/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-3 font-pixel text-pixel-sm uppercase tracking-pixel-wider text-aether-mint/70">
        <div className="flex flex-wrap items-center justify-between gap-3 text-aether-cyan">
          <Link href={currentUser ? '/dashboard/home' : '/'} className="flex items-center gap-3 text-pixel-lg tracking-pixel-widest">
            <span className="h-2.5 w-2.5 bg-aether-teal shadow-[0_0_12px_rgba(45,212,191,0.8)] animate-pulse" />
            <span>
              AETHER<span className="text-aether-gold">SYS</span>
            </span>
          </Link>
          <div className="flex items-center gap-2 text-[10px] tracking-[0.35em] text-aether-mint/70">
            <span className="flex items-center gap-2 text-white">
              <span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_12px_rgba(45,212,191,0.8)] animate-ping" aria-hidden />
              SYSTEM ONLINE
            </span>
            <span className="hidden sm:inline-flex h-px w-16 bg-gradient-to-r from-transparent via-aether-cyan/50 to-transparent" aria-hidden />
            <span className="hidden sm:inline-flex text-aether-cyan/70">SCAN READY</span>
          </div>
        </div>

        <div className="flex flex-col gap-2 text-white sm:flex-row sm:items-center sm:justify-between">
          {currentUser ? (
            <>
              <div className="flex flex-1 items-center gap-3 rounded-xl border border-aether-cyan/30 bg-[#052828]/70 px-3 py-2">
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-aether-cyan/60 bg-black/40">
                  {currentUser.avatar ? (
                    <img src={currentUser.avatar} alt="avatar" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-lg text-aether-cyan">👤</div>
                  )}
                  <span className="absolute -bottom-1 -right-1 h-2.5 w-2.5 rounded-full border border-[#041c1c] bg-aether-teal shadow-[0_0_10px_rgba(45,212,191,0.9)] animate-blink" />
                </div>
                <div className="flex flex-1 flex-wrap items-center gap-3 text-[11px] tracking-[0.3em] text-aether-mint/80">
                  <span className="text-xs text-aether-mint/50">PLAYER</span>
                  <span className="rounded border border-white/10 px-2 py-0.5 text-white/80">{playerName}</span>
                  <span className="hidden h-3 w-px bg-aether-cyan/40 sm:block" aria-hidden />
                  <span className="text-xs text-aether-mint/50">COINS</span>
                  <span className="text-pixel-xl tracking-pixel-tight text-aether-gold">{coins}</span>
                </div>
              </div>
              <div className="flex flex-1 items-center justify-end gap-2 text-pixel-sm">
                {isAdmin && (
                  <Link
                    href="/admin/members"
                    className="inline-flex min-w-[96px] justify-center border border-aether-cyan px-3 py-2 text-center tracking-pixel-wider text-aether-cyan transition hover:bg-aether-cyan hover:text-aether-dark"
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
                className="border border-aether-teal px-5 py-2 text-aether-teal transition hover:bg-aether-teal hover:text-aether-dark"
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
