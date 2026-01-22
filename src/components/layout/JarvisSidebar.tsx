'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LogoutButton } from '@/components/LogoutButton'
import clsx from 'clsx'

const SIDEBAR_ITEMS = [
  { 
    title: 'HOME', 
    href: '/dashboard',
    icon: '⌂'
  },
  { 
    title: 'MISSIONS', 
    href: '/dashboard/todos',
    icon: '⚔'
  },
  { 
    title: 'ARCHIVES', 
    href: '/dashboard/notes',
    icon: '▥'
  },
  { 
    title: 'ORACLE', 
    href: '/dashboard/oracle',
    icon: '◎'
  },
  { 
    title: 'SCROLLS', 
    href: '/dashboard/lists',
    icon: '📜'
  },
  { 
    title: 'SQUAD', 
    href: '/admin/members',
    icon: '👥'
  },
]

export function JarvisSidebar() {
  const pathname = usePathname()

  return (
    <>
    <nav className="fixed left-0 top-14 bottom-0 z-40 hidden w-20 flex-col items-center border-r border-samurai-blue/20 bg-samurai-dark/95 py-6 backdrop-blur-sm lg:flex">
      <div className="flex flex-col gap-6">
        {SIDEBAR_ITEMS.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className="group relative flex items-center justify-center"
            >
              <div
                className={clsx(
                  'relative flex h-10 w-10 items-center justify-center rounded-xl text-xl transition-all duration-300',
                  isActive
                    ? 'bg-samurai-blue/10 text-samurai-blue shadow-[inset_0_0_10px_rgba(59,130,246,0.2)] border border-samurai-blue/30'
                    : 'text-samurai-blue/40 hover:bg-samurai-blue/5 hover:text-samurai-blue hover:border hover:border-samurai-blue/10'
                )}
              >
                {item.icon}
              </div>

              {/* Active Indicator Line */}
              {isActive && <div className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r bg-samurai-blue shadow-[0_0_10px_rgba(59,130,246,0.7)]" />}

              {/* Hover Tooltip */}
              <div className="pointer-events-none absolute left-full z-50 ml-4 -translate-x-2 whitespace-nowrap border border-samurai-blue/30 bg-samurai-dim px-3 py-1 font-tech text-xs tracking-widest text-samurai-blue opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                {item.title}
                <div className="absolute top-1/2 -left-4 h-[1px] w-4 bg-samurai-blue/30" />
              </div>
            </Link>
          )
        })}
      </div>

      <div className="mt-auto flex flex-col gap-6">
        {/* Settings Link */}
        <Link href="/dashboard/settings" className="group relative flex items-center justify-center">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl text-xl text-samurai-text/40 transition-all duration-300 hover:text-white">
            ⚙
          </div>
          <div className="pointer-events-none absolute left-full z-50 ml-4 -translate-x-2 whitespace-nowrap border border-samurai-text/30 bg-samurai-dim px-3 py-1 font-tech text-xs tracking-widest text-samurai-text opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
            SETTINGS
          </div>
        </Link>
        
        {/* Logout */}
        <div className="group relative flex items-center justify-center pb-4">
          <LogoutButton />
          <div className="pointer-events-none absolute left-full z-50 ml-4 -translate-x-2 whitespace-nowrap border border-red-500/30 bg-samurai-dim px-3 py-1 font-tech text-xs tracking-widest text-red-400 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
            DISCONNECT
          </div>
        </div>
      </div>
    </nav>

    {/* Mobile Bottom Nav */}
    <nav className="fixed bottom-4 left-1/2 z-40 flex w-[calc(100%-2rem)] max-w-[460px] -translate-x-1/2 items-center justify-between rounded-3xl border border-samurai-blue/20 bg-samurai-dim/90 px-3 py-2 text-[10px] font-tech tracking-[0.2em] text-white/60 shadow-[0_20px_60px_rgba(0,0,0,0.7)] backdrop-blur lg:hidden">
      {SIDEBAR_ITEMS.map((item) => {
        const isActive = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            className={clsx(
              'flex h-10 w-10 items-center justify-center rounded-full transition-all',
              isActive ? 'border-samurai-blue/80 bg-samurai-blue/10 text-samurai-blue shadow-[0_0_15px_rgba(59,130,246,0.3)]' : 'border-white/10 bg-white/5 text-white/60'
            )}
          >
            <span className="text-lg">{item.icon}</span>
          </Link>
        )
      })}
      <Link
          href="/dashboard/settings"
          className={clsx(
            'flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/60 transition-all',
            pathname === '/dashboard/settings' && 'border-samurai-blue/80 bg-samurai-blue/10 text-samurai-blue'
          )}
      >
          <span className="text-lg">⚙</span>
      </Link>
    </nav>
    </>
  )
}
