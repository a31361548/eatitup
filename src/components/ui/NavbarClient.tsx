'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LogoutButton } from '@/components/LogoutButton'
import { Session } from 'next-auth'

interface NavbarClientProps {
  user: Session['user'] | undefined
}

export function NavbarClient({ user }: NavbarClientProps): React.ReactElement | null {
  const pathname = usePathname()
  if (pathname === '/') return null

  return (
    <header className="sticky top-0 z-50 border-b-4 border-aether-teal bg-[#031f1f]/95 shadow-hud relative">
      {/* 像素裝飾角 */}
      <div className="absolute bottom-0 left-0 w-3 h-3 bg-aether-teal" />
      <div className="absolute bottom-0 right-0 w-3 h-3 bg-aether-teal" />
      
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 font-pixel text-pixel-sm uppercase tracking-pixel-wider text-aether-mint/60">
        <Link href={user ? '/dashboard/home' : '/'} className="flex items-center gap-3 text-aether-cyan text-pixel-xl tracking-pixel-widest">
          <span className="h-3 w-3 bg-aether-teal animate-pulse" />
          AETHER<span className="text-aether-gold">SYS</span>
        </Link>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <div className="hidden md:flex items-center gap-3 border-2 border-aether-teal bg-[#052828] px-4 py-2 shadow-[4px_4px_0_rgba(4,28,28,0.8)]">
                <div className="relative">
                  {user.avatar ? (
                    <img src={user.avatar} alt="avatar" className="h-8 w-8 border-2 border-aether-cyan object-cover" />
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center border-2 border-aether-cyan">👤</div>
                  )}
                  <span className="absolute -bottom-1 -right-1 h-2 w-2 rounded-full bg-aether-teal animate-blink" />
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="text-aether-teal text-pixel-sm">PLAYER</span>
                  <span className="text-pixel-lg text-aether-cyan">{user.name || 'USER'}</span>
                </div>
                <div className="h-8 w-[1px] bg-aether-teal/40" />
                <div className="flex flex-col text-right leading-tight text-aether-gold">
                  <span className="text-pixel-sm">COINS</span>
                  <span className="text-pixel-2xl tracking-pixel-tight">{String(user.coins ?? 0).padStart(4, '0')}</span>
                </div>
              </div>

              {user.role === 'ADMIN' && (
                <Link
                  href="/admin/members"
                  className="hidden sm:inline-flex border-2 border-aether-cyan px-3 py-2 tracking-pixel-wider text-aether-cyan hover:bg-aether-cyan hover:text-aether-dark transition"
                >
                  ADMIN
                </Link>
              )}

              <LogoutButton />
            </>
          ) : (
            <Link
              href="/"
              className="border-2 border-aether-teal px-4 py-2 text-aether-teal hover:bg-aether-teal hover:text-aether-dark transition"
            >
              LOGIN
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
